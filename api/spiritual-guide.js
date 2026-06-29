export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { gospelRef, gospelText, lang } = req.body;
  if (!gospelText) return res.status(400).json({ error: 'Gospel text required' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const userMessage = lang === 'en'
    ? `Today's gospel is: ${gospelRef}. ${gospelText}. Give me 3 practical spiritual reflections to apply today.`
    : `El evangelio de hoy es: ${gospelRef}. ${gospelText}. Dame 3 reflexiones espirituales prácticas para aplicar hoy.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: 'Eres un guía espiritual católico sabio y compasivo. Basándote en el evangelio del día, das 3 reflexiones prácticas y espirituales breves para aplicar en la vida diaria. Respondes siempre en el idioma del usuario. Tus respuestas son cálidas, profundas y accesibles. Máximo 200 palabras.',
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[spiritual-guide] Anthropic error:', err);
      return res.status(502).json({ error: 'Anthropic API error' });
    }

    const data = await response.json();
    return res.status(200).json({ text: data.content?.[0]?.text ?? '' });
  } catch (error) {
    console.error('[spiritual-guide] exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
