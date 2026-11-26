# Conecta Soluções

Site institucional em português brasileiro, construído com Astro, TypeScript e CSS, com atuação apresentada em gestão, tecnologia, cultura e turismo. O build gera arquivos estáticos para hospedagem Apache/cPanel; não requer Node no servidor de produção.

## Desenvolvimento local

Use Node 24.22.2 (a versão de referência está em `.nvmrc`).

```sh
npm ci
npm run dev
```

Abra **http://127.0.0.1:4321/**. O Astro atualiza a prévia quando os arquivos mudam. A versão instalada do Astro mantém o servidor em segundo plano:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Se o ambiente restringir a configuração global da telemetria, execute os comandos com `ASTRO_TELEMETRY_DISABLED=1`.

## Homologação com Docker Compose

O Docker preserva a arquitetura estática: build com Node 24.22.2 e `npm ci`, seguido de Nginx 1.30.6 sem root. A porta externa padrão é **3019**, configurável por `APP_PORT`. O processamento de imagens é compilado para CPU x86-64 básica, sem exigir AVX/AVX2; as otimizações continuam obrigatórias.

```sh
docker compose up --build -d --wait
docker compose ps
docker compose logs -f app
docker compose down
```

Origem prevista na VM: **http://192.168.3.85:3019**. Hostname de homologação: **https://conecta.victor.ferreira.nom.br/**, com HTTPS atendido pelo Cloudflare. Consulte [operação e configuração Docker](docs/docker.md) e [resultados da validação](docs/docker-validation.md). Túnel, DNS e publicação externa são uma etapa separada.

## Verificação

```sh
npm test
npm run check
npm run build
npm run verify
```

Os testes verificam a política editorial. `check` valida tipos e componentes. `verify` inspeciona o resultado em `dist/`: rotas, links, assets, metadados, idioma e exclusão de conteúdo sem liberação. `npm run preview` serve o build na porta informada pelo Astro. `npm run format` formata o código e ignora o pacote local de referência.

## Organização

- `src/pages/`: home, páginas institucionais, catálogos, detalhes e endpoints estáticos de SEO.
- `src/components/`, `src/layouts/` e `src/styles/`: elementos e identidade visual compartilhados.
- `src/content/`: serviços, projetos e plataformas em Markdown.
- `src/content.config.ts`: definição das coleções; os schemas testáveis ficam em `src/lib/`.
- `src/lib/`: consultas e regras de publicação.
- `src/data/site.ts`: identificação, contato e navegação.
- `src/assets/conecta-logo.png`: cópia fiel da marca rasterizada aprovada; o Astro entrega versões otimizadas. Não existe SVG aprovado neste projeto.
- `public/.htaccess`: configuração do Apache, cache e página 404.
- `scripts/verify-build.mjs`: inspeção do build final.

A pasta **`conecta-solucoes/` é material de referência local e não é versionada**. Ela não é necessária para instalar ou compilar um clone do projeto. Não coloque contratos, documentos pessoais ou credenciais em `public/` ou nas coleções.

## Conteúdo e revisão editorial

Para inserir a foto de Victor Ferreira em Quem Somos, salve uma imagem JPEG vertical **3:4**, preferencialmente **900 × 1200 px**, em `src/assets/equipe/victor-ferreira.jpg`. O arquivo é detectado automaticamente e substitui o espaço reservado. A [orientação da foto](src/assets/equipe/README.md) detalha o enquadramento e a atualização do build.

Uma entrada aparece no site somente quando tem publicação explícita, status aprovado e data válida de revisão:

```yaml
publish: true
publicationStatus: aprovado
reviewedAt: 2026-11-09
```

Omitir esses campos mantém a entrada oculta. Uma revisão com data futura também não publica a entrada. As listas, a home, as páginas individuais e o sitemap usam a mesma regra. Para retirar uma entrada, defina `publish: false` e publique um novo build.

Os seis serviços e a apresentação dos serviços sobre Mapas Culturais seguem o briefing fornecido. O portfólio foi conciliado com o roteiro editorial de 20/11/2026. Campo Mourão mantém a implantação atestada; Cianorte descreve escopo contratado, aguardando comprovação documental de conclusão. Antes de liberar outros projetos, confira vínculo, escopo, direitos de divulgação e evidência de cada entrega e resultado. Um contrato firmado não comprova conclusão. Experiências individuais do responsável técnico são apresentadas separadamente. O site não possui seção de notícias ou blog.

## Produtos

O catálogo `/produtos/` reúne seis itens. **Mapas Culturais** aparece em primeiro destaque, seguido por **Operacionalização de editais** em Produtos e Soluções. O catálogo também apresenta Plataforma imobiliária, Pesquisas e indicadores, Rota Fácil e Ingressos digitais para eventos. Cada item tem uma página em `/produtos/[slug]/`. A home apresenta o Mapas Culturais e os quatro sistemas complementares.

As entradas em `src/content/products/` incluem público, funcionalidades, situação de apresentação e referências às frentes de serviço. O formato `platform-service` exige atribuição à plataforma original, `application` descreve os sistemas e `service` apresenta serviços como a operacionalização de editais. A lista `relatedProjects` define a ordem em que os projetos publicados aparecem nos detalhes do serviço. A interface apresenta a finalidade de cada item e oferece contato pelo WhatsApp.

A Plataforma imobiliária usa “Apresentação sob consulta” no card e no detalhe. Os textos dos três sistemas locais foram levantados sem copiar código ou dados de outros repositórios. A descrição de ingressos foi fornecida pelo titular. Consulte o [levantamento e o plano do catálogo](docs/superpowers/plans/2026-11-09-portfolio-solucoes.md).

## Histórias de projetos

O catálogo `/projetos/` apresenta onze histórias em uma listagem contínua, com seis contratações diretas e cinco prestações via instituições classificadas no conteúdo editorial. Os textos identificam a participação sem cabeçalhos ou etiquetas contratuais na interface. A home usa os mesmos cards e destaca Vozes Periféricas e o Portal da Cultura de Aparecida. As páginas não exibem ficha técnica de localidade, período ou contrato. As URLs anteriores de Campo Mourão e Cianorte foram preservadas.

Edite as histórias em `src/content/projects/`. O campo `storyTitle` define o título narrativo e `order` controla a ordem. O campo existente `relationship` usa `contrato-direto` ou `via-instituicao-parceira`; `client` registra a instituição com a qual existe o vínculo. Vínculo e situação permanecem no conteúdo editorial; um projeto concluído exige uma entrega confirmada. O bloco opcional `recognition` exige `title`, `recipient`, `description` e `sourceUrl` HTTP. O reconhecimento de Campo Mourão é atribuído ao município com seu projeto.

As capas ficam em `src/assets/projetos/`. O Astro entrega versões WebP responsivas das capturas de páginas públicas e das imagens fornecidas pelo titular, com origem registrada no [guia das capas](src/assets/projetos/README.md). Os casos que aguardam imagem usam cards de texto. Consulte também a [auditoria do portfólio](docs/auditoria-portfolio-2026-11-20.md).

O Prêmio Nacional Vozes Periféricas foi contratado pela OEI e usa a plataforma **Mapa da Cultura, do Ministério da Cultura**, conforme correção do titular. A apresentação é institucional e não divulga produtos do contrato. Oito experiências profissionais do responsável técnico ficam separadas em `/quem-somos/#trajetoria`, sem serem convertidas em contratos ou clientes diretos da Conecta. Propostas e outras frentes sem validação não viraram cases.

## Contato e domínio

O contato comercial é o WhatsApp **+55 (62) 98275-5571**, configurado em `src/data/site.ts`. Os botões abrem `https://wa.me/5562982755571` em uma nova aba. O site não incorpora o WhatsApp, nem utiliza formulário ou cookies de rastreamento; a conversa acontece no serviço externo.

O domínio de homologação confirmado é `https://conecta.victor.ferreira.nom.br`, já indicado em `.env.example` e no Compose. `SITE_URL` determina a origem HTTPS usada no build. Sem essa variável, o build local usa `noindex`, o robots bloqueia indexação e não são gerados canonical nem URLs fictícias no sitemap. Se a URL institucional definitiva for diferente, configure-a em `SITE_URL` e execute novamente o build e a verificação. O Nginx de homologação mantém `noindex` no cabeçalho HTTP, sem apagar canonical e sitemap.

## Publicação

O workflow verifica o projeto em pull requests e commits em `main`, e guarda somente `dist/` como artefato. O deploy fica desativado até configurar `DEPLOY_ENABLED`, domínio, ambiente e segredos. O domínio continua apontando para o cPanel.

Consulte [a configuração de cPanel e recuperação](docs/deploy.md). O pipeline exige SSH e rsync; se a conta tiver somente SFTP, adapte o transporte antes de habilitar a publicação. Não configure um segundo mecanismo de deploy concorrente.

Referências técnicas: [Astro: coleções de conteúdo](https://docs.astro.build/en/guides/content-collections/), [Astro: configuração estática](https://docs.astro.build/en/reference/configuration-reference/), [GitHub Actions: setup-node](https://github.com/actions/setup-node).
