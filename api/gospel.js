export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const SCRAPER_KEY = 'b4dea50274bd1073b1e0b224ebb8a218';
  const usccbUrl = 'https://bible.usccb.org/bible/readings';
  const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(usccbUrl)}&render=false&cache_bust=${Date.now()}`;
  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();
    const gospelIdx = html.indexOf('Gospel');
    return res.status(200).json({ 
      success: true, 
      htmlLength: html.length,
      gospelIdx,
      sample: html.substring(gospelIdx - 100, gospelIdx + 500)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}