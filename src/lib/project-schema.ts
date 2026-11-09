import { z } from 'astro/zod';
import { commonEntrySchema } from './editorial-schema.ts';

export const projectSchema = commonEntrySchema
  .safeExtend({
    storyTitle: z.string().min(5).optional(),
    order: z.number().int().positive().default(100),
    client: z.string(),
    relationship: z.string(),
    year: z.number().int(),
    sector: z.string(),
    nature: z.string(),
    location: z.string(),
    contractStatus: z.enum(['contrato-firmado', 'em-execucao', 'concluido-com-evidencia']),
    verifiedDeliveries: z.array(z.string()).default([]),
    verifiedResults: z.array(z.string()).default([]),
    externalLinks: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    recognition: z
      .object({
        title: z.string().min(5),
        recipient: z.string().min(3),
        description: z.string().min(20),
        sourceUrl: z.httpUrl(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.contractStatus === 'concluido-com-evidencia' && !data.verifiedDeliveries.length)
      ctx.addIssue({
        code: 'custom',
        path: ['verifiedDeliveries'],
        message: 'Projeto concluído exige ao menos uma entrega confirmada.',
      });
  });
