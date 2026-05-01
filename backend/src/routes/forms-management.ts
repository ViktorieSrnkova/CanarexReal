import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import prisma from "../lib/db.js";

const router = Router();
router.use(requireRole([1, 3]));

router.get("/", async (req, res) => {
  try {
    const forms = await prisma.formulare.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        jmeno: true,
        prijmeni: true,
        email: true,
        telefon: true,
        datum_vytvoreni: true,
        revidovano: true,
        odkud_formular: {
          select: {
            nazev: true,
          },
        },

        typy_formulare: {
          select: {
            id: true,
            nazev: true,
          },
        },
      },
    });

    res.json({ forms });
  } catch (err) {
    console.error("forms all error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const form = await prisma.formulare.findUnique({
      where: { id },
      select: {
        id: true,
        datum_vytvoreni: true,
        jmeno: true,
        prijmeni: true,
        email: true,
        telefon: true,
        index_inzeratu: true,
        prilet: true,
        revidovano: true,
        text_zpravy: true,
        rozpocet_od: true,
        rozpocet_do: true,
        velikost_do: true,
        velikost_od: true,
        pocet_loznic: true,
        pocet_koupelen: true,

        vi_prilet: true,

        odkud_formular: {
          select: {
            id: true,
            nazev: true,
          },
        },

        typy_formulare: {
          select: {
            id: true,
            nazev: true,
          },
        },

        formulare_typy_nemovitosti: {
          select: {
            typy_nemovitosti: {
              select: {
                id: true,
                kod: true,
              },
            },
          },
        },

        uzivatelske_formulare: {
          select: {
            uzivatele: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.json({ form });
  } catch (err) {
    console.error("forms one error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});

router.patch("/:id/review", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { revidovano } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (typeof revidovano !== "boolean") {
      return res.status(400).json({ message: "Invalid revidovano value" });
    }

    const updated = await prisma.formulare.update({
      where: { id },
      data: { revidovano },
      select: {
        id: true,
        jmeno: true,
        prijmeni: true,
        email: true,
        telefon: true,
        datum_vytvoreni: true,
        pocet_loznic: true,
        pocet_koupelen: true,
        rozpocet_od: true,
        rozpocet_do: true,
        velikost_do: true,
        velikost_od: true,
        vi_prilet: true,
        index_inzeratu: true,
        prilet: true,
        revidovano: true,
        text_zpravy: true,
        odkud_formular: { select: { nazev: true } },
        typy_formulare: { select: { nazev: true } },
        formulare_typy_nemovitosti: {
          select: { typy_nemovitosti: { select: { id: true, kod: true } } },
        },
        uzivatelske_formulare: {
          select: { uzivatele: { select: { id: true, email: true } } },
          take: 1,
        },
      },
    });

    return res.json({ form: updated });
  } catch (err) {
    console.error("forms review toggle error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});

export default router;
