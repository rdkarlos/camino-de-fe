# Horeb (antes Lumora / Camino de Fe)

> Migración de marca COMPLETA: nombre, signo, paleta y dominio propio.

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
- **Nombre:** Horeb. **Firma:** Somos Horeb. **Eslogan:** *Sube. Vuelve distinto.*
- **Por qué Horeb:** el monte donde Dios no estaba en el viento, ni el terremoto, ni el fuego — sino en una brisa suave. Moisés y Elías subieron cansados, "con lo que les quedaba".
- **El "somos" no es decorativo:** dice comunidad. Nadie sube solo. Diferencia a Horeb de Hallow y Ora (individuales).
- **Nombres descartados:** Tabor (app de citas rusa, 17M descargas), Lumora (saturado: apps de bienestar/belleza, incluida una de manifestación New Age), Tabita (marca de calzado brasileña), Emaús/Cenáculo/Betania/Nazaret (todos tomados). Lección: entre más obvio y bíblico el nombre, más probable que ya lo tengan.
- **Competencia:** Hallow (#1, épico/disciplina) y Ora (colombiana, mismas funciones). Diferenciador de Horeb: comunidad + parroquias.

## Identidad visual
### El signo (logo)
- `src/Horeb.jsx` — sol asomando detrás del monte, tres líneas horizontales descendentes que se estrechan hacia la cima (la brisa), monte principal (dos trazos) y monte interior más tenue en Cielo de Altura (el *somos*, perspectiva atmosférica)
- Prop `background` (default `false` = transparente). Con fondo: favicon e íconos PWA (viewBox no cuadrado, 400×320 — cuidado al forzar tamaño cuadrado)
- Umbral de simplificación: 32px. IDs de gradientes con `useId()`
- **El logo NO va en las tarjetas de la app** (Santo del Día, Parroquia) — ahí va un motivo decorativo (círculos difusos + punto de luz, en Brisa de Alba). El logo se reserva para splash, favicon/PWA y firma de imágenes compartidas
- Reemplaza también el ícono del modal de login (antes: emoji ✝️, se veía morado según el dispositivo)

### Paleta (brand book Horeb) — migrada
| Nombre | Hex | Antes (Lumora) |
|---|---|---|
| Noche de Horeb | `#1E2630` | sin cambio |
| Brisa de Alba (ALBA) | `#E4C79B` | `#E8B45C` |
| Lino | `#F5F1E8` | sin cambio |
| Cielo de Altura (CIELO) | `#8497A6` | `#7E97AB` |
| Arena del Monte (PIEDRA) | `#C7B79C` | `#B8AE9C` |
| Verde Zarza | `#7A8C6E` | nuevo — **se probó para el resaltado de versículos, pero Carlos prefirió el dorado. Sigue sin uso asignado.** |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` como utilidades centralizadas — **no dejar rgba/mix hardcodeados en componentes**.
- Contraste verificado: Brisa de Alba tiene MÁS contraste que el dorado anterior contra Noche (9.4:1 vs 8.1:1).
- Verdes de éxito y rojos de error son colores semánticos (no de marca) — no se tocan.
- **Tipografía:** Cormorant (títulos), Work Sans (interfaz).

### Fósiles de marca — limpiados
Restos de versiones anteriores que ningún grep de texto detectaba (colores hardcodeados a mano, no componentes importados):
- Íconos PWA: cruz sobre azul marino `#1B2A4A` — anterior incluso al vértice de luz viejo
- Favicon con vértice de luz viejo
- Tarjetas de Santo del Día y Parroquia: resplandor copiado a mano
- Overlay morado en "Joven Fe"
- Splash con hex suelto
- `public/icons.svg`: sprite huérfano de un boilerplate — borrado
- Constantes muertas `BLUE`/`BLUE_DARK` — eliminadas
- **Lección:** si algo es un motivo de marca, debe ser un componente importado, no una copia manual.
- **Pendiente, no urgente:** `api/confirm-payment.js` (email de pago) con paleta vieja — se actualiza cuando la Tienda esté activa de verdad.

### Tono
- Tuteo, español neutro, sin regionalismos ni clericalismos
- *"El susurro, no el grito"* — la palabra justa, si sobra se quita
- Invita, no ordena. Nunca: rachas, gamificación culposa, emojis pictóricos.

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo → Evangelio → Santo del Día → Misas de tu parroquia. Bloque "Tu camino": Oración Personal → Joven Fe
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), Rosario, Devocional
3. Evangelio — "Ponlo en Práctica"
4. **La Biblia** — LBLA, buscador temático + navegación directa + resaltar/comentar versículos (ver detalle abajo)
5. Lecturas del día
6. Santo Rosario
7. Devocional — **Oraciones** (50, en 6 secciones), Novenas (en construcción), Santo del Día
8. Tienda — en construcción
9. Configuración — incluye "Tu parroquia"
10. Joven Fe

## Mi Oración — 4 pestañas

### Crear Oración
- Grid de 8 estados de ánimo → versículo + santo patrono (datos estáticos) → intención en texto libre → botón "Orar" (plantillas fijas, no hay IA real pese al nombre `generatePrayer`)
- Guardar requiere sesión. Sin sesión: invitación serena a crear cuenta.

### Mis Oraciones (unificada — antes existía "Diario" duplicando este contenido)
- Con sesión: Firestore fuente única (`usuarios/{uid}/oraciones`), sincroniza entre dispositivos
- **Permite borrar** (hueco cerrado — antes no se podía desde aquí)
- Migración automática de datos heredados de localStorage por comparación de texto (trimmed), preservando fecha original (`new Date(id)`, no `serverTimestamp()`)
- Sin sesión: banner con oraciones heredadas visibles + invitación a crear cuenta
- Ya no es el `else` implícito del selector de tabs — caso explícito

### Diario (nuevo, 14 jul 2026)
- **Distinto de Mis Oraciones:** gratitud y reflexión, no intenciones — mirar hacia atrás en el día, no pedir hacia adelante
- `src/diarioPreguntas.js` — 30 preguntas fijas, una por día del mes, tono Horeb (examen ignaciano + gratitud, nunca culpa)
- Pregunta del día por **día del mes**, anclada a `America/Bogota`. Día 31 → reutiliza pregunta del día 30
- **Una entrada por día**, reforzado en Firestore (ID del doc = fecha de hoy, `setDoc` determinístico — Firestore impide una segunda escritura el mismo día)
- **Entradas NO editables ni borrables** una vez guardadas — diario real. Se pueden releer.
- Requiere sesión. Persistencia: `usuarios/{uid}/diario/{fecha}` — cubierto por regla existente

### Conec✝2 (sin cambios)
- Círculos privados/públicos, compartir intenciones, botón "Estoy orando", borrar con permisos, abandonar círculo, límite 10 miembros, rastro de luz de actividad nueva

## Devocional — Oraciones (14 jul 2026)
- Pestaña renombrada de "Oraciones Clásicas" → **"Oraciones"** (más corto, sin connotación de "categoría de museo")
- **50 oraciones en 6 secciones** (antes: 11 en lista plana — el PROYECTO.md decía 12, estaba desactualizado):
  - I. Oraciones Básicas y Principales (13)
  - II. Oraciones para la Santa Misa (7)
  - III. Oraciones a la Virgen María (10)
  - IV. Oraciones al Espíritu Santo (8)
  - V. Oraciones a Jesucristo (6)
  - VI. Oraciones de Protección y a los Santos (6)
- Texto tomado literal de documento aportado por Carlos, verificado carácter por carácter (Claude Code encontró y corrigió 8 errores propios de transcripción antes de construir).
- **Navegación: acordeón de dos niveles** (sección → oración), una sección y una oración abiertas a la vez.
- **El Ángelus** (sección III): formato de diálogo real (campo `dialogue`, no `text`) — V. en dorado bold, R. en crema bold, instrucciones intercaladas en itálica gris.
- Texto de las oraciones: 14px → 17px (se reza con luz tenue, a veces sin lentes). Instrucciones del Ángelus a 13px.
- `CLASSIC_PRAYERS.en` sin tocar (11 de siempre) — traducir es fase aparte.
- **Acto de Contrición:** misma fórmula colombiana/latinoamericana que el Rosario ("Jesús, mi Señor y Redentor...").
- **Novenas:** contenido retirado (solo había 1, Sagrado Corazón, no 5 como decía el proyecto). Pestaña muestra `<ComingSoon>` (componente extraído y compartido con la Tienda, antes función inline no reutilizable). Ícono de vela.
- **Santo del Día: sin ninguna modificación** en todo este trabajo.

## La Biblia — buscadores + resaltar y comentar (14 jul 2026)

### Buscadores
- **Buscador temático:** copy cambiado de "Buscar versículo" a **"Busca lo que tu corazón necesita hoy"**, con placeholder "ej. paz, perdón, miedo, gratitud...". Card con protagonismo visual (degradado, borde dorado). La función de búsqueda por palabra clave no cambió.
- **Navegación directa (nueva):** "Ir a una cita" — colapsada por defecto, visualmente secundaria. Tres campos: libro (dropdown, 73 libros en orden bíblico real), capítulo, versículo. Validación real: capítulo fuera de rango → mensaje sereno con rango válido; versículo fuera de rango pero capítulo válido → abre igual con nota; válido → navega y resalta con scroll automático.
- **Memoria de lectura NO se toca** (reafirmado 14 jul): La Biblia sigue recordando libro/capítulo al salir y volver — deliberado, funciona como marcador de lectura. Único tab con esa excepción a `goToTab`.

### Resaltar y comentar versículos (nuevo, 14 jul 2026)
- **Toque simple** sobre un versículo → resalta/quita. **Mantener presionado** (~450ms, mismo patrón que el botón flotante del Cordero: `pointerdown` + `setTimeout` cancelable con movimiento) → abre comentario opcional. Ícono de lápiz en versículos ya resaltados como acceso alternativo.
- **Color de resaltado: dorado (ALBA) al 30% de opacidad.** Se probó también Verde Zarza (según su uso declarado en el brand book para "confirmación/estados positivos"), pero Carlos comparó ambos en vivo y prefirió el dorado. Decisión de gusto sobre norma — el brand book es guía, no regla rígida.
- Comentario: tratamiento de cita con borde izquierdo dorado (mismo patrón "blockquote" ya usado en la app).
- **Funciona igual en la lectura de un capítulo Y en los resultados del buscador temático** (se corrigió una laguna: el buscador usaba un componente de versículo distinto, sin la interactividad — ahora ambos comparten el mismo componente).
- Persistencia: `usuarios/{uid}/versiculosGuardados`, **ID determinístico** por versículo (bookId+capítulo+versículo) — evita duplicados, permite `setDoc`/`deleteDoc` simples, consulta por capítulo con 2 filtros de igualdad sin índice compuesto. Cubierto por regla existente `{document=**}`.
- **"Mis Versículos":** vive DENTRO de La Biblia (no en Mi Oración) — acceso discreto junto a "Ir a una cita". Lista con texto, referencia, comentario, fecha. Tocar una tarjeta navega al capítulo con el versículo centrado. Se puede quitar el resaltado desde ahí también.
- Requiere sesión — reutiliza el patrón de invitación existente.

## Menú hamburguesa — arreglos (14 jul 2026)
- **Antes:** solo se cerraba con el botón X.
- **Ahora:** se cierra al tocar o hacer scroll fuera del panel. Un `useEffect` con tres listeners (`mousedown`, `scroll`, `touchmove`) que se agregan y limpian juntos mientras el menú está abierto. Un solo helper `isOutside` (basado en un `ref` que envuelve TODO el header) reutilizado por los tres — evita lógica duplicada.
- `scroll` en window no burbujea desde el panel interno (sin caso especial). `touchmove` sí burbujea, por eso usa `isOutside` para no cerrarse si el scroll ocurre dentro de una lista interna del propio menú.
- **Segunda ronda de arreglos:** los accesos rápidos (Evangelio, La Biblia, etc.) ahora cierran el menú al navegar (antes quedaba abierto de fondo). Corregido el "cierre fantasma": a veces el mismo toque que abría el menú disparaba también el cierre por "click afuera" (carrera entre eventos) — verificado con múltiples aperturas/cierres seguidos.

## Rastro de luz — Conec✝2
- Aviso in-app (no push). Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo. Se apaga solo al abrir el círculo con la novedad.

## Seguridad Firestore — endurecida ✅ (12 jul 2026)
- `usuarios/{uid}` y **toda subcolección** (`{document=**}`): solo el propio usuario — cubre `oraciones`, `diario`, `versiculosGuardados`, y futuras subcolecciones sin reglas nuevas.
- `reflexiones`, `versiculos`, `parroquias`: lectura pública, escritura bloqueada (`if false`). Solo el servidor escribe vía admin.
- `circulos`: lectura pública. Update limitado a campos específicos y solo miembros. Delete solo el creador.
- `circulos/{id}/intenciones`: solo miembros. Create requiere `autorId == uid`. Delete: autor o creador (modera).
- **No hay archivo `firestore.rules` versionado en el repo** — se gestionan directamente en la consola de Firebase.

## Cron de reflexión diaria (IMPORTANTE)
- `api/cron-reflexion.js` y `api/spiritual-guide.js` usan **firebase-admin**, no el SDK de cliente.
- Credencial: `FIREBASE_SERVICE_ACCOUNT_BASE64` en Vercel (rotada 12 jul). Nunca en el repo.
- ✅ Verificado: el cron se dispara solo en plan Hobby.

## Santo Rosario — alineado a la Santa Sede
- Fuente: vatican.va — 20 misterios oficiales + citas bíblicas, copiadas LITERAL
- Misterio del día anclado a America/Bogota. 6 pasos español (con meditación), 5 en inglés (sin ella — faltan citas oficiales)
- Contador "luz que crece": anillo de 10 cuentas, círculo central progresivo
- Persistencia localStorage, retomar solo si es del día y misterio correctos
- **Acto de Contrición: fórmula colombiana/latinoamericana**, consistente con Devocional

## Parroquias — misas
- Colección `parroquias`. Datos del directorio oficial de la Diócesis de Zipaquirá.
- `horarioMisas`: cada misa `{hora, lugar?}` — lugar solo si no es la iglesia principal
- 3 parroquias cargadas (Cajicá). Falta San José de Ríogrande.
- Tarjeta en Inicio: invitación / misas de hoy / semana expandida. Fuente citada en Configuración.
- **Investigación de escalamiento (14 jul 2026):** se evaluó "Horarios de Misa" (horariosdemisa.com) — **sin API pública**, modelo 100% colaborativo (usuarios cargan, equipo verifica a mano), cobertura desigual por región, sin respaldo eclesial oficial. **Decisión: NO replicar ese modelo.** La ventaja de Horeb es la inversa — certeza sobre escala, datos oficiales de diócesis. Camino de crecimiento: diócesis por diócesis, con aval oficial, igual que Zipaquirá. Pendiente: verificar si esa diócesis tiene más parroquias en su directorio.

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, degradado alba→noche, signo de Horeb, Cormorant. Sin fecha (no caduca).
- **Ponlo en Práctica:** comparte solo el PRIMER consejo (antes fundía los 3 en un párrafo ilegible). Fuente 44-65px.
- **Versículo del Día:** función nueva, reutiliza header/separador/firma compartidos.
- Imagen + texto con link a **somoshoreb.com** vía Web Share API. Botón: "Comparte esta luz".
- Firma: signo compacto de Horeb + "HOREB" (según brand book — "Somos Horeb" se reserva para otros usos)
- **Canal de crecimiento orgánico clave**

## Navegación
- `goToTab(i)` centralizado resetea `personalSection`, `personalTab`, `devocionalInitialTab` al cambiar de sección
- **Excepción — La Biblia:** conserva su estado deliberadamente (marcador de lectura)

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx`, `src/Devocional.jsx`, `src/diarioPreguntas.js`
- `src/santos.js`, `src/versiculos.js`, `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (v18), `public/favicon.svg`, `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET` (rotado 11 jul), `FIREBASE_SERVICE_ACCOUNT_BASE64` (rotado 12 jul)
- Cambios en env vars requieren REDEPLOY

## Pendiente

### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** No vender: preguntar si los horarios están correctos y escuchar. Mensajes ya redactados (para usuarios de Lumora y para el padre).
- WhatsApp es el flujo (lo que pasó); Horeb es el estado (lo que ES, siempre visible)
- San José de Ríogrande (faltan horarios) · más parroquias de la diócesis, si el directorio las tiene
- Canal "escríbenos" (el copy lo promete, no existe) · Panel del párroco solo si lo pide

### Contenido
- **Novenas — contenido nuevo** (sección quedó en "en construcción"). Fuente católica confiable, NO generado.
- `CLASSIC_PRAYERS.en` — traducir las 50 oraciones al inglés (fase aparte, sin inventar)
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas bíblicas oficiales en inglés

### Funcionalidad futura
- Push notifications reales
- Monetización — Fase 0: definir modelo (Cordada, Brisa, Semilla, Cumbre ya nombrados en el brand book)
- Decidir uso del Verde Zarza (se probó para resaltado de versículos, no se usó — sigue disponible)

### Distribución
- PWA sin tiendas. iPhone: instalar requiere 5 pasos ocultos en Safari. Empaquetar (Bubblewrap/Capacitor) cuando el contenido esté más completo. Ojo: comisión 15-30% si se vende dentro de la app.

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción
- Limpieza: cuentas de prueba en Authentication, claves de servicio sin usar en Firebase
- `api/confirm-payment.js`: paleta vieja, actualizar cuando la Tienda esté activa
- CNAME del `www` en Namecheap: actualizar al formato nuevo recomendado por Vercel (no urgente)

### Hecho ✅
- Marca Horeb completa: nombre, dominio, logo, paleta, limpieza de fósiles
- Mi Oración reestructurado: Diario unificado con Mis Oraciones + Diario de gratitud nuevo (30 preguntas)
- Devocional: 50 Oraciones en 6 secciones (renombrado de "Oraciones Clásicas"), Novenas retiradas a "en construcción"
- La Biblia: buscador temático con nuevo copy + navegación directa + **resaltar y comentar versículos con "Mis Versículos"**
- Menú hamburguesa: cierre al tocar/scrollear fuera + accesos rápidos cierran al navegar + cierre fantasma corregido
- Seguridad Firestore endurecida · Parroquias: selección + horarios · Compartir como imagen
- Rosario alineado a la Santa Sede · Santo del Día en Inicio · Cron verificado