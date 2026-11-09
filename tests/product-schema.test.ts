import assert from 'node:assert/strict';
import { test } from 'node:test';
import { productSchema } from '../src/lib/product-schema.ts';
import { isPublishable } from '../src/lib/publication.ts';

const application = {
  kind: 'application',
  title: 'Produto de teste',
  description: 'Solução digital de teste sem dados de contratação ou resultados fictícios.',
  sector: 'Gestão',
  order: 1,
  icon: 'data',
  presentationStatus: 'sob-consulta',
  audience: 'Equipes que precisam organizar informações.',
  capabilities: ['Organização de informações'],
  relatedServices: ['software-e-plataformas'],
  publish: true,
  publicationStatus: 'aprovado',
  reviewedAt: '2026-11-09',
};
const platform = {
  ...application,
  kind: 'platform-service',
  icon: 'culture',
  presentationStatus: 'servicos-disponiveis',
  featured: true,
  attribution: 'Software livre sobre o qual a Conecta presta serviços de implantação e suporte.',
};

test('cadastra uma aplicação sem cliente, ano ou situação contratual inventados', () => {
  const result = productSchema.safeParse(application);
  assert.equal(result.success, true);
  if (result.success)
    for (const key of ['client', 'year', 'contractStatus'])
      assert.ok(!Object.hasOwn(result.data, key));
});

test('rejeita dados contratuais em um produto', () => {
  assert.equal(
    productSchema.safeParse({
      ...application,
      client: 'Cliente fictício',
      year: 2026,
      contractStatus: 'contrato-firmado',
    }).success,
    false,
  );
});

test('serviços sobre software de terceiros exigem atribuição explícita', () => {
  assert.equal(productSchema.safeParse(platform).success, true);
  const { attribution: _, ...missingAttribution } = platform;
  assert.equal(productSchema.safeParse(missingAttribution).success, false);
});

test('produto publicado precisa de aprovação e data de revisão válida', () => {
  assert.equal(
    productSchema.safeParse({ ...application, publicationStatus: 'pendente-de-revisao' }).success,
    false,
  );
  assert.equal(productSchema.safeParse({ ...application, reviewedAt: null }).success, false);
});

test('produto em rascunho permanece fora da publicação', () => {
  const result = productSchema.safeParse({
    ...application,
    publish: false,
    publicationStatus: 'pendente-de-revisao',
    reviewedAt: undefined,
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal(isPublishable(result.data), false);
});

test('exige funcionalidades e referências de serviço existentes', () => {
  assert.equal(productSchema.safeParse({ ...application, capabilities: [] }).success, false);
  assert.equal(
    productSchema.safeParse({ ...application, relatedServices: ['servico-inexistente'] }).success,
    false,
  );
});

test('não admite resultados ou entregas contratuais como campos de produto', () => {
  assert.equal(
    productSchema.safeParse({ ...application, verifiedResults: ['Resultado'] }).success,
    false,
  );
});
