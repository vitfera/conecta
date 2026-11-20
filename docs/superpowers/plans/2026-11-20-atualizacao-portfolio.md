# Conciliação do portfólio — 20 de novembro de 2026

**Objetivo:** conciliar o novo roteiro editorial local com o site existente, sem alterar marca, layout, produtos ou URLs publicadas. Usar a coleção e o schema atuais; manter o material de referência fora do Git e do build.

**Decisão editorial:** os seis contratos diretos terão descrições institucionais factuais; cinco atuações via instituições serão identificadas como colaboração. As oito experiências do responsável técnico serão detalhadas apenas na trajetória de Quem Somos, sem serem apresentadas como contratos da Conecta. O texto institucional da OEI não incluirá produtos, imagens ou dados do contrato. Propostas e produtos adicionais sem liberação ficam apenas no inventário de pendências.

- [x] Inventariar os dois projetos existentes e todos os itens do roteiro; registrar comparação, ação, slug, evidência fornecida e pendências em `docs/auditoria-portfolio-2026-11-20.md`.
- [x] Atualizar Campo Mourão e Cianorte nos slugs atuais. Preservar o reconhecimento atribuído ao município; não divulgar data incoerente do atestado. Cianorte terá escopo contratado, sem classificação de conclusão documental.
- [x] Incluir quatro contratos diretos e cinco colaborações em `src/content/projects/`, com revisão editorial explícita, sem valores ou documentos brutos. Distinguir Campo Mourão PNAB da implantação anterior e Aparecida 2026 da colaboração de 2024.
- [x] Reutilizar `ProjectStoryCard`, `ProjectCover` e as páginas existentes. Manter a listagem narrativa contínua, explicitar os vínculos nos textos e priorizar Vozes Periféricas e o Portal da Cultura de Aparecida na home. Legenda de plataforma em funcionamento somente quando houver capa real aprovada.
- [x] Ampliar a trajetória em `src/pages/quem-somos.astro` com os oito resumos, mantendo experiências individuais fora da lista de clientes diretos. Manter essa trajetória separada dos cases da empresa em Quem Somos.
- [x] Verificar classificação, ausência de dados sensíveis, cards, rotas, sitemap e rascunhos; executar testes, check, build e verify. Conferir desktop, celular e prévia local, sem publicação externa.
- [x] Registrar commits locais por etapa e entregar o relatório com resultados efetivos e limites da evidência.

**Evidência:** o novo Markdown e a matriz anterior são fontes fornecidas pelo titular. Os instrumentos citados não serão tratados como originais inspecionados se não estiverem disponíveis. A confirmação anterior de uso das plataformas não substitui aceite documental do contrato. Nenhum resultado, estatística, endosso ou autorização de marca será inferido.

**Correção do titular durante a execução:** o Prêmio Nacional Vozes Periféricas usa a plataforma Mapa da Cultura, do Ministério da Cultura. Essa informação prevalece sobre a referência a Mapas Culturais no roteiro original. A OEI permanece como contratante; não se presume tecnologia subjacente ou propriedade da plataforma.

**Ajuste de apresentação solicitado pelo titular:** restaurar a listagem contínua de histórias em Projetos, sem títulos de grupos ou etiquetas públicas de contratação direta. Os vínculos permanecem nos textos e nos metadados editoriais; não se altera a identidade visual anterior.

**Resultados:** 24 testes, check de 47 arquivos sem diagnósticos, 30 páginas e 812 links/assets. Cinco cenários de domínio/retirada e QA desktop/celular/sem JavaScript aprovados. A referência cruzada encontrada na revisão foi corrigida e sua retirada isolada validada. Detalhamento no relatório de auditoria.
