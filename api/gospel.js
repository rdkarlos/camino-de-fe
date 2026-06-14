export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const listResponse = await fetch(
      'https://www.cec.org.co/categorias-articulos/evangelio-diario',
      { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'es-CO,es;q=0.9',
        } 
      }
    );
    const listHtml = await listResponse.text();

    const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const month = months[today.getMonth()];
const year = today.getFullYear();
const datePattern = `${day}-de-${month}-del-${year}`;

const linkMatch = listHtml.match(new RegExp(`href="(\\/evangelio-diario\\/${datePattern}[^"]+)"`));
    if (!linkMatch) {
      return res.status(404).json({ success: false, error: 'No se encontró enlace' });
    }

    const articleUrl = 'https://www.cec.org.co' + linkMatch[1];

    const articleResponse = await fetch(articleUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    const articleHtml = await articleResponse.text();

    // Extraer título
    const titleMatch = articleHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Evangelio del día';

    // Extraer texto usando property="schema:text"
    const schemaMatch = articleHtml.match(/property="schema:text">([\s\S]*?)<\/div>/);
const rawText = schemaMatch 
  ? schemaMatch[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  : null;

if (rawText) {
  // Separar las partes: fecha+pasaje, frase resumen, lectura completa
  const lines = rawText.split(/(?<=\.)\s+/).filter(l => l.trim().length > 0);
  
  // Primera línea: fecha y referencia (ej: "13 Junio, Sábado. Lc 2, 41-51")
  const reference = lines.slice(0, 2).join(' ').trim();
  
  // Segunda parte: frase resumen (texto corto en cursiva)
  const summaryMatch = rawText.match(/\d+\s*&nbsp;.*?\.([^\.]{10,80})\./);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';
  
  // Texto completo del Evangelio
  const gospelStart = rawText.indexOf('Lectura del santo');
  const gospelText = gospelStart > -1 ? rawText.substring(gospelStart).trim() : rawText;

  res.status(200).json({ 
    success: true, 
    reading: title,
    reference,
    summary,
    text: gospelText
  });
    } else {
      res.status(404).json({ success: false, error: 'No se encontró texto', url: articleUrl });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}