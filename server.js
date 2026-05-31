require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { buildCorsMiddleware, apiLimiter, paymentLimiter } = require("./src/middlewares");
const { createPaymentIntent, buildStripeWebhookHandler } = require("./src/stripe");
const { sendContactEmail } = require("./src/email");
const { createSupportTicket } = require("./services/notion");
const { triggerContactZap } = require("./services/zapier");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS + JSON (except webhook)
app.use(buildCorsMiddleware());
app.use("/api", apiLimiter);
app.use(bodyParser.json());

// Static frontend
app.use(express.static(path.join(__dirname, "public")));

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Create PaymentIntent
app.post("/api/create-payment-intent", paymentLimiter, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: "amount es requerido." });
    const pi = await createPaymentIntent(amount, currency || "usd");
    res.json({ clientSecret: pi.client_secret });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ error: "Error creando PaymentIntent" });
  }
});

// Stripe webhook (raw body)
app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), buildStripeWebhookHandler());

// Contact: email + Notion + Zapier
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "name, email, message obligatorios." });

    await sendContactEmail({ name, email, message });
    await createSupportTicket({ name, email, message });
    await triggerContactZap({ name, email, message, source: "feiss-contact-form" });

    res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    res.status(500).json({ error: "No se pudo procesar el mensaje." });
  }
});

// Fallback (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FEISS server running at http://localhost:${PORT}`);
});
