# Publicação no cPanel

## Configuração antes do primeiro deploy

O pipeline `.github/workflows/build-and-deploy.yml` publica somente os arquivos de `dist/`, por SSH e rsync. Ele fica desativado enquanto a variável de repositório `DEPLOY_ENABLED` não for `true`. Não há credenciais no código.

1. Em **Domínios** no cPanel, confirme o domínio de produção e copie o caminho exibido em **Document Root**. Confirme com a hospedagem o host, a porta e a disponibilidade de SSH e rsync. [Raiz do domínio no cPanel](https://docs.cpanel.net/knowledge-base/cpanel-product/how-domains-serve-content/)
2. Faça backup do conteúdo atual desse diretório. Reserve uma pasta exclusiva para este site: a sincronização remove arquivos que não existem no build para retirar páginas antigas e conteúdos despublicados.
3. O fluxo fornecido aceita `/home/USUARIO/public_html` ou uma subpasta desse caminho; também aceita diretórios como `/home2/USUARIO/public_html`. Se o domínio usar outra estrutura, ajuste e revise a validação do destino antes de habilitar o deploy.
4. Crie manualmente um arquivo vazio chamado `.conecta-static-site` no diretório exclusivo do site. O deploy verifica esse marcador antes de sincronizar. O marcador, `.well-known/` e `cgi-bin/` são preservados.
5. Confirme o DNS e o certificado do domínio no painel. Ative o redirecionamento para HTTPS conforme a configuração do provedor. [Certificados no cPanel](https://docs.cpanel.net/cpanel/security/ssl-tls-certificates/)
6. Crie uma chave SSH própria para deploy e autorize a chave pública nessa conta. Dê a ela somente o acesso necessário.
7. Confira a chave pública do servidor com o provedor por um canal confiável. Cadastre a linha correspondente em `CPANEL_KNOWN_HOSTS`; para porta diferente de 22, use o formato `[host]:porta`. Não confie apenas no resultado de uma consulta de rede sem validar a impressão digital.

## GitHub

Em **Settings → Environments**, crie `production` e configure as restrições de acesso e revisão desejadas. Em **Settings → Secrets and variables → Actions**, configure as variáveis de repositório:

| Variável         | Valor                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `SITE_URL`       | Origem HTTPS do domínio oficial, sem subpasta, parâmetros ou credenciais. Usada no build.              |
| `DEPLOY_ENABLED` | `true` somente depois de completar a configuração. Pode ser `false` para manter apenas CI e artefatos. |

No ambiente `production`, crie os segredos:

| Segredo              | Conteúdo                                                          |
| -------------------- | ----------------------------------------------------------------- |
| `CPANEL_HOST`        | Nome do servidor SSH.                                             |
| `CPANEL_PORT`        | Porta SSH; se vazia, usa 22.                                      |
| `CPANEL_USER`        | Usuário autorizado no cPanel.                                     |
| `CPANEL_PATH`        | Caminho absoluto do diretório exclusivo do site, sem barra final. |
| `CPANEL_SSH_KEY`     | Chave privada exclusiva para deploy.                              |
| `CPANEL_KNOWN_HOSTS` | Chave pública do servidor, com impressão digital conferida.       |

O build deve receber `SITE_URL` como variável de repositório, porque acontece antes do job do ambiente de produção. O deploy não inicia em pull requests. Os jobs de publicação são serializados para evitar duas sincronizações simultâneas; uma publicação em andamento não é cancelada pela próxima.

O job exige `index.html`, `.htaccess` e `_astro/` no artefato antes de abrir a conexão SSH. Ele usa um agente temporário e verifica a identidade do servidor pela chave cadastrada. As Actions estão fixadas em commits oficiais. [Ambientes de deploy do GitHub](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)

## Verificação antes de habilitar a publicação

Com a publicação desabilitada, execute o workflow manualmente na branch `main` com `SITE_URL` apontando para o domínio de produção. Confira o build e o artefato `conecta-dist-COMMIT`. Ele deve conter `index.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, `favicon.png` e `_astro/`. O conteúdo de `dist/` vai diretamente na raiz do domínio.

Para reproduzir a verificação local, use a origem HTTPS definitiva no lugar de `https://conecta.example.com`.

```sh
SITE_URL=https://conecta.example.com npm run build
SITE_URL=https://conecta.example.com npm run verify
```

## Validação após a primeira publicação

- Página inicial, seis soluções, contato e 404.
- HTTPS, canonical, Open Graph, `robots.txt` e `sitemap.xml` no domínio de produção.
- `/produtos/mapas-culturais/` com HTTP 200, canonical no domínio de produção e permissão de indexação no HTML e nos cabeçalhos.
- Ausência de projetos ainda não liberados e de rotas da antiga seção Conteúdos.
- `.htaccess` ativo e cabeçalhos servidos pelo Apache.
- Acesso por celular e navegação por teclado.

O `.htaccess` configura a página 404, a compressão e o cache. O cache de um ano é reservado aos arquivos versionados de `/_astro/`. Páginas, sitemap e favicon são revalidados, e os erros usam `no-store`. Teste essas regras no Apache. A execução da prévia do Astro valida o HTML, enquanto as diretivas dependem da configuração de `AllowOverride` do provedor. [Diretivas de cabeçalho do Apache](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)

Para verificar a indexação, use os passos da [revisão de SEO](seo.md#validação-para-produção).

## Recuperação de uma versão anterior

Cada build aprovado guarda um artefato chamado `conecta-dist-COMMIT`, com retenção de 30 dias. Para recuperar uma versão:

1. Defina `DEPLOY_ENABLED=false` para suspender novas publicações.
2. Baixe o artefato do commit escolhido na execução correspondente do GitHub Actions. Extraia-o em uma pasta local e confirme que contém `index.html`, `.htaccess` e `_astro/`.
3. Faça backup do estado atual e confira domínio, diretório exclusivo e marcador `.conecta-static-site`.
4. Reimplante somente o conteúdo desse artefato por SSH/rsync, com a mesma chave de host validada e as mesmas exclusões do pipeline. Uma sincronização de restauração deve retirar páginas que não pertencem ao artefato escolhido.
5. Verifique a página inicial, rotas, contato, metadados e versão restaurada.
6. Corrija a origem do problema em um commit, valide e só então reative `DEPLOY_ENABLED=true`.

O backup e o artefato permitem recuperação; o pipeline não afirma rollback automático ou troca atômica de toda a versão. O rsync adia a substituição de arquivos e a exclusão de versões antigas, mas uma publicação interrompida pode exigir reaplicação do build.
