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
const publishedProjects = [];
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
    if (collection === 'projects' && approved)
      publishedProjects.push({
        id: relative('src/content/projects', source).replace(/\.md$/, ''),
        recognition: /^recognition:\s*$/m.test(frontmatter),
        relationship: field('relationship'),
        client: field('client'),
        order: Number(field('order') ?? 100),
      });
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
  if (label.startsWith('projetos/')) {
    assert.ok(!/<dl(?:\s|>)/.test(html), `${label}: ficha técnica na história do projeto`);
    assert.ok(!html.includes('data-project-filters'), `${label}: filtros na seção de histórias`);
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
  if (
    publishedProducts.includes('operacionalizacao-de-editais') &&
    ['produtos/index.html', 'solucoes/index.html'].includes(label)
  ) {
    const mapas = html.indexOf('data-featured-product="mapas-culturais"');
    const editais = html.indexOf('data-featured-product="operacionalizacao-de-editais"');
    assert.ok(editais > mapas, `${label}: destaque de editais ausente ou fora de ordem`);
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

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.ok(!/R\$\s*\d/.test(html), `${relative(root, file)}: valor contratual exposto`);
  assert.ok(!/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/.test(html), `${relative(root, file)}: CPF exposto`);
}

const robots = await readFile(join(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const projectIndex = await readFile(join(root, 'projetos/index.html'), 'utf8');
for (const project of publishedProjects) {
  const detail = join(root, 'projetos', project.id, 'index.html');
  assert.ok(existsSync(detail), `Projeto sem história: ${project.id}`);
  assert.ok(
    projectIndex.includes(`data-project="${project.id}"`),
    `Projeto sem card no catálogo: ${project.id}`,
  );
  const story = await readFile(detail, 'utf8');
  assert.ok(
    ['contrato-direto', 'via-instituicao-parceira', 'atuacao-tecnica'].includes(
      project.relationship,
    ),
    `Vínculo do projeto precisa de classificação explícita: ${project.id}`,
  );
  if (project.relationship !== 'atuacao-tecnica') {
    const contractualParty = project.client?.split(' — ')[0].split('/')[0];
    assert.ok(
      contractualParty && story.includes(contractualParty),
      `História sem identificação da instituição responsável pelo vínculo: ${project.id}`,
    );
  }
  if (project.id === 'premio-nacional-vozes-perifericas') {
    assert.ok(
      story.includes('Mapa da Cultura, do Ministério da Cultura'),
      'Vozes Periféricas deve identificar a plataforma Mapa da Cultura do MinC',
    );
    assert.ok(
      !story.includes('Mapas Culturais'),
      'Vozes Periféricas não deve ser apresentado como plataforma Mapas Culturais',
    );
    assert.ok(
      !story.includes('href="/produtos/mapas-culturais/"'),
      'Vozes Periféricas não deve receber CTA de serviços Mapas Culturais',
    );
  }
  assert.equal(
    story.includes('data-project-recognition'),
    project.recognition,
    `Reconhecimento divergente do conteúdo editorial: ${project.id}`,
  );
  if (site)
    assert.ok(
      sitemap.includes(`/projetos/${project.id}/`),
      `Projeto fora do sitemap: ${project.id}`,
    );
}
const home = await readFile(join(root, 'index.html'), 'utf8');
const homeProjects = [...home.matchAll(/data-project="([^"]+)"/g)].map(([, id]) => id);
const highlightedProjects = [...publishedProjects]
  .filter(({ relationship }) => relationship === 'contrato-direto')
  .sort((a, b) => a.order - b.order)
  .slice(0, 2)
  .map(({ id }) => id);
assert.deepEqual(
  homeProjects,
  highlightedProjects,
  'Destaques da home divergentes dos contratos diretos',
);
assert.ok(
  !projectIndex.includes('Contratações diretas da Conecta'),
  'Catálogo deve preservar a apresentação narrativa aprovada',
);

if (!publishedProjects.length) {
  assert.equal(
    value(projectIndex, 'robots'),
    'noindex, nofollow',
    'Catálogo vazio precisa de noindex',
  );
  assert.ok(!sitemap.includes('/projetos/'), 'Seção vazia de projetos no sitemap');
}
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
