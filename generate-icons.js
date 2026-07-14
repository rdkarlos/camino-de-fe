import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mismo signo de marca que src/Horeb.jsx (sol + monte + brisa), sobre el
// fondo Noche del brand book. Se define aparte porque los íconos PWA se
// generan en build-time con sharp, fuera del árbol de componentes de React.
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E2630"/>
      <stop offset="100%" stop-color="#151B22"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F4DFB5" stop-opacity="0.7"/>
      <stop offset="30%" stop-color="#D4B079" stop-opacity="0.3"/>
      <stop offset="65%" stop-color="#80725A" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#151B22" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g transform="translate(-24,81) scale(1.4)" stroke-linecap="butt" stroke-linejoin="miter">
    <circle cx="200" cy="85" r="95" fill="url(#glow)"/>
    <g stroke="#E4C79B" stroke-width="3">
      <line x1="120" y1="65" x2="280" y2="65"/>
      <line x1="140" y1="85" x2="260" y2="85"/>
      <line x1="160" y1="105" x2="240" y2="105"/>
    </g>
    <polyline points="45,260 200,105 355,260" fill="none" stroke="#E4C79B" stroke-width="4"/>
    <polyline points="125,260 200,185 275,260" fill="none" stroke="#8497A6" stroke-width="3"/>
  </g>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

await sharp(svgBuffer).resize(192, 192).png().toFile(join(__dirname, 'public/icon-192.png'));
await sharp(svgBuffer).resize(512, 512).png().toFile(join(__dirname, 'public/icon-512.png'));

console.log('Íconos generados correctamente');
