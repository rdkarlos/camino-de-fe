import { dateKey, fetchUniversalisDay, buildEn, buildEs, buildEsManual } from './_lib/gospel-core.js';
import { readCache, writeCache, readManual } from './_lib/gospel-store.js';

// Presupuesto total de la función: el usuario no debe esperar más que esto
// aunque Universalis esté caído (20 oct 2026: ni conecta). Universalis tiene
// su propio tope corto; BibleGet recibe lo que quede del presupuesto.
const BUDGET_MS = 6000;
const UNIVERSALIS_TIMEOUT_MS = 3000;

export default async function handler(req, res) {
  const startedAt = Date.now();
  const deadline = startedAt + BUDGET_MS;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  // "Hoy" en Colombia, no en UTC: la caché va por fecha y a partir de las 7 pm
  // colombianas el servidor (UTC) ya está en el día siguiente.
  const [todayY, todayM, todayD] = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
    .format(new Date()).split('-').map(Number);
  const day   = parseInt(req.query.day)   || todayD;
  const month = parseInt(req.query.month) || todayM;
  const year  = parseInt(req.query.year)  || todayY;
  const lang  = req.query.lang === 'en' ? 'en' : 'es';

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ success: false, error: 'Fecha inválida' });
  }
  const key = dateKey(year, month, day);

  const respond = (source, payload) => {
    res.setHeader('X-Gospel-Source', source);
    return res.status(200).json(payload);
  };

  let manualError = null;
  try {
    // 1) Entrada manual de emergencia (solo español: el inglés viene del feed)
    //    y 2) caché del día, leídas en paralelo. La manual gana si existe: es
    //    una orden explícita, y sirve también para corregir una caché mala.
    const [manual, cached] = await Promise.all([
      lang === 'es' ? readManual(key) : null,
      readCache(key, lang),
    ]);

    if (manual) {
      try {
        return respond('manual', await buildEsManual(manual, { day, month, year, deadline }));
      } catch (e) {
        manualError = e.message;
        console.error('[gospel] entrada manual inválida:', e.message);
      }
    }

    if (cached?.success) return respond('cache', cached);

    // 3) En vivo. Sin caché del día no se sirve nada de otra fecha: si falla, error.
    const data = await fetchUniversalisDay(year, month, day, UNIVERSALIS_TIMEOUT_MS);
    const en = buildEn(data);
    const writes = [writeCache(key, 'en', en)];
    let payload = en;
    if (lang === 'es') {
      const { response, complete } = await buildEs(data, { day, month, year, deadline });
      payload = response;
      // Una respuesta con lecturas degradadas a inglés no se guarda: fijaría
      // el defecto todo el día. La precarga del cron la completará.
      if (complete) writes.push(writeCache(key, 'es', response));
    }
    await Promise.all(writes);
    return respond('live', payload);
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    const sinCache = `sin lectura guardada para ${key}`;
    const detail = manualError ? ` | entrada manual: ${manualError}` : '';
    return res.status(500).json({ success: false, error: `${error.message} — ${sinCache}${detail}` });
  }
}
