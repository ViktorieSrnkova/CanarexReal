import { Router } from "express";
import prisma from "../../lib/db";
import { detectLang, type PublicRequest } from "../middleware/detectLang";
import {
  sendAdminNotificationEmail,
  sendContactEmail,
} from "../services/email";
import { contactFormLimiter } from "../middleware/rateLimit";

const router = Router();
router.use(detectLang);

router.post("/", contactFormLimiter, async (req: PublicRequest, res) => {
  try {
    const payload = req.body;
    if (payload.website) {
      return res.status(400).json({ message: "Spam detected" });
    }
    const form = await prisma.formulare.create({
      data: {
        jmeno: payload.name,
        prijmeni: payload.surname,
        email: payload.email,
        telefon: payload.fullPhone,
        text_zpravy: payload.message,
        revidovano: false,
        odkud_formular_id: payload.from,
        typy_formulare_id: payload.what,
      },
    });
    const data = {
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      fullPhone: payload.fullPhone,
      message: payload.message,
    };

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
