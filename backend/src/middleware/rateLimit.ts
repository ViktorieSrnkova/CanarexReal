import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts, please try again later" },
});
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many registration attempts, please try again later",
  },
});
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password reset attempts, please try again later",
  },
});

export const contactFormLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many requests, try again later" },
});
