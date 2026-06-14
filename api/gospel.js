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

      // Extraer el texto del evangelio
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

// Extraer solo el Evangelio
const gospelStart = rawText.indexOf('Evangelio del día');
const gospelEnd = rawText.indexOf('Reciba el Evangelio');
const text = gospelStart > -1 
  ? rawText.substring(gospelStart, gospelEnd > -1 ? gospelEnd : undefined).trim()
  : rawText;

// Extraer reflexión
const reflectionStart = rawText.indexOf('Reflexión del Evangelio de hoy');
const reflectionEnd = rawText.indexOf('Evangelio de hoy en vídeo');
const reflection = reflectionStart > -1
  ? rawText.substring(reflectionStart + 'Reflexión del Evangelio de hoy'.length, reflectionEnd > -1 ? reflectionEnd : undefined).trim()
  : '';

      if (text.length < 100) continue;

      const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const title = `Evangelio del ${day} de ${months[date.getMonth()].charAt(0).toUpperCase() + months[date.getMonth()].slice(1)} del ${year}`;

      return res.status(200).json({ 
  success: true, 
  reading: title, 
  reference: title, 
  text: gospelText,
  reflection,
  url
});

    } catch (error) {
      continue;
    }
  }

  res.status(404).json({ success: false, error: 'No se pudo obtener el evangelio' });
}