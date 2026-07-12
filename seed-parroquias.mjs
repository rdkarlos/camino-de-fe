// Carga inicial de la colección `parroquias` en Firestore.
// Usa firebase-admin (misma cuenta de servicio que api/cron-reflexion.js),
// así que se salta las reglas de seguridad — solo debe correrse a mano,
// nunca desde el cliente.
//
// Uso (PowerShell):
//   $env:FIREBASE_SERVICE_ACCOUNT_BASE64 = "<el mismo valor que en Vercel>"
//   node seed-parroquias.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT_BASE64 en el entorno. Configúrala antes de correr este script.');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const FUENTE = 'Directorio de la Diócesis de Zipaquirá';
const FUENTE_FECHA = '2026-07-12';

// Cada misa: { hora }, o { hora, lugar } cuando NO es en la iglesia principal.
const PARROQUIAS = [
  {
    id: 'virgen-del-rosario-calahorra',
    nombre: 'Parroquia La Virgen del Rosario de Calahorra',
    municipio: 'Cajicá',
    arciprestazgo: 'Jesucristo Sacerdote',
    direccion: 'Calle 7a Sur # 3-80, Cajicá, Cundinamarca',
    telefono: '3123286999',
    whatsapp: '3123286999',
    correo: 'pvirgendelrosario@diocesisdezipaquira.org',
    horarioMisas: {
      lunes: [{ hora: '6:00 a.m.' }],
      martes: [{ hora: '6:00 a.m.' }, { hora: '6:00 p.m.' }],
      miercoles: [{ hora: '6:00 a.m.' }, { hora: '6:00 p.m.' }],
      jueves: [{ hora: '6:00 a.m.' }, { hora: '6:00 p.m.' }],
      viernes: [{ hora: '6:00 a.m.' }, { hora: '6:00 p.m.' }],
      sabado: [{ hora: '6:00 p.m.' }],
      domingo: [{ hora: '8:00 a.m.' }, { hora: '10:00 a.m.' }, { hora: '12:00 m.' }, { hora: '6:00 p.m.' }],
    },
    horarioAtencion: 'Martes a viernes, 2:00 p.m. a 5:00 p.m.',
    fuente: FUENTE,
    fuenteFecha: FUENTE_FECHA,
  },
  {
    id: 'inmaculada-concepcion-cajica',
    nombre: 'Parroquia Inmaculada Concepción de Cajicá',
    municipio: 'Cajicá',
    // Arciprestazgo, dirección y teléfono/WhatsApp no vinieron en la fuente
    // para esta parroquia — se omiten en vez de inventarlos.
    correo: 'pinmaculadacajica@diocesisdezipaquira.org',
    horarioMisas: {
      lunes: [{ hora: '7:00 a.m.' }, { hora: '6:00 p.m.' }],
      martes: [{ hora: '7:00 a.m.' }, { hora: '6:00 p.m.' }],
      miercoles: [{ hora: '7:00 a.m.' }, { hora: '6:00 p.m.' }],
      jueves: [{ hora: '7:00 a.m.' }, { hora: '6:00 p.m.' }],
      viernes: [{ hora: '7:00 a.m.' }, { hora: '6:00 p.m.' }],
      sabado: [{ hora: '7:00 a.m.' }, { hora: '4:00 p.m.' }, { hora: '6:00 p.m.' }],
      domingo: [
        { hora: '6:00 a.m.' }, { hora: '7:00 a.m.' }, { hora: '10:00 a.m.' },
        { hora: '11:00 a.m.' }, { hora: '12:00 m.' }, { hora: '5:00 p.m.' }, { hora: '7:00 p.m.' },
      ],
    },
    horarioAtencion: 'Lunes a viernes 9:00 a.m. a 12:00 m. y 2:00 p.m. a 5:00 p.m. | Sábados 9:00 a.m. a 12:00 m.',
    fuente: FUENTE,
    fuenteFecha: FUENTE_FECHA,
  },
  {
    id: 'santisima-trinidad-cajica',
    nombre: 'Parroquia Santísima Trinidad de Cajicá',
    municipio: 'Cajicá',
    arciprestazgo: 'Jesucristo Sacerdote',
    vereda: 'Chuntame',
    // Dos teléfonos en la fuente, sin distinguir cuál es WhatsApp — se
    // guardan ambos en `telefono`, sin asumir que el segundo es WhatsApp.
    telefono: '6018661760, 3052787213',
    correo: 'psantisimatrinidad@diocesisdezipaquira.org',
    horarioMisas: {
      lunes: [{ hora: '7:00 a.m.' }],
      martes: [{ hora: '7:00 a.m.' }],
      miercoles: [{ hora: '7:00 a.m.' }],
      jueves: [{ hora: '7:00 a.m.' }],
      viernes: [{ hora: '7:00 a.m.' }],
      // Sábado: fuera de la iglesia principal — en el cementerio.
      sabado: [{ hora: '3:00 p.m.', lugar: 'Cementerio' }],
      // Domingo, reordenado cronológicamente respecto al orden de la fuente
      // (8, 11, 6pm, "y 9:30am") — mismo contenido, sin alterar horas ni lugar.
      domingo: [
        { hora: '8:00 a.m.' },
        { hora: '9:30 a.m.', lugar: 'Salón comunal de La Palma' },
        { hora: '11:00 a.m.' },
        { hora: '6:00 p.m.' },
      ],
    },
    horarioAtencion: 'Lunes a viernes 8:00 a.m. a 12:00 m. y 2:00 p.m. a 5:00 p.m.',
    fuente: FUENTE,
    fuenteFecha: FUENTE_FECHA,
  },
];

for (const { id, ...data } of PARROQUIAS) {
  await db.collection('parroquias').doc(id).set(data);
  console.log(`✓ ${id}`);
}

console.log(`Listo — ${PARROQUIAS.length} parroquias cargadas.`);
