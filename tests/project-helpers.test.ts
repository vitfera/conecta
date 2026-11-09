import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projectSchema } from '../src/lib/project-schema.ts';
import { projectFootnote, projectRelationship, sortProjects } from '../src/lib/projects.ts';
const solution = projectSchema.parse({
  kind: 'solution',
  title: 'Solução digital',
  description: 'Descrição de uma solução digital para verificar os metadados públicos.',
  sector: 'Gestão',
  nature: 'Plataforma digital',
  order: 1,
  icon: 'data',
  presentationStatus: 'sob-consulta',
  audience: 'Equipes que precisam organizar informações.',
  capabilities: ['Organização de informações'],
  relatedServices: ['software-e-plataformas'],
});
const engagement = projectSchema.parse({
  kind: 'engagement',
  title: 'Atuação institucional',
  description: 'Descrição de uma atuação institucional com dados de vínculo e contratação.',
  sector: 'Cultura',
  nature: 'Implantação',
  client: 'Instituição de teste',
  relationship: 'Contratação direta',
  location: 'Goiás',
  year: 2025,
  contractStatus: 'contrato-firmado',
});

test('metadados de solução não inventam ano, localidade ou vínculo contratual', () => {
  assert.equal(projectFootnote(solution), 'Apresentação sob consulta');
  assert.equal(projectRelationship(solution), 'Solução digital');
});

test('metadados institucionais preservam localidade, ano e vínculo', () => {
  assert.equal(projectFootnote(engagement), 'Goiás · 2025');
  assert.equal(projectRelationship(engagement), 'Contratação direta');
});

test('ordena soluções e projetos de forma determinística sem alterar a lista de origem', () => {
  const input = [
    { id: 'atuacao', data: engagement },
    { id: 'solucao', data: solution },
  ];
  const result = sortProjects(input);
  assert.deepEqual(
    result.map((entry) => entry.id),
    ['solucao', 'atuacao'],
  );
  assert.equal(input[0].id, 'atuacao');
});
