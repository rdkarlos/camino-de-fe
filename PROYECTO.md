# Horeb (antes Lumora / Camino de Fe)

> **Migración de marca — nombre completado (13 jul).** El nombre visible en la app, el splash, el manifest, index.html y la firma de las imágenes compartidas ya dicen **Horeb**. Las claves de `localStorage` (`lumora_*`) se dejaron sin tocar a propósito — son internas, invisibles para el usuario, y renombrarlas perdería el progreso guardado de quien tenga un Rosario a medias. Pendiente: revisar tono/copy (eslogan "Sube. Vuelve distinto." vs. el tagline actual "Luz que guía, amor que une").

## URLs
- Producción: https://camino-de-fe-seven.vercel.app
- **Dominios comprados:** somoshoreb.com (principal) y somoshoreb.app (redirige al .com)
- GitHub: github.com/rdkarlos/camino-de-fe
- Local: C:\Users\rdkar\camino-de-fe

## Entorno de desarrollo
- `npm run dev` → http://localhost:5173/ — funciona bien, usarlo para iterar rápido en vez de hacer push a Vercel
- `npm run dev -- --host` → expone la app en la red local; abrir la IP resultante en el celular (misma WiFi) para ver en vivo
- **Nota:** las rutas `/api/*` NO corren con vite a secas (son funciones serverless de Vercel). El evangelio y las lecturas pueden fallar en local — no es un bug.

## Stack
- React + Vite + Vercel (plan Hobby)
- Firebase Auth + Firestore
- Node.js v24, Windows 10

## Marca — Somos Horeb
- **Nombre:** Horeb. **Firma:** Somos Horeb. **Eslogan:** *Sube. Vuelve distinto.*
- **Por qué Horeb:** el monte donde Dios no estaba en el viento, ni el terremoto, ni el fuego — sino en una brisa suave. Moisés y Elías subieron cansados, "con lo que les quedaba".
- **El "somos" no es decorativo:** dice comunidad. Nadie sube solo. Diferencia a Horeb de Hallow y Ora, que son experiencias individuales.
- **Nombres descartados y por qué:**
  - **Tabor** — existe una app de citas rusa con 17M de descargas. Colisión de descubrimiento.
  - **Lumora** — saturadísimo: media docena de apps de bienestar/belleza/skincare, incluida una de manifestación New Age. Dominios tomados.
  - **Tabita** — marca de calzado brasileña en 45 países.
  - Emaús, Cenáculo, Betania, Nazaret — todos tomados.
  - **Lección:** entre más obvio y bíblico el nombre, más probable que ya lo tengan.
- **Competencia:** Hallow (#1, millones de usuarios, tono épico y de disciplina) y **Ora** (app católica ES/EN/PT de una colombiana, mismas funciones que Horeb). Diferenciador de Horeb: **comunidad + parroquias**.

## Identidad visual
### El signo (logo)
- Sol (disco claro con halo radial) asomando **detrás** del monte
- **Tres líneas horizontales** que descienden estrechándose, convergiendo hacia la cima — la brisa
- **Monte principal**: dos trazos que ascienden y se cruzan en la cima
- **Monte interior**: V más pequeña, en **Cielo de Altura** (gris-azulado, no dorado) — perspectiva atmosférica, el monte de atrás se ve más lejano. Es el *somos*: nadie sube solo.
- `src/Horeb.jsx` — componente con prop `background` (default `false` = transparente)
  - **Sin fondo:** splash, meditación del Rosario, botón flotante, modal
  - **Con fondo:** favicon e íconos PWA (cuadrados opacos). El viewBox es 400×320 (no cuadrado) — hay que compensar con lienzo cuadrado o quedan franjas transparentes.
- **Umbral de simplificación: 32px.** Por debajo, se omiten las tres líneas y el monte interior (se verían como un borrón) y el monte usa trazo más grueso.
- IDs de gradientes con `useId()` — sin esto, dos logos en la misma pantalla se pisan.
- **El logo NO va en las tarjetas de la app.** Ahí va un motivo decorativo (círculos difusos + punto de luz en Brisa de Alba). El logo se reserva para splash, favicon/PWA y firma de imágenes compartidas. Repetirlo en cada tarjeta lo devalúa.

### Paleta (brand book Horeb)
| Nombre | Hex | Uso |
|---|---|---|
| Noche de Horeb | `#1E2630` | Fondo (sin cambios) |
| Brisa de Alba | `#E4C79B` | Acento principal (antes: Luz del Alba `#E8B45C`) |
| Lino | `#F5F1E8` | Texto (sin cambios) |
| Cielo de Altura | `#8497A6` | UI secundaria |
| Arena del Monte | `#C7B79C` | Neutro cálido |
| Verde Zarza | `#7A8C6E` | **Nuevo, sin uso asignado aún** |

- Deliberadamente lejos del morado/dorado oscuro de Hallow. *"La luz de Horeb es una brisa cálida de amanecer, no un vitral"*.
- **Tipografía:** Cormorant (títulos), Work Sans (interfaz) — sin cambios, el brand book las confirma.

### Tono
- Tuteo. Español neutro (México, Madrid o Buenos Aires). Sin regionalismos ni clericalismos.
- *"El susurro, no el grito"* — Dios estaba en la brisa. La palabra justa; si sobra, se quita.
- Invita, no ordena. *"Sube con la fe que traigas hoy"*.
- **Nunca:** rachas, gamificación culposa, "¡No pierdas tu racha!", emojis pictóricos.

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

## APIs activas
- Universalis — lecturas del día (única fuente litúrgica, siempre en inglés)
- API.Bible — LBLA español, Bible ID: `e3f420b9665abaeb-01`
- Anthropic API — "Ponlo en Práctica"
- Firebase — project: `camino-de-fe-4d9c2`
- Wompi (test), Resend

## Flujo de traducción de lecturas
- Universalis entrega todo en inglés. `parseRef()` convierte la referencia a ID de pasaje y pide traducción a API.Bible.
- Maneja numeración alterna de salmos con letra de capítulo ("Psalm 113B(115)" → Salmo 115). El número entre paréntesis es el correcto.
- Fallback sereno + toggle "Ver en inglés" si falla.

## Cron de reflexión diaria (IMPORTANTE)
- `api/cron-reflexion.js` y `api/spiritual-guide.js` usan **firebase-admin**, no el SDK de cliente.
- Motivo: el SDK de cliente corre anónimo en serverless y Firestore lo rechaza. El admin SDK omite las reglas por diseño.
- Credencial: `FIREBASE_SERVICE_ACCOUNT_BASE64` en Vercel. Nunca en el repo.
- Detalle: en admin SDK, `snapshot.exists` es PROPIEDAD (sin paréntesis).
- **Bug histórico resuelto (11 jul):** el cron nunca había escrito por sí solo; el contenido lo guardaba un usuario logueado sin saberlo.
- ✅ **Verificado (12 jul):** el cron SÍ se dispara solo en plan Hobby.

## Seguridad Firestore — endurecida ✅ (12 jul 2026)
- **usuarios/{uid} y subcolecciones:** solo el propio usuario
- **reflexiones, versiculos, parroquias:** lectura pública, **escritura bloqueada** (`if false`). Solo el servidor escribe vía admin.
- **circulos:** lectura pública (para unirse por código). Update limitado a `hasOnly(['miembros','ultimaIntencionFecha','ultimaIntencionAutorId'])` y solo miembros. Delete solo el creador.
- **circulos/{id}/intenciones:** solo miembros. Create requiere `autorId == request.auth.uid`. Delete: el autor o el creador (modera).
- Verificado: sin cuenta se ve todo el contenido devocional; con cuenta funcionan círculos, intenciones y moderación.

## Santo Rosario — alineado a la Santa Sede
- Fuente: vatican.va — 20 misterios oficiales + citas bíblicas
- **Misterio del día anclado a America/Bogota** (`Intl.DateTimeFormat('en-US', {timeZone, weekday:'short'})`, locale fijo)
  - Lunes/sábado: gozosos · Martes/viernes: dolorosos · Miércoles/domingo: gloriosos · Jueves: luminosos
- **6 pasos (español):** Anuncio → **Meditación (cita bíblica)** → Padre Nuestro → 10 Ave Marías → Gloria → Jaculatoria. 40 pantallas.
- **Inglés: 5 pasos, sin meditación** — faltan las citas oficiales en inglés. **NO inventar traducciones.**
- **Contador "luz que crece":** anillo de 10 cuentas; el círculo central se enciende progresivamente (alpha 0.55→1.0, halo 14→40px, transición CSS 0.4s). La décima culmina en resplandor pleno.
- **Sin contadores de pasos en texto** — solo la barra de progreso.
- **Persistencia:** localStorage (`lumora_rosario_progress_v1`) con `{date, mysteryKey, pageIndex, aveCounts}`. Ofrece retomar solo si es de HOY y del misterio de hoy. Un rosario de ayer se ignora en silencio.
- **Textos litúrgicos copiados LITERAL** (comillas angulares «», espaciado exacto de referencias). No normalizar.
- **Acto de Contrición:** se usa la fórmula colombiana/latinoamericana (*"Jesús, mi Señor y Redentor..."*), NO la tradicional española (*"Señor mío Jesucristo..."*). Ambas son válidas; se eligió la que reza el público objetivo.

## Parroquias — misas
- Colección `parroquias` en Firestore. Datos del directorio oficial de la Diócesis de Zipaquirá.
- **`horarioMisas`:** objeto por día; cada misa es `{hora, lugar?}`. El `lugar` solo si NO es en la iglesia principal (ej. Santísima Trinidad tiene misa en el Cementerio los sábados y en el Salón comunal de La Palma los domingos). **Sin ese campo, mandaríamos gente al sitio equivocado.**
- 3 parroquias cargadas (Cajicá): Virgen del Rosario de Calahorra, Inmaculada Concepción, Santísima Trinidad. Falta San José de Ríogrande.
- `seed-parroquias.mjs` — script de carga (usa firebase-admin, requiere `FIREBASE_SERVICE_ACCOUNT_BASE64` en el entorno)
- Parroquia del usuario: `parroquiaId` en `usuarios/{uid}`. Una sola, editable desde Configuración.
- Tarjeta en Inicio con 3 estados: invitación / misas de hoy / semana expandida. Día anclado a Bogotá. **La agrupación de días no sobregeneraliza** (verificado: en Calahorra el lunes queda separado).
- **La fuente no se muestra en la tarjeta** (rompía el tono). Vive en Configuración: *"Estos horarios vienen del directorio de la Diócesis de Zipaquirá, actualizado el 12 de julio de 2026. Si algo cambió, escríbenos y lo corregimos."*

## Compartir como imagen
- `src/shareImage.js` — genera imagen 1080×1920 (formato historia) en Canvas 2D
- Diseño: degradado alba→noche descendente, signo de Horeb arriba, contenido en Cormorant cursiva, cita del evangelio, firma al pie. **Sin fecha** (para que no caduque).
- Autoajuste de fuente según longitud; recorte elegante si no cabe
- Espera `document.fonts.ready` antes de dibujar (si no, el canvas usa una fuente por defecto)
- Aplana el markdown (las negritas saldrían como asteriscos literales)
- `index.html`: se agregaron las variantes **itálicas** de Cormorant
- Comparte vía Web Share API con `files`; fallback a descarga
- **Canal de crecimiento orgánico clave:** cada imagen compartida lleva la marca a chats y estados de WhatsApp

## Navegación
- `goToTab(i)` centralizado resetea `personalSection`, `personalTab`, `devocionalInitialTab` al cambiar de sección. Cada entrada arranca limpia.
- **EXCEPCIÓN — La Biblia:** conserva su estado deliberadamente. Funciona como marcador de lectura: si estás en Juan 15 y sales, vuelves a Juan 15. Lo contrario de Devocional, donde volver a entrar no cuesta nada.

## Conec✝2 — Rastro de luz
- Aviso in-app (no push, no permisos). Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo.
- **Regla honesta:** se apaga solo al abrir el círculo con la novedad. Lo propio nunca lo enciende.
- Datos: `usuarios/{uid}.circleLastSeen` (mapa) + `circulos/{id}.ultimaIntencionFecha`/`ultimaIntencionAutorId`
- Auto-refresco por `visibilitychange`, throttle 3 min. Sin `onSnapshot`.

## Archivos clave
- `src/App.jsx` — principal
- `src/theme.js` — paleta (única fuente de verdad)
- `src/Horeb.jsx` — el signo de marca
- `src/Rosario.jsx`, `src/Devocional.jsx` (exporta `getSantoHoy`, prop `initialTab`)
- `src/santos.js` (366 santos con `bio`), `src/versiculos.js`, `src/JovenFe.jsx`
- `src/shareImage.js`
- `seed-parroquias.mjs`
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (v17), `public/favicon.svg`, `generate-icons.js`
- `vercel.json` — cron `"10 5 * * *"` = 00:10 Colombia

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`
- `CRON_SECRET` (rotado 11 jul)
- `FIREBASE_SERVICE_ACCOUNT_BASE64` (rotado 12 jul)
- **Cambios en env vars requieren REDEPLOY**

## Pendiente

### Migración de marca — casi completa
- ✅ Logo (`Horeb.jsx`), favicon, íconos PWA, splash, firma en imágenes compartidas
- ✅ **Paleta** — dorado migrado a Brisa de Alba `#E4C79B` en theme.js e index.css, más los 18 `rgba(...)` hardcodeados que dependían de él (glows, pulsos, badges). Contraste contra Noche verificado (9.4:1, mejor que el dorado viejo) — se ve más pálido pero no menos legible.
- ✅ **Textos** — Lumora → Horeb en app, manifest, index.html, firma de shareImage y el email de confirmación de pago. Las claves de `localStorage` (`lumora_*`) se dejaron igual a propósito.
- ⬜ **Dominio** — conectar somoshoreb.com a Vercel
- ⬜ Decidir el uso del Verde Zarza (declarado en la paleta, sin trabajo asignado)
- **Splash: una vez por día** (no en cada carga) — es intencional, confirmado. Si un usuario prueba varias veces el mismo día no lo va a volver a ver hasta el día siguiente; no es un bug.

### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** No venderle: preguntarle si los horarios están correctos y escuchar. Señal real de interés = que cuente un problema sin que se lo pregunten.
- **Aprendizaje clave:** WhatsApp es la competencia (el padre publica ahí, solo él). WhatsApp es el **flujo** (lo que pasó); Horeb es el **estado** (lo que ES, siempre visible). No competir con el flujo — dar permanencia y estructura.
- Canal para "escríbenos" (el copy lo promete, no existe)
- San José de Ríogrande (faltan horarios) · Más parroquias de la diócesis
- Panel del párroco — **solo si el padre lo pide.** Modelo: invitación (tú creas la parroquia y le das un código), no registro abierto.
- Permiso de la diócesis para usar sus datos

### Contenido
- Novenas días 2-9 (4 restantes). **Texto de fuente católica confiable, NO generado.**
- Joven Fe — Testimonios y Quiz Bíblico
- Diario de Gracias
- Rosario: citas bíblicas oficiales **en inglés**
- Rosario: evaluar "Dios mío, ven en mi auxilio" al inicio y letanías lauretanas al final
- Extender compartir-como-imagen al Santo del Día y las meditaciones del Rosario

### Funcionalidad — futuro
- Push notifications reales (compleja: permisos, tokens, iOS PWA)
- Aviso "están orando por tu intención" (señal distinta al rastro actual)
- **Monetización — Fase 0: definir modelo.** Dirección: productos con nombre propio, no "premium de la app". El brand book ya los nombra: **Cordada** (comunidad), **Brisa** (música), **Semilla** (niños), **Cumbre** (retiros). Lo esencial siempre gratis.

### Distribución
- PWA instalable, sin tiendas. **En iPhone instalar requiere 5 pasos ocultos en Safari** — Apple no permite botón. La mayoría de usuarios iOS probablemente nunca la instalan.
- Android sí permite botón (`beforeinstallprompt`)
- Paso intermedio: guía de instalación in-app que detecte el dispositivo
- Raíz: empaquetar (Bubblewrap/Capacitor). Apple ~$99/año, Google ~$25.
- **OJO:** Apple/Google cobran 15-30% de comisión si se vende dentro de la app.

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción (las otras 3 lecturas tienen fallback sereno)
- Caché lecturas: reconsiderar sessionStorage
- Limpieza: código muerto en translations, 2 cuentas de prueba en Authentication, 4 claves de servicio en Firebase (revocar las no usadas)

### Hecho ✅
- Brand book Fases 1-3 (Lumora)
- Fix salmos + fallback + validación de caché
- Conec✝2 rastro de luz
- Migración firebase-admin — cron funcionando y verificado
- Rosario alineado a la Santa Sede
- Santo del Día en Inicio + bloque "Hoy"
- Navegación: reset de estado + retomar Rosario
- Seguridad Firestore endurecida
- Parroquias: selección + horarios de misa
- Compartir como imagen (Ponlo en Práctica)
- **Marca Horeb: nombre, dominios, brand book, logo**