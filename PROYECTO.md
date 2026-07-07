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
- Anthropic API — "Ponlo en Práctica" (vértice de luz), key en Vercel env
- Firebase — project: camino-de-fe-4d9c2
- Wompi — pagos COP modo test
- Resend — emails confirmación

## Archivos clave
- src/App.jsx — código principal
- src/theme.js — paleta de colores centralizada (única fuente de verdad)
- src/index.css — variables CSS globales de la paleta
- src/VerticeDeLuz.jsx — componente SVG del vértice de luz (motivo de marca; usado en splash, íconos y "Ponlo en Práctica")
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
- public/sw.js — service worker v17 (network-first)
- public/manifest.json — PWA config
- vercel.json — configuración cron jobs

## Secciones
1. Inicio — versículo del día premium, saludo login, cards modo oscuro, splash screen, onboarding
2. Oración Personal — 3 cards: Mi Oración (Crear, Diario, Mis Oraciones, Conec✝2), Santo Rosario, Devocional
3. Evangelio — con "Ponlo en Práctica" (vértice de luz), skeleton loader
4. La Biblia — LBLA, navegación por categorías + buscador
5. Lecturas del día
6. Santo Rosario — 4 partes, 35 pantallas, misterios del día automáticos, contador Ave Marías
7. Devocional — Oraciones Clásicas (12), Novenas (5, contenido días 2-9 pendiente), Santo del Día (365 santos)
8. Tienda — en construcción
9. Configuración
10. Joven Fe — Retos de Fe (30 días), Testimonios, Quiz Bíblico

## Diseño (brand book — Fases 1, 2 y 3 aplicadas)
- Modo oscuro permanente
- Paleta oficial (6 colores canónicos):
  - Noche #1E2630 — fondo principal
  - Card #28313D — tarjetas
  - Luz del Alba #E8B45C — dorado principal
  - Lino #F5F1E8 — texto
  - Cielo #7E97AB — textos secundarios, subtítulos, iconos inactivos
  - Piedra #B8AE9C — bordes, divisores, estados neutros
- Tonos derivados (no oficiales del brand book): ALBA_LIGHT #EEC785, ALBA_DARK #A0711F, NOCHE_DARK #151B22
- Header: fundido con el fondo (sólido Noche) + borde inferior 1px Piedra al 20%
- Colores centralizados: src/theme.js (JS) + :root en src/index.css (CSS) — todo cambio de paleta se hace SOLO ahí
- Tipografía: Cormorant 500/600 (títulos), Work Sans 400/500 (textos e interfaz)
- theme-color: #1E2630 (index.html y manifest.json)
- background_color del manifest: #1E2630 (arranque oscuro sin flash)
- Motivo de marca "vértice de luz": punto cálido en Alba con halo radial (src/VerticeDeLuz.jsx, IDs de gradiente únicos vía useId)
- Íconos PWA: vértice de luz sobre degradado noche ascendente (favicon.svg, icon-192.png, icon-512.png), sin cruz ni texto
- Splash: degradado tres paradas (resplandor cálido → Noche → Noche oscuro) + fade-in del vértice, "Lumora" en Cormorant
- Tono de textos: tuteo, invitar sin ordenar, español neutro, sin emojis pictóricos en interfaz (se conservan símbolos minimalistas ✦ ✝ ♡ ✓)
- Íconos SVG minimalistas católicos
- Micro-animaciones entre secciones
- Skeleton loader en Evangelio

## Brand book — plan de ejecución
- ✅ Fase 1 — paleta nueva + tipografía (Cormorant/Work Sans) + centralización en theme.js
- ✅ Fase 2 — degradado noche→alba en splash, vértice de luz como motivo e ícono PWA, background_color del manifest a #1E2630
- ✅ Fase 3 — revisión de textos y tono (tutear, invitar sin ordenar), corderito 🐑 → vértice de luz, retiro de emojis pictóricos, service worker a v17
- ⬜ Fase 4 (opcional) — reemplazar emojis ilustrativos grandes de pantallas vacías (📖 🙏 🌍 🔑 🕯️ ✝️ 👥) por SVG minimalistas propios

## Variables de entorno en Vercel
- ANTHROPIC_API_KEY — API de Anthropic
- CRON_SECRET — seguridad del cron job

## Contexto
- Carlos, Colombia, católico
- Claude Code para modificaciones directas
- Git + GitHub para versiones
- Deploy automático en Vercel con cada push

## Pendiente
- Brand book — Fase 4 opcional (íconos ilustrativos de pantallas vacías; ver plan arriba)
- Limpieza futura (baja prioridad): código muerto en translations.es/en (rosary, prayers parcial, home.greeting/reminder) — no visible al usuario
- Devocional — Novenas (contenido días 2-9)
- Joven Fe — Testimonios y Quiz Bíblico pendientes
- Diario de Gracias
- Versículo del día ✅ — banco 365 conectado + cron genera versículo desde evangelio
- Compartir reflexión en redes sociales
- Notificaciones push (Conec✝2 y recordatorio diario)
- Dominio propio (candidato: amorae.org)
- Wompi producción