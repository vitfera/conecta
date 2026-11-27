# Publicação pelo Git do cPanel

O cPanel clona a `main`, executa o build definido em `.cpanel.yml` e publica o conteúdo de `dist/` na raiz do domínio. O GitHub Actions roda os testes e verifica o build a cada atualização da `main` ou pull request. [Fluxo de publicação por Git no cPanel](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/)

## Configuração inicial

1. No cPanel, confirme o **Document Root** do domínio de produção em **Domínios** e confira o certificado HTTPS. [Raiz do domínio no cPanel](https://docs.cpanel.net/knowledge-base/cpanel-product/how-domains-serve-content/)
2. Confirme a disponibilidade de Node, npm e rsync no shell da conta. A hospedagem validou o Node 24 e o npm em `/opt/alt/alt-nodejs24/root/usr/bin` e o rsync em `/usr/bin/rsync`. A tarefa prioriza o caminho do CloudLinux e também inclui os caminhos do EasyApache. [Node.js no cPanel](https://docs.cpanel.net/knowledge-base/general-server-administration/guide-to-node-js-installations/)
3. Abra **Git Version Control → Create**, selecione **Clone a Repository** e clone o repositório em uma pasta fora das raízes públicas, como `repositories/conecta`. Use a branch `main`. Para um repositório privado, configure o acesso de leitura do cPanel ao GitHub. [Acesso a repositórios privados](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-set-up-access-to-private-repositories/)
4. Na pasta do clone, crie `.env` com a origem e o caminho absoluto da raiz do domínio. Substitua os dois valores do exemplo pelos dados da conta.

   ```dotenv
   SITE_URL=https://conecta.example.com
   DEPLOYPATH=/home/usuario/public_html/conecta
   ```

5. Reserve a raiz do domínio para este site. Em uma pasta vazia, que pode conter `.well-known/` e `cgi-bin/`, o script cria o marcador `.conecta-static-site`. Se houver um site ou outros arquivos nessa pasta, faça backup e crie o marcador somente após confirmar que ela pode receber a sincronização do `dist/`.

## Publicação e atualizações

Em **Git Version Control → Manage → Pull or Deploy**, clique em **Update from Remote** e depois em **Deploy HEAD Commit**. O cPanel instala as dependências pelo lockfile, compila o site com `SITE_URL`, valida o build e sincroniza os arquivos na pasta definida em `DEPLOYPATH`. A sincronização retira páginas antigas e preserva `.well-known/`, `cgi-bin/` e o marcador. [Controles do Git Version Control](https://docs.cpanel.net/cpanel/files/git-version-control/)

O arquivo `.env` fica no clone, fora da raiz pública. O Apache serve os arquivos estáticos e aplica o `.htaccess` do build.

O build no cPanel limita a um worker o runtime do Rolldown (Tokio) e o pool do Rayon para reduzir o uso de threads na hospedagem compartilhada. [Configuração de workers do Rolldown](https://github.com/rolldown/rolldown/blob/v1.2.16/docs/guide/troubleshooting.md)

## Conferência após a publicação

- Página inicial e `/produtos/mapas-culturais/` respondem com HTTP 200 em HTTPS.
- `robots.txt`, `sitemap.xml` e canonical usam o domínio de produção. As páginas indexáveis permitem indexação no HTML e nos cabeçalhos.
- Uma rota inexistente retorna HTTP 404 e mostra a página de erro da Conecta.
- Imagens, favicon, menu e contato pelo WhatsApp funcionam no celular.

O `.htaccess` configura a página 404, a compressão e o cache. O cache de um ano fica restrito aos arquivos versionados de `/_astro/`. A aplicação dessas diretivas depende de `AllowOverride` na hospedagem. [Diretivas do Apache](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)

Para acompanhar a indexação, consulte a [revisão de SEO](seo.md#validação-para-produção). Para investigar falhas, consulte o log do deploy no cPanel e confirme as versões do Node e npm usadas pela tarefa. [Logs de deploy no cPanel](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-advanced-configuration-and-troubleshooting/)

## Recuperação

Para restaurar uma versão do site, reverta o commit indesejado na `main` e repita **Update from Remote → Deploy HEAD Commit**. Se precisar recuperar arquivos existentes antes da primeira publicação, use o backup da pasta do domínio.
