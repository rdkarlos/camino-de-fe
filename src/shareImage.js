// Genera la imagen "historia" (1080x1920) para compartir la reflexión de
// "Ponlo en Práctica". Todo en Canvas 2D, sin dependencias nuevas.
import { ALBA, NOCHE, NOCHE_DARK, LINO, CIELO, PIEDRA } from "./theme";

const WIDTH = 1080;
const HEIGHT = 1920;

function mixColor(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Las reflexiones llegan en markdown (títulos en negrita, a veces encabezados).
// Para la imagen las aplanamos a un único bloque de texto corrido.
function stripMarkdown(md) {
  return md
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapLine(ctx, text, maxWidth) {
  const words = text.split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(test).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Recorta `text` con puntos suspensivos hasta que quepa en maxWidth.
function truncateToWidth(ctx, text, maxWidth) {
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const candidate = `${text.slice(0, mid).trimEnd()}…`;
    if (ctx.measureText(candidate).width <= maxWidth) lo = mid; else hi = mid - 1;
  }
  return `${text.slice(0, lo).trimEnd()}…`;
}

function forceEllipsis(ctx, line, maxWidth) {
  const candidate = `${line}…`;
  if (ctx.measureText(candidate).width <= maxWidth) return candidate;
  return truncateToWidth(ctx, line, maxWidth);
}

function wrapAndClamp(ctx, text, maxWidth, maxLines) {
  const lines = wrapLine(ctx, text, maxWidth);
  if (lines.length <= maxLines) return lines;
  const clamped = lines.slice(0, maxLines);
  clamped[maxLines - 1] = forceEllipsis(ctx, clamped[maxLines - 1].replace(/[.,;:]+$/, ''), maxWidth);
  return clamped;
}

// Reduce el tamaño de la reflexión dentro de [minSize, maxSize] hasta que el
// bloque quepa en maxHeight. Si ni con minSize cabe, recorta con elegancia.
function fitReflection(ctx, text, { maxWidth, maxHeight, maxSize, minSize, lineHeight, font }) {
  for (let size = maxSize; size >= minSize; size -= 1) {
    ctx.font = font(size);
    const lines = wrapLine(ctx, text, maxWidth);
    if (lines.length * size * lineHeight <= maxHeight) {
      return { size, lines };
    }
  }
  const size = minSize;
  ctx.font = font(size);
  const allLines = wrapLine(ctx, text, maxWidth);
  const maxLines = Math.max(1, Math.floor(maxHeight / (size * lineHeight)));
  if (allLines.length <= maxLines) return { size, lines: allLines };
  const lines = allLines.slice(0, maxLines);
  lines[maxLines - 1] = forceEllipsis(ctx, lines[maxLines - 1], maxWidth);
  return { size, lines };
}

function drawTrackedText(ctx, text, centerX, y, { font, color, letterSpacing }) {
  ctx.font = font;
  const chars = text.split('');
  const widths = chars.map(c => ctx.measureText(c).width);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + letterSpacing * (chars.length - 1);
  let cursorX = centerX - totalWidth / 2;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, cursorX, y);
    cursorX += widths[i] + letterSpacing;
  });
  ctx.textAlign = 'center';
}

async function ensureFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load("italic 500 60px 'Cormorant'"),
      document.fonts.load("600 60px 'Cormorant'"),
      document.fonts.load("italic 600 60px 'Cormorant'"),
    ]);
    await document.fonts.ready;
  } catch (e) {
    // Si la carga de fuentes falla, seguimos con lo que el navegador tenga disponible.
  }
}

// Genera la imagen "historia" de Ponlo en Práctica y devuelve un Blob PNG.
export async function generateLambShareImage({ reflectionMarkdown, quoteText, quoteRef }) {
  await ensureFontsReady();

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // Fondo: degradado del alba (arriba) a la noche (abajo).
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, mixColor(NOCHE, ALBA, 0.4));
  bg.addColorStop(0.4, NOCHE);
  bg.addColorStop(1, NOCHE_DARK);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Vértice de luz — mismo lenguaje visual que VerticeDeLuz.jsx.
  const vertexX = WIDTH / 2;
  const vertexY = 300;
  const haloRadius = 420;
  const halo = ctx.createRadialGradient(vertexX, vertexY, 0, vertexX, vertexY, haloRadius);
  halo.addColorStop(0, hexToRgba(ALBA, 0.95));
  halo.addColorStop(0.28, hexToRgba(ALBA, 0.4));
  halo.addColorStop(0.65, hexToRgba(ALBA, 0.08));
  halo.addColorStop(1, hexToRgba(ALBA, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(vertexX, vertexY, haloRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ALBA;
  ctx.beginPath();
  ctx.arc(vertexX, vertexY, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';

  // Reflexión — protagonista, Cormorant cursiva, Lino.
  const reflectionPlain = stripMarkdown(reflectionMarkdown || '');
  const reflectionMaxWidth = 860;
  const reflectionTop = 620;
  const reflectionMaxHeight = 780;
  const lineHeight = 1.75;
  const { size: reflectionSize, lines: reflectionLines } = fitReflection(ctx, reflectionPlain, {
    maxWidth: reflectionMaxWidth,
    maxHeight: reflectionMaxHeight,
    maxSize: 58,
    minSize: 34,
    lineHeight,
    font: size => `italic 500 ${size}px 'Cormorant', serif`,
  });
  const lineHeightPx = reflectionSize * lineHeight;
  const blockHeight = reflectionLines.length * lineHeightPx;
  let cursorY = reflectionTop + Math.max(0, (reflectionMaxHeight - blockHeight) / 2) + reflectionSize * 0.78;
  ctx.font = `italic 500 ${reflectionSize}px 'Cormorant', serif`;
  ctx.fillStyle = LINO;
  for (const line of reflectionLines) {
    ctx.fillText(line, vertexX, cursorY);
    cursorY += lineHeightPx;
  }

  // Separador — línea corta y tenue en Alba.
  const sepY = reflectionTop + reflectionMaxHeight + 20;
  ctx.strokeStyle = hexToRgba(ALBA, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(vertexX - 70, sepY);
  ctx.lineTo(vertexX + 70, sepY);
  ctx.stroke();

  // Cita del evangelio + referencia.
  let quoteY = sepY + 76;
  if (quoteText) {
    ctx.font = "italic 500 32px 'Cormorant', serif";
    ctx.fillStyle = PIEDRA;
    const quoteLines = wrapAndClamp(ctx, `«${quoteText}»`, 760, 3);
    for (const line of quoteLines) {
      ctx.fillText(line, vertexX, quoteY);
      quoteY += 44;
    }
  }
  if (quoteRef) {
    ctx.font = "600 24px 'Cormorant', serif";
    ctx.fillStyle = CIELO;
    ctx.fillText(quoteRef, vertexX, quoteY + 12);
  }

  // Firma — LUMORA, discreta, con tracking amplio.
  drawTrackedText(ctx, 'LUMORA', vertexX, HEIGHT - 130, {
    font: "600 28px 'Cormorant', serif",
    color: ALBA,
    letterSpacing: 28 * 0.28,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob devolvió null'))), 'image/png', 0.95);
  });
}

// Recorta el cuerpo del evangelio a una cita breve (primera oración, o corte con elipsis).
export function gospelExcerpt(bodyText, maxChars = 170) {
  if (!bodyText) return '';
  const clean = bodyText.replace(/\s+/g, ' ').trim();
  const sentenceMatch = clean.match(/^.{20,}?[.!?](?=\s|$)/);
  let excerpt = sentenceMatch ? sentenceMatch[0] : clean;
  if (excerpt.length > maxChars) excerpt = `${excerpt.slice(0, maxChars).trim()}…`;
  return excerpt;
}
