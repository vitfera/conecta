import assert from 'node:assert/strict';
import { test } from 'node:test';
import { productSchema } from '../src/lib/product-schema.ts';

import { sortProducts, productStatus } from '../src/lib/products.ts';
const application = productSchema.parse({
  kind: 'application',
  title: 'Aplicação de teste',
  description: 'Produto de teste sem informações contratuais ou resultados comerciais inventados.',
  sector: 'Gestão',
  order: 1,
  icon: 'data',
  presentationStatus: 'sob-consulta',
  audience: 'Equipes que precisam organizar informações.',
  capabilities: ['Organização de informações'],
  relatedServices: ['software-e-plataformas'],
});
const flagship = productSchema.parse({
  ...application,
  kind: 'platform-service',
  title: 'Mapas Culturais',
  order: 99,
  featured: true,
  icon: 'culture',
  presentationStatus: 'servicos-disponiveis',
  attribution: 'Software livre sobre o qual a Conecta oferece implantação e suporte.',
});

test('o carro-chefe aparece antes das aplicações complementares independentemente da ordem numérica', () => {
  const input = [
    { id: 'app', data: application },
    { id: 'mapas', data: flagship },
  ];
  const sorted = sortProducts(input);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ['mapas', 'app'],
  );
  assert.equal(input[0].id, 'app');
});
test('produto é apresentado por sua disponibilidade, sem criar ano ou cliente', () => {
  assert.equal(productStatus(application), 'Apresentação sob consulta');
  assert.equal(productStatus(flagship), 'Serviços disponíveis');
});
