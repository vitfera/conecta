# Validação Docker — 9 de novembro de 2026

## Ambiente efetivamente utilizado

Testes locais em Docker Desktop, engine Linux/amd64 29.7.2 e Compose 5.3.1, acessados pelo macOS. Build com Node 24.22.2; runtime Nginx Unprivileged 1.30.6. O perfil de CPU foi emulado com QEMU user mode, `qemu64,-avx,-avx2`.

O domínio informado pelo titular é `https://conecta.victor.ferreira.nom.br/`. As requisições de teste atingiram o Docker local, não esse domínio público. A origem prevista para a VM continua sendo `http://192.168.3.85:3019`.

## Resultados

| Verificação                              | Resultado efetivo                                                                                       | Código |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| `docker compose config --quiet`          | Configuração válida; `APP_PORT` padrão 3019 e alvo 8080                                                 | 0      |
| Build Linux com `npm ci`                 | Lockfile respeitado; 24 testes, Astro check sem erros, 21 páginas e 577 links/assets                    | 0      |
| `docker compose up --build -d --wait`    | Serviço `app` iniciado e `healthy`                                                                      | 0      |
| Usuário e filesystem                     | UID/GID 101:101, `ReadonlyRootfs=true`, somente `/tmp` temporário, capabilities removidas               | 0      |
| `nginx -t`                               | Sintaxe e configuração válidas                                                                          | 0      |
| Verificação HTTP em 3019                 | 20 páginas, 16 assets, 15 imagens e nenhum documento público                                            | 0      |
| `APP_PORT=13019`                         | Serviço publicado na porta alternativa; mesma validação HTTP aprovada                                   | 0      |
| `docker compose down` e novo `up --wait` | Serviço restaurado e saudável em 3019                                                                   | 0      |
| Chrome em 1440 e 375 px                  | Navegação, menu mobile, ausência de overflow e imagens decodificadas                                    | 0      |
| Contexto Docker                          | 72 arquivos admitidos; assets, testes e helpers presentes; 12 sentinelas de arquivos privados excluídas | 0      |
| Catálogos vazios em cópia isolada        | Build de 14 páginas; HTTP percorreu 13 páginas e 7 imagens com os estados vazios preservados            | 0      |
| Revisão independente final               | Ajuste do verificador de sitemap confirmado; sem achados adicionais                                     | —      |

A verificação HTTP também confirmou canonical e sitemap no domínio HTTPS, `X-Robots-Tag: noindex, nofollow`, cache de assets compilados, cabeçalhos de segurança, redirects relativos e 404 real. `.env`, `.git`, `.htaccess`, fontes, manifesto e pasta privada não são servidos por HTTP.

Não há Pagefind, interface de busca ou documentos públicos PDF neste projeto. Nenhuma geração de busca foi removida ou tornada opcional.

## Compatibilidade de CPU: investigação e correção

| Etapa                                                       | Evidência                                                                                   | Resultado                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Node 24.22.2 em `qemu64,-avx,-avx2`                         | `node --version`                                                                            | Código 0                                                                             |
| Sharp 0.35.5 precompilado em qemu64                         | `uncaught target signal 4 (Illegal instruction)` na carga nativa e na otimização de imagens | SIGILL observado; os processos presos no emulador foram encerrados, código final 137 |
| Mesmo Sharp em `Nehalem,-avx,-avx2`                         | Conversão mínima para WebP, 68 bytes                                                        | Código 0; a ausência de AVX isoladamente não era a causa                             |
| Binding WebAssembly oficial 0.35.5 em qemu64                | `WebAssembly.Module(): Wasm SIMD unsupported`; Astro encapsulou como `MissingSharp`         | Código 1; alternativa rejeitada                                                      |
| libvips 8.18.7 e Sharp 0.35.5 compilados para x86-64 básico | Conversão mínima e build Astro completo, com cache de imagens removido antes do teste       | Código 0, 40 segundos no teste completo                                              |
| Nginx da imagem final em qemu64                             | 20 páginas, 16 assets e 15 imagens conferidos por HTTP                                      | Código 0                                                                             |

A correção final compila libvips e o binding do Sharp, sem `-march=native`, AVX/AVX2, Highway ou ORC. O checksum do release libvips é conferido antes da compilação. JPEG, PNG, WebP e perfis de cor estão habilitados. A otimização permaneceu obrigatória e todas as imagens foram geradas no teste com cache limpo.

As versões existentes das dependências npm não foram alteradas. Foram acrescentadas somente as ferramentas de build `node-addon-api@8.9.2` e `node-gyp@12.4.0`, com versões exatas no manifesto e lockfile. O binding WebAssembly não é a solução utilizada pelo Docker final.

A emulação cobriu o processo Node de build do Astro, seus bindings carregados e a execução HTTP do Nginx. Ela não substitui uma execução na VM real nem emula seu kernel ou sua rede.

## Falhas auxiliares e regressão corrigida

- A tentativa inicial de reutilizar um QEMU dinâmico sem suas bibliotecas retornou 127 (`libcapstone.so.4` ausente). O teste foi transferido para o emulador estático do pacote oficial Debian; não houve alteração de bibliotecas da aplicação para resolver esse erro de ferramenta.
- O teste inicial de contexto com Dockerfile diretamente em `/tmp` falhou ao ler um atributo protegido do macOS. O Dockerfile de prova foi movido para a própria cópia controlada. As sentinelas privadas permaneceram excluídas. A regra de `scripts/` foi refinada para também excluir o verificador HTTP que não é usado no build.
- A revisão encontrou uma exigência incorreta no verificador HTTP: os catálogos vazios navegáveis eram cobrados no sitemap. O erro foi reproduzido com código 1 em `/produtos/`. O verificador passou a considerar a indexabilidade no HTML; a mesma cópia vazia e o site completo passaram com código 0.

## Reprodução e logs

Operação normal:

```bash
docker compose up --build -d --wait
docker compose ps
node scripts/verify-docker.mjs http://127.0.0.1:3019 https://conecta.victor.ferreira.nom.br
```

Para repetir a emulação em um host que disponha de `qemu-x86_64-static`, primeiro construa o estágio de build:

```bash
docker build --target build \
  --build-arg SITE_URL=https://conecta.victor.ferreira.nom.br \
  -t conecta-build-cpu .
docker run --rm --user node --ulimit core=0 \
  --mount type=bind,src=/usr/bin/qemu-x86_64-static,dst=/opt/conecta-qemu,readonly \
  --entrypoint sh conecta-build-cpu -c '
    node -e "const fs=require(\"node:fs\"); for(const p of [\".astro\",\"dist\",\"node_modules/.astro\"]) fs.rmSync(p,{recursive:true,force:true})" &&
    /opt/conecta-qemu -cpu qemu64,-avx,-avx2 /usr/local/bin/node node_modules/astro/bin/astro.mjs build &&
    /opt/conecta-qemu -cpu qemu64,-avx,-avx2 /usr/local/bin/node scripts/verify-build.mjs
  '
```

Esse emulador é uma ferramenta de diagnóstico opcional, não faz parte da imagem final. No teste local, o binário estático foi extraído de um pacote oficial Debian em um contêiner temporário; nada foi instalado no host.

Logs completos desta sessão ficaram somente em `/tmp`: `conecta-docker-baseline-build.log`, `conecta-cpu-qemu64-build.log`, `conecta-cpu-qemu64-wasm-build.log`, `conecta-cpu-qemu64-baseline-build.log`, `conecta-context-check-final.log` e `conecta-empty-catalog-before.log`. Os resultados permanentes estão registrados neste documento; esses arquivos temporários não são pré-requisitos para executar o projeto.

## Confirmações pendentes na VM e no acesso público

Em 9 de novembro de 2026, o titular compartilhou o log de build executado em `vitfera@docker:~/conecta`, após clonar o repositório. O build terminou com `Image conecta-app Built`: 24 testes aprovados, Astro check sem erros, 21 páginas, otimização de imagens concluída e 577 links/assets verificados. Isso confirma o build no ambiente informado pelo titular, além dos testes locais e emulados descritos acima.

O comando mostrado foi `docker compose --progress plain build app`; o trecho do Conecta não inclui a inicialização do serviço. Uma consulta HTTP posterior a `http://192.168.3.85:3019/` retornou `ECONNREFUSED`. A execução e o healthcheck na VM ainda precisam ser confirmados com `docker compose up -d --wait` e `docker compose ps`.

A porta 3019 estava disponível para bind no host local. Uma tentativa TCP para `192.168.3.85:3019`, antes de qualquer implantação remota, foi recusada (`connect_ex=61` no macOS). Isso não confirma a disponibilidade por bind, firewall ou execução do Compose na VM.

Ainda é necessário iniciar o serviço na VM e verificar o acesso à origem a partir do conector `cloudflared`. Configuração de túnel, DNS, HTTPS público e Cloudflare Access não foi executada nesta etapa. A validação pelo hostname público depende dessa configuração externa autorizada.

O serviço Docker local permaneceu saudável em `http://127.0.0.1:3019/`, e a prévia Astro existente em 4321 foi preservada. Os contêineres temporários de CPU e catálogos vazios foram encerrados.
