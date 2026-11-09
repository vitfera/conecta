# Conecta Soluções

Site institucional em português brasileiro, construído com Astro, TypeScript e CSS. O build gera arquivos estáticos para hospedagem Apache/cPanel; não requer Node no servidor de produção.

## Desenvolvimento local

Use Node 24 LTS (a versão de referência está em `.nvmrc`).

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
- `src/content/`: serviços, projetos, artigos e plataformas em Markdown.
- `src/content.config.ts`: schemas de conteúdo.
- `src/lib/`: consultas e regras de publicação.
- `src/data/site.ts`: identificação, contato e navegação.
- `src/assets/conecta-logo.png`: cópia fiel da marca rasterizada aprovada; o Astro entrega versões otimizadas. Não existe SVG aprovado neste projeto.
- `public/.htaccess`: configuração do Apache, cache e página 404.
- `scripts/verify-build.mjs`: inspeção do build final.

A pasta **`conecta-solucoes/` é material de referência local e não é versionada**. Ela não é necessária para instalar ou compilar um clone do projeto. Não coloque contratos, documentos pessoais ou credenciais em `public/` ou nas coleções.

## Conteúdo e revisão editorial

Uma entrada aparece no site somente quando tem publicação explícita, status aprovado e data válida de revisão:

```yaml
publish: true
publicationStatus: aprovado
reviewedAt: 2026-11-09
```

Omitir esses campos mantém a entrada oculta. Uma revisão com data futura também não publica a entrada. As listas, a home, as páginas individuais e o sitemap usam a mesma regra. Para retirar uma entrada, defina `publish: false` e publique um novo build.

Os seis serviços e a apresentação dos serviços sobre Mapas Culturais seguem o briefing fornecido. O projeto e o artigo de preparação permanecem em revisão e não são incluídos no site. Antes de liberar um projeto, confira contratante, vínculo, escopo, direitos de divulgação e evidência de cada entrega e resultado. Um contrato firmado não comprova conclusão. Experiências individuais do responsável técnico são apresentadas separadamente.

## Contato e domínio

O e-mail confirmado é `victor@victorferreira.com.br`; fica em `src/data/site.ts`. O site usa contato direto por e-mail, sem formulário, cookies de rastreamento ou dependência de um serviço de envio.

O domínio definitivo ainda precisa ser informado. Copie `.env.example` para `.env` e preencha `SITE_URL` com a origem HTTPS real, por exemplo no formato `https://DOMINIO-OFICIAL`. Sem essa variável, a prévia usa `noindex`, o robots bloqueia indexação e não são gerados canonical nem URLs fictícias no sitemap. Com a variável definida, execute novamente o build e a verificação.

## Publicação

O workflow verifica o projeto em pull requests e commits em `main`, e guarda somente `dist/` como artefato. O deploy fica desativado até configurar `DEPLOY_ENABLED`, domínio, ambiente e segredos. O domínio continua apontando para o cPanel.

Consulte [a configuração de cPanel e recuperação](docs/deploy.md). O pipeline exige SSH e rsync; se a conta tiver somente SFTP, adapte o transporte antes de habilitar a publicação. Não configure um segundo mecanismo de deploy concorrente.

Referências técnicas: [Astro: coleções de conteúdo](https://docs.astro.build/en/guides/content-collections/), [Astro: configuração estática](https://docs.astro.build/en/reference/configuration-reference/), [GitHub Actions: setup-node](https://github.com/actions/setup-node).
