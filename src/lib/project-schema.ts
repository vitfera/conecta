import { z } from 'astro/zod';
import { commonEntrySchema } from './editorial-schema.ts';

export const projectSchema = commonEntrySchema
  .safeExtend({
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
  })
  .strict();
