# Verificação do site

A execução em Docker tem relatório próprio em [validação Docker](docker-validation.md), com build Linux, CPU emulada sem AVX/AVX2, healthcheck, portas, navegação e contexto de build. Este documento mantém o histórico das verificações do site.

## Atmosfera e movimento — 13 de novembro de 2026

Alteração mantida localmente sem commit durante a avaliação visual. Após aprovar os efeitos gerais e o refinamento do banner, o titular autorizou os commits locais por etapa. Fundos geométricos em azul e laranja, parallax limitado, contornos/sombras e brilho dos cards pelo cursor, barra de progresso acima do header e interações do menu e WhatsApp. Nenhuma dependência adicionada. O conteúdo e os destinos dos links foram preservados.

- `npm test`: 24 testes aprovados; `npm run check`: 47 arquivos, sem erros, avisos ou sugestões.
- `npm run build` e `npm run verify`: 21 páginas e 577 links/assets; imagens otimizadas e regras editoriais preservadas. O módulo de interação é incluído no HTML estático.
- Chrome local: progresso em 0%, 50% e 100%; parallax ao rolar; brilho/inclinação dos cards e retorno ao repouso; foco visível por teclado; hover do menu e WhatsApp.
- Dez páginas representativas no desktop, incluindo catálogos, detalhes, contato e Quem Somos, com imagens decodificadas e sem overflow horizontal. Header sem sobreposição em 1024, 1280 e 1440 pixels.
- Seis páginas principais em celular de 375 pixels; menu abre e navega para Produtos, imagens carregam e barra alcança 100%. Os fundos permanecem estáticos em dispositivos de toque.
- `prefers-reduced-motion: reduce`, inclusive alterado durante a sessão: sem parallax ou inclinação, mantendo o progresso da leitura. Navegação dos cards confirmada com JavaScript desativado; nesse cenário a barra é ocultada.
- Sem erros de página, console ou respostas HTTP de erro durante a rodada. Capturas desktop, cards, Quem Somos e celular inspecionadas.
- Build estático servido temporariamente na porta 4322: barra e efeitos do card funcionando; histórico restaura a rolagem e a barra acompanha a posição final; redimensionamento recalcula o progresso; página sem área rolável mantém zero. A leitura inicial do teste ocorria durante a restauração suave do navegador e foi corrigida para aguardar a posição original, sem alteração no site.
- Revisão independente de CSS e eventos sem problemas acionáveis.

O titular confirmou que apenas o WhatsApp será utilizado, sem outros perfis sociais. A validação desta alteração é local; não foi publicada na VM nem no domínio de homologação.

O refinamento posterior do banner da home acrescentou uma base orgânica azul, degradês mais presentes, arcos laranja e órbitas com pontos. As camadas respondem ao cursor sem animação automática contínua. A rodada final no Chrome passou em vinte larguras de 320 a 1440 px, com o mouse nas duas bordas, sem overflow ou sobreposição das quatro áreas. Para preservar a folga em telas compactas, as etiquetas permanecem fixas até 1200 px e a base azul conserva seu movimento independente. Movimento reduzido, capturas desktop/celular, `check`, build de 21 páginas e verificação de 577 links/assets conferidos. A revisão identificou a sobreposição nas primeiras versões e confirmou a correção da causa; a prévia foi reiniciada após o HMR reter temporariamente um erro de importação ao criar o arquivo de estilos.

## Histórico anterior

Verificado em 9 de novembro de 2026, após a implementação das histórias de Campo Mourão e Cianorte. A prévia local permanece em `http://127.0.0.1:4321/`; as histórias estão em `/projetos/`.

## Comandos reproduzíveis

- `npm test`: 24 testes de publicação, datas, schemas de produtos e projetos, atribuição de software livre, prioridade do carro-chefe, reconhecimento com beneficiário e fonte HTTP e conclusão com entrega confirmada.
- `npm run check`: tipos e componentes Astro sem erros, avisos ou sugestões.
- `npm run build`: 21 páginas estáticas, incluindo cinco detalhes de produto, duas histórias de projetos e imagens otimizadas.
- `npm run verify`: 577 links e assets, metadados únicos, ausência de rascunhos, WhatsApp, destaque do Mapas Culturais, histórias sem ficha técnica, reconhecimento coerente com o conteúdo e prévia sem indexação.
- `git diff --check`: verificação de espaços e conflitos.

## Navegador

Testes no Chrome instalado, com a biblioteca Playwright existente e um perfil temporário.

- 20 rotas navegáveis em 1440, 1024, 901, 900, 375 e 320 pixels, sem estouro horizontal.
- Campo Mourão e Cianorte com capas carregadas, título narrativo, contexto e participação da Conecta; cards compartilhados com a home e ordem preservada.
- Ausência de ficha técnica e filtros em Projetos; reconhecimento atribuído ao Município de Campo Mourão, com link para a notícia. Navegação para as histórias e retorno ao catálogo também funcionam sem JavaScript.
- Produtos presente no menu, cinco páginas de detalhe e Mapas Culturais como destaque antes dos quatro sistemas complementares.
- Plataforma imobiliária com “Apresentação sob consulta” no card e no detalhe, incluindo conferência em 375 e 320 pixels.
- Menu mobile, acesso aos produtos e catálogo de serviços funcionando sem JavaScript.
- Link de pular para o conteúdo e transferência do foco por teclado.
- Cabeçalho desktop visível durante a rolagem em 1440, 1024 e 901 pixels; menu mobile com rolagem normal em 900, 375 e 320 pixels.
- Altura do cabeçalho e da página preservadas durante a rolagem; títulos, links internos e elementos com foco permanecem abaixo do cabeçalho desktop.
- Área do retrato em proporção 3:4 e texto da equipe conferidos em 1440, 1024, 901, 900, 768, 375 e 320 pixels, sem estouro horizontal.
- Link de WhatsApp com telefone confirmado e abertura em nova aba.
- 404 para a antiga seção Conteúdos, endereço inexistente e projeto sem liberação.
- Capturas desktop e mobile inspecionadas. Marca original e presença de turismo preservadas.

A atualização automática manteve um estado antigo de estilos e coleção durante a mudança. O servidor local foi reiniciado e a navegação foi repetida com sucesso no mesmo endereço.

## Cenários editoriais isolados

Na rodada das histórias, uma cópia temporária validou:

- Domínio configurado: 21 páginas, canonical, indexação das histórias aprovadas e ambas as URLs no sitemap.
- Campo Mourão retirado da publicação: 20 páginas, sem sua rota, links ou reconhecimento no catálogo; Cianorte preservada.
- Todos os projetos em rascunho: 19 páginas, catálogo vazio com noindex, ausência de detalhes, seção da home e entradas de Projetos no sitemap.
- Produto Mapas Culturais em rascunho: histórias preservadas, sem links para o detalhe do produto retirado.
- Capas removidas: 21 páginas, composições decorativas e nenhum elemento de imagem quebrada para os projetos.

Na rodada anterior do catálogo, uma cópia temporária também validou:

- Domínio configurado, canonical, robots e as cinco URLs de produto no sitemap.
- Produtos gerados somente em `/produtos/`; os sistemas não viraram cases institucionais.
- Retirada do produto de ingressos: detalhe e links removidos do build.
- Retirada do Mapas Culturais: ausência de destaque e links para detalhe não publicado, preservando o funcionamento da home.
- Todos os produtos em rascunho: estado vazio, noindex e ausência de detalhes e de entrada do catálogo no sitemap.
- Revisão editorial nula: build rejeitado pelo schema.

Os dados e as cópias desses cenários ficaram somente em `/tmp`. O conteúdo público não utiliza modelo de contratação, comparação comercial proibida, dados de usuário ou código dos repositórios consultados.

## Foto de Victor Ferreira

Uma cópia temporária validou a inclusão de `src/assets/equipe/victor-ferreira.jpg` sem editar o componente e sem reiniciar o servidor. A imagem passou a aparecer no lugar das iniciais, com texto alternativo, versões otimizadas e proporção 3:4. O build dessa cópia verificou 19 páginas e 515 links e assets.

A retirada do arquivo restaurou as iniciais, sem imagem quebrada. O cenário utilizou um asset existente somente na cópia de teste. Posteriormente, o titular adicionou a foto real, com 977 × 1302 pixels, no caminho definido. A imagem foi detectada automaticamente, otimizada pelo build e conferida no navegador em 1440, 768, 375 e 320 pixels, preservando a proporção 3:4 e sem estouro horizontal. No projeto, o caminho e as dimensões recomendadas estão documentados em [orientação da foto](../src/assets/equipe/README.md).

## Fontes das histórias

O titular confirmou as implantações e aprovou a apresentação narrativa. As capas mostram apenas as primeiras telas públicas do [Mapa Campo Mourão Cultural](https://mapas.campomourao.pr.gov.br/) e do [Mapa Cultural Cianorte](https://cultura.cianorte.pr.gov.br/), conferidas com HTTP 200 no navegador e inspecionadas sem cadastros individuais.

O reconhecimento de Campo Mourão foi descrito conforme a [notícia da premiação](https://crn1.com.br/2026/08/campo-mourao-e-premiada-em-congresso-estadual-de-cidades-inteligentes-por-plataforma-cultural/amp), com atribuição ao município e ao projeto. Não se atribui prêmio à Conecta nem se especifica categoria ou classificação não confirmada. A implementação preserva a identificação do Mapas Culturais como software livre.

## Revisão e limites

A revisão independente não encontrou bloqueadores relevantes. Os textos de imobiliária, pesquisas e Rota Fácil foram sustentados por documentação e código locais. O texto do sistema de ingressos veio da descrição do titular. Endereços públicos de demonstração não foram informados, e a apresentação não promete disponibilidade imediata dos sistemas.

A publicação externa permanece desativada. SSH, rsync remoto, HTTPS e diretivas do Apache dependem da configuração da hospedagem. A validação local de acessibilidade não equivale a uma auditoria completa de conformidade WCAG.
