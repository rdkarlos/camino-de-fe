export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const targetUrl = `https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/lecturas/`;
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(targetUrl)}&render=false`;
  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();
    const rawText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iacute;/g, 'í')
      .replace(/&oacute;/g, 'ó')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ntilde;/g, 'ñ')
      .replace(/\s+/g, ' ')
      .trim();
    const idx = rawText.indexOf('Evangelio de hoy y lecturas');
    return res.status(200).json({ success: true, idx, sample: rawText.substring(idx, idx + 3000) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}