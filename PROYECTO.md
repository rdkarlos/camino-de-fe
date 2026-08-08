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
11. Joven Fe

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

## ⚠️ Traducción bíblica — problema de fondo, gestión activa en curso (2 ago 2026)

### El problema
Carlos notó "Jehová" en el Versículo del Día — señal de traducción protestante. Confirmado: **LBLA (La Biblia de las Américas)**, usada en TODA la app (Versículo del Día, La Biblia, Evangelio del Día, Lecturas del Día), es traducción evangélica de la Lockman Foundation, sin aprobación católica.

**Alcance del código, confirmado por búsqueda exacta en el repo:**
- `versiculos.js` — banco propio de 366 versículos, texto estático escrito a mano. **Origen exacto desconocido** — no se generó en esta sesión ni hay registro de sesiones anteriores que lo confirmen; probablemente basado en LBLA. Requiere su propia auditoría completa cuando se resuelva la fuente.
- `api/gospel.js:12` — `const BIBLE_ID = 'e3f420b9665abaeb-01'` — alimenta Evangelio + Lecturas (mismo endpoint para ambos)
- `src/App.jsx:4291` — mismo Bible ID, alimenta "La Biblia" (7 llamadas más abajo la reutilizan)
- **Total: 2 líneas de código a cambiar** para redirigir Evangelio+Lecturas+La Biblia a una nueva traducción, una vez se consiga una fuente legítima. El Versículo del Día (366 entradas estáticas) es tarea aparte, más grande.

### Investigación de fuentes — TODAS descartadas hoy, con motivo verificado

**API.Bible (nuestra cuenta):** 8 Biblias en español disponibles (LBLA, NBLA, RVR09, Palabra de Dios para ti ×2, Español Sencillo, VBL ×2) — verificado contando libros reales vía API (66 o menos en todas; católico = 73). Cero deuterocanónicos en ninguna. La documentación general de API.Bible menciona "hundreds of Bibles" y que el plan Starter gratis permite elegir 3 "licensed Bibles" adicionales — **pendiente verificar si ese catálogo ampliado (Additional Bibles / Express Licensing) tiene alguna católica**, no confirmado aún.

**YouVersion Platform:** cuenta creada, App Key obtenida y guardada en Vercel (`YOUVERSION_APP_KEY` — **recomendado rotarla**, se compartió en el chat). 9 Biblias en español disponibles por defecto, cero católicas (mismas familias: Reina-Valera Antigua, Palabra de Dios para ti, NVI, VBL, etc.). Traducciones católicas (Nácar-Colunga, Biblia Latinoamericana) existen en su catálogo general según búsqueda web, pero requieren solicitar licencia específica, no vienen por defecto. **Riesgo adicional real:** uso "non-commercial lock-in" — si Horeb monetiza en el futuro, se pierde el acceso a la API.

**Magisterium AI:** no es fuente de texto bíblico — es IA conversacional para preguntas doctrinales. Sigue como candidato para capa de precisión doctrinal de "Ponlo en Práctica" (ya documentado antes), no para esto.

**vatican.va:** aloja la Biblia de Jerusalén completa en español (confirmado — usa "Yahveh", coincide con Génesis 1:1 de esa traducción), pero sus términos de uso son explícitos: "uso personal y sin fines de lucro" — no autoriza extracción/redistribución en una app de terceros. Sujeto además a la ley de copyright vaticana (2011, Ley CXXXII).

**Repositorios de código abierto (descartados, mismo patrón en los tres):**
- NPM `biblia-de-jerusalen` — licencia MIT cubre el CÓDIGO, no el texto (copyright confirmado de Desclée De Brouwer)
- GitHub `eneleich1/La-Biblia` y `eneleich1/La-Biblia-de-Jerusalen-Project` (mismo autor, dos nombres) — el propio autor reconoce en el README no haber verificado derechos de redistribución; proyecto de portafolio técnico, no fuente para producción
- GitHub `catholicbibletools/cbt` — incluye Libro del Pueblo de Dios y Biblia Latinoamericana en su lista, pero mismo problema de licencia de texto no aclarada + proyecto abandonado desde 2020 (9 estrellas, sin commits recientes)

**BibleGet I/O** (`query.bibleget.io`) — única fuente con licencia de texto genuinamente confirmada (gestionada por su creador, sacerdote de la diócesis de Roma) para "Libro del Pueblo de Dios" (BLPD): católica, imprimatur, deuterocanónicos confirmados en vivo (Tobías 3:11 probado), gratis, sin restricción comercial. Documentación desactualizada (rutas dan 410, hay que descubrir las reales en vivo). Proyecto de un solo desarrollador, presupuesto anual ~€70. **Descartada por decisión explícita de Carlos** — "necesitamos resolver esto de fondo, si no es confiable mejor no". Queda como posible solución temporal si los caminos institucionales tardan demasiado.

**PDF de la Biblia CEE (epublibre.org):** Carlos tenía un PDF de la Sagrada Biblia (versión oficial CEE, 2011). **Confirmado que es una copia pirata** — el propio archivo trae el aviso característico de epublibre.org sobre distribución no autorizada. No se usó ni se usará su texto. Sí sirvió como pista legítima: confirma que **BAC (Biblioteca de Autores Cristianos)** hizo el trabajo editorial de esa versión bajo encargo de la CEE — dato real para las gestiones en curso.

### Gestiones institucionales activas — dos frentes en paralelo

**1. Digital Bible Library (DBL) — RECHAZADA por falta de registro legal, sin retomar por ahora**
Operada por United Bible Societies. Se encontró en su catálogo *"Dios Habla Hoy Orden Alejandrino DC Estándar"*, con etiqueta explícita **"Bible with Deuterocanon"** — confirmaba ser la edición católica de DHH (a diferencia de la de API.Bible). Cuenta personal creada, organización "Horeb" registrada como "Distributor". **Respuesta oficial de DBL:** solicitaron verificación organizacional (no encontraron info institucional en somoshoreb.com) y señalaron que la organización quedó marcada como "hidden" sin querer. Carlos respondió con transparencia (proyecto independiente, sin entidad legal formal, ofreciendo referencia parroquial). **Respuesta final de DBL, con P.D. decisiva:** *"Only legally registered organizations can request license agreements for Controlled Access content."* — **requisito estructural, no negociable con más contexto.** Este camino queda cerrado hasta que Horeb tenga una entidad legal registrada en Colombia (fundación, SAS, o similar) — anotado como posible paso futuro de formalización del proyecto, con beneficios más allá de esto (licencias, patrocinios, monetización sin las restricciones de YouVersion).

**2. Conferencias Episcopales — en espera de respuesta, sin ETA**
- **Correo enviado a la Conferencia Episcopal de Colombia** (doctrinaybiblia@cec.org.co, Departamento de Doctrina y Animación Bíblica, contacto: padre Jorge Bustamante Mora). Presenta a Horeb, menciona a Carlos como feligrés de la Parroquia Virgen del Rosario de Calahorra (Cajicá, Diócesis de Zipaquirá), pregunta por traducción recomendada/licenciada, cómo gestionar permiso, y a quién más dirigirse (CELAM, Sociedades Bíblicas Unidas) si no es el canal correcto.
- **Correo preparado para la Conferencia Episcopal Española** (destinatario exacto pendiente de confirmar) — presenta el proyecto con la misma honestidad, aclarando explícitamente que la parroquia de Carlos queda en Colombia (no España), y siendo transparente sobre monetización futura: hoy sin ánimo de lucro, pero sin descartar algún esquema a futuro para sostener mantenimiento — pregunta por licencia de la Sagrada Biblia CEE, si las condiciones cambian según fin de lucro, costos, y si BAC es el interlocutor correcto en su lugar.

**Estado: 2 gestiones institucionales en curso, sin retomar código hasta tener una fuente legítima confirmada.**

### Decisión pendiente, aparte, para cuando se resuelva la fuente
Los 366 versículos de `versiculos.js` no se actualizan solos al cambiar de API — es contenido estático que requiere su propia revisión/reescritura completa, con el mismo cuidado (verificación carácter por carácter) que el resto del contenido litúrgico del proyecto.

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
- `api/gospel.js` (⚠️ Bible ID de LBLA, línea 12), `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (**v20**), `public/favicon.svg`, `public/manifest.json`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`, `YOUVERSION_APP_KEY` (nueva, 2 ago — **recomendado rotarla**, se compartió en el chat)

## Pendiente

### Traducción bíblica — máxima prioridad, gestión en curso
- Esperar respuesta de CEC Colombia (correo enviado) y CEE España (correo preparado)
- Verificar catálogo "Additional Bibles"/Express Licensing de API.Bible por si hay alguna católica no vista aún
- Considerar formalización legal de Horeb como entidad — reabriría DBL y otras puertas
- Cuando se resuelva: cambiar 2 líneas (`api/gospel.js:12`, `src/App.jsx:4291`) + auditoría completa de los 366 versículos de `versiculos.js`

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
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas en inglés
- 🕊️ (paloma) de Home
- `CalmGlyph` de "Ansiedad" — mejorar
- Lectio Divina al inglés

### Funcionalidad futura
- Push notifications reales
- Monetización — Fase 0 (Cordada, Brisa, Semilla, Cumbre) — **ahora conectada a la decisión de formalización legal**, ver arriba

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
- **Lectio Divina — nueva devoción completa**
- **Botón/gesto atrás del sistema — navegación entre secciones**
- **Indicador genérico de función nueva**
- **Investigación exhaustiva de fuentes bíblicas católicas — 2 gestiones institucionales en curso (CEC Colombia, CEE España)**