import { Router } from "express";
import prisma from "../../lib/db";
import { listingThumbnailSelect } from "../../lib/prismaSelect";
import { detectLang, type PublicRequest } from "../middleware/detectLang";

const router = Router();
router.use(detectLang);

router.get("/", async (req: PublicRequest, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const thumbnails = await prisma.inzeraty.findMany({
      skip,
      take: limit,
      orderBy: { datum_vytvoreni: "desc" },
      select: listingThumbnailSelect(req.userLangId),
    });

    res.json({ thumbnails });
  } catch (err) {
    console.error("Thumbnails error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.get("/home", async (req: PublicRequest, res) => {
  try {
    const thumbnails = await prisma.inzeraty.findMany({
      where: { reprezentativni: true },
      orderBy: { datum_vytvoreni: "desc" },
      take: 6,
      select: listingThumbnailSelect(req.userLangId),
    });

    res.json({ thumbnails });
  } catch (err) {
    console.error("Thumbnails error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
  } catch (err) {
    console.error("Single listing error", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default router;
