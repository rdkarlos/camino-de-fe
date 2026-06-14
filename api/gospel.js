export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const dates = [new Date(), new Date()];
  dates[1].setDate(dates[0].getDate() - 1);

  for (const date of dates) {
    try {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const url = `https://www.dominicos.org/predicacion/evangelio-del-dia/${day}-${month}-${year}/`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'es-ES,es;q=0.9',
        }
      });

      if (!response.ok) continue;

      const html = await response.text();

      const bodyMatch = html.match(/<div[^>]*class="contenido-dia"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
      if (!bodyMatch) continue;

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

      if (rawText.length < 100) continue;

      // Extraer evangelio
      const gospelStart = rawText.indexOf('Evangelio del día');
      }