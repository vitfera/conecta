# Catálogo de Produtos — plano de implementação

**Objetivo:** reunir o Mapas Culturais e os quatro sistemas indicados pelo titular em Produtos, apresentando suas finalidades e funcionalidades.

**Arquitetura:** a coleção `products` alimenta o catálogo e cinco páginas individuais. Mapas Culturais é o carro-chefe, com destaque na home, em Soluções e no início de Produtos. Projetos permanece reservado a cases e atuações institucionais. Produtos não recebem contratante, ano ou resultados contratuais fictícios.

**Tecnologias:** Astro estático, Markdown, TypeScript, schemas Zod e CSS. O conteúdo é compartilhado entre os pontos de apresentação, com publicação condicionada à revisão editorial.

## 1. Levantamento e diretrizes

- [x] Ler documentação e código de `imobiliaria`, `pesquisa_backend` e `RotaFacil` em `htdocs`, sem alterar os repositórios de origem.
- [x] Confirmar com o titular que o sistema de eventos não está disponível nessa pasta; as outras pastas de bilheteria não são a referência indicada.
- [x] Receber a descrição do titular: venda de ingressos, geração direta na aplicação para o usuário e utilização digital que dispensa papel.
- [x] Adotar nomes descritivos: Plataforma imobiliária, Pesquisas e indicadores, Rota Fácil e Ingressos digitais para eventos.
- [x] Usar “Apresentação sob consulta” no card e na seção interna da Plataforma imobiliária, conforme solicitado pelo titular; não prometer disponibilidade imediata.
- [x] Reunir os cinco itens em Produtos e incluir essa seção no menu principal.
- [x] Priorizar o Mapas Culturais antes dos sistemas complementares e indicar a prestação de serviços sobre software livre.
- [x] Registrar o levantamento e as diretrizes em commit.

### Base dos textos

| Produto                         | Fonte consultada                                                                                              | Apresentação sustentada nesta rodada                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mapas Culturais                 | Briefing aprovado e coleção de serviços existente                                                             | Implantação, configuração, operação assistida de editais, formação e suporte. A Conecta não é proprietária do software livre.                              |
| Plataforma imobiliária          | `imobiliaria/README.md`, documentação de catálogo, site público, ofertas, atendimento e rotas da versão 2     | Catálogo, ofertas de venda/locação, busca com mapa, identidade da imobiliária e atendimento. Nova versão em evolução.                                      |
| Pesquisas e indicadores         | `pesquisa_backend/docs/LEVANTAMENTO_COMERCIAL.md`, rotas e controladores de pesquisas, dashboard e relatórios | Questionários, formulários públicos, organização de respostas e indicadores. Excluir exportação avançada e relatórios agendados, listados como pendentes.  |
| Rota Fácil                      | Rotas e controladores de viagens, reservas, motoristas, veículos e encomendas                                 | Busca por origem/destino/data, reservas, gestão de viagens e acompanhamento da situação de encomendas. Sem afirmar frota ou operação comercial específica. |
| Ingressos digitais para eventos | Descrição do titular nesta conversa                                                                           | Venda e geração do ingresso na aplicação e acesso digital pelo usuário. Sem acrescentar meios de pagamento, QR Code ou controles não informados.           |

Não copiar documentos internos, código de outros projetos, dados de usuários, credenciais, marcas externas ou capturas com dados reais. A apresentação usa os textos revisados e os ícones do próprio site.

## 2. Modelo editorial e testes

Arquivos: `src/lib/editorial-schema.ts`, `src/lib/product-schema.ts`, `src/lib/project-schema.ts`, `src/lib/products.ts`, `tests/*schema.test.ts`, `tests/product-helpers.test.ts`.

- [x] Extrair o schema editorial comum para testes diretos, preservando a política de publicação.
- [x] Modelar os produtos como aplicações ou serviços sobre plataformas; os segundos exigem atribuição explícita.
- [x] Validar setor, ordem, público, funcionalidades, situação de apresentação e serviços relacionados.
- [x] Rejeitar campos de contrato, cliente e resultados contratuais em produtos.
- [x] Preservar o modelo de cases institucionais com contratante, vínculo, ano e situação contratual.
- [x] Centralizar ordenação e rótulos de apresentação; o item em destaque precede os demais independentemente da ordem numérica.
- [x] Cobrir rejeição de revisão vazia, dados inventados, produto sem funcionalidades e serviço relacionado inválido.
- [x] Executar testes e checagem de tipos; registrar a base técnica em commit.

## 3. Catálogo, detalhes e integração

Arquivos: `src/content/products/*.md`, `src/components/FeaturedProduct.astro`, `src/components/ProductCard.astro`, `src/pages/produtos/*.astro`, `src/pages/index.astro`, `src/pages/solucoes/index.astro`, `src/pages/sitemap.xml.ts`, `src/styles/products.css`.

- [x] Cadastrar os cinco produtos e gerar os detalhes em `/produtos/[slug]/`.
- [x] Apresentar funcionalidades, público, situação, serviços relacionados e contato por WhatsApp em cada detalhe.
- [x] Colocar o Mapas Culturais em destaque na home, em Soluções e no início do catálogo.
- [x] Reunir os quatro sistemas complementares em cards vinculados aos detalhes em Produtos.
- [x] Incluir Produtos no menu e preservar Projetos para os cases institucionais, com rascunhos ocultos.
- [x] Manter todos os produtos sujeitos à revisão e retirar links, detalhes e sitemap quando despublicados.
- [x] Verificar desktop, celular, teclado, links e navegação sem JavaScript.
- [x] Atualizar plano principal, README e relatório de verificação.
- [x] Executar testes, tipos, build, inspeção de saída e `git diff --check`; registrar a entrega em commit.

## Limites desta apresentação

Os endereços públicos ou de demonstração das aplicações não foram informados; os links comerciais usam o WhatsApp da Conecta. O sistema de eventos não possui código local para inspeção; sua descrição foi fornecida pelo titular. Não afirmar disponibilidade imediata, clientes, volume de uso ou resultados comerciais a partir da presença dos repositórios locais.


## Evolução futura — destaque para Operacionalização da PNAB

Ideia registrada pelo titular em **20/11/2026**, para retomada futura.

- [ ] Incluir **Operacionalização da PNAB** em Produtos como outro destaque, mantendo o destaque do Mapas Culturais.
- [ ] Criar uma página dedicada com o mesmo cuidado visual e padrão de apresentação da página do Mapas Culturais, descrevendo o serviço prestado pela Conecta e seu valor para a gestão cultural.
- [ ] Usar o trabalho de Campo Mourão como referência para desenvolver o conteúdo, com base no escopo confirmado e ligação com o case existente em `/projetos/campo-mourao-pnab-2026/`.
- [ ] Prever a convivência dos dois destaques no catálogo, preservando a identidade visual aprovada e o contato pelo WhatsApp.
- [ ] Retomar o detalhamento e a revisão editorial antes da implementação. Esta anotação registra a ideia; a criação da página fica para uma etapa futura.
