import { test } from 'node:test';
import assert from 'node:assert/strict';
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

test('parseManualRef: el punto con espacios se normaliza pero no es separador válido', () => {
  assert.equal(parseManualRef('Lc 16 . 9'), null);
  assert.equal(parseManualRef('Lc 16, 9 . 11'), null);
});

test('parseManualRef: entradas inválidas', () => {
  for (const bad of [undefined, null, '', 'Lc', 'Lc 16', 'Lc 16,', '16,9', 'Lc 16,9-', 'Lc 16 9-15']) {
    assert.equal(parseManualRef(bad), null, String(bad));
  }
});

test('buildEsManual: el error muestra lo recibido y el formato esperado', async () => {
  await assert.rejects(
    buildEsManual({ evangelio: 'Lc dieciséis' }, { day: 7, month: 11, year: 2026, deadline: Date.now() + 1000 }),
    (e) => e.message.includes('"evangelio"') && e.message.includes('recibí "Lc dieciséis"') && e.message.includes('"Lc 12,35-38"')
  );
});
