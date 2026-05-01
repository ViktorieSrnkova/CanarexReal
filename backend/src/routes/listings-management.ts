// @ts-ignore
import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import { listingDetailSelect } from "../lib/prismaSelect";
import prisma from "../lib/db.js";
import { processAdImages } from "../utils/processImagesHelper";
import { reverseGeocode } from "../utils/reverseGeocode";
import { getSelectedPictogramIds } from "../utils/mapPictogramsHelper";
import { Prisma } from "../generated/prisma/browser";
import { upload } from "../middleware/uploader";
import { replaceTranslations } from "../utils/saveTranslationsHelper";
import { parseTranslations } from "../utils/parseTranslationsHelper";
import { processGalleryImages } from "../utils/processGalleryImages";
import { convertBufferToThumbnail } from "../utils/thumbnailMaker";

const router = Router();
router.use(requireRole([1, 3]));

const langIdMap: Record<string, number> = {
  cs: 2,
  en: 1,
  sk: 3,
};

const PROPERTY_TYPE_CODES = new Set([
  "apartman",
  "vila",
  "dum",
  "garsonka",
  "pozemek",
]);
const toQueryString = (value: unknown) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return typeof rawValue === "string" ? rawValue.trim() : "";
};

const toNumberFilter = (value: unknown) => {
  const normalized = toQueryString(value).replace(/\s/g, "");
  if (!normalized) return undefined;

  const numberValue = Number(normalized);
  return Number.isInteger(numberValue) ? numberValue : undefined;
};

const toNumberRangeFilter = (fromValue: unknown, toValue: unknown) => {
  const from = toNumberFilter(fromValue);
  const to = toNumberFilter(toValue);

  if (from === undefined && to === undefined) return undefined;

  return {
    ...(from !== undefined ? { gte: from } : {}),
    ...(to !== undefined ? { lte: to } : {}),
  };
};

const toNumberOrRangeFilter = (
  exactValue: unknown,
  fromValue: unknown,
  toValue: unknown,
) => {
  const exact = toNumberFilter(exactValue);
  return exact ?? toNumberRangeFilter(fromValue, toValue);
};

const toNumberList = (value: unknown) => {
  const normalized = toQueryString(value);
  if (!normalized) return [];

  return normalized
    .split(",")
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item));
};

const toStringList = (value: unknown) => {
  const normalized = toQueryString(value);
  if (!normalized) return [];

  return normalized
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const containsText = (value: string) => ({
  contains: value,
  mode: "insensitive" as const,
});

const buildSearchWhere = (value: string): Prisma.inzeratyWhereInput[] => {
  const query = value.trim();
  if (!query) return [];

  const conditions: Prisma.inzeratyWhereInput[] = [
    {
      adresy: {
        is: {
          lokace: containsText(query),
        },
      },
    },
    {
      statusy: {
        is: {
          OR: [
            { kod: containsText(query) },
            {
              statusy_preklady: {
                some: {
                  jazyky_id: 2,
                  nazev: containsText(query),
                },
              },
            },
          ],
        },
      },
    },
    {
      typy_nemovitosti: {
        is: {
          OR: [
            { kod: containsText(query) },
            {
              typy_nemovitosti_preklady: {
                some: {
                  jazyky_id: 2,
                  nazev: containsText(query),
                },
              },
            },
          ],
        },
      },
    },
    {
      inzeraty_piktogramy: {
        some: {
          piktogramy: {
            is: {
              OR: [
                { nazev: containsText(query) },
                {
                  piktogramy_preklady: {
                    some: {
                      jazyky_id: 2,
                      nazev: containsText(query),
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ];

  const numberValue = toNumberFilter(query);
  if (numberValue !== undefined) {
    conditions.push(
      { index: numberValue },
      { cena_v_eur: numberValue },
      { loznice: numberValue },
      { koupelny: numberValue },
      { velikost: numberValue },
    );
  }

  return conditions;
};

const buildListingsWhere = (query: AuthRequest["query"]) => {
  const where: Prisma.inzeratyWhereInput = {};

  const searchConditions = buildSearchWhere(toQueryString(query.query));
  if (searchConditions.length > 0) {
    where.OR = searchConditions;
  }

  const index = toNumberFilter(query.index);
  if (index !== undefined) {
    where.index = index;
  }

  const statusIds = toNumberList(query.statusIds);
  if (statusIds.length > 0) {
    where.statusy_id = { in: statusIds };
  }

  const typeCodes = toStringList(query.typeCodes).filter((code) =>
    PROPERTY_TYPE_CODES.has(code),
  );
  if (typeCodes.length > 0) {
    where.typy_nemovitosti = {
      is: {
        kod: { in: typeCodes },
      },
    };
  }

  const price = toNumberOrRangeFilter(
    query.price,
    query.priceFrom,
    query.priceTo,
  );
  if (price !== undefined) {
    where.cena_v_eur = price;
  }

  const size = toNumberRangeFilter(query.sizeFrom, query.sizeTo);
  if (size !== undefined) {
    where.velikost = size;
  }

  const location = toQueryString(query.location);
  if (location) {
    where.adresy = {
      is: {
        lokace: containsText(location),
      },
    };
  }

  const bedrooms = toNumberOrRangeFilter(
    query.bedrooms,
    query.bedroomsFrom,
    query.bedroomsTo,
  );
  if (bedrooms !== undefined) {
    where.loznice = bedrooms;
  }

  const bathrooms = toNumberOrRangeFilter(
    query.bathrooms,
    query.bathroomsFrom,
    query.bathroomsTo,
  );
  if (bathrooms !== undefined) {
    where.koupelny = bathrooms;
  }

  const pictogramIds = toNumberList(query.pictogramIds);
  if (pictogramIds.length > 0) {
    where.inzeraty_piktogramy = {
      some: {
        piktogramy_id: { in: pictogramIds },
      },
    };
  }

  return where;
};

router.get("/filter-options", async (_req, res) => {
  try {
    const pictograms = await prisma.piktogramy.findMany({
      where: {
        inzeraty_piktogramy: {
          some: {},
        },
      },
      orderBy: {
        id: "asc",
      },
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
    });

    const collator = new Intl.Collator("cs");
    const options = pictograms
      .map((pictogram: any) => ({
        value: pictogram.id,
        label: pictogram.piktogramy_preklady[0]?.nazev ?? pictogram.nazev,
      }))
      .sort((a: any, b: any) => collator.compare(a.label, b.label));

    return res.json({ pictograms: options });
  } catch (err) {
    console.error("listing filter options error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

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

    const result = await prisma.$transaction(
      async (tx: any) => {
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
                nominatim_id: address.value,
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
      },
      {
        timeout: 10000,
      },
    );
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
    const where = buildListingsWhere(req.query);
    const listings = await prisma.inzeraty.findMany({
      where,
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
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const listing = await prisma.inzeraty.findUnique({
      where: { id },

      select: {
        id: true,
        index: true,
        cena_v_eur: true,
        loznice: true,
        koupelny: true,
        velikost: true,
        reprezentativni: true,
        datum_vytvoreni: true,
        typy_nemovitosti_id: true,

        adresy: {
          select: {
            lokace: true,
            lat: true,
            lng: true,
            nominatim_id: true,
            cela_adresa: true,
          },
        },

        inzeraty_piktogramy: {
          select: {
            piktogramy_id: true,
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
                alt_text: true,
              },
            },
          },
          orderBy: {
            poradi: "asc",
          },
        },

        inzeraty_preklady: {
          select: {
            jazyky_id: true,
            titulek: true,
            popis: true,
            detaily: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.json(listing);
  } catch (err) {
    console.error("listing detail error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});
router.get("/:id/gallery", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const images = await prisma.obrazky.findMany({
      where: { inzeraty_id: id },
      orderBy: { poradi: "asc" },
      select: {
        id: true,
        poradi: true,
        obrazky_preklady: {
          select: {
            alt_text: true,
            jazyky_id: true,
          },
        },
      },
    });

    const result = images.map((img: any) => ({
      id: img.id,
      order: img.poradi,
      url: `/api/files/images/${img.id}`,
      alts: img.obrazky_preklady.map((p: any) => ({
        lang: Number(p.jazyky_id),
        text: p.alt_text ?? "",
      })),
    }));
    return res.json(result);
  } catch (err) {
    console.error("galery fetch error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
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

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const body = req.body;

    const propertyType = await prisma.typy_nemovitosti.findFirst({
      where: { kod: body.propertyType },
    });

    if (!propertyType) {
      return res.status(400).json({ error: "Invalid property type" });
    }

    await prisma.inzeraty.update({
      where: { id },
      data: {
        index: body.index,
        cena_v_eur: body.price,
        loznice: body.bedrooms,
        koupelny: body.bathrooms,
        velikost: body.size,
        typy_nemovitosti_id: propertyType.id,
      },
    });

    await prisma.inzeraty_piktogramy.deleteMany({
      where: { inzeraty_id: id },
    });

    await prisma.inzeraty_piktogramy.createMany({
      data: Object.entries(body.attributes ?? {})
        .filter(([, v]) => v)
        .map(([pid]) => ({
          inzeraty_id: id,
          piktogramy_id: Number(pid),
        })),
    });

    if (body.address) {
      await prisma.adresy.upsert({
        where: { inzeraty_id: id },
        update: {
          nominatim_id: body.address.value,
          lokace: body.lokace,
          lat: body.address.lat,
          lng: body.address.lon,
          cela_adresa: body.address.label,
        },
        create: {
          inzeraty_id: id,
          nominatim_id: body.address.value,
          lokace: body.lokace,
          lat: body.address.lat,
          lng: body.address.lon,
          cela_adresa: body.address.label,
          staty_id: 1,
        },
      });
    } else {
      await prisma.adresy.deleteMany({
        where: { inzeraty_id: id },
      });
    }
    const mainImage = await prisma.obrazky.findFirst({
      where: {
        inzeraty_id: id,
        poradi: 0,
      },
    });
    if (mainImage) {
      for (const [langCode, t] of Object.entries(
        body.translations ?? {},
      ) as any) {
        const jazyky_id = langIdMap[langCode];
        if (!jazyky_id) continue;

        await prisma.obrazky_preklady.upsert({
          where: {
            jazyky_id_obrazky_id: {
              jazyky_id,
              obrazky_id: mainImage.id,
            },
          },
          update: {
            alt_text: t.alt ?? null,
          },
          create: {
            jazyky_id,
            obrazky_id: mainImage.id,
            alt_text: t.alt ?? null,
          },
        });
      }
    }
    await replaceTranslations({
      listingId: id,
      translationsObj: body.translations ?? {},
      langIdMap,
    });

    await res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update listing" });
  }
});

router.put("/gallery/save", upload.any(), async (req, res) => {
  try {
    const form = req.body;

    const listingId = Number(form.listingId);

    const existingImages = JSON.parse(form.existingImages ?? "[]");
    const removedImageIds = JSON.parse(form.removedImageIds ?? "[]");
    const newImagesMeta = JSON.parse(form.newImagesMeta ?? "[]");

    const files = req.files as
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };

    await prisma.$transaction(async (tx: any) => {
      if (removedImageIds.length) {
        await tx.obrazky.deleteMany({
          where: {
            id: { in: removedImageIds },
            inzeraty_id: listingId,
          },
        });
      }

      for (const img of existingImages) {
        await tx.obrazky.update({
          where: { id: img.id },
          data: { poradi: img.order },
        });

        for (const alt of img.alts) {
          await tx.obrazky_preklady.upsert({
            where: {
              jazyky_id_obrazky_id: {
                jazyky_id: alt.lang,
                obrazky_id: img.id,
              },
            },
            update: { alt_text: alt.text },
            create: {
              jazyky_id: alt.lang,
              obrazky_id: img.id,
              alt_text: alt.text,
            },
          });
        }
      }
      await processGalleryImages({
        tx,
        files,
        newImagesMeta,
        listingId,
      });
      const imagesAfter = await tx.obrazky.findMany({
        where: { inzeraty_id: listingId },
        orderBy: { poradi: "asc" },
      });

      const currentMain = imagesAfter.find((i: any) => i.poradi === 1);
      if (!currentMain?.data) {
        throw new Error("Missing main image");
      }
      const currentThumb = imagesAfter.find((i: any) => i.poradi === 0);

      if (currentThumb) {
        await tx.obrazky.delete({
          where: { id: currentThumb.id },
        });
      }

      const buffer = Buffer.from(currentMain.data as Uint8Array);

      const thumbBuffer = await convertBufferToThumbnail(buffer);

      const mainAlts = await tx.obrazky_preklady.findMany({
        where: { obrazky_id: currentMain.id },
      });
      const thumbImg = await tx.obrazky.create({
        data: {
          inzeraty_id: listingId,
          poradi: 0,
          data: new Uint8Array(thumbBuffer),
          is_temp: false,
          url: "",
        },
      });
      for (const alt of mainAlts) {
        await tx.obrazky_preklady.create({
          data: {
            jazyky_id: alt.jazyky_id,
            obrazky_id: thumbImg.id,
            alt_text: alt.alt_text,
          },
        });
      }
    });

    return res.json({ success: true });
  } catch (err: any) {
    console.error("edit gallery error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
