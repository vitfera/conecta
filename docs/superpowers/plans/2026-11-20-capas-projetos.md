# Capas para os novos projetos — 20 de novembro de 2026

**Objetivo:** substituir o visual genérico dos nove novos cases por ilustrações próprias, mantendo as duas capturas públicas aprovadas e a identidade visual do site.

**Direção:** capas editoriais panorâmicas em azul e laranja, com formas e cenas relacionadas ao contexto de cada caso. Sem logotipos, brasões, participantes, telas internas ou simulação de evidência de entrega. As ilustrações terão legenda conceitual; a legenda de plataforma real permanece exclusiva das capturas.

- [x] Gerar e inspecionar uma capa para cada novo case com a ferramenta de imagens integrada.
- [x] Salvar os nove arquivos em `src/assets/projetos/<slug>.illustration.png`, sem substituir as capturas existentes.
- [x] Adaptar `ProjectCover.astro` e o ajuste de enquadramento para distinguir ilustração, captura e ausência de capa.
- [x] Preservar a verificação que impede apresentar ilustrações como telas de plataforma em funcionamento.
- [x] Documentar origem, prompts e arquivos; validar tipos, build, imagens, desktop e celular.
- [x] Registrar a melhoria em commit local e manter a prévia disponível.

**Validação:** nove PNGs de 1942 × 809 px, duas capturas originais intactas, WebP responsivo, legenda conceitual e ausência de placeholders nos onze cases atuais. Check de 47 arquivos, build de 30 páginas e verify de 832 links/assets aprovados; QA desktop/celular e decodificação das imagens sem erros. Prompts completos em `docs/imagegen/2026-11-20-capas-projetos.md`.
