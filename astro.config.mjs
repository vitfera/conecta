import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');

const site = process.env.SITE_URL?.trim();
if (site) {
  const url = new URL(site);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL deve ser a origem HTTPS do domínio oficial, sem subpasta ou credenciais.');
  }
}

export default defineConfig({
  output: 'static',
  site: site || undefined,
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { build: { sourcemap: false } },
});
