# Publicação no cPanel

## Configuração antes do primeiro deploy

O pipeline `.github/workflows/build-and-deploy.yml` publica somente os arquivos de `dist/`, por SSH e rsync. Ele fica desativado enquanto a variável de repositório `DEPLOY_ENABLED` não for `true`. Não há credenciais no código.

1. Confirme o domínio, a disponibilidade de SSH/rsync, a porta e o diretório raiz do domínio no cPanel.
2. Faça backup do conteúdo atual desse diretório. Reserve uma pasta exclusiva para este site: a sincronização remove arquivos que não existem no build para retirar páginas antigas e conteúdos despublicados.
3. O fluxo fornecido aceita `/home/USUARIO/public_html` ou uma subpasta desse caminho; também aceita diretórios como `/home2/USUARIO/public_html`. Se o domínio usar outra estrutura, ajuste e revise a validação do destino antes de habilitar o deploy.
4. Crie manualmente um arquivo vazio chamado `.conecta-static-site` no diretório exclusivo do site. O deploy verifica esse marcador antes de sincronizar. O marcador, `.well-known/` e `cgi-bin/` são preservados.
5. Ative HTTPS no cPanel e mantenha o DNS apontado para essa hospedagem. Configure o redirecionamento para HTTPS no painel, considerando a configuração real do provedor.
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

O job usa um agente SSH temporário e verifica o host estritamente. Não há fallback que desative a conferência de identidade do servidor. As Actions estão fixadas em commits oficiais.

## Primeiro teste

Prefira um domínio de homologação e uma pasta exclusiva antes de usar o domínio público. Configure o domínio correspondente em `SITE_URL`, execute o workflow manualmente na branch `main` e confira:

- Página inicial, seis soluções, contato e 404.
- HTTPS, canonical, Open Graph, `robots.txt` e `sitemap.xml`.
- Ausência de projetos ainda não liberados e de rotas da antiga seção Conteúdos.
- `.htaccess` ativo e cabeçalhos servidos pelo Apache.
- Acesso por celular e navegação por teclado.

O `.htaccess` desativa listagem de diretórios, configura a 404, compressão e cache dos recursos compilados. Recursos com cache longo devem ter nomes versionados, como os arquivos produzidos pelo Astro. Se o provedor bloquear alguma diretiva, revise o erro do Apache e adapte apenas a diretiva afetada. O servidor estático de prévia do Astro não interpreta `.htaccess`.

## Recuperação de uma versão anterior

Cada build aprovado guarda um artefato chamado `conecta-dist-COMMIT`, com retenção de 30 dias. Para recuperar uma versão:

1. Defina `DEPLOY_ENABLED=false` para suspender novas publicações.
2. Baixe o artefato do commit escolhido na execução correspondente do GitHub Actions. Extraia-o em uma pasta local e confirme que contém `index.html`, `.htaccess` e `_astro/`.
3. Faça backup do estado atual e confira domínio, diretório exclusivo e marcador `.conecta-static-site`.
4. Reimplante somente o conteúdo desse artefato por SSH/rsync, com a mesma chave de host validada e as mesmas exclusões do pipeline. Uma sincronização de restauração deve retirar páginas que não pertencem ao artefato escolhido.
5. Verifique a página inicial, rotas, contato, metadados e versão restaurada.
6. Corrija a origem do problema em um commit, valide e só então reative `DEPLOY_ENABLED=true`.

O backup e o artefato permitem recuperação; o pipeline não afirma rollback automático ou troca atômica de toda a versão. O rsync adia a substituição de arquivos e a exclusão de versões antigas, mas uma publicação interrompida pode exigir reaplicação do build.
