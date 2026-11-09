import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:3019');
const site = new URL(process.argv[3] ?? 'https://conecta.victor.ferreira.nom.br');
const pending = ['/'];
const visited = new Set();
const indexablePages = new Set();
const assets = new Set();
const documents = new Set();

async function request(path, options = {}) {
  return fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000), ...options });
}

function headers(response, path) {
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', path);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/, path);
}

while (pending.length) {
  const path = pending.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  const response = await request(path);
  assert.equal(response.status, 200, path);
  headers(response, path);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/, path);
  const html = await response.text();
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, path);
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/)?.[1];
  assert.ok(robots, `${path}: política de indexação ausente`);
  // O noindex HTTP da homologação independe da decisão editorial no HTML.
  if (
    !robots
      .split(',')
      .map((value) => value.trim())
      .includes('noindex')
  )
    indexablePages.add(path);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  assert.equal(canonical, new URL(path, site).href, `${path}: canonical`);
  for (const [, href] of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)) {
    if (href.startsWith('//')) continue;
    const target = new URL(href.replaceAll('&amp;', '&'), origin);
    if (/\.[a-z0-9]+$/i.test(target.pathname)) {
      assets.add(target.pathname);
      if (/\.(pdf|docx?|xlsx?|odt|ods)$/i.test(target.pathname)) documents.add(target.pathname);
    } else if (!visited.has(target.pathname)) pending.push(target.pathname);
  }
  for (const [tag] of html.matchAll(/<(?:img|script|link)\b[^>]*>/g)) {
    const src = tag.match(/(?:src|href)="(\/[^"#]+)"/)?.[1];
    if (src && !src.startsWith('//')) assets.add(new URL(src, origin).pathname);
    const srcset = tag.match(/srcset="([^"]+)"/)?.[1];
    if (srcset)
      for (const entry of srcset.split(',')) {
        const url = entry.trim().split(/\s+/)[0];
        if (url.startsWith('/') && !url.startsWith('//')) assets.add(new URL(url, origin).pathname);
      }
  }
}

let images = 0;
for (const path of assets) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  headers(response, path);
  const type = response.headers.get('content-type') ?? '';
  if (/\.(png|jpe?g|webp|avif|svg)$/i.test(path)) {
    assert.match(type, /^image\//, path);
    images++;
  }
  assert.ok((await response.arrayBuffer()).byteLength > 0, `${path}: arquivo vazio`);
  if (path.startsWith('/_astro/'))
    assert.match(response.headers.get('cache-control') ?? '', /immutable/, path);
}

const robots = await (await request('/robots.txt')).text();
assert.ok(robots.includes(`Sitemap: ${new URL('/sitemap.xml', site).href}`));
const sitemap = await (await request('/sitemap.xml')).text();
for (const path of indexablePages)
  assert.ok(sitemap.includes(new URL(path, site).href), `${path}: sitemap`);

const redirect = await request('/quem-somos', {
  redirect: 'manual',
  headers: { Host: site.hostname, 'X-Forwarded-Proto': 'https' },
});
assert.equal(redirect.status, 301);
assert.equal(redirect.headers.get('location'), '/quem-somos/');

for (const path of [
  '/pagina-inexistente/',
  '/.env',
  '/.git/config',
  '/.htaccess',
  '/package.json',
  '/conecta-solucoes/README.md',
  '/src/content/projects/cianorte-mapas-culturais.md',
]) {
  const response = await request(path);
  assert.equal(response.status, 404, path);
  headers(response, path);
  assert.match(await response.text(), /não foi encontrada/, path);
  assert.equal(response.headers.get('cache-control'), 'no-store', path);
}
console.log(
  `Docker HTTP verificado: ${visited.size} páginas, ${assets.size} assets, ${images} imagens, ${documents.size} documentos; canonical, sitemap, noindex, redirects relativos e 404 aprovados.`,
);
console.log('Busca/Pagefind: não faz parte deste projeto.');
