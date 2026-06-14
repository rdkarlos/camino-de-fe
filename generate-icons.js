import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1B2A4A" rx="80"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="#C9A84C">✝</text>
  <text x="256" y="430" font-size="60" text-anchor="middle" fill="#FAF7F2" font-family="Georgia">Fe</text>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

await sharp(svgBuffer).resize(192, 192).png().toFile(join(__dirname, 'public/icon-192.png'));
await sharp(svgBuffer).resize(512, 512).png().toFile(join(__dirname, 'public/icon-512.png'));

console.log('Íconos generados correctamente');