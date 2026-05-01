import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth.js";
import prisma from "../lib/db.js";
import type { PublicRequest } from "../middleware/detectLang.js";
import {
  convertBufferToWebP,
  convertBufferToThumbnail,
} from "../utils/thumbnailMaker.js";
import { upload } from "../middleware/uploader.js";
import { extractImageId } from "../utils/url.js";
import { parseTranslations } from "../utils/parseTranslationsHelper.js";
import { processEditorImages } from "../utils/editorImagesHelper.js";
import { processMainImage } from "../utils/mainImageHelper.js";
import { saveTranslations } from "../utils/saveTranslationsHelper.js";

const router = Router();
router.use(requireRole([1, 3]));

const langIdMap: Record<string, number> = {
  cs: 2,
  en: 1,
  sk: 3,
};

router.get("/", async (req: AuthRequest, res) => {
  try {
    const news = await prisma.aktuality.findMany({
      orderBy: {
        datum_vytvoreni: "desc",
      },
      select: {
        id: true,
        datum_vytvoreni: true,
        viditelnost: true,

        aktuality_preklady: {
          select: {
            titulek: true,
            text: true,
            jazyky_id: true,
          },
        },

        obrazky: {
          orderBy: { poradi: "asc" },
          take: 1,
          select: {
            id: true,
            poradi: true,
            obrazky_preklady: {
              select: {
                alt_text: true,
                jazyky_id: true,
              },
            },
          },
        },
      },
    });

    res.json({ news });
  } catch (err) {
    console.error("Admin news fetch error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { visible, translations } = req.body;
    const file = req.file;

    if (!visible || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const translationsObj = parseTranslations(translations);

    const aktualita = await prisma.aktuality.create({
      data: { viditelnost: visible === "true" },
    });

    await saveTranslations({
      aktualitaId: aktualita.id,
      translationsObj,
      langIdMap,
    });

    await processEditorImages({
      translationsObj,
      aktualitaId: aktualita.id,
      langIdMap,
    });

    await processMainImage({
      file,
      translationsObj,
      aktualitaId: aktualita.id,
      langIdMap,
    });

    res.json({ success: true, aktuality_id: aktualita.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create aktualita" });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { visible, translations, existingImageId } = req.body;
    const file = req.file;

    if (visible === undefined || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const translationsObj = parseTranslations(translations);
    const existingMain = await prisma.obrazky.findFirst({
      where: { aktuality_id: id, poradi: 1 },
    });

    const existingThumb = await prisma.obrazky.findFirst({
      where: { aktuality_id: id, poradi: 0 },
    });
    await prisma.obrazky.updateMany({
      where: { aktuality_id: id },
      data: { is_temp: true, aktuality_id: null },
    });

    await prisma.aktuality_preklady.deleteMany({
      where: { aktuality_id: id },
    });

    await prisma.aktuality.update({
      where: { id },
      data: { viditelnost: visible === "true" },
    });

    await saveTranslations({
      aktualitaId: id,
      translationsObj,
      langIdMap,
    });

    if (!file && (existingMain || existingThumb)) {
      const imageId = Number(existingImageId);

      await prisma.obrazky.updateMany({
        where: {
          id: {
            in: [existingMain?.id, existingThumb?.id].filter(
              Boolean,
            ) as number[],
          },
        },
        data: {
          is_temp: false,
          aktuality_id: id,
        },
      });

      for (const [langCode, t] of Object.entries(translationsObj) as any) {
        const jazyky_id = langIdMap[langCode];
        if (!jazyky_id) continue;

        await prisma.obrazky_preklady.upsert({
          where: {
            jazyky_id_obrazky_id: {
              jazyky_id,
              obrazky_id: imageId,
            },
          },
          update: { alt_text: t.alt ?? null },
          create: {
            alt_text: t.alt ?? null,
            jazyky_id,
            obrazky_id: imageId,
          },
        });
      }
    }
    await processEditorImages({
      translationsObj,
      aktualitaId: id,
      langIdMap,
    });

    await processMainImage({
      file,
      translationsObj,
      aktualitaId: id,
      langIdMap,
    });

    res.json({ success: true, aktuality_id: id });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update aktualita" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const images = await prisma.obrazky.findMany({
      where: { aktuality_id: id },
      select: { id: true },
    });

    if (images.length) {
      await prisma.obrazky.updateMany({
        where: { aktuality_id: id },
        data: {
          is_temp: true,
          aktuality_id: null,
        },
      });
    }

    await prisma.aktuality.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete aktualita" });
  }
});
router.patch("/:id/visibility", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const aktualita = await prisma.aktuality.findUnique({
      where: { id },
    });

    if (!aktualita) {
      return res.status(404).json({ error: "Not found" });
    }

    const updated = await prisma.aktuality.update({
      where: { id },
      data: { viditelnost: !aktualita.viditelnost },
    });

    res.json(updated);
  } catch (err) {
    console.error("Visibility update error FULL:", err);
    res.status(500).json({
      error: "Failed to update visibility",
      details: err instanceof Error ? err.message : err,
    });
  }
});

export default router;
