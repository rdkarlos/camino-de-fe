export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const API_KEY = '8z-olVvbUPzjg2OtXjSks';

  try {
    const response = await fetch(
      'https://api.scripture.api.bible/v1/bibles?language=spa',
      {
        headers: {
          'api-key': API_KEY,
          'Accept': 'application/json',
        }
      }
    );
    const data = await response.json();
    return res.status(200).json({ success: true, bibles: data.data.map(b => ({ id: b.id, name: b.name })) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}