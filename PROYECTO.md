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
- Universalis (gratis, sin key) — lecturas del día (única fuente litúrgica, siempre en inglés)
- API.Bible (key en código) — LBLA español (numeración hebrea/moderna), Bible ID: e3f420b9665abaeb-01
- Anthropic API — "Ponlo en Práctica" (vértice de luz), key en Vercel env
- Firebase — project: camino-de-fe-4d9c2
- Wompi — pagos COP modo test
- Resend — emails confirmación

## Flujo de traducción de lecturas (importante)
- Universalis entrega TODO en inglés: evangelio, primera lectura, segunda lectura y salmo.
- Inglés (lang=en): usa el texto y referencia de Universalis directo.
- Español (lang=es): toma la referencia inglesa, la convierte a ID de pasaje con parseRef(), y pide la traducción a API.Bible. Las 4 secciones dependen de que parseRef() traduzca bien la referencia.
- parseRef() maneja numeración alterna de salmos con paréntesis y letra de capítulo (ej. "Psalm 113B(115)" → Salmo 115, numeración hebrea de LBLA). El número entre paréntesis es el correcto para API.Bible.
- Fallback: si parseRef() no logra traducir, se muestra mensaje sereno "Esta lectura aún no está disponible en español" + toggle opcional "Ver en inglés" (no inglés crudo por defecto).

## Archivos clave
- src/App.jsx — código principal (incluye caché de lecturas en sessionStorage y la lógica del rastro de luz de Conec✝2)
- src/theme.js — paleta de colores centralizada (única fuente de verdad)
- src/index.css — variables CSS globales de la paleta
- src/VerticeDeLuz.jsx — componente SVG del vértice de luz (motivo de marca; usado en splash, íconos y "Ponlo en Práctica")
- src/Rosario.jsx — Santo Rosario completo
- src/Devocional.jsx — Devocional: oraciones clásicas, novenas, santo del día
- src/santos.js — calendario de 365 santos
- src/versiculos.js — banco de 365 versículos bíblicos
- src/JovenFe.jsx — sección Joven Fe
- src/products.js — productos tienda
- api/gospel.js — evangelio y lecturas (Universalis + traducción API.Bible + parseRef + fallback)
- api/spiritual-guide.js — "Ponlo en Práctica" IA (sacerdote católico)
- api/cron-reflexion.js — Cron Job diario 12:10am Colombia: genera reflexión + versículo del día
- api/order.js — pagos Wompi
- api/confirm-payment.js — emails Resend
- public/sw.js — service worker v17 (network-first)
- public/manifest.json — PWA config
- vercel.json — configuración cron jobs

## Secciones
1. Inicio — versículo del día premium, saludo login, cards modo oscuro, splash screen, onboarding
2. Oración Personal — 3 cards: Mi Oración (Crear, Diario, Mis Oraciones, Conec✝2 con rastro de luz de intenciones nuevas), Santo Rosario, Devocional
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

## Conec✝2 — Rastro de luz (avisos in-app de intenciones nuevas)
- Notificación DENTRO de la app (no push del sistema, no permisos, no service worker).
- Un punto de luz cálido (Alba, estilo vértice de luz — LightDot, un <span> con glow) se enciende guiando al usuario hasta la novedad, en 4 niveles continuos: Inicio ("Oración") → Oración Personal (tarjeta "Mi Oración") → Conec✝2 → círculo específico.
- Variante elegida: solo punto, sin número (más sereno; además es un booleano simple "¿hay algo nuevo?").
- Regla honesta: el rastro se apaga SOLO al abrir el círculo con la novedad (no antes, aunque el usuario entre a la sección o a la lista). Intenciones propias nunca encienden el punto.
- Modelo de datos:
  - usuarios/{uid}.circleLastSeen: { [circleId]: Timestamp } — última visita por círculo (mapa; se lee entero en 1 sola lectura)
  - circulos/{id}.ultimaIntencionFecha + ultimaIntencionAutorId — para el chequeo barato sin consultar cada círculo (se escriben en addIntencion)
  - Backfill: círculos sin lastSeen se marcan "vistos ahora" al cargar (no inunda con intenciones viejas; usuarios existentes arrancan limpios)
  - markCircleSeen(circleId) conectado en openCircle, createCircle, joinCircleByCode, joinPublicCircle
- Costo: 1 lectura extra al cargar (el doc usuarios/{uid}); las lecturas de círculos ya ocurrían, solo se adelantan (ahora corren al iniciar sesión, no solo al entrar al tab Conec✝2).
- Segunda pasada condicional: al entrar a la lista de círculos, para círculos marcados "sospechosos" por el chequeo barato, consulta chica (fecha > lastSeen, limit 3, sin índice compuesto) para cerrar el hueco donde la intención propia podría "tapar" una ajena sin ver. En día sin actividad: cero lecturas extra.
- Auto-refresco: al volver la app a primer plano (visibilitychange → visible), con throttle de 3 min (useRef). Sin onSnapshot, sin temporizador de fondo.
- Helpers de módulo en App.jsx: toMillisSafe, circleLooksNew (chequeo barato), LightDot; estado circleLastSeen / circleLastSeenLoaded / confirmedNewCircles; hasAnyNewCircleActivity (useMemo).
- Reglas de Firestore: se agregó match explícito para el documento usuarios/{userId} (el wildcard de subcolección /{document=**} NO cubre el doc raíz). Update de circulos ya era permisivo (allow update: if request.auth != null), no requirió cambio.

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

## Historial de cambios relevantes
- Brand book Fases 1-3 aplicadas (paleta, tipografía, vértice de luz, tono, emojis)
- Fix salmos con capítulo-letra (ej. "Psalm 113B(115)" → Salmo 115) en parseRef() — resolvía regresión que dejaba el salmo en inglés los días de salmos "divididos" (113A/113B y similares). El bug era de parseRef() en general, afecta a las 4 lecturas, no solo al salmo.
- Fallback sereno + "Ver en inglés" cuando parseRef() no traduce (en vez de inglés crudo sin formato)
- Validación de caché: solo se cachea en sessionStorage si la traducción al español es válida (detector de idioma looksSpanish); respuestas rotas nunca se congelan. Clave subida gospel_v3 → gospel_v4 para invalidar respuestas viejas malas.
- Conec✝2 rastro de luz: avisos in-app de intenciones nuevas en 4 niveles (ver sección dedicada arriba). Reglas de Firestore ajustadas (match explícito de usuarios/{userId}).

## Pendiente
### Contenido
- Devocional — Novenas (contenido días 2-9 de las 4 novenas restantes)
- Joven Fe — Testimonios y Quiz Bíblico
- Diario de Gracias
- Compartir reflexión en redes sociales

### Funcionalidad — ideas a futuro
- Notificaciones push REALES del sistema (app cerrada) — la "fase 2" del rastro de luz. Más compleja: permisos, tokens por dispositivo, service worker, limitaciones en iOS PWA (solo funciona si el usuario instaló la PWA en pantalla de inicio).
- Idea futura — aviso "están orando por tu intención": notificar al autor de una intención cuando otros marcan "estoy orando" por ella ("3 personas están orando por tu intención"). Es una señal de naturaleza DISTINTA al rastro de intenciones nuevas (avisa "algo bueno pasó con lo tuyo", no "hay algo que ver"), así que conviene diseñarla como fase propia con su propio indicador, para no confundirla con el rastro de luz actual. Requiere modelo de datos aparte (contar reacciones nuevas por intención desde la última vista del autor). Evaluar después de ver cómo rueda el rastro de intenciones con usuarios reales.

### Técnico / mejoras defensivas
- Caché lecturas (reforma de fondo, baja prioridad): reconsiderar sessionStorage; evaluar localStorage por fecha con lógica de refresco. La validación actual ya cubre lo urgente.
- Consistencia fallback Evangelio: hoy lanza error 500 si falla su traducción, en vez del fallback sereno "Ver en inglés" que ya tienen las otras 3 lecturas. Darle el mismo tratamiento.
- Limpieza (baja prioridad): código muerto en translations.es/en (rosary, prayers parcial, home.greeting/reminder) — no visible al usuario.

### Seguridad Firestore (no urgente)
- Reglas de circulos e intenciones son abiertas (circulos: allow read: if true, update: if request.auth != null; intenciones: allow read: if true, write: if request.auth != null). Cualquier usuario autenticado puede editar/borrar intenciones de cualquier círculo, sea miembro o no. NO lo introdujo el rastro de luz (ya era así). Endurecer cuando se aborde seguridad a fondo.
- reflexiones: allow read/write: if true — también abierto, revisar en el mismo pase de seguridad.

### Infraestructura
- Wompi producción (hoy en modo test)
- Dominio propio (candidato: amorae.org)

### Hecho ✅
- Brand book Fases 1-3
- Fix salmos capítulo-letra + fallback + validación de caché
- Versículo del día — banco 365 conectado + cron genera versículo desde evangelio
- Conec✝2 rastro de luz (avisos in-app de intenciones nuevas)