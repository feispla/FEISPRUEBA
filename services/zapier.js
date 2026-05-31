const fetch = require("node-fetch");
const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

if (!zapierWebhookUrl) {
  console.warn("ZAPIER_WEBHOOK_URL no configurado — Zapier deshabilitado.");
}

async function triggerContactZap(payload) {
  if (!zapierWebhookUrl) {
    console.log("[Zapier] Saltando webhook (no configurado)");
    return;
  }
  try {
    const res = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error("[Zapier] Response error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[Zapier] Error sending webhook:", err);
  }
}

module.exports = { triggerContactZap };
