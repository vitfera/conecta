import type { ProjectData } from './project-schema.ts';

export const presentationStatusLabels = {
  'sob-consulta': 'Apresentação sob consulta',
  'em-evolucao': 'Em evolução',
} as const;

export function projectFootnote(data: ProjectData): string {
  return data.kind === 'solution'
    ? presentationStatusLabels[data.presentationStatus]
    : `${data.location} · ${data.year}`;
}

export function projectRelationship(data: ProjectData): string {
  return data.kind === 'solution' ? 'Solução digital' : data.relationship;
}

export function sortProjects<T extends { data: ProjectData }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    const order = a.data.order - b.data.order;
    if (order) return order;
    const yearA = a.data.kind === 'engagement' ? a.data.year : 0;
    const yearB = b.data.kind === 'engagement' ? b.data.year : 0;
    return yearB - yearA || a.data.title.localeCompare(b.data.title, 'pt-BR');
  });
}
