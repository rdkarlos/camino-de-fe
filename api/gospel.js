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
    const response = await fetch(scraperUrl);
    const html = await response.text();
    const rawText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
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

    // Buscar directamente "Lectura del santo evangelio" que es el inicio real
    const gospelMarkers = [
      'Lectura del santo evangelio según san ',
      'Lectura del santo Evangelio según san ',
    ];
    
    let gospelStart = -1;
    for (const marker of gospelMarkers) {
      const idx = rawText.lastIndexOf(marker);
      if (idx > -1) {
        gospelStart = idx;
        break;
      }
    }

    if (gospelStart === -1) {
      return res.status(404).json({ success: false, error: 'No se encontró el evangelio' });
    }

    const endMarkers = ['Descargar en PDF', 'Podcast', 'Reciba el Evangelio', 'Los dominicos'];
    let gospelEnd = -1;
    for (const marker of endMarkers) {
      const idx = rawText.indexOf(marker, gospelStart);
      if (idx > -1 && (gospelEnd === -1 || idx < gospelEnd)) {
        gospelEnd = idx;
      }
    }

    const text = rawText.substring(gospelStart, gospelEnd > -1 ? gospelEnd : gospelStart + 3000).trim();

    if (!text || text.length < 100) {
      return res.status(404).json({ success: false, error: 'Texto muy corto' });
    }

    const title = `Evangelio del ${day} de ${months[month-1].charAt(0).toUpperCase() + months[month-1].slice(1)} del ${year}`;
    return res.status(200).json({ success: true, reading: title, reference: title, text: 'Evangelio del día' + text, reflection: '', url: targetUrl });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}