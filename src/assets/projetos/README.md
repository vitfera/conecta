# Capas das histórias de projetos

O portfólio combina capturas públicas aprovadas e ilustrações conceituais próprias. O componente `ProjectCover.astro` associa as capas ao slug do Markdown e gera versões WebP responsivas.

## Capturas públicas preservadas

Capturas das primeiras telas públicas, inspecionadas antes da inclusão. Mostram somente o cabeçalho e a apresentação das plataformas, sem áreas autenticadas ou perfis individuais.

| Arquivo                            | Origem                                 |
| ---------------------------------- | -------------------------------------- |
| `campo-mourao-mapas-culturais.png` | <https://mapas.campomourao.pr.gov.br/> |
| `cianorte-mapas-culturais.png`     | <https://cultura.cianorte.pr.gov.br/>  |

Dimensões: **1440 × 600 px**, proporção **12:5**. As marcas e o conteúdo das capturas pertencem às respectivas plataformas e instituições. As imagens documentam os projetos apresentados; não representam autoria da Conecta sobre o software livre Mapas Culturais.

## Ilustrações dos novos cases

Geradas com a ferramenta integrada `image_gen`, na paleta azul e laranja da Conecta, com 1942 × 809 px, em composição panorâmica próxima de 12:5. São ilustrações sobre os contextos dos projetos. Não reproduzem telas reais, relatórios, documentos, marcas institucionais ou fotografias de participantes. O case Vozes Periféricas continua identificado no texto como atuação na plataforma Mapa da Cultura do MinC; a arte não representa sua interface.

| Arquivo                                                  | Tema                                               |
| -------------------------------------------------------- | -------------------------------------------------- |
| `premio-nacional-vozes-perifericas.illustration.png`     | Participação, território e conexões digitais       |
| `aparecida-portal-da-cultura-pnab-2026.illustration.png` | Portal, processos culturais e orientação técnica   |
| `campo-mourao-pnab-2026.illustration.png`                | Organização e apoio à operacionalização do fomento |
| `raias-do-amanha-comunicacao.illustration.png`           | Comunicação e coordenação de diferentes mídias     |
| `uruacu-lpg-2024.illustration.png`                       | Mapeamento e organização de atividades culturais   |
| `aparecida-lpg-2024.illustration.png`                    | Colaboração e apoio digital à cultura              |
| `catalao-pnab-2024-2025.illustration.png`                | Processos, projetos culturais e análise técnica    |
| `uruacu-pnab-2024-2025.illustration.png`                 | Conexões entre plataforma cultural e processos     |
| `goiania-mapa-goiano-brasil-criativo.illustration.png`   | Território, conhecimento e colaboração             |

Os [prompts completos](../../../docs/imagegen/2026-11-20-capas-projetos.md) registram o briefing de cada imagem.

O sufixo `.illustration.png` identifica o tipo editorial da capa. Uma captura em `<slug>.png` tem precedência; uma ilustração em `<slug>.illustration.png` recebe legenda conceitual nos detalhes. A legenda de plataforma em funcionamento é exclusiva das capturas. As ilustrações são decorativas e têm `alt` vazio; o conteúdo está no título, resumo e texto do case.

O enquadramento dos cards e cabeçalhos continua em **12:5**. As ilustrações preenchem esse espaço com `object-fit: cover`, sem deformação. Uma capa ausente mantém a composição neutra de segurança, sem imagem quebrada.
