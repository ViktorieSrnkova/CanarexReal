import type { Request, Response, NextFunction } from "express";

export interface PublicRequest extends Request {
  userLangId?: number;
}

export function detectLang(
  req: PublicRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const defaultLangId = 2;
    const lang = Number(req.query.lang);

    (req as PublicRequest).userLangId = lang || defaultLangId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid language id" });
  }
}
