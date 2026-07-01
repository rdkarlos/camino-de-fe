# Lumora (antes Camino de Fe)

## URLs
- Producción: https://camino-de-fe-seven.vercel.app
- GitHub: github.com/rdkarlos/camino-de-fe

## Stack
- React + Vite + Vercel
- Firebase Auth + Firestore
- Node.js v24, Windows 10

## APIs activas
- Universalis (gratis, sin key) — lecturas del día
- API.Bible (key en código) — LBLA español, Bible ID: e3f420b9665abaeb-01
- Anthropic API — Guía Espiritual (corderito 🐑), key en Vercel env
- Firebase — project: camino-de-fe-4d9c2
- Wompi — pagos COP modo test
- Resend — emails confirmación

## Archivos clave
- src/App.jsx — código principal
- src/products.js — productos tienda
- api/gospel.js — evangelio y lecturas (Universalis)
- api/spiritual-guide.js — Guía Espiritual IA
- api/order.js — pagos Wompi
- api/confirm-payment.js — emails Resend
- public/sw.js — service worker v14 (network-first)
- public/manifest.json — PWA config

## Secciones
1. Inicio — cards compactas modo oscuro
2. Oración Personal — Crear Oración, Diario, Mis Oraciones, Conec✝2
3. Evangelio — con Guía Espiritual (corderito 🐑)
4. La Biblia — LBLA, navegación por categorías + buscador
5. Lecturas del día
6. Santo Rosario
7. Devocional
8. Tienda
9. Configuración

## Diseño
- Modo oscuro permanente
- Fondo: #0A0F1E, Cards: #111827, Header: #1B2A4A
- Dorado: #C9A84C, Texto: #FAF5ED
- Tipografía: Cinzel (títulos), Crimson Text (textos)
- Íconos SVG minimalistas católicos

## Contexto
- Carlos, Colombia, católico
- Claude Code para modificaciones directas
- Git + GitHub para versiones
- Deploy automático en Vercel con cada push

## Pendiente
- Diario de Gracias
- Dominio propio (candidato: amorae.org)
- Wompi producción
- Splash screen con logo Lumora
- Notificaciones push Conec✝2
