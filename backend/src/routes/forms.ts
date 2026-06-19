import { Router } from "express";
import prisma from "../lib/db.js";
import { detectLang, type PublicRequest } from "../middleware/detectLang.js";
import {
  sendAdminNotificationEmail,
  sendContactEmail,
} from "../services/email.js";
import { contactFormLimiter } from "../middleware/rateLimit.js";
import { optionalUser, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(detectLang);

router.post(
  "/",
  optionalUser,
  contactFormLimiter,
  async (req: AuthRequest & PublicRequest, res) => {
    try {
      const payload = req.body;
      if (payload.website) {
        return res.status(400).json({ message: "Spam detected" });
      }
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

        ...(payload.sizeFrom !== undefined && {
          velikost_od: payload.sizeFrom,
        }),
        ...(payload.sizeTo !== undefined && { velikost_do: payload.sizeTo }),

        ...(payload.bedrooms !== undefined && {
          pocet_loznic: payload.bedrooms,
        }),
        ...(payload.bathrooms !== undefined && {
          pocet_koupelen: payload.bathrooms,
        }),

        ...(payload.arrivalMode && {
          prilet: payload.arrival ? new Date(payload.arrival) : undefined,
          vi_prilet: payload.arrivalMode === "date" ? true : false,
        }),
      };
      const form = await prisma.$transaction(async (tx) => {
        const form = await tx.formulare.create({
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

        if (req.user?.userId) {
          await tx.uzivatelske_formulare.create({
            data: {
              uzivatele_id: req.user.userId,
              formulare_id: form.id,
            },
          });
        }
        if (payload.newsletter && req.user?.userId) {
          const user = await tx.uzivatele.findUnique({
            where: { id: req.user.userId },
            select: { email: true },
          });

          if (user?.email !== payload.email) {
            return res.status(400).json({
              code: "NEWSLETTER_EMAIL_MISMATCH",
              expectedEmail: user?.email,
            });
          }
        }

        if (payload.newsletter) {
          if (req.user?.userId) {
            await tx.odber_newsletter.upsert({
              where: {
                uzivatel_id: req.user?.userId,
              },
              create: {
                uzivatel: {
                  connect: { id: req.user?.userId },
                },
                ma_odber: true,
                datum_odberu: new Date(),
                datum_zruseni: null,
              },
              update: {
                ma_odber: true,
                datum_zruseni: null,
              },
            });
          } else {
            await tx.odber_newsletter.upsert({
              where: {
                email: payload.email,
              },
              create: {
                email: payload.email,
                telefon: payload.fullPhone,
                ma_odber: true,
                datum_odberu: new Date(),
                datum_zruseni: null,
              },
              update: {
                ma_odber: true,
                telefon: payload.fullPhone,
                datum_zruseni: null,
              },
            });
          }
        }

        return form;
      });
      const data = {
        name: payload.name,
        surname: payload.surname,
        email: payload.email,
        fullPhone: payload.fullPhone,
        message: payload.message,
        type: payload.type,
        priceFrom: payload.priceFrom,
        priceTo: payload.priceTo,
        sizeFrom: payload.sizeFrom,
        sizeTo: payload.sizeTo,
        bedrooms: payload.bedrooms,
        bathrooms: payload.bathrooms,
        date: payload.arrival,
        listingId: payload.index,
        vi_prilet: payload.arrivalMode,
      };
      /*   try {
      await Promise.all([
        sendContactEmail(payload.email, data),
        sendAdminNotificationEmail(data),
      ]);
    } catch (err) {
      console.error("Email failed:", err);
    }
 */
      res.status(201).json({ message: "Form created", form });
    } catch (err) {
      console.error("form save error:", err);
      res
        .status(500)
        .json({ message: "Internal server error", error: String(err) });
    }
  },
);

export default router;
