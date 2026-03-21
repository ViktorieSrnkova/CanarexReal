import express from "express";
import { upload } from "../middleware/uploader";
import prisma from "../../lib/db";

const router = express.Router();

router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const buffer = file.buffer;

    const image = await prisma.obrazky.create({
      data: {
        data: Buffer.from(file.buffer),
        is_temp: true,
        url: "temp",
      },
    });

    const url = `/api/files/${image.id}`;
    await prisma.obrazky.update({
      where: { id: image.id },
      data: { url },
    });

    res.json({
      success: 1,
      file: {
        url,
        id: image.id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/files/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const image = await prisma.obrazky.findUnique({ where: { id } });
    if (!image || !image.data) return res.status(404).send("Not found");

    res.setHeader("Content-Type", "image/webp");
    res.send(image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch image");
  }
});

export default router;
