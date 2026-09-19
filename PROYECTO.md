# Horeb (antes Lumora / Camino de Fe)

> Migración de marca COMPLETA: nombre, signo, paleta, dominio propio y textos residuales limpiados.

## URLs
- Producción: https://somoshoreb.com (dominio principal, conectado)
- www.somoshoreb.com → redirige a somoshoreb.com (308)
- camino-de-fe-seven.vercel.app → redirige a somoshoreb.com (308) — se mantiene vivo para no romper enlaces viejos
- GitHub: github.com/rdkarlos/camino-de-fe
- Local: C:\Users\rdkar\camino-de-fe

## Entorno de desarrollo
- `npm run dev` → http://localhost:5173/ — usarlo para iterar rápido en vez de hacer push a Vercel en cada cambio
- `npm run dev -- --host` → expone la app en la red local; abrir la IP resultante en el celular (misma WiFi) para ver en vivo
- **Nota:** las rutas `/api/*` no corren con vite a secas (funciones serverless de Vercel). Evangelio y lecturas pueden fallar en local — no es un bug.

## Stack
- React + Vite + Vercel (plan Hobby)
- Firebase Auth + Firestore
- Node.js v24, Windows 10

## Marca — Somos Horeb
- **Nombre:** Horeb. **Firma:** Somos Horeb. **Eslogan:** *Sube. Vuelve distinto.* / *Rise. Return renewed.*
- **Por qué Horeb:** el monte donde Dios no estaba en el viento, ni el terremoto, ni el fuego — sino en una brisa suave. Moisés y Elías subieron cansados, "con lo que les quedaba".
- **El "somos" no es decorativo:** dice comunidad. Nadie sube solo. Diferencia a Horeb de Hallow y Ora (individuales).
- **Nombres descartados:** Tabor (app de citas rusa, 17M descargas), Lumora (saturado de apps de bienestar/belleza), Tabita, Emaús, Cenáculo, Betania, Nazaret — todos tomados.
- **Competencia:** Hallow (épico/disciplina) y Ora (colombiana, mismas funciones). Diferenciador de Horeb: comunidad + parroquias.
- **Tema claro — considerado y descartado (26 jul 2026).** El brand book especifica "modo oscuro permanente" como decisión de marca deliberada. Técnicamente requeriría reconstruir el sistema de colores y tocar cada pantalla ya construida. Carlos lo calificó de "capricho" y lo descartó conscientemente. No retomar sin una razón de accesibilidad real que lo justifique.

## Identidad visual
### El signo (logo)
- `src/Horeb.jsx` — sol asomando detrás del monte, tres líneas horizontales descendentes (la brisa), monte principal + monte interior tenue en Cielo de Altura (el *somos*)
- Prop `background` (default `false` = transparente). Con fondo: favicon e íconos PWA
- Prop `animated` (opt-in): pulso de "respiración" del halo del sol — ver `HorebLoading`
- Umbral de simplificación: 32px. IDs de gradientes con `useId()`
- **El logo NO va en las tarjetas de la app** — reservado para splash, favicon/PWA, imágenes compartidas
- Reemplazó el ícono del modal de login (antes emoji ✝️)

### `HorebLoading` — estado de carga unificado
- Envuelve `Horeb.jsx` con `animated={true}`: halo del sol pulsa (2.2s, ease-in-out), monte fijo
- Respeta `prefers-reduced-motion`
- Reemplazó 10 apariciones del emoji 🙏 (estado de carga genérico) en toda la app

### Paleta (brand book Horeb)
| Nombre | Hex |
|---|---|
| Noche de Horeb | `#1E2630` |
| Brisa de Alba (ALBA) | `#E4C79B` |
| Lino | `#F5F1E8` |
| Cielo de Altura (CIELO) | `#8497A6` |
| Arena del Monte (PIEDRA) | `#C7B79C` |
| Verde Zarza | `#7A8C6E` — comunidad y confirmación |
| Corazón Rosa (`CORAZON_ROSA`) | `#C99B8E` — Lectio Divina, dimensión Corazón |
| Alma Violeta (`ALMA_VIOLETA`) | `#7C86A8` — Lectio Divina, dimensión Alma |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` — no hardcodear colores
- Tipografía: Cormorant (títulos), Work Sans (interfaz)

### Barrido de íconos y emojis — completo (3 tandas)
- **Tanda 1:** código muerto eliminado (`t.rosary.steps`, `t.home.reminder`, campo `icon` no usado)
- **Tanda 2:** 📖, ✝️, 🔔, 👤, 🛒, 🕯️ reemplazados por SVG ya existentes
- **Tanda 3:** `LockGlyph`, `GlobeGlyph`, `KeyGlyph`, `PeopleGlyph`, `TrashGlyph`, `BookmarkGlyph`, `SearchGlyph` nuevos; `HorebLoading` reemplaza 🙏/✨; `CalmGlyph`/`CandleGlyph` en `PRAYER_MOODS`
- `PencilGlyph`, `LogoutGlyph`
- 5 nuevos para Lectio Divina: `HeartGlyph`, `BookLightGlyph`, `BreezeGlyph`, `StillLightGlyph`, `MustardSeedGlyph`
- **Quedan como emoji, a propósito:** 🕊️ (Home, dos rediseños descartados), 📔 (producto Tienda inactiva)
- **Lección:** varios emojis vivían escondidos en constantes de datos, no solo en JSX visible

### Fósiles de marca — limpiados
Íconos PWA con cruz azul marino, favicon viejo, resplandores copiados a mano, overlay morado, "Lumora" en email de pago, eslogan viejo en splash y `manifest.json`
- **Lección:** motivos/textos de marca deben vivir en un solo lugar; `manifest.json` es un escondite recurrente
- **Pendiente, no urgente:** `api/confirm-payment.js` — paleta vieja, actualizar cuando la Tienda esté activa

### Tono
- Tuteo, español neutro. *"El susurro, no el grito."* Invita, no ordena. Nunca rachas ni gamificación culposa.

## Secciones
1. **Inicio** — 3 bloques: **HOY** (Versículo hero → Evangelio → Lecturas → Santo/Misas) → **TU COMUNIDAD** (Conec✝2) → **TU CAMINO** (Oración Personal → Joven Fe)
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), Santo Rosario, Coronilla, **Lectio Divina**, Devocional
3. Evangelio — "Ponlo en Práctica"
4. **La Biblia** — buscador temático + navegación directa + resaltar/comentar versículos
5. Lecturas del día
6. Santo Rosario
7. Coronilla de la Divina Misericordia
8. Devocional — Oraciones (50, 6 secciones), Novenas (en construcción), Santo del Día
9. Tienda — en construcción
10. Configuración — "Tu parroquia" + "Horario de esta semana". Notificaciones retirada
11. Joven Fe — **en rediseño, ver sección dedicada**

## Mi Oración — 4 pestañas
- **Crear Oración:** 8 estados de ánimo → versículo + santo patrono → intención → "Orar"
- **Mis Oraciones (unificada):** Firestore + localStorage sin sesión. Permite borrar
- **Diario (90 preguntas):** una entrada por día, no editable ni borrable
- **Conec✝2:** ver sección dedicada abajo

## Lectio Divina — nueva devoción (28 jul 2026)
Tarjeta en Oración Personal, debajo de "Mi Oración". Medita el Evangelio del Día (misma fuente que Home, `gospelData`/`cleanGospelText`) en 5 pasos guiados:

**Corazón** (Lectura, "¿Qué dice el texto?") · **Mente** (Meditación) · **Espíritu** (Oración) · **Alma** (Contemplación) · **Cuerpo** (Compromiso) — texto literal de la fuente de Carlos, siempre en español.

- 5 íconos propios por dimensión, color sutil (borde 3px + resplandor 0.13), nunca fondo completo
- Barra de progreso segmentada por color; cierre con las 5 juntas: "Corazón, mente, espíritu, alma y cuerpo — hoy oraron juntos."
- Escribir es opcional en cada paso. Persistencia: `usuarios/{uid}/lectioDivina/{fecha}`, una entrada/día
- "Entradas anteriores" siempre visible (bug corregido: antes se escondía si no había completado la de hoy)
- Borrar con confirmación (mismo criterio que Mis Oraciones); si se borra la de hoy, el formulario reaparece el mismo día
- **Bug corregido:** el paso de Lectura mostraba la cita corta del Versículo del Día en vez del Evangelio completo — ahora usa el `body` real, con scroll interno (280px) para no empujar los botones
- **Bug relacionado, corregido en toda la app:** `cleanGospelText` no reconocía el punto en citas combinadas ("Lc 15, 1-3. 11-32") — afectaba también Home y Evangelio, no solo Lectio Divina
- Indicador de "función nueva" aplicado (`featureId: 'lectio-divina'`) — ver sección dedicada abajo

## Joven Fe — repensada, en diseño (19 sep 2026)

### Decisión de fondo
La estructura original (Retos/Testimonios/Quiz, sin contenido real en ninguna) se descartó. Nueva visión: **Itinerarios espirituales** como el ancla principal — recorridos narrativos de varios días con un santo/tema, no un banco de preguntas suelto. Decisión de Carlos: "quiero que haga parte de Joven Fe y ver cómo llevamos a los jóvenes a través de itinerarios al mundo de la fe, así nos toque repensar esa sección".

### Itinerarios espirituales — primer contenido: 40 días con Santa Clara
Documento fuente: `40_Dias_con_Santa_Clara.docx`, de **Lida Esperanza López M., Líder EMC 2026** (contenido propio de la comunidad de Carlos, Emaús Mujeres Calahorra — no hay problema de derechos). Estructura original por día: Conoce a Clara (hecho histórico) → Su palabra o su ejemplo → Reflexión → Oración → Propósito para hoy → Para tu servicio.

**Decisiones de arquitectura confirmadas:**
- Vive dentro de Joven Fe (no como devoción aparte en Oración Personal)
- "Para tu servicio" (escrito para servidoras de retiro) se generaliza a **"Para tu día a día"** — aplicado a vida cotidiana, no solo contexto de retiro
- Ritmo: **un día a la vez, bloqueado hasta mañana** (mismo patrón que el Diario)
- Tono ajustado hacia lenguaje más joven y directo — confirmado con el Día 1 reescrito y aprobado por Carlos ("así me gusta")
- Solo existe este itinerario por ahora; otros (distintos santos/temas) se piensan con calma después

**Progreso de la reescritura (en curso, no aplicado a código todavía):** Días 1-9 de 40 ya reescritos con el tono aprobado, trabajando en tandas de 8-10 para revisión antes de escalar. Pendiente: Días 10-40, luego construir la devoción en código (persistencia por día, estructura similar a Lectio Divina/Diario).

### Banco de preguntas "Fe y Vida" — en pausa, pendiente de repensar
Se había diseñado un banco de preguntas jóvenes reales (rama Fe / rama Vida, tono "hermano mayor", 8 preguntas de muestra ya escritas y aprobadas en tono). Carlos pidió algo "más impactante que solo preguntas y respuestas" — esto llevó al hallazgo del documento de Santa Clara y al pivote hacia Itinerarios como ancla principal. **No descartado del todo** — podría retomarse como sección secundaria una vez Itinerarios esté construido, pero no es la prioridad inmediata.

## Conec✝2 — círculos de oración

### Funcionalidad base
- Círculos privados/públicos, intenciones, rastro de luz de actividad nueva

### Palabra al orar y testimonios (20 jul 2026)
- "Estoy orando" con palabra opcional (`oracionesPalabras`), disponible antes o después de marcar
- Marcar como respondida con testimonio opcional — compartido (visible al círculo) o privado (`usuarios/{uid}/oraciones`)
- Reglas de Firestore publicadas. Bug del parpadeo resuelto (regla no contemplaba `orando`+`oracionesPalabras` juntos)

### Círculos públicos = administrados (20 jul 2026)
- `usuarios/{uid}.esAdmin` — solo admins crean/borran públicos. `tipo` fijo para siempre
- `OfficialBadge`, edición de nombre/descripción (`PencilGlyph`), primer círculo temático "Salud y Sanación"
- Pendiente: correr `list-public-circles.mjs`, construir más círculos temáticos

### Tarjeta "Tu comunidad" en Inicio (20 jul 2026)
- Filosofía "invitar sin exhibir" — nunca lee documentos de intenciones. Verde Zarza como acento (primer uso real)
- Destello de novedad específico por círculo (no agregado)
- **Ajuste 28 jul:** resplandor atenuado (0.11/0.13, antes 0.16/0.2)

### Visión — Conec✝2 + Parroquias
- La parroquia ES un círculo de oración — unir ambos conceptos. Conec✝2 a Inicio: ✅ hecho

## Santo Rosario — alineado a la Santa Sede
- 20 misterios oficiales, citas de vatican.va. Exporta `OUR_FATHER`, `HAIL_MARY`, `APOSTLES_CREED`
- Bug de doble toque corregido (ver Coronilla)

## Coronilla de la Divina Misericordia
- Reconstrucción completa con fuente extendida — APROBADA, rezada por Carlos en su celular
- 5 décadas, 2 oraciones finales. Bug de doble toque en dispositivo táctil resuelto con `advancingRef` (mismo fix en Rosario)
- Service worker en v20 desde este fix

## Devocional — Oraciones (50 en 6 secciones)
- Renombrado a "Oraciones". Acordeón de 2 niveles, Ángelus con diálogo, texto 17px
- Novenas: `<ComingSoon>`

## La Biblia — buscadores + resaltar y comentar
- Buscador temático + "Ir a una cita". Memoria de lectura conservada deliberadamente
- Resaltar/comentar versículos, "Mis Versículos"

### Bug de Universalis — deofuscación + manejo de errores (19 sep 2026)
Universalis (fuente del Evangelio/Lecturas) cambió su formato de respuesta — el texto llegó envuelto en cadenas `.split().join()` (probable anti-scraping), que `api/gospel.js` intentaba parsear directo como JSON y fallaba 100% de las veces con un 500. En paralelo, `App.jsx` tenía un `.catch(() => {})` silencioso en el fetch de `/api/gospel` — el error nunca se mostraba, la pantalla se quedaba en "Cargando..." indefinidamente. Dos fixes: (1) `api/gospel.js` deofuscar la respuesta antes de parsear; (2) `App.jsx` reemplaza el catch silencioso por estado de error real (`gospelError`) con UI de "No se pudo cargar / Reintentar" en Evangelio y Lecturas — cualquier fallo futuro (de esta causa o de otra) ya no se queda pegado en silencio.

## Traducción bíblica — RESUELTA temporalmente con BLPD, gestión institucional sigue en curso (19 sep 2026)

### El problema original y su resolución
Carlos notó "Jehová" en el Versículo del Día. La causa real no era LBLA ni `versiculos.js` — fue el cron generando versículos de memoria sin fuente (ver hallazgo completo abajo, "Cron de reflexión diaria"). Pero investigando esto se confirmó un problema de fondo real y más amplio: **LBLA (La Biblia de las Américas)**, usada en toda la app, es traducción evangélica sin aprobación católica ni deuterocanónicos — un problema que llevaba tiempo sin resolverse, independientemente del bug puntual del cron.

**Estado actual:** Evangelio, Lecturas y La Biblia completa migraron a **BibleGet/BLPD** (Libro del Pueblo de Dios, católica, con los 73 libros del canon) el 19 sep 2026, como solución temporal mientras las gestiones institucionales con las Conferencias Episcopales siguen sin respuesta. Ver "Activación" más abajo para el detalle completo.

**Lo que sigue pendiente:** `versiculos.js` (Versículo del Día, banco estático de 366) no se tocó — su propia auditoría queda aparte. Y las dos gestiones institucionales (CEC Colombia, CEE España) siguen abiertas: si alguna responde con una traducción con licencia más sólida que BLPD, esa sigue siendo la meta final a migrar.

**Alcance del código:**
- `versiculos.js` — banco propio de 366 versículos, texto estático escrito a mano. **Origen exacto desconocido** — probablemente basado en LBLA. Búsqueda exhaustiva (28 ago 2026) confirma que ninguna de las 366 entradas contiene "Jehová"/"Jehova" — esa palabra específica queda descartada para este archivo, pero la auditoría de fondo (fidelidad de traducción, estilo) sigue pendiente. **Sigue sin tocar** — tarea aparte, deliberadamente fuera de la activación del 19 sep 2026.
- `api/gospel.js` — **migrado (19 sep 2026)** de API.Bible/LBLA a BibleGet/BLPD. Alimenta Evangelio + 1ª/2ª lectura + Salmo del día.
- `src/App.jsx` — **migrado (19 sep 2026)**, mismo cambio de fuente, alimenta "La Biblia" completa (navegación, lectura de capítulo, búsqueda, ir-a-cita).

### Cron de reflexión diaria — generación libre de versículos, corregido (28 ago 2026)

**Causa real del "Jehová" que vio Carlos.** No era LBLA ni `versiculos.js`. El "Versículo del Día" tiene tres capas: el banco curado (`versiculos.js`, vía `getVersiculoHoy()` en `App.jsx`), y por encima de ese banco, un documento en Firestore (`versiculos/{fecha}`) que gana prioridad si existe (`cronVerse || versiculoBanco`). Ese documento lo escribía `api/cron-reflexion.js`, corriendo diario por cron (`vercel.json`), con una función `generateVerse()` que le pedía a Claude: *"suggest ONE Bible verse... respond ONLY in JSON {texto, referencia}"* — sin ninguna traducción de referencia, sin fuente, sin verificación. Al no tener restricción de traducción, Claude recordaba la redacción más citada de un versículo dado, que para muchos versículos muy conocidos (ej. Salmo 27:1, "Jehová es mi luz y mi salvación") es abrumadoramente Reina-Valera en el material con el que se entrenó — de ahí "Jehová", pisando la entrada ya correcta del banco curado (`01-31`, Salmo 27:1, "El Señor es mi luz y mi salvación") sin dejar rastro en el repo, porque Firestore no versiona y el propio cron borra el documento del día anterior (`cleanOldVersiculos`).

**Corrección aplicada:** se eliminó `generateVerse()` por completo. El cron ahora calcula la misma clave `MM-DD` (misma lógica de zona horaria `America/Bogota` que usa `getVersiculoHoy()`) y toma la entrada directo de `versiculos.js`, con el mismo fallback a `'01-01'`. El documento que el cron guarda en Firestore es ahora idéntico al que la app ya mostraría sin el cron — ya no hay generación libre en ninguna ruta del Versículo del Día.

**Confirmado con búsqueda exhaustiva:** `versiculos.js` nunca contuvo "Jehová"/"Jehova" en ninguna de sus 366 entradas. El banco curado nunca fue el problema.

**Nota aparte, sin tocar:** `api/spiritual-guide.js` también usa Claude, pero para el chat de orientación ("Ponlo en Práctica"), no para citar versículos como texto bíblico literal — no es el mismo riesgo, no se tocó.

### Investigación de fuentes — TODAS descartadas, con motivo verificado

**API.Bible (nuestra cuenta):** 8 Biblias en español disponibles (LBLA, NBLA, RVR09, Palabra de Dios para ti ×2, Español Sencillo, VBL ×2) — verificado contando libros reales vía API (66 o menos en todas; católico = 73). Cero deuterocanónicos en ninguna. **Verificado también el plan Pro/Express Licensing (19 sep 2026):** API.Bible es operado por American Bible Society (ABS), no por United Bible Societies (UBS) — son entidades hermanas pero jurídicamente distintas. "Dios Habla Hoy" (que sí tiene deuterocanónicos, publicada por UBS) NO existe en el catálogo de API.Bible, ni gratis ni de pago — ABS no redistribuye el catálogo de UBS. Costo real del plan Pro: $29+/mes (150K llamadas). Traducciones individuales fuera del pool gratuito: desde $10/mes por Biblia, escalando por usuarios activos hasta $300/mes (25K-100K usuarios). Cualquier ingreso (ads, compras in-app, suscripciones) activa un "Commercial Agreement" obligatorio y las Biblias gratuitas del acuerdo no-comercial dejan de ser válidas — mismo patrón de "lock-in" que YouVersion. **Descartado en su totalidad** — ni gratis ni pagando tiene una traducción católica.

**YouVersion Platform:** cuenta creada, App Key obtenida y guardada en Vercel (`YOUVERSION_APP_KEY` — **recomendado rotarla**, se compartió en el chat). 9 Biblias en español disponibles por defecto, cero católicas. Traducciones católicas (Nácar-Colunga, Biblia Latinoamericana) existen en su catálogo general según búsqueda web, pero requieren solicitar licencia específica, no vienen por defecto. **Riesgo adicional real:** uso "non-commercial lock-in" — si Horeb monetiza en el futuro, se pierde el acceso a la API.

**Magisterium AI:** no es fuente de texto bíblico — es IA conversacional para preguntas doctrinales. Sigue como candidato para capa de precisión doctrinal de "Ponlo en Práctica", no para esto.

**vatican.va:** aloja la Biblia de Jerusalén completa en español, pero sus términos de uso son explícitos: "uso personal y sin fines de lucro" — no autoriza extracción/redistribución en una app de terceros. Sujeto además a la ley de copyright vaticana (2011, Ley CXXXII).

**Repositorios de código abierto (todos descartados, mismo patrón):**
- NPM `biblia-de-jerusalen` — licencia MIT cubre el CÓDIGO, no el texto (copyright confirmado de Desclée De Brouwer)
- GitHub `eneleich1/La-Biblia` y `eneleich1/La-Biblia-de-Jerusalen-Project` (mismo autor, dos nombres) — el propio autor reconoce en el README no haber verificado derechos de redistribución
- GitHub `catholicbibletools/cbt` — incluye Libro del Pueblo de Dios y Biblia Latinoamericana, pero licencia de texto no aclarada + abandonado desde 2020
- GitHub `mrk214/bible-data-es-spa` (19 sep 2026) — confirma de forma independiente que "Dios Habla Hoy" con 75 libros/deuterocanónicos existe (coincide con lo visto en DBL), pero agrega LBLA/NVI/RVR1960 sin ninguna licencia visible — mismo patrón de código MIT sin cubrir el texto, con copyright conocido y activo de por medio (LBLA es literalmente la misma traducción del problema original)
- **PDF de la Biblia CEE (epublibre.org):** confirmado que es copia pirata (trae el aviso característico del sitio) — no se usó. Sirvió como pista legítima: confirma que BAC hizo el trabajo editorial bajo encargo de la CEE.
- **Scraping directo de vatican.va o de la web de la CEE:** evaluado y descartado explícitamente (19 sep 2026) — mismo problema legal que cualquier otra extracción sin permiso, con el agravante de que sería Horeb ejecutando la infracción directamente, no encontrando una ya hecha por otro. No se construyó nada de esto.

**BibleGet I/O** (`query.bibleget.io`) — única fuente con licencia de texto genuinamente confirmada, para "Libro del Pueblo de Dios" (BLPD). **Verificación de confiabilidad del mantenedor (19 sep 2026):** su creador, John R. D'Orazio, es sacerdote con perfil de GitHub activo y real — 76 repositorios, 119 estrellas, actividad reciente, mantiene al menos otra API católica en producción (Calendario Litúrgico, consumida por otros proyectos). El código específico de BibleGet no está público en GitHub (no auditable directamente), pero el perfil general sube la confianza respecto a la evaluación inicial ("un desarrollador con €70/año"). Sigue siendo una sola persona sin respaldo institucional — riesgo real pero menor de lo que parecía al principio.

**Inventario completo de BLPD, verificado en vivo (16 sep 2026):**
- **Rutas reales:** todo va bajo `/v3/` (la documentación de GitHub da 410 en rutas viejas). Consulta: `https://query.bibleget.io/v3/index.php?query=...&version=BLPD&return=json`. Metadata: `https://query.bibleget.io/v3/metadata.php?query=...`.
- **Endpoint de metadata existe:** `?query=bibleversions` (ficha completa de cada versión) y `?query=versionindex&versions=BLPD` (índice canónico: 73 libros, abreviaturas, `chapter_limit`/`verse_limit`, `book_num` 1–73).
- **Canon confirmado: 73 libros completos** — 46 del AT (7 deuterocanónicos en su sitio: Tobías #17, Judit #18, 1Mac #20, 2Mac #21, Sabiduría #27, Sirácides/Eclesiástico #28, Baruc #32) + 27 del NT.
- **Los 7 deuterocanónicos probados en vivo, todos con texto real:** Tobías 3:11, Judit 13:18, Sabiduría 3:1, Sirácides 3:17 (la API lo indexa como "Sirácides", no "Eclesiástico"), Baruc 3:38, 1 Macabeos 1:1, 2 Macabeos 7:1.
- **Salterio completo confirmado:** `chapter_limit` de Salmos = 150. Salmo 1:1, Salmo 150:6, y Salmo 119 completo (176 versos, el capítulo más largo de toda la Biblia) — sin truncar.
- **Edición: 2015**, autoreportada por la propia API: "Libro del Pueblo de Dios|2015|es|1|CATHOLIC|Fundación Palabra de Vida y Editorial Verbo Divino". Historia: 1964 (Evangelios) → 1968 (NT completo) → ~1990 (Biblia completa, oficial para la Conferencia Episcopal Argentina, usada en leccionarios de Chile/Paraguay/Uruguay/Bolivia) → 2015 (revisión del P. Levoratti, Editorial San Pablo — es esta la que expone la API). Solo hay una edición en el catálogo.
- **Hallazgo sobre licencia:** BLPD aparece en el campo `"copyrightversions"` de la propia metadata. Los Términos de Servicio de BibleGet dicen que estos textos "are the sole property of their respective copyright holders" y se ofrecen "solely with usage granted by their copyright holders" — el titular real es **Fundación Palabra de Vida y Editorial Verbo Divino**, no BibleGet. Requisitos operativos del ToS: parámetro `appid` obligatorio en cada consulta, y obligación de divulgar a usuarios finales que se usa BibleGet.

**Activación (19 sep 2026):** Carlos decidió activar BLPD como solución temporal mientras las gestiones institucionales siguen sin ETA. Migrados y verificados en vivo:
- `api/gospel.js` — Evangelio, 1ª/2ª lectura y Salmo del día. Probado con el Evangelio real del día (Lucas 8, 4-15) y un domingo completo (4 lecturas). Cero "Jehová" en ninguna respuesta.
- `src/App.jsx` — "La Biblia" completa (navegación, lectura de capítulo, búsqueda, "Ir a una cita"). Antes de migrar se verificaron en vivo los 3 casos de uso que este módulo necesita:
  - **Listar libros:** no hacía falta endpoint nuevo — `App.jsx` ya tenía su propio índice estático de 73 libros en orden canónico; verificado posición-por-posición contra `metadata.php?query=versionindex&versions=BLPD`, coincide exacto.
  - **Capítulo completo:** `index.php?query=Libro<capítulo>` devuelve todos los versículos en una sola consulta (probado con Salmo 119, 176 versos, sin truncar).
  - **Buscador de texto:** endpoint no documentado en el inventario anterior — `search.php?query=keywordsearch` (distinto de `index.php`, que solo acepta referencias exactas). Confirmado funcionando.
  - Verificado con capturas: Evangelio del día, Lecturas con formato R./V., búsqueda "misericordia" (20 resultados), Tobías 3 completo (imposible antes con LBLA), "Ir a una cita" con Juan 3:16.
- **Caveat operativo:** `search.php` no tiene límite de resultados ni paginación — una palabra común (ej. "señor") devuelve miles de versículos y ~3MB en una sola respuesta. La app sigue mostrando solo 20, pero la descarga completa igual le pega al servidor gratuito de BibleGet en cada búsqueda amplia — vigilar si el buscador se usa mucho.
- El Versículo del Día (`versiculos.js`) sigue sin tocar, como estaba decidido.

### Gestiones institucionales activas — dos frentes en paralelo, sin ETA

**1. Digital Bible Library (DBL) — RECHAZADA por falta de registro legal**
Operada por United Bible Societies. Se encontró en su catálogo *"Dios Habla Hoy Orden Alejandrino DC Estándar"*, con etiqueta **"Bible with Deuterocanon"**. Cuenta y organización "Horeb" registradas. **Respuesta final de DBL:** *"Only legally registered organizations can request license agreements for Controlled Access content."* — requisito estructural, no negociable. Cerrado hasta que Horeb tenga entidad legal registrada en Colombia — anotado como posible beneficio futuro de formalización del proyecto.

**2. Conferencias Episcopales — en espera, sin ETA**
- **CEC Colombia** (doctrinaybiblia@cec.org.co, Departamento de Doctrina y Animación Bíblica, padre Jorge Bustamante Mora) — enviado, presenta a Horeb, menciona a Carlos como feligrés de Calahorra (Cajicá, Diócesis de Zipaquirá)
- **CEE España** — correo preparado, aclara que la parroquia de Carlos queda en Colombia, transparente sobre monetización futura, pregunta por licencia de la Sagrada Biblia CEE y si BAC es el interlocutor correcto

**Estado: BLPD activo en producción; las 2 gestiones institucionales siguen abiertas como meta de mejora a futuro, no como bloqueo.**

### Decisión pendiente, aparte
Los 366 versículos de `versiculos.js` no se actualizan solos — requieren su propia revisión/reescritura completa, con el mismo cuidado (verificación carácter por carácter) que el resto del contenido litúrgico del proyecto.

## Menú hamburguesa
- Cierra al tocar/scrollear fuera. Accesos rápidos cierran al navegar. Cierre fantasma corregido

### Rediseño del menú de perfil (26 jul 2026)
- Resumen de actividad como frase cálida (`buildProfileSummary()`), casos límite manejados con cuidado
- "Cerrar sesión" discreto (`LogoutGlyph`)
- **Pendiente de verificar con datos reales del usuario**

### Bug urgente corregido — ícono de perfil cerraba sesión sin aviso (27 jul 2026)
- `onClick={handleLogout}` directo → `onClick={() => setMenuOpen(!menuOpen)}`. Verificado con Playwright
- Identidad visual propia del bloque de perfil (tarjeta separada de la navegación)

## Notificaciones — retiradas temporalmente
- `setTimeout` sin persistencia real eliminado. Push notifications reales: proyecto propio pendiente

## Seguridad Firestore — endurecida ✅
- `usuarios/{uid}` y toda subcolección: solo el propio usuario
- `circulos` públicos = administrados, reglas confirmadas y publicadas
- **Pendiente de seguridad, sin tocar:** `allow read: if true` en `circulos` expone código/miembros de privados; un miembro cualquiera puede reescribir el array `miembros` completo

## Parroquias — misas
- 4 parroquias: 3 en Cajicá (Diócesis de Zipaquirá) + San Pío X en Cali (Arquidiócesis de Cali)
- Filtro por ciudad en selección, texto de "fuente" dinámico por parroquia (bug de fallback corregido — el filtro de ciudad ahora manda sobre la parroquia guardada)
- Honestidad de cobertura: copy actualizado a "Cajicá y Cali", canal WhatsApp para pedir nuevas parroquias

## Botón/gesto "atrás" del sistema (29 jul 2026)
- Navega entre secciones principales (Nivel 1: todo lo que controla `goToTab()`), sin tocar sub-navegación interna
- Mecanismo genérico: `useEffect([tab])` + `pushState`, listener de `popstate` reutiliza `goToTab()`
- Verificado: recorrido básico, límite de historial sin loop, La Biblia conserva estado, Rosario ofrece retomar

## Indicador genérico de "función nueva" (29 jul 2026)
- Sistema reutilizable: `NEW_FEATURE_IDS`, `isNewFeature(id)`, `markFeatureVisited(id)` — 3 pasos para marcar cualquier función futura
- "Nueva" = "nunca visitada" (no por fecha), se apaga al abrir. Aplicado a Lectio Divina
- Verificado con persistencia real en localStorage (sobrevive recarga completa)

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, signo de Horeb. Ponlo en Práctica + Versículo del Día

## Navegación
- `goToTab(i)` centralizado. Excepción — La Biblia conserva estado

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx`, `src/Coronilla.jsx`, `src/Devocional.jsx`, `src/diarioPreguntas.js`
- `src/santos.js`, `src/versiculos.js` (⚠️ pendiente auditoría de fuente), `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`, `list-public-circles.mjs` (pendiente de correr)
- `api/gospel.js` (migrado a BibleGet/BLPD, 19 sep 2026), `api/spiritual-guide.js`, `api/cron-reflexion.js` (ya no genera versículos de memoria, lee `versiculos.js`), `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (**v20**), `public/favicon.svg`, `public/manifest.json`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`, `YOUVERSION_APP_KEY` (nueva, 2 ago — **recomendado rotarla**, se compartió en el chat)

## Pendiente

### Traducción bíblica — gestión institucional sigue en curso
- Esperar respuesta de CEC Colombia y CEE España
- BLPD activo como solución temporal — reemplazar si llega algo con licencia más sólida
- Auditoría completa pendiente de `versiculos.js` (366 entradas), tarea aparte

### Joven Fe — Itinerarios (en progreso)
- Completar reescritura de Días 10-40 de "40 días con Santa Clara" (tono joven, "Para tu día a día" generalizado)
- Construir la devoción en código una vez el contenido esté completo (persistencia por día, similar a Lectio Divina/Diario)
- Banco de preguntas "Fe y Vida" — en pausa, retomar como sección secundaria si tiene sentido después de Itinerarios

### Verificación inmediata (tuya)
- Confirmar que el resumen del menú de perfil coincide con la realidad
- Rotar `YOUVERSION_APP_KEY` por seguridad (se compartió en texto plano)

### Home — Paso 2 (su propia conversación futura)
- Navegación inferior tipo tab bar — decidido como proyecto separado

### Home — ajustes menores
- "Lecturas del Día" sin referencia/subtítulo
- Diferenciar bordes entre filas comprimidas y tarjetas de dos columnas
- Ícono de Conec✝2 en accesos rápidos, estilo más "cargado" que sus vecinos

### Conec✝2 — próximos pasos
- Correr `list-public-circles.mjs`
- Construir más círculos temáticos (Finanzas, Trabajo...)
- Funcionalidad futura: ancla diaria, ver quién rezó Rosario/Coronilla hoy, memoria del círculo

### Interfaz — pendiente
- Fecha visible en Inicio y/o Diario
- Revisar pantalla de login (Google/email)

### Parroquias — siguiente fase
- HABLAR CON EL PÁRROCO. San José de Ríogrande · más parroquias
- Google Analytics para tráfico sin cuenta

### Contenido
- Novenas — contenido nuevo, fuente confiable
- `CLASSIC_PRAYERS.en` al inglés
- Rosario: citas en inglés
- 🕊️ (paloma) de Home
- `CalmGlyph` de "Ansiedad" — mejorar
- Lectio Divina al inglés

### Funcionalidad futura
- Push notifications reales
- Monetización — Fase 0 (Cordada, Brisa, Semilla, Cumbre) — conectada a la decisión de formalización legal

### Seguridad — revisar en otra sesión
- `circulos: allow read: if true` expone datos de privados
- Array `miembros` reescribible por cualquier miembro

### Distribución
- PWA sin tiendas. Empaquetar cuando el contenido esté más completo

### Técnico
- Fallback Evangelio: lanza 500 si falla traducción
- Limpieza: cuentas de prueba en Firebase
- `api/confirm-payment.js`: paleta vieja
- CNAME `www` en Namecheap
- 📔 (Tienda) sin ícono SVG

### Hecho ✅
- Marca Horeb completa, migración de fósiles
- Mi Oración: Diario a 90 preguntas
- Devocional: 50 Oraciones en 6 secciones
- La Biblia: buscador + resaltar/comentar
- Coronilla — reconstruida y aprobada
- Menú hamburguesa completo
- Menú de perfil rediseñado
- Notificaciones incompletas retiradas
- Barrido de emojis (3 tandas + Lectio Divina)
- Seguridad Firestore endurecida
- Rosario y Coronilla: bug de doble toque corregido
- Honestidad de cobertura en Parroquias + San Pío X Cali
- Bug de ícono de perfil cerrando sesión — corregido
- Conec✝2 completo (palabra, testimonios, públicos administrados, tarjeta en Inicio)
- Rediseño de Home completo (hero, saludo dinámico, jerarquía)
- Lectio Divina — nueva devoción completa
- Botón/gesto atrás del sistema — navegación entre secciones
- Indicador genérico de función nueva
- **Bug de Universalis corregido (deofuscación + manejo de errores visible)**
- **Traducción bíblica: LBLA reemplazada por BLPD (católica, 73 libros) en Evangelio, Lecturas y La Biblia completa**
- **Cron de reflexión diaria: generación libre de versículos eliminada, causa real del "Jehová" resuelta**
- **Joven Fe repensada: Itinerarios espirituales como ancla, contenido de Santa Clara en reescritura**