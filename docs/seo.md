# Revisão de SEO da Conecta Soluções

## Estado em 26/11/2026

A página inicial e a página de Mapas Culturais respondem com HTTP 200 no domínio de homologação. As respostas enviam `X-Robots-Tag: noindex, nofollow`. A página de Mapas Culturais tem um canonical para o próprio endereço, e o cabeçalho HTTP instrui o Google a excluí-la do índice. O Nginx de homologação aplica esse cabeçalho pelo `docker/nginx.conf`. [Diretivas de indexação do Google](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

O site gera HTML estático em português, títulos e descrições por página, URLs canônicas e um sitemap com os conteúdos publicados. A verificação do build compara o sitemap com os canonicals das páginas indexáveis. A home identifica a Conecta com dados estruturados `Organization` e `WebSite`. Os detalhes de produtos, soluções e projetos incluem `BreadcrumbList` quando o build tem origem configurada. [Nome do site](https://developers.google.com/search/docs/appearance/site-names) · [Breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## Mapas Culturais

A página `/produtos/mapas-culturais/` concentra o conteúdo sobre implantação e suporte de Mapas Culturais para prefeituras e instituições. O título e o H1 descrevem o serviço. O texto explica a plataforma livre, a configuração de editais e da PNAB, o treinamento e o suporte. A página reúne links para projetos publicados em Campo Mourão, Cianorte, Aparecida de Goiânia, Catalão e Uruaçu. A home e a solução de editais também apontam para ela.

Consultas para acompanhar no Google Search Console após a publicação:

- implantação de mapas culturais
- suporte mapas culturais
- mapas culturais para prefeituras
- mapas culturais PNAB
- conecta soluções mapas culturais

## Validação para produção

Na publicação autorizada, configure `SITE_URL` com a origem HTTPS definitiva e use o destino de produção. Confira o `robots.txt`, o sitemap, o canonical e a resposta HTTP da página inicial e de `/produtos/mapas-culturais/`. O Google precisa receber HTTP 200 e ter acesso às páginas destinadas à indexação. O teste em produção deve confirmar que essas URLs estão livres de `noindex` no HTML e nos cabeçalhos. [Requisitos técnicos do Google](https://developers.google.com/search/docs/essentials/technical)

Após publicar, selecione **Prefixo do URL** para `https://conectasolucoesweb.com.br/` no Search Console. Escolha o método **Google Analytics** e clique em **Verificar** com a mesma conta que tem permissão de edição na propriedade do Analytics. O build de produção inclui a tag no `<head>` da página inicial. Para uma propriedade do tipo **Domínio**, a verificação é feita por DNS. [Verificação de propriedade no Search Console](https://support.google.com/webmasters/answer/9008080?hl=pt-BR)

Na propriedade verificada, envie `/sitemap.xml`, inspecione a URL de Mapas Culturais e solicite a indexação após confirmar que a página está acessível. Use o relatório de desempenho para acompanhar consultas, impressões e cliques dessa URL. [Primeiros passos no Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start) · [Inspeção e solicitação de rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
