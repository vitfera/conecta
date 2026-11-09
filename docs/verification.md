# Verificação da primeira versão

Verificado em 9 de novembro de 2026. A prévia local permanece em `http://127.0.0.1:4321/` para acompanhamento.

## Comandos reproduzíveis

- `npm test`: nove testes da política editorial e das datas de revisão.
- `npm run check`: tipos e componentes Astro sem erros, avisos ou sugestões.
- `npm run build`: 15 páginas estáticas, com imagens da marca otimizadas.
- `npm run verify`: 407 links e assets, rotas, metadados únicos, ausência de rascunhos e prévia sem indexação.
- `git diff --check`: verificação de espaços e conflitos.

## Navegador

Testes executados no Chrome instalado, usando uma sessão temporária e sem alterar o perfil do usuário. A ferramenta de navegação compartilhada não iniciou corretamente neste ambiente; a validação usou diretamente a biblioteca Playwright já instalada e o Chrome existente.

- 14 rotas navegáveis em 1440, 900, 375 e 320 pixels, sem estouro horizontal.
- Abertura do menu mobile e navegação até as páginas internas.
- Navegação do menu e catálogo de soluções com JavaScript desabilitado.
- Link de pular para o conteúdo e transferência do foco por teclado.
- Contato por `mailto` com o endereço confirmado e assunto preenchido.
- 404 para endereço inexistente e para o projeto sem liberação.
- Capturas desktop e mobile inspecionadas; barra de ferramentas de desenvolvimento desativada.

## Cenários editoriais isolados

Uma cópia em diretório temporário foi usada para testar, sem modificar a prévia do usuário:

- Domínio de teste: canonical, Open Graph, robots e sitemap gerados para a origem configurada.
- Dois projetos e um artigo sintéticos, explicitamente aprovados: apareceram na home, nos catálogos, nos detalhes e no sitemap; o cenário gerou 18 páginas e passou pela inspeção do build.
- Filtros de projetos: seleção, combinação sem resultados, limpeza e anúncio de quantidade.
- Catálogo de projetos sem JavaScript: todos os projetos publicados continuam visíveis e os filtros permanecem ocultos.
- Todas as plataformas retiradas da publicação: estado vazio, noindex e exclusão da rota do sitemap.
- Revisão editorial nula: o build foi rejeitado pelo schema.

O código e os dados sintéticos desses cenários ficaram somente em `/tmp`; não foram incluídos no repositório ou no build entregue.

## Revisão e limites

A revisão independente não deixou bloqueadores adicionais. Foram corrigidos a coerção indevida de datas vazias, o estado vazio de plataformas e o contraste do foco na seção azul.

O workflow tem YAML e sintaxe Bash verificados, com Actions fixadas em revisões oficiais. A publicação está desativada. SSH, rsync remoto, HTTPS e diretivas do Apache precisam de validação no cPanel quando domínio, infraestrutura e credenciais forem configurados. A verificação local de acessibilidade não equivale a uma auditoria completa de conformidade WCAG.
