export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day   = parseInt(req.query.day)   || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year  = parseInt(req.query.year)  || new Date().getFullYear();
  const lang  = req.query.lang || 'es';

  const API_KEY  = '8z-olVvbUPzjg2OtXjSks';
  const BIBLE_ID = 'e3f420b9665abaeb-01';

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
    .replace(/&nbsp;/gi, ' ')
    .trim();

  const parseRef = (rawRef) => {
    if (!rawRef) return null;
    let ref = normalizeRef(rawRef);
    // Psalm 33(34):2-9  |  Psalm 113B(115):3-10  →  usa el número entre paréntesis
    // (la letra opcional marca la mitad Vulgata de un salmo dividido; el número
    // entre paréntesis es la numeración hebrea/moderna, la misma que usa API.Bible)
    ref = ref.replace(/^(Psalms?)\s+\d+[A-Za-z]?\((\d+)\)/i, '$1 $2');
    // Tolera una letra pegada al capítulo que no haya sido normalizada arriba
    // (defensivo, por si aparece en evangelio/lecturas además de salmos)
    const bookMatch = ref.match(/^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+)[A-Za-z]?:(\d+)/);
    if (!bookMatch) return null;
    const bookName = bookMatch[1].trim();
    const bookCode = bookMap[bookName];
    if (!bookCode) return null;
    const ch1 = bookMatch[2];
    const v1  = bookMatch[3];
    const allNums = ref.match(/\d+/g) || [];
    const lastNum = allNums[allNums.length - 1];
    const chapterChange = ref.match(/(\d+)[A-Za-z]?:(\d+)-(\d+)[A-Za-z]?:(\d+)/);
    if (chapterChange) {
      return `${bookCode}.${chapterChange[1]}.${chapterChange[2]}-${bookCode}.${chapterChange[3]}.${chapterChange[4]}`;
    }
    return `${bookCode}.${ch1}.${v1}-${bookCode}.${ch1}.${lastNum}`;
  };

  const getSpanishText = async (rawRef) => {
    const passageId = parseRef(rawRef);
    if (!passageId) return null;
    try {
      const url = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
      const response = await fetch(url, {
        headers: { 'api-key': API_KEY, 'Accept': 'application/json' },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        text: data?.data?.content?.replace(/\s+/g, ' ').trim(),
        reference: data?.data?.reference,
      };
    } catch (e) {
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
      const text = inner
        .replace(/<\/?[ib]>/g, '')
        .replace(/&#160;|&#xa0;|&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
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
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();
  };

  try {
    const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    const universalisUrl = `https://universalis.com/latinamerica/${dateStr}/jsonpmass.js`;

    const raw = await fetch(universalisUrl).then(r => r.text());

    // Quitar wrapper JSONP: universalisCallback({...})
    const jsonStr = raw.replace(/^universalisCallback\s*\(/, '').replace(/\)\s*;?\s*$/, '');
    const data = JSON.parse(jsonStr);

    const gospelData  = data.Mass_G;
    const reading1Data = data.Mass_R1 || null;
    const reading2Data = data.Mass_R2 || null;
    const psalmData   = data.Mass_Ps || null;

    if (!gospelData) throw new Error('Gospel not found in Universalis response');

    const rawGospelRef  = gospelData.source;
    const rawReading1Ref = reading1Data?.source || null;
    const rawReading2Ref = reading2Data?.source || null;
    const rawPsalmRef   = psalmData?.source || null;
    const psalmStructure = psalmData ? parsePsalmStructure(psalmData.text) : null;

    if (lang === 'en') {
      return res.status(200).json({
        success: true,
        reading: `Gospel — ${normalizeRef(rawGospelRef)}`,
        reference: normalizeRef(rawGospelRef),
        text: cleanText(gospelData.text) || 'Gospel text not available',
        reading1: reading1Data ? { reference: normalizeRef(rawReading1Ref), text: cleanText(reading1Data.text) } : null,
        reading2: reading2Data ? { reference: normalizeRef(rawReading2Ref), text: cleanText(reading2Data.text) } : null,
        psalm:    psalmData   ? { reference: normalizeRef(rawPsalmRef),    text: formatPsalmEn(psalmStructure) || cleanText(psalmData.text) } : null,
        reflection: '',
      });
    }

    // Para español: todas las traducciones en paralelo
    const [gospelEs, reading1Es, reading2Es, psalmEs] = await Promise.all([
      getSpanishText(rawGospelRef),
      reading1Data ? getSpanishText(rawReading1Ref) : Promise.resolve(null),
      reading2Data ? getSpanishText(rawReading2Ref) : Promise.resolve(null),
      psalmData    ? getSpanishText(rawPsalmRef)    : Promise.resolve(null),
    ]);

    if (!gospelEs?.text) throw new Error('Spanish gospel text not found');

    const title = `Evangelio del ${day} de ${months[month - 1].charAt(0).toUpperCase() + months[month - 1].slice(1)} del ${year}`;

    return res.status(200).json({
      success: true,
      reading: title,
      reference: gospelEs.reference || normalizeRef(rawGospelRef),
      text: `Evangelio del día\nLectura del santo Evangelio según san ${gospelEs.reference || normalizeRef(rawGospelRef)}\n\n${gospelEs.text}`,
      reading1: reading1Es
        ? { reference: reading1Es.reference || normalizeRef(rawReading1Ref), text: reading1Es.text }
        : (reading1Data ? { reference: null, text: null, referenceEn: normalizeRef(rawReading1Ref), textEn: cleanText(reading1Data.text) } : null),
      reading2: reading2Es
        ? { reference: reading2Es.reference || normalizeRef(rawReading2Ref), text: reading2Es.text }
        : (reading2Data ? { reference: null, text: null, referenceEn: normalizeRef(rawReading2Ref), textEn: cleanText(reading2Data.text) } : null),
      psalm: psalmEs
        ? { reference: psalmEs.reference || normalizeRef(rawPsalmRef), text: formatPsalmEs(psalmStructure, psalmEs.text) || psalmEs.text }
        : (psalmData ? { reference: null, text: null, referenceEn: normalizeRef(rawPsalmRef), textEn: formatPsalmEn(psalmStructure) || cleanText(psalmData.text) } : null),
      reflection: '',
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
