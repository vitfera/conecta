import { z } from 'astro/zod';

// Não converter null/false/0 para a época Unix como z.coerce.date faria.
export const editorialDate = z.union([
  z.date(),
  z.iso.date().transform((value) => new Date(value)),
  z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
]);
