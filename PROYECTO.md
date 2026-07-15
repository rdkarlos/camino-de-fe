# Horeb (antes Lumora / Camino de Fe)

> Migración de marca COMPLETA: nombre, signo, paleta y dominio propio.

## URLs
- Producción: https://somoshoreb.com (dominio principal, conectado)
- www.somoshoreb.com → redirige a somoshoreb.com (308)
- camino-de-fe-seven.vercel.app → redirige a somoshoreb.com (308) — dominio de Vercel, se mantiene vivo para no romper enlaces viejos
- GitHub: github.com/rdkarlos/camino-de-fe
- Local: C:\Users\rdkar\camino-de-fe

## Entorno de desarrollo
- `npm run dev` → http://localhost:5173/ — usarlo para iterar rápido en vez de hacer push a Vercel en cada cambio
- `npm run dev -- --host` → expone la app en la red local; abrir la IP resultante en el celular (misma WiFi) para ver en vivo
- **Nota:** las rutas `/api/*` no corren con vite a secas (son funciones serverless de Vercel). El evangelio y las lecturas pueden fallar en local — no es un bug.

## Stack
- React + Vite + Vercel (plan Hobby)
- Firebase Auth + Firestore
- Node.js v24, Windows 10

## Marca — Somos Horeb
- **Nombre:** Horeb. **Firma:** Somos Horeb. **Eslogan:** *Sube. Vuelve distinto.*
- **Por qué Horeb:** el monte donde Dios no estaba en el viento, ni el terremoto, ni el fuego — sino en una brisa suave. Moisés y Elías subieron cansados, "con lo que les quedaba".
- **El "somos" no es decorativo:** dice comunidad. Nadie sube solo. Diferencia a Horeb de Hallow y Ora (individuales).
- **Nombres descartados:** Tabor (app de citas rusa, 17M descargas), Lumora (saturado: apps de bienestar/belleza/skincare, incluida una de manifestación New Age), Tabita (marca de calzado brasileña), Emaús/Cenáculo/Betania/Nazaret (todos tomados). Lección: entre más obvio el nombre bíblico, más probable que ya lo tengan.
- **Competencia:** Hallow (#1, épico/disciplina) y Ora (colombiana, mismas funciones). Diferenciador de Horeb: comunidad + parroquias.

## Identidad visual
### El signo (logo)
- `src/Horeb.jsx` — sol asomando detrás del monte, tres líneas horizontales descendentes que se estrechan hacia la cima (la brisa), monte principal (dos trazos) y monte interior más tenue en Cielo de Altura (el *somos*, perspectiva atmosférica)
- Prop `background` (default `false` = transparente). Con fondo: favicon e íconos PWA (viewBox no cuadrado, 400×320 — cuidado al forzar tamaño cuadrado)
- **Umbral de simplificación: 32px.** Por debajo, se omiten las tres líneas y el monte interior
- IDs de gradientes con `useId()`
- **El logo NO va en las tarjetas de la app** (Santo del Día, Parroquia) — ahí va un motivo decorativo (círculos difusos + punto de luz, en Brisa de Alba). El logo se reserva para splash, favicon/PWA y firma de imágenes compartidas
- Reemplaza también el ícono del modal de login (antes: emoji ✝️, que se veía morado en algunos dispositivos por el renderizado del sistema)

### Paleta (brand book Horeb) — migrada
| Nombre | Hex | Antes (Lumora) |
|---|---|---|
| Noche de Horeb | `#1E2630` | sin cambio |
| Brisa de Alba (ALBA) | `#E4C79B` | `#E8B45C` |
| Lino | `#F5F1E8` | sin cambio |
| Cielo de Altura (CIELO) | `#8497A6` | `#7E97AB` |
| Arena del Monte (PIEDRA) | `#C7B79C` | `#B8AE9C` |
| Verde Zarza | `#7A8C6E` | nuevo, **sin uso asignado aún** |

- `theme.js` exporta `rgba(hex, alpha)` y `mix(colorA, colorB, ratio)` como utilidades centralizadas — **no dejar rgba/mix hardcodeados en componentes**. Se migraron 18 casos que estaban sueltos en App.jsx/Rosario.jsx.
- Contraste verificado: Brisa de Alba tiene MÁS contraste que el dorado anterior contra Noche (9.4:1 vs 8.1:1) — lo que baja es la saturación, no la legibilidad.
- Verdes de éxito y rojos de error son colores semánticos (no de marca) — no se tocan.
- **Tipografía:** Cormorant (títulos), Work Sans (interfaz) — sin cambios.

### Fósiles de marca encontrados y limpiados
Durante la migración aparecieron restos de versiones anteriores que ningún grep de texto detectaba (colores hardcodeados a mano, no componentes importados):
- Íconos PWA (`generate-icons.js`): tenían una cruz sobre azul marino `#1B2A4A` — ni siquiera era el vértice de luz viejo, sino algo anterior a eso
- Favicon: vértice de luz viejo en `#E8B45C`
- Tarjetas de Santo del Día y Parroquia: resplandor copiado a mano (ahora usan `rgba(ALBA,...)` del theme)
- Overlay de "Joven Fe": morado `rgba(45,27,78,...)` sin relación con la paleta
- Splash: degradado superior con `#4B453A` hardcodeado
- `public/icons.svg`: sprite huérfano de un boilerplate (Bluesky, Discord, GitHub) — borrado, no se usaba
- Constantes muertas `BLUE`/`BLUE_DARK` en App.jsx — eliminadas
- **Lección:** si algo es un motivo de marca, debe ser un componente importado, no una copia manual — así el próximo cambio de marca no deja fósiles.
- **Pendiente, no urgente:** `api/confirm-payment.js` (email de pago) tiene su propia paleta vieja (vino tinto + dorado antiguo). Se deja así hasta que la Tienda esté activa de verdad (hoy Wompi en test, nadie recibe esos correos).

### Tono
- Tuteo, español neutro, sin regionalismos ni clericalismos
- *"El susurro, no el grito"* — la palabra justa, si sobra se quita
- Invita, no ordena
- Nunca: rachas, gamificación culposa, emojis pictóricos

## Secciones
1. **Inicio** — Bloque "Hoy": Versículo → Evangelio → Santo del Día → Misas de tu parroquia. Separador. Bloque "Tu camino": Oración Personal → Joven Fe
2. **Oración Personal** — Mi Oración (Crear Oración, Mis Oraciones, Diario, Conec✝2), Rosario, Devocional
3. Evangelio — "Ponlo en Práctica"
4. La Biblia — LBLA
5. Lecturas del día
6. Santo Rosario
7. Devocional — Oraciones Clásicas (12), Novenas (5, días 2-9 pendientes), Santo del Día
8. Tienda — en construcción
9. Configuración — incluye "Tu parroquia"
10. Joven Fe

## Mi Oración — 4 pestañas (reestructurado 14 jul 2026)

### Historia: por qué se unificó Diario + Mis Oraciones
Existían dos pestañas ("Diario" y "Mis Oraciones") mostrando el mismo tipo de contenido (intenciones creadas en "Crear Oración") con capacidades partidas: Diario leía localStorage y permitía borrar pero no sincronizaba; Mis Oraciones leía Firestore y sincronizaba pero no permitía borrar. Era redundancia confusa, no dos funciones distintas. Se unificaron en una sola "Mis Oraciones", liberando el nombre "Diario" para una función nueva y genuina.

### Crear Oración
- Grid de 8 estados de ánimo → versículo + santo patrono (datos estáticos) → intención en texto libre → botón "Orar" (concatena plantillas fijas, no hay IA real pese al nombre `generatePrayer`)
- Guardar requiere sesión (ya era así). Sin sesión: invitación serena a crear cuenta, sin bloquear la creación, solo el guardado.
- Ya no escribe doble (antes: localStorage + Firestore a la vez). Ahora solo Firestore si hay sesión.

### Mis Oraciones (unificada)
- Con sesión: Firestore como fuente única (`usuarios/{uid}/oraciones`), sincroniza entre dispositivos
- **Ahora permite borrar** (hueco cerrado — antes no se podía desde esta pestaña)
- **Migración automática de datos heredados:** al iniciar sesión, compara localStorage["personal_prayers"] contra Firestore por texto (trimmed); lo que no exista se sube preservando la fecha original (`new Date(id)`, no `serverTimestamp()`, para no perder el orden cronológico); al terminar, limpia localStorage
- Sin sesión: si hay oraciones heredadas en localStorage, se muestran con banner de invitación a crear cuenta arriba (siguen visibles y editables mientras tanto)
- Ya no es el `else` implícito del selector de tabs — ahora es un caso explícito (evita fragilidad si se agregan más tabs)

### Diario (nuevo, 14 jul 2026)
- **Distinto de Mis Oraciones:** no son intenciones, es gratitud y reflexión — mirar hacia atrás en el día, no pedir hacia adelante
- `src/diarioPreguntas.js` — 30 preguntas fijas, una por día del mes, en tono Horeb (examen ignaciano + gratitud, nunca de culpa)
- La pregunta del día se elige por el **día del mes**, anclado a `America/Bogota` (mismo patrón que el resto del proyecto). Día 31 → reutiliza la pregunta del día 30.
- **Una entrada por día**, reforzado en la lógica (no solo en la interfaz): el ID del documento en Firestore ES la fecha de hoy (`setDoc` con ID determinístico) — Firestore mismo impide una segunda escritura el mismo día.
- **Las entradas NO se pueden editar ni borrar** una vez guardadas — es un diario real, no una nota.
- Se pueden releer las entradas anteriores (fecha + pregunta que respondió + texto), de más reciente a más antigua.
- Requiere sesión — reutiliza el mismo patrón de invitación que Mis Oraciones.
- Persistencia: `usuarios/{uid}/diario/{fecha}`. Cubierto por la regla existente `match /usuarios/{userId}/{document=**}` — no hizo falta publicar reglas nuevas.

### Conec✝2 (sin cambios)
- La más completa de las 4 pestañas originales: círculos privados/públicos, compartir intenciones, botón "Estoy orando", borrar con permisos, abandonar círculo, límite de 10 miembros, rastro de luz de actividad nueva.

## Rastro de luz — Conec✝2
- Aviso in-app (no push). Punto de luz en 4 niveles: Inicio → Mi Oración → Conec✝2 → círculo
- Se apaga solo al abrir el círculo con la novedad. Lo propio nunca lo enciende.
- Datos: `usuarios/{uid}.circleLastSeen` + `circulos/{id}.ultimaIntencionFecha`/`ultimaIntencionAutorId`
- Auto-refresco por `visibilitychange`, throttle 3 min. Sin `onSnapshot`.

## Seguridad Firestore — endurecida ✅ (12 jul 2026)
- `usuarios/{uid}` y **toda subcolección** (`{document=**}`): solo el propio usuario. Esta regla ya cubre `oraciones`, `diario`, y cualquier subcolección futura sin necesitar reglas nuevas.
- `reflexiones`, `versiculos`, `parroquias`: lectura pública, escritura bloqueada (`if false`). Solo el servidor escribe vía admin.
- `circulos`: lectura pública. Update limitado a campos específicos y solo miembros. Delete solo el creador.
- `circulos/{id}/intenciones`: solo miembros. Create requiere `autorId == uid`. Delete: autor o creador (modera).

## Cron de reflexión diaria (IMPORTANTE)
- `api/cron-reflexion.js` y `api/spiritual-guide.js` usan **firebase-admin**, no el SDK de cliente
- Credencial: `FIREBASE_SERVICE_ACCOUNT_BASE64` en Vercel (rotada 12 jul). Nunca en el repo.
- ✅ Verificado: el cron se dispara solo en plan Hobby.

## Santo Rosario — alineado a la Santa Sede
- Fuente: vatican.va — 20 misterios oficiales + citas bíblicas, copiadas LITERAL
- Misterio del día anclado a America/Bogota
- 6 pasos en español (Anuncio → Meditación → Padre Nuestro → 10 Ave Marías → Gloria → Jaculatoria), 40 pantallas. Inglés: 5 pasos, sin meditación (faltan citas oficiales en inglés)
- Contador "luz que crece": anillo de 10 cuentas, círculo central se enciende progresivamente
- Persistencia localStorage, ofrece retomar solo si es del día y misterio de hoy
- **Acto de Contrición: fórmula colombiana/latinoamericana** ("Jesús, mi Señor y Redentor..."), no la tradicional española. Ambas válidas; se eligió la del público objetivo.

## Parroquias — misas
- Colección `parroquias`. Datos del directorio oficial de la Diócesis de Zipaquirá.
- `horarioMisas`: cada misa es `{hora, lugar?}` — el lugar solo si no es la iglesia principal (ej. Santísima Trinidad: Cementerio los sábados, Salón comunal de La Palma los domingos)
- 3 parroquias cargadas (Cajicá). Falta San José de Ríogrande.
- Tarjeta en Inicio: invitación / misas de hoy / semana expandida. Fuente citada en Configuración, no en la tarjeta.

## Compartir como imagen
- `src/shareImage.js` — 1080×1920, degradado alba→noche, signo de Horeb, Cormorant. Sin fecha (no caduca).
- **Ponlo en Práctica:** comparte solo el PRIMER consejo (título + explicación) — antes fundía los 3 en un párrafo ilegible. Fuente subida a 44-65px.
- **Versículo del Día:** nueva función, reutiliza header/separador/firma compartidos con la de Ponlo en Práctica.
- Comparte imagen + texto con link a **somoshoreb.com** vía Web Share API. Copy: "Algo de luz para tu día" (versículo) / "Una idea para vivir el Evangelio hoy. Hay más camino en Horeb." (Ponlo en Práctica)
- Botón: "Comparte esta luz" en ambos lugares
- Firma: signo compacto de Horeb + "HOREB", centrado abajo (según brand book — "Somos Horeb" se reserva para otros usos)
- **Canal de crecimiento orgánico clave**

## Navegación
- `goToTab(i)` centralizado resetea `personalSection`, `personalTab`, `devocionalInitialTab` al cambiar de sección
- **Excepción — La Biblia:** conserva su estado deliberadamente (funciona como marcador de lectura)

## Archivos clave
- `src/App.jsx`, `src/theme.js`, `src/Horeb.jsx`
- `src/Rosario.jsx`, `src/Devocional.jsx`, `src/diarioPreguntas.js` (nuevo)
- `src/santos.js`, `src/versiculos.js`, `src/JovenFe.jsx`, `src/shareImage.js`
- `seed-parroquias.mjs`
- `api/gospel.js`, `api/spiritual-guide.js`, `api/cron-reflexion.js`, `api/order.js`, `api/confirm-payment.js`
- `public/sw.js` (v18), `public/favicon.svg`, `generate-icons.js`

## Variables de entorno en Vercel
- `ANTHROPIC_API_KEY`, `CRON_SECRET` (rotado 11 jul), `FIREBASE_SERVICE_ACCOUNT_BASE64` (rotado 12 jul)
- Cambios en env vars requieren REDEPLOY

## Pendiente

### Parroquias — siguiente fase
- **HABLAR CON EL PÁRROCO.** No vender: preguntar si los horarios están correctos y escuchar. Mensajes ya redactados para enviar (a usuarios de Lumora y al padre).
- WhatsApp es el flujo (lo que pasó); Horeb es el estado (lo que ES, siempre visible)
- San José de Ríogrande (faltan horarios) · Canal "escríbenos" (el copy lo promete, no existe) · Panel del párroco solo si lo pide

### Contenido
- Novenas días 2-9 (4 restantes) — fuente católica confiable, NO generado
- Joven Fe — Testimonios y Quiz Bíblico
- Rosario: citas bíblicas oficiales en inglés · evaluar "Dios mío, ven en mi auxilio" y letanías lauretanas
- Extender compartir-como-imagen al Santo del Día

### Funcionalidad futura
- Push notifications reales
- Aviso "están orando por tu intención" (distinto al rastro actual)
- **Monetización — Fase 0: definir modelo.** Productos con nombre propio ya definidos en el brand book: Cordada (comunidad), Brisa (música), Semilla (niños), Cumbre (retiros)
- Decidir uso del Verde Zarza (declarado, sin trabajo asignado)

### Distribución
- PWA sin tiendas. iPhone: instalar requiere 5 pasos ocultos en Safari, sin botón posible
- Android sí permite botón (`beforeinstallprompt`)
- Empaquetar (Bubblewrap/Capacitor) cuando el contenido esté más completo. Ojo: comisión 15-30% si se vende dentro de la app

### Técnico
- Fallback Evangelio: lanza 500 si falla su traducción (las otras 3 lecturas sí tienen fallback sereno)
- Limpieza: cuentas de prueba en Authentication, claves de servicio de Firebase sin usar
- `api/confirm-payment.js`: paleta vieja, actualizar cuando la Tienda esté activa
- CNAME del `www` en Namecheap: Vercel recomienda actualizarlo al nuevo formato (no urgente, el viejo sigue funcionando)

### Hecho ✅
- Brand book Fases 1-3 (Lumora) · Fix salmos + fallback + caché
- Conec✝2 rastro de luz · Migración firebase-admin (cron verificado)
- Rosario alineado a la Santa Sede · Santo del Día en Inicio
- Navegación: reset de estado + retomar Rosario
- Seguridad Firestore endurecida · Parroquias: selección + horarios
- Compartir como imagen (versículo + Ponlo en Práctica, con link a somoshoreb.com)
- **Marca Horeb completa: nombre, dominio, logo, paleta, limpieza de fósiles**
- **Mi Oración reestructurado: Diario unificado con Mis Oraciones, y Diario de gratitud nuevo con 30 preguntas**