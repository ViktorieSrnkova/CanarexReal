import { Router } from "express";
import prisma from "../lib/db";
import { requireUser, type AuthRequest } from "../middleware/auth";

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
    const userId = req.user!.userId;
    const userLangId = Number(req.query.lang) || 2;

    const favorites = await prisma.uzivatelske_oblibene.findMany({
      where: { uzivatele_id: userId },
      orderBy: { datum_vytvoreni: "desc" },
      select: {
        inzeraty: {
          select: {
            id: true,
            index: true,
            cena_v_eur: true,
            loznice: true,
            koupelny: true,
            velikost: true,
            obrazky: {
              where: { poradi: 1 },
              select: { id: true },
            },
            statusy: {
              select: {
                statusy_preklady: {
                  where: { jazyky_id: userLangId },
                  select: { nazev: true },
                },
              },
            },
            typy_nemovitosti: {
              select: {
                typy_nemovitosti_preklady: {
                  where: { jazyky_id: userLangId },
                  select: { nazev: true },
                },
              },
            },
            adresy: {
              select: { lokace: true, mesto: true },
            },
            inzeraty_preklady: {
              where: { jazyky_id: userLangId },
              select: { titulek: true },
            },
          },
        },
      },
    });

    res.json({ favorites });
  } catch (err) {
    console.error("Favorites fetching error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default router;
