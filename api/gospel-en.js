export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const targetUrl = 'https://bible.usccb.org/bible/readings';
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(targetUrl)}&render=false`;

  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();

    // Encontrar la sección del Evangelio
    const gospelIdx = html.indexOf('<h3 class="name">Gospel</h3>');
    if (gospelIdx === -1) {
      return res.status(404).json({ success: false, error: 'Gospel section not found' });
    }

    const htmlAfterGospel = html.substring(gospelIdx);

    // Extraer referencia
    const refMatch = htmlAfterGospel.match(/<h3[^>]*class="[^"]*citation[^"]*"[^>]*>([\s\S]*?)<\/h3>/i) ||
                     htmlAfterGospel.match(/<div[^>]*class="content-header"[^>]*>([\s\S]*?)<\/div>/i);
    const reference = refMatch
      ? refMatch[1].replace(/<[^>]*>/g, '').trim()
      : 'Gospel of the Day';

    // Extraer texto
    const bodyMatch = htmlAfterGospel.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    if (!bodyMatch) {
      return res.status(404).json({ success: false, error: 'Gospel text not found' });
    }

    const text = bodyMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (text.length < 50) {
      return res.status(404).json({ success: false, error: 'Text too short' });
    }

    return res.status(200).json({ success: true, reference, text, reflection: '' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}