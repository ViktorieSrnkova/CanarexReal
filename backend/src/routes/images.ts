import { Router } from "express";
import prisma from "../lib/db.js";
import { detectLang } from "../middleware/detectLang.js";

const router = Router();

router.use(detectLang);

router.get("/images/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const image = await prisma.obrazky.findUnique({
      where: { id },
      select: {
        data: true,
        klic_uloziste: true,
      },
    });

    if (!image) {
      return res.status(404).send("Not found");
    }

    if (image.klic_uloziste) {
      const publicUrl = process.env.R2_PUBLIC_URL;

      if (!publicUrl) {
        throw new Error("R2_PUBLIC_URL is not configured");
      }

      const mediaUrl = `${publicUrl.replace(/\/$/, "")}/${image.klic_uloziste}`;

      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      return res.redirect(301, mediaUrl);
    }

    // Old media still stored in PostgreSQL
    if (image.data) {
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Content-Length", image.data.length);

      return res.send(Buffer.from(image.data));
    }

    return res.status(404).send("Not found");
  } catch (err) {
    console.error("Failed to load media:", err);

    return res.status(500).json({
      error: "Failed to load image",
    });
  }
});

export default router;
