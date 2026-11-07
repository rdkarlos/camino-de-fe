// Lógica de Evangelio/Lecturas compartida entre api/gospel.js (bajo demanda)
// y api/cron-reflexion.js (precarga). El prefijo "_" evita que Vercel lo
// despliegue como función propia.

const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

// BibleGet I/O — Libro del Pueblo de Dios (BLPD), católica con imprimatur
// y los 7 deuterocanónicos. Verificado en vivo: canon de 73 libros,
// Juan 3:16 y Tobías 3:11 con texto real. Ver PROYECTO.md para el
// detalle completo de la investigación de fuentes.
const BIBLEGET_APPID = 'caminodefe';

// book id (3 letras, mismas que bookMap de abajo) -> abreviatura BLPD,
// verificada contra metadata.php?query=versionindex&versions=BLPD; el
// orden canónico de BLPD coincide 1:1 con el de bookMap/BIBLE_BOOKS.
const BIBLEGET_ABBR = {
  GEN:'Gen', EXO:'Ex', LEV:'Lv', NUM:'Nm', DEU:'Dt', JOS:'Jos', JDG:'Jc', RUT:'Rt',
  '1SA':'1Sa', '2SA':'2Sa', '1KI':'1Re', '2KI':'2Re', '1CH':'1Cro', '2CH':'2Cro',
  EZR:'Esd', NEH:'Ne', TOB:'Tb', JDT:'Jdt', EST:'Est', '1MA':'1Mac', '2MA':'2Mac',
  JOB:'Jb', PSA:'Sal', PRO:'Pr', ECC:'Qo', SNG:'Cant', WIS:'Sb', SIR:'Si',
  ISA:'Is', JER:'Jr', LAM:'Lam', BAR:'Ba', EZK:'Ez', DAN:'Dn', HOS:'Os', JOL:'Jl',
  AMO:'Am', OBA:'Abd', JON:'Jon', MIC:'Mi', NAM:'Na', HAB:'Ha', ZEP:'Sof', HAG:'Ag',
  ZEC:'Za', MAL:'Ml', MAT:'Mt', MRK:'Mc', LUK:'Lc', JHN:'Jn', ACT:'He', ROM:'Rm',
  '1CO':'1Co', '2CO':'2Co', GAL:'Ga', EPH:'Ef', PHP:'Flp', COL:'Col', '1TH':'1Ts',
  '2TH':'2Ts', '1TI':'1Tm', '2TI':'2Tm', TIT:'Tt', PHM:'Flm', HEB:'Hb', JAS:'St',
  '1PE':'1P', '2PE':'2P', '1JN':'1Jn', '2JN':'2Jn', '3JN':'3Jn', JUD:'Jd', REV:'Ap',
};

const bookMap = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
  'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
  'Tobit': 'TOB', 'Judith': 'JDT', 'Esther': 'EST', '1 Maccabees': '1MA',
  '2 Maccabees': '2MA', 'Job': 'JOB', 'Psalm': 'PSA', 'Psalms': 'PSA',
  'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG',
  'Song of Songs': 'SNG', 'Wisdom': 'WIS', 'Sirach': 'SIR',
  'Isaiah': 'ISA', 'Jeremiah': 'JER', 'Lamentations': 'LAM',
  'Baruch': 'BAR', 'Ezekiel': 'EZK', 'Daniel': 'DAN', 'Hosea': 'HOS',
  'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
  'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
  'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Ps': 'PSA',
  // Abreviaturas que Universalis usa en los cánticos que sustituyen al salmo
  'Is': 'ISA', 'Ex': 'EXO', 'Dn': 'DAN', 'Jer': 'JER', 'Hab': 'HAB', 'Lk': 'LUK',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
  'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
  '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB',
  'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
  '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV',
};

// Normaliza guiones especiales y entidades HTML en referencias bíblicas
const normalizeRef = (ref) => ref
  .replace(/&#x2010;/gi, '-')
  .replace(/&#8208;/g, '-')
  .replace(/[‐‑‒–—]/g, '-')
  .replace(/&nbsp;|&#xa0;|&#160;/gi, ' ')
  .replace(/&#x211f;|&#8479;/gi, '℟')
  .trim();

// Convierte una referencia de Universalis (inglés) en la query de
// BibleGet para BLPD, en notación "Abr<capítulo>,<verso>[-<verso>]" o
// "Abr<cap1>,<v1>-<cap2>,<v2>" para rangos que cruzan de capítulo.
const parseRef = (rawRef) => {
  if (!rawRef) return null;
  let ref = normalizeRef(rawRef);
  // Quita el responso (℟) del final: sus dígitos ("℟2b") no son versos del salmo
  ref = ref.replace(/(?:&#x211f;|&#8479;|℟).*$/i, '').trim();
  // Ps 100(99):1-2  |  Psalm 33(34):2-9  |  Psalm 113B(115):3-10
  // Universalis trae dos numeraciones (hebrea y Vulgata) y su orden ha
  // cambiado con el tiempo: antes "Psalm 33(34)" (Vulgata primero), ahora
  // "Ps 100(99)" (hebrea primero). BibleGet usa la hebrea, que casi siempre es
  // la mayor de las dos. Si el primero lleva letra (mitad de un salmo
  // dividido, 113B) es Vulgata y la hebrea es la del paréntesis.
  ref = ref.replace(/^(Psalms?|Ps)\s+(\d+)([A-Za-z]?)\((\d+)\)/i, (_, book, first, letter, paren) =>
    `${book} ${letter ? paren : Math.max(Number(first), Number(paren))}`);
  // Tolera una letra pegada al capítulo que no haya sido normalizada arriba
  // (defensivo, por si aparece en evangelio/lecturas además de salmos)
  const bookMatch = ref.match(/^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+)[A-Za-z]?:(\d+)/);
  if (!bookMatch) return null;
  const bookName = bookMatch[1].trim();
  const bookCode = bookMap[bookName];
  if (!bookCode) return null;
  const abbr = BIBLEGET_ABBR[bookCode];
  if (!abbr) return null;
  const ch1 = bookMatch[2];
  const v1  = bookMatch[3];
  const allNums = ref.match(/\d+/g) || [];
  const lastNum = allNums[allNums.length - 1];
  const chapterChange = ref.match(/(\d+)[A-Za-z]?:(\d+)-(\d+)[A-Za-z]?:(\d+)/);
  if (chapterChange) {
    return `${abbr}${chapterChange[1]},${chapterChange[2]}-${chapterChange[3]},${chapterChange[4]}`;
  }
  return `${abbr}${ch1},${v1}-${lastNum}`;
};

// Referencia manual en notación BLPD ("Lc 12,35-38", "Jn 3,16", "Mt 5,1-7,29",
// "1 Co 13,1-13") -> query de BibleGet ("Lc12,35-38"). Tolera espacios
// alrededor de la coma, el guion y el punto ("Lc 16, 9 - 15").
// Varios tramos del mismo capítulo se separan con punto ("Lc 15,1-3.11-32"):
// cada tramo es "verso" o "verso-verso" y se valida por separado. El punto
// nunca se convierte en coma: "Lc 15,1-3.16,2" es inválido.
// Los versos finales deben ser >= al inicial y los tramos ir en orden ascendente.
// Devuelve { query, expect } o { error } (el error dice cuál tramo falla);
// `expect` son los versos "cap:verso" que BibleGet debe devolver (en un tramo
// que cruza de capítulo, solo el primero y el último: no se sabe cuántos hay).
const checkManualRef = (ref) => {
  const norm = String(ref || '').trim().replace(/\s*([,.-])\s*/g, '$1');
  const m = norm.match(/^(\d?\s?[A-Za-zÁÉÍÓÚáéíóúñ]+)\s*(\d+),(.+)$/);
  if (!m) return { error: 'no tiene la forma libro capítulo,verso' };
  const [, book, ch, rest] = m;
  const abbr = book.replace(/\s+/g, '');
  const parts = rest.split('.');
  if (parts.length === 1) {
    // Un solo tramo: puede cruzar de capítulo ("Mt 5,1-7,29")
    const t = parts[0].match(/^(\d+)(?:-(?:(\d+),)?(\d+))?$/);
    if (!t) return { error: `el tramo "${parts[0]}" no es válido` };
    const [, v1, ch2, v2] = t;
    const tail = v2 ? `-${ch2 ? `${ch2},` : ''}${v2}` : '';
    const query = `${abbr}${ch},${v1}${tail}`;
    if (ch2) {
      if (Number(ch2) < Number(ch) || (Number(ch2) === Number(ch) && Number(v2) < Number(v1))) {
        return { error: `el tramo "${parts[0]}" es inválido: termina antes de empezar` };
      }
      return { query, expect: [`${ch}:${v1}`, `${ch2}:${v2}`] };
    }
    if (v2 && Number(v2) < Number(v1)) {
      return { error: `el tramo "${parts[0]}" es inválido: el verso final (${v2}) es menor que el inicial (${v1})` };
    }
    const expect = [];
    for (let v = Number(v1); v <= Number(v2 || v1); v++) expect.push(`${ch}:${v}`);
    return { query, expect };
  }
  const expect = [];
  let prevEnd = 0;
  for (let i = 0; i < parts.length; i++) {
    const t = parts[i].match(/^(\d+)(?:-(\d+))?$/);
    if (!t) {
      return { error: `el tramo ${i + 1} ("${parts[i]}") no es válido: cada tramo debe ser "verso" o "verso-verso" del mismo capítulo` };
    }
    const v1 = Number(t[1]), v2 = Number(t[2] ?? t[1]);
    if (v2 < v1) {
      return { error: `el tramo ${i + 1} ("${parts[i]}") es inválido: el verso final (${v2}) es menor que el inicial (${v1})` };
    }
    if (v1 <= prevEnd) {
      return { error: `el tramo ${i + 1} ("${parts[i]}") no va en orden ascendente: empieza en ${v1} y el tramo anterior termina en ${prevEnd}` };
    }
    prevEnd = v2;
    for (let v = v1; v <= v2; v++) expect.push(`${ch}:${v}`);
  }
  return { query: `${abbr}${ch},${parts.join('.')}`, expect };
};

const parseManualRef = (ref) => checkManualRef(ref).query ?? null;

// Referencia legible de los versos devueltos por BibleGet cuando la query
// lleva varios tramos: "Lucas 15:1-3.11-32" (no "15:1-32", que sería falso).
const formatVerseRuns = (verses) => {
  const runs = [];
  for (const { verse } of verses) {
    const n = Number(verse);
    const last = runs[runs.length - 1];
    if (last && n === last[1] + 1) last[1] = n; else runs.push([n, n]);
  }
  return `${verses[0].book} ${verses[0].chapter}:${runs.map(([a, b]) => (a === b ? a : `${a}-${b}`)).join('.')}`;
};

// timeoutMs: tope de esta llamada (quien llama lo calcula según lo que quede
// del presupuesto total). Acepta una referencia de Universalis o, con
// { query: true }, una query de BibleGet ya lista.
// Con { strict: true, expect } (lecturas manuales) cualquier fallo lanza un
// error que dice qué pasó: errors de BibleGet, sin resultados o versos
// pedidos que faltan. Sin strict, devuelve null como siempre.
const getSpanishText = async (rawRef, timeoutMs = 8000, { query = false, strict = false, expect = null } = {}) => {
  const bibleGetQuery = query ? rawRef : parseRef(rawRef);
  if (!bibleGetQuery) return null;
  try {
    const url = `https://query.bibleget.io/v3/index.php?query=${encodeURIComponent(bibleGetQuery)}&version=BLPD&return=json&appid=${BIBLEGET_APPID}`;
    const response = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) {
      if (strict) throw new Error(`BibleGet respondió HTTP ${response.status} para "${bibleGetQuery}"`);
      return null;
    }
    const data = await response.json();
    const verses = data?.results;
    if (strict) {
      if (data?.errors?.length) throw new Error(`BibleGet devolvió errores para "${bibleGetQuery}": ${JSON.stringify(data.errors)}`);
      if (!verses?.length) throw new Error(`BibleGet no devolvió versos para "${bibleGetQuery}"`);
      const got = new Set(verses.map((v) => `${Number(v.chapter)}:${Number(v.verse)}`));
      const missing = (expect || []).filter((k) => !got.has(k));
      if (missing.length) throw new Error(`BibleGet devolvió menos versos de los pedidos para "${bibleGetQuery}": faltan ${missing.join(', ')}`);
    }
    if (data?.errors?.length || !verses?.length) return null;
    const text = verses.map(v => (v.text || '').trim()).join(' ').replace(/\s+/g, ' ').trim();
    const first = verses[0];
    const last = verses[verses.length - 1];
    const reference = query && first.chapter === last.chapter
      ? formatVerseRuns(verses)
      : first.chapter === last.chapter
      ? `${first.book} ${first.chapter}:${first.verse}${verses.length > 1 ? '-' + last.verse : ''}`
      : `${first.book} ${first.chapter}:${first.verse}-${last.chapter}:${last.verse}`;
    return { text, reference };
  } catch (e) {
    if (strict) throw e.name === 'TimeoutError' || e.name === 'AbortError'
      ? new Error(`BibleGet no respondió a tiempo para "${bibleGetQuery}"`)
      : e;
    return null;
  }
};

// Parsea el HTML del salmo de Universalis en su estructura litúrgica:
// R. (responso), R. alternativo (ej. Aleluya) y estrofas de versos (V.)
const parsePsalmStructure = (html) => {
  if (!html) return null;
  const divRegex = /<div[^>]*>([\s\S]*?)<\/div>/g;
  const blocks = [];
  let m;
  while ((m = divRegex.exec(html)) !== null) {
    const inner = m[1];
    const isItalic = /^<i>/.test(inner);
    const isBold = /^<b>/.test(inner);
    const text = cleanText(inner).replace(/\s+/g, ' ');
    blocks.push({ isItalic, isBold, text });
  }
  if (!blocks.length) return null;

  let i = 0;
  const response = blocks[i]?.isItalic ? blocks[i++].text : null;
  let alternative = null;
  if (blocks[i]?.isBold) {
    i++; // "or"
    if (blocks[i]?.isItalic) alternative = blocks[i++].text;
  }

  const stanzas = [];
  let current = [];
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.isItalic) {
      // responso repetido: cierra la estrofa actual y salta el "or" + alternativa
      if (current.length) { stanzas.push(current); current = []; }
      i++;
      if (blocks[i]?.isBold) {
        i++;
        if (blocks[i]?.isItalic) i++;
      }
    } else if (b.isBold) {
      i++;
    } else {
      if (b.text) current.push(b.text);
      i++;
    }
  }
  if (current.length) stanzas.push(current);

  return { response, alternative, stanzas };
};

// Formatea el salmo en inglés con la estructura R./V. real de Universalis
const formatPsalmEn = (structure) => {
  if (!structure) return null;
  const lines = [];
  if (structure.response) lines.push(`R. ${structure.response}`);
  if (structure.alternative) lines.push(`R. ${structure.alternative}`);
  structure.stanzas.forEach((stanza, idx) => {
    lines.push('');
    lines.push(`V. ${stanza.join(' ')}`);
    if (structure.response) lines.push(`R. ${structure.response}`);
  });
  return lines.join('\n');
};

// Formatea el salmo en español: usa la cantidad de estrofas de Universalis
// como guía y el texto continuo traducido (API.Bible) agrupado en versos.
// La primera frase se usa como responso (R.), el resto se agrupa en estrofas.
const formatPsalmEs = (structure, spanishText) => {
  if (!spanishText) return null;
  const sentences = spanishText.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()).filter(Boolean) || [spanishText];
  if (sentences.length < 2) {
    return `V. ${spanishText}`;
  }
  const response = sentences[0];
  const rest = sentences.slice(1);
  const stanzaCount = structure?.stanzas?.length > 0 ? structure.stanzas.length : Math.ceil(rest.length / 2);
  const perStanza = Math.max(1, Math.ceil(rest.length / stanzaCount));

  const lines = [`R. ${response}`, `R. ¡Aleluya!`];
  for (let i = 0; i < rest.length; i += perStanza) {
    const stanza = rest.slice(i, i + perStanza).join(' ');
    lines.push('');
    lines.push(`V. ${stanza}`);
    lines.push(`R. ${response}`);
  }
  return lines.join('\n');
};

// Limpia HTML de Universalis a texto plano
const cleanText = (html) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x2018;|&#8216;/gi, '‘')
    .replace(/&#x2019;|&#8217;/gi, '’')
    .replace(/&#x201C;|&#8220;/gi, '“')
    .replace(/&#x201D;|&#8221;/gi, '”')
    .replace(/&#x2010;|&#8208;/gi, '-')
    .replace(/&#xa0;|&#160;/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    // cualquier otra entidad numérica (ej. &#x2014; raya) que no esté arriba
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
};

// Universalis ofusca los campos "text" del JSONP como un literal de string
// seguido de una cadena .split("x").join("y") (anti-scraping): no es JSON
// válido tal cual. Se resuelve cada cadena antes de hacer JSON.parse.
const deobfuscateUniversalis = (jsonStr) => {
  const chainRe = /"((?:\\.|[^"\\])*)"((?:\s*\.split\("(?:\\.|[^"\\])*"\)\.join\("(?:\\.|[^"\\])*"\))+)/g;
  const stepRe = /\.split\("((?:\\.|[^"\\])*)"\)\.join\("((?:\\.|[^"\\])*)"\)/g;
  return jsonStr.replace(chainRe, (full, baseLit, chain) => {
    let value = JSON.parse(`"${baseLit}"`);
    let step;
    stepRe.lastIndex = 0;
    while ((step = stepRe.exec(chain)) !== null) {
      const from = JSON.parse(`"${step[1]}"`);
      const to = JSON.parse(`"${step[2]}"`);
      value = value.split(from).join(to);
    }
    return JSON.stringify(value);
  });
};

// Extrae el argumento del PRIMER universalisCallback(...) contando
// paréntesis fuera de strings. El feed a veces llega con el payload duplicado
// y cabeceras HTTP filtradas en medio (visto el 17-24 oct 2026), así que no
// se puede asumir que el cuerpo termina en el último ")".
const extractFirstCallback = (raw) => {
  const open = raw.indexOf('(', raw.indexOf('universalisCallback'));
  if (open === -1) throw new Error('Universalis: no se encontró universalisCallback(');
  let depth = 0;
  let inStr = false;
  for (let i = open; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
    } else if (c === '(') {
      depth++;
    } else if (c === ')') {
      if (--depth === 0) return raw.slice(open + 1, i);
    }
  }
  throw new Error('Universalis: respuesta truncada (callback sin cerrar)');
};


// Un solo intento y tope corto: si Universalis no conecta (caído el 20 oct 2026)
// reintentar solo multiplica la espera del usuario.
const fetchUniversalis = async (url, timeoutMs) => {
  let r;
  try {
    r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (e) {
    throw new Error(`Universalis no responde (sin conexión en ${timeoutMs / 1000} s)`);
  }
  if (!r.ok) throw new Error(`Universalis respondió HTTP ${r.status}`);
  return r.text();
};

const dateKey = (year, month, day) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// Feed del día ya deofuscado: { Mass_G, Mass_R1, Mass_R2, Mass_Ps, ... }
const fetchUniversalisDay = async (year, month, day, timeoutMs = 3000) => {
  const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  // Ruta canónica (la antigua /latinamerica/... responde 301 a esta)
  const raw = await fetchUniversalis(`https://universalis.com/${dateStr}/jsonpmass.js`, timeoutMs);
  const data = JSON.parse(deobfuscateUniversalis(extractFirstCallback(raw)));
  if (!data.Mass_G) throw new Error('Gospel not found in Universalis response');
  return data;
};

// Respuesta en inglés: pura, solo usa el feed de Universalis.
const buildEn = (data) => {
  const gospelData = data.Mass_G;
  const reading1Data = data.Mass_R1 || null;
  const reading2Data = data.Mass_R2 || null;
  const psalmData = data.Mass_Ps || null;
  const psalmStructure = psalmData ? parsePsalmStructure(psalmData.text) : null;
  return {
    success: true,
    reading: `Gospel — ${normalizeRef(gospelData.source)}`,
    reference: normalizeRef(gospelData.source),
    text: cleanText(gospelData.text) || 'Gospel text not available',
    reading1: reading1Data ? { reference: normalizeRef(reading1Data.source), text: cleanText(reading1Data.text) } : null,
    reading2: reading2Data ? { reference: normalizeRef(reading2Data.source), text: cleanText(reading2Data.text) } : null,
    psalm:    psalmData   ? { reference: normalizeRef(psalmData.source),    text: formatPsalmEn(psalmStructure) || cleanText(psalmData.text) } : null,
    reflection: '',
  };
};

// Arma la respuesta en español con las lecturas ya resueltas en BibleGet.
// refs: referencias crudas (para el respaldo en inglés); en: textos en inglés
// de Universalis; es: textos resueltos o null; psalmStructure: guía litúrgica
// de Universalis (null en modo manual). `complete` = ninguna lectura cayó al
// respaldo en inglés: solo entonces vale la pena guardarla en caché.
// manual: el documento de emergencia no trae responso, así que el salmo se
// muestra solo con sus versos (formatPsalmEs inventaría el responso).
const assembleEs = ({ day, month, year, refs, en, es, psalmStructure, manual = false }) => {
  const title = `Evangelio del ${day} de ${MONTHS[month - 1].charAt(0).toUpperCase() + MONTHS[month - 1].slice(1)} del ${year}`;
  const gospelRef = es.gospel.reference || refs.gospel;
  const reading = (key) => es[key]
    ? { reference: es[key].reference || refs[key], text: es[key].text }
    : (refs[key] ? { reference: null, text: null, referenceEn: refs[key], textEn: en[key] } : null);
  const response = {
    success: true,
    reading: title,
    reference: gospelRef,
    text: `Evangelio del día\nLectura del santo Evangelio según san ${gospelRef}\n\n${es.gospel.text}`,
    reading1: reading('reading1'),
    reading2: reading('reading2'),
    psalm: es.psalm
      ? { reference: es.psalm.reference || refs.psalm, text: (manual ? null : formatPsalmEs(psalmStructure, es.psalm.text)) || es.psalm.text }
      : (refs.psalm ? { reference: null, text: null, referenceEn: refs.psalm, textEn: en.psalm } : null),
    reflection: '',
  };
  const complete = ['reading1', 'reading2', 'psalm'].every((k) => !refs[k] || es[k]);
  return { response, complete };
};

// Español desde el feed de Universalis. Los textos vienen de BibleGet/BLPD;
// `deadline` (ms epoch) acota el tiempo total que se le da a BibleGet.
const buildEs = async (data, { day, month, year, deadline }) => {
  const g = data.Mass_G, r1 = data.Mass_R1 || null, r2 = data.Mass_R2 || null, ps = data.Mass_Ps || null;
  const refs = {
    gospel: normalizeRef(g.source),
    reading1: r1 ? normalizeRef(r1.source) : null,
    reading2: r2 ? normalizeRef(r2.source) : null,
    psalm: ps ? normalizeRef(ps.source) : null,
  };
  const psalmStructure = ps ? parsePsalmStructure(ps.text) : null;
  const en = {
    reading1: r1 ? cleanText(r1.text) : null,
    reading2: r2 ? cleanText(r2.text) : null,
    psalm: ps ? (formatPsalmEn(psalmStructure) || cleanText(ps.text)) : null,
  };
  const t = Math.max(1000, deadline - Date.now());
  const [gospel, reading1, reading2, psalm] = await Promise.all([
    getSpanishText(g.source, t),
    r1 ? getSpanishText(r1.source, t) : null,
    r2 ? getSpanishText(r2.source, t) : null,
    ps ? getSpanishText(ps.source, t) : null,
  ]);
  if (!gospel?.text) throw new Error('Spanish gospel text not found');
  return assembleEs({ day, month, year, refs, en, es: { gospel, reading1, reading2, psalm }, psalmStructure });
};

// Español desde una referencia escrita a mano (documento de emergencia).
// manual: { evangelio, lectura1?, lectura2?, salmo? } en notación "Lc 12,35-38".
const buildEsManual = async (manual, { day, month, year, deadline }) => {
  const field = { gospel: 'evangelio', reading1: 'lectura1', reading2: 'lectura2', psalm: 'salmo' };
  const refs = {}, queries = {};
  for (const [key, name] of Object.entries(field)) {
    const raw = manual[name];
    if (!raw) { refs[key] = null; continue; }
    const { query: q, expect, error } = checkManualRef(raw);
    if (!q) throw new Error(`Referencia manual inválida en "${name}": recibí "${raw}" (${error}); formatos aceptados: "Lc 12,35-38", "Jn 3,16", "Mt 5,1-7,29" o varios tramos del mismo capítulo separados por punto, "Lc 15,1-3.11-32"; se toleran espacios alrededor de la coma, el guion y el punto`);
    refs[key] = String(raw).trim();
    queries[key] = { q, expect };
  }
  if (!refs.gospel) throw new Error('El documento manual no tiene el campo "evangelio"');
  const t = Math.max(1000, deadline - Date.now());
  const es = {};
  await Promise.all(Object.keys(queries).map(async (key) => {
    try {
      es[key] = await getSpanishText(queries[key].q, t, { query: true, strict: true, expect: queries[key].expect });
    } catch (e) {
      throw new Error(`Lectura manual "${field[key]}" (${refs[key]}): ${e.message}`);
    }
  }));
  if (!es.gospel?.text) throw new Error(`BibleGet no devolvió texto para la referencia manual "${refs.gospel}"`);
  return assembleEs({ day, month, year, refs, en: {}, es, psalmStructure: null, manual: true }).response;
};

export { dateKey, fetchUniversalisDay, buildEn, buildEs, buildEsManual, parseManualRef };
