import { useId } from "react";
import { NOCHE, NOCHE_DARK, BRISA_ALBA, CIELO_ALTURA, SOL_NUCLEO, SOL_MEDIO, SOL_BORDE } from "./theme";

// Horeb — el signo de marca definitivo: el sol que asoma tras el monte.
// Tres líneas finas que cruzan el resplandor son la brisa en la cima; un
// segundo monte, más pequeño y tenue, recuerda que nadie sube solo.
//
// El arte nativo vive en un lienzo 400x320 (no es cuadrado). Sin fondo se
// usa tal cual — el sobrante transparente arriba/abajo no se nota. Con
// fondo (favicon, íconos PWA) el fondo debe llenar un cuadrado completo,
// así que ahí se usa un lienzo cuadrado 400x400 con el dibujo centrado
// 40 unidades más abajo (ver <g transform>).
export default function Horeb({ size = 64, background = false, animated = false, style, className }) {
  const id = useId();
  const bgId = `horeb-bg-${id}`;
  const glowId = `horeb-glow-${id}`;
  // Solo los usos realmente diminutos (botón flotante 24px, título de
  // modal 28px) se simplifican a solo el sol y el monte principal, con
  // trazo más grueso. Rosario (40px), el splash (120px) y cualquier otro
  // uso mayor muestran el signo completo: sol + brisa + monte + monte interior.
  const simplified = size <= 32;

  const artwork = (
    <>
      <circle cx="200" cy="85" r="95" fill={`url(#${glowId})`} className={animated ? "horeb-glow-pulse" : undefined} />

      {simplified ? (
        // Monte principal — versión simplificada a tamaños diminutos.
        <polyline
          points="45,260 200,105 355,260"
          fill="none"
          stroke={BRISA_ALBA}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          {/* La brisa en la cima */}
          <g stroke={BRISA_ALBA} strokeWidth="3" strokeLinecap="butt">
            <line x1="120" y1="65" x2="280" y2="65" />
            <line x1="140" y1="85" x2="260" y2="85" />
            <line x1="160" y1="105" x2="240" y2="105" />
          </g>

          {/* Monte principal */}
          <polyline points="45,260 200,105 355,260" fill="none" stroke={BRISA_ALBA} strokeWidth="4" strokeLinecap="butt" strokeLinejoin="miter" />

          {/* Monte interior — más pequeño y tenue: nadie sube solo */}
          <polyline points="125,260 200,185 275,260" fill="none" stroke={CIELO_ALTURA} strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter" />
        </>
      )}
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={background ? "0 0 400 400" : "0 0 400 320"}
      style={style}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {background && (
          <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NOCHE} />
            <stop offset="100%" stopColor={NOCHE_DARK} />
          </linearGradient>
        )}
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SOL_NUCLEO} stopOpacity="0.7" />
          <stop offset="30%" stopColor={SOL_MEDIO} stopOpacity="0.3" />
          <stop offset="65%" stopColor={SOL_BORDE} stopOpacity="0.05" />
          <stop offset="100%" stopColor={NOCHE_DARK} stopOpacity="0" />
        </radialGradient>
      </defs>

      {background ? (
        <>
          <rect width="400" height="400" rx="88" fill={`url(#${bgId})`} />
          <g transform="translate(0,40)">{artwork}</g>
        </>
      ) : artwork}
    </svg>
  );
}
