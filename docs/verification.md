# Verificação do site

Verificado em 9 de novembro de 2026, após os ajustes de contato, navegação e turismo. A prévia local permanece em `http://127.0.0.1:4321/` para acompanhamento.

## Comandos reproduzíveis

- `npm test`: nove testes da política editorial e das datas de revisão.
- `npm run check`: tipos e componentes Astro sem erros, avisos ou sugestões.
- `npm run build`: 14 páginas estáticas, com imagens da marca otimizadas.
- `npm run verify`: 340 links e assets, rotas, metadados únicos, ausência de rascunhos, contato por WhatsApp, retirada de Conteúdos e prévia sem indexação.
- `git diff --check`: verificação de espaços e conflitos.

## Navegador

Testes executados no Chrome instalado, usando a biblioteca Playwright existente e uma sessão temporária sem alterar o perfil do usuário.

- 13 rotas navegáveis em 1440, 900, 375 e 320 pixels, sem estouro horizontal.
- Abertura do menu mobile e navegação até as páginas internas.
- Menu e catálogo de soluções funcionando com JavaScript desabilitado.
- Link de pular para o conteúdo e transferência do foco por teclado.
- Botão de contato para `https://wa.me/5562982755571`, com telefone **+55 (62) 98275-5571** e abertura em nova aba.
- Nenhum link de e-mail ou da seção Conteúdos no build. A antiga rota `/conteudos/` retorna 404.
- 404 para endereço inexistente e para o projeto sem liberação editorial.
- Capturas desktop e mobile inspecionadas. Gestão, Tecnologia, Cultura e Turismo presentes na ilustração, sem sobreposição entre etiquetas ou sobre o texto central nas quatro larguras.

## Build com domínio configurado

Uma cópia em diretório temporário foi usada para testar `SITE_URL` com uma origem de teste, sem modificar a prévia do usuário. O build com 14 páginas passou pela inspeção, incluindo canonical, robots, sitemap e ausência da rota retirada de Conteúdos.

## Revisão e limites

A revisão independente desta rodada não encontrou bloqueadores relevantes. A logomarca original e a proteção editorial foram preservadas. Projetos SaaS continuam aguardando as informações do titular.

A publicação está desativada. SSH, rsync remoto, HTTPS e diretivas do Apache precisam de validação no cPanel quando domínio, infraestrutura e credenciais forem configurados. A verificação local de acessibilidade não equivale a uma auditoria completa de conformidade WCAG.
