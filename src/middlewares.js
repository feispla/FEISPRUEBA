const cors = require("cors");
const rateLimit = require("express-rate-limit");

function buildCorsMiddleware() {
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);
  return cors({ origin: origins.length ? origins : "*", credentials: true });
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas peticiones desde esta IP, inténtalo más tarde." }
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de pago, inténtalo más tarde." }
});

module.exports = { buildCorsMiddleware, apiLimiter, paymentLimiter };
