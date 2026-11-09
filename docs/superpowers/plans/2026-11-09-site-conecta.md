# Site Conecta Soluções — plano de implementação

> Execução sequencial nesta sessão com `executing-plans`; um commit por etapa. O briefing fornecido é a especificação aprovada. Não criar worktree para este repositório inicialmente vazio.

**Objetivo:** entregar o site institucional estático da Conecta, verificável localmente e preparado para publicação no cPanel.

**Arquitetura:** Astro estático, páginas semânticas e componentes compartilhados. Conteúdo Markdown validado e publicação bloqueada por padrão para projetos sem revisão.

**Tecnologias:** Astro, TypeScript, CSS, testes nativos Node e GitHub Actions.

**Atualização de escopo:** as etapas 1 a 4 registram a primeira versão implementada. As decisões da próxima etapa, anotadas ao final deste documento, têm precedência sobre o briefing original nos pontos alterados pelo titular. Os ajustes de WhatsApp, retirada de Conteúdos e turismo foram implementados após autorização do titular. O catálogo de Produtos reúne o Mapas Culturais em destaque e quatro sistemas complementares indicados pelo titular.

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

## Ajustes solicitados pelo titular e pendências

Anotações de 9 de novembro de 2026. Execução autorizada nesta conversa para contato, navegação, turismo e catálogo de Produtos. A organização atual prioriza Mapas Culturais, conforme a orientação do titular.

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

### 3. Catálogo de Produtos

- [x] Reunir Mapas Culturais, Plataforma imobiliária, Pesquisas e indicadores, Rota Fácil e Ingressos digitais para eventos em Produtos.
- [x] Dar destaque de carro-chefe ao Mapas Culturais na home, em Soluções e no catálogo, identificando os serviços da Conecta sobre o software livre.
- [x] Incluir Produtos no menu principal e criar uma página de detalhe para cada item.
- [x] Usar descrições sustentadas pelos três repositórios locais e pela descrição do titular para ingressos, sem enfatizar modelo de contratação.
- [x] Preservar Projetos para cases e atuações institucionais e não inventar dados contratuais para os produtos.
- [x] Apresentar a Plataforma imobiliária como “Apresentação sob consulta”, no card e no detalhe, conforme o pedido do titular.

O levantamento e os critérios desta etapa estão no [plano do catálogo](2026-11-09-portfolio-solucoes.md).

### 4. Dar presença explícita ao turismo

Na ilustração da home com a frase **“Ideias que se conectam”**, o titular percebeu destaque excessivo para cultura e ausência de turismo. A direção é mostrar melhor a amplitude da atuação e a conexão entre os dois setores, considerando oportunidades em estruturas públicas que reúnem cultura e turismo.

- [x] Reequilibrar `src/components/ConnectionVisual.astro` para incluir turismo explicitamente e reduzir o protagonismo exclusivo de cultura.
- [x] Revisar os textos e a distribuição de ênfase da home em `src/pages/index.astro`, conectando gestão, tecnologia, cultura e turismo.
- [x] Verificar a coerência dessa direção nas páginas de soluções e em Quem Somos, utilizando o histórico fornecido para apresentar a atuação em turismo.
- [x] Manter a logomarca aprovada; a solicitação se refere à apresentação da atuação e à composição da home.

### Verificação e commits desta rodada

- [x] Conferir os botões de WhatsApp em desktop e celular e a ausência de referências à seção Conteúdos na navegação e no build.
- [x] Validar a apresentação de turismo em telas grandes e pequenas.
- [x] Validar as informações dos produtos nas fontes disponíveis e na descrição fornecida pelo titular.
- [x] Executar `npm test`, `npm run check`, `npm run build`, `npm run verify` e `git diff --check` após as alterações de código.
- [x] Fazer um commit ao concluir cada etapa de implementação, conforme a orientação inicial do titular.

### Resultado desta rodada

WhatsApp e retirada de Conteúdos registrados nos commits `23a8642` e `8ff00ef`; turismo e revisão final compõem a etapa seguinte. Build com 14 páginas e 340 links/assets verificados, nove testes aprovados e prévia local mantida ativa. As 13 rotas navegáveis foram verificadas em quatro larguras, incluindo a legibilidade dos quatro temas da ilustração. Domínio configurado validado em uma cópia temporária. Detalhes em [verificação](../../verification.md).

## Navegação e apresentação da equipe

Solicitações de 9 de novembro de 2026, com execução autorizada pelo titular nesta conversa.

### Menu desktop visível durante a rolagem

- [x] Manter o cabeçalho e o menu desktop visíveis no topo enquanto o visitante rola a página.
- [x] Ajustar o posicionamento em `src/styles/global.css` para preservar alinhamento, fundo e sobreposição correta do cabeçalho.
- [x] Conferir que o menu não cubra títulos, destinos de links internos ou elementos com foco por teclado, e que não provoque saltos no layout.
- [x] Validar a rolagem em diferentes larguras de desktop e conferir a transição para o menu mobile.

### Foto de Victor Ferreira e menção à equipe em Quem Somos

- [x] Reservar um espaço para a foto de Victor Ferreira no bloco de apresentação do responsável técnico em `src/pages/quem-somos.astro`.
- [x] Definir retrato vertical 3:4 e disposição responsiva; detectar automaticamente o arquivo `src/assets/equipe/victor-ferreira.jpg` quando fornecido pelo titular.
- [x] Atualizar o texto para informar que a Conecta conta com uma equipe, apresentando Victor como liderança da empresa.
- [x] Preservar a distinção entre a trajetória profissional de Victor e as atuações da empresa; incluir apenas nomes, funções e informações da equipe que forem fornecidos.
- [x] Conferir legibilidade, hierarquia e organização do conjunto em desktop e celular.

Foto: proporção **3:4**, dimensão recomendada **900 × 1200 px**, nome **`victor-ferreira.jpg`**, pasta **`src/assets/equipe/`**. Instruções em [README da foto](../../../src/assets/equipe/README.md). O titular adicionou a foto real com 977 × 1302 pixels; o componente detectou o arquivo automaticamente, substituindo as iniciais.

### Entrega e validação

- [x] Validar a navegação durante a rolagem, acessibilidade do cabeçalho e apresentação do perfil e da equipe.
- [x] Executar as verificações pertinentes e registrar um commit por etapa, conforme a orientação inicial do titular.

Menu desktop registrado no commit `90d6f51`; foto e apresentação da equipe no commit `f74a58c`. A etapa final registra a validação: 20 testes aprovados, Astro sem erros, 19 páginas e 514 links/assets verificados, 18 rotas em seis larguras e revisão independente sem achados relevantes. Relatório em [verificação](../../verification.md). Prévia local mantida ativa.

## Histórias de projetos — concluído

O titular confirmou as implantações de Campo Mourão e Cianorte e aprovou a opção de histórias de projetos, com foco no contexto e na contribuição da Conecta. Os dois casos agora têm capas reais, cards compartilhados com a home e detalhes narrativos, sem ficha técnica pública ou filtros. Campo Mourão recebe destaque pelo reconhecimento ao município e ao projeto. A rodada passou por 24 testes, Astro check, build de 21 páginas, 577 links/assets, conferência de 20 rotas em seis larguras e revisão independente. Execução e cenários em [plano das histórias](2026-11-09-historias-projetos.md).
