const API_BASE = "";

document.getElementById("pay-btn").addEventListener("click", async () => {
  const dollars = Number(document.getElementById("amount").value || "0");
  const cents = Math.round(dollars * 100);
  const resEl = document.getElementById("payment-result");
  try {
    const r = await fetch(`${API_BASE}/api/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cents, currency: "usd" })
    });
    const data = await r.json();
    resEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resEl.textContent = "Error creando PaymentIntent";
    console.error(err);
  }
});

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  const payload = { name: f.name.value, email: f.email.value, message: f.message.value };
  const resEl = document.getElementById("contact-result");
  try {
    const r = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    resEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resEl.textContent = "Error enviando formulario";
    console.error(err);
  }
});
