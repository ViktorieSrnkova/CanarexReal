import { Router } from "express";
import prisma from "../lib/db.js";
import { detectLang, type PublicRequest } from "../middleware/detectLang.js";

const router = Router();
router.use(detectLang);

router.get("/", async (req: PublicRequest, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const langId = req.langId ?? 2;
    const [thumbnails, total] = await Promise.all([
      prisma.aktuality.findMany({
        skip,
        take: limit,
        orderBy: {
          datum_vytvoreni: "desc",
        },
        where: {
          viditelnost: true,
          ...newsWithLangWhere(langId),
        },
        select: {
          id: true,
          datum_vytvoreni: true,

          aktuality_preklady: {
            where: { jazyky_id: langId },
            select: {
              titulek: true,
            },
            take: 1,
          },

          obrazky: {
            orderBy: { poradi: "asc" },
            take: 1,
            select: {
              id: true,
              obrazky_preklady: {
                where: { jazyky_id: langId },
                take: 1,
                select: {
                  alt_text: true,
                },
              },
            },
          },
        },
      }),
      prisma.aktuality.count({
        where: {
          viditelnost: true,
          ...newsWithLangWhere(langId),
        },
      }),
    ]);

    const normalized = thumbnails.map((item) => {
      const img = item.obrazky?.[0];
      const imgTr = img?.obrazky_preklady?.[0];

      return {
        id: item.id,
        datum_vytvoreni: item.datum_vytvoreni,
        titulek: item.aktuality_preklady?.[0]?.titulek ?? null,

        image: img
          ? {
              id: img.id,
              alt: imgTr?.alt_text ?? null,
            }
          : null,
      };
    });
    res.json({ thumbnails: normalized, total });
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
          select: { id: true },
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

export function newsWithLangWhere(langId: number) {
  return {
    aktuality_preklady: {
      some: {
        jazyky_id: langId,
      },
    },
  };
}

export default router;
