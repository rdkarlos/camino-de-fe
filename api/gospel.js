export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
  
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const lang = req.query.lang || 'es';

  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';
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

const parseRef = (rawRef) => {
  if (!rawRef) return null;
  
  // Limpiar la referencia - tomar solo el primer rango
  // "Lamentations 2:2, 10-14, 18-19" → "Lamentations 2:2-19"
  const bookMatch = rawRef.match(/^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+):(\d+)/);
  if (!bookMatch) return null;
  
  const bookName = bookMatch[1].trim();
  const bookCode = bookMap[bookName];
  if (!bookCode) return null;

  const ch1 = bookMatch[2];
  const v1 = bookMatch[3];

  // Buscar el último número para el versículo final
  const allNums = rawRef.match(/\d+/g) || [];
  const lastNum = allNums[allNums.length - 1];
  
  // Verificar si hay cambio de capítulo
  const chapterChange = rawRef.match(/(\d+):(\d+)[—\-–]+(\d+):(\d+)/);
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
        headers: { 'api-key': API_KEY, 'Accept': 'application/json' }
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

  const cleanText = (html) => html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Finds the first <h3> whose text content contains `keyword` (case-insensitive)
  const findH3Index = (html, keyword) => {
    const re = new RegExp(`<h3[^>]*>[^<]*${keyword}[^<]*<\/h3>`, 'i');
    const m = re.exec(html);
    return m ? m.index : -1;
  };

  const extractSection = (html, keyword) => {
    const idx = findH3Index(html, keyword);
    if (idx === -1) return null;
    const section = html.substring(idx, idx + 3000);
    const refMatch = section.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    const reference = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    const bodyMatch = section.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    const text = bodyMatch ? cleanText(bodyMatch[1]) : '';
    return { reference, text };
  };

  const fetchHtml = async (url, render = false) => {
    const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(url)}&render=${render}`;
    const res = await fetch(scraperUrl);
    return res.text();
  };

  try {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yy = String(year).slice(-2);
    const baseUrl = `https://bible.usccb.org/bible/readings/${mm}${dd}${yy}`;

    // Intento rápido sin renderizado JS
    let html = await fetchHtml(baseUrl, false);

    // Si no encontró el Evangelio, reintenta con render completo (solemnidades/fiestas)
    if (findH3Index(html, 'Gospel') === -1) {
      html = await fetchHtml(baseUrl, true);
    }

    // Si aún no hay Evangelio, prueba la variante "-Day" con render completo
    if (findH3Index(html, 'Gospel') === -1) {
      html = await fetchHtml(`${baseUrl}-Day`, true);
    }

    const reading1En = extractSection(html, 'Reading');
    const reading2En = (() => {
      // Find the second <h3> containing "Reading" by searching after the first match
      const re = new RegExp(`<h3[^>]*>[^<]*Reading[^<]*<\/h3>`, 'gi');
      let first = true;
      let m;
      while ((m = re.exec(html)) !== null) {
        if (first) { first = false; continue; }
        const section = html.substring(m.index, m.index + 3000);
        const refMatch = section.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
        const reference = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        const bodyMatch = section.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
        const text = bodyMatch ? cleanText(bodyMatch[1]) : '';
        return { reference, text };
      }
      return null;
    })();
    const psalmEn = extractSection(html, 'Psalm') || extractSection(html, 'Responsorial');

    const gospelIdx = findH3Index(html, 'Gospel');
    if (gospelIdx === -1) throw new Error('Gospel section not found');
    const htmlAfterGospel = html.substring(gospelIdx, gospelIdx + 3000);
    const refMatch = htmlAfterGospel.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    const rawRef = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : null;
    if (!rawRef) throw new Error('Reference not found');
    const bodyMatch = htmlAfterGospel.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    const enGospelText = bodyMatch ? cleanText(bodyMatch[1]) : null;

    if (lang === 'en') {
      return res.status(200).json({
        success: true,
        reading: `Gospel - ${rawRef}`,
        reference: rawRef,
        text: enGospelText || 'Gospel text not available',
        reading1: reading1En ? { reference: reading1En.reference, text: reading1En.text } : null,
        reading2: reading2En ? { reference: reading2En.reference, text: reading2En.text } : null,
        psalm: psalmEn ? { reference: psalmEn.reference, text: psalmEn.text } : null,
        reflection: '',
      });
    }

    // Para español: obtener todos los textos en paralelo
    const [gospelEs, reading1Es, reading2Es, psalmEs] = await Promise.all([
      getSpanishText(rawRef),
      reading1En ? getSpanishText(reading1En.reference) : Promise.resolve(null),
      reading2En ? getSpanishText(reading2En.reference) : Promise.resolve(null),
      psalmEn ? getSpanishText(psalmEn.reference) : Promise.resolve(null),
    ]);

    if (!gospelEs?.text) throw new Error('Spanish gospel text not found');

    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;
    return res.status(200).json({
      success: true,
      reading: title,
      reference: gospelEs.reference || rawRef,
      text: `Evangelio del día\nLectura del santo Evangelio según san ${gospelEs.reference || rawRef}\n\n${gospelEs.text}`,
      reading1: reading1Es ? { reference: reading1Es.reference || reading1En?.reference, text: reading1Es.text } : (reading1En ? { reference: reading1En.reference, text: reading1En.text } : null),
      reading2: reading2Es ? { reference: reading2Es.reference || reading2En?.reference, text: reading2Es.text } : (reading2En ? { reference: reading2En.reference, text: reading2En.text } : null),
      psalm: psalmEs ? { reference: psalmEs.reference || psalmEn?.reference, text: psalmEs.text } : (psalmEn ? { reference: psalmEn.reference, text: psalmEn.text } : null),
      reflection: '',
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
