import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import { listingDetailSelect } from "../../lib/prismaSelect";
import prisma from "../../lib/db";

const router = Router();
router.use(requireRole([1, 3]));
router.post("/", async (req, res) => {
  try {
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
