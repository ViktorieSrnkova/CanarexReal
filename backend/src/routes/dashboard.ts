import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import prisma from "../../lib/db";

const router = Router();
router.use(requireRole([1, 3]));

router.get("/", async (req, res) => {
  const [listingsTotal, latestListing, lastIndex] = await Promise.all([
    prisma.inzeraty.count(),
    prisma.inzeraty.findFirst({
      orderBy: { datum_vytvoreni: "desc" },
      select: { datum_vytvoreni: true },
    }),
    prisma.inzeraty.findFirst({
      orderBy: { index: "desc" },
      select: { index: true },
    }),
  ]);
  const latestListingsVisibility = await prisma.inzeraty.findFirst({
    orderBy: { datum_vytvoreni: "desc" },
    select: { reprezentativni: true },
  });
  const [newsTotal, latestNews] = await Promise.all([
    prisma.aktuality.count(),
    prisma.aktuality.findFirst({
      orderBy: { datum_vytvoreni: "desc" },
      select: { datum_vytvoreni: true },
    }),
  ]);
  const latestNewsVisibility = await prisma.aktuality.findFirst({
    orderBy: { datum_vytvoreni: "desc" },
    select: { viditelnost: true },
  });
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const [latestForm, formsUnprocessed, formsNew, formInfo] = await Promise.all([
    prisma.formulare.findFirst({
      orderBy: { datum_vytvoreni: "desc" },
      select: { datum_vytvoreni: true },
    }),
    prisma.formulare.count({
      where: { revidovano: false },
    }),

    prisma.formulare.count({
      where: {
        revidovano: false,
        datum_vytvoreni: {
          gte: fiveDaysAgo,
        },
      },
    }),
    prisma.formulare.findFirst({
      orderBy: { datum_vytvoreni: "desc" },
      select: { jmeno: true, prijmeni: true },
    }),
  ]);
  res.json({
    listings: {
      total: listingsTotal,
      visible: latestListingsVisibility?.reprezentativni,
      latestCreated: latestListing?.datum_vytvoreni ?? null,
      lastIndex: lastIndex?.index ?? null,
    },
    news: {
      total: newsTotal,
      visible: latestNewsVisibility?.viditelnost,
      latestCreated: latestNews?.datum_vytvoreni ?? null,
    },
    forms: {
      new: formsNew,
      unprocessed: formsUnprocessed,
      latestCreated: latestForm?.datum_vytvoreni ?? null,
      name: formInfo?.jmeno,
      surname: formInfo?.prijmeni,
    },
  });
});
export default router;
