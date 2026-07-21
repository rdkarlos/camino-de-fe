// Diagnóstico de solo lectura — lista los círculos públicos existentes hoy en
// producción, con su creador. No modifica nada. Mismo patrón de conexión que
// seed-parroquias.mjs (firebase-admin, salta las reglas de seguridad).
//
// Uso (PowerShell), desde la raíz del repo:
//   $env:FIREBASE_SERVICE_ACCOUNT_BASE64 = "<el mismo valor que en Vercel>"
//   node list-public-circles.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT_BASE64 en el entorno.');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const snap = await db.collection('circulos').where('tipo', '==', 'publico').get();

if (snap.empty) {
  console.log('No hay ningún círculo público en la base de datos.');
  process.exit(0);
}

console.log(`${snap.size} círculo(s) público(s) encontrados:\n`);
for (const doc of snap.docs) {
  const d = doc.data();
  const fecha = d.fechaCreacion?.toDate?.() ?? d.fechaCreacion ?? '(sin fecha)';
  console.log(`- "${d.nombre}" (id: ${doc.id})`);
  console.log(`  Creador: ${d.creadorNombre || '(sin nombre)'} — uid ${d.creadorId}`);
  console.log(`  Miembros: ${(d.miembros || []).length}`);
  console.log(`  Creado: ${fecha}`);
  console.log('');
}
