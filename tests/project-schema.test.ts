import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projectSchema } from '../src/lib/project-schema.ts';
import { isPublishable } from '../src/lib/publication.ts';

const editorial = {
  title: 'Solução de teste',
  description: 'Descrição de uma solução digital para testar a classificação editorial.',
  publish: true,
  publicationStatus: 'aprovado',
  reviewedAt: '2026-11-09',
};
const solution = {
  ...editorial,
  kind: 'solution',
  sector: 'Gestão',
  nature: 'Plataforma digital',
  order: 1,
  icon: 'data',
  presentationStatus: 'sob-consulta',
  audience: 'Equipes que precisam organizar informações.',
  capabilities: ['Organização de informações', 'Acompanhamento de atividades'],
  relatedServices: ['software-e-plataformas'],
};
const engagement = {
  ...editorial,
  kind: 'engagement',
  sector: 'Cultura',
  nature: 'Implantação',
  client: 'Instituição de teste',
  relationship: 'Contratação direta',
  location: 'Local de teste',
  year: 2026,
  contractStatus: 'contrato-firmado',
};

test('aceita solução digital sem exigir contratante, ano ou situação contratual', () => {
  const result = projectSchema.safeParse(solution);
  assert.equal(result.success, true);
  if (result.success) {
    assert.ok(!Object.hasOwn(result.data, 'client'));
    assert.ok(!Object.hasOwn(result.data, 'year'));
    assert.ok(!Object.hasOwn(result.data, 'contractStatus'));
  }
});

test('rejeita campos contratuais quando a entrada é uma solução digital', () => {
  assert.equal(projectSchema.safeParse({ ...engagement, ...solution }).success, false);
});

test('preserva os campos obrigatórios de uma atuação institucional', () => {
  assert.equal(projectSchema.safeParse(engagement).success, true);
  const { client: _, ...withoutClient } = engagement;
  assert.equal(projectSchema.safeParse(withoutClient).success, false);
});

test('solução publicada exige revisão editorial explícita', () => {
  assert.equal(
    projectSchema.safeParse({ ...solution, publicationStatus: 'pendente-de-revisao' }).success,
    false,
  );
  assert.equal(projectSchema.safeParse({ ...solution, reviewedAt: null }).success, false);
});

test('permite solução em rascunho sem tornar a entrada publicável', () => {
  const draft = projectSchema.safeParse({
    ...solution,
    publish: false,
    publicationStatus: 'pendente-de-revisao',
    reviewedAt: undefined,
  });
  assert.equal(draft.success, true);
  if (draft.success) assert.equal(isPublishable(draft.data), false);
});

test('não aceita solução sem funcionalidades apresentáveis', () => {
  assert.equal(projectSchema.safeParse({ ...solution, capabilities: [] }).success, false);
});

test('não aceita uma frente de serviço inexistente', () => {
  assert.equal(
    projectSchema.safeParse({ ...solution, relatedServices: ['servico-inexistente'] }).success,
    false,
  );
});

test('não transforma solução em evidência de entregas ou resultados de um contrato', () => {
  assert.equal(
    projectSchema.safeParse({ ...solution, verifiedDeliveries: ['Entrega'] }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({ ...solution, verifiedResults: ['Resultado'] }).success,
    false,
  );
});
