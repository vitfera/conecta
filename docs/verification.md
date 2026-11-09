# Verificação do site

Verificado em 9 de novembro de 2026, após a criação do catálogo de Produtos. A prévia local permanece em `http://127.0.0.1:4321/`; o catálogo está em `/produtos/`.

## Comandos reproduzíveis

- `npm test`: 20 testes de publicação, datas, schemas de produtos e cases, atribuição de software livre e prioridade do carro-chefe.
- `npm run check`: tipos e componentes Astro sem erros, avisos ou sugestões.
- `npm run build`: 19 páginas estáticas, incluindo cinco detalhes de produto e imagens otimizadas.
- `npm run verify`: 514 links e assets, metadados únicos, ausência de rascunhos, WhatsApp, retirada de Conteúdos, destaque do Mapas Culturais e prévia sem indexação.
- `git diff --check`: verificação de espaços e conflitos.

## Navegador

Testes no Chrome instalado, com a biblioteca Playwright existente e um perfil temporário.

- 18 rotas navegáveis em 1440, 1024, 901, 900, 375 e 320 pixels, sem estouro horizontal.
- Produtos presente no menu, cinco páginas de detalhe e Mapas Culturais como destaque antes dos quatro sistemas complementares.
- Plataforma imobiliária com “Apresentação sob consulta” no card e no detalhe, incluindo conferência em 375 e 320 pixels.
- Menu mobile, acesso aos produtos e catálogo de serviços funcionando sem JavaScript.
- Link de pular para o conteúdo e transferência do foco por teclado.
- Link de WhatsApp com telefone confirmado e abertura em nova aba.
- 404 para a antiga seção Conteúdos, endereço inexistente e projeto sem liberação.
- Capturas desktop e mobile inspecionadas. Marca original e presença de turismo preservadas.

A atualização automática manteve um estado antigo de estilos e coleção durante a mudança. O servidor local foi reiniciado e a navegação foi repetida com sucesso no mesmo endereço.

## Cenários editoriais isolados

Uma cópia em diretório temporário validou, sem alterar a prévia do titular:

- Domínio configurado, canonical, robots e as cinco URLs de produto no sitemap.
- Produtos gerados somente em `/produtos/`; os sistemas não viraram cases institucionais.
- Retirada do produto de ingressos: detalhe e links removidos do build.
- Retirada do Mapas Culturais: ausência de destaque e links para detalhe não publicado, preservando o funcionamento da home.
- Todos os produtos em rascunho: estado vazio, noindex e ausência de detalhes e de entrada do catálogo no sitemap.
- Revisão editorial nula: build rejeitado pelo schema.

Os dados e as cópias desses cenários ficaram somente em `/tmp`. O conteúdo público não utiliza modelo de contratação, comparação comercial proibida, dados de usuário ou código dos repositórios consultados.

## Revisão e limites

A revisão independente não encontrou bloqueadores relevantes. Os textos de imobiliária, pesquisas e Rota Fácil foram sustentados por documentação e código locais. O texto do sistema de ingressos veio da descrição do titular. Endereços públicos de demonstração não foram informados, e a apresentação não promete disponibilidade imediata dos sistemas.

A publicação externa permanece desativada. SSH, rsync remoto, HTTPS e diretivas do Apache dependem da configuração da hospedagem. A validação local de acessibilidade não equivale a uma auditoria completa de conformidade WCAG.
