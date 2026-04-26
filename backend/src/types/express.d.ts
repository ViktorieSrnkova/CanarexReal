import "express";

declare global {
  namespace Express {
    interface Request {
      langId?: number;
    }
  }
}

export {};
