# Conecta Soluções

Site institucional da Conecta Soluções em português brasileiro, construído com Astro, TypeScript e CSS. Apresenta a atuação da empresa em gestão, tecnologia, cultura e turismo. O build gera os arquivos estáticos de `dist/` para hospedagem em Apache/cPanel ou Nginx.

## Desenvolvimento local

Use Node 24.22.2 (a versão de referência está em `.nvmrc`).

```sh
npm ci
npm run dev
```

Abra **http://127.0.0.1:4321/** para acompanhar as alterações. Para iniciar e gerenciar a prévia em segundo plano, use os comandos abaixo.

```sh
npm run dev -- --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Se o ambiente restringir a configuração global da telemetria, execute os comandos com `ASTRO_TELEMETRY_DISABLED=1`.

## Homologação com Docker Compose

O Docker executa o build com Node 24.22.2 e `npm ci`. O Nginx 1.30.6 serve os arquivos estáticos com um usuário sem privilégios. A porta externa padrão é **3019**, configurável por `APP_PORT`. A otimização de imagens usa Sharp e libvips compilados para CPU x86-64 básica, incluindo VMs sem AVX/AVX2.

```sh
docker compose up --build -d --wait
docker compose ps
docker compose logs -f app
docker compose down
```

A origem prevista na VM é **http://192.168.3.85:3019**. O domínio de homologação é **https://conecta.victor.ferreira.nom.br/**, previsto para acesso HTTPS pelo Cloudflare. A configuração do túnel e do DNS ocorre fora do Compose. Consulte [operação e configuração Docker](docs/docker.md) e [resultados da validação](docs/docker-validation.md).

## Verificação

```sh
npm test
npm run check
npm run build
npm run verify
```

Os testes verificam os schemas e as regras editoriais. `npm run check` valida tipos e componentes. `npm run verify` confere rotas, links, assets, metadados e regras de publicação no `dist/` gerado pelo build. Para inspecionar o build enquanto a prévia de desenvolvimento usa a porta 4321, execute `npm run preview -- --port 4322`. `npm run format` formata o código e ignora o pacote local de referência.

## Organização

- `src/pages/`: home, páginas institucionais, catálogos, detalhes e endpoints estáticos de SEO.
- `src/components/`, `src/layouts/` e `src/styles/`: elementos e identidade visual compartilhados.
- `src/content/` reúne os serviços, produtos e projetos em Markdown.
- `src/content.config.ts`: definição das coleções; os schemas testáveis ficam em `src/lib/`.
- `src/lib/`: consultas e regras de publicação.
- `src/data/site.ts`: identificação, contato e navegação.
- `src/assets/conecta-logo.png`: cópia fiel da marca rasterizada aprovada; o Astro entrega versões otimizadas. Não existe SVG aprovado neste projeto.
- `public/.htaccess`: configuração do Apache, cache e página 404.
- `scripts/verify-build.mjs`: inspeção do build final.

A pasta **`conecta-solucoes/` é material de referência local e não é versionada**. Ela não é necessária para instalar ou compilar um clone do projeto. Não coloque contratos, documentos pessoais ou credenciais em `public/` ou nas coleções.

## Conteúdo e revisão editorial

A foto de **Victor Ferreira** já aparece em **Quem Somos** e está versionada em `src/assets/equipe/victor-ferreira.jpg`. Para trocá-la, substitua o arquivo no mesmo caminho por um JPEG vertical na proporção **3:4**. Consulte o [guia do retrato](src/assets/equipe/README.md) para o enquadramento e a atualização do build.

Uma entrada aparece no site somente quando tem publicação explícita, status aprovado e data válida de revisão:

```yaml
publish: true
publicationStatus: aprovado
reviewedAt: 2026-11-09
```

Omitir esses campos mantém a entrada oculta. Uma revisão com data futura também não publica a entrada. As listas, a home, as páginas individuais e o sitemap usam a mesma regra. Para retirar uma entrada, defina `publish: false` e publique um novo build.

Antes de publicar um projeto, confira o vínculo, o escopo, os direitos de divulgação e as evidências de entregas e resultados. Registre a conclusão somente quando houver entrega confirmada. As experiências profissionais do responsável técnico ficam na seção Trajetória de Quem Somos (`/quem-somos/#trajetoria`).

## Produtos

O catálogo `/produtos/` reúne seis itens. **Mapas Culturais** aparece em primeiro destaque, seguido por **Operacionalização de editais** em Produtos e Soluções. O catálogo também apresenta Plataforma imobiliária, Pesquisas e indicadores, Rota Fácil e Ingressos digitais para eventos. Cada item tem uma página em `/produtos/[slug]/`. A home apresenta o Mapas Culturais e os quatro sistemas complementares.

As entradas em `src/content/products/` incluem público, funcionalidades, situação de apresentação e referências às frentes de serviço. O formato `platform-service` exige atribuição à plataforma original, `application` descreve os sistemas e `service` apresenta serviços como a operacionalização de editais. A lista `relatedProjects` define a ordem em que os projetos publicados aparecem nos detalhes do serviço. A interface apresenta a finalidade de cada item e oferece contato pelo WhatsApp.

A Plataforma imobiliária usa “Apresentação sob consulta” no card e no detalhe. Os textos dos três sistemas locais foram levantados sem copiar código ou dados de outros repositórios. A descrição de ingressos foi fornecida pelo titular. Consulte o [levantamento e o plano do catálogo](docs/superpowers/plans/2026-11-09-portfolio-solucoes.md).

## Histórias de projetos

O catálogo `/projetos/` reúne as histórias do portfólio em uma lista contínua. Cada página descreve o contexto e a contribuição da Conecta. A home usa os mesmos cards para destacar Vozes Periféricas e o Portal da Cultura de Aparecida. O nome do arquivo Markdown define o slug da página. Preserve os slugs existentes ao editar títulos.

Edite as histórias em `src/content/projects/`. O campo `title` é o nome do projeto, `storyTitle` define o título narrativo e `order` controla a ordem no catálogo. O campo `relationship` aceita `contrato-direto`, `via-instituicao-parceira` ou `atuacao-tecnica`. Os casos com vínculo contratual exigem `client` e `contractStatus`. `atuacao-tecnica` permite apresentar o escopo, como no projeto da PNAB em Pirenópolis. O bloco opcional `recognition` exige `title`, `recipient`, `description` e `sourceUrl` HTTP ou HTTPS. O reconhecimento de Campo Mourão é atribuído ao município e ao seu projeto.

As capas ficam em `src/assets/projetos/`. O Astro entrega versões WebP responsivas das capturas de páginas públicas e das imagens fornecidas pelo titular, com origem registrada no [guia das capas](src/assets/projetos/README.md). Os casos que aguardam imagem usam cards de texto. Consulte também a [auditoria do portfólio](docs/auditoria-portfolio-2026-11-20.md).

O Prêmio Nacional Vozes Periféricas apresenta a atuação contratada pela OEI na plataforma **Mapa da Cultura, do Ministério da Cultura**. A divulgação de documentos e produtos de contratos depende das autorizações de cada projeto.

## Contato e domínio

O contato comercial é o WhatsApp **+55 (62) 98275-5571**, configurado em `src/data/site.ts`. Os botões abrem `https://wa.me/5562982755571` em uma nova aba. O site não incorpora o WhatsApp, nem utiliza formulário ou cookies de rastreamento; a conversa acontece no serviço externo.

O domínio de homologação confirmado é `https://conecta.victor.ferreira.nom.br`, já indicado em `.env.example` e no Compose. `SITE_URL` determina a origem HTTPS usada no build. Sem essa variável, o build local usa `noindex`, o robots bloqueia indexação e não são gerados canonical nem URLs fictícias no sitemap. Se a URL institucional definitiva for diferente, configure-a em `SITE_URL` e execute novamente o build e a verificação. O Nginx de homologação mantém `noindex` no cabeçalho HTTP, sem apagar canonical e sitemap.

Consulte a [revisão de SEO](docs/seo.md) para verificar os metadados, o sitemap e a indexação de Mapas Culturais no domínio de produção.

## Publicação

O workflow verifica o projeto em pull requests, envios à branch `main` e execuções manuais. O artefato contém somente `dist/`. Para habilitar a publicação no cPanel, configure `DEPLOY_ENABLED=true`, `SITE_URL`, o ambiente de produção e os segredos do workflow.

Consulte [a configuração de cPanel e recuperação](docs/deploy.md). O pipeline exige SSH e rsync; se a conta tiver somente SFTP, adapte o transporte antes de habilitar a publicação. Não configure um segundo mecanismo de deploy concorrente.

Referências técnicas: [Astro: coleções de conteúdo](https://docs.astro.build/en/guides/content-collections/), [Astro: configuração estática](https://docs.astro.build/en/reference/configuration-reference/), [GitHub Actions: setup-node](https://github.com/actions/setup-node).
