export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const usccbUrl = 'https://bible.usccb.org/bible/readings';
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(usccbUrl)}&render=false`;
  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();
    const gospelIdx = html.indexOf('<h3 class="name">Gospel</h3>');
    const htmlAfter = html.substring(gospelIdx, gospelIdx + 2000);
    return res.status(200).json({ success: true, gospelIdx, sample: htmlAfter });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
