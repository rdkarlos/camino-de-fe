export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    
    // Intentar con hoy y mañana por diferencia de zona horaria
    const dates = [new Date(), new Date()];
    dates[1].setDate(dates[0].getDate() - 1);
    
    const patterns = dates.map(d => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return { pattern: `${parseInt(day)}-de-${month}-del-${year}`, day, month, year };
    });

    const rssResponse = await fetch('https://www.cec.org.co/rss.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const rssText = await rssResponse.text();

    let articleUrl = null;
    let matchedDate = null;

    for (const { pattern, day, month, year } of patterns) {
      const match = rssText.match(new RegExp(`<link>.*?(https://www\\.cec\\.org\\.co/evangelio-diario/${pattern}[^<]+)</link>`));
      if (match) {
        articleUrl = match[1];
        matchedDate = { day, month, year };
        break;
      }
    }

    if (!articleUrl) {
      return res.status(404).json({ success: false, error: 'No se encontró enlace', patterns: patterns.map(p => p.pattern) });
    }

    const articleResponse = await fetch(articleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const articleHtml = await articleResponse.text();

    const schemaMatch = articleHtml.match(/property="schema:text">([\s\S]*?)<\/div>/);
    const text = schemaMatch
      ? schemaMatch[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
      : null;

    const gospelStart = text ? text.indexOf('Lectura del santo') : -1;
    const gospelText = gospelStart > -1 ? text.substring(gospelStart).trim() : text;

    const { day, month, year } = matchedDate;
    const title = `Evangelio del ${parseInt(day)} de ${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`;

    if (gospelText) {
      res.status(200).json({ success: true, reading: title, reference: title, text: gospelText });
    } else {
      res.status(404).json({ success: false, error: 'No se encontró texto', url: articleUrl });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}