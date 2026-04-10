import { Router } from "express";
import prisma from "../../lib/db";
import { detectLang, type PublicRequest } from "../middleware/detectLang";

const router = Router();
router.use(detectLang);

router.get("/images/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const image = await prisma.obrazky.findUnique({
      where: { id },
      select: {
        data: true,
      },
    });

    if (!image || !image.data) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Content-Type", "image/webp");

    res.send(Buffer.from(image.data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load image" });
  }
});
export default router;
