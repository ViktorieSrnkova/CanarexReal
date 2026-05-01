import { Router } from "express";
import prisma from "../lib/db.js";
import { detectLang, type PublicRequest } from "../middleware/detectLang.js";
import {
  sendAdminNotificationEmail,
  sendContactEmail,
} from "../services/email.js";
import { contactFormLimiter } from "../middleware/rateLimit.js";

const router = Router();
router.use(detectLang);

router.post("/", contactFormLimiter, async (req: PublicRequest, res) => {
  console.log("FORM START");
  try {
    const payload = req.body;
    if (payload.website) {
      return res.status(400).json({ message: "Spam detected" });
    }
    console.log("BODY:", req.body);
    const baseData = {
      jmeno: payload.name,
      prijmeni: payload.surname,
      email: payload.email,
      telefon: payload.fullPhone,
      text_zpravy: payload.message,
      revidovano: false,
      odkud_formular_id: payload.from,
      typy_formulare_id: payload.what,
    };

    const extraData = {
      ...(payload.index !== undefined && { index_inzeratu: payload.index }),

      ...(payload.priceFrom !== undefined && {
        rozpocet_od: payload.priceFrom,
      }),
      ...(payload.priceTo !== undefined && { rozpocet_do: payload.priceTo }),

      ...(payload.sizeFrom !== undefined && { velikost_od: payload.sizeFrom }),
      ...(payload.sizeTo !== undefined && { velikost_do: payload.sizeTo }),

      ...(payload.bedrooms !== undefined && { pocet_loznic: payload.bedrooms }),
      ...(payload.bathrooms !== undefined && {
        pocet_koupelen: payload.bathrooms,
      }),

      ...(payload.arrivalMode && {
        prilet: payload.arrival ? new Date(payload.arrival) : undefined,
        vi_prilet: payload.arrivalMode === "date" ? true : false,
      }),
    };
    const form = await prisma.formulare.create({
      data: {
        ...baseData,
        ...extraData,
        ...(payload.type &&
          payload.type.length > 0 && {
            formulare_typy_nemovitosti: {
              create: payload.type.map((id: number) => ({
                typy_nemovitosti_id: id,
              })),
            },
          }),
      },
    });
    const data = {
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      fullPhone: payload.fullPhone,
      message: payload.message,
    };
    console.log("BEFORE RESPONSE");
    try {
      await Promise.all([
        sendContactEmail(payload.email, data),
        sendAdminNotificationEmail(data),
      ]);
    } catch (err) {
      console.error("Email failed:", err);
    }

    res.status(201).json({ message: "Form created", form });
  } catch (err) {
    console.error("form save error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default router;
