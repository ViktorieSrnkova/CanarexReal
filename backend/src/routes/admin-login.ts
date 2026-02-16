import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/db";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.uzivatele.findUnique({
      where: { email },
    });

    if (!user || (user.role_id !== 1 && user.role_id !== 3)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.heslo_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "4h" },
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000,
    });
    res.json({ accessToken, message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

    const newAccessToken = jwt.sign(
      { userId: payload.userId, roleId: payload.roleId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      { userId: payload.userId, roleId: payload.roleId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "4h" },
    );

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 4 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Refresh expired" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
});

export default router;
