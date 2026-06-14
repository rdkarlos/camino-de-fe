export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const targetUrl = `https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/lecturas/`;
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(targetUrl)}&render=false`;

  try {
    const response = await fetch(scraperUrl, {
      headers: { 'Accept': 'text/html' }
    });

    if (!response.ok) {
      return res.status(500).json({ success: false, error: `ScraperAPI error: ${response.status}` });
    }

    const html = await response.text();

    const bodyMatch = html.match(/<div[^>]*class="contenido-dia"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
    if (!bodyMatch) {
      return res.status(404).json({ success: false, error: 'Contenido no encontrado' });
    }

    const rawText = bodyMatch[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ntilde;/g, 'ñ')
      .replace(/\s+/g, ' ')
      .trim();

    if (rawText.length < 100) {
      return res.status(404).json({ success: false, error: 'Texto muy corto' });
    }

    const gospelStart = rawText.indexOf('Evangelio del día');
    const gospelEnd = rawText.indexOf('Reciba el Evangelio');
    const text = gospelStart > -1
      ? rawText.substring(gospelStart, gospelEnd > -1 ? gospelEnd : undefined).trim()
      : rawText;

    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;

    return res.status(200).json({
      success: true,
      reading: title,
      reference: title,
      text: text,
      reflection: '',
      url: targetUrl
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}