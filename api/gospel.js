export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const targetUrl = `https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/lecturas/`;
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(targetUrl)}&render=false`;
  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();
    const classes = html.match(/class="([^"]{5,30})"/g) || [];
    const unique = [...new Set(classes)].slice(0, 30);
    return res.status(200).json({ success: true, classes: unique, htmlLength: html.length, sample: html.substring(0, 500) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
