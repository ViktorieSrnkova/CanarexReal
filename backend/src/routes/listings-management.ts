import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import { listingDetailSelect } from "../../lib/prismaSelect";
import prisma from "../../lib/db";
import { processAdImages } from "../utils/processImagesHelper";
import { reverseGeocode } from "../utils/reverseGeocode";
import { getSelectedPictogramIds } from "../utils/mapPictogramsHelper";
import { Prisma } from "../generated/prisma/browser";
import { upload } from "../middleware/uploader";

const router = Router();
router.use(requireRole([1, 3]));

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const values = JSON.parse(req.body.payload);
    const files = (req.files ?? []) as Express.Multer.File[];
    if (!values) {
      return res.status(400).json({ error: "Missing body" });
    }
    const selectedPictogramIds = getSelectedPictogramIds(values.attributes);
    if (!values.address) {
      throw new Error("Missing address");
    }
    const address = values.address;
    const location = values.location;
    const lat = Number(address.lat);
    const lon = Number(address.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      throw new Error("Invalid coordinates");
    }
    const geo = await reverseGeocode(lat, lon);

    const result = await prisma.$transaction(async (tx) => {
      const propertyType = await tx.typy_nemovitosti.findFirst({
        where: { kod: values.propertyType },
      });
      if (!propertyType) {
        throw new Error("Invalid property type");
      }
      const ad = await tx.inzeraty.create({
        data: {
          index: Number(values.index),
          cena_v_eur: Number(values.price),
          loznice: Number(values.bedrooms),
          koupelny: Number(values.bathrooms),
          velikost: Number(values.size),
          reprezentativni: values.showOnHomepage,
          statusy_id: 1,
          typy_nemovitosti_id: propertyType.id,
          adresy: {
            create: {
              lat: new Prisma.Decimal(lat),
              lng: new Prisma.Decimal(lon),
              ulice: geo.street ?? null,
              cislo_popisne: geo.houseNumber ?? null,
              lokace: location,
              mesto: geo.city ?? null,
              staty_id: 1,
              smerovaci_cislo: geo.postcode ?? null,
              cela_adresa: address.label,
            },
          },
        },
      });
      if (selectedPictogramIds.length > 0) {
        await tx.inzeraty_piktogramy.createMany({
          data: selectedPictogramIds.map((id) => ({
            inzeraty_id: ad.id,
            piktogramy_id: id,
          })),
        });
      }
      const languages = {
        en: 1,
        cs: 2,
        sk: 3,
      };

      for (const [lang, langId] of Object.entries(languages)) {
        const t = values.translations?.[lang];
        if (!t) continue;
        await tx.inzeraty_preklady.create({
          data: {
            titulek: t.title,
            popis: JSON.stringify(t.description),
            detaily: JSON.stringify(t.details),
            jazyky_id: langId,
            inzeraty_id: ad.id,
          },
        });
      }

      await processAdImages({
        tx,
        files: files,
        translationsObj: values.translations ?? {},
        inzeratId: ad.id,
        langIdMap: {
          en: 1,
          cs: 2,
          sk: 3,
        },
      });
      return ad;
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("listings post error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const skip = (page - 1) * limit;
    const listings = await prisma.inzeraty.findMany({
      skip,
      take: limit,
      orderBy: {
        datum_vytvoreni: "desc",
      },

      select: {
        id: true,
        index: true,
        cena_v_eur: true,
        loznice: true,
        koupelny: true,
        velikost: true,
        reprezentativni: true,
        datum_vytvoreni: true,

        adresy: {
          select: {
            lokace: true,
          },
        },

        statusy: {
          select: {
            id: true,
            kod: true,
            statusy_preklady: {
              where: {
                jazyky_id: 2,
              },
              select: {
                nazev: true,
              },
              take: 1,
            },
          },
        },

        typy_nemovitosti: {
          select: {
            id: true,
            kod: true,
            typy_nemovitosti_preklady: {
              where: {
                jazyky_id: 2,
              },
              select: {
                nazev: true,
              },
              take: 1,
            },
          },
        },

        inzeraty_piktogramy: {
          select: {
            piktogramy: {
              select: {
                id: true,
                nazev: true,
                piktogramy_preklady: {
                  where: {
                    jazyky_id: 2,
                  },
                  select: {
                    nazev: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },

        obrazky: {
          select: {
            id: true,
            url: true,
            poradi: true,
            obrazky_preklady: {
              select: {
                jazyky_id: true,
              },
            },
          },
          orderBy: {
            poradi: "asc",
          },
          take: 1,
        },
        inzeraty_preklady: {
          select: {
            jazyky_id: true,
          },
        },
      },
    });

    const total = await prisma.inzeraty.count();

    return res.json({
      data: listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("listings get error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { statusId } = req.body;

    await prisma.inzeraty.update({
      where: { id },
      data: {
        statusy_id: Number(statusId),
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("status patch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.patch("/:id/visibility", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { value } = req.body;

    if (typeof value !== "boolean") {
      return res.status(400).json({ error: "Invalid value" });
    }

    await prisma.inzeraty.update({
      where: { id },
      data: {
        reprezentativni: value,
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("visibility patch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    await prisma.inzeraty.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (err: any) {
    console.error("listing delete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
