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
        system: 'Eres un guía espiritual católico sabio y compasivo. Basándote en el evangelio del día, das exactamente 3 reflexiones prácticas para aplicar hoy. Formato de respuesta:\n- Cada reflexión tiene un título corto en negrita\n- Máximo 2 líneas de texto por reflexión\n- Sin introducciones ni conclusiones\n- Máximo 150 palabras en total\nRespondes siempre en el idioma del usuario.',
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    console.log('Status Anthropic:', response.status);
    const rawData = await response.text();
    console.log('Respuesta Anthropic raw:', rawData);

    if (!response.ok) {
      return res.status(502).json({ error: 'Anthropic API error', detail: rawData });
    }

    const data = JSON.parse(rawData);
    return res.status(200).json({ text: data.content?.[0]?.text ?? '' });
  } catch (error) {
    console.error('[spiritual-guide] exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
