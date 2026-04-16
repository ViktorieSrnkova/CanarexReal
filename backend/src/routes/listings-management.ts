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
      const createdAddress = await tx.adresy.create({
        data: {
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
      });
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
          adresy_id: createdAddress.id,
          statusy_id: 1,
          typy_nemovitosti_id: propertyType.id,
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
    const listings = await prisma.inzeraty.findMany({
      select: listingDetailSelect(2),
    });
    res.json({ listings });
  } catch (err) {
    console.error("listings get error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default router;
