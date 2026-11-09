import type { APIRoute } from 'astro';
import { getPublished } from '../lib/content';

const escape = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const urls: string[] = [];
  if (site) {
    urls.push('/', '/quem-somos/', '/solucoes/', '/contato/', '/politica-de-privacidade/');
    if ((await getPublished('products')).length) urls.push('/produtos/');
    for (const [collection, prefix] of [
      ['services', 'solucoes'],
      ['projects', 'projetos'],
      ['posts', 'conteudos'],
    ] as const) {
      const entries = await getPublished(collection);
      if (entries.length && collection !== 'services') urls.push(`/${prefix}/`);
      urls.push(...entries.map((entry) => `/${prefix}/${entry.id}/`));
    }
  }
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${escape(new URL(path, site).href)}</loc></url>`).join('')}</urlset>\n`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
};
