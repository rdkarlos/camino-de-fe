export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const month = months[today.getMonth()];
    const year = today.getFullYear();

    // Buscar el evangelio de hoy en el feed RSS de la CEC
    const rssResponse = await fetch(
      'https://www.cec.org.co/rss.xml',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const rssText = await rssResponse.text();

    const datePattern = `${parseInt(day)}-de-${month}-del-${year}`;
    const linkMatch = rssText.match(new RegExp(`<link>.*?(https://www\\.cec\\.org\\.co/evangelio-diario/${datePattern}[^<]+)</link>`));

    if (!linkMatch) {
      return res.status(404).json({ success: false, error: 'No se encontró enlace', datePattern });
    }

    const articleUrl = linkMatch[1];
    const articleResponse = await fetch(articleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const articleHtml = await articleResponse.text();

const titleMatch = articleHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
let title = titleMatch ? titleMatch[1].trim() : 'Evangelio del día';
if (title === 'SISTEMA INFORMATIVO' || title.length < 5) {
  const dateStr = `${parseInt(day)} de ${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`;
  title = `Evangelio del ${dateStr}`;
}

    const schemaMatch = articleHtml.match(/property="schema:text">([\s\S]*?)<\/div>/);
    const text = schemaMatch
      ? schemaMatch[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
      : null;

    const gospelStart = text ? text.indexOf('Lectura del santo') : -1;
    const gospelText = gospelStart > -1 ? text.substring(gospelStart).trim() : text;

    if (gospelText) {
      res.status(200).json({ success: true, reading: title, reference: title, text: gospelText });
    } else {
      res.status(404).json({ success: false, error: 'No se encontró texto', url: articleUrl });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}