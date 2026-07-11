import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Cuenta de servicio de Firebase Admin — misma variable que usa cron-reflexion.js,
// nunca se sube al repo. Se salta las reglas de Firestore (SDK de confianza,
// corre en el servidor), así que las reglas de cliente quedan intactas.
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);
const firebaseApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(firebaseApp);

async function cleanOldReflections(today) {
  try {
    const snapshot = await db.collection('reflexiones').get();
    const deletions = [];
    snapshot.forEach((docSnap) => {
      if (!docSnap.id.startsWith(today)) {
        deletions.push(db.collection('reflexiones').doc(docSnap.id).delete());
      }
    });
    await Promise.all(deletions);
  } catch (e) {
    console.error('[spiritual-guide] cleanup error:', e.message);
  }
}

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
    ? `Today's gospel is: ${gospelRef}. ${gospelText}. As a Catholic priest, give me 2 practical tips I can put into practice today.`
    : `El evangelio de hoy es: ${gospelRef}. ${gospelText}. Como sacerdote católico, dame 2 tips prácticos que pueda poner en práctica hoy.`;

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
        max_tokens: 1000,
        system: `You are a Catholic priest, warm and pastoral. Based on today's gospel, give exactly 2 practical tips that the faithful can apply TODAY in their daily life. Each tip must have a short bold title, be 2-3 sentences maximum, end with ONE concrete action the person can do today, and sound like advice from a priest in a homily. Use "we" and "let us" to be inclusive. Respond ONLY in the language of the lang parameter: "es" = Spanish, "en" = English. Format: **Title** followed by text ending with a practical action. Maximum 200 words. No introduction, no conclusion, only the 2 tips. The lang parameter for this request is: ${lang}.`,
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

    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
    await cleanOldReflections(today);

    return res.status(200).json({ text: data.content?.[0]?.text ?? '' });
  } catch (error) {
    console.error('[spiritual-guide] exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
