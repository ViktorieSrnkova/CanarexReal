import { Router } from "express";
import prisma from "../../lib/db";
import {
  listingThumbnailSelect,
  listingDetailSelect,
  listingWithLangWhere,
} from "../../lib/prismaSelect";
import { detectLang, type PublicRequest } from "../middleware/detectLang";

const router = Router();
router.use(detectLang);

router.get("/", async (req: PublicRequest, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const langId = req.langId ?? 2;

    const [thumbnails, total] = await Promise.all([
      prisma.inzeraty.findMany({
        skip,
        take: limit,
        orderBy: { datum_vytvoreni: "desc" },
        where: listingWithLangWhere(langId),
        select: listingThumbnailSelect(langId),
      }),

      prisma.inzeraty.count({
        where: {
          inzeraty_preklady: {
            some: {
              jazyky_id: langId,
            },
          },
        },
      }),
    ]);

    res.json({
      thumbnails,
      total,
    });
  } catch (err) {
    console.error("Thumbnails error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.get("/home", async (req: PublicRequest, res) => {
  try {
    const langId = req.langId ?? 2;
    const thumbnails = await prisma.inzeraty.findMany({
      where: {
        reprezentativni: true,
        statusy_id: 1,
        inzeraty_preklady: {
          some: {
            jazyky_id: langId,
          },
        },
      },
      orderBy: { datum_vytvoreni: "desc" },
      take: 6,
      select: listingThumbnailSelect(langId),
    });

    res.json({ thumbnails });
  } catch (err) {
    console.error("Thumbnails error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});
router.get("/thumb/:id", async (req: PublicRequest, res) => {
  try {
    const id = Number(req.params.id);
    const langId = req.langId ?? 2;

    const thumb = await prisma.inzeraty.findUnique({
      where: {
        id,
        inzeraty_preklady: {
          some: {
            jazyky_id: langId,
          },
        },
      },
      select: listingThumbnailSelect(langId),
    });

    if (!thumb) {
      return res.status(404).json({
        code: "LISTING_NOT_AVAILABLE_IN_LANGUAGE",
      });
    }

    res.json({ thumb });
  } catch (err) {
    console.error("Listing thumb error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: PublicRequest, res) => {
  try {
    const id = Number(req.params.id);
    const langId = req.userLangId ?? 2;

    const listing = await prisma.inzeraty.findUnique({
      where: { id },
      select: listingDetailSelect(langId),
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ listing });
  } catch (err) {
    console.error("Listing detail error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id/similar", async (req: PublicRequest, res) => {
  try {
    const id = Number(req.params.id);
    const langId = req.langId ?? 2;

    const baseListing = await prisma.inzeraty.findUnique({
      where: { id },
      select: {
        cena_v_eur: true,
        typy_nemovitosti_id: true,
      },
    });

    if (!baseListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const minPrice = Math.floor(baseListing.cena_v_eur * 0.8);
    const maxPrice = Math.ceil(baseListing.cena_v_eur * 1.2);

    const candidates = await prisma.inzeraty.findMany({
      where: {
        id: { not: id },
        statusy_id: 1,
        typy_nemovitosti_id: baseListing.typy_nemovitosti_id,
        cena_v_eur: {
          gte: minPrice,
          lte: maxPrice,
        },
        inzeraty_preklady: {
          some: {
            jazyky_id: langId,
          },
        },
      },
      take: 20,
      select: listingThumbnailSelect(langId),
    });

    const similar = candidates.sort(() => Math.random() - 0.5).slice(0, 5);

    res.json({ similar });
  } catch (err) {
    console.error("Similar listings error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
