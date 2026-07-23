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
| Verde Zarza | `#7A8C6E` — comunidad y confirmación. En uso desde 20 jul 2026: tarjeta "Tu comunidad" de Inicio (estado con círculos) |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` — no hardcodear colores
- Tipografía: Cormorant (títulos), Work Sans (interfaz)

### Barrido de íconos y emojis — completo (3 tandas)
- **Tanda 1:** código muerto eliminado (`t.rosary.steps`, `t.home.reminder`, campo `icon` no usado)
- **Tanda 2:** 📖, ✝️, 🔔, 👤, 🛒, 🕯️ reemplazados por SVG ya existentes
- **Tanda 3:** `LockGlyph`, `GlobeGlyph`, `KeyGlyph`, `PeopleGlyph`, `TrashGlyph`, `BookmarkGlyph`, `SearchGlyph` nuevos; `HorebLoading` reemplaza 🙏/✨; `CalmGlyph`/`CandleGlyph` en `PRAYER_MOODS`
- **Quedan como emoji, a propósito:** 🕊️ (Home, dos rediseños descartados), 📔 (producto Tienda inactiva)
- **Lección:** varios emojis vivían escondidos en constantes de datos (fallbacks, estados de ánimo), no solo en JSX visible

### Fósiles de marca — limpiados
Íconos PWA con cruz azul marino, favicon viejo, resplandores copiados a mano, overlay morado, "Lumora" en email de pago, **eslogan viejo en splash y `manifest.json`** ("Luz que guía, amor que une" → "Sube. Vuelve distinto.")
- **Lección:** motivos/textos de marca deben vivir en un solo lugar; `manifest.json` es un escondite recurrente
- **Pendiente, no urgente:** `api/confirm-payment.js` — paleta vieja, actualizar cuando la Tienda esté activa

### Tono
- Tuteo, español neutro. *"El susurro, no el grito."* Invita, no ordena. Nunca rachas ni gamificación culposa.

## Secciones
1. **Inicio** — 3 bloques con etiqueta discreta arriba de cada uno (mayúsculas, Piedra, sin fondo/borde — `sectionLabel()`): **HOY** (Versículo → Evangelio → Santo del Día → Misas de tu parroquia) → **TU COMUNIDAD** (Conec✝2, 20 jul 2026 — ver detalle abajo) → **TU CAMINO** (Oración Personal → Joven Fe, sin cambios, solo desplazados)
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), Santo Rosario, Coronilla de la Divina Misericordia, Devocional
3. Evangelio — "Ponlo en Práctica"
4. **La Biblia** — buscador temático + navegación directa + resaltar/comentar versículos
5. Lecturas del día
6. Santo Rosario
7. Coronilla de la Divina Misericordia
8. Devocional — Oraciones (50, en 6 secciones), Novenas (en construcción), Santo del Día
9. Tienda — en construcción
10. Configuración — incluye "Tu parroquia". Notificaciones retirada (función incompleta)
11. Joven Fe

## Mi Oración — 4 pestañas
- **Crear Oración:** 8 estados de ánimo (íconos SVG/marca) → versículo + santo patrono → intención → "Orar"
- **Mis Oraciones (unificada):** Firestore fuente única con sesión, localStorage de respaldo sin sesión. Permite borrar. Migración automática de datos heredados
- **Diario (90 preguntas):** gratitud y reflexión, no intenciones. Selección por día del año (ciclo ~90 días), anclado a America/Bogota. Una entrada por día, no editable ni borrable. `preguntaIndex` guardado por entrada
- **Conec✝2:** ver sección dedicada abajo

## Conec✝2 — círculos de oración

### Funcionalidad base
- Círculos privados/públicos, intenciones, rastro de luz de actividad nueva (punto sutil en 4 niveles de navegación)
- Íconos de privacidad/comunidad: SVG propios (`LockGlyph`, `GlobeGlyph`, `KeyGlyph`, `PeopleGlyph`, `TrashGlyph`)

### Palabra al orar y testimonios (20 jul 2026)
- **"Estoy orando" con palabra opcional:** botón rápido sigue instantáneo. Enlace "Agregar unas palabras" (ícono +, sin subrayado, color Piedra) permite sumar nota corta (140 car.), disponible antes O después de marcar "orando". Se guarda en `oracionesPalabras` (array de mapas: uid, nombre, palabra, fecha en ms — `serverTimestamp()` no se permite dentro de arrays)
- **Marcar como respondida, con testimonio opcional:** solo el autor puede marcarla (verificado en reglas). Testimonio de 300 car., opcional. Compartido → vive en la intención (visible al círculo). Privado → se guarda en `usuarios/{uid}/oraciones`, no en el círculo. Pastilla con borde dorado, separada visualmente (antes: texto subrayado sin jerarquía)
- **Reglas de Firestore confirmadas y publicadas** ✅ — `oracionesPalabras`+`orando` permitidos juntos para cualquier miembro (viajan en la misma escritura); `respondida`/`fechaRespuesta`/`testimonio` solo para el autor
- **Bug del parpadeo de "Estoy orando" resuelto** — causado por `permission-denied` silencioso de Firestore (la regla anterior no contemplaba que `orando` y `oracionesPalabras` viajan juntos en la misma escritura). Diagnosticado midiendo timing contra build de producción real (~700ms entre update optimista y fallo)
- **Segundo bug relacionado, resuelto:** "Agregar unas palabras" solo aparecía ANTES de tocar "Estoy orando" — error de diseño en la condición de render. Corregido para permitir el flujo natural (marcar rápido → decidir después si dejar palabra)

### Círculos públicos = administrados (20 jul 2026)
- **Cambio de modelo:** círculos privados siguen abiertos para cualquier usuario. Círculos públicos ahora exclusivos de cuentas admin
- `usuarios/{uid}.esAdmin`: booleano, se setea A MANO desde la consola — bloqueado para escritura del cliente (sin esto cualquier usuario podría auto-nombrarse admin)
- UI: el botón "Público" en "Crear círculo" solo se muestra si `isAdmin`
- **`tipo` queda fijo para siempre** tras crear el círculo — ni un admin puede cambiarlo (evita que un admin comprometido exponga círculos privados ajenos, o "adopte" uno como oficial)
- **Borrar círculos públicos:** cualquier admin puede, sin importar quién lo creó — administración colectiva. Privados: sin cambios, solo el creador
  - **Bug encontrado y resuelto (20 jul 2026):** la regla ya lo permitía, pero **no existía ningún botón de borrar círculo en toda la app** (solo "abandonar", que quita la propia membresía, no borra el documento) — ni para admins ni para nadie. Agregado `deleteCircle()` + botón "Eliminar este círculo público" (solo si `selectedCircle.tipo === "publico" && isAdmin`, coincide con la regla), con paso de confirmación inline (mensaje + "Sí, eliminar"/"Cancelar") porque borra la sala completa para todos los miembros, no un solo mensaje — verificado que aparece incluso en un círculo público creado por *otro* admin
- **Insignia "oficial" — implementada (20 jul 2026):** `OfficialBadge` (componente reutilizable, círculo dorado con check, NO el signo de Horeb que sigue reservado para splash/favicon/imágenes). Con la regla de admin vigente, `tipo === "publico"` ya implica oficial, sin campo extra. Aplicada en 3 lugares: lista de exploración de públicos, encabezado dentro del círculo, y la tarjeta "Tu comunidad" de Inicio (ver abajo)
- **No se construyeron aún los círculos temáticos en sí** (Salud, Finanzas, Trabajo) — primero se cerró el permiso
- **Confirmado (20 jul 2026):** Carlos ya está marcado `esAdmin: true` en Firestore, crear círculos públicos funciona
- **Editar nombre/descripción (20 jul 2026):** ícono de lápiz (`PencilGlyph`, misma forma que el de comentar versículos en La Biblia) junto al nombre, dentro del círculo — solo visible si `canEditCircle` (privado → `creadorId === uid`; público → `isAdmin`, sin importar quién lo creó, mismo criterio que el borrado). Al tocarlo abre formulario inline (nombre + descripción, precargados) con "Guardar"/"Cancelar". `updateCircleInfo()` hace `updateDoc` con solo esos dos campos. Regla de Firestore ya publicada: tercer `allow update` en `circulos` con `affectedKeys().hasOnly(['nombre', 'descripcion'])` bajo el mismo criterio privado/público que el borrado — confirmado que no interfiere con las otras reglas de `update` ya existentes (Firestore las evalúa por separado). Verificado con 3 escenarios: privado (creador ve el lápiz), privado (no-creador no lo ve), público "Salud" creado por otro admin (lo ve igual, por ser admin, no por ser creador)
- **Tarjeta "Tu comunidad" en Inicio (20 jul 2026):** entre "Hoy" y "Tu camino". 3 estados: sin sesión ("Nadie sube solo. Únete a un círculo y ora acompañado." → inicia sesión), con sesión sin círculos ("Crea un círculo o únete a uno — la oración se sostiene mejor entre varios." → tab Conec✝2) — estos dos mantienen el motivo decorativo dorado de Parroquia/Santo del Día, sin tocar. Con círculos: muestra el círculo con `ultimaIntencionFecha` más reciente (`mostActiveCircle`, fallback al primero si ninguno tiene actividad). Tocar la tarjeta lleva directo al círculo — para eso `loadIntenciones`/`openCircle` se subieron de `renderPersonalPrayer` a nivel de `App()`, ya que antes solo existían en ese closure
  - **Filosofía del estado "con círculos": "invitar sin exhibir" (20 jul 2026, iteración final tras un primer intento con cita protagonista que se descartó por completo).** Esta tarjeta **nunca lee ningún documento de intenciones** — se quitó por completo esa consulta a Firestore, así queda garantizado en el propio código (no solo por convención) que ningún texto ni atribución de una intención real puede aparecer aquí bajo ningún escenario. Solo usa datos que ya vienen en el documento del círculo: nombre (tamaño real de título, como "San Elías Profeta" en Santo del Día) y un texto sereno agregado — "Tu círculo tiene algo nuevo." si `circleLooksNew` da true para ese círculo, si no "N personas en tu círculo." con `miembros.length`. Sin encabezado "✦ Conec✝2" (la etiqueta de sección ya cumple esa función). Sin comillas, sin "— Fulano", nunca
  - **Debut de Verde Zarza** (`VERDE_ZARZA` en `theme.js`, "comunidad y confirmación" del brand book, primer uso en todo el proyecto): borde sólido (no tenue — ajustado tras feedback de que el primer intento era demasiado sutil), + el mismo motivo de círculos de luz difusos de Parroquia/Santo del Día pero teñido en Verde Zarza en vez de dorado, con un pulso constante de opacidad (`communityDecorPulse`, siempre activo, para transmitir "algo vivo") — nunca el signo de Horeb, esa regla de marca sigue intacta. Insignia oficial (si aplica) sigue junto al nombre. CTA "Entrar al círculo ›" se queda en dorado, coherente con el resto de la app. **Solo afecta este estado de esta tarjeta** — estados 1/2 de Inicio y la lista compacta "Mis Conec✝2" dentro del tab no se tocaron
  - **Destello de novedad:** además del pulso ambiental de arriba, un segundo resplandor pulsante (`communityGlowPulseVerde`, box-shadow, 2.2s) solo cuando `circleLooksNew` es true **para ese círculo específico** (no el agregado `hasAnyNewCircleActivity` de todos los círculos — corregido para que la tarjeta no se equivoque si la novedad está en OTRO círculo distinto al mostrado). El punto de luz sutil (`LightDot`) sigue igual en el resto de la navegación. Verificado que el resplandor se apaga al visitar el círculo (mismo `markCircleSeen` optimista de siempre)
- **Pendiente inmediato:** correr `list-public-circles.mjs` (ya en el repo, solo lectura, sin commitear todavía) para ver cuántos círculos públicos existen hoy de usuarios comunes y decidir qué hacer

### Visión — Conec✝2 + Parroquias (próxima fase grande)
- **Idea central:** la parroquia ES un círculo de oración, el más grande y real. Unir ambos conceptos
- **Conec✝2 a Inicio: ✅ hecho (20 jul 2026)** — ver detalle en la sección Conec✝2 arriba
- Ideas futuras: ancla diaria del círculo, ver quién rezó Rosario/Coronilla hoy, memoria/línea de tiempo del círculo

## Santo Rosario — alineado a la Santa Sede
- 20 misterios oficiales, citas bíblicas literales de vatican.va
- Misterio del día anclado a America/Bogota. 6 pasos español (con meditación), 5 inglés
- Contador "luz que crece". Persistencia con retomar solo si es del día correcto
- Acto de Contrición colombiano/latinoamericano
- Exporta `OUR_FATHER`, `HAIL_MARY`, `APOSTLES_CREED` — reutilizadas por la Coronilla

## Coronilla de la Divina Misericordia
- `src/Coronilla.jsx`, misma arquitectura que `Rosario.jsx`. Reutiliza oraciones exportadas, cero duplicación
- Pantalla de historia (Santa Faustina, 1935) — sin tocar
- **Reconstrucción con fuente completa (23 jul 2026) — pendiente de aprobación de Carlos, no dar por cerrado.** La versión anterior estaba incompleta en dos puntos: solo una década (no cinco) y una versión corta de las oraciones de apertura. Estructura correcta ahora: Señal de la Cruz → Oración de Santa Faustina (Diario, 72, en 2 pantallas: la oración + su continuación "Expiraste, Jesús...") → Oh Sangre y Agua ×3 → Padre Nuestro/Ave María/Credo → **5 décadas** (Grano Mayor + 10 Granos Menores cada una, mismo anillo y mecanismo que el Rosario, insignia "Década X de 5") → Santo Dios ×3 → **2 oraciones finales** (ambas siempre visibles, ninguna opcional — la segunda es Diario, 1570) → cierre
- El Grano Mayor y los Granos Menores cambiaron de texto con la fuente completa: "como propiciación" → "en expiación", "Por Su dolorosa Pasión" → "Por los méritos de su dolorosa Pasión", entre otras diferencias de fondo, no solo de puntuación
- Persistencia: `pageIndex` + `counts` (por década: `granos-menores-{d}`) — la década se deriva de `pages[pageIndex].decadeIndex`, sin campo aparte, mismo mecanismo que usa `Rosario.jsx` para `mysteryIndex` (solo `mysteryKey` se guarda aparte allá porque afecta qué páginas se construyen según el día de la semana; las 5 décadas de la Coronilla no dependen del día, así que no aplica un equivalente). Verificado: salir a mitad de la Década 2 y volver ofrece retomar específicamente en "la Década 2 de 5", no un genérico "en curso"
- Todos los textos nuevos verificados programáticamente contra la fuente literal (carácter por carácter, no solo revisión visual) — 9/9 coinciden exactamente
- **Decidido (23 jul 2026):** Padre Nuestro, Ave María y Credo de los Apóstoles se quedan tal cual están exportados en `Rosario.jsx` — vatican.va es la fuente más autorizada para estas tres oraciones específicas, no la fuente nueva de la Coronilla. Sin cambios de código: Coronilla ya las importaba sin duplicar el texto
- `Rosario.jsx` no se modificó — confirmado por diff, cero cambios

## Devocional — Oraciones (50 en 6 secciones)
- Renombrado de "Oraciones Clásicas" a "Oraciones"
- I. Básicas (13) · II. Santa Misa (7) · III. Virgen María (10) · IV. Espíritu Santo (8) · V. Jesucristo (6) · VI. Protección y Santos (6)
- Acordeón de dos niveles. Ángelus con formato diálogo (V./R.). Texto a 17px
- Acto de Contrición: misma fórmula que Rosario/Coronilla
- Novenas: contenido retirado, `<ComingSoon>` mientras se prepara contenido nuevo
- Santo del Día: sin modificaciones

## La Biblia — buscadores + resaltar y comentar
- Buscador temático: "Busca lo que tu corazón necesita hoy". Navegación directa: "Ir a una cita" (libro/capítulo/versículo)
- Memoria de lectura conservada deliberadamente (marcador de lectura)
- Resaltar (toque simple) y comentar (mantener presionado) versículos — dorado 30%, funciona en lectura y en resultados de búsqueda
- "Mis Versículos": vive dentro de La Biblia, navega al capítulo con el versículo centrado

## Menú hamburguesa — arreglos completos
- Cierra al tocar/scrollear fuera del panel. Accesos rápidos cierran al navegar. Cierre fantasma corregido (carrera entre eventos)

## Notificaciones — retiradas temporalmente
- Función incompleta (`setTimeout` sin persistencia real) eliminada, `<ComingSoon>` en su lugar
- Push notifications reales: proyecto propio pendiente (FCM, service worker con push handler, tokens, cron server-side, limitación de iOS)

## Rastro de luz — Conec✝2
- Aviso in-app. Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo. Se apaga solo al abrir el círculo con la novedad

## Seguridad Firestore — endurecida ✅ (12 jul 2026, ampliada 20 jul 2026)
- `usuarios/{uid}` y **toda subcolección**: solo el propio usuario — cubre `oraciones`, `diario`, `versiculosGuardados`, futuras subcolecciones sin reglas nuevas
- `reflexiones`, `versiculos`, `parroquias`: lectura pública, escritura bloqueada (solo servidor vía admin)
- `circulos` e `intenciones`: solo miembros para leer/escribir intenciones; reglas por campo específicas
- **No hay archivo `firestore.rules` versionado** — se gestionan directamente en consola de Firebase
- **Círculos públicos = administrados (20 jul 2026):** `usuarios/{uid}.esAdmin` (booleano, seteado a mano, bloqueado para escritura del cliente) — solo admins crean círculos con `tipo: "publico"` (regla + UI gatean ambos). `tipo` fijo para siempre, ni un admin lo cambia después. **Borrar círculos públicos: cualquier admin puede, sin importar quién lo creó** — administración colectiva. Privados sin cambios.
- **Pendiente de seguridad, sin tocar (hallazgos del 20 jul 2026, revisar en otra sesión):**
  - `circulos` tiene `allow read: if true` — cualquiera, sin sesión, puede leer cualquier círculo incluidos privados: código de acceso y lista de miembros expuestos a quien consulte Firestore directamente. Probablemente necesario para unirse por código/explorar públicos, pero vale revisar el tradeoff
  - En `circulos` `update`, cualquier miembro puede reescribir el array `miembros` completo, no solo su propia membresía — en teoría podría sacar a otro (o al creador) del círculo

## Cron de reflexión diaria
- `firebase-admin`. ✅ Verificado: se dispara solo en plan Hobby

## Parroquias — misas
- Colección `parroquias`, datos oficiales de la Diócesis de Zipaquirá. 3 parroquias (Cajicá). Falta San José de Ríogrande
- "Horarios de Misa" evaluado y descartado (sin API, modelo colaborativo sin respaldo eclesial). Camino: diócesis por diócesis con aval oficial
- Ver también "Visión — Conec✝2 + Parroquias" arriba

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, signo de Horeb, sin fecha. Ponlo en Práctica (primer consejo) y Versículo del Día. Link a somoshoreb.com. Botón "Comparte esta luz"

## Navegación
- `goToTab(i)` centralizado. **Excepción — La Biblia:** conserva su estado deliberadamente

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx` (exporta oraciones compartidas), `src/Coronilla.jsx`, `src/Devocional.jsx`, `src/diarioPreguntas.js`
- `src/santos.js`, `src/versiculos.js`, `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`, `list-public-circles.mjs` (nuevo, solo lectura, pendiente de correr)
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (v19), `public/favicon.svg`, `public/manifest.json`, `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`. Cambios requieren REDEPLOY

## Pendiente

### Conec✝2 — próximos pasos inmediatos
- Correr `list-public-circles.mjs` y decidir qué hacer con círculos públicos existentes de usuarios comunes
- Implementar la insignia "oficial" (marca de verificación) en exploración + dentro del círculo
- Marcar tu cuenta como `esAdmin: true` a mano en Firestore
- Enviar la instrucción ya armada: bloque "Tu comunidad" en Inicio
- Construir los círculos temáticos en sí (Salud, Finanzas, Trabajo) — después de validar el permiso

### Conec✝2 — funcionalidad futura
- Ancla diaria del círculo (contenido automático para evitar silencio entre publicaciones)
- Ver quién del círculo rezó Rosario/Coronilla hoy
- Memoria/línea de tiempo del círculo

### Parroquias — siguiente fase
- HABLAR CON EL PÁRROCO. Mensajes ya redactados
- San José de Ríogrande · más parroquias si el directorio las tiene · canal "escríbenos"
- Verificar usuarios: Firebase Console → Authentication → Users. Para tráfico sin cuenta, falta Google Analytics

### Contenido
- Novenas — contenido nuevo, fuente confiable, NO generado
- `CLASSIC_PRAYERS.en` — traducir las 50 al inglés
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas bíblicas oficiales en inglés
- 🕊️ (paloma) de Home — retomar con otro enfoque
- `CalmGlyph` de "Ansiedad" — diseño temporal, mejorar

### Funcionalidad futura
- Push notifications reales — proyecto propio completo
- Monetización — Fase 0: definir modelo (Cordada, Brisa, Semilla, Cumbre)

### Seguridad — revisar en otra sesión
- `circulos: allow read: if true` expone código de acceso y miembros de círculos privados
- Un miembro cualquiera puede reescribir el array `miembros` completo

### Distribución
- PWA sin tiendas. iPhone: 5 pasos ocultos en Safari. Empaquetar cuando el contenido esté más completo

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción
- Limpieza: cuentas de prueba en Authentication, claves de servicio sin usar en Firebase
- `api/confirm-payment.js`: paleta de color vieja
- CNAME del `www` en Namecheap (no urgente)
- 📔 (producto Tienda) sin ícono SVG

### Hecho ✅
- Marca Horeb completa: nombre, dominio, logo, paleta, limpieza de fósiles
- Mi Oración: Diario unificado + ampliado a 90 preguntas
- Devocional: 50 Oraciones en 6 secciones, Novenas retiradas a "en construcción"
- La Biblia: buscador temático + navegación directa + resaltar/comentar versículos
- Coronilla de la Divina Misericordia — nueva devoción completa
- Menú hamburguesa: arreglos completos
- Notificaciones incompletas retiradas
- Barrido completo de emojis (3 tandas), `HorebLoading` como estado de carga unificado
- Seguridad Firestore endurecida · Parroquias: selección + horarios · Compartir como imagen
- Rosario alineado a la Santa Sede · Santo del Día en Inicio · Cron verificado
- Service worker en v19
- **Conec✝2: palabra opcional al orar + testimonios de intenciones respondidas, con rediseño visual**
- **Conec✝2: círculos públicos exclusivamente administrados, reglas de Firestore confirmadas y publicadas**