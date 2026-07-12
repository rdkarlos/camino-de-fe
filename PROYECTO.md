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
- Universalis — lecturas del día (única fuente litúrgica, siempre en inglés)
- API.Bible — LBLA español (numeración hebrea), Bible ID: e3f420b9665abaeb-01
- Anthropic API — "Ponlo en Práctica"
- Firebase — project: camino-de-fe-4d9c2
- Wompi — pagos COP modo test
- Resend — emails confirmación

## Flujo de traducción de lecturas
- Universalis entrega TODO en inglés. Para español: parseRef() convierte la referencia inglesa a ID de pasaje y pide la traducción a API.Bible.
- parseRef() maneja numeración alterna de salmos con letra de capítulo (ej. "Psalm 113B(115)" → Salmo 115). El número entre paréntesis es el correcto.
- Fallback: mensaje sereno "Esta lectura aún no está disponible en español" + toggle "Ver en inglés".

## Cron de reflexión diaria — arquitectura (IMPORTANTE)
- api/cron-reflexion.js y api/spiritual-guide.js usan **firebase-admin**, NO el SDK de cliente.
- Motivo: el SDK de cliente corre anónimo en serverless y Firestore lo rechaza. El admin SDK omite las reglas por diseño.
- Credencial: `FIREBASE_SERVICE_ACCOUNT_BASE64` en Vercel. NUNCA en el repo.
- Detalle: en admin SDK, `snapshot.exists` es PROPIEDAD (sin paréntesis).
- **Bug histórico resuelto (11 jul 2026):** el cron NUNCA había escrito por sí solo. El contenido que aparecía lo guardaba un usuario logueado al abrir "Ponlo en Práctica".
- ✅ **VERIFICADO (12 jul 2026):** el cron SÍ se dispara solo en plan Hobby.
- Disparo manual: `curl -i -H "Authorization: Bearer $CRON_SECRET" https://camino-de-fe-seven.vercel.app/api/cron-reflexion`

## Seguridad Firestore — reglas endurecidas (12 jul 2026) ✅
- **usuarios/{uid} y subcolecciones:** solo el propio usuario
- **reflexiones, versiculos, parroquias:** lectura pública, **escritura BLOQUEADA** (`if false`). Solo el servidor escribe vía firebase-admin.
- **circulos:** lectura pública (para unirse por código). Update limitado a `hasOnly(['miembros', 'ultimaIntencionFecha', 'ultimaIntencionAutorId'])` y solo miembros. Delete solo el creador.
- **circulos/{id}/intenciones:** SOLO miembros. Create requiere `autorId == request.auth.uid`. Delete: el autor o el creador (modera).
- Funciones auxiliares: `estaAutenticado()`, `esMiembro(circuloId)`, `esCreador(circuloId)`
- **Verificado en producción:** sin cuenta se ve versículo/evangelio/lecturas; con cuenta funcionan círculos, intenciones, rastro de luz y moderación.

## Archivos clave
- src/App.jsx — código principal (caché lecturas, rastro de luz, tarjetas de Inicio, parroquias)
- src/theme.js — paleta centralizada
- src/index.css — variables CSS globales
- src/VerticeDeLuz.jsx — motivo de marca
- src/Rosario.jsx — alineado a fuente oficial Santa Sede
- src/Devocional.jsx — oraciones, novenas, santo del día (exporta getSantoHoy, prop initialTab)
- src/santos.js — 366 santos con campo `bio`
- src/versiculos.js — banco de 365 versículos
- src/JovenFe.jsx
- src/products.js
- seed-parroquias.mjs — script de carga de parroquias (usa firebase-admin)
- api/gospel.js — evangelio y lecturas
- api/spiritual-guide.js — "Ponlo en Práctica" (firebase-admin)
- api/cron-reflexion.js — cron diario (firebase-admin)
- api/order.js, api/confirm-payment.js
- public/sw.js — service worker v17 (network-first)
- vercel.json — cron "10 5 * * *" = 00:10 Colombia

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo → Evangelio → Santo del Día → Misas de tu parroquia. Separador. Bloque "Tu camino": Oración Personal → Joven Fe
2. Oración Personal — Mi Oración (Crear, Diario, Mis Oraciones, Conec✝2), Rosario, Devocional
3. Evangelio — "Ponlo en Práctica"
4. La Biblia — LBLA
5. Lecturas del día
6. Santo Rosario
7. Devocional — Oraciones Clásicas (12), Novenas (5, días 2-9 pendientes), Santo del Día
8. Tienda — en construcción
9. Configuración — incluye "Tu parroquia"
10. Joven Fe

## Parroquias — misas (nuevo, 12 jul 2026)
- **Colección `parroquias` en Firestore.** Datos del directorio oficial de la Diócesis de Zipaquirá.
- Campos: nombre, municipio, arciprestazgo, direccion, telefono, whatsapp, correo, `horarioMisas`, horarioAtencion, `fuente`, `fuenteFecha`
- **`horarioMisas`:** objeto por día de la semana; cada día tiene array de misas. **Cada misa es `{hora, lugar?}`** — el lugar solo si NO es en la iglesia principal (ej. Santísima Trinidad tiene misa en el Cementerio los sábados y en el Salón comunal de La Palma los domingos). Sin ese campo, mandaríamos gente al sitio equivocado.
- **3 parroquias cargadas (Cajicá):** Virgen del Rosario de Calahorra, Inmaculada Concepción, Santísima Trinidad. Falta San José de Ríogrande (no se pudieron extraer sus horarios).
- **Parroquia del usuario:** campo `parroquiaId` en `usuarios/{uid}`. Una sola parroquia, editable.
- **Selección:** en Configuración, sección "Tu parroquia" (gateada por login).
- **Tarjeta en Inicio** (cierra el bloque "Hoy"), tres estados:
  - Sin parroquia: invitación con vértice de luz — *"La misa es la fuente y la cumbre. Elige tu parroquia y que el camino al altar nunca te quede lejos."*
  - Con parroquia: misas de hoy en pastillas (con lugar si aplica)
  - Expandido: la semana, días consecutivos agrupados, hoy resaltado en Alba
- **Día actual anclado a America/Bogota.**
- **La agrupación de días NO sobregeneraliza** (verificado: en Calahorra el lunes queda separado porque su horario difiere).
- **La fuente NO se muestra en la tarjeta** (rompía el tono). Vive en Configuración, con copy cálido: *"Estos horarios vienen del directorio de la Diócesis de Zipaquirá, actualizado el 12 de julio de 2026. Si algo cambió, escríbenos y lo corregimos."*
- **Reglas:** `allow read: if true; allow write: if false;` — solo el seed script (admin) escribe.

## Santo Rosario — alineado a Santa Sede
- Fuente: vatican.va — 20 misterios oficiales + citas bíblicas
- **Misterio del día anclado a America/Bogota** (`Intl.DateTimeFormat('en-US', {timeZone, weekday:'short'})` — locale fijo)
  - Lunes/sábado: gozosos · Martes/viernes: dolorosos · Miércoles/domingo: gloriosos · Jueves: luminosos
- **6 pasos (español):** Anuncio → **Meditación (cita bíblica)** → Padre Nuestro → 10 Ave Marías → Gloria → Jaculatoria. 40 pantallas.
- **Inglés: 5 pasos, SIN meditación** — pendiente conseguir citas oficiales en inglés. NO inventar traducciones.
- **Meditación:** sin header, cita en cursiva (interlineado 2.0), referencia al pie, VerticeDeLuz arriba, resplandor intensificado. Sin prisa.
- **Contador "luz que crece":** anillo de 10 cuentas; el círculo central se enciende progresivamente (alpha 0.55→1.0, halo 14→40px, transición 0.4s). La décima culmina en resplandor pleno.
- **Sin contadores de pasos en texto.**
- **Persistencia:** localStorage (`lumora_rosario_progress_v1`) con {date, mysteryKey, pageIndex, aveCounts}. Ofrece retomar solo si es de HOY y del misterio de hoy. Un rosario de ayer se ignora en silencio.
- **Textos litúrgicos copiados LITERAL** (comillas angulares «», espaciado exacto de referencias). No normalizar.

## Navegación
- `goToTab(i)` centralizado resetea `personalSection`, `personalTab`, `devocionalInitialTab` al cambiar de sección. Cada entrada arranca limpia.
- **EXCEPCIÓN — La Biblia:** conserva su estado (bibleView, bibleSelectedBook, etc.). **Es deliberado** — funciona como marcador de lectura: si estás en Juan 15 y sales, vuelves a Juan 15. Lo contrario de Devocional, donde volver a entrar no cuesta nada.

## Conec✝2 — Rastro de luz
- Aviso in-app (no push, no permisos)
- Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo
- **Regla honesta:** se apaga SOLO al abrir el círculo con la novedad. Lo propio nunca lo enciende.
- Datos: `usuarios/{uid}.circleLastSeen` (mapa) + `circulos/{id}.ultimaIntencionFecha`/`ultimaIntencionAutorId`
- Segunda pasada condicional cierra el hueco donde la intención propia tapa una ajena
- Auto-refresco: visibilitychange, throttle 3 min. Sin onSnapshot.

## Diseño (brand book — Fases 1-3 ✅)
- Paleta: Noche #1E2630 · Card #28313D · Alba #E8B45C · Lino #F5F1E8 · Cielo #7E97AB · Piedra #B8AE9C
- Derivados: ALBA_LIGHT #EEC785, ALBA_DARK #A0711F, NOCHE_DARK #151B22
- Centralizados en src/theme.js + :root en index.css
- Tipografía: Cormorant (títulos), Work Sans (interfaz)
- Vértice de luz: motivo de marca (splash, íconos PWA, Ponlo en Práctica, Santo del Día, Parroquia)
- Tono: tuteo, invitar sin ordenar, español neutro, sin emojis pictóricos
- ⬜ Fase 4 (opcional): emojis ilustrativos de pantallas vacías → SVG propios

## Variables de entorno en Vercel
- ANTHROPIC_API_KEY
- CRON_SECRET (rotado 11 jul 2026)
- FIREBASE_SERVICE_ACCOUNT_BASE64 (rotado 12 jul 2026)
- **Cambios en env vars requieren REDEPLOY**

## Contexto
- Carlos, Colombia, católico. Parroquia: Virgen del Rosario de Calahorra (Cajicá), Diócesis de Zipaquirá
- Claude Code para modificaciones · Git + GitHub · Vercel auto-deploy
- Buena práctica: `git diff` antes del push

## Pendiente
### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** No venderle: preguntarle si los horarios están correctos y escuchar qué necesita. Señal real de interés = que cuente un problema sin que se lo pregunten.
- Aprendizaje clave: **WhatsApp es la competencia** (el padre publica ahí, solo él). WhatsApp es el FLUJO (lo que pasó); Lumora sería el ESTADO (lo que ES, siempre visible). No competir con el flujo — dar lo que el flujo no puede: permanencia y estructura.
- Canal para "escríbenos" (hoy el copy lo promete pero no existe)
- San José de Ríogrande (falta extraer horarios)
- Más parroquias de la diócesis
- Panel del párroco — SOLO si el padre lo pide. Modelo: invitación (tú creas la parroquia, le das código), no registro abierto.
- Permiso de la diócesis para usar sus datos (conversación a tener temprano)

### Contenido
- Novenas días 2-9 (4 restantes). Texto de fuente católica confiable, NO generado.
- Joven Fe — Testimonios y Quiz Bíblico
- Diario de Gracias
- Rosario: citas bíblicas oficiales en INGLÉS
- Rosario: evaluar "Dios mío, ven en mi auxilio" al inicio y letanías lauretanas al final

### Funcionalidad — futuro
- Push notifications reales (compleja: permisos, tokens, iOS PWA)
- Aviso "están orando por tu intención" (señal distinta al rastro actual — fase propia)
- Monetización — **Fase 0: definir modelo.** Dirección: productos con nombre propio (Cumbre = retiros, Aurora = música), no "premium de la app". Lo esencial siempre gratis.

### Distribución
- PWA instalable, pero SIN tiendas. **En iPhone instalar requiere 5 pasos ocultos en Safari** — Apple no permite botón. La mayoría de usuarios iOS probablemente nunca la instalan.
- Android sí permite botón (`beforeinstallprompt`)
- Paso intermedio: guía de instalación in-app que detecte el dispositivo
- Solución de raíz: empaquetar (Bubblewrap/Capacitor). Costos: Apple ~$99/año, Google ~$25.
- **OJO:** Apple/Google cobran 15-30% de comisión si se vende dentro de la app.

### Técnico
- Fallback Evangelio: lanza 500 si falla la traducción (las otras 3 lecturas tienen fallback sereno)
- Caché lecturas: reconsiderar sessionStorage
- Limpieza: código muerto en translations, 2 cuentas de prueba en Authentication, 4 claves de servicio en Firebase (revocar las no usadas)

### Infraestructura
- Wompi producción
- Dominio propio (candidato: amorae.org)

### Hecho ✅
- Brand book Fases 1-3
- Fix salmos + fallback + validación de caché
- Conec✝2 rastro de luz
- Migración firebase-admin — cron funcionando y verificado
- Rosario alineado a Santa Sede
- Santo del Día en Inicio + bloque "Hoy"
- Navegación: reset de estado + retomar Rosario
- **Seguridad Firestore endurecida**
- **Parroquias: selección + horarios de misa**