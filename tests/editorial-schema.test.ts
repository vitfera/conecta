import assert from 'node:assert/strict';
import { test } from 'node:test';
import { editorialDate } from '../src/lib/editorial-schema.ts';

test('aceita datas editoriais explícitas em ISO e Date', () => {
  assert.equal(editorialDate.safeParse('2026-11-09').success, true);
  assert.equal(editorialDate.safeParse(new Date('2026-11-09')).success, true);
});

test('recusa revisão vazia, booleana ou numérica em vez de inventar uma data', () => {
  for (const value of [null, false, true, 0, 1, '', undefined]) {
    assert.equal(editorialDate.safeParse(value).success, false, `Valor indevido: ${value}`);
  }
});

test('recusa textos sem uma data ISO válida', () => {
  for (const value of ['amanhã', '2026-02-30', '09/11/2026', '   ']) {
    assert.equal(editorialDate.safeParse(value).success, false, `Data indevida: ${value}`);
  }
});
