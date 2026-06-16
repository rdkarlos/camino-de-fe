export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const lang = req.query.lang || 'es';

  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';
  const BIBLE_ID = 'e3f420b9665abaeb-01';

  try {
    const usccbUrl = 'https://bible.usccb.org/bible/readings';
    const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(usccbUrl)}&render=false&cache_bust=${Date.now()}`;
    const usccbResponse = await fetch(scraperUrl);
    const html = await usccbResponse.text();

    const gospelIdx = html.indexOf('<h3 class="name">Gospel</h3>');
    if (gospelIdx === -1) throw new Error('Gospel section not found');
    const htmlAfter = html.substring(gospelIdx, gospelIdx + 3000);

    // Extraer referencia desde <div class="address"><a href="...">Matthew 9:36—10:8</a>
    const refMatch = htmlAfter.match(/class="address"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    const rawRef = refMatch ? refMatch[1].replace(/<[^>]*>/g, '').trim() : null;
    if (!rawRef) throw new Error('Reference not found');

    // Extraer texto en inglés
    const bodyMatch = htmlAfter.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    const enText = bodyMatch ? bodyMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/\s+\n/g, '\n')
      .trim() : null;

    if (lang === 'en') {
      return res.status(200).json({
        success: true,
        reading: `Gospel - ${rawRef}`,
        reference: rawRef,
        text: enText || 'Gospel text not available',
        reflection: '',
      });
    }

    // Para español: convertir "Matthew 9:36—10:8" a "MAT.9.36-MAT.10.8"
    const bookMap = {
      'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
      'Mt': 'MAT', 'Mk': 'MRK', 'Lk': 'LUK', 'Jn': 'JHN',
    };

    const refParsed = rawRef.match(/(\w+)\s+(\d+):(\d+)[—\-–]+(\d+)?:?(\d+)?/);
    if (!refParsed) throw new Error('Could not parse: ' + rawRef);

    const book = bookMap[refParsed[1]] || 'MAT';
    const ch1 = refParsed[2];
    const v1 = refParsed[3];
    const ch2 = refParsed[4] || ch1;
    const v2 = refParsed[5] || v1;
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
      reflection: '',
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}