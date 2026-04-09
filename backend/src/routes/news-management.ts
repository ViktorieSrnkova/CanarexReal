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

router.get("/admin-all", async (req: AuthRequest, res) => {
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
          select: {
            id: true,
          },
          take: 1, // jen hlavní obrázek
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
      { title?: string; text?: string },
    ][]) {
      if (!t?.title && !t?.text) continue;
      const jazyky_id = langIdMap[langCode];
      if (!jazyky_id) continue;

      await prisma.aktuality_preklady.create({
        data: {
          titulek: t.title ?? "",
          text: t.text ?? "",
          jazyky_id,
          aktuality_id: aktualita.id,
        },
      });
      if (!t.text) continue;
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
          data: mainBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
          url: "",
        },
      });

      await prisma.obrazky.update({
        where: { id: fullImage.id },
        data: {
          url: `/api/files/images/${fullImage.id}`,
        },
      });

      const thumbImage = await prisma.obrazky.create({
        data: {
          data: thumbBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
          url: "",
        },
      });

      await prisma.obrazky.update({
        where: { id: thumbImage.id },
        data: {
          url: `/api/files/images/${thumbImage.id}`,
        },
      });

      for (const [langCode, altText] of Object.entries(altTextsObj) as [
        string,
        string,
      ][]) {
        if (!altText) continue;
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

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // 🔹 najdi všechny obrázky k aktualitě
    const images = await prisma.obrazky.findMany({
      where: { aktuality_id: id },
      select: { id: true },
    });

    // 🔹 nastav je na temp
    if (images.length) {
      await prisma.obrazky.updateMany({
        where: { aktuality_id: id },
        data: {
          is_temp: true,
          aktuality_id: null,
        },
      });
    }

    // 🔹 smaž aktualitu (cascade se postará o zbytek)
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

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { visible, translations, altTexts } = req.body;
    const file = req.file;

    if (!visible || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const translationsObj = JSON.parse(translations);
    const altTextsObj = altTexts ? JSON.parse(altTexts) : {};

    const langIdMap: Record<string, number> = { cs: 2, en: 1, sk: 3 };

    // =========================
    // 🧹 1. RESET STARÝ STAV
    // =========================

    // 🔹 všechny obrázky odpoj a nastav temp
    await prisma.obrazky.updateMany({
      where: { aktuality_id: id },
      data: {
        is_temp: true,
        aktuality_id: null,
      },
    });

    // 🔹 smaž všechny překlady
    await prisma.aktuality_preklady.deleteMany({
      where: { aktuality_id: id },
    });

    // 🔹 update visibility
    const aktualita = await prisma.aktuality.update({
      where: { id },
      data: {
        viditelnost: visible === "true",
      },
    });

    // =========================
    // ✏️ 2. VYTVOŘ ZNOVU PŘEKLADY (stejně jako CREATE)
    // =========================
    for (const [langCode, t] of Object.entries(translationsObj) as [
      string,
      { title?: string; text?: string },
    ][]) {
      if (!t?.title && !t?.text) continue;

      const jazyky_id = langIdMap[langCode];
      if (!jazyky_id) continue;

      await prisma.aktuality_preklady.create({
        data: {
          titulek: t.title ?? "",
          text: t.text ?? "",
          jazyky_id,
          aktuality_id: id,
        },
      });

      if (!t.text) continue;

      const parsed = JSON.parse(t.text);

      for (const block of parsed.blocks || []) {
        if (block.type === "image" && block.data?.file?.id) {
          const imageId = block.data.file.id;
          const caption = block.data.caption || null;

          // 🔹 znovu přiřaď obrázek k aktualitě
          await prisma.obrazky.update({
            where: { id: imageId },
            data: {
              is_temp: false,
              aktuality_id: id,
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

    // =========================
    // 🖼️ 3. HLAVNÍ OBRÁZEK (replace)
    // =========================
    if (file) {
      const mainBufferNode = await convertBufferToWebP(file.buffer);
      const thumbBufferNode = await convertBufferToThumbnail(file.buffer);

      const mainBuffer = new Uint8Array(mainBufferNode);
      const thumbBuffer = new Uint8Array(thumbBufferNode);

      const fullImage = await prisma.obrazky.create({
        data: {
          data: mainBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
          url: "",
        },
      });

      await prisma.obrazky.update({
        where: { id: fullImage.id },
        data: {
          url: `/api/files/images/${fullImage.id}`,
        },
      });

      const thumbImage = await prisma.obrazky.create({
        data: {
          data: thumbBuffer,
          is_temp: false,
          aktuality_id: aktualita.id,
          url: "",
        },
      });

      await prisma.obrazky.update({
        where: { id: thumbImage.id },
        data: {
          url: `/api/files/images/${thumbImage.id}`,
        },
      });

      // 🔹 alt texty
      for (const [langCode, altText] of Object.entries(altTextsObj) as [
        string,
        string,
      ][]) {
        if (!altText) continue;

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

    res.json({ success: true, aktuality_id: id });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update aktualita" });
  }
});
export default router;
