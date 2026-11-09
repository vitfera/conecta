import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { commonEntrySchema as common } from './lib/editorial-schema';
import { projectSchema } from './lib/project-schema';
import { productSchema } from './lib/product-schema';

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
  schema: projectSchema,
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: productSchema,
});

export const collections = { services, projects, products };
