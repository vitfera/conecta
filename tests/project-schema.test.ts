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
  const { contractStatus: _status, ...withoutContractStatus } = project;
  assert.equal(projectSchema.safeParse(withoutContractStatus).success, false);
});

test('atuação técnica pode ser publicada com o escopo confirmado', () => {
  const { client: _client, contractStatus: _status, ...technicalProject } = project;
  assert.equal(
    projectSchema.safeParse({
      ...technicalProject,
      relationship: 'atuacao-tecnica',
      publish: true,
      publicationStatus: 'aprovado',
      reviewedAt: '2026-11-25',
    }).success,
    true,
  );
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

const recognition = {
  title: 'Reconhecimento por inovação',
  recipient: 'Município responsável pelo projeto',
  description:
    'Reconhecimento recebido pelo município com o projeto, sem atribuir o prêmio à prestadora.',
  sourceUrl: 'https://example.org/reconhecimento-do-projeto',
};

test('permite contar a história com reconhecimento atribuído e fonte pública', () => {
  const result = projectSchema.safeParse({
    ...project,
    storyTitle: 'Uma plataforma que conecta a cultura local',
    order: 1,
    recognition,
    verifiedDeliveries: ['Implantação confirmada pelo titular.'],
    contractStatus: 'concluido-com-evidencia',
    publish: true,
    publicationStatus: 'aprovado',
    reviewedAt: '2026-11-09',
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.recognition?.recipient, recognition.recipient);
});

test('reconhecimento exige identificar quem o recebeu', () => {
  const { recipient: _, ...withoutRecipient } = recognition;
  assert.equal(
    projectSchema.safeParse({ ...project, recognition: withoutRecipient }).success,
    false,
  );
});

test('reconhecimento exige uma fonte pública HTTP em vez de URL executável', () => {
  for (const sourceUrl of ['', 'javascript:alert(1)', 'file:///tmp/premio.pdf'])
    assert.equal(
      projectSchema.safeParse({ ...project, recognition: { ...recognition, sourceUrl } }).success,
      false,
    );
});

test('projeto concluído exige ao menos uma entrega confirmada', () => {
  assert.equal(
    projectSchema.safeParse({ ...project, contractStatus: 'concluido-com-evidencia' }).success,
    false,
  );
});
