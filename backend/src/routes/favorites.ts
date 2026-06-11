import { Router } from "express";
import prisma from "../lib/db.js";
import { requireUser, type AuthRequest } from "../middleware/auth.js";
import {
  listingThumbnailSelect,
  listingWithLangWhere,
} from "../lib/prismaSelect.js";

const router = Router();

router.use(requireUser);

router.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const listingId = Number(req.body.listing_id);
    if (!listingId) {
      return res.status(400).json({ message: "Missing listing_id" });
    }
    const listing = await prisma.inzeraty.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const favorite = await prisma.uzivatelske_oblibene.create({
      data: {
        inzeraty_id: listingId,
        uzivatele_id: userId,
      },
    });
    res.json({ message: "Added to favorites", favorite });
  } catch (err) {
    console.error("Favorites error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.delete("/:listing_id", async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const listingId = Number(req.params.listing_id);

    const existing = await prisma.uzivatelske_oblibene.findUnique({
      where: {
        uzivatele_id_inzeraty_id: {
          uzivatele_id: userId,
          inzeraty_id: listingId,
        },
      },
    });

    if (!existing)
      return res.status(404).json({ message: "Favorite not found" });

    const unfavorite = await prisma.uzivatelske_oblibene.delete({
      where: {
        uzivatele_id_inzeraty_id: {
          uzivatele_id: userId,
          inzeraty_id: listingId,
        },
      },
    });

    res.json({ message: "Removed from favorites", unfavorite });
  } catch (err) {
    console.error("Favorites removing error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const userId = req.user!.userId;
    const langId = req.langId ?? 2;
    const where = {
      ...listingWithLangWhere(langId),
      uzivatelske_oblibene: {
        some: {
          uzivatele_id: userId,
        },
      },
    };

    const [favorites, total] = await Promise.all([
      prisma.uzivatelske_oblibene.findMany({
        skip,
        take: limit,
        where: { uzivatele_id: userId },
        orderBy: { datum_vytvoreni: "desc" },
        select: {
          inzeraty: {
            select: listingThumbnailSelect(langId, userId),
          },
        },
      }),

      prisma.uzivatelske_oblibene.count({
        where: {
          uzivatele_id: userId,
        },
      }),
    ]);

    const mapped = favorites.map((favorite) => {
      const { uzivatelske_oblibene, ...rest } = favorite.inzeraty;

      return {
        ...rest,
        is_favorite: true,
      };
    });

    res.json({
      thumbnails: mapped,
      total,
    });
  } catch (err) {
    console.error("Favorites fetching error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});

export default router;
