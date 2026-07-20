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
- Prop `animated` (nuevo, default `false`, opt-in): activa el pulso de "respiración" del halo del sol — ver `HorebLoading` abajo
- Umbral de simplificación: 32px. IDs de gradientes con `useId()`
- **El logo NO va en las tarjetas de la app** — ahí va un motivo decorativo (círculos difusos + punto de luz en Brisa de Alba). El logo se reserva para splash, favicon/PWA y firma de imágenes compartidas
- Reemplazó el ícono del modal de login (antes: emoji ✝️, se veía morado según el dispositivo)

### `HorebLoading` — estado de carga unificado (14 jul 2026)
- Componente nuevo que envuelve `Horeb.jsx` con `animated={true}`: el halo del sol crece y se encoge en un ciclo suave (2.2s, ease-in-out), el trazo del monte permanece fijo — mismo lenguaje que "la luz que crece" del Rosario
- Respeta `prefers-reduced-motion` automáticamente
- **Reemplazó 10 apariciones del emoji 🙏** (estado de carga genérico) en: La Biblia (capítulos, búsqueda, versículos, Mis Versículos), Mis Oraciones, Diario, Conec✝2 (2 vacíos + botón crear), confirmación de pago
- Tamaños usados: 60px (confirmación de pago), 44px (vacío Conec✝2), 36px (vacío intenciones), 32px (Mis Oraciones/Diario/Biblia), 24px (lista capítulos), 18px (inline en botón)

### Paleta (brand book Horeb) — migrada
| Nombre | Hex |
|---|---|
| Noche de Horeb | `#1E2630` |
| Brisa de Alba (ALBA) | `#E4C79B` |
| Lino | `#F5F1E8` |
| Cielo de Altura (CIELO) | `#8497A6` |
| Arena del Monte (PIEDRA) | `#C7B79C` |
| Verde Zarza | `#7A8C6E` — se probó para el resaltado de versículos, Carlos prefirió el dorado. **Sigue sin uso asignado.** |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` — no dejar rgba/mix hardcodeados
- Contraste verificado: Brisa de Alba MÁS contraste que el dorado anterior contra Noche (9.4:1 vs 8.1:1)
- Tipografía: Cormorant (títulos), Work Sans (interfaz)

### Barrido de íconos y emojis (14 jul 2026) — 3 tandas
Se hizo un inventario exhaustivo de emojis en `src/` y `public/`: 21 distintos, 55 apariciones. Reemplazados por SVG propios (trazo fino 1.5-1.8px, sin relleno, color desde `theme.js`) o eliminados por ser código muerto.

**Tanda 1 — código muerto eliminado:** `t.rosary.steps`, `t.home.reminder`, campo `icon: "📖"` no usado en `t.home.cards` — arrastraban 7+ apariciones de emoji que nunca se renderizaban (hermanos de los fósiles de marca ya encontrados antes).

**Tanda 2 — reemplazos con SVG ya existente:** 📖 (`navIcons`), ✝️ (ícono de cruz de pantallas de cierre), 🔔 (el de `<ComingSoon>`), 👤 (avatar del menú), 🛒 (bolsa de compras), 🕯️ (`CandleGlyph`, ya hecho para Novenas).

**Tanda 3 — SVG nuevos + `HorebLoading`:**
- `LockGlyph`, `GlobeGlyph`, `KeyGlyph`, `PeopleGlyph`, `TrashGlyph` — Grupo A, Conec✝2 (privado/público/código/miembros/borrar), 13 apariciones
- `BookmarkGlyph` — extraído del ícono que ya existía en "Mis Versículos" y reutilizado ahí también (sin duplicar), aplicado a 2 estados vacíos + el propio botón
- `SearchGlyph` — reemplaza 🔍 en el buscador de La Biblia
- `HorebLoading` — reemplaza 🙏 y ✨ (10 apariciones, ver arriba)
- `CalmGlyph` — dos líneas onduladas, reemplaza 🕊 en `PRAYER_MOODS` (ánimo "Ansiedad"). **Deliberadamente genérico/temporal** — pendiente diseñar algo mejor en otra sesión
- `CandleGlyph` reutilizado también en `PRAYER_MOODS` (ánimo "Duelo", antes 🕯)

**Hallazgo importante:** `PRAYER_MOODS` (✝ ♡ ✞ ✦ ✿ 🕯 🕊) se había clasificado como "tipografía de marca, no emoji" en el inventario original — correcto para la mayoría, pero 🕯 y 🕊 SÍ eran pictogramas de emoji reales sin selector de variación, y se colaron sin detectarse hasta que Carlos reportó "una velita en Mis Oraciones".

**Quedan como emoji, a propósito:**
- 🕊️ (Home, tarjeta "Oración Personal") — se intentó rediseñar DOS veces (de frente con alas simétricas, luego de perfil en vuelo) y ninguna mejoró el original. Se mantiene el emoji. Pendiente retomar con otro enfoque en otra sesión.
- 📔 (producto de Tienda) — baja prioridad, `products.js` no se renderiza en ningún lado (Tienda inactiva)

**Lección reafirmada:** varios emojis vivían escondidos en lugares no obvios — un contador de estados de ánimo, un fallback de función, código muerto heredado. El grep de texto por sí solo no basta; hace falta revisar también los SVG/emoji embebidos en constantes de datos, no solo en el JSX visible.

### Fósiles de marca — limpiados
Restos de versiones anteriores encontrados en distintas sesiones: íconos PWA con cruz azul marino `#1B2A4A`, favicon viejo, resplandores copiados a mano, overlay morado en Joven Fe, splash con hex suelto, sprite `icons.svg` huérfano, constantes `BLUE`/`BLUE_DARK` muertas, "Lumora" en el email de pago, **y el eslogan viejo ("Luz que guía, amor que une") en el splash y `manifest.json`**, reemplazado por "Sube. Vuelve distinto." / "Rise. Return renewed."
- **Lección:** si algo es un motivo de marca o texto de marca, debe vivir en un solo lugar (componente o constante), no copiado a mano en varios sitios — y el `manifest.json` es un escondite recurrente porque no se ve en la interfaz normal.
- **Pendiente, no urgente:** `api/confirm-payment.js` — paleta de color vieja (ya tiene el texto correcto "Horeb"), se actualiza cuando la Tienda esté activa de verdad.

### Tono
- Tuteo, español neutro, sin regionalismos ni clericalismos. *"El susurro, no el grito."* Invita, no ordena. Nunca rachas ni gamificación culposa.

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo → Evangelio → Santo del Día → Misas de tu parroquia. Bloque "Tu camino": Oración Personal → Joven Fe
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), **Santo Rosario**, **Coronilla de la Divina Misericordia**, Devocional
3. Evangelio — "Ponlo en Práctica"
4. **La Biblia** — LBLA, buscador temático + navegación directa + resaltar/comentar versículos
5. Lecturas del día
6. Santo Rosario
7. Coronilla de la Divina Misericordia
8. Devocional — **Oraciones** (50, en 6 secciones), Novenas (en construcción), Santo del Día
9. Tienda — en construcción
10. Configuración — incluye "Tu parroquia". **Notificaciones retirada** (ver detalle abajo)
11. Joven Fe

## Mi Oración — 4 pestañas

### Crear Oración
- Grid de 8 estados de ánimo (íconos ahora todos SVG/símbolos de marca, sin emoji real) → versículo + santo patrono → intención en texto libre → "Orar" (plantillas fijas)
- Guardar requiere sesión

### Mis Oraciones (unificada — antes existía "Diario" duplicando este contenido)
- Firestore fuente única con sesión (`usuarios/{uid}/oraciones`), localStorage de respaldo sin sesión
- Permite borrar (antes no). Migración automática de datos heredados por comparación de texto

### Diario — ampliado a 90 preguntas (14 jul 2026)
- **Distinto de Mis Oraciones:** gratitud y reflexión, no intenciones
- `src/diarioPreguntas.js` — **90 preguntas** (ampliado de 30), mismo tono (examen ignaciano + gratitud, nunca culpa)
- **Selección por día del año** (cambiado de día del mes): `(díaDelAño - 1) % PREGUNTAS_DIARIO.length`, anclado a America/Bogota, ciclo de ~90 días antes de repetir. Usa `.length` en vez de número fijo — si se agregan más preguntas en el futuro, no hay que tocar dos lugares
- Verificado con 4 fechas + un año bisiesto (2028) — el día extra no rompe el ciclo
- **Una entrada por día**, ID del doc = fecha de hoy (determinístico)
- **Entradas NO editables ni borrables.** Cada entrada guarda su propio `preguntaIndex` al crearse — entradas viejas no se ven afectadas por cambios futuros en la lógica de selección o en la cantidad de preguntas

### Conec✝2
- Círculos privados/públicos, intenciones, rastro de luz. Íconos de privacidad/comunidad ahora SVG propios (antes 🔒🌍🔑👥🗑)
- **Palabra opcional al orar + respondida con testimonio (20 jul 2026):** "Estoy orando" sigue siendo un toque instantáneo sin texto por defecto; junto a él, un enlace "Agregar unas palabras" abre un campo opcional (140 car., `oracionesPalabras` en el doc de la intención) que cualquiera puede expandir con "Ver palabras" — notas tipo cita, no hilo de comentarios. Solo el autor ve "Marcar como respondida": testimonio opcional (300 car.), y si escribe algo elige compartirlo con el círculo (`testimonio` en el doc, visible a todos) o dejarlo privado (no se guarda ahí — se crea una entrada nueva en `usuarios/{uid}/oraciones`, mismo patrón de Mis Oraciones, así queda privada sin reglas nuevas). La tarjeta muestra borde/insignia dorada "Respondida" siempre que se marca, con o sin testimonio compartido.
  - **Pendiente de confirmar en consola de Firebase:** si la regla de `circulos/{id}/intenciones` restringe las escrituras por lista de campos permitidos (en vez de solo por autor/miembro), falta agregar `oracionesPalabras` a los campos que cualquier miembro puede escribir, y `respondida`/`fechaRespuesta`/`testimonio` a los que solo el autor puede escribir. No se tocó `usuarios/{uid}/oraciones` (ya cubierto por la regla existente).

## Santo Rosario — alineado a la Santa Sede
- Fuente: vatican.va — 20 misterios oficiales + citas bíblicas, LITERAL
- Misterio del día anclado a America/Bogota. 6 pasos español (con meditación), 5 en inglés
- Contador "luz que crece": anillo de 10 cuentas
- Persistencia localStorage, retomar solo si es del día y misterio correctos
- **Acto de Contrición: fórmula colombiana/latinoamericana** ("Jesús, mi Señor y Redentor...")
- **Exporta `OUR_FATHER`, `HAIL_MARY`, `APOSTLES_CREED`** — reutilizadas por la Coronilla, sin duplicación

## Coronilla de la Divina Misericordia (nuevo, 14 jul 2026)
- Nueva pestaña en Oración Personal, debajo de Santo Rosario. `src/Coronilla.jsx`, misma arquitectura que `Rosario.jsx` (páginas, anillo "luz que crece", persistencia)
- **Reutiliza `OUR_FATHER`, `HAIL_MARY`, `APOSTLES_CREED`** exportadas desde `Rosario.jsx` — cero duplicación de texto
- **Pantalla de historia:** origen según el Diario de Santa Faustina (1935), resumida, mismo tratamiento visual que la meditación del Rosario. Solo se muestra al empezar fresco — si se retoma un progreso del día, se salta directo a donde se quedó
- **Estructura:** Señal de la Cruz → Padre Nuestro → Ave María → Credo de los Apóstoles → Grano Mayor (1 vez, sin contador, "Padre Eterno, te ofrezco...") → 10 Granos Menores (anillo, "Por Su dolorosa Pasión...") → Invocación ×3 ("Santo Dios, Santo Fuerte...") → Oración Final (siempre visible, no opcional) → finalización
- **Persistencia:** `lumora_coronilla_progress_v1` (clave distinta al Rosario), America/Bogota, retomar solo si es del mismo día
- Textos verificados con diff automatizado contra la fuente, carácter por carácter

## Devocional — Oraciones (renombrado de "Oraciones Clásicas")
- Pestaña renombrada a **"Oraciones"** (más corto, sin connotación de "categoría de museo")
- **50 oraciones en 6 secciones:** I. Básicas y Principales (13) · II. Santa Misa (7) · III. Virgen María (10) · IV. Espíritu Santo (8) · V. Jesucristo (6) · VI. Protección y Santos (6)
- Texto tomado literal de documento aportado por Carlos, verificado carácter por carácter
- **Navegación: acordeón de dos niveles** (sección → oración)
- **El Ángelus** (sección III): formato de diálogo real (campo `dialogue`) — V. en dorado bold, R. en crema bold, instrucciones en itálica gris
- Texto de las oraciones: 17px (subido de 14px, se reza con luz tenue)
- `CLASSIC_PRAYERS.en` sin tocar (11 de siempre) — traducir es fase aparte
- **Acto de Contrición:** misma fórmula que Rosario/Coronilla
- **Novenas:** contenido retirado (solo había 1). Pestaña muestra `<ComingSoon>` (componente compartido con Tienda). Ícono de vela
- **Santo del Día: sin ninguna modificación** en todo este trabajo

## La Biblia — buscadores + resaltar y comentar (14 jul 2026)

### Buscadores
- **Buscador temático:** copy "Busca lo que tu corazón necesita hoy" (antes "Buscar versículo"), placeholder "ej. paz, perdón, miedo, gratitud...". Card con protagonismo visual
- **Navegación directa:** "Ir a una cita" — colapsada, tres campos (libro/capítulo/versículo). Validación real contra la API, con mensajes serenos en cada caso de error
- **Memoria de lectura NO se toca** — La Biblia sigue recordando libro/capítulo al salir y volver (marcador de lectura deliberado, reafirmado dos veces)
- **Barra de scroll horizontal de categorías** (Pentateuco/Históricos/etc.): oculta la barra nativa con clase reutilizable `.hide-scrollbar` en `index.css`; corregido padding que dejaba el primer chip pegado al borde

### Resaltar y comentar versículos
- **Toque simple** → resalta/quita. **Mantener presionado** (~450ms, mismo patrón que el botón del Cordero) → abre comentario opcional. Ícono de lápiz como acceso alternativo
- **Color de resaltado: dorado (ALBA) al 30%** — se probó también Verde Zarza (según su rol en el brand book), Carlos comparó ambos en vivo y prefirió el dorado. Decisión de gusto sobre norma
- Comentario: cita con borde izquierdo dorado
- **Funciona igual en lectura de capítulo Y en resultados del buscador** (unificado a un solo componente de versículo)
- Persistencia: `usuarios/{uid}/versiculosGuardados`, ID determinístico por versículo — evita duplicados, consulta por capítulo sin índice compuesto
- **"Mis Versículos":** vive DENTRO de La Biblia. Lista con texto, referencia, comentario, fecha. Navega al capítulo con el versículo centrado

## Menú hamburguesa — arreglos completos (14 jul 2026)
- Se cierra al tocar/scrollear fuera del panel (antes solo con X)
- Los accesos rápidos ahora cierran el menú al navegar (antes quedaba abierto de fondo)
- Corregido "cierre fantasma": el mismo toque que abría el menú a veces disparaba también el cierre (carrera entre eventos) — verificado con múltiples aperturas/cierres seguidos
- Un solo helper `isOutside` reutilizado por los tres listeners (`mousedown`, `scroll`, `touchmove`)

## Notificaciones — retiradas temporalmente (14 jul 2026)
- La función en Configuración era solo un `setTimeout` local: sin persistencia, sin Push API real, sin disparador de servidor. Nunca notificaba de verdad (la pestaña se cerraba antes del plazo)
- **Se eliminó por completo** (no comentado — arquitectura incompatible con una futura implementación real vía FCM). Código anterior recuperable del historial de git si hace falta como referencia
- Muestra `<ComingSoon>` mientras tanto
- **Push notifications reales — proyecto propio, no un ajuste menor.** Requiere: Firebase Cloud Messaging (VAPID keys), service worker con `self.addEventListener('push', ...)` (hoy `sw.js` solo cachea), tokens de dispositivo por usuario en Firestore, disparador server-side (otro Vercel Cron) que respete la hora de cada usuario. **Limitación de iOS:** solo funciona si la PWA está instalada en pantalla de inicio. Merece su propia sesión de diseño

## Rastro de luz — Conec✝2
- Aviso in-app. Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo. Se apaga solo al abrir el círculo con la novedad

## Seguridad Firestore — endurecida ✅ (12 jul 2026)
- `usuarios/{uid}` y **toda subcolección** (`{document=**}`): solo el propio usuario — cubre `oraciones`, `diario`, `versiculosGuardados`, y futuras subcolecciones sin reglas nuevas
- `reflexiones`, `versiculos`, `parroquias`: lectura pública, escritura bloqueada. Solo el servidor escribe vía admin
- `circulos` e `intenciones`: solo miembros, reglas por campo específicas
- **No hay archivo `firestore.rules` versionado en el repo** — se gestionan directamente en consola de Firebase

## Cron de reflexión diaria
- `firebase-admin` en `cron-reflexion.js`/`spiritual-guide.js`. ✅ Verificado: se dispara solo en plan Hobby

## Parroquias — misas
- Colección `parroquias`, datos oficiales de la Diócesis de Zipaquirá. `horarioMisas`: `{hora, lugar?}`
- 3 parroquias cargadas (Cajicá). Falta San José de Ríogrande
- **Investigación de escalamiento:** "Horarios de Misa" (horariosdemisa.com) evaluado — sin API pública, modelo colaborativo sin respaldo eclesial. Decisión: NO replicar. Camino de crecimiento: diócesis por diócesis con aval oficial

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, degradado alba→noche, signo de Horeb, sin fecha
- Ponlo en Práctica: solo el primer consejo. Versículo del Día: función propia
- Imagen + texto con link a **somoshoreb.com**. Botón: "Comparte esta luz"

## Navegación
- `goToTab(i)` centralizado resetea sub-estados. **Excepción — La Biblia:** conserva su estado deliberadamente

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx` (exporta oraciones compartidas), `src/Coronilla.jsx` (nuevo), `src/Devocional.jsx`, `src/diarioPreguntas.js` (90 preguntas)
- `src/santos.js`, `src/versiculos.js`, `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (**v19**), `public/favicon.svg`, `public/manifest.json` (eslogan actualizado), `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`. Cambios requieren REDEPLOY

## Pendiente

### Conec✝2 — funcionalidad futura (ideas del 15 jul 2026)
- **Ancla diaria del círculo:** una intención/reflexión automática por día (versículo del día, pregunta del Diario, o meditación del Rosario de hoy), para que el círculo tenga actividad aunque nadie publique. Resuelve el "silencio entre publicaciones".
- **Orar juntos en tiempo real:** ver cuántos miembros del círculo rezaron el Rosario/Coronilla hoy (dato que ya se registra en localStorage, hoy invisible al grupo). Posible extensión: invitar a rezar a una hora específica, sin videollamada — solo la certeza de "alguien más está rezando esto ahora".
- **Memoria del círculo:** línea del tiempo o vista histórica de intenciones respondidas y testimonios compartidos — hoy las intenciones viejas se hunden sin dejar rastro de la historia de fe del grupo.

### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** Mensajes ya redactados
- San José de Ríogrande · más parroquias si el directorio las tiene · canal "escríbenos" (el copy lo promete, no existe)

### Contenido
- Novenas — contenido nuevo, fuente confiable, NO generado
- `CLASSIC_PRAYERS.en` — traducir las 50 al inglés
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas bíblicas oficiales en inglés
- **🕊️ (paloma) de Home** — dos intentos de rediseño fallidos, retomar con otro enfoque
- **CalmGlyph de "Ansiedad"** en PRAYER_MOODS — es deliberadamente genérico/temporal, diseñar algo mejor

### Funcionalidad futura
- **Push notifications reales** — ver sección "Notificaciones" arriba, proyecto propio completo
- Monetización — Fase 0: definir modelo (Cordada, Brisa, Semilla, Cumbre ya nombrados en el brand book)
- Decidir uso del Verde Zarza

### Distribución
- PWA sin tiendas. iPhone: 5 pasos ocultos en Safari. Empaquetar (Bubblewrap/Capacitor) cuando el contenido esté más completo

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción
- Limpieza: cuentas de prueba en Authentication, claves de servicio sin usar en Firebase
- `api/confirm-payment.js`: paleta de color vieja (texto ya correcto), actualizar cuando la Tienda esté activa
- CNAME del `www` en Namecheap: actualizar al formato nuevo recomendado por Vercel (no urgente)
- 📔 (producto Tienda) sin ícono SVG — baja prioridad, `products.js` inactivo

### Hecho ✅
- Marca Horeb completa: nombre, dominio, logo, paleta, limpieza de fósiles (incluido el eslogan en splash/manifest)
- Mi Oración: Diario unificado con Mis Oraciones + Diario de gratitud ampliado a 90 preguntas
- Devocional: 50 Oraciones en 6 secciones, Novenas retiradas a "en construcción"
- La Biblia: buscador temático + navegación directa + resaltar y comentar versículos + scroll de categorías pulido
- **Coronilla de la Divina Misericordia** — nueva devoción completa
- Menú hamburguesa: cierre al tocar/scrollear fuera + accesos rápidos + cierre fantasma corregido
- **Notificaciones incompletas retiradas** (reemplazadas por "en construcción", proyecto real documentado como pendiente)
- **Barrido completo de emojis** (3 tandas): código muerto eliminado, 15+ reemplazados por SVG propios, `HorebLoading` como estado de carga unificado
- Seguridad Firestore endurecida · Parroquias: selección + horarios · Compartir como imagen
- Rosario alineado a la Santa Sede · Santo del Día en Inicio · Cron verificado
- **Service worker en v19**