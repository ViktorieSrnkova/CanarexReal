import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/db";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.uzivatele.findUnique({
    where: { email },
  });

  if (!user || (user.role_id !== 1 && user.role_id !== 3)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.heslo_hash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, roleId: user.role_id },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" },
  );

  res.json({ token });
});

export default router;
