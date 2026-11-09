import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projectSchema } from '../src/lib/project-schema.ts';

const project = {
  title: 'Atuação institucional',
  description: 'Descrição de uma atuação institucional com identificação do contratante.',
  sector: 'Cultura',
  nature: 'Implantação',
  client: 'Instituição de teste',
  relationship: 'Contratação direta',
  location: 'Goiás',
  year: 2026,
  contractStatus: 'contrato-firmado',
};

test('cases institucionais continuam exigindo contratante e situação contratual', () => {
  assert.equal(projectSchema.safeParse(project).success, true);
  const { client: _, ...withoutClient } = project;
  assert.equal(projectSchema.safeParse(withoutClient).success, false);
});

test('cases institucionais publicados continuam exigindo aprovação e revisão', () => {
  assert.equal(projectSchema.safeParse({ ...project, publish: true }).success, false);
  assert.equal(
    projectSchema.safeParse({
      ...project,
      publish: true,
      publicationStatus: 'aprovado',
      reviewedAt: '2026-11-09',
    }).success,
    true,
  );
});
