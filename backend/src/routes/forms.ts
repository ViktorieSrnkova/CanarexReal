import { Router } from "express";
import prisma from "../../lib/db";
import { detectLang, type PublicRequest } from "../middleware/detectLang";

const router = Router();
router.use(detectLang);

router.put("/", async (req: PublicRequest, res) => {
  try {
  } catch (err) {
    console.error("Forms  error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
