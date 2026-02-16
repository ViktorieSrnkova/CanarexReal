import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: { userId: number; roleId: number };
}
interface JwtPayload {
  userId: number;
  roleId: number;
}

export function requireRole(allowedRoles: number[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.refresh_token;

    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

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

export function requireUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
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
