# Site Conecta Soluções — plano de implementação

> Execução sequencial nesta sessão com `executing-plans`; um commit por etapa. O briefing fornecido é a especificação aprovada. Não criar worktree para este repositório inicialmente vazio.

**Objetivo:** entregar o site institucional estático da Conecta, verificável localmente e preparado para publicação no cPanel.

**Arquitetura:** Astro estático, páginas semânticas e componentes compartilhados. Conteúdo Markdown validado e publicação bloqueada por padrão para projetos e conteúdos sem revisão.

**Tecnologias:** Astro, TypeScript, CSS, testes nativos Node e GitHub Actions.

## Etapa 1 — proteção do material e definição

- [x] Ler todos os documentos e inspecionar a marca.
- [x] Criar `.gitignore` com `/conecta-solucoes/`, configurações locais e artefatos.
- [x] Registrar decisões em `docs/superpowers/specs/2026-11-09-site-conecta-design.md` e este plano.
- [x] Executar `git check-ignore conecta-solucoes/README.md` e conferir os arquivos preparados.
- [x] Commit: `chore: define project scope and exclude local reference package`.

## Etapa 2 — base técnica e controle editorial

Arquivos: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.env.example`, `src/content.config.ts`, `src/lib/publication.ts`, `src/data/site.ts`, `tests/publication.test.ts`, `src/content/{services,projects,posts,products}/*.md`.

- [x] Instalar Astro e as dependências de validação, com versões registradas no lockfile.
- [x] Escrever e executar testes que rejeitam rascunhos e publicação sem revisão; observar falha antes de implementar `isPublishable`.
- [x] Implementar a política editorial e schemas: `publish: true` exige `publicationStatus: aprovado` e data de revisão; projetos preservam contratante, vínculo, status e resultados comprovados.
- [x] Cadastrar seis serviços conforme o catálogo; manter projetos, artigo inicial e produto em revisão ocultos.
- [x] Definir e-mail confirmado, menus e URL de produção configurável, sem domínio inventado.
- [x] Verificar com `npm test` e `npx astro sync`.
- [x] Commit: `feat: set up Astro and validated editorial collections`.

## Etapa 3 — identidade, navegação e páginas

Arquivos: `src/layouts/BaseLayout.astro`, `src/components/*.astro`, `src/styles/*.css`, `src/pages/**/*.astro`, `src/assets/conecta-logo.png`, `public/branding/`.

- [x] Incorporar somente a marca aprovada, em proporção original; otimizar durante o build.
- [x] Implementar layout, SEO, cabeçalho com menu sem dependência de JavaScript, rodapé, componentes e estilos responsivos.
- [x] Implementar home com frase aprovada, seis soluções, diferenciais, etapas de trabalho e contato.
- [x] Implementar Quem Somos, catálogo e seis detalhes de soluções, plataformas, projetos, conteúdos, contato, privacidade e 404.
- [x] Usar a consulta editorial central em listas e `getStaticPaths`; estados vazios não expõem nomes de cases em revisão.
- [x] Verificar `npm run check` e `npm run build`.
- [x] Commit: `feat: build responsive Conecta institutional website`.

## Etapa 4 — entrega, validação e cPanel

Arquivos: `.github/workflows/build-and-deploy.yml`, `scripts/verify-build.mjs`, `public/.htaccess`, `README.md`, `docs/deploy.md`, `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`.

- [ ] Validar build sem domínio (noindex), com domínio (canonical/sitemap reais) e exclusão dos rascunhos.
- [ ] Implementar verificação do HTML gerado: rotas, links internos, títulos/descrições únicos e ausência de material interno.
- [ ] Criar CI com `npm ci`, testes, tipos, build e inspeção de saída.
- [ ] Preparar deploy por SSH/rsync, sem remoção indiscriminada, host autenticado e destino configurável; sem executar publicação.
- [ ] Documentar desenvolvimento, revisão editorial, variáveis, publicação e restauração.
- [ ] Testar a prévia em desktop e celular, teclado e fallback sem JS; corrigir falhas observadas.
- [ ] Reexecutar `npm test`, `npm run check`, `npm run build`, `npm run verify` e `git diff --check`.
- [ ] Commit: `ci: verify static site and prepare secure cPanel deployment`.
