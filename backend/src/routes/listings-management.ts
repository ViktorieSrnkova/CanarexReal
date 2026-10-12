import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth.js";
import { listingPrintSelect } from "../lib/prismaSelect.js";
import prisma from "../lib/db.js";
import { reverseGeocode } from "../utils/reverseGeocode.js";
import { getSelectedPictogramIds } from "../utils/mapPictogramsHelper.js";
import { replaceTranslations } from "../utils/saveTranslationsHelper.js";

import { Prisma } from "@prisma/client";
import { deleteMediaFromR2 } from "../utils/deleteMediaFromR2Helper.js";

const router = Router();
router.use(requireRole([1, 3]));

const langIdMap: Record<string, number> = {
  cs: 2,
  en: 1,
  sk: 3,
};

const PROPERTY_TYPE_CODES = new Set([
  "apartman",
  "dum",
  "vila",
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

const buildListingsWhere = (
  query: AuthRequest["query"],
  oblast_prodeje: string,
) => {
  const where: Prisma.inzeratyWhereInput = {};
  const addressFilter: Prisma.adresyWhereInput = {
    oblast_prodeje: oblast_prodeje,
  };

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
    addressFilter.lokace = containsText(location);
  }

  const komplex = toQueryString(query.komplex);

  if (komplex) {
    addressFilter.komplex = containsText(komplex);
  }

  where.adresy = {
    is: addressFilter,
  };

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

router.post("/", async (req, res) => {
  try {
    const values = req.body;

    if (!values) {
      return res.status(400).json({ error: "Missing body" });
    }
    const existing = await prisma.inzeraty.findUnique({
      where: {
        index: Number(values.index),
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "INDEX_EXISTS",
        message: "Tento index už existuje",
      });
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
        const maxOrder = await tx.inzeraty.aggregate({
          _max: {
            poradi: true,
          },
        });

        const nextOrder = (maxOrder._max.poradi ?? -1) + 1;

        const ad = await tx.inzeraty.create({
          data: {
            index: Number(values.index),
            poradi: nextOrder,
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
                oblast_prodeje: values.oblast_prodeje,
                komplex: values.komplex ?? null,
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
              popis: t.description,
              detaily: t.details,
              jazyky_id: langId,
              inzeraty_id: ad.id,
            },
          });
        }

        const media = values.media;

        if (!Array.isArray(media) || media.length === 0) {
          throw new Error("At least one media item is required");
        }

        for (const item of media) {
          await tx.obrazky.update({
            where: {
              id: item.id,
            },
            data: {
              inzeraty_id: ad.id,
              poradi: item.order,
              docasne: false,
            },
          });
        }

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
    const limit = Number(req.query.limit ?? 200);
    const skip = (page - 1) * limit;
    const oblastProdeje = toQueryString(req.query.oblast_prodeje);

    if (!oblastProdeje) {
      return res.status(400).json({
        error: "MISSING_OBLAST_PRODEJE",
        message: "Oblast prodeje je povinná",
      });
    }
    const where = buildListingsWhere(req.query, oblastProdeje);
    const listings = await prisma.inzeraty.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        poradi: "desc",
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
            komplex: true,
            oblast_prodeje: true,
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
            mime_typ: true,
            klic_uloziste: true,
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

    const total = await prisma.inzeraty.count({ where });

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

router.get("/index-search", async (req, res) => {
  try {
    const search = String(req.query.index ?? "").trim();

    if (!/^\d+$/.test(search)) {
      return res.json({ listings: [] });
    }

    const listings = await prisma.$queryRaw<
      {
        id: number;
        index: number;
        cena_v_eur: number | null;
        lokace: string | null;
      }[]
    >`
      SELECT
        i.id,
        i.index,
        i.cena_v_eur,
        a.lokace
      FROM inzeraty i
      LEFT JOIN adresy a ON a.inzeraty_id = i.id
      WHERE CAST(i.index AS TEXT) LIKE ${`${search}%`}
      ORDER BY i.index ASC
      LIMIT 20
    `;

    res.json({ listings });
  } catch (err) {
    console.error("Listing index search error:", err);
    res.status(500).json({ message: "Internal server error" });
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
            oblast_prodeje: true,
            komplex: true,
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
            mime_typ: true,
            klic_uloziste: true,
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

router.get("/print/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid listing ID",
      });
    }

    const listing = await prisma.inzeraty.findFirst({
      where: {
        id,
      },
      select: listingPrintSelect(),
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    const listingPictograms = await prisma.inzeraty_piktogramy.findMany({
      where: { inzeraty_id: id },
      select: { piktogramy_id: true },
    });

    const dynamicIds = listingPictograms.map((p) => p.piktogramy_id);

    const allIds = [...new Set([1, 2, 3, ...dynamicIds])];

    const pictograms = await prisma.piktogramy.findMany({
      where: { id: { in: allIds } },
      include: {
        obrazky: { select: { ikona_svg: true } },
        piktogramy_preklady: {
          select: { nazev: true, jazyky_id: true },
        },
      },
    });
    const result = pictograms.map((p) => ({
      id: p.id,
      iconSvg: p.obrazky?.ikona_svg ?? null,
      translations: p.piktogramy_preklady.map((translation) => ({
        jazyky_id: translation.jazyky_id,
        name: translation.nazev,
      })),
    }));
    const FIXED = [1, 2, 3];
    const SPECIAL = 14;

    const ORDER = [4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16];
    const orderMap = new Map(ORDER.map((id, i) => [id, i]));

    const fixedItems = result.filter((p) => FIXED.includes(p.id));
    const specialItem = result.find((p) => p.id === SPECIAL);
    const rest = result.filter(
      (p) => !FIXED.includes(p.id) && p.id !== SPECIAL,
    );

    rest.sort((a, b) => {
      const aOrder = orderMap.get(a.id) ?? 999;
      const bOrder = orderMap.get(b.id) ?? 999;
      return aOrder - bOrder;
    });

    const sortedPictograms = [
      ...fixedItems.sort((a, b) => a.id - b.id),
      ...(specialItem ? [specialItem] : []),
      ...rest,
    ];

    const response = {
      ...listing,
      inzeraty_piktogramy: sortedPictograms,
    };

    res.json({ listing: response });
  } catch (err) {
    console.error("Listing detail error:", err);
    res.status(500).json({ message: "Internal server error printing" });
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
        mime_typ: true,
        obrazky_preklady: {
          select: {
            alt_text: true,
            jazyky_id: true,
          },
        },
      },
    });

    const result = images.map((img) => ({
      id: img.id,
      order: img.poradi ?? 0,
      url: `/api/files/images/${img.id}`,
      mimeType: img.mime_typ ?? "image/webp",
      alts: img.obrazky_preklady.map((p) => ({
        lang: Number(p.jazyky_id),
        text: p.alt_text ?? "",
      })),
    }));

    return res.json(result);
  } catch (err) {
    console.error("galery fetch error:", err);

    return res.status(500).json({
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

    const images = await prisma.obrazky.findMany({
      where: {
        inzeraty_id: id,
      },
      select: {
        id: true,
        klic_uloziste: true,
      },
    });

    const storageKeys = images
      .map((image) => image.klic_uloziste)
      .filter((key): key is string => Boolean(key));

    if (storageKeys.length > 0) {
      await deleteMediaFromR2(storageKeys);
    }

    await prisma.$transaction(async (tx) => {
      const listing = await tx.inzeraty.findUnique({
        where: { id },
        select: {
          poradi: true,
        },
      });

      if (!listing) {
        throw new Error("LISTING_NOT_FOUND");
      }

      console.log("DELETING PORADI:", listing.poradi);

      await tx.inzeraty.delete({
        where: { id },
      });

      const result = await tx.inzeraty.updateMany({
        where: {
          poradi: {
            gt: listing.poradi,
          },
        },
        data: {
          poradi: {
            decrement: 1,
          },
        },
      });

      console.log("UPDATED:", result.count);
    });

    console.log(
      `🗑️ Deleted listing ${id} and ${storageKeys.length} R2 objects`,
    );

    return res.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "LISTING_NOT_FOUND") {
      return res.status(404).json({ message: "Listing not found" });
    }

    console.error("listing delete error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const body = req.body;
    await prisma.$transaction(async (tx) => {
      const existing = await tx.inzeraty.findFirst({
        where: {
          index: Number(body.index),
          NOT: {
            id,
          },
        },
      });

      if (existing) {
        return res.status(409).json({
          error: "INDEX_EXISTS",
          message: "Tento index už existuje",
        });
      }

      const propertyType = await tx.typy_nemovitosti.findFirst({
        where: { kod: body.propertyType },
      });

      if (!propertyType) {
        return res.status(400).json({ error: "Invalid property type" });
      }

      await tx.inzeraty.update({
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

      await tx.inzeraty_piktogramy.deleteMany({
        where: { inzeraty_id: id },
      });

      await tx.inzeraty_piktogramy.createMany({
        data: Object.entries(body.attributes ?? {})
          .filter(([, v]) => v)
          .map(([pid]) => ({
            inzeraty_id: id,
            piktogramy_id: Number(pid),
          })),
      });

      if (body.address) {
        await tx.adresy.upsert({
          where: { inzeraty_id: id },
          update: {
            nominatim_id: body.address.value,
            lokace: body.location,
            lat: body.address.lat,
            lng: body.address.lon,
            cela_adresa: body.address.label,
            komplex: body.komplex,
            oblast_prodeje: body.oblast_prodeje,
          },
          create: {
            inzeraty_id: id,
            nominatim_id: body.address.value,
            lokace: body.location,
            lat: body.address.lat,
            lng: body.address.lon,
            cela_adresa: body.address.label,
            staty_id: 1,
            komplex: body.komplex,
            oblast_prodeje: body.oblast_prodeje,
          },
        });
      } else {
        await tx.adresy.deleteMany({
          where: { inzeraty_id: id },
        });
      }

      await replaceTranslations({
        tx,
        listingId: id,
        translationsObj: body.translations ?? {},
        langIdMap,
      });
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update listing" });
  }
});

router.put("/gallery/save", async (req, res) => {
  try {
    const { listingId, existingImages, newImages, removedImageIds } = req.body;

    if (!Number.isInteger(listingId)) {
      return res.status(400).json({
        message: "Invalid listing id",
      });
    }

    if (!Array.isArray(existingImages)) {
      return res.status(400).json({
        message: "Invalid existing images",
      });
    }

    if (!Array.isArray(newImages)) {
      return res.status(400).json({
        message: "Invalid new images",
      });
    }

    if (!Array.isArray(removedImageIds)) {
      return res.status(400).json({
        message: "Invalid removed image ids",
      });
    }

    const removedImages = await prisma.obrazky.findMany({
      where: {
        id: {
          in: removedImageIds,
        },
        inzeraty_id: listingId,
      },
      select: {
        id: true,
        klic_uloziste: true,
      },
    });

    const removedStorageKeys = removedImages
      .map((image) => image.klic_uloziste)
      .filter((key): key is string => Boolean(key));

    await prisma.$transaction(async (tx) => {
      if (removedImageIds.length > 0) {
        await tx.obrazky.deleteMany({
          where: {
            id: {
              in: removedImageIds,
            },
            inzeraty_id: listingId,
          },
        });
      }

      for (const image of existingImages) {
        const existingImage = await tx.obrazky.findFirst({
          where: {
            id: image.id,
            inzeraty_id: listingId,
          },
        });

        if (!existingImage) {
          throw new Error(`Invalid existing image id: ${image.id}`);
        }

        await tx.obrazky.update({
          where: {
            id: image.id,
          },
          data: {
            poradi: image.order,
          },
        });

        for (const alt of image.alts) {
          await tx.obrazky_preklady.upsert({
            where: {
              jazyky_id_obrazky_id: {
                jazyky_id: alt.lang,
                obrazky_id: image.id,
              },
            },
            update: {
              alt_text: alt.text,
            },
            create: {
              jazyky_id: alt.lang,
              obrazky_id: image.id,
              alt_text: alt.text,
            },
          });
        }
      }

      for (const image of newImages) {
        const uploadedImage = await tx.obrazky.findFirst({
          where: {
            id: image.id,
            inzeraty_id: null,
            docasne: true,
          },
        });

        if (!uploadedImage) {
          throw new Error(`Invalid new image id: ${image.id}`);
        }

        await tx.obrazky.update({
          where: {
            id: image.id,
          },
          data: {
            inzeraty_id: listingId,
            poradi: image.order,
            docasne: false,
          },
        });

        for (const alt of image.alts) {
          await tx.obrazky_preklady.create({
            data: {
              jazyky_id: alt.lang,
              obrazky_id: image.id,
              alt_text: alt.text,
            },
          });
        }
      }
    });

    if (removedStorageKeys.length > 0) {
      await deleteMediaFromR2(removedStorageKeys);
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("edit gallery error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/check-index/:index", async (req, res) => {
  try {
    const index = Number(req.params.index);

    if (!Number.isInteger(index)) {
      return res.status(400).json({
        error: "Invalid index",
      });
    }

    const excludeId = req.query.excludeId
      ? Number(req.query.excludeId)
      : undefined;

    const existing = await prisma.inzeraty.findFirst({
      where: {
        index,
        ...(excludeId !== undefined && {
          NOT: {
            id: excludeId,
          },
        }),
      },
    });

    return res.json({
      exists: !!existing,
    });
  } catch (err) {
    console.error("check index error:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.patch("/order", async (req, res) => {
  try {
    const { listingId, to } = req.body;

    if (typeof listingId !== "number" || typeof to !== "number" || to < 0) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    await prisma.$transaction(async (tx) => {
      const listing = await tx.inzeraty.findUnique({
        where: {
          id: listingId,
        },
        select: {
          poradi: true,
        },
      });

      if (!listing) {
        throw new Error("LISTING_NOT_FOUND");
      }

      const from = listing.poradi;

      if (from === to) {
        return;
      }

      if (from < to) {
        await tx.inzeraty.updateMany({
          where: {
            poradi: {
              gt: from,
              lte: to,
            },
          },
          data: {
            poradi: {
              decrement: 1,
            },
          },
        });
      } else {
        await tx.inzeraty.updateMany({
          where: {
            poradi: {
              gte: to,
              lt: from,
            },
          },
          data: {
            poradi: {
              increment: 1,
            },
          },
        });
      }

      await tx.inzeraty.update({
        where: {
          id: listingId,
        },
        data: {
          poradi: to,
        },
      });
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "LISTING_NOT_FOUND") {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    console.error("listing order patch error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: String(err),
    });
  }
});

export default router;
