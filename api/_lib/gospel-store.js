// Caché por fecha y entrada manual de emergencia del Evangelio, en Firestore.
//   evangelio_cache/{YYYY-MM-DD}_{lang}  -> { fecha, lang, json, guardado }
//   evangelio_manual/{YYYY-MM-DD}        -> { evangelio: "Lc 12,35-38", lectura1?, lectura2?, salmo? }
// Todo es de mejor esfuerzo: si Firestore no está configurado o tarda, el
// endpoint sigue funcionando en vivo. Nunca se lee un documento de otra fecha.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const FIRESTORE_TIMEOUT_MS = 1500;

// Error completo (código gRPC, stack, causa) en los logs de Vercel. Solo
// e.message escondía la causa real: un respaldo que falla sin avisar no sirve.
const logError = (label, e) => console.error(`[gospel-store] ${label}:`, e?.code ?? '', e?.stack || e, e?.cause ?? '');

let db;
const getDb = () => {
  if (db !== undefined) return db;
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );
    const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore(app);
  } catch (e) {
    logError('Firestore no disponible (FIREBASE_SERVICE_ACCOUNT_BASE64 ausente o inválida)', e);
    db = null;
  }
  return db;
};

const withTimeout = (promise, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}: Firestore tardó más de ${FIRESTORE_TIMEOUT_MS} ms`)), FIRESTORE_TIMEOUT_MS)),
]);

const cacheId = (key, lang) => `${key}_${lang}`;

const readCache = async (key, lang) => {
  const firestore = getDb();
  if (!firestore) return null;
  try {
    const snap = await withTimeout(firestore.collection('evangelio_cache').doc(cacheId(key, lang)).get(), 'readCache');
    const d = snap.exists ? snap.data() : null;
    if (!d || d.fecha !== key || d.lang !== lang) return null;
    return JSON.parse(d.json);
  } catch (e) {
    logError('readCache', e);
    return null;
  }
};

const writeCache = async (key, lang, payload) => {
  const firestore = getDb();
  if (!firestore) return false;
  try {
    await withTimeout(firestore.collection('evangelio_cache').doc(cacheId(key, lang)).set({
      fecha: key, lang, json: JSON.stringify(payload), guardado: new Date().toISOString(),
    }), 'writeCache');
    console.log(`[gospel-store] writeCache ${cacheId(key, lang)}: guardado`);
    return true;
  } catch (e) {
    logError(`writeCache ${cacheId(key, lang)}`, e);
    return false;
  }
};

// ¿Ya está en caché el día completo (es y en)? Para que la precarga se salte lo ya guardado.
const hasCache = async (key) => {
  const firestore = getDb();
  if (!firestore) return false;
  try {
    const snaps = await withTimeout(Promise.all(
      ['es', 'en'].map((l) => firestore.collection('evangelio_cache').doc(cacheId(key, l)).get())
    ), 'hasCache');
    return snaps.every((s) => s.exists && s.data().fecha === key);
  } catch (e) {
    logError('hasCache', e);
    return false;
  }
};

const readManual = async (key) => {
  const firestore = getDb();
  if (!firestore) return null;
  try {
    const snap = await withTimeout(firestore.collection('evangelio_manual').doc(key).get(), 'readManual');
    return snap.exists ? snap.data() : null;
  } catch (e) {
    logError('readManual', e);
    return null;
  }
};

// Borra la caché de días anteriores a `todayKey` (YYYY-MM-DD). Las fechas en ISO
// se ordenan como texto, y el prefijo del id es la fecha.
const cleanOldCache = async (todayKey) => {
  const firestore = getDb();
  if (!firestore) return;
  try {
    const snap = await firestore.collection('evangelio_cache').get();
    await Promise.all(snap.docs.filter((d) => d.id.slice(0, 10) < todayKey).map((d) => d.ref.delete()));
  } catch (e) {
    logError('cleanOldCache', e);
  }
};

export { readCache, writeCache, hasCache, readManual, cleanOldCache };
