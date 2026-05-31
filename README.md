# FEISS Showcase Store — Guía e Implementación (Repositorio)

Proyecto de ejemplo: backend Express con integraciones Stripe, Notion y Zapier, plus un frontend estático minimal para pruebas.

Estructura principal:
- server.js
- src/ (stripe, email, middlewares)
- services/ (notion, zapier)
- public/ (index.html, main.js)
- .env.example
- package.json

Comandos:
- Instalar dependencias: npm install
- Ejecutar en dev: npm run dev
- Probar endpoints: /api/health, /api/create-payment-intent, /api/contact

Antes de ejecutar:
1. Copiar .env.example -> .env y rellenar valores.
2. No subir .env con secretos al repo.

Más detalles en el README del proyecto original.
