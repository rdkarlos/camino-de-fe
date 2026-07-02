import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOZMcPE-9T3E8PtrIvXn4DoqgWG0J9Db0",
  authDomain: "camino-de-fe-4d9c2.firebaseapp.com",
  projectId: "camino-de-fe-4d9c2",
  storageBucket: "camino-de-fe-4d9c2.firebasestorage.app",
  messagingSenderId: "1067905510058",
  appId: "1:1067905510058:web:e68d01c447a0e84c48fed3",
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function getGospel(baseUrl, lang, day, month, year) {
  const url = `${baseUrl}/api/gospel?lang=${lang}&day=${day}&month=${month}&year=${year}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.success) throw new Error(`Gospel fetch failed (${lang}): ${data.error || 'unknown'}`);
  return data;
}

async function generateReflection(gospelRef, gospelText, lang) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  const userMessage = lang === 'en'
    ? `Today's gospel is: ${gospelRef}. ${gospelText}. Give me 3 practical spiritual reflections to apply today.`
    : `El evangelio de hoy es: ${gospelRef}. ${gospelText}. Dame 3 reflexiones espirituales prácticas para aplicar hoy.`;

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
      system: `You are a wise and compassionate Catholic spiritual guide. Based on today's gospel, provide exactly 3 short spiritual reflections to apply in daily life. Each reflection must have:\n- A short bold title\n- 2-3 sentences of warm, practical, and inspiring text\nAlways respond in the language of the user: if the request is in Spanish, respond in Spanish; if in English, respond in English.\nKeep the total response under 250 words. Do not add introductions or conclusions. The current language is: ${lang}.`,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  const rawData = await response.text();
  if (!response.ok) throw new Error(`Anthropic API error (${lang}): ${rawData}`);
  const data = JSON.parse(rawData);
  return data.content?.[0]?.text ?? '';
}

async function cleanOldReflections(today) {
  const snapshot = await getDocs(collection(db, 'reflexiones'));
  const deletions = [];
  snapshot.forEach((docSnap) => {
    if (!docSnap.id.startsWith(today)) {
      deletions.push(deleteDoc(doc(db, 'reflexiones', docSnap.id)));
    }
  });
  await Promise.all(deletions);
}

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ success: false, error: 'API key not configured' });
  }

  try {
    // Fecha de hoy en zona horaria Colombia (UTC-5)
    const now = new Date();
    const colombiaOffset = -5 * 60;
    const colombiaTime = new Date(now.getTime() + (colombiaOffset - now.getTimezoneOffset()) * 60000);
    const today = colombiaTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const [year, month, day] = today.split('-').map(Number);

    const idEs = `${today}_es`;
    const idEn = `${today}_en`;

    const [existingEs, existingEn] = await Promise.all([
      getDoc(doc(db, 'reflexiones', idEs)),
      getDoc(doc(db, 'reflexiones', idEn)),
    ]);

    if (existingEs.exists() && existingEn.exists()) {
      await cleanOldReflections(today);
      return res.status(200).json({ success: true, message: 'La reflexión de hoy ya existía, no se generó de nuevo' });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    if (!existingEs.exists()) {
      const gospelEs = await getGospel(baseUrl, 'es', day, month, year);
      const textoEs = await generateReflection(gospelEs.reference, gospelEs.text, 'es');
      await setDoc(doc(db, 'reflexiones', idEs), {
        texto: textoEs, fecha: today, evangelio: gospelEs.reference || '',
      });
    }

    if (!existingEn.exists()) {
      const gospelEn = await getGospel(baseUrl, 'en', day, month, year);
      const textoEn = await generateReflection(gospelEn.reference, gospelEn.text, 'en');
      await setDoc(doc(db, 'reflexiones', idEn), {
        texto: textoEn, fecha: today, evangelio: gospelEn.reference || '',
      });
    }

    await cleanOldReflections(today);

    return res.status(200).json({ success: true, message: 'Reflexión generada' });
  } catch (error) {
    console.error('[cron-reflexion] error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
