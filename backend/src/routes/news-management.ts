import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth.js";
import prisma from "../lib/db.js";

import { parseTranslations } from "../utils/parseTranslationsHelper.js";
import {
  attachEditorImages,
  extractAllEditorMediaIds,
} from "../utils/editorImagesHelper.js";
import {
  attachMainImage,
  saveMainImageAlts,
} from "../utils/mainImageHelper.js";
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
            mime_typ: true,
            klic_uloziste: true,
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
router.post("/", async (req, res) => {
  try {
    const { visible, translations, mainImageId } = req.body;

    if (visible === undefined || !translations) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const translationsObj = parseTranslations(translations);
    const parsedMainImageId = mainImageId ? Number(mainImageId) : undefined;
    if (
      parsedMainImageId !== undefined &&
      (!Number.isInteger(parsedMainImageId) || parsedMainImageId <= 0)
    ) {
      return res.status(400).json({
        error: "Invalid mainImageId",
      });
    }
    const aktualita = await prisma.aktuality.create({
      data: { viditelnost: visible },
    });

    await saveTranslations({
      aktualitaId: aktualita.id,
      translationsObj,
      langIdMap,
    });
    const editorImageIds = extractAllEditorMediaIds(translationsObj);
    await attachEditorImages({
      mediaIds: editorImageIds,
      aktualitaId: aktualita.id,
    });
    if (parsedMainImageId) {
      await attachMainImage({
        imageId: parsedMainImageId,
        aktualitaId: aktualita.id,
      });

      await saveMainImageAlts({
        imageId: parsedMainImageId,
        translationsObj,
        langIdMap,
      });
    }

    return res.json({
      success: true,
      aktuality_id: aktualita.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create aktualita" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid ID",
      });
    }

    const { visible, translations, mainImageId, existingImageId } = req.body;

    if (visible === undefined || !translations) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const translationsObj = parseTranslations(translations);
    const parsedMainImageId = mainImageId ? Number(mainImageId) : undefined;
    if (
      parsedMainImageId !== undefined &&
      (!Number.isInteger(parsedMainImageId) || parsedMainImageId <= 0)
    ) {
      return res.status(400).json({
        error: "Invalid mainImageId",
      });
    }

    const referencedEditorMediaIds = extractAllEditorMediaIds(translationsObj);

    const parsedExistingImageId = existingImageId
      ? Number(existingImageId)
      : undefined;

    const aktualita = await prisma.aktuality.findUnique({
      where: { id },
    });

    if (!aktualita) {
      return res.status(404).json({
        error: "Aktualita not found",
      });
    }

    const currentImages = await prisma.obrazky.findMany({
      where: {
        aktuality_id: id,
      },
      select: {
        id: true,
        poradi: true,
      },
    });

    const currentMainImage = currentImages.find((image) => image.poradi === 0);

    const currentEditorImageIds = currentImages
      .filter((image) => image.poradi === null)
      .map((image) => image.id);

    await prisma.aktuality.update({
      where: { id },
      data: { viditelnost: visible },
    });

    await prisma.aktuality_preklady.deleteMany({
      where: { aktuality_id: id },
    });

    await saveTranslations({
      aktualitaId: id,
      translationsObj,
      langIdMap,
    });

    if (parsedMainImageId) {
      if (currentMainImage && currentMainImage.id !== parsedMainImageId) {
        await prisma.obrazky.update({
          where: {
            id: currentMainImage.id,
          },
          data: {
            aktuality_id: null,
            docasne: true,
            poradi: null,
          },
        });
      }

      await attachMainImage({
        imageId: parsedMainImageId,
        aktualitaId: id,
      });
    } else if (parsedExistingImageId) {
      await prisma.obrazky.update({
        where: {
          id: parsedExistingImageId,
        },
        data: {
          aktuality_id: id,
          docasne: false,
          poradi: 0,
        },
      });
    }

    await attachEditorImages({
      mediaIds: referencedEditorMediaIds,
      aktualitaId: id,
    });

    const imagesToDetach = currentEditorImageIds.filter(
      (imageId) => !referencedEditorMediaIds.includes(imageId),
    );

    if (imagesToDetach.length > 0) {
      await prisma.obrazky.updateMany({
        where: {
          id: {
            in: imagesToDetach,
          },
          aktuality_id: id,
        },
        data: {
          aktuality_id: null,
          docasne: true,
          poradi: null,
        },
      });
    }

    const finalMainImageId =
      parsedMainImageId ?? parsedExistingImageId ?? currentMainImage?.id;

    if (finalMainImageId) {
      await saveMainImageAlts({
        imageId: finalMainImageId,
        translationsObj,
        langIdMap,
      });
    }

    return res.json({
      success: true,
      aktuality_id: id,
    });
  } catch (err) {
    console.error("Update error:", err);

    res.status(500).json({
      error: "Failed to update aktualita",
    });
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
          docasne: true,
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
