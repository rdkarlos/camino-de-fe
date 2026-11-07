import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseManualRef, buildEsManual } from '../api/_lib/gospel-core.js';

test('parseManualRef: formato canónico', () => {
  assert.equal(parseManualRef('Lc 12,35-38'), 'Lc12,35-38');
  assert.equal(parseManualRef('Jn 3,16'), 'Jn3,16');
  assert.equal(parseManualRef('Mt 5,1-7,29'), 'Mt5,1-7,29');
  assert.equal(parseManualRef('1 Co 13,1-13'), '1Co13,1-13');
});

test('parseManualRef: espacios alrededor de coma y guion', () => {
  assert.equal(parseManualRef('Lc 16, 9-15'), 'Lc16,9-15');
  assert.equal(parseManualRef('Lc 16 , 9 - 15'), 'Lc16,9-15');
  assert.equal(parseManualRef('Lc 16,9 -15'), 'Lc16,9-15');
  assert.equal(parseManualRef('  Lc   16,9-15  '), 'Lc16,9-15');
  assert.equal(parseManualRef('Mt 5, 1 - 7 , 29'), 'Mt5,1-7,29');
  assert.equal(parseManualRef('1 Co 13 , 1 - 13'), '1Co13,1-13');
});

test('parseManualRef: el punto con espacios se normaliza; sin verso previo no es válido', () => {
  assert.equal(parseManualRef('Lc 16, 9 . 11'), 'Lc16,9.11');
  assert.equal(parseManualRef('Lc 16 . 9'), null);
});

test('parseManualRef: entradas inválidas', () => {
  for (const bad of [undefined, null, '', 'Lc', 'Lc 16', 'Lc 16,', '16,9', 'Lc 16,9-', 'Lc 16 9-15']) {
    assert.equal(parseManualRef(bad), null, String(bad));
  }
});

test('buildEsManual: el error muestra lo recibido y el formato esperado', async () => {
  await assert.rejects(
    buildEsManual({ evangelio: 'Lc dieciséis' }, { day: 7, month: 11, year: 2026, deadline: Date.now() + 1000 }),
    (e) => e.message.includes('"evangelio"') && e.message.includes('recibí "Lc dieciséis"') && e.message.includes("\"Lc 12,35-38\"")
  );
});

test('parseManualRef: varios tramos del mismo capítulo separados por punto', () => {
  assert.equal(parseManualRef('Lc 15,1-3.11-32'), 'Lc15,1-3.11-32');
  assert.equal(parseManualRef('Sal 111,1-2.5-6.8-9'), 'Sal111,1-2.5-6.8-9');
  assert.equal(parseManualRef('Sal 111, 1 - 2 . 5 - 6 . 8 - 9'), 'Sal111,1-2.5-6.8-9');
  assert.equal(parseManualRef('1 Co 12,4-6.11'), '1Co12,4-6.11');
});

test('parseManualRef: el punto nunca se convierte en coma', () => {
  assert.equal(parseManualRef('Lc 15,1-3.16,2'), null);
  assert.equal(parseManualRef('Lc 15,1-3.16,2-4'), null);
  assert.equal(parseManualRef('Lc 15.1-3'), null);
});

test('parseManualRef: tramos inválidos', () => {
  for (const bad of ['Lc 15,1-3.', 'Lc 15,.11-32', 'Lc 15,1-3..11-32', 'Lc 15,1-3.11-', 'Lc 15,1-3.a', 'Lc 15,1-3.11-32.']) {
    assert.equal(parseManualRef(bad), null, bad);
  }
});

const manualError = async (campos) => {
  try {
    await buildEsManual(campos, { day: 7, month: 11, year: 2026, deadline: Date.now() + 1000 });
  } catch (e) { return e.message; }
  return null;
};

test('buildEsManual: el error dice qué tramo falla', async () => {
  const msg = await manualError({ evangelio: 'Lc 15,1-3.11-' });
  assert.match(msg, /recibí "Lc 15,1-3\.11-"/);
  assert.match(msg, /tramo 2 \("11-"\)/);
  const msg2 = await manualError({ evangelio: 'Lc 15,1-2.x.8-9' });
  assert.match(msg2, /en "evangelio"/);
  assert.match(msg2, /tramo 2 \("x"\)/);
  assert.match(msg2, /Lc 15,1-3\.11-32/);
});

// BibleGet simulado con respuestas reales (BLPD) guardadas en test/fixtures.
const fixture = (f) => JSON.parse(readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8'));
const mockBibleGet = (porQuery) => {
  const queries = [];
  globalThis.fetch = async (url) => {
    const q = new URL(url).searchParams.get('query');
    queries.push(q);
    return new Response(JSON.stringify(fixture(porQuery[q])), { status: 200 });
  };
  return queries;
};

test('buildEsManual: varios tramos devuelven solo los versos pedidos', async () => {
  const realFetch = globalThis.fetch;
  try {
    const queries = mockBibleGet({ 'Lc15,1-3.11-32': 'bibleget-lc15.json', 'Sal111,1-2.5-6.8-9': 'bibleget-sal111.json' });
    const r = await buildEsManual(
      { evangelio: 'Lc 15, 1-3. 11-32', salmo: 'Sal 111,1-2.5-6.8-9' },
      { day: 7, month: 11, year: 2026, deadline: Date.now() + 5000 }
    );
    assert.deepEqual(queries.sort(), ['Lc15,1-3.11-32', 'Sal111,1-2.5-6.8-9']);
    assert.equal(r.reference, 'Lucas 15:1-3.11-32');
    assert.equal(r.psalm.reference, 'Salmos 111:1-2.5-6.8-9');
    // El texto es exactamente la unión de los versos pedidos (1-3 y 11-32; 1, 2, 5, 6, 8 y 9),
    // sin versos intermedios.
    const unir = (f) => fixture(f).results.map((v) => v.text.trim()).join(' ').replace(/\s+/g, ' ').trim();
    assert.equal(fixture('bibleget-lc15.json').results.length, 25);
    assert.deepEqual(fixture('bibleget-lc15.json').results.map((v) => Number(v.verse)),
      [1, 2, 3, ...Array.from({ length: 22 }, (_, i) => 11 + i)]);
    assert.ok(r.text.endsWith(unir('bibleget-lc15.json')));
    // El salmo lo reformatea formatPsalmEs (R./V.), pero cada verso pedido está íntegro y no hay otros.
    const versosSalmo = fixture('bibleget-sal111.json').results;
    assert.deepEqual(versosSalmo.map((v) => Number(v.verse)), [1, 2, 5, 6, 8, 9]);
    for (const v of versosSalmo) assert.ok(r.psalm.text.includes(v.text.replace('¡Aleluya!', '').trim()), `verso ${v.verse}`);
    assert.equal(r.psalm.text.match(/\[/g).length, 13); // las 13 letras del acróstico de los 6 versos
    assert.doesNotMatch(r.text, /cien ovejas/);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('parseManualRef: verso final menor que el inicial es inválido', () => {
  for (const bad of ['Lc 15,10-3', 'Lc 15,1-3.11-5', 'Lc 15,1-3.9-8.12', 'Mt 5,10-4,2', 'Mt 5,10-5,3']) {
    assert.equal(parseManualRef(bad), null, bad);
  }
  // iguales sí valen; cruzar de capítulo hacia adelante también
  assert.equal(parseManualRef('Lc 15,3-3'), 'Lc15,3-3');
  assert.equal(parseManualRef('Mt 5,1-7,29'), 'Mt5,1-7,29');
  assert.equal(parseManualRef('Mt 5,10-5,10'), 'Mt5,10-5,10');
});

test('parseManualRef: los tramos deben ir en orden ascendente y sin solaparse', () => {
  for (const bad of ['Lc 15,11-32.1-3', 'Lc 15,1-3.3-5', 'Lc 15,1-3.2', 'Sal 111,5-6.1-2', 'Sal 111,5.5']) {
    assert.equal(parseManualRef(bad), null, bad);
  }
  assert.equal(parseManualRef('Sal 111,1-2.5-6.8-9'), 'Sal111,1-2.5-6.8-9');
  assert.equal(parseManualRef('Lc 15,1-3.4'), 'Lc15,1-3.4');
});

test('buildEsManual: el error de orden dice qué tramo falla', async () => {
  assert.match(await manualError({ evangelio: 'Lc 15,11-32.1-3' }), /tramo 2 \("1-3"\) no va en orden ascendente: empieza en 1 y el tramo anterior termina en 32/);
  assert.match(await manualError({ evangelio: 'Lc 15,1-3.11-5' }), /tramo 2 \("11-5"\).*final \(5\) es menor que el inicial \(11\)/);
  assert.match(await manualError({ evangelio: 'Lc 15,10-3' }), /"10-3".*final \(3\) es menor que el inicial \(10\)/);
});

// Respuesta de BibleGet a medida, para probar el modo estricto.
const mockRespuesta = (cuerpo, status = 200) => {
  globalThis.fetch = async () => new Response(JSON.stringify(cuerpo), { status });
};
const conFetch = async (fn) => {
  const realFetch = globalThis.fetch;
  try { return await fn(); } finally { globalThis.fetch = realFetch; }
};
const manual = (campos) => buildEsManual(campos, { day: 7, month: 11, year: 2026, deadline: Date.now() + 5000 });
const verso = (chapter, v) => ({ book: 'Lucas', chapter, verse: v, text: `texto ${v}` });

test('buildEsManual: errors no vacío en la respuesta de BibleGet es un error', () => conFetch(async () => {
  mockRespuesta({ results: [verso(15, 1), verso(15, 2), verso(15, 3)], errors: [{ error: 'verse out of range' }] });
  await assert.rejects(manual({ evangelio: 'Lc 15,1-3' }), /Lectura manual "evangelio" \(Lc 15,1-3\).*devolvió errores.*verse out of range/);
}));

test('buildEsManual: menos versos de los pedidos es un error y dice cuáles faltan', () => conFetch(async () => {
  mockRespuesta({ results: [verso(15, 1), verso(15, 3), verso(15, 11)], errors: [] });
  await assert.rejects(manual({ evangelio: 'Lc 15,1-3.11-12' }), /menos versos de los pedidos.*faltan 15:2, 15:12/);
}));

test('buildEsManual: sin versos o con HTTP de error también falla', () => conFetch(async () => {
  mockRespuesta({ results: [], errors: [] });
  await assert.rejects(manual({ evangelio: 'Lc 15,1-3' }), /no devolvió versos/);
  mockRespuesta({}, 503);
  await assert.rejects(manual({ evangelio: 'Lc 15,1-3' }), /HTTP 503/);
}));

test('buildEsManual: con todos los versos pedidos devuelve el texto', () => conFetch(async () => {
  mockRespuesta({ results: [verso(15, 1), verso(15, 2), verso(15, 3)], errors: [] });
  const r = await manual({ evangelio: 'Lc 15,1-3' });
  assert.equal(r.reference, 'Lucas 15:1-3');
  assert.ok(r.text.endsWith('texto 1 texto 2 texto 3'));
}));

test('buildEsManual: el salmo no lleva responso inventado ni toma la primera línea como responso', () => conFetch(async () => {
  const salmo = fixture('bibleget-sal111.json');
  mockRespuesta(salmo);
  const r = await manual({ evangelio: 'Sal 111,1-2.5-6.8-9', salmo: 'Sal 111,1-2.5-6.8-9' });
  assert.doesNotMatch(r.psalm.text, /(^|\n)R\./);
  assert.doesNotMatch(r.psalm.text, /(^|\n)V\./);
  // Texto íntegro de los versos pedidos, empezando por el verso 1 (antes era el "responso")
  assert.equal(r.psalm.text, salmo.results.map((v) => v.text.trim()).join(' ').replace(/\s+/g, ' ').trim());
  assert.ok(r.psalm.text.startsWith('¡Aleluya![Alef]'));
}));

// Lectura secundaria que falla: se omite solo ella, el error completo va a los logs.
const conLogs = async (fn) => {
  const realError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args);
  try { return { r: await fn(), logs }; } finally { console.error = realError; }
};
const gospel15 = { results: [verso(15, 1), verso(15, 2), verso(15, 3)], errors: [] };
const mockPorQuery = (porQuery) => {
  globalThis.fetch = async (url) => {
    const q = new URL(url).searchParams.get('query');
    const { body = {}, status = 200 } = porQuery[q] ?? {};
    return new Response(JSON.stringify(body), { status });
  };
};

test('buildEsManual: si falla el salmo o una lectura en BibleGet, el Evangelio sale y se registra el error', () => conFetch(async () => {
  mockPorQuery({
    'Lc15,1-3': { body: gospel15 },
    'Is55,1-3': { body: { results: [], errors: [{ error: 'x' }] } },
    'Sal111,1-2': { body: {}, status: 503 },
    '1Co12,4-6': { body: { results: [{ book: 'Corintios', chapter: 12, verse: 4, text: 'a' }], errors: [] } },
  });
  const { r, logs } = await conLogs(() => manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3', salmo: 'Sal 111,1-2', lectura2: '1 Co 12,4-6' }));
  assert.equal(r.reference, 'Lucas 15:1-3');
  assert.ok(r.text.endsWith('texto 1 texto 2 texto 3'));
  assert.equal(r.reading1, null);
  assert.equal(r.psalm, null);
  assert.equal(r.reading2, null);
  assert.equal(logs.length, 3);
  const texto = logs.map((l) => l.map((x) => String(x)).join(' ')).join('\n');
  assert.match(texto, /lectura manual "lectura1" omitida/);
  assert.match(texto, /lectura manual "salmo" omitida/);
  assert.match(texto, /lectura manual "lectura2" omitida/);
  assert.match(texto, /Lectura manual "lectura1" \(Is 55,1-3\).*devolvió errores/);
  assert.match(texto, /HTTP 503/);
  assert.match(texto, /faltan 12:5, 12:6/);
  assert.match(texto, /at /); // incluye el stack
}));

test('buildEsManual: una lectura secundaria que falla no quita las demás', () => conFetch(async () => {
  mockPorQuery({
    'Lc15,1-3': { body: gospel15 },
    'Is55,1-3': { body: { results: [verso(55, 1), verso(55, 2), verso(55, 3)], errors: [] } },
    'Sal111,1-2': { body: {}, status: 503 },
  });
  const { r, logs } = await conLogs(() => manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3', salmo: 'Sal 111,1-2' }));
  assert.equal(r.psalm, null);
  assert.equal(r.reading1.text, 'texto 1 texto 2 texto 3');
  assert.deepEqual(r.omitted.map((o) => o.field), ['salmo']);
  assert.equal(logs.length, 1);
}));

test('buildEsManual: referencia mal escrita en lectura1, lectura2 o salmo es error y nombra el campo', () => conFetch(async () => {
  mockPorQuery({ 'Lc15,1-3': { body: gospel15 }, 'Is55,1-3': { body: { results: [verso(55, 1), verso(55, 2), verso(55, 3)], errors: [] } } });
  const { logs } = await conLogs(async () => {
    await assert.rejects(manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,3-1' }), /inválida en "lectura1": recibí "Is 55,3-1"/);
    await assert.rejects(manual({ evangelio: 'Lc 15,1-3', lectura2: 'xx' }), /inválida en "lectura2": recibí "xx"/);
    await assert.rejects(manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3', salmo: 'Sal 111,1-2.1' }), /inválida en "salmo".*tramo 2 \("1"\) no va en orden ascendente/);
  });
  assert.equal(logs.length, 0); // se lanza, no se registra como omitida
}));

test('buildEsManual: lecturas omitidas por BibleGet aparecen en omitted con campo y motivo', () => conFetch(async () => {
  mockPorQuery({
    'Lc15,1-3': { body: gospel15 },
    'Is55,1-3': { body: { results: [], errors: [{ error: 'x' }] } },
    'Sal111,1-2': { body: {}, status: 503 },
    '1Co12,4-6': { body: { results: [{ book: 'Corintios', chapter: 12, verse: 4, text: 'a' }], errors: [] } },
  });
  const { r } = await conLogs(() => manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3', salmo: 'Sal 111,1-2', lectura2: '1 Co 12,4-6' }));
  const porCampo = Object.fromEntries(r.omitted.map((o) => [o.field, o.reason]));
  assert.deepEqual(Object.keys(porCampo).sort(), ['lectura1', 'lectura2', 'salmo']);
  assert.match(porCampo.lectura1, /devolvió errores/);
  assert.match(porCampo.salmo, /HTTP 503/);
  assert.match(porCampo.lectura2, /faltan 12:5, 12:6/);
}));

test('buildEsManual: sin lecturas omitidas la respuesta no trae omitted', () => conFetch(async () => {
  mockPorQuery({ 'Lc15,1-3': { body: gospel15 } });
  const r = await manual({ evangelio: 'Lc 15,1-3' });
  assert.equal('omitted' in r, false);
}));

test('buildEsManual: timeout de BibleGet omite la lectura con su motivo', () => conFetch(async () => {
  globalThis.fetch = async (url, { signal }) => {
    const q = new URL(url).searchParams.get('query');
    if (q === 'Lc15,1-3') return new Response(JSON.stringify(gospel15));
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
  };
  const { r } = await conLogs(() => buildEsManual({ evangelio: 'Lc 15,1-3', salmo: 'Sal 111,1-2' }, { day: 7, month: 11, year: 2026, deadline: Date.now() }));
  assert.equal(r.psalm, null);
  assert.deepEqual(r.omitted.map((o) => o.field), ['salmo']);
  assert.match(r.omitted[0].reason, /no respondió a tiempo/);
}));

test('buildEsManual: si falla el Evangelio sigue siendo error, aunque lo demás funcione', () => conFetch(async () => {
  mockPorQuery({
    'Lc15,1-3': { body: { results: [verso(15, 1)], errors: [] } },
    'Is55,1-3': { body: { results: [verso(55, 1), verso(55, 2), verso(55, 3)], errors: [] } },
  });
  const { logs } = await conLogs(async () => {
    await assert.rejects(manual({ evangelio: 'Lc 15,1-3', lectura1: 'Is 55,1-3' }), /Lectura manual "evangelio" \(Lc 15,1-3\).*faltan 15:2, 15:3/);
    await assert.rejects(manual({ lectura1: 'Is 55,1-3' }), /no tiene el campo "evangelio"/);
    await assert.rejects(manual({ evangelio: 'Lc 15,3-1' }), /Referencia manual inválida en "evangelio"/);
  });
  assert.equal(logs.length, 0); // los errores del Evangelio se lanzan, no se silencian
}));
