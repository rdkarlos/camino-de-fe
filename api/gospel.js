export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const day = parseInt(req.query.day) || new Date().getDate();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  try {
    // Usar el feed RSS de Vatican News en español
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    
    const response = await fetch(
      `https://feeds.feedburner.com/vaticannews/spanish`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Feed no disponible');
    }

    const xml = await response.text();
    
    // Buscar item del evangelio del día
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    let gospelItem = null;
    
    for (const item of items) {
      if (item.toLowerCase().includes('evangelio') || item.toLowerCase().includes('gospel')) {
        gospelItem = item;
        break;
      }
    }

    if (!gospelItem) throw new Error('No se encontró evangelio');

    const titleMatch = gospelItem.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                       gospelItem.match(/<title>(.*?)<\/title>/);
    const descMatch = gospelItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                      gospelItem.match(/<description>([\s\S]*?)<\/description>/);

    const title = titleMatch ? titleMatch[1].trim() : `Evangelio del ${day} de ${months[month-1]} del ${year}`;
    const text = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';

    if (!text) throw new Error('Sin contenido');

    return res.status(200).json({ success: true, reading: title, reference: title, text, reflection: '', url: 'vaticannews' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}