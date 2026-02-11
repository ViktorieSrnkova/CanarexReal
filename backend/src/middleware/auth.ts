// src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: number; roleId: number };
}

export function requireRole(allowedRoles: number[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!allowedRoles.includes(payload.roleId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

/*
import { requireRole } from "../middleware/auth";

router.get("/users", requireRole([2]), async (req, res) => {
  // Only superadmin (role_id = 2)
});

router.get("/listings", requireRole([1,2]), async (req, res) => {
  // Admins and superadmins
});
*/
