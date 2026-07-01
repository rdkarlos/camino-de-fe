import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

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

async function cleanOldReflections(today) {
  try {
    const snapshot = await getDocs(collection(db, 'reflexiones'));
    const deletions = [];
    snapshot.forEach((docSnap) => {
      if (!docSnap.id.startsWith(today)) {
        deletions.push(deleteDoc(doc(db, 'reflexiones', docSnap.id)));
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
        max_tokens: 1000,
        system: `Eres un guía espiritual católico sabio y compasivo. Basándote en el evangelio del día, das exactamente 2 reflexiones prácticas y espirituales para aplicar en la vida diaria. Cada reflexión debe tener:\n- Un título corto en negrita\n- 3-4 líneas de texto profundo y cálido\nResponde siempre en el idioma del usuario. Tus respuestas son inspiradoras, concretas y cercanas. Máximo 250 palabras en total.\nIf lang is 'en', respond in English. If lang is 'es', respond in Spanish. The lang parameter for this request is: ${lang}.`,
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

    const now = new Date();
    const colombiaOffset = -5 * 60;
    const colombiaTime = new Date(now.getTime() + (colombiaOffset - now.getTimezoneOffset()) * 60000);
    const today = colombiaTime.toISOString().split('T')[0];
    await cleanOldReflections(today);

    return res.status(200).json({ text: data.content?.[0]?.text ?? '' });
  } catch (error) {
    console.error('[spiritual-guide] exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
