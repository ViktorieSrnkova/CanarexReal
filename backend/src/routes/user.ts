import { Router } from "express";
import { requireUser, type AuthRequest } from "../middleware/auth";
import prisma from "../lib/db";
import bcrypt from "bcrypt";

const router = Router();

router.get("/me", requireUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.uzivatele.findUnique({
      where: {
        id: userId,
      },
      select: {
        jmeno: true,
        prijmeni: true,
        email: true,
        telefon: true,

        _count: {
          select: {
            uzivatelske_oblibene: true,
            uzivatelske_formulare: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      jmeno: user.jmeno,
      prijmeni: user.prijmeni,
      email: user.email,
      telefon: user.telefon,
      favoritesCount: user._count.uzivatelske_oblibene,
      formsCount: user._count.uzivatelske_formulare,
    });
  } catch (err) {
    console.error("Get profile error:", err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.patch("/me/password", requireUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        code: "PASSWORDS_DO_NOT_MATCH",
      });
    }

    const user = await prisma.uzivatele.findUnique({
      where: {
        id: userId,
      },
      select: {
        heslo_hash: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.heslo_hash,
    );

    if (!validPassword) {
      return res.status(400).json({
        code: "CURRENT_PASSWORD_INVALID",
      });
    }
    const samePassword = await bcrypt.compare(newPassword, user.heslo_hash);

    if (samePassword) {
      return res.status(400).json({
        code: "PASSWORD_SAME_AS_OLD",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await prisma.uzivatele.update({
      where: {
        id: userId,
      },
      data: {
        heslo_hash: newHash,
      },
    });

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.patch("/me", requireUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const { jmeno, prijmeni, email, telefon } = req.body;

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }
    }

    const updatedUser = await prisma.uzivatele.update({
      where: { id: userId },
      data: {
        ...(jmeno !== undefined && { jmeno }),
        ...(prijmeni !== undefined && { prijmeni }),
        ...(email !== undefined && { email }),
        ...(telefon !== undefined && { telefon }),
      },
      select: {
        jmeno: true,
        prijmeni: true,
        email: true,
        telefon: true,
      },
    });

    res.json(updatedUser);
  } catch (err: any) {
    console.error("Update profile error:", err);

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
