const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amount, currency = "usd") {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
  return paymentIntent;
}

function buildStripeWebhookHandler() {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  return (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object.id);
        break;
      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        break;
      default:
        console.log("Stripe event:", event.type);
    }

    res.json({ received: true });
  };
}

module.exports = { createPaymentIntent, buildStripeWebhookHandler };
