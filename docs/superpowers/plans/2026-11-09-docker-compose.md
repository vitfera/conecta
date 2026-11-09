# Docker Compose para homologação — plano de implementação

> Execução nesta sessão, com commits locais por etapa, conforme o escopo fornecido pelo titular. Preservar a prévia local existente e não configurar DNS, túnel ou publicação externa.

**Objetivo:** executar o site estático em Docker Compose, com porta externa `${APP_PORT:-3019}`, origem HTTP acessível pelo túnel e runtime sem privilégios.

**Arquitetura:** build em Node 24.22.2 com npm e lockfile existente, seguido de Nginx Unprivileged 1.30.6 em `0.0.0.0:8080`. Imagens fixadas por versão e digest. Copiar apenas o build para a imagem final; filesystem somente leitura e `/tmp` temporário. Sem bind mounts do repositório.

## Levantamento

- [x] Verificar instruções locais, README, documentação, scripts, lockfile e configuração Astro. Não há AGENTS.md aplicável no checkout ou nos diretórios ascendentes.
- [x] Identificar Astro 7.4.7, npm lockfile v3, Node mínimo 22.23.4 e referência de desenvolvimento Node 24.
- [x] Confirmar ausência de Pagefind, busca e documentos públicos PDF; preservar as imagens e todas as páginas existentes.
- [x] Confirmar que a regra editorial oculta rascunhos tanto em desenvolvimento quanto no build. A homologação não precisa de servidor de desenvolvimento ou HMR.
- [x] Verificar a porta local 3019 e a conectividade TCP com `192.168.3.85:3019`, sem modificar a VM. A confirmação de disponibilidade por bind na VM será documentada separadamente.
- [ ] Registrar o commit do plano.

## Contêineres e operação

Arquivos: `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.example`, `.nvmrc`, `docker/nginx.conf` e `docs/docker.md`.

- [ ] Usar `npm ci`, executar testes, tipos, build e verificação na imagem de build; preservar o manifesto e o lockfile enquanto não houver falha que justifique alteração.
- [ ] Executar Nginx como UID/GID 101, com healthcheck HTTP, logs em stdout/stderr, 404 real, arquivos ocultos protegidos e cabeçalhos equivalentes ao Apache.
- [ ] Configurar Compose com `${APP_PORT:-3019}:8080`, reinício controlado, filesystem somente leitura, `/tmp` temporário e nenhuma montagem do código ou credenciais.
- [ ] Aplicar uma lista explícita de inclusão no contexto: manifesto, lockfile, configuração Astro/TS, fontes/assets, arquivos públicos, testes, verificação e configuração Nginx. Excluir Git, `.env`, pacote privado, dependências locais, backups e exportações.
- [ ] Preservar `SITE_URL` no build para canonical, sitemap e URL institucional. Manter homologação fora da indexação por cabeçalho HTTP; sem URL institucional configurada, preservar o bloqueio existente.
- [ ] Executar `docker compose config --quiet`, build com saída completa, inicialização com `--wait`, healthcheck, inspeção do usuário e arquivos, navegação, imagens, 404 e porta alternativa.
- [ ] Testar dependências nativas e Nginx em CPU emulada sem AVX/AVX2; registrar comandos, saídas e falhas antes de alterar dependências ou configuração.
- [ ] Registrar o commit de implementação validada.

## Documentação e encerramento

- [ ] Documentar domínio de homologação ainda não informado, origem `http://192.168.3.85:3019`, terminação HTTPS no Cloudflare e conectividade do conector.
- [ ] Explicar por que não há configuração de host do Astro ou teste de HMR nesse modo estático; não expor o servidor de desenvolvimento como homologação.
- [ ] Documentar controle de acesso via Cloudflare Access e rede de origem, sem configurar serviços externos nesta rodada. A prévia de rascunhos não é habilitada implicitamente.
- [ ] Registrar testes locais efetivos e os limites da confirmação na VM, com comandos de diagnóstico e códigos de saída.
- [ ] Solicitar revisão independente, corrigir achados confirmados e atualizar README.
- [ ] Fazer o commit final, preservar o checkout e a prévia local para acompanhamento.
