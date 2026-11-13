# Atmosfera e movimento do Conecta

**Objetivo:** enriquecer as seções e interações com a paleta existente, mantendo o conteúdo, a navegação e o build estático. A implementação permaneceu sem commit durante a avaliação visual; após aprovar o resultado, o usuário autorizou os commits locais por etapa.

**Direção visual:** formas geométricas abertas, órbitas e degradês em azul e laranja nas bordas das seções. Variações para fundos claros, destaque do Mapas e seção escura. O texto fica em uma camada acima dos elementos decorativos. Evitar movimento contínuo automático.

**Arquitetura:** CSS compartilhado em `src/styles/motion.css`; comportamento progressivo em `src/scripts/motion.ts`, importado no layout. Pseudoelementos decorativos não adicionam conteúdo à árvore de acessibilidade. Sem bibliotecas ou dependências novas.

- [x] Criar barra fixa de 4 px acima do header; calcular progresso pela área rolável e atualizar em scroll, redimensionamento e restauração da página. Esconder a barra sem JavaScript.
- [x] Adicionar fundos às seções da home e páginas internas. Usar parallax limitado a 28 px e deslocamento pelo cursor limitado a 12 px, somente com mouse e sem preferência de movimento reduzido.
- [x] Marcar cards de serviços, produtos e projetos para brilho e inclinação de até 1,8 grau. Restaurar ao sair; manter foco de teclado visível e links utilizáveis sem JavaScript.
- [x] Animar sublinhado, indicador e posição dos itens do menu. Adicionar ícone do WhatsApp com efeitos em hover e foco. O usuário confirmou que apenas o WhatsApp será utilizado, sem outros perfis sociais.
- [x] Verificar no navegador a barra em início/meio/fim, restauração dos cards, teclado, desktop, celular, movimento reduzido e ausência de JavaScript. Conferir seções internas e erros de console.
- [x] Executar `npm test`, `npm run check`, `npm run build`, `npm run verify` e conferir formatação/diff. Manter a prévia em `http://127.0.0.1:4321/` para avaliação antes de versionar.

**Critérios de acessibilidade e desempenho:** nenhum conteúdo depende dos efeitos; sem loop de animação permanente; eventos agrupados por `requestAnimationFrame`, observação apenas de seções visíveis e eventos passivos de rolagem; movimento desativado com `prefers-reduced-motion` e em dispositivos sem apontador preciso. A barra continua informativa com movimento reduzido.

**Validação concluída:** resultados registrados em `docs/verification.md`. A revisão independente não encontrou findings acionáveis. O build estático também foi conferido no navegador, incluindo histórico, redimensionamento e página sem área rolável. O teste inicial de histórico lia a posição durante a restauração suave do próprio navegador; a instrumentação confirmou a chegada à posição original e o teste passou a aguardar essa condição, sem alterar a aplicação.

## Refinamento do banner da home

O usuário aprovou os efeitos gerais e pediu mais presença visual no banner. A composição recebe uma base orgânica azul com degradê, arcos laranja, pontos e órbitas, mantendo as quatro áreas e o texto existentes. A profundidade acompanha o cursor pelo comportamento já instalado, com fundos e etiquetas em direções diferentes; sem animação automática contínua. O refinamento fica em `src/styles/hero.css` e `ConnectionVisual.astro`, preservando as outras seções.

- [x] Conferir a composição em desktop e celular, sem sobreposição das quatro áreas ou corte de conteúdo.
- [x] Verificar preferência de movimento reduzido, parallax existente e build estático.
- [x] Atualizar os resultados e concluir a avaliação antes de versionar.

A rodada final passou em vinte larguras entre 320 e 1440 px, incluindo mouse nas duas bordas do banner. A revisão encontrou sobreposição causada pelos deslocamentos opostos das etiquetas em layouts compactos; elas permanecem fixas até 1200 px, mantendo o movimento independente da base azul. Preferência de movimento reduzido e resposta ao cursor conferidas. `check` sem diagnósticos; build de 21 páginas e verificação de 577 links/assets aprovados. A prévia foi reiniciada para limpar um erro de importação retido pelo HMR durante a criação do arquivo CSS.

## Versionamento aprovado

Após a aprovação visual, os commits locais foram autorizados em duas etapas: interações e atmosfera compartilhadas; composição do banner da home e documentação da validação. A publicação externa continua para uma etapa própria.
