export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const lang = req.query.lang || 'es';

  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';
  const BIBLE_ID = 'e3f420b9665abaeb-01';

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

  const extractSection = (html, sectionName) => {
    const idx = html.indexOf(`<h3 class="name">${sectionName}`);
    if (idx === -1) return null;
    const section = html.substring(idx, idx + 3000);
    const refMatch = section.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    const reference = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    const bodyMatch = section.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    const text = bodyMatch ? cleanText(bodyMatch[1]) : '';
    return { reference, text };
  };

  try {
    const usccbUrl = 'https://bible.usccb.org/bible/readings';
    const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(usccbUrl)}&render=false`;
    
    const usccbResponse = await fetch(scraperUrl);
    const html = await usccbResponse.text();

    const reading1 = extractSection(html, 'Reading 1') || extractSection(html, 'Reading I');
    const reading2 = extractSection(html, 'Reading 2') || extractSection(html, 'Reading II');
    const psalm = extractSection(html, 'Responsorial Psalm') || extractSection(html, 'Psalm');

    const gospelIdx = html.indexOf('<h3 class="name">Gospel');
    if (gospelIdx === -1) throw new Error('Gospel section not found');
    const htmlAfterGospel = html.substring(gospelIdx, gospelIdx + 3000);

    const refMatch = htmlAfterGospel.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    const rawRef = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : null;
    if (!rawRef) throw new Error('Reference not found');

    const bodyMatch = htmlAfterGospel.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    const enText = bodyMatch ? cleanText(bodyMatch[1]) : null;

    if (lang === 'en') {
      return res.status(200).json({
        success: true,
        reading: `Gospel - ${rawRef}`,
        reference: rawRef,
        text: enText || 'Gospel text not available',
        reading1: reading1 ? { reference: reading1.reference, text: reading1.text } : null,
        reading2: reading2 ? { reference: reading2.reference, text: reading2.text } : null,
        psalm: psalm ? { reference: psalm.reference, text: psalm.text } : null,
        reflection: '',
      });
    }

    const bookMap = {
      'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
      'Mt': 'MAT', 'Mk': 'MRK', 'Lk': 'LUK', 'Jn': 'JHN',
    };

    const refParsed = rawRef.match(/(\w+)\s+(\d+):(\d+)[—\-–]+(\d+)?:?(\d+)?/);
    if (!refParsed) throw new Error('Could not parse: ' + rawRef);

    const book = bookMap[refParsed[1]] || 'MAT';
    const ch1 = refParsed[2], v1 = refParsed[3];
    const hasChapter2 = refParsed[4] && refParsed[5];
    const ch2 = hasChapter2 ? refParsed[4] : ch1;
    const v2 = hasChapter2 ? refParsed[5] : refParsed[4] || v1;
    const passageId = `${book}.${ch1}.${v1}-${book}.${ch2}.${v2}`;

    const bibleUrl = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/passages/${passageId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`;
    const bibleResponse = await fetch(bibleUrl, {
      headers: { 'api-key': API_KEY, 'Accept': 'application/json' }
    });

    if (!bibleResponse.ok) throw new Error('API.Bible error: ' + bibleResponse.status);

    const bibleData = await bibleResponse.json();
    const esText = bibleData?.data?.content?.replace(/\s+/g, ' ').trim();
    const esRef = bibleData?.data?.reference || rawRef;
    if (!esText) throw new Error('Spanish text not found');

    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;
    return res.status(200).json({
      success: true,
      reading: title,
      reference: esRef,
      text: `Evangelio del día\nLectura del santo Evangelio según san ${esRef}\n\n${esText}`,
      reading1: reading1 ? { reference: reading1.reference, text: reading1.text } : null,
      reading2: reading2 ? { reference: reading2.reference, text: reading2.text } : null,
      psalm: psalm ? { reference: psalm.reference, text: psalm.text } : null,
      reflection: '',
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
