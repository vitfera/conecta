import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';

if (existsSync('.env')) process.loadEnvFile('.env');
const root = resolve('dist');
const site = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : undefined;
const required = [
  'index.html',
  'quem-somos/index.html',
  'solucoes/index.html',
  'projetos/index.html',
  'produtos/index.html',
  'contato/index.html',
  'politica-de-privacidade/index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
];
for (const file of required)
  assert.ok(existsSync(join(root, file)), `Rota ou configuração ausente: ${file}`);

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)],
    ),
  );
  return groups.flat();
}

const files = await filesIn(root);
const pages = files.filter((file) => file.endsWith('.html'));
const unpublished = [];
const publishedProducts = [];
for (const collection of ['projects', 'products', 'services']) {
  for (const source of (await filesIn(`src/content/${collection}`)).filter((file) =>
    file.endsWith('.md'),
  )) {
    const markdown = await readFile(source, 'utf8');
    const frontmatter = markdown.split(/^---\s*$/m)[1] ?? '';
    const field = (name) =>
      frontmatter
        .match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
        ?.trim()
        .replace(/^['"]|['"]$/g, '');
    const reviewed = new Date(field('reviewedAt') ?? '');
    const approved = !(
      field('publish') !== 'true' ||
      field('publicationStatus') !== 'aprovado' ||
      !Number.isFinite(reviewed.getTime()) ||
      reviewed > new Date()
    );
    if (collection === 'products' && approved)
      publishedProducts.push(relative('src/content/products', source).replace(/\.md$/, ''));
    if (!approved) {
      unpublished.push({
        title: field('title'),
        id: relative(`src/content/${collection}`, source).replace(/\.md$/, ''),
        prefix: {
          projects: 'projetos',
          services: 'solucoes',
          products: 'produtos',
        }[collection],
      });
    }
  }
}
const titles = new Set();
const descriptions = new Set();
const value = (html, name) =>
  [...html.matchAll(/<meta\b[^>]*>/g)]
    .find(([tag]) => tag.includes(`name="${name}"`))?.[0]
    .match(/content="([^"]*)"/)?.[1];
let checkedLinks = 0;

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const label = relative(root, file);
  assert.match(html, /<html\s+lang="pt-BR"/, `${label}: idioma incorreto`);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${label}: deve haver um H1`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${label}: título ausente ou duplicado`);
  titles.add(title);
  const description = value(html, 'description');
  assert.ok(
    description && !descriptions.has(description),
    `${label}: descrição ausente ou duplicada`,
  );
  descriptions.add(description);
  assert.match(html, /href="#conteudo"/, `${label}: falta link para pular a navegação`);
  assert.match(html, /<main\b[^>]*id="conteudo"/, `${label}: falta landmark principal`);
  assert.ok(!html.includes('conecta-solucoes/'), `${label}: pacote de referência exposto`);
  assert.ok(!html.includes('/conteudos/'), `${label}: link para a seção retirada`);
  assert.ok(!html.includes('mailto:'), `${label}: contato antigo por e-mail`);
  assert.ok(
    !/\bSaaS\b/i.test(html),
    `${label}: modelo de contratação destacado no conteúdo público`,
  );
  assert.ok(!/sympla/i.test(html), `${label}: referência comercial não autorizada`);
  if (label.startsWith('produtos/') && label !== 'produtos/index.html') {
    assert.ok(
      !/<dt[^>]*>\s*(Contratante|Situação contratual|Ano de contratação)\s*<\/dt>/.test(html),
      `${label}: metadados contratuais em um produto`,
    );
  }
  if (
    publishedProducts.includes('mapas-culturais') &&
    ['index.html', 'produtos/index.html', 'solucoes/index.html'].includes(label)
  ) {
    assert.ok(
      html.includes('data-featured-product="mapas-culturais"'),
      `${label}: falta destaque para o Mapas Culturais`,
    );
  }
  assert.ok(
    html.includes('href="https://wa.me/5562982755571"'),
    `${label}: botão do WhatsApp ausente`,
  );
  for (const draft of unpublished) {
    assert.ok(
      !html.includes(`href="/${draft.prefix}/${draft.id}/"`),
      `${label}: link de rascunho exposto: ${draft.id}`,
    );
    if (draft.prefix === 'projetos') {
      assert.ok(
        !draft.title || !html.includes(draft.title),
        `${label}: conteúdo em revisão exposto: ${draft.id}`,
      );
    }
    if (draft.prefix === 'produtos') {
      assert.ok(
        !html.includes(`data-product="${draft.id}"`) &&
          !html.includes(`data-featured-product="${draft.id}"`),
        `${label}: produto sem liberação exposto`,
      );
    }
  }
  if (!site) {
    assert.equal(
      value(html, 'robots'),
      'noindex, nofollow',
      `${label}: prévia precisa bloquear indexação`,
    );
    assert.ok(!html.includes('rel="canonical"'), `${label}: canonical inventado`);
  } else {
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
    assert.ok(canonical?.startsWith(`${site}/`), `${label}: canonical fora do domínio configurado`);
  }
  for (const [tag] of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/g)) {
    const url = tag.match(/(?:href|src)="([^"]+)"/)?.[1];
    if (!url || !url.startsWith('/') || url.startsWith('//')) continue;
    const pathname = new URL(url, 'https://build.invalid').pathname;
    const target = join(root, decodeURIComponent(pathname));
    assert.ok(
      existsSync(target) || existsSync(join(target, 'index.html')),
      `${label}: link ou asset ausente: ${url}`,
    );
    checkedLinks++;
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    assert.equal(
      JSON.parse(json)['@type'],
      'Organization',
      `${label}: dados estruturados inválidos`,
    );
  }
}

const robots = await readFile(join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const id of publishedProducts) {
  assert.ok(existsSync(join(root, 'produtos', id, 'index.html')), `Produto sem página: ${id}`);
  if (site) assert.ok(sitemap.includes(`/produtos/${id}/`), `Produto fora do sitemap: ${id}`);
}
assert.ok(
  !files.some((file) => file.startsWith('conteudos/') || file.includes('/conteudos/')),
  'Rota de Conteúdos ainda gerada',
);
assert.ok(!sitemap.includes('/conteudos/'), 'Seção retirada ainda presente no sitemap');
for (const draft of unpublished) {
  assert.ok(!sitemap.includes(`/${draft.prefix}/${draft.id}/`), `Rascunho no sitemap: ${draft.id}`);
  assert.ok(
    !files.some((file) => file.endsWith(`/${draft.prefix}/${draft.id}/index.html`)),
    `Rota de rascunho gerada: ${draft.id}`,
  );
}
assert.ok(
  !files.some((file) => file.toLowerCase().endsWith('.pdf') || file.includes('conecta-solucoes')),
  'Arquivo interno no build',
);
if (!site) {
  assert.match(robots, /Disallow: \/\s/);
  assert.ok(!sitemap.includes('<loc>'), 'Sitemap com domínio fictício');
} else {
  assert.match(robots, /Allow: \/\s/);
  assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
  for (const [, url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g))
    assert.ok(url.startsWith(`${site}/`));
}
assert.equal(
  pages.filter(
    (file) =>
      relative(root, file).startsWith(`solucoes/`) &&
      !relative(root, file).endsWith('solucoes/index.html'),
  ).length,
  6,
  'Devem existir seis páginas de soluções',
);
console.log(
  `Build verificado: ${pages.length} páginas, ${checkedLinks} links e assets, metadados únicos, rascunhos protegidos; ${site ? 'domínio configurado' : 'prévia não indexável'}.`,
);
