import { useId } from "react";
import { ALBA } from "./theme";

// Punto de luz — un vértice luminoso en Alba con halo que se desvanece.
// viewBox fijo de 100x100: al ser vectorial, se ve nítido en cualquier
// tamaño (16px a 512px) sin recalcular proporciones.
export default function VerticeDeLuz({ size = 64, style, className }) {
  const id = useId();
  const haloId = `vertice-halo-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ALBA} stopOpacity="0.95" />
          <stop offset="28%" stopColor={ALBA} stopOpacity="0.4" />
          <stop offset="65%" stopColor={ALBA} stopOpacity="0.08" />
          <stop offset="100%" stopColor={ALBA} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${haloId})`} />
      <circle cx="50" cy="50" r="9" fill={ALBA} />
    </svg>
  );
}
