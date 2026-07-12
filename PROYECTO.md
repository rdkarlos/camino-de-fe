# Lumora (antes Camino de Fe)

## URLs
- Producción: https://camino-de-fe-seven.vercel.app
- GitHub: github.com/rdkarlos/camino-de-fe
- Local: C:\Users\rdkar\camino-de-fe

## Stack
- React + Vite + Vercel (plan Hobby)
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
- Español (lang=es): toma la referencia inglesa, la convierte a ID de pasaje con parseRef(), y pide la traducción a API.Bible.
- parseRef() maneja numeración alterna de salmos con paréntesis y letra de capítulo (ej. "Psalm 113B(115)" → Salmo 115, numeración hebrea de LBLA). El número entre paréntesis es el correcto para API.Bible.
- Fallback: si parseRef() no logra traducir, mensaje sereno "Esta lectura aún no está disponible en español" + toggle "Ver en inglés".

## Cron de reflexión diaria — arquitectura (IMPORTANTE)
- api/cron-reflexion.js y api/spiritual-guide.js usan **firebase-admin** (SDK de servidor), NO el SDK de cliente.
- Motivo: el SDK de cliente corre anónimo en funciones serverless y Firestore lo rechaza. El SDK admin omite las reglas por diseño.
- Credencial: `FIREBASE_SERVICE_ACCOUNT_BASE64` en Vercel. NUNCA en el repo (.gitignore protege `*firebase-adminsdk*.json`, `serviceAccountKey.json`, `service-account*.json`, `*-base64.txt`).
- Detalle de migración: en el SDK admin, `snapshot.exists` es PROPIEDAD (sin paréntesis), no función.
- **Bug histórico resuelto (11 jul 2026):** el cron NUNCA había escrito por sí solo. El contenido que aparecía algunos días lo guardaba un usuario logueado al abrir "Ponlo en Práctica" (setDoc desde el navegador).
- Disparo manual: `curl -i -H "Authorization: Bearer $CRON_SECRET" https://camino-de-fe-seven.vercel.app/api/cron-reflexion`
- ✅ VERIFICADO (12 jul 2026): el cron de Vercel SÍ se dispara solo en plan Hobby. Corrió a las 12:10am Colombia sin intervención y escribió las reflexiones del día. Si en el futuro falla la puntualidad, las opciones siguen siendo: disparador externo (cron-job.org) o plan Pro.

## Archivos clave
- src/App.jsx — código principal (caché de lecturas, rastro de luz de Conec✝2, tarjetas de Inicio)
- src/theme.js — paleta centralizada (única fuente de verdad)
- src/index.css — variables CSS globales
- src/VerticeDeLuz.jsx — componente SVG del vértice de luz (motivo de marca)
- src/Rosario.jsx — Santo Rosario (alineado a fuente oficial Santa Sede)
- src/Devocional.jsx — oraciones clásicas, novenas, santo del día (exporta getSantoHoy, acepta prop initialTab)
- src/santos.js — 366 santos, cada uno con campo `bio` (62-133 caracteres)
- src/versiculos.js — banco de 365 versículos
- src/JovenFe.jsx — sección Joven Fe
- src/products.js — productos tienda
- api/gospel.js — evangelio y lecturas (Universalis + API.Bible + parseRef + fallback)
- api/spiritual-guide.js — "Ponlo en Práctica" IA + limpieza de reflexiones viejas (firebase-admin)
- api/cron-reflexion.js — Cron diario 12:10am Colombia: reflexión + versículo (firebase-admin)
- api/order.js — pagos Wompi
- api/confirm-payment.js — emails Resend
- public/sw.js — service worker v17 (network-first)
- public/manifest.json — PWA config
- vercel.json — cron jobs (schedule "10 5 * * *" = 5:10 UTC = 00:10 Colombia)

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo del Día → Evangelio del Día → Santo del Día. Separador. Bloque "Tu camino": Oración Personal → Joven Fe
2. Oración Personal — Mi Oración (Crear, Diario, Mis Oraciones, Conec✝2), Santo Rosario, Devocional
3. Evangelio — "Ponlo en Práctica" (vértice de luz), skeleton loader
4. La Biblia — LBLA, categorías + buscador
5. Lecturas del día
6. Santo Rosario — ver sección dedicada abajo
7. Devocional — Oraciones Clásicas (12), Novenas (5, días 2-9 pendientes), Santo del Día (366 santos)
8. Tienda — en construcción
9. Configuración
10. Joven Fe — Retos de Fe (30 días), Testimonios, Quiz Bíblico

## Santo Rosario — alineado a fuente oficial (Santa Sede)
- Fuente: vatican.va — nombres oficiales de los 20 misterios + citas bíblicas
- **Misterio del día anclado a America/Bogota** (bug corregido: antes usaba `new Date().getDay()`, la hora del dispositivo). Implementado con `Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short' })` — locale fijo en en-US para que no dependa del idioma del dispositivo.
  - Lunes/sábado: gozosos · Martes/viernes: dolorosos · Miércoles/domingo: gloriosos · Jueves: luminosos
- **Estructura por misterio (español), 6 pasos:** Anuncio (nombre oficial) → **Meditación (cita bíblica)** → Padre Nuestro → 10 Ave Marías → Gloria → Jaculatoria. Total: 40 pantallas.
- **Inglés: 5 pasos, SIN meditación** — pendiente conseguir las citas bíblicas oficiales en inglés. NO inventar traducciones.
- **Pantalla de meditación:** sin header, cita en cursiva (Work Sans, interlineado 2.0), referencia discreta al pie, VerticeDeLuz arriba, resplandor de fondo intensificado (0.06 → 0.14). Sin auto-avance ni prisa.
- **Contador de Avemarías — "la luz que crece":** anillo de 10 cuentas alrededor del círculo central (ringRadius 104px). Rezadas en Alba sólido, pendientes al 22%. El círculo central se enciende progresivamente: alpha 0.55 → 1.0, halo 14px → 40px, transición CSS 0.4s ease. La décima cuenta culmina en resplandor pleno (aprovecha la pausa de 400ms del auto-avance).
- **Sin contadores de pasos en texto** — solo la barra de progreso silenciosa y la insignia "✦ Hoy rezamos los: [misterios]".
- **Textos litúrgicos: copiados LITERAL** de la Santa Sede (comillas angulares «», espaciado exacto de referencias — la fuente varía entre "Lc 1,26-27" y "Lc 1, 39-42"). No normalizar, no "mejorar".
- NOTA: La Biblia SÍ conserva su estado de navegación entre visitas (9 estados: bibleView, bibleSelectedBook, etc.). Es deliberado — funciona como marcador de lectura: si estás en Juan 15 y sales un momento, al volver sigues en Juan 15. Es lo contrario del caso de Devocional, donde volver a entrar no cuesta nada.

## Diseño (brand book — Fases 1, 2 y 3 aplicadas)
- Modo oscuro permanente
- Paleta oficial (6 colores canónicos):
  - Noche #1E2630 · Card #28313D · Luz del Alba #E8B45C · Lino #F5F1E8 · Cielo #7E97AB · Piedra #B8AE9C
- Derivados (no oficiales): ALBA_LIGHT #EEC785, ALBA_DARK #A0711F, NOCHE_DARK #151B22
- Header: fundido con el fondo + borde inferior 1px Piedra al 20%
- Colores centralizados: src/theme.js (JS) + :root en src/index.css (CSS)
- Tipografía: Cormorant 500/600 (títulos), Work Sans 400/500 (interfaz)
- theme-color y background_color: #1E2630
- Motivo "vértice de luz": punto cálido en Alba con halo radial (VerticeDeLuz.jsx, IDs únicos vía useId)
- Íconos PWA y splash con el vértice de luz
- Tono: tuteo, invitar sin ordenar, español neutro, sin emojis pictóricos (símbolos ✦ ✝ ♡ ✓ sí)

## Inicio — estructura de tarjetas
- **Bloque "Hoy"** (contenido diario, agrupado): Versículo del Día → Evangelio del Día → Santo del Día
- **Separador**: línea 1px Piedra al 12%
- **Bloque "Tu camino"**: Oración Personal → Joven Fe
- **Tarjeta Santo del Día** (nueva): SIN imagen de fondo — usa el motivo del vértice de luz (círculos concéntricos difusos en Alba, esquina superior derecha). Decisión deliberada: evita necesitar 366 imágenes con derechos, y es coherente con el brand book ("el peso simbólico lo lleva la luz, no el catálogo religioso"). Muestra nombre + bio (line-clamp 2 líneas) + "Conocer su vida ›"
- Al tocar la tarjeta, abre Devocional con el tab "Santo del Día" ya activo (prop `initialTab`). El Santo del Día **sigue existiendo en Devocional** — es una segunda puerta, no un traslado. Verificado: no hay fuga de estado entre las dos rutas.
- Evangelio, Oración Personal y Joven Fe conservan sus imágenes de fondo

## Conec✝2 — Rastro de luz (avisos in-app de intenciones nuevas)
- Notificación DENTRO de la app (no push, no permisos, no service worker)
- Punto de luz (LightDot) en 4 niveles: Inicio ("Oración") → Oración Personal ("Mi Oración") → Conec✝2 → círculo específico
- Sin número, solo punto (booleano "¿hay algo nuevo?")
- **Regla honesta:** se apaga SOLO al abrir el círculo con la novedad. Intenciones propias nunca lo encienden.
- Modelo de datos:
  - usuarios/{uid}.circleLastSeen: { [circleId]: Timestamp } — mapa, 1 sola lectura
  - circulos/{id}.ultimaIntencionFecha + ultimaIntencionAutorId — chequeo barato sin consultar cada círculo
  - Backfill: círculos sin lastSeen se marcan "vistos ahora" al cargar
- Costo: 1 lectura extra al cargar
- Segunda pasada condicional: al entrar a la lista, para círculos "sospechosos", consulta chica (fecha > lastSeen, limit 3, sin índice compuesto) — cierra el hueco donde la intención propia podría tapar una ajena
- Auto-refresco: visibilitychange → visible, throttle 3 min. Sin onSnapshot.
- Reglas de Firestore: match explícito para el doc usuarios/{userId} (el wildcard /{document=**} NO cubre el doc raíz)

## Brand book — plan de ejecución
- ✅ Fase 1 — paleta + tipografía + centralización en theme.js
- ✅ Fase 2 — splash, vértice de luz, íconos PWA
- ✅ Fase 3 — textos y tono, retiro de emojis pictóricos, sw v17
- ⬜ Fase 4 (opcional) — emojis ilustrativos de pantallas vacías (📖 🙏 🌍 🔑 🕯️ ✝️ 👥) → SVG propios

## Variables de entorno en Vercel
- ANTHROPIC_API_KEY
- CRON_SECRET — autenticación del cron (rotado 11 jul 2026)
- FIREBASE_SERVICE_ACCOUNT_BASE64 — cuenta de servicio (credencial privilegiada, acceso total)
- IMPORTANTE: cambios en env vars requieren REDEPLOY para tomar efecto

## Contexto
- Carlos, Colombia, católico
- Claude Code para modificaciones directas
- Git + GitHub · Deploy automático en Vercel con cada push
- Buena práctica: `git diff` antes del push para revisar qué se sube

## Historial de cambios relevantes
- Brand book Fases 1-3
- Fix salmos con capítulo-letra en parseRef() + fallback sereno + validación de caché (gospel_v4)
- Conec✝2 rastro de luz (4 niveles)
- Migración a firebase-admin — cron de reflexión diaria FUNCIONANDO (bug histórico)
- Rosario: misterios oficiales Santa Sede + pantalla de meditación + anillo "luz que crece" + zona horaria Bogotá
- Inicio: bloque "Hoy" con Santo del Día
- Navegación: goToTab() centralizado resetea sub-estados; Rosario persiste en localStorage y ofrece retomar

## Pendiente
### Inmediato


### Contenido
- Devocional — Novenas (días 2-9 de las 4 restantes). El texto debe venir de fuente católica confiable, NO generado.
- Joven Fe — Testimonios y Quiz Bíblico
- Diario de Gracias
- Compartir reflexión en redes sociales
- Rosario: citas bíblicas oficiales en INGLÉS (fuente: vatican.va en inglés)
- Rosario: evaluar agregar "Dios mío, ven en mi auxilio" al inicio (la fuente lo incluye, la app no)
- Rosario: evaluar letanías lauretanas al final (la fuente las incluye, la app no)

### Funcionalidad — ideas a futuro
- Notificaciones push REALES del sistema (app cerrada) — fase 2 del rastro de luz. Compleja: permisos, tokens, iOS PWA.
- Aviso "están orando por tu intención" — señal DISTINTA al rastro actual, diseñarla como fase propia
- Monetización — **Fase 0 pendiente: definir modelo.** Dirección elegida: productos con nombre propio (Cumbre = retiros, Aurora = música), no "premium de la app". Lo esencial siempre gratis. ANTES de cobrar: cerrar reglas de Firestore (ver Seguridad).

### Distribución — pendiente estratégico
- Hoy Lumora es PWA instalable, pero SIN presencia en tiendas.
- **Problema real:** en iPhone, instalar una PWA requiere 5 pasos ocultos en Safari (Compartir → Añadir a pantalla de inicio). Apple NO permite botón de instalación. La mayoría de usuarios iOS probablemente nunca la instalan.
- En Android sí se puede: evento `beforeinstallprompt` permite un botón propio de "Instalar Lumora".
- **Paso intermedio posible:** guía de instalación in-app que detecte el dispositivo y muestre los pasos correctos (con el ícono de Compartir dibujado, no descrito). Mostrarla a usuarios recurrentes, no a recién llegados.
- **Solución de raíz:** empaquetar la PWA para tiendas (Bubblewrap para Android, Capacitor para ambos). Reutiliza el código React actual.
  - Costos: cuenta Apple ~$99/año, Google Play ~$25 una vez.
  - Apple rechaza "webs envueltas" — hay que agregar valor nativo (push, funciones del dispositivo).
  - OJO MONETIZACIÓN: si se vende contenido dentro de la app, Apple/Google cobran 15-30% de comisión. Afecta la economía del premium.
- **Orden recomendado:** terminar contenido → cerrar seguridad Firestore → validar con usuarios por PWA → entonces empaquetar.
- Ventaja actual de la PWA: el despliegue es instantáneo (push → Vercel → usuarios). En tiendas, cada actualización pasa por revisión.

### Técnico / mejoras defensivas
- Caché lecturas: reconsiderar sessionStorage; evaluar localStorage por fecha
- Consistencia fallback Evangelio: hoy lanza error 500 si falla su traducción, las otras 3 lecturas tienen fallback sereno
- Limpieza (baja prioridad): código muerto en translations.es/en

### Seguridad Firestore (no urgente, pero OBLIGATORIO antes de monetizar)
- Reglas de circulos e intenciones abiertas: cualquier usuario autenticado puede editar/borrar intenciones de cualquier círculo, sea miembro o no
- reflexiones: allow read/write: if true — abierto
- El SDK admin del cron NO depende de estas reglas, así que endurecerlas no lo rompería

### Infraestructura
- Wompi producción (hoy en test)
- Dominio propio (candidato: amorae.org)

### Hecho ✅
- Brand book Fases 1-3
- Fix salmos + fallback + validación de caché
- Versículo del día (banco 365 + cron)
- Conec✝2 rastro de luz
- - Migración firebase-admin — cron funcionando y VERIFICADO en producción (se dispara solo)
- Rosario alineado a Santa Sede (misterios, meditación, anillo, zona horaria)
- Santo del Día en Inicio + bloque "Hoy"
- Navegación: reset de estado al cambiar de sección + retomar Rosario en curso (localStorage, anclado a Bogotá, no ofrece rosarios de otro día)