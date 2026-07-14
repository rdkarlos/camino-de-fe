// Paleta oficial Horeb — única fuente de verdad para los colores de marca.
// Los mismos valores están reflejados como variables CSS en :root (src/index.css).
export const NOCHE = "#1E2630";
export const CARD = "#28313D";
export const ALBA = "#E4C79B"; // Brisa de Alba (antes Luz del Alba #E8B45C)
export const LINO = "#F5F1E8";
export const CIELO = "#8497A6"; // Cielo de Altura (antes #7E97AB)
export const PIEDRA = "#C7B79C"; // Arena del Monte (antes #B8AE9C)
export const VERDE_ZARZA = "#7A8C6E"; // Nuevo del brand book — aún sin uso asignado

// Tonos derivados (no forman parte del brand book, se calculan a partir de la paleta
// oficial para mantener gradientes y contrastes existentes sin introducir hex sueltos).
export const ALBA_LIGHT = "#EBD5B4"; // Alba aclarado, para gradientes dorados de dos tonos
export const ALBA_DARK = "#AB7D37"; // Alba oscurecido, para texto sobre fondos dorados claros
export const NOCHE_DARK = "#151B22"; // Noche oscurecido, para gradientes de profundidad

export const BRISA_ALBA = ALBA; // Alias histórico de Horeb.jsx — desde esta migración es igual a ALBA
export const CIELO_ALTURA = CIELO; // Alias histórico de Horeb.jsx — desde esta migración es igual a CIELO

// Resplandor solar de Horeb.jsx — tonos cálidos del degradado radial del sol.
export const SOL_NUCLEO = "#F4DFB5"; // Centro del resplandor
export const SOL_MEDIO = "#D4B079"; // Anillo medio del resplandor
export const SOL_BORDE = "#80725A"; // Borde tenue, se funde con la noche

// Convierte un color de la paleta a rgba() con opacidad variable — así los
// glows, sombras y fondos translúcidos derivan siempre de un color de acá
// arriba en vez de tener un rgb(...) suelto y desincronizado en cada componente.
export function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Mezcla dos colores de la paleta (t=0 → hexA, t=1 → hexB) — para degradados
// de dos tonos que antes se resolvían con un tercer hex suelto e inventado.
export function mix(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}
