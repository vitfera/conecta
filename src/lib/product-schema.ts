import { z } from 'astro/zod';
import { commonEntrySchema } from './editorial-schema.ts';

const serviceIds = [
  'software-e-plataformas',
  'editais-e-mapas-culturais',
  'gestao-publica-e-transformacao-digital',
  'dados-e-inteligencia',
  'comunicacao-projetos-e-eventos',
  'consultoria-formacao-e-suporte',
] as const;

const productBase = commonEntrySchema.safeExtend({
  sector: z.string().min(2),
  order: z.number().int().positive(),
  featured: z.boolean().default(false),
  icon: z.enum([
    'code',
    'data',
    'process',
    'location',
    'communication',
    'ticket',
    'building',
    'culture',
  ]),
  presentationStatus: z.enum(['servicos-disponiveis', 'sob-consulta', 'em-evolucao']),
  audience: z.string().min(10),
  capabilities: z.array(z.string().min(5)).min(1).max(6),
  relatedServices: z.array(z.enum(serviceIds)).min(1),
});
const application = productBase.safeExtend({ kind: z.literal('application') }).strict();
const platformService = productBase
  .safeExtend({
    kind: z.literal('platform-service'),
    attribution: z.string().min(20),
  })
  .strict();

export const productSchema = z.discriminatedUnion('kind', [application, platformService]);
export type ProductData = z.infer<typeof productSchema>;
