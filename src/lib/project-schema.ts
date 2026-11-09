import { z } from 'astro/zod';
import { commonEntrySchema } from './editorial-schema.ts';

const projectBase = commonEntrySchema.safeExtend({
  sector: z.string().min(2),
  nature: z.string().min(2),
  order: z.number().int().positive().default(100),
  externalLinks: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
});

const engagement = projectBase
  .safeExtend({
    kind: z.literal('engagement'),
    client: z.string(),
    relationship: z.string(),
    year: z.number().int(),
    location: z.string(),
    contractStatus: z.enum(['contrato-firmado', 'em-execucao', 'concluido-com-evidencia']),
    verifiedDeliveries: z.array(z.string()).default([]),
    verifiedResults: z.array(z.string()).default([]),
  })
  .strict();

const serviceIds = [
  'software-e-plataformas',
  'editais-e-mapas-culturais',
  'gestao-publica-e-transformacao-digital',
  'dados-e-inteligencia',
  'comunicacao-projetos-e-eventos',
  'consultoria-formacao-e-suporte',
] as const;

const solution = projectBase
  .safeExtend({
    kind: z.literal('solution'),
    icon: z.enum(['code', 'data', 'process', 'location', 'communication', 'ticket', 'building']),
    presentationStatus: z.enum(['sob-consulta', 'em-evolucao']),
    audience: z.string().min(10),
    capabilities: z.array(z.string().min(5)).min(1).max(6),
    relatedServices: z.array(z.enum(serviceIds)).min(1),
  })
  .strict();

export const projectSchema = z.discriminatedUnion('kind', [solution, engagement]);

export type ProjectData = z.infer<typeof projectSchema>;
