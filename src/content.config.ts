import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { commonEntrySchema as common } from './lib/editorial-schema';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: common.safeExtend({
    order: z.number().int().positive(),
    shortTitle: z.string(),
    icon: z.enum(['code', 'culture', 'process', 'data', 'communication', 'support']),
    offerings: z.array(z.string()).min(2),
    audience: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: common.safeExtend({
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
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: common.safeExtend({
    ownership: z.string(),
    status: z.enum(['servicos-disponiveis', 'em-desenvolvimento']),
  }),
});

export const collections = { services, projects, products };
