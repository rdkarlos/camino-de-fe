export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const targetUrl = 'https://bible.usccb.org/bible/readings';
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(targetUrl)}&render=false`;

  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();

    // Extraer el texto del content-body
    const bodyMatch = html.match(/<div[^>]*class="content-body"[^>]*>([\s\S]*?)<\/div>/i);
    if (!bodyMatch) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    const rawText = bodyMatch[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (rawText.length < 50) {
      return res.status(404).json({ success: false, error: 'Text too short' });
    }

    // Extraer referencia del título
    const titleMatch = html.match(/<h3[^>]*class="[^"]*content-header[^"]*"[^>]*>([\s\S]*?)<\/h3>/i) ||
                       html.match(/<div[^>]*class="content-header"[^>]*>([\s\S]*?)<\/div>/i);
    const reference = titleMatch 
      ? titleMatch[1].replace(/<[^>]*>/g, '').trim() 
      : 'Gospel of the Day';

    return res.status(200).json({ success: true, reference, text: rawText, reflection: '' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}