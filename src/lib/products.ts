import type { ProductData } from './product-schema.ts';

const statusLabels = {
  'servicos-disponiveis': 'Serviços disponíveis',
  'sob-consulta': 'Apresentação sob consulta',
  'em-evolucao': 'Em evolução',
} as const;

export function productStatus(data: ProductData): string {
  return statusLabels[data.presentationStatus];
}

export function sortProducts<T extends { data: ProductData }>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title, 'pt-BR'),
  );
}
