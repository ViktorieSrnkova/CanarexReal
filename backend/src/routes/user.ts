import { Router } from "express";
import { requireUser, type AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/me", requireUser, async (req: AuthRequest, res) => {
  res.json(req.user);
});
