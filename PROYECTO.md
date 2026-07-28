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
- **Tema claro — considerado y descartado (26 jul 2026).** El brand book especifica "modo oscuro permanente" como decisión de marca deliberada. Técnicamente requeriría reconstruir el sistema de colores (hoy los componentes usan NOCHE/ALBA directamente, no una capa semántica) y tocar cada pantalla ya construida — un esfuerzo mayor que cualquier función individual hecha hasta ahora. Carlos lo calificó de "capricho" y lo descartó conscientemente. No retomar sin una razón de accesibilidad real que lo justifique.

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
- **Nuevo (26 jul 2026):** `PencilGlyph` (extraído del ícono de comentar versículos en La Biblia, reutilizado para editar círculos), `LogoutGlyph` (puerta con flecha, reemplaza el botón rojo grande de cerrar sesión)
- **Quedan como emoji, a propósito:** 🕊️ (Home, dos rediseños descartados), 📔 (producto Tienda inactiva)
- **Lección:** varios emojis vivían escondidos en constantes de datos (fallbacks, estados de ánimo), no solo en JSX visible

### Fósiles de marca — limpiados
Íconos PWA con cruz azul marino, favicon viejo, resplandores copiados a mano, overlay morado, "Lumora" en email de pago, **eslogan viejo en splash y `manifest.json`** ("Luz que guía, amor que une" → "Sube. Vuelve distinto.")
- **Lección:** motivos/textos de marca deben vivir en un solo lugar; `manifest.json` es un escondite recurrente
- **Pendiente, no urgente:** `api/confirm-payment.js` — paleta vieja, actualizar cuando la Tienda esté activa

### Tono
- Tuteo, español neutro. *"El susurro, no el grito."* Invita, no ordena. Nunca rachas ni gamificación culposa.

## Secciones
1. **Inicio** — 3 bloques con etiqueta discreta arriba de cada uno (mayúsculas, Piedra, sin fondo/borde — `sectionLabel()`): **HOY** (Versículo → Evangelio → Santo del Día → Misas de tu parroquia) → **TU COMUNIDAD** (Conec✝2, 20 jul 2026) → **TU CAMINO** (Oración Personal → Joven Fe, sin cambios, solo desplazados)
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
- **Marcar como respondida, con testimonio opcional:** solo el autor puede marcarla (verificado en reglas). Testimonio de 300 car., opcional. Compartido → vive en la intención (visible al círculo). Privado → se guarda en `usuarios/{uid}/oraciones`, no en el círculo. Pastilla con borde dorado, separada visualmente
- **Reglas de Firestore confirmadas y publicadas** ✅ — `oracionesPalabras`+`orando` permitidos juntos para cualquier miembro (viajan en la misma escritura); `respondida`/`fechaRespuesta`/`testimonio` solo para el autor
- **Bug del parpadeo de "Estoy orando" resuelto** — causado por `permission-denied` silencioso de Firestore. Diagnosticado midiendo timing contra build de producción real (~700ms entre update optimista y fallo)
- **Segundo bug relacionado, resuelto:** "Agregar unas palabras" solo aparecía ANTES de tocar "Estoy orando" — corregido para permitir el flujo natural

### Círculos públicos = administrados (20 jul 2026)
- **Cambio de modelo:** círculos privados siguen abiertos para cualquier usuario. Círculos públicos ahora exclusivos de cuentas admin
- `usuarios/{uid}.esAdmin`: booleano, seteado A MANO desde la consola — bloqueado para escritura del cliente (sin esto cualquier usuario podría auto-nombrarse admin). **Confirmado: Carlos ya está marcado `esAdmin: true`, crear círculos públicos funciona**
- UI: el botón "Público" en "Crear círculo" solo se muestra si `isAdmin`
- **`tipo` queda fijo para siempre** tras crear el círculo — ni un admin puede cambiarlo (evita que un admin comprometido exponga círculos privados ajenos, o "adopte" uno como oficial)
- **Borrar círculos públicos:** cualquier admin puede, sin importar quién lo creó — administración colectiva. Privados: sin cambios, solo el creador
  - **Bug encontrado y resuelto (20 jul 2026):** la regla ya lo permitía, pero no existía ningún botón de borrar círculo en toda la app (solo "abandonar"). Agregado `deleteCircle()` + botón "Eliminar este círculo público" (solo si `selectedCircle.tipo === "publico" && isAdmin`), con confirmación inline — verificado que aparece incluso en un círculo público creado por *otro* admin
- **Insignia "oficial" — implementada:** `OfficialBadge` (círculo dorado con check, NO el signo de Horeb, reservado para splash/favicon/imágenes). `tipo === "publico"` ya implica oficial. Aplicada en 3 lugares: lista de exploración, encabezado dentro del círculo, tarjeta "Tu comunidad" de Inicio
- **Editar nombre/descripción:** `PencilGlyph` junto al nombre, dentro del círculo — visible solo si `canEditCircle` (privado → `creadorId === uid`; público → `isAdmin`, mismo criterio que el borrado). Formulario inline (nombre + descripción, precargados), "Guardar"/"Cancelar". `updateCircleInfo()`. Regla de Firestore publicada: tercer `allow update` en `circulos` con `affectedKeys().hasOnly(['nombre', 'descripcion'])`. Verificado con 3 escenarios: privado-creador (ve el lápiz), privado-no-creador (no lo ve), público creado por otro admin (lo ve, por ser admin)
- **Primer círculo temático real:** "Salud y Sanación" (antes "Familia Público", de prueba — se borró y se recreó bien nombrado desde el inicio)
- **No se construyeron aún más círculos temáticos** (Finanzas, Trabajo) — primero se cerró el permiso
- **Pendiente:** correr `list-public-circles.mjs` (en el repo, solo lectura, sin commitear) para revisar si hay más círculos públicos de usuarios comunes que decidir

### Tarjeta "Tu comunidad" en Inicio (20 jul 2026)
- Entre "Hoy" y "Tu camino". 3 estados: sin sesión ("Nadie sube solo. Únete a un círculo y ora acompañado." → inicia sesión), con sesión sin círculos ("Crea un círculo o únete a uno — la oración se sostiene mejor entre varios." → tab Conec✝2) — estos dos mantienen el motivo decorativo dorado de Parroquia/Santo del Día. Con círculos: muestra el círculo con `ultimaIntencionFecha` más reciente (`mostActiveCircle`). Tocar la tarjeta lleva directo al círculo — `loadIntenciones`/`openCircle` se subieron de `renderPersonalPrayer` a nivel de `App()` para esto
- **Filosofía "invitar sin exhibir" (iteración final, tras descartar un primer intento con cita protagonista):** esta tarjeta **nunca lee ningún documento de intenciones** — se quitó por completo esa consulta a Firestore, así queda garantizado en el código (no solo por convención) que ningún texto ni atribución de una intención real puede aparecer aquí. Solo usa: nombre del círculo (tamaño real de título) y un texto sereno agregado ("Tu círculo tiene algo nuevo." o "N personas en tu círculo."). Sin encabezado "✦ Conec✝2", sin comillas, sin "— Fulano"
- **Debut de Verde Zarza** (primer uso real en todo el proyecto): borde sólido + motivo de círculos de luz difusos de Parroquia/Santo del Día teñido en Verde Zarza en vez de dorado, con pulso constante de opacidad (`communityDecorPulse`). Nunca el signo de Horeb. Insignia oficial junto al nombre si aplica. CTA "Entrar al círculo ›" en dorado. Solo afecta este estado de esta tarjeta — estados 1/2 y la lista compacta dentro del tab no se tocaron
- **Destello de novedad:** resplandor pulsante (`communityGlowPulseVerde`) solo cuando la novedad es **de ese círculo específico** (no el agregado de todos los círculos — corregido). Se apaga al visitar el círculo

### Visión — Conec✝2 + Parroquias (próxima fase grande)
- **Idea central:** la parroquia ES un círculo de oración, el más grande y real. Unir ambos conceptos
- **Conec✝2 a Inicio: ✅ hecho**
- Ideas futuras: ancla diaria del círculo, ver quién rezó Rosario/Coronilla hoy, memoria/línea de tiempo del círculo

## Santo Rosario — alineado a la Santa Sede
- 20 misterios oficiales, citas bíblicas literales de vatican.va
- Misterio del día anclado a America/Bogota. 6 pasos español (con meditación), 5 inglés
- Contador "luz que crece". Persistencia con retomar solo si es del día correcto
- Acto de Contrición colombiano/latinoamericano
- Exporta `OUR_FATHER`, `HAIL_MARY`, `APOSTLES_CREED` — reutilizadas por la Coronilla
- **Bug de doble toque corregido (25 jul 2026)** — ver detalle completo abajo en Coronilla, mismo fix aplicado aquí

## Coronilla de la Divina Misericordia
- `src/Coronilla.jsx`, misma arquitectura que `Rosario.jsx`. Reutiliza oraciones exportadas, cero duplicación
- Pantalla de historia (Santa Faustina, 1935) — sin tocar
- **Reconstrucción completa con fuente extendida (23-25 jul 2026) — APROBADA, Carlos la rezó completa en su celular tras el arreglo del bug.** Estructura: Señal de la Cruz → Oración de Santa Faustina (Diario, 72, en 2 pantallas) → Oh Sangre y Agua ×3 → Padre Nuestro/Ave María/Credo → **5 décadas** (Grano Mayor + 10 Granos Menores cada una, "Década X de 5") → Santo Dios ×3 → **2 oraciones finales** (ambas siempre visibles) → cierre
- El Grano Mayor y los Granos Menores cambiaron de texto con la fuente completa: "como propiciación" → "en expiación", "Por Su dolorosa Pasión" → "Por los méritos de su dolorosa Pasión"
- **Decidido:** Padre Nuestro, Ave María y Credo se quedan tal cual en `Rosario.jsx` (vatican.va es la fuente más autorizada para esas tres oraciones específicas, no la fuente de la Coronilla)
- Todos los textos nuevos verificados programáticamente carácter por carácter contra la fuente literal — 9/9 coinciden
- Persistencia: `pageIndex` + `counts` por década — la década se deriva de `pages[pageIndex].decadeIndex`, mismo mecanismo que `mysteryIndex` en el Rosario. Verificado: retomar ofrece específicamente "la Década 2 de 5", no un genérico "en curso"

### Bug real: saltaba décadas en dispositivo táctil (25 jul 2026) — RESUELTO
- Carlos lo confirmó en celular real, tras descartar caché (desinstaló/reinstaló limpio). No se pudo reproducir con clics de script ni toques manuales espaciados — solo en toque real.
- **Causa raíz:** `handleBeadTap` (idéntico a `handleAveMariaTap` del Rosario — ninguno tenía protección) lee `counts` del closure, no la forma funcional. Si el mismo toque físico dispara el evento dos veces (touchstart + click sintetizados, típico en móvil), ambos leen el mismo valor viejo antes del re-render, y en la última cuenta de cada década cada disparo duplicado programa su propio `setTimeout(goNext, 400)` — como `goNext` sí usa forma funcional, los saltos se acumulan. Con 5 décadas repitiendo el patrón, el efecto se nota mucho más que en cualquier otro flujo.
- **Arreglado con `advancingRef`** (ref, no estado — se actualiza al instante, bloqueando el segundo disparo del mismo toque). Probado con reproducción real (doble `click()` sin espera): sin el fix salta una página completa; con el fix aterriza exactamente donde debe
- **Mismo fix aplicado a `Rosario.jsx`** (`handleAveMariaTap` tenía la misma vulnerabilidad). Confirmado con la misma prueba: sin el fix saltaba "Gloria"; con el fix, correcto. Persistencia y retomar del Rosario verificados sin cambios de comportamiento
- **Service worker subido a v20** (25 jul 2026) — este bug afecta a cualquier usuario con celular, en ambas devociones
- `Rosario.jsx` no se modificó salvo este fix puntual — confirmado por diff

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
- Cierra al tocar/scrollear fuera del panel. Accesos rápidos cierran al navegar. Cierre fantasma corregido

### Rediseño del menú de perfil (26 jul 2026)
- Avatar+nombre+correo sin cambios, separador sutil
- **Resumen de actividad:** conteos vía `getCountFromServer` (agregado, no descarga documentos) sobre `usuarios/{uid}/diario` y `usuarios/{uid}/oraciones` (+ `where("respondida","==",true)`), recalculado al abrir el menú. Diario: conteo total (no últimos 7 días, para no sentirse como presión de constancia)
- **De 3 columnas de números a frase cálida y continua** (`buildProfileSummary()`), envuelta en tarjeta (`BG_CARD`, borde `${GOLD}66`, radio 14) — el primer intento en columnas se sentía como un "dashboard de métricas", descartado tras revisión visual
- Casos límite manejados con cuidado: ambos en cero → "Tu camino en Horeb apenas comienza" (nunca "0 entradas y 0 oraciones"); `respondidas` en 0 → se omite esa cláusula por completo; singular/plural correcto ("1 entrada" no "1 entradas"); "ya respondida" sin "una de ellas" cuando solo hay 1 oración en total; "todas ya respondidas" cuando el conteo coincide. Verificado con 9 combinaciones de datos
- **"Cerrar sesión"** pasó de botón rojo grande a texto+ícono discreto (`LogoutGlyph`, color Cielo/muted) — no es una acción destructiva, no necesita tono de alarma
- **Pendiente de verificar con datos reales:** Claude Code no tuvo credenciales para probar con la cuenta real de Carlos — falta confirmar que los números suben correctamente al crear una oración, marcarla respondida, y escribir en el Diario

## Pantalla de login / interfaz pendiente (26 jul 2026)
- Carlos señaló que la pantalla de login/perfil "no tiene mucho" — la conversación se desvió hacia el rediseño del menú de perfil (arriba, ya resuelto). **Falta retomar específicamente si la pantalla de login (Google/email, antes de iniciar sesión) sigue sintiéndose incompleta** — no se llegó a revisar esa pantalla en particular
- **Fecha visible — pedida, no construida.** Carlos pidió agregar la fecha de hoy en algún lugar de la app (candidatos: cerca del saludo en Inicio, y/o en el Diario donde se escribe la entrada). Quedó pendiente de definir ubicación exacta y construir

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
- **Círculos públicos = administrados:** `usuarios/{uid}.esAdmin` (booleano, seteado a mano, bloqueado para escritura del cliente) — solo admins crean círculos con `tipo: "publico"`. `tipo` fijo para siempre. **Borrar: cualquier admin puede, sin importar quién lo creó.** Privados sin cambios
- **Pendiente de seguridad, sin tocar (revisar en otra sesión):**
  - `circulos` tiene `allow read: if true` — cualquiera, sin sesión, puede leer cualquier círculo incluidos privados: código de acceso y lista de miembros expuestos a quien consulte Firestore directamente
  - En `circulos` `update`, cualquier miembro puede reescribir el array `miembros` completo, no solo su propia membresía

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
- `public/sw.js` — **verificar número real de versión al actualizar este documento** (hubo una inconsistencia: un commit mencionaba "v19" sin tocar el archivo; el bug de doble toque del 25 jul debía subir a v20 — confirmar cuál es el estado real antes de seguir documentando como si fuera un número fijo)
- `public/favicon.svg`, `public/manifest.json`, `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_BASE64`. Cambios requieren REDEPLOY

## Pendiente

### Verificación inmediata (tuya)
- Confirmar que el resumen del menú de perfil (Diario, oraciones, respondidas) coincide con la realidad — crear oración de prueba, marcarla respondida, escribir en el Diario, verificar que los números suben
- Verificar el número real de versión en `public/sw.js` y anotarlo con certeza en este documento

### Conec✝2 — próximos pasos
- Correr `list-public-circles.mjs` y decidir qué hacer con círculos públicos existentes de usuarios comunes
- Construir más círculos temáticos (Finanzas, Trabajo...) — ya existe "Salud y Sanación" como primero

### Conec✝2 — funcionalidad futura
- Ancla diaria del círculo, ver quién rezó Rosario/Coronilla hoy, memoria/línea de tiempo del círculo

### Interfaz — pendiente de esta sesión
- Fecha visible en Inicio y/o Diario — pedida, no construida
- Revisar específicamente la pantalla de login (Google/email) si sigue sintiéndose incompleta
- Tema claro: descartado conscientemente, ver nota en sección Marca

### Parroquias — siguiente fase
- HABLAR CON EL PÁRROCO. Mensajes ya redactados
- San José de Ríogrande · más parroquias si el directorio las tiene · canal "escríbenos" (ya existe vía WhatsApp, ver Hecho)
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
- **Coronilla de la Divina Misericordia — reconstruida con 5 décadas completas, aprobada por Carlos rezándola en su celular**
- Menú hamburguesa: arreglos completos
- **Menú de perfil rediseñado** (pendiente verificación de datos reales)
- Notificaciones incompletas retiradas
- Barrido completo de emojis (3 tandas), `HorebLoading` como estado de carga unificado
- Seguridad Firestore endurecida · Parroquias: selección + horarios · Compartir como imagen
- **Rosario y Coronilla: bug de doble toque en dispositivo táctil corregido y verificado**
- Santo del Día en Inicio · Cron verificado
- **Honestidad de cobertura en Parroquias (26 jul 2026)**: la pantalla de selección (Configuración) y la tarjeta "Tu parroquia" en Inicio ya no insinúan cobertura nacional. Ambas dicen que hoy solo hay parroquias de Cajicá y que se suman más cada semana; Configuración además ofrece un enlace de WhatsApp (+57 301 296 4440, mensaje prellenado) para pedir que agreguen una parroquia. Verificado: build limpio, copy correcto en ambas pantallas (capturas), y el enlace decodifica al número y mensaje exactos. No se tocó `sw.js`.
  - **Actualizado (27 jul 2026)**: con Cali agregada, el copy de ambas pantallas pasó de "parroquias de Cajicá" a "parroquias en Cajicá y Cali", mismo tono, aprobado por Carlos.
  - **Bug encontrado por Carlos (27 jul 2026), corregido**: el texto de "fuente de estos horarios" en Configuración seguía citando la Diócesis de Zipaquirá al filtrar por "Cali", si el usuario ya tenía una parroquia de Cajicá guardada como la suya — la selección guardada pesaba más que el filtro de ciudad activo. Corregido: con un filtro de ciudad activo, ese filtro manda sobre la selección guardada; sin filtro ("Todas"), sigue usando la parroquia guardada del usuario. Verificado reproduciendo el escenario exacto (usuario con Calahorra guardada, filtrando a Cali) y su control (mismo usuario, filtrando a Cajicá y a Todas) — los 3 casos citan la fuente correcta.

### Bug urgente corregido — ícono de perfil cerraba sesión sin aviso (27 jul 2026)
El botón de la personita en el header (junto al selector de idioma), con sesión iniciada, tenía `onClick={handleLogout}` directo — cualquier toque, accidental o no, cerraba la sesión sin menú ni confirmación. Corregido a `onClick={() => setMenuOpen(!menuOpen)}`, igual que el ícono de hamburguesa: ahora abre el mismo menú desplegable rediseñado (avatar, resumen, "Cerrar sesión" como opción discreta *dentro* del menú, línea 5093 — ese es el único lugar del código que llama a `handleLogout`). Sin sesión, el ícono ya abría el modal de login correctamente (no tenía el bug). El ícono de hamburguesa tampoco lo tenía — ya usaba toggle de `menuOpen`. Verificado con Playwright: con sesión, tocar el ícono mantiene el saludo de sesión visible y abre el menú con el resumen y el nombre del usuario; sin sesión, abre el modal de "Iniciar sesión"; hamburguesa confirmada sin el problema. Cambio de una sola línea — build limpio, sin residuo de scaffold, `sw.js` sin tocar.
  - **Identidad visual propia (27 jul 2026)**: el bloque de perfil dentro del menú (avatar, nombre, correo, resumen, "Cerrar sesión") pasó de compartir fondo con la lista de navegación (solo una línea delgada los separaba) a ser una tarjeta propia — `BG_CARD`, borde sutil, esquinas redondeadas, con margen generoso antes de "Inicio". La tarjeta de resumen interna (antes también `BG_CARD`, se perdía contra el nuevo fondo de la tarjeta que la envuelve) pasó a un tinte dorado suave (`${GOLD}14`) para seguir distinguiéndose. Verificado con captura del menú completo (perfil + navegación) con sesión iniciada — se leen como dos secciones distintas de un vistazo. `sw.js` sin tocar.
- **Filtro por ciudad + San Pío X, Cali (27 jul 2026)**: la pantalla de selección de parroquia ahora agrupa por ciudad con encabezados cuando hay más de una, y ofrece pastillas ("Todas" + una por ciudad) para saltar directo. Sin preselección — se ve todo agrupado al entrar, filtro como atajo. Se agregó `Parroquia San Pío X` (Cali, Arquidiócesis de Cali — no Zipaquirá), con dato de horarios directo del sacerdote (no de un directorio), incluida la excepción del jueves en la tarde (7:00 p.m., no 6:00 p.m., agrupada aparte automáticamente por `groupWeekSchedule`). Se corrigió Calahorra: domingo pasa de 4 a 5 misas (faltaba la de 4:00 p.m.). De paso se corrigió un bug real: el texto de "fuente de estos horarios" estaba fijo en "Diócesis de Zipaquirá" sin importar la parroquia — ahora usa el campo `fuente`/`fuenteEn` de cada parroquia (se agregaron esos campos a las 4). Verificado con datos de prueba equivalentes a los reales: filtro por Cajicá/Cali, excepción del jueves visible y separada, Calahorra con 5 misas el domingo, capturas de ambas ciudades. `seed-parroquias.mjs` actualizado y listo — lo corre Carlos con su `FIREBASE_SERVICE_ACCOUNT_BASE64` (no tengo credenciales en esta sesión). No se tocó `sw.js`.
- **Conec✝2 completo: palabra al orar, testimonios, círculos públicos administrados, edición, insignia oficial, tarjeta en Inicio con Verde Zarza**
- **Rediseño de Home — Versículo del Día como protagonista (27 jul 2026)**:
  - Saludo del header por hora real (America/Bogota): "Buenos días" (5-12), "Buenas tardes" (12-19), "Que esta noche te encuentre en paz" (19-5). Nueva función `bogotaHour()`.
  - "Eco del camino": debajo del saludo, "Llevas X días caminando con Horeb" — X = conteo agregado de la colección `diario` (un doc por día, el ID ya es la fecha, así que el conteo ES los días distintos sin descargar documentos). 1 lectura por sesión (`getCountFromServer`), no por vista. Se omite por completo si X es 0 — sin lenguaje de racha.
  - Versículo del Día: de tarjeta con borde a bloque hero — degradado vertical amanecer (`SOL_NUCLEO`→`ALBA`→Noche) con el halo radial de `Horeb.jsx` (mismos tonos `SOL_NUCLEO`/`SOL_MEDIO`/`SOL_BORDE`) pero sin el monte ni la brisa — nunca el signo completo en tarjetas. Sin comillas, peso 600, velo oscuro tras el texto para contraste.
    - **Bug de contraste reportado por Carlos (27 jul 2026), corregido**: el velo original era un degradado en % de la altura de la tarjeta — con un versículo largo, el bloque de texto crece hacia arriba y sus primeras líneas terminaban sobre la zona clara del degradado (o el halo) casi sin cobertura. Reemplazado por un panel oscuro (`rgba(15,20,28,0.78)`) que envuelve solo el texto y crece con él, en vez de un velo atado a la altura total de la tarjeta — así el contraste es el mismo sin importar cuán largo sea el versículo ni dónde caiga el halo. Verificado con un versículo corto (2 líneas) y uno largo (8 líneas, Jn 3:16-17) — ambos legibles de punta a punta. No pude probar en el celular real de Carlos con brillo real (sin acceso a ese dispositivo desde aquí); el panel usa opacidad alta a propósito para dar margen de contraste incluso en el peor caso (texto blanco sobre el tono más claro del degradado).
  - Evangelio del Día: de tarjeta con imagen a fila compacta (título + referencia + flecha).
  - Santo del Día + Misas de hoy: de dos tarjetas apiladas a una fila de dos columnas; Misas ahora calcula la *próxima* misa real comparando contra la hora de Bogotá (`misaHoraAMinutos` + `bogotaNowMinutes`), con fallback a la primera del día si ya pasaron todas.
  - Configuración ganó una sección "Horario de esta semana" (reutilizando `groupWeekSchedule`/`groupDayLabel`, ya existentes) para la parroquia elegida — la vista semanal que antes solo vivía en el expandible de Inicio; ahora ahí es donde lleva la fila de Misas ("vista completa de siempre").
  - "Tu Comunidad" con texto de devoción compartida (Rosario/Coronilla a nivel de círculo) quedó evaluado y descartado por ahora: esas devociones solo se registran en `localStorage` por dispositivo, sin ningún rastro en Firestore — haría falta escritura nueva + reglas nuevas + agregación por círculo, no es un ajuste. Queda el texto genérico ("N personas en tu círculo") como está.
  - Verificado con Playwright: 3 horarios simulados (mañana/tarde/noche, mockeando solo `Date`, no timers, para no colgar el splash), saludo correcto en cada uno; caso sin actividad confirma que el "eco" no aparece; zoom al halo del hero confirma que no hay signo completo, solo el resplandor; clic en Misas de Hoy confirmado llevando a Configuración con el horario semanal completo, excepción del jueves de San Pío X bien separada. `sw.js` sin tocar.