import { Router } from "express";
import prisma from "../../lib/db";
import { detectLang, type PublicRequest } from "../middleware/detectLang";

const router = Router();
router.use(detectLang);

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

export default router;
