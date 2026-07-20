import Horeb from "./Horeb";

// Indicador de carga/momento espiritual de la app — el signo de Horeb con el
// halo del sol pulsando suavemente (el trazo del monte permanece fijo).
// Reutiliza Horeb.jsx en vez de duplicar el SVG; ver .horeb-glow-pulse en
// index.css para la animación.
export default function HorebLoading({ size = 32, style, className }) {
  return <Horeb size={size} animated style={style} className={className} />;
}
