// ============================================
// Rate Limiter — Prevent API abuse
// ============================================

import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({

  windowMs:
    15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {

    success: false,

    message:
      "Too many requests, please try again later."

  },

  skip: (req) =>
    req.path === "/health"

});

export default rateLimiter;