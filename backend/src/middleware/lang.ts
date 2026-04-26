import { type RequestHandler } from "express";

export const langMiddleware: RequestHandler = (req, _res, next) => {
  const langId = Number(req.headers["x-lang-id"]);

  if (Number.isFinite(langId)) {
    req.langId = langId;
  }

  next();
};
