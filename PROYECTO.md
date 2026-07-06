# Lumora (antes Camino de Fe)

## URLs
- Producción: https://camino-de-fe-seven.vercel.app
- GitHub: github.com/rdkarlos/camino-de-fe
- Local: C:\Users\rdkar\camino-de-fe

## Stack
- React + Vite + Vercel
- Firebase Auth + Firestore
- Node.js v24, Windows 10

## APIs activas
- Universalis (gratis, sin key) — lecturas del día
- API.Bible (key en código) — LBLA español, Bible ID: e3f420b9665abaeb-01
- Anthropic API — "Ponlo en Práctica" (corderito 🐑), key en Vercel env
- Firebase — project: camino-de-fe-4d9c2
- Wompi — pagos COP modo test
- Resend — emails confirmación

## Archivos clave
- src/App.jsx — código principal
- src/Rosario.jsx — Santo Rosario completo
- src/Devocional.jsx — Devocional: oraciones clásicas, novenas, santo del día
- src/santos.js — calendario de 365 santos
- src/versiculos.js — banco de 365 versículos bíblicos
- src/JovenFe.jsx — sección Joven Fe
- src/products.js — productos tienda
- api/gospel.js — evangelio y lecturas (Universalis)
- api/spiritual-guide.js — "Ponlo en Práctica" IA (sacerdote católico)
- api/cron-reflexion.js — Cron Job diario 12:10am Colombia: genera reflexión + versículo del día
- api/order.js — pagos Wompi
- api/confirm-payment.js — emails Resend
- public/sw.js — service worker v15 (network-first)
- public/manifest.json — PWA config
- vercel.json — configuración cron jobs

## Secciones
1. Inicio — versículo del día premium, saludo login, cards modo oscuro, splash screen, onboarding
2. Oración Personal — 3 cards: Mi Oración (Crear, Diario, Mis Oraciones, Conec✝2), Santo Rosario, Devocional
3. Evangelio — con "Ponlo en Práctica" (corderito 🐑), skeleton loader
4. La Biblia — LBLA, navegación por categorías + buscador
5. Lecturas del día
6. Santo Rosario — 4 partes, 35 pantallas, misterios del día automáticos, contador Ave Marías
7. Devocional — Oraciones Clásicas (12), Novenas (5, contenido días 2-9 pendiente), Santo del Día (365 santos)
8. Tienda — en construcción
9. Configuración
10. Joven Fe — Retos de Fe (30 días), Testimonios, Quiz Bíblico

## Diseño
- Modo oscuro permanente
- Fondo: #0A0F1E, Cards: #111827, Header: #1B2A4A
- Dorado: #C9A84C, Texto: #FAF5ED
- Tipografía: Cinzel (títulos), Crimson Text (textos)
- Íconos SVG minimalistas católicos
- Micro-animaciones entre secciones
- Skeleton loader en Evangelio

## Variables de entorno en Vercel
- ANTHROPIC_API_KEY — API de Anthropic
- CRON_SECRET — seguridad del cron job

## Contexto
- Carlos, Colombia, católico
- Claude Code para modificaciones directas
- Git + GitHub para versiones
- Deploy automático en Vercel con cada push

## Pendiente
- Devocional — Novenas (contenido días 2-9)
- Joven Fe — Testimonios y Quiz Bíblico pendientes
- Diario de Gracias
- Versículo del día — banco 365 + cron genera versículo relacionado con evangelio
- Compartir reflexión en redes sociales
- Notificaciones push (Conec✝2 y recordatorio diario)
- Dominio propio (candidato: amorae.org)
- Wompi producción