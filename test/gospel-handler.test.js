import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

// Firestore simulado: el handler real de api/gospel.js, con un documento manual.
let manual = null;
mock.module('../api/_lib/gospel-store.js', {
  namedExports: {
    readManual: async () => manual,
    readCache: async () => null,
    writeCache: async () => true,
  },
});
const { default: handler } = await import('../api/gospel.js');

const verso = (chapter, v) => ({ book: 'Lucas', chapter, verse: v, text: `texto ${v}` });

const llamar = async (documento, bibleGet) => {
  manual = documento;
  const realFetch = globalThis.fetch;
  const realError = console.error;
  console.error = () => {};
  globalThis.fetch = async (url) => {
    const q = new URL(url).searchParams.get('query');
    const { body = {}, status = 200 } = bibleGet[q] ?? {};
    return new Response(JSON.stringify(body), { status });
  };
  const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; }, status(c) { this.code = c; return this; }, json(b) { this.body = b; } };
  try {
    await handler({ query: { lang: 'es', day: '7', month: '11', year: '2026' } }, res);
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
  }
  return { code: res.code, headers, body: res.body };
};

const gospel = { body: { results: [verso(15, 1), verso(15, 2), verso(15, 3)], errors: [] } };

test('handler: con una lectura omitida responde 200 con omitted y X-Gospel-Omitted', async () => {
  const r = await llamar(
    { evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3', salmo: 'Sal 111,1-2' },
    { 'Lc15,1-3': gospel, 'Is55,1-3': { body: {}, status: 503 }, 'Sal111,1-2': { body: { results: [], errors: [{ error: 'x' }] } } }
  );
  assert.equal(r.code, 200);
  assert.equal(r.headers['X-Gospel-Source'], 'manual');
  assert.equal(r.headers['X-Gospel-Omitted'], 'lectura1,salmo');
  assert.deepEqual(r.body.omitted.map((o) => o.field).sort(), ['lectura1', 'salmo']);
  assert.equal(r.body.reference, 'Lucas 15:1-3');
});

test('handler: sin lecturas omitidas no hay cabecera X-Gospel-Omitted ni omitted', async () => {
  const r = await llamar({ evangelio: 'Lc 15,1-3' }, { 'Lc15,1-3': gospel });
  assert.equal(r.code, 200);
  assert.equal('X-Gospel-Omitted' in r.headers, false);
  assert.equal('omitted' in r.body, false);
});
