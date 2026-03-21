import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import prisma from "../../lib/db";
import type { PublicRequest } from "../middleware/detectLang";
import {
  convertBufferToWebP,
  convertBufferToThumbnail,
} from "../utils/thumbnailMaker";
import { upload } from "../middleware/uploader";

const router = Router();
router.use(requireRole([1, 3]));

router.get("/", async (req: PublicRequest, res) => {
  try {
    const news = await prisma.aktuality.findMany({
      where: {
        viditelnost: true,
      },
      orderBy: {
        datum_vytvoreni: "desc",
      },
      select: {
        id: true,
        datum_vytvoreni: true,

        aktuality_preklady: {
          where: { jazyky_id: req.userLangId ?? 2 },
          select: {
            titulek: true,
          },
          take: 1,
        },

        obrazky: {
          orderBy: { poradi: "asc" },
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    res.json({ news });
  } catch (err) {
    console.error("News thumbnails error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});

router.get("/:id", async (req: PublicRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const news = await prisma.aktuality.findFirst({
      where: {
        id,
        viditelnost: true,
      },
      select: {
        id: true,
        datum_vytvoreni: true,
        aktuality_preklady: {
          where: { jazyky_id: req.userLangId ?? 2 },
          select: {
            titulek: true,
            text: true,
          },
          take: 1,
        },
        obrazky: {
          orderBy: { poradi: "asc" },
          select: { url: true },
        },
      },
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    const formatted = {
      id: news.id,
      datum_vytvoreni: news.datum_vytvoreni,
      obrazky: news.obrazky,
      titulek: news.aktuality_preklady[0]?.titulek,
      text: news.aktuality_preklady[0]?.text,
    };

    res.json({ formatted });
  } catch (err) {
    console.error("News detail error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { visible, translations, altTexts } = req.body;
    const file = req.file;

    if (!visible || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const translationsObj = JSON.parse(translations);
    const altTextsObj = altTexts ? JSON.parse(altTexts) : {};

    const aktualita = await prisma.aktuality.create({
      data: {
        viditelnost: visible === "true",
      },
    });

    const langIdMap: Record<string, number> = { cs: 2, en: 1, sk: 3 };

    for (const [langCode, t] of Object.entries(translationsObj) as [
      string,
      { title: string; text: string },
    ][]) {
      const jazyky_id = langIdMap[langCode];
      if (!jazyky_id) continue;

      await prisma.aktuality_preklady.create({
        data: {
          titulek: t.title,
          text: t.text,
          jazyky_id,
          aktuality_id: aktualita.id,
        },
      });

      const parsed = JSON.parse(t.text);

      for (const block of parsed.blocks || []) {
        if (block.type === "image" && block.data?.file?.id) {
          const imageId = block.data.file.id;
          const caption = block.data.caption || null;
          await prisma.obrazky.update({
            where: { id: imageId },
            data: {
              is_temp: false,
              aktuality_id: aktualita.id,
            },
          });
          await prisma.obrazky_preklady.upsert({
            where: {
              jazyky_id_obrazky_id: {
                jazyky_id,
                obrazky_id: imageId,
              },
            },
            update: {
              caption,
            },
            create: {
              caption,
              alt_text: null,
              jazyky_id,
              obrazky_id: imageId,
            },
          });
        }
      }
    }

    if (file) {
      const mainBufferNode = await convertBufferToWebP(file.buffer);
      const thumbBufferNode = await convertBufferToThumbnail(file.buffer);

      const mainBuffer = new Uint8Array(mainBufferNode);
      const thumbBuffer = new Uint8Array(thumbBufferNode);

      const fullImage = await prisma.obrazky.create({
        data: {
          url: "/api/files/temp/" + aktualita.id,
          data: mainBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
        },
      });

      const thumbImage = await prisma.obrazky.create({
        data: {
          url: "/api/files/temp/" + aktualita.id + "_thumb",
          data: thumbBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
        },
      });

      for (const [langCode, altText] of Object.entries(altTextsObj) as [
        string,
        string,
      ][]) {
        const jazyky_id = langIdMap[langCode];
        if (!jazyky_id) continue;

        await prisma.obrazky_preklady.createMany({
          data: [
            { alt_text: altText, jazyky_id, obrazky_id: fullImage.id },
            { alt_text: altText, jazyky_id, obrazky_id: thumbImage.id },
          ],
        });
      }
    }

    res.json({ success: true, aktuality_id: aktualita.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create aktualita" });
  }
});
export default router;
