# Site institucional Conecta Soluções

## Decisões de origem

Implementação do briefing e da especificação técnica fornecidos pelo titular em 9 de novembro de 2026. O pacote `conecta-solucoes/` permanece exclusivamente local e ignorado pelo Git. A marca está aprovada; utilizar o PNG fornecido, sem redesenho. Somente o arquivo de marca necessário à aplicação será incorporado ao código.

## Experiência

Site institucional em português brasileiro, com navegação entre Início, Quem Somos, Soluções, Projetos, Conteúdos e Contato. Seis páginas de soluções, página secundária de plataformas, privacidade e 404 completam a estrutura. A home apresenta o posicionamento aprovado, as frentes de atuação, a abordagem e os caminhos para conhecer a empresa ou iniciar uma conversa.

Direção visual: composição editorial contemporânea, azul institucional como base, laranja como acento, fundo branco e neutros claros, tipografia sem serifa local, espaços amplos, títulos expressivos e ilustração abstrata discreta de conexões. Preservar integralmente os elementos e as proporções da marca. Não usar imagens genéricas, métricas inventadas ou marcas de clientes.

## Arquitetura

Astro com saída estática, TypeScript estrito e CSS responsivo. Componentes compartilhados para navegação, rodapé, títulos, cards e contato. Coleções Markdown `services`, `projects`, `posts` e `products`, com schemas Zod e consulta centralizada que exige publicação e revisão editorial. Páginas individuais são geradas somente para entradas liberadas.

Projetos sem liberação não aparecem em HTML, rotas, sitemap ou dados estruturados. Os catálogos exibem estados vazios úteis. Experiência do responsável técnico aparece separada dos contratos da empresa. Mapas Culturais é identificado como software livre sobre o qual a empresa presta serviços.

## Contato, privacidade e SEO

E-mail confirmado pelo titular nesta conversa: `victor@victorferreira.com.br`. Contato direto por `mailto`, sem formulário inoperante, cookies ou ferramentas de rastreamento. A privacidade descreve esse funcionamento.

Domínio não confirmado: configurar por `SITE_URL`. Sem domínio, a prévia permanece não indexável, sem canonical ou sitemap com endereço fictício. A configuração de domínio habilita canonical, Open Graph, robots e sitemap com URLs reais. A publicação exige HTTPS e configuração do ambiente.

## Verificação e entrega

Validar tipos, build, bloqueio de rascunhos, rotas, links internos, metadados e navegação responsiva. Verificar teclado, foco, contraste, redução de movimento e ausência de estouro horizontal em prévia local quando disponível. Commits locais por etapa, sem publicação ou push implícitos.

Pipeline GitHub Actions para instalação reproduzível, verificações e build. Deploy cPanel por SSH/rsync exclusivamente de `dist/`, habilitado por configuração do ambiente e segredos; validação da chave do servidor obrigatória. Documentar configuração e recuperação por artefato anterior.
