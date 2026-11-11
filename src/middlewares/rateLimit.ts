import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // Máximo de 5 tentativas por janela
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    status: "error",
    message: "Muitas tentativas de login. Tente novamente após 15 minutos.",
  },
});
