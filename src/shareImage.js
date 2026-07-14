// Genera las imágenes "historia" (1080x1920) para compartir desde Horeb:
// el primer consejo de "Ponlo en Práctica" y el Versículo del Día.
// Todo en Canvas 2D, sin dependencias nuevas.
import { ALBA, NOCHE, NOCHE_DARK, LINO, CIELO, PIEDRA, BRISA_ALBA, CIELO_ALTURA, SOL_NUCLEO, SOL_MEDIO, SOL_BORDE, rgba as hexToRgba, mix as mixColor } from "./theme";

const WIDTH = 1080;
const HEIGHT = 1920;

// Encabezado compartido por ambas imágenes: dónde empieza el contenido y
// termina el resplandor del signo de Horeb.
const CONTENT_TOP = 692;
const CONTENT_MAX_HEIGHT = 780;

// Limpia marcas de markdown (negritas, encabezados, viñetas) de un fragmento
// de texto ya aislado, dejando prosa simple.
function stripMarkdown(md) {
  return (md || '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// "Ponlo en Práctica" entrega varios consejos separados por línea en blanco,
// cada uno como "**Título**: explicación". La imagen muestra solo el
// primero — meter los tres aplanados los pegaba sin separación y obligaba
// a una fuente diminuta. Si no hay título en negrita reconocible (contenido
// viejo o con otro formato), se muestra todo como cuerpo, sin título.
function extractFirstTip(markdown) {
  const text = (markdown || '').trim();
  const firstBlock = text.split(/\n\s*\n/)[0]?.trim() || '';
  const match = firstBlock.match(/^\*\*(.+?)\*\*[:\s]*([\s\S]*)$/);
  if (match) {
    return { title: stripMarkdown(match[1]), body: stripMarkdown(match[2]) };
  }
  return { title: '', body: stripMarkdown(firstBlock) };
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

// Reduce el tamaño de un bloque de texto dentro de [minSize, maxSize] hasta
// que quepa en maxHeight. Si ni con minSize cabe, recorta con elegancia.
function fitText(ctx, text, { maxWidth, maxHeight, maxSize, minSize, lineHeight, font }) {
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

// Como fitText, pero para un título (negrita) seguido de un cuerpo
// (cursiva) — el título va a `titleScale` veces el tamaño del cuerpo, y
// solo el cuerpo se recorta si ni con el mínimo cabe todo.
function fitTitleAndBody(ctx, { title, body, maxWidth, maxHeight, maxBodySize, minBodySize, titleScale, lineHeight, gap }) {
  const titleFont = size => `600 ${size}px 'Cormorant', serif`;
  const bodyFont = size => `italic 500 ${size}px 'Cormorant', serif`;

  for (let bodySize = maxBodySize; bodySize >= minBodySize; bodySize -= 1) {
    const titleSize = Math.round(bodySize * titleScale);
    ctx.font = titleFont(titleSize);
    const titleLines = title ? wrapLine(ctx, title, maxWidth) : [];
    ctx.font = bodyFont(bodySize);
    const bodyLines = wrapLine(ctx, body, maxWidth);
    const titleHeight = titleLines.length * titleSize * lineHeight;
    const bodyHeight = bodyLines.length * bodySize * lineHeight;
    const usedGap = titleLines.length ? gap : 0;
    if (titleHeight + usedGap + bodyHeight <= maxHeight) {
      return { titleSize, bodySize, titleLines, bodyLines, titleHeight, bodyHeight, gap: usedGap };
    }
  }

  const bodySize = minBodySize;
  const titleSize = Math.round(bodySize * titleScale);
  ctx.font = titleFont(titleSize);
  const titleLines = title ? wrapLine(ctx, title, maxWidth) : [];
  const titleHeight = titleLines.length * titleSize * lineHeight;
  const usedGap = titleLines.length ? gap : 0;

  ctx.font = bodyFont(bodySize);
  const availableForBody = Math.max(bodySize * lineHeight, maxHeight - titleHeight - usedGap);
  const maxBodyLines = Math.max(1, Math.floor(availableForBody / (bodySize * lineHeight)));
  const allBodyLines = wrapLine(ctx, body, maxWidth);
  let bodyLines = allBodyLines;
  if (allBodyLines.length > maxBodyLines) {
    bodyLines = allBodyLines.slice(0, maxBodyLines);
    bodyLines[maxBodyLines - 1] = forceEllipsis(ctx, bodyLines[maxBodyLines - 1], maxWidth);
  }
  const bodyHeight = bodyLines.length * bodySize * lineHeight;
  return { titleSize, bodySize, titleLines, bodyLines, titleHeight, bodyHeight, gap: usedGap };
}

function trackedTextWidth(ctx, text, font, letterSpacing) {
  ctx.font = font;
  const widths = text.split('').map(c => ctx.measureText(c).width);
  return widths.reduce((sum, w) => sum + w, 0) + letterSpacing * (text.length - 1);
}

// Dibuja texto con tracking empezando en x (alineado a la izquierda), no centrado.
function drawTrackedTextAt(ctx, text, x, y, { font, color, letterSpacing }) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  let cursorX = x;
  for (const c of text) {
    const w = ctx.measureText(c).width;
    ctx.fillText(c, cursorX, y);
    cursorX += w + letterSpacing;
  }
  ctx.textAlign = 'center';
}

// Mini signo de Horeb (sol + monte, versión simplificada) para la firma —
// mismas proporciones que el arte nativo de Horeb.jsx (viewBox 400x320).
// `height` es la altura del ícono en px; devuelve su ancho.
function drawSignatureMark(ctx, x, top, height) {
  const scale = height / 320;
  const width = 400 * scale;
  const cx = x + 200 * scale;
  const sunY = top + 85 * scale;

  const haloR = 90 * scale;
  const halo = ctx.createRadialGradient(cx, sunY, 0, cx, sunY, haloR);
  halo.addColorStop(0, hexToRgba(SOL_NUCLEO, 0.85));
  halo.addColorStop(0.4, hexToRgba(SOL_MEDIO, 0.3));
  halo.addColorStop(1, hexToRgba(NOCHE_DARK, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, sunY, haloR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = BRISA_ALBA;
  ctx.lineWidth = 22 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 45 * scale, top + 260 * scale);
  ctx.lineTo(cx, top + 105 * scale);
  ctx.lineTo(x + 355 * scale, top + 260 * scale);
  ctx.stroke();

  return width;
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
  } catch {
    // Si la carga de fuentes falla, seguimos con lo que el navegador tenga disponible.
  }
}

function createStoryCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  return canvas;
}

// Fondo: degradado del alba (arriba) a la noche (abajo).
function drawBackground(ctx) {
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, mixColor(NOCHE, ALBA, 0.4));
  bg.addColorStop(0.4, NOCHE);
  bg.addColorStop(1, NOCHE_DARK);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

// Horeb — el sol que asoma tras el monte, mismo diseño que Horeb.jsx
// (viewBox nativo 400x320), escalado y centrado en el encabezado.
function drawHeader(ctx) {
  const vertexX = WIDTH / 2;
  const sunCanvasY = 260;
  const scale = 2.3;
  const sx = x => vertexX + (x - 200) * scale;
  const sy = y => sunCanvasY + (y - 85) * scale;

  const haloRadius = 95 * scale;
  const halo = ctx.createRadialGradient(vertexX, sunCanvasY, 0, vertexX, sunCanvasY, haloRadius);
  halo.addColorStop(0, hexToRgba(SOL_NUCLEO, 0.7));
  halo.addColorStop(0.3, hexToRgba(SOL_MEDIO, 0.3));
  halo.addColorStop(0.65, hexToRgba(SOL_BORDE, 0.05));
  halo.addColorStop(1, hexToRgba(NOCHE_DARK, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(vertexX, sunCanvasY, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  // La brisa en la cima — tres líneas finas que cruzan el resplandor.
  ctx.strokeStyle = BRISA_ALBA;
  ctx.lineWidth = 3 * scale;
  [65, 85, 105].forEach((lineY, i) => {
    const half = 80 - i * 20; // 120–280, 140–260, 160–240
    ctx.beginPath();
    ctx.moveTo(sx(200 - half), sy(lineY));
    ctx.lineTo(sx(200 + half), sy(lineY));
    ctx.stroke();
  });

  // Monte principal — dos trazos que ascienden y se encuentran en la cima.
  ctx.strokeStyle = BRISA_ALBA;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(sx(45), sy(260));
  ctx.lineTo(sx(200), sy(105));
  ctx.lineTo(sx(355), sy(260));
  ctx.stroke();

  // Monte interior — más pequeño y tenue: nadie sube solo.
  ctx.strokeStyle = CIELO_ALTURA;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(sx(125), sy(260));
  ctx.lineTo(sx(200), sy(185));
  ctx.lineTo(sx(275), sy(260));
  ctx.stroke();

  return vertexX;
}

function drawSeparator(ctx, vertexX, y) {
  ctx.strokeStyle = hexToRgba(ALBA, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(vertexX - 70, y);
  ctx.lineTo(vertexX + 70, y);
  ctx.stroke();
}

// Firma — el signo compacto de Horeb junto a la palabra "Horeb", discreta,
// con tracking amplio. Centrada como un solo grupo (ícono + texto).
function drawSignature(ctx, vertexX) {
  const signatureFont = "600 28px 'Cormorant', serif";
  const signatureLetterSpacing = 28 * 0.28;
  const signatureText = 'HOREB';
  const signatureBaselineY = HEIGHT - 130;
  const markHeight = 30;
  const markTextGap = 16;

  const textWidth = trackedTextWidth(ctx, signatureText, signatureFont, signatureLetterSpacing);
  const groupWidth = markHeight + markTextGap + textWidth;
  const groupStartX = vertexX - groupWidth / 2;

  drawSignatureMark(ctx, groupStartX, signatureBaselineY - markHeight * 0.78, markHeight);
  drawTrackedTextAt(ctx, signatureText, groupStartX + markHeight + markTextGap, signatureBaselineY, {
    font: signatureFont,
    color: ALBA,
    letterSpacing: signatureLetterSpacing,
  });
}

// Genera la imagen "historia" del primer consejo de "Ponlo en Práctica" y
// devuelve un Blob PNG. Solo el primer consejo: mostrar los tres aplanados
// los pegaba sin separación entre título y explicación, y obligaba a una
// fuente diminuta para que entraran.
export async function generateLambShareImage({ reflectionMarkdown, quoteText, quoteRef }) {
  await ensureFontsReady();

  const canvas = createStoryCanvas();
  const ctx = canvas.getContext('2d');
  drawBackground(ctx);
  const vertexX = drawHeader(ctx);
  ctx.textAlign = 'center';

  // Consejo — título destacado (Brisa de Alba) + explicación (Lino, cursiva).
  const { title, body } = extractFirstTip(reflectionMarkdown);
  const contentMaxWidth = 860;
  const lineHeight = 1.75;
  const titleBodyGap = 26;
  const fit = fitTitleAndBody(ctx, {
    title, body,
    maxWidth: contentMaxWidth,
    maxHeight: CONTENT_MAX_HEIGHT,
    maxBodySize: 52,
    minBodySize: 44,
    titleScale: 1.25,
    lineHeight,
    gap: titleBodyGap,
  });

  const totalHeight = fit.titleHeight + fit.gap + fit.bodyHeight;
  let blockTop = CONTENT_TOP + Math.max(0, (CONTENT_MAX_HEIGHT - totalHeight) / 2);

  if (fit.titleLines.length) {
    ctx.font = `600 ${fit.titleSize}px 'Cormorant', serif`;
    ctx.fillStyle = ALBA;
    let titleY = blockTop + fit.titleSize * 0.78;
    for (const line of fit.titleLines) {
      ctx.fillText(line, vertexX, titleY);
      titleY += fit.titleSize * lineHeight;
    }
    blockTop += fit.titleHeight + fit.gap;
  }

  ctx.font = `italic 500 ${fit.bodySize}px 'Cormorant', serif`;
  ctx.fillStyle = LINO;
  let bodyY = blockTop + fit.bodySize * 0.78;
  for (const line of fit.bodyLines) {
    ctx.fillText(line, vertexX, bodyY);
    bodyY += fit.bodySize * lineHeight;
  }

  // Separador — línea corta y tenue en Alba.
  const sepY = CONTENT_TOP + CONTENT_MAX_HEIGHT + 20;
  drawSeparator(ctx, vertexX, sepY);

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

  drawSignature(ctx, vertexX);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob devolvió null'))), 'image/png', 0.95);
  });
}

// Genera la imagen "historia" del Versículo del Día y devuelve un Blob PNG.
// Mismo lenguaje visual que "Ponlo en Práctica" pero más simple: el
// contenido es corto, así que la letra es generosa y no hay bloque de cita
// aparte (el versículo mismo es el protagonista).
export async function generateVerseShareImage({ verseText, verseRef }) {
  await ensureFontsReady();

  const canvas = createStoryCanvas();
  const ctx = canvas.getContext('2d');
  drawBackground(ctx);
  const vertexX = drawHeader(ctx);
  ctx.textAlign = 'center';

  // Versículo — protagonista, con mucho aire.
  const verseMaxWidth = 860;
  const lineHeight = 2;
  const { size: verseSize, lines: verseLines } = fitText(ctx, verseText || '', {
    maxWidth: verseMaxWidth,
    maxHeight: CONTENT_MAX_HEIGHT,
    maxSize: 72,
    minSize: 44,
    lineHeight,
    font: size => `italic 500 ${size}px 'Cormorant', serif`,
  });
  const blockHeight = verseLines.length * verseSize * lineHeight;
  let cursorY = CONTENT_TOP + Math.max(0, (CONTENT_MAX_HEIGHT - blockHeight) / 2) + verseSize * 0.78;
  ctx.font = `italic 500 ${verseSize}px 'Cormorant', serif`;
  ctx.fillStyle = LINO;
  for (const line of verseLines) {
    ctx.fillText(line, vertexX, cursorY);
    cursorY += verseSize * lineHeight;
  }

  // Separador — línea corta y tenue en Alba.
  const sepY = CONTENT_TOP + CONTENT_MAX_HEIGHT + 20;
  drawSeparator(ctx, vertexX, sepY);

  // Referencia — Arena del Monte.
  if (verseRef) {
    ctx.font = "600 30px 'Cormorant', serif";
    ctx.fillStyle = PIEDRA;
    const refLines = wrapAndClamp(ctx, verseRef, 760, 2);
    let refY = sepY + 64;
    for (const line of refLines) {
      ctx.fillText(line, vertexX, refY);
      refY += 40;
    }
  }

  drawSignature(ctx, vertexX);

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
