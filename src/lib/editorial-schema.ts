import { z } from 'astro/zod';

// Não converter null/false/0 para a época Unix como z.coerce.date faria.
export const editorialDate = z.union([
  z.date(),
  z.iso.date().transform((value) => new Date(value)),
  z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
]);

export const commonEntrySchema = z
  .object({
    title: z.string().min(3),
    description: z.string().min(20).max(220),
    publish: z.boolean().default(false),
    publicationStatus: z.enum(['aprovado', 'pendente-de-revisao']).default('pendente-de-revisao'),
    reviewedAt: editorialDate.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.publish && (data.publicationStatus !== 'aprovado' || !data.reviewedAt)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Publicação exige aprovação editorial e data de revisão.',
      });
    }
  });
