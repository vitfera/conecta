# Projetos e soluções digitais — plano de implementação

**Objetivo:** apresentar os sistemas indicados pelo titular como soluções digitais da Conecta, com descrições de negócio e páginas próprias, sem destacar modelo de contratação ou o termo SaaS.

**Arquitetura:** ampliar a coleção `projects` com dois formatos: soluções digitais e atuações institucionais. Soluções não recebem contratante, ano de contratação ou situação contratual fictícios. As páginas institucionais mantêm esses campos e suas exigências de revisão.

**Tecnologias:** Astro estático, Markdown, TypeScript e schemas Zod. As entradas de soluções alimentam Projetos, a home, Soluções e a página secundária de plataformas, sem duplicação dos dados.

## 1. Levantamento e diretrizes

- [x] Ler documentação e código de `imobiliaria`, `pesquisa_backend` e `RotaFacil` na pasta `htdocs`, sem alterar os repositórios de origem.
- [x] Confirmar com o titular que o sistema de eventos não está disponível nessa pasta; as outras pastas de bilheteria não são a referência indicada.
- [x] Receber a descrição do titular: venda de ingressos para eventos, geração direta na aplicação para o usuário e uso digital que dispensa papel.
- [x] Definir nomes descritivos: Plataforma imobiliária, Pesquisas e indicadores, Rota Fácil e Ingressos digitais para eventos.
- [x] Preservar a informação de que a nova versão imobiliária está em evolução; sua documentação informa que ainda não foi liberada.
- [x] Registrar este plano e o levantamento em commit.

### Informações sustentadas pelas fontes

| Solução                         | Base consultada                                                                                                           | Apresentação permitida nesta rodada                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plataforma imobiliária          | `imobiliaria/README.md`, documentação de catálogo, site público, ofertas, atendimento e rotas da versão 2                 | Catálogo de imóveis, ofertas de venda/locação, busca com mapa, apresentação de imobiliárias e organização do atendimento. Versão em evolução.                                             |
| Pesquisas e indicadores         | `pesquisa_backend/docs/LEVANTAMENTO_COMERCIAL.md`, rotas e controladores de pesquisas, instâncias, dashboard e relatórios | Criação de questionários, formulários públicos, organização de respostas e visualização de indicadores. Não incluir exportação avançada ou relatórios agendados, listados como pendentes. |
| Rota Fácil                      | Rotas e controladores de viagens, reservas, motoristas, veículos e encomendas                                             | Busca de viagens por origem/destino/data, reservas, gestão de viagens e acompanhamento de encomendas. Não afirmar frota ou operação comercial específica.                                 |
| Ingressos digitais para eventos | Descrição do titular nesta conversa                                                                                       | Venda e geração de ingressos na aplicação, com acesso digital pelo usuário. Não citar outras plataformas nem adicionar meios de pagamento, QR Code ou controles não informados.           |

Não copiar documentos internos, código dos outros projetos, dados de usuários, credenciais, marcas externas ou capturas com dados reais. A apresentação será textual e usará os ícones do próprio site.

## 2. Modelo editorial e testes

Arquivos: `src/lib/editorial-schema.ts`, `src/lib/project-schema.ts`, `src/lib/projects.ts`, `tests/projects.test.ts`.

- [x] Extrair o schema editorial comum e o schema institucional existente para módulos testáveis, preservando a política de publicação.
- [x] Executar testes que demonstrem a ausência de suporte a soluções sem contratante/ano, antes da ampliação do schema.
- [x] Implementar união discriminada por `kind`: `solution` e `engagement`.
- [x] Para soluções, exigir setor, natureza, público, funcionalidades, ordem, situação de apresentação e frentes de serviço relacionadas; rejeitar campos contratuais.
- [x] Para atuações institucionais, manter contratante, vínculo, localidade, ano e situação contratual, com resultados e entregas somente quando comprovados.
- [x] Testar publicação sem revisão, separação dos formatos e metadados sem valores fictícios.
- [x] Centralizar ordenação e apresentação dos metadados dos cards.
- [x] Executar `npm test` e `npm run check`; registrar a base em commit.

## 3. Conteúdo, páginas e integração

Arquivos: `src/content.config.ts`, `src/content/projects/*.md`, `src/components/ProjectCard.astro`, `src/components/ProjectFilters.astro`, `src/pages/projetos/*.astro`, `src/pages/index.astro`, `src/pages/solucoes/index.astro`, `src/pages/produtos.astro`, `src/styles/*.css`.

- [ ] Cadastrar as quatro soluções com revisão editorial e apenas as funcionalidades levantadas.
- [ ] Identificar o case institucional existente como `engagement`, mantendo-o sem publicação.
- [ ] Gerar detalhes de soluções com funcionalidades, público, situação de apresentação, serviços relacionados e contato por WhatsApp.
- [ ] Preservar os detalhes institucionais e os estados vazios.
- [ ] Reutilizar um card para home e catálogo, sem contratante, localidade ou ano fictícios em soluções.
- [ ] Exibir as quatro soluções na home e nos caminhos de Soluções e Plataformas, com links para os mesmos detalhes.
- [ ] Adaptar os filtros e ocultar dimensões com apenas um valor útil.
- [ ] Validar os quatro detalhes, navegação, filtros, ausência de rascunhos e sitemap; testar desktop, celular e fallback sem JavaScript.
- [ ] Atualizar o plano principal, README e relatório de verificação.
- [ ] Executar `npm test`, `npm run check`, `npm run build`, `npm run verify` e `git diff --check`; registrar a entrega em commit.

## Pendências que não bloqueiam esta apresentação

- Endereços públicos ou de demonstração das aplicações não foram informados; os links comerciais levam ao WhatsApp da Conecta.
- O sistema de eventos permanece sem código local para inspeção; a descrição do titular é a fonte dos textos desta rodada.
- Não afirmar disponibilidade imediata, clientes, volume de uso, prazos ou resultados comerciais a partir da presença dos repositórios locais.
