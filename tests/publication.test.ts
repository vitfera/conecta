import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isPublishable } from '../src/lib/publication.ts';
const approved = { publish: true, publicationStatus: 'aprovado', reviewedAt: new Date('2026-11-08T12:00:00Z') };

test('publica conteúdo explicitamente aprovado e revisado', () => {
  assert.equal(isPublishable(approved), true);
});

test('bloqueia rascunhos mesmo quando há revisão registrada', () => {
  assert.equal(isPublishable({ ...approved, publish: false }), false);
});

test('bloqueia publicação sem aprovação editorial', () => {
  assert.equal(isPublishable({ ...approved, publicationStatus: 'pendente-de-revisao' }), false);
});

test('bloqueia publicação sem data válida de revisão', () => {
  assert.equal(isPublishable({ ...approved, reviewedAt: undefined }), false);
  assert.equal(isPublishable({ ...approved, reviewedAt: new Date('inválido') }), false);
});

test('bloqueia publicação com revisão em data futura', () => {
  assert.equal(isPublishable({ ...approved, reviewedAt: new Date('2999-01-01T12:00:00Z') }), false);
});

test('conteúdo sem decisão editorial permanece privado por padrão', () => {
  assert.equal(isPublishable({}), false);
});
