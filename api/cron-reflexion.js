import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Cuenta de servicio de Firebase Admin — nunca se sube al repo, viaja
// codificada en base64 en la variable de entorno de Vercel. El SDK admin
// se salta las reglas de seguridad de Firestore (es de confianza, corre en
// el servidor), así que las reglas de cliente quedan intactas.
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);
const firebaseApp = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
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

async function generateVerse(gospelText) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  const userMessage = `Based on today's gospel: ${gospelText}, suggest ONE Bible verse (not from the same passage) that complements the message. Respond ONLY in this exact JSON format: {"texto": "verse text here", "referencia": "Book Chapter, Verse"}. No other text.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  const rawData = await response.text();
  if (!response.ok) throw new Error(`Anthropic API error (verse): ${rawData}`);
  const data = JSON.parse(rawData);
  const text = data.content?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No se pudo parsear el versículo generado');
  const verse = JSON.parse(match[0]);
  if (!verse.texto || !verse.referencia) throw new Error('Versículo generado incompleto');
  return verse;
}

async function cleanOldReflections(today) {
  const snapshot = await db.collection('reflexiones').get();
  const deletions = [];
  snapshot.forEach((docSnap) => {
    if (!docSnap.id.startsWith(today)) {
      deletions.push(db.collection('reflexiones').doc(docSnap.id).delete());
    }
  });
  await Promise.all(deletions);
}

async function cleanOldVersiculos(today) {
  const snapshot = await db.collection('versiculos').get();
  const deletions = [];
  snapshot.forEach((docSnap) => {
    if (docSnap.id !== today) {
      deletions.push(db.collection('versiculos').doc(docSnap.id).delete());
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
    // Fecha de hoy en zona horaria Colombia (independiente del huso horario del servidor)
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date()); // YYYY-MM-DD
    const [year, month, day] = today.split('-').map(Number);

    const idEs = `${today}_es`;
    const idEn = `${today}_en`;

    const [existingEs, existingEn, existingVerse] = await Promise.all([
      db.collection('reflexiones').doc(idEs).get(),
      db.collection('reflexiones').doc(idEn).get(),
      db.collection('versiculos').doc(today).get(),
    ]);

    // Nota: en el SDK admin, "exists" es una propiedad, no una función
    // (a diferencia del SDK de cliente que reemplaza) — ojo si se vuelve a tocar esto.
    if (existingEs.exists && existingEn.exists && existingVerse.exists) {
      await Promise.all([cleanOldReflections(today), cleanOldVersiculos(today)]);
      return res.status(200).json({ success: true, message: 'La reflexión de hoy ya existía, no se generó de nuevo' });
    }

    const baseUrl = process.env.SITE_URL || 'https://camino-de-fe-seven.vercel.app';

    let gospelEs = null;
    if (!existingEs.exists || !existingVerse.exists) {
      gospelEs = await getGospel(baseUrl, 'es', day, month, year);
    }

    if (!existingEs.exists) {
      const textoEs = await generateReflection(gospelEs.reference, gospelEs.text, 'es');
      await db.collection('reflexiones').doc(idEs).set({
        texto: textoEs, fecha: today, evangelio: gospelEs.reference || '',
      });
    }

    if (!existingEn.exists) {
      const gospelEn = await getGospel(baseUrl, 'en', day, month, year);
      const textoEn = await generateReflection(gospelEn.reference, gospelEn.text, 'en');
      await db.collection('reflexiones').doc(idEn).set({
        texto: textoEn, fecha: today, evangelio: gospelEn.reference || '',
      });
    }

    if (!existingVerse.exists) {
      const verse = await generateVerse(gospelEs.text);
      await db.collection('versiculos').doc(today).set({
        texto: verse.texto, referencia: verse.referencia, fecha: today,
      });
    }

    await Promise.all([cleanOldReflections(today), cleanOldVersiculos(today)]);

    return res.status(200).json({ success: true, message: 'Reflexión y versículo generados' });
  } catch (error) {
    console.error('[cron-reflexion] error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
