# Docker Compose para homologação

## Arquitetura e requisitos

O projeto continua sendo um site Astro 7.4.7 com saída estática. O Docker executa `npm ci`, os testes, a checagem de tipos, o build e a verificação de `dist/` em **Node 24.22.2**. A imagem final contém Nginx Unprivileged **1.30.6** e os arquivos compilados. As duas imagens estão fixadas por versão e digest no Dockerfile.

O serviço `app` executa como UID/GID **101:101**, escuta em **0.0.0.0:8080** e publica a porta **3019** por padrão. O filesystem é somente leitura; apenas `/tmp` é temporário e gravável. Não há montagem do repositório, credenciais ou dependências do host. O healthcheck consulta a página inicial por HTTP.

Use Docker Engine com o plugin Compose que ofereça `up --wait`. O build precisa acessar os registros das imagens e o npm. Node não precisa estar instalado na VM para executar o Compose.

## Configuração

| Variável   | Padrão                                   | Uso                                                                                  |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `APP_PORT` | `3019`                                   | Porta HTTP publicada no host; a porta interna permanece 8080.                        |
| `SITE_URL` | `https://conecta.victor.ferreira.nom.br` | Origem HTTPS usada no build para canonical, sitemap, Open Graph e URL institucional. |

O Compose já possui esses padrões. Para personalizar, crie `.env` somente se ele ainda não existir e ajuste seus valores:

```bash
test -f .env || cp .env.example .env
docker compose config --quiet
```

`SITE_URL` é uma configuração de build: alterações exigem `--build`. Uma variável `SITE_URL` explicitamente vazia preserva o comportamento original sem canonical e sem URLs no sitemap. Nenhum arquivo `.env` entra no contexto ou é montado no contêiner.

O Docker de homologação envia `X-Robots-Tag: noindex, nofollow`, inclusive quando o build contém canonical e sitemap válidos. Essa restrição é própria deste servidor de homologação; não altera o build estático usado no cPanel. Se a URL institucional definitiva for diferente, configure `SITE_URL` com ela.

Antes de subir na VM, confira a porta escolhida. Para o padrão:

```bash
ss -ltn '( sport = :3019 )'
```

Se houver um listener, escolha outra porta livre em `APP_PORT`. A porta 3018 pertence a outra aplicação e não é utilizada por esta configuração. Uma colisão faz o Docker falhar ao publicar a porta; não há troca automática de porta.

## Operação

Execute na raiz do repositório:

```bash
docker compose up --build -d --wait
docker compose ps
docker compose logs -f app
docker compose down
```

Na VM, a origem é **http://192.168.3.85:3019**. Para mudar a porta, ajuste `APP_PORT` em `.env` e execute novamente `docker compose up --build -d --wait`; atualize também a origem do túnel na etapa de configuração externa.

Para conferir o serviço:

```bash
docker compose exec -T app id
docker compose exec -T app nginx -t
docker compose exec -T app wget -q -O /dev/null http://127.0.0.1:8080/
curl -I http://127.0.0.1:3019/
```

O healthcheck deve aparecer como `healthy`. Os logs são enviados para stdout/stderr e têm rotação configurada no Compose.

## CPU sem AVX/AVX2 e imagens

Não há Pagefind nem interface de busca neste projeto; nenhuma versão de Pagefind foi adicionada. Também não existem documentos públicos PDF para gerar ou indexar.

O teste com CPU `qemu64,-avx,-avx2` reproduziu `SIGILL` no binding Linux nativo do Sharp 0.35.5. Esse binding exige a microarquitetura x86-64-v2, incluindo SSE4.2. A mesma transformação funcionou com o perfil Nehalem sem AVX, isolando a exigência adicional do binding nativo.

O binding WebAssembly da mesma versão também foi testado, mas exige Wasm SIMD, indisponível nesse perfil de CPU. Por isso, o Docker compila **libvips 8.18.7 e o binding do Sharp 0.35.5 a partir dos fontes**, usando alvo x86-64 básico, sem AVX/AVX2, Highway ou ORC. O arquivo de release do libvips tem checksum SHA-256 fixado em `docker/build-libvips.sh`. As ferramentas `node-addon-api` e `node-gyp` estão fixadas no manifesto e lockfile; as versões existentes das dependências foram preservadas.

A otimização de imagens continua obrigatória: os retratos, a marca e as capas continuam recebendo versões WebP e tamanhos responsivos. A compilação inclui JPEG, PNG, WebP e perfis de cor, cobrindo os assets e formatos utilizados pelo projeto. A primeira construção compila essas bibliotecas e é mais demorada; as camadas ficam em cache nas seguintes. O runtime Nginx não contém Node, Sharp, compiladores ou dependências npm. O desenvolvimento local e o build estático fora do Docker preservam a seleção normal do Sharp para sua plataforma.

## Conteúdo, rascunhos e desenvolvimento

As regras editoriais são iguais no desenvolvimento e no build: conteúdo sem publicação, aprovação e revisão válida permanece oculto. Não existia um modo de revisão de rascunhos exclusivo do servidor de desenvolvimento. O Compose mantém todas as funcionalidades e os conteúdos aprovados de homologação, sem liberar rascunhos automaticamente.

O servidor Astro de desenvolvimento continua disponível por `npm run dev` para edição local. O Compose serve o resultado compilado: não precisa de WebSocket/HMR nem de configuração de `allowedHosts` do Astro. O Nginx identifica o hostname `conecta.victor.ferreira.nom.br` e também atende o acesso à origem por IP e o healthcheck local.

Alterações de conteúdo e assets entram após um novo build. O contexto é uma lista de inclusão explícita em `.dockerignore`; Git, pasta privada `conecta-solucoes/`, `.env`, dependências locais, backups, exportações e credenciais são excluídos, inclusive de diretórios admitidos.

## Cloudflare Tunnel e controle de acesso

Configuração prevista para uma etapa externa, com autorização:

| Campo                     | Valor                            |
| ------------------------- | -------------------------------- |
| Hostname público          | `conecta.victor.ferreira.nom.br` |
| Tipo do serviço de origem | HTTP                             |
| URL de origem             | `http://192.168.3.85:3019`       |
| HTTPS público             | Atendido pelo Cloudflare         |

O conector `cloudflared` precisa conseguir alcançar o IP e a porta de origem. Se ele estiver em outro contêiner, `localhost` se refere àquele contêiner; use o IP acima ou uma rede Docker compartilhada configurada para isso. Este Compose não cria nem altera o conector, DNS, registros ou credenciais do túnel.

Os redirects de diretórios são relativos, preservando o HTTPS público e evitando redirecionar o navegador para HTTP ou para a porta interna. O servidor de origem permanece HTTP e não força um segundo redirecionamento para HTTPS.

Para acesso restrito à homologação, configure uma aplicação Cloudflare Access para esse hostname e uma política que admita apenas os revisores. Restrinja também o acesso direto à porta da origem à rede e ao conector necessários, pois o acesso direto ao IP não passa pelo Access. O cabeçalho `noindex` controla indexação, não autenticação. Essas configurações externas não foram executadas nesta etapa.

## Verificação e diagnóstico

Em um ambiente com Node 24, a verificação HTTP reproduzível percorre páginas, imagens e assets, testa canonical, sitemap, redirects, 404 e proteção de arquivos internos:

```bash
node scripts/verify-docker.mjs http://127.0.0.1:3019 https://conecta.victor.ferreira.nom.br
```

Para diagnosticar o build e preservar seu código de saída:

```bash
docker compose --progress plain build app > /tmp/app-build.log 2>&1
conecta_build_status=$?
tail -n 150 /tmp/app-build.log
printf 'Código de saída do build: %s\n' "$conecta_build_status"
```

Registre a primeira mensagem de erro antes de alterar dependências. `Illegal instruction`/`SIGILL` indica uma instrução de CPU não suportada. Um encerramento forçado pode resultar em código 137, que deve ser distinguido do sinal original e de OOM usando os logs e a inspeção do contêiner.

Os resultados e limites da validação local ficam em [validação Docker](docker-validation.md). A configuração deve ser conferida também na VM e, posteriormente, pelo hostname público após a configuração autorizada do túnel.

Referências: [Node 24.22.2](https://nodejs.org/en/blog/release/v24.22.2), [Nginx Unprivileged](https://github.com/nginx/docker-nginx-unprivileged), [Sharp: instalação e WebAssembly](https://sharp.pixelplumbing.com/install/), [Docker Compose: serviços](https://docs.docker.com/reference/compose-file/services/), [Cloudflare: aplicação pública e Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/).
