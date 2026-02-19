import { Router } from "express";
import { requireRole, type AuthRequest } from "../middleware/auth";
import prisma from "../../lib/db";

const router = Router();
router.use(requireRole([1, 3]));

router.post("/", async (req, res) => {
  try {
  } catch (err) {
    console.error("Favorites error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default router;
