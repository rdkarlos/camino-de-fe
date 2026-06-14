export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  
  // Probar con hoy y ayer por zona horaria UTC
  const dates = [new Date(), new Date()];
  dates[1].setDate(dates[0].getDate() - 1);

  for (const date of dates) {
    try {
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      // Buscar en Google el enlace del evangelio de hoy
      const searchUrl = `https://www.cec.org.co/evangelio-diario/${day}-de-${month}-del-${year}`;
      
      const articleResponse = await fetch(searchUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
          'Accept-Language': 'es-CO,es;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      });

      if (!articleResponse.ok) continue;

      const articleHtml = await articleResponse.text();
      
      const schemaMatch = articleHtml.match(/property="schema:text">([\s\S]*?)<\/div>/);
      if (!schemaMatch) continue;

      const text = schemaMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const gospelStart = text.indexOf('Lectura del santo');
      const gospelText = gospelStart > -1 ? text.substring(gospelStart).trim() : text;

      if (!gospelText) continue;

      const title = `Evangelio del ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`;

      return res.status(200).json({ 
        success: true, 
        reading: title, 
        reference: title, 
        text: gospelText,
        url: searchUrl
      });

    } catch (error) {
      continue;
    }
  }

  res.status(404).json({ success: false, error: 'No se pudo obtener el evangelio' });
}