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
- **Por qué Horeb:** el monte donde Dios no estaba en el viento, ni el terremoto, ni el fuego — sino en una brisa suave.
- **El "somos" no es decorativo:** dice comunidad. Nadie sube solo.
- **Nombres descartados:** Tabor (app de citas rusa, 17M descargas), Lumora (saturado de apps de bienestar/belleza), Tabita, Emaús, Cenáculo, Betania, Nazaret — todos tomados.
- **Competencia:** Hallow (épico/disciplina) y Ora (colombiana, mismas funciones). Diferenciador de Horeb: comunidad + parroquias.

## Identidad visual
### El signo (logo)
- `src/Horeb.jsx` — sol asomando detrás del monte, tres líneas horizontales descendentes (la brisa), monte principal + monte interior tenue en Cielo de Altura (el *somos*)
- Prop `background` (default `false` = transparente). Con fondo: favicon e íconos PWA
- Umbral de simplificación: 32px. IDs de gradientes con `useId()`
- **El logo NO va en las tarjetas de la app** — ahí va un motivo decorativo (círculos difusos + punto de luz en Brisa de Alba). El logo se reserva para splash, favicon/PWA y firma de imágenes compartidas
- Reemplazó también el ícono del modal de login (antes: emoji ✝️, se veía morado según el dispositivo)

### Paleta (brand book Horeb) — migrada
| Nombre | Hex |
|---|---|
| Noche de Horeb | `#1E2630` |
| Brisa de Alba (ALBA) | `#E4C79B` |
| Lino | `#F5F1E8` |
| Cielo de Altura (CIELO) | `#8497A6` |
| Arena del Monte (PIEDRA) | `#C7B79C` |
| Verde Zarza | `#7A8C6E` — **sin uso asignado aún** |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` — no dejar rgba/mix hardcodeados en componentes
- Contraste verificado: Brisa de Alba tiene MÁS contraste que el dorado anterior contra Noche (9.4:1 vs 8.1:1)
- Tipografía: Cormorant (títulos), Work Sans (interfaz)

### Fósiles de marca — limpiados
Restos de versiones anteriores que ningún grep de texto detectaba (colores a mano, no componentes importados): íconos PWA con cruz azul marino `#1B2A4A`, favicon viejo, resplandores copiados a mano en tarjetas, overlay morado en Joven Fe, splash con hex suelto, sprite huérfano `icons.svg`, constantes muertas `BLUE`/`BLUE_DARK`.
- **Lección:** si algo es un motivo de marca, debe ser un componente importado, no una copia manual.
- **Pendiente, no urgente:** `api/confirm-payment.js` (email de pago) con paleta vieja — se actualiza cuando la Tienda esté activa de verdad.

### Tono
- Tuteo, español neutro, sin regionalismos ni clericalismos. *"El susurro, no el grito."* Invita, no ordena. Nunca rachas ni gamificación culposa.

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo → Evangelio → Santo del Día → Misas de tu parroquia. Bloque "Tu camino": Oración Personal → Joven Fe
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), Rosario, Devocional
3. Evangelio — "Ponlo en Práctica"
4. La Biblia — LBLA, con buscador temático + navegación directa (ver detalle abajo)
5. Lecturas del día
6. Santo Rosario
7. Devocional — **50 Oraciones Clásicas en 6 secciones**, Novenas (en construcción), Santo del Día
8. Tienda — en construcción
9. Configuración — incluye "Tu parroquia"
10. Joven Fe

## Mi Oración — 4 pestañas
- **Crear Oración:** 8 estados de ánimo → versículo + santo patrono → intención → "Orar" (plantillas fijas). Guardar requiere sesión.
- **Mis Oraciones:** unificada (antes existía "Diario" duplicando este contenido — se fusionaron). Firestore como fuente única con sesión, localStorage de respaldo sin sesión. Permite borrar (antes no). Migración automática de datos heredados por comparación de texto, preservando fecha original.
- **Diario (nuevo, 14 jul 2026):** distinto de Mis Oraciones — es gratitud y reflexión, no intenciones. `src/diarioPreguntas.js`, 30 preguntas fijas (una por día del mes, ancladas a America/Bogota). Una entrada por día (ID determinístico = fecha, reforzado en Firestore). Entradas NO editables ni borrables una vez guardadas — diario real. Se pueden releer. Cubierto por la regla existente `usuarios/{uid}/{document=**}`.
- **Conec✝2:** círculos privados/públicos, intenciones, rastro de luz de actividad nueva, límite 10 miembros.

## Devocional — 50 Oraciones Clásicas en 6 secciones (14 jul 2026)
- Reemplazo completo de las 11 oraciones clásicas que había (el PROYECTO.md decía 12 — estaba desactualizado) por **50 oraciones organizadas en 6 secciones temáticas**, tomadas literal de fuente confiable (documento aportado por Carlos):
  - I. Oraciones Básicas y Principales (13)
  - II. Oraciones para la Santa Misa (7)
  - III. Oraciones a la Virgen María (10)
  - IV. Oraciones al Espíritu Santo (8)
  - V. Oraciones a Jesucristo (6)
  - VI. Oraciones de Protección y a los Santos (6)
- **Navegación: acordeón de dos niveles** (sección → oración), una sección y una oración abiertas a la vez.
- **El Ángelus** (sección III) tiene formato de diálogo real (V./R.) en vez de texto corrido — campo `dialogue` en vez de `text`. V. en dorado bold, R. en crema bold, instrucciones intercaladas en itálica gris.
- Texto de las oraciones subido de 14px a 17px (se reza con luz tenue, a veces sin lentes) — instrucciones del Ángelus a 13px.
- `CLASSIC_PRAYERS.en` sin tocar (quedan las 11 de antes) — traducir es una fase aparte, sin inventar.
- **Acto de Contrición** (dentro de la sección I): misma fórmula colombiana/latinoamericana que ya se usa en el Rosario ("Jesús, mi Señor y Redentor...") — consistencia entre secciones.
- **Novenas:** se retiró la única novena que había (Sagrado Corazón) y la pestaña ahora muestra `<ComingSoon>` (componente extraído y compartido con la Tienda, antes era una función inline `renderShop` no reutilizable). Ícono de vela (para no confundir con la sección Rosario). Pendiente: contenido nuevo de novenas, de fuente católica confiable.
- **Santo del Día: sin ninguna modificación** en todo este trabajo — verificado explícitamente en cada paso.

## La Biblia — buscadores mejorados (14 jul 2026)
- **Buscador temático** (el que ya existía): copy cambiado de "Buscar versículo" a **"Busca lo que tu corazón necesita hoy"**, con placeholder de apoyo "ej. paz, perdón, miedo, gratitud..." — invita a quien no sabe buscar por referencia exacta. Ahora en una card con protagonismo visual (degradado, borde dorado). La función de búsqueda por palabra clave no cambió.
- **Navegación directa (nueva):** "Ir a una cita" — colapsada por defecto, visualmente secundaria. Tres campos: libro (dropdown, 73 libros en orden bíblico real), capítulo, versículo. Validación real contra la API: capítulo fuera de rango → mensaje sereno con el rango válido; versículo fuera de rango pero capítulo válido → abre igual con nota, sin bloquear; válido → navega y resalta el versículo con scroll automático.
- **La memoria de lectura NO se tocó** (decisión reafirmada 14 jul: La Biblia sigue recordando libro/capítulo al salir y volver — es deliberado, funciona como marcador de lectura. Único tab con esa excepción a `goToTab`).

## Menú hamburguesa — cierre mejorado (14 jul 2026)
- Antes solo se cerraba con el botón X. Ahora también se cierra al tocar/scrollear fuera del panel.
- Un solo `useEffect` con tres listeners (`mousedown`, `scroll`, `touchmove`) que se agregan y limpian juntos mientras el menú está abierto.
- `scroll` en window no burbujea desde el panel interno (no necesita caso especial). `touchmove` sí burbujea, así que usa el mismo helper `isOutside` (basado en un `ref` que envuelve TODO el header: hamburguesa + accesos rápidos + panel) para no cerrarse si el scroll ocurre dentro de una lista interna del propio menú.
- Un solo criterio de "qué cuenta como afuera", reutilizado en los tres listeners — evita lógica duplicada que se desincronice.

## Rastro de luz — Conec✝2
- Aviso in-app. Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo. Se apaga solo al abrir el círculo con la novedad.

## Seguridad Firestore — endurecida ✅ (12 jul 2026)
- `usuarios/{uid}` y **toda subcolección** (`{document=**}`): solo el propio usuario — cubre `oraciones`, `diario`, y futuras subcolecciones sin reglas nuevas.
- `reflexiones`, `versiculos`, `parroquias`: lectura pública, escritura bloqueada. Solo el servidor escribe vía admin.
- `circulos` e `intenciones`: solo miembros, con reglas específicas por campo.

## Cron de reflexión diaria
- `firebase-admin` en `api/cron-reflexion.js` y `api/spiritual-guide.js`. ✅ Verificado: se dispara solo en plan Hobby.

## Santo Rosario — alineado a la Santa Sede
- 20 misterios oficiales + citas bíblicas, copiadas literal de vatican.va. 6 pasos en español (con meditación), 5 en inglés (sin ella — faltan citas oficiales). Contador "luz que crece". Persistencia con retomar solo si es del día correcto.
- Acto de Contrición: fórmula colombiana/latinoamericana (consistente con Devocional).

## Parroquias — misas
- Colección `parroquias`, datos oficiales de la Diócesis de Zipaquirá. `horarioMisas`: cada misa `{hora, lugar?}`. 3 parroquias cargadas (Cajicá). Falta San José de Ríogrande.
- **Investigación de escalamiento (14 jul 2026):** se evaluó "Horarios de Misa" (horariosdemisa.com) como fuente de datos — **sin API pública**, modelo 100% colaborativo (usuarios cargan, equipo verifica a mano), cobertura desigual, sin respaldo eclesial. **Decisión: NO replicar ese modelo.** La ventaja de Horeb es la inversa — certeza sobre escala, datos oficiales de diócesis, no crowdsourcing abierto. Camino de crecimiento: diócesis por diócesis, con aval oficial, igual que Zipaquirá. Pendiente: verificar si esa diócesis tiene más parroquias en su directorio.

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, degradado alba→noche, signo de Horeb, sin fecha.
- Ponlo en Práctica: solo el primer consejo (antes fundía los 3). Versículo del Día: función nueva, header/separador/firma compartidos.
- Imagen + texto con link a **somoshoreb.com**. Botón: "Comparte esta luz".

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx`, `src/Devocional.jsx`, `src/diarioPreguntas.js`
- `src/santos.js`, `src/versiculos.js`, `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (v18), `public/favicon.svg`, `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64` (rotadas). Cambios requieren REDEPLOY.

## Pendiente

### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** Mensajes ya redactados (para usuarios de Lumora y para el padre).
- San José de Ríogrande (faltan horarios) · más parroquias de la diócesis, si el directorio las tiene
- Canal "escríbenos" (el copy lo promete, no existe todavía)
- Panel del párroco — solo si lo pide

### Contenido
- **Novenas — contenido nuevo** (la sección quedó en "en construcción" tras retirar la única que había). Fuente católica confiable, NO generado.
- `CLASSIC_PRAYERS.en` — traducir las 50 oraciones al inglés (fase aparte, sin inventar)
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas bíblicas oficiales en inglés

### Funcionalidad futura
- Push notifications reales
- Monetización — Fase 0: definir modelo (Cordada, Brisa, Semilla, Cumbre ya nombrados en el brand book)
- Decidir uso del Verde Zarza

### Distribución
- PWA sin tiendas. iPhone: instalar requiere 5 pasos ocultos en Safari. Empaquetar (Bubblewrap/Capacitor) cuando el contenido esté más completo.

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción
- Limpieza: cuentas de prueba en Authentication, claves de servicio sin usar en Firebase
- `api/confirm-payment.js`: paleta vieja, actualizar cuando la Tienda esté activa
- CNAME del `www` en Namecheap: actualizar al formato nuevo recomendado por Vercel (no urgente)

### Hecho ✅
- Marca Horeb completa: nombre, dominio, logo, paleta, limpieza de fósiles
- Mi Oración reestructurado: Diario unificado con Mis Oraciones + Diario de gratitud nuevo (30 preguntas)
- Devocional: 50 Oraciones Clásicas en 6 secciones, Novenas retiradas a "en construcción"
- La Biblia: buscador temático con nuevo copy + navegación directa por libro/capítulo/versículo
- Menú hamburguesa: cierre al tocar o scrollear fuera
- Seguridad Firestore endurecida · Parroquias: selección + horarios · Compartir como imagen
- Rosario alineado a la Santa Sede · Santo del Día en Inicio · Cron verificado