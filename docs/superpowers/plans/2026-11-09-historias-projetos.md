# Histórias de projetos — plano de implementação

> Execução nesta sessão, tarefa por tarefa, com verificações e commits por etapa. Direção aprovada pelo titular na conversa; prévia no checkout atual para acompanhamento local.

**Objetivo:** apresentar Campo Mourão e Cianorte como histórias de projetos, com contexto, imagens e participação da Conecta.

**Arquitetura:** coleção Markdown existente, esquema editorial preservado, cards e capas compartilhados entre catálogo e home. Detalhes narrativos substituem a ficha técnica. Sem novas dependências ou JavaScript de navegação.

**Tecnologias:** Astro estático, TypeScript, CSS e otimização de imagens do Astro.

## 1. Registrar a direção aprovada

- [x] Revisar os textos aprovados, a confirmação das implantações e os componentes existentes.
- [x] Registrar o escopo em [design aprovado](../specs/2026-11-09-historias-projetos-design.md).
- [x] Conferir formatação e registrar o commit de planejamento.

## 2. Conteúdo e apresentação

Arquivos: `src/lib/project-schema.ts`, `tests/project-schema.test.ts`, `src/content/projects/campo-mourao-mapas-culturais.md`, `src/content/projects/cianorte-mapas-culturais.md`, `src/components/ProjectCover.astro`, `src/components/ProjectStoryCard.astro`, `src/assets/projetos/`, `src/pages/projetos/index.astro`, `src/pages/projetos/[slug].astro`, `src/pages/index.astro`, `src/styles/projects.css` e `src/styles/global.css`.

- [ ] Acrescentar testes para reconhecimento com beneficiário e fonte HTTP obrigatórios e para conclusão com entrega confirmada; executar `node --test tests/project-schema.test.ts` e confirmar as falhas antes de alterar o esquema.
- [ ] Adicionar `storyTitle` opcional, `order` inteiro positivo com padrão 100 e `recognition` opcional (`title`, `recipient`, `description`, `sourceUrl` HTTP). Preservar os campos editoriais existentes. Rejeitar conclusão sem `verifiedDeliveries`.
- [ ] Publicar as duas histórias com `publish: true`, `publicationStatus: aprovado` e `reviewedAt: 2026-11-09`, conforme confirmação e aprovação do titular. Cadastrar as entregas informadas, sem inventar métricas.
- [ ] Capturar as primeiras telas públicas de `https://mapas.campomourao.pr.gov.br/` e `https://cultura.cianorte.pr.gov.br/`; inspecionar as imagens antes de incluí-las em `src/assets/projetos/`.
- [ ] Implementar `ProjectCover` com imagens locais por slug, otimização e alternativa decorativa sem imagem quebrada. Implementar `ProjectStoryCard` com título narrativo, resumo, imagem e chamada para conhecer o projeto.
- [ ] Usar os cards no catálogo e na home, ordenados por `order`; retirar o componente de filtros e a apresentação pública de ano/localidade.
- [ ] Substituir a ficha contratual no detalhe por texto narrativo, capa, links e reconhecimento atribuído ao município. Manter o estado vazio quando não há publicação.
- [ ] Executar `npm test`, `ASTRO_TELEMETRY_DISABLED=1 npm run check`, `ASTRO_TELEMETRY_DISABLED=1 npm run build`, `npm run verify` e `git diff --check`. Resultado esperado: testes e tipos aprovados, 21 páginas estáticas com os dois detalhes, links locais válidos.
- [ ] Registrar o commit de implementação após as verificações.

## 3. Validação e documentação

Arquivos: `scripts/verify-build.mjs`, `README.md`, `docs/verification.md` e este plano.

- [ ] Estender a verificação do build para cobrir projetos publicados no sitemap, ausência de ficha técnica e atribuição do reconhecimento.
- [ ] Conferir 20 rotas em 1440, 1024, 901, 900, 375 e 320 pixels; testar imagens carregadas, ordem dos dois projetos, reconhecimento, teclado, menu móvel e navegação sem JavaScript.
- [ ] Em uma cópia temporária, retirar os projetos da publicação e confirmar estado vazio, ausência dos detalhes e dos links na home e no sitemap; conferir também os dois projetos com domínio configurado.
- [ ] Solicitar revisão independente do diff e corrigir eventuais problemas confirmados.
- [ ] Atualizar o relatório com os resultados efetivamente observados, orientar a manutenção dos textos e imagens no README e registrar o commit final. Preservar a prévia local ativa.
