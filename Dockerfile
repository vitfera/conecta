FROM node:24.22.2-bookworm-slim@sha256:01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9 AS build

ENV ASTRO_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential ca-certificates curl meson ninja-build pkg-config python3 \
    libglib2.0-dev libexpat1-dev libjpeg62-turbo-dev libpng-dev libwebp-dev liblcms2-dev \
    && rm -rf /var/lib/apt/lists/*
COPY docker/build-libvips.sh /usr/local/bin/build-libvips
RUN sh /usr/local/bin/build-libvips
ENV SHARP_FORCE_GLOBAL_LIBVIPS=1
WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Compilar também o binding do Sharp evita o requisito x86-64-v2 do precompilado.
RUN conecta_cpu_flags=""; \
    if [ "$(uname -m)" = "x86_64" ]; then conecta_cpu_flags="-march=x86-64 -mtune=generic -mno-avx -mno-avx2"; fi; \
    CFLAGS="-O2 ${conecta_cpu_flags}" CXXFLAGS="-O2 ${conecta_cpu_flags}" npm explore sharp -- npm run build \
    && node -e "const sharp=require('sharp'); console.log('Sharp compilado:',sharp.versions.sharp,'libvips:',sharp.versions.vips)"

COPY --chown=node:node astro.config.mjs tsconfig.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node tests ./tests
COPY --chown=node:node scripts/verify-build.mjs ./scripts/verify-build.mjs

ARG SITE_URL=""
ENV SITE_URL=${SITE_URL}
RUN npm test && npm run check && npm run build && npm run verify

FROM nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS app

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

USER 101:101
EXPOSE 8080
STOPSIGNAL SIGQUIT
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/"]

ENTRYPOINT ["nginx", "-g", "daemon off;"]
