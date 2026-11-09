# Site Conecta Soluções — plano de implementação

> Execução sequencial nesta sessão com `executing-plans`; um commit por etapa. O briefing fornecido é a especificação aprovada. Não criar worktree para este repositório inicialmente vazio.

**Objetivo:** entregar o site institucional estático da Conecta, verificável localmente e preparado para publicação no cPanel.

**Arquitetura:** Astro estático, páginas semânticas e componentes compartilhados. Conteúdo Markdown validado e publicação bloqueada por padrão para projetos e conteúdos sem revisão.

**Tecnologias:** Astro, TypeScript, CSS, testes nativos Node e GitHub Actions.

**Atualização de escopo:** as etapas 1 a 4 registram a primeira versão implementada. As decisões da próxima etapa, anotadas ao final deste documento, têm precedência sobre o briefing original nos pontos alterados pelo titular. O titular autorizou a execução dos ajustes de WhatsApp, retirada de Conteúdos e turismo. A inclusão dos SaaS continua aguardando informações.

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

- [x] Validar build sem domínio (noindex), com domínio (canonical/sitemap reais) e exclusão dos rascunhos.
- [x] Implementar verificação do HTML gerado: rotas, links internos, títulos/descrições únicos e ausência de material interno.
- [x] Criar CI com `npm ci`, testes, tipos, build e inspeção de saída.
- [x] Preparar deploy por SSH/rsync, sem remoção indiscriminada, host autenticado e destino configurável; sem executar publicação.
- [x] Documentar desenvolvimento, revisão editorial, variáveis, publicação e restauração.
- [x] Testar a prévia em desktop e celular, teclado e fallback sem JS; corrigir falhas observadas.
- [x] Reexecutar `npm test`, `npm run check`, `npm run build`, `npm run verify` e `git diff --check`.
- [x] Commit: `ci: verify static site and prepare secure cPanel deployment`.

## Resultado de validação

Verificações e limites registrados em [docs/verification.md](../../verification.md). Prévia local mantida ativa por solicitação do titular; publicação externa não executada.

## Próxima etapa — ajustes solicitados pelo titular

Anotações de 9 de novembro de 2026. Execução autorizada nesta conversa para WhatsApp, retirada de Conteúdos e turismo; SaaS permanecem para uma próxima rodada.

### 1. WhatsApp como contato comercial

- [x] Substituir o contato comercial por e-mail por um botão de WhatsApp para **+55 (62) 98275-5571**, informado pelo titular.
- [x] Usar o endereço `https://wa.me/5562982755571` nos botões de contato.
- [x] Revisar `src/data/site.ts`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/ContactCTA.astro`, `src/pages/index.astro` e `src/pages/contato.astro` para manter os caminhos de contato consistentes.
- [x] Atualizar `src/pages/politica-de-privacidade.astro`, metadados e documentação para refletir o contato via WhatsApp e a abertura de um serviço externo.

### 2. Retirar Conteúdos do escopo

O titular não pretende publicar notícias ou manter um blog; essa página não faz parte da oferta desejada.

- [x] Remover Conteúdos da navegação, do rodapé e da página inicial.
- [x] Retirar as rotas `/conteudos/` e `/conteudos/[slug]/`, a coleção `posts` e o artigo em revisão.
- [x] Ajustar `src/content.config.ts`, consultas da home, `src/pages/sitemap.xml.ts`, `scripts/verify-build.mjs`, testes e documentação para a estrutura sem blog.

### 3. Incluir SaaS próprios em Projetos

- [ ] Preparar o catálogo de projetos para apresentar também os SaaS que o titular já possui, além das atuações institucionais.
- [ ] Identificar adequadamente soluções próprias, autoria, disponibilidade e links, distinguindo-as dos projetos executados para contratantes.
- [ ] Cadastrar os SaaS depois que o titular enviar a relação e os detalhes de cada um. **Aguardando essas informações, que serão fornecidas posteriormente.**

### 4. Dar presença explícita ao turismo

Na ilustração da home com a frase **“Ideias que se conectam”**, o titular percebeu destaque excessivo para cultura e ausência de turismo. A direção é mostrar melhor a amplitude da atuação e a conexão entre os dois setores, considerando oportunidades em estruturas públicas que reúnem cultura e turismo.

- [ ] Reequilibrar `src/components/ConnectionVisual.astro` para incluir turismo explicitamente e reduzir o protagonismo exclusivo de cultura.
- [ ] Revisar os textos e a distribuição de ênfase da home em `src/pages/index.astro`, conectando gestão, tecnologia, cultura e turismo.
- [ ] Verificar a coerência dessa direção nas páginas de soluções e em Quem Somos, utilizando o histórico fornecido para apresentar a atuação em turismo.
- [ ] Manter a logomarca aprovada; a solicitação se refere à apresentação da atuação e à composição da home.

### Verificação e commits da próxima etapa

- [ ] Conferir os botões de WhatsApp em desktop e celular e a ausência de referências à seção Conteúdos na navegação e no build.
- [ ] Validar a apresentação de turismo em telas grandes e pequenas e os dados dos SaaS quando forem fornecidos.
- [ ] Executar `npm test`, `npm run check`, `npm run build`, `npm run verify` e `git diff --check` após as alterações de código.
- [ ] Fazer um commit ao concluir cada etapa de implementação, conforme a orientação inicial do titular.
