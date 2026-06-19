import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";
import {
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
} from "../middleware/rateLimit.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendRegistrationThanksEmail,
} from "../services/email.js";
import {
  requireRole,
  requireUser,
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { email, password, name, surname, phone } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return res.status(400).json({ message: "Missing email" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!password) {
      return res.status(400).json({ message: "Missing password" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!name) {
      return res.status(400).json({ message: "Missing name" });
    }
    if (!surname) {
      return res.status(400).json({ message: "Missing surname" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Missing phone" });
    }

    const existing = await prisma.uzivatele.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.uzivatele.create({
        data: {
          datum_vytvoreni: new Date(),
          email: email,
          heslo_hash: hashed,
          jmeno: name,
          prijmeni: surname,
          telefon: phone,
          role_id: 2,
        },
      });
      await tx.odber_newsletter.updateMany({
        where: { email: user.email },
        data: {
          uzivatel_id: user.id,
          email: null,
          telefon: null,
        },
      });
      return user;
    });
    const token = jwt.sign(
      { userId: result.id, roleId: result.role_id },
      process.env.JWT_SECRET!,
      { expiresIn: "3d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true /*  process.env.NODE_ENV === "production" */,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    await sendRegistrationThanksEmail(email);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.uzivatele.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.heslo_hash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET!,
      { expiresIn: "3d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true /* process.env.NODE_ENV === "production" */,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", requireUser, (req: AuthRequest, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.post("/forgot-password", resetPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.uzivatele.findUnique({
      where: { email },
    });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      await prisma.uzivatele.update({
        where: { id: user.id },
        data: {
          reset_token: hashedToken,
          reset_token_expirace: new Date(Date.now() + 3600000),
        },
      });
      await sendPasswordResetEmail(email, resetToken);
    }
    return res.json({
      message: "Pokud účet existuje, poslali jsme instrukce na email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or new password" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.uzivatele.findFirst({
      where: {
        reset_token: hashedToken,
        reset_token_expirace: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.uzivatele.update({
      where: { id: user.id },
      data: {
        heslo_hash: hashed,
        reset_token: null,
        reset_token_expirace: null,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/me", requireUser, async (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
