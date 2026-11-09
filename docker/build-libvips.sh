#!/bin/sh
set -eu

# Versão mínima exigida pelo Sharp 0.35.5 do lockfile. Hash do release oficial.
conecta_vips_version=8.18.7
conecta_vips_sha256=5baaead3b0bb20ffdb9e9ff09aa9fda08620923df77b63b436654cb5e0b3bf94
conecta_build_dir=$(mktemp -d)
trap 'rm -rf "$conecta_build_dir"' EXIT

curl --fail --silent --show-error --location \
    "https://github.com/libvips/libvips/releases/download/v${conecta_vips_version}/vips-${conecta_vips_version}.tar.xz" \
    --output "$conecta_build_dir/vips.tar.xz"
printf '%s  %s\n' "$conecta_vips_sha256" "$conecta_build_dir/vips.tar.xz" | sha256sum --check -
tar --extract --file "$conecta_build_dir/vips.tar.xz" --directory "$conecta_build_dir"

conecta_cpu_flags=""
if [ "$(uname -m)" = "x86_64" ]; then
    conecta_cpu_flags="-march=x86-64 -mtune=generic -mno-avx -mno-avx2"
fi

# Sem Highway/ORC: não gerar código vetorial que dependa de SSE4.2/AVX.
# JPEG, PNG, WebP e perfis de cor cobrem os assets e saídas deste projeto.
CFLAGS="-O2 ${conecta_cpu_flags}" CXXFLAGS="-O2 ${conecta_cpu_flags}" \
    meson setup "$conecta_build_dir/build" "$conecta_build_dir/vips-${conecta_vips_version}" \
    --prefix=/usr/local --libdir=lib --buildtype=release \
    -Dauto_features=disabled -Dcplusplus=true -Dexamples=false \
    -Dmodules=disabled -Dintrospection=disabled -Dhighway=disabled -Dorc=disabled \
    -Djpeg=enabled -Dpng=enabled -Dwebp=enabled -Dlcms=enabled
meson compile -C "$conecta_build_dir/build" -j 2
meson install -C "$conecta_build_dir/build" --no-rebuild
ldconfig
pkg-config --modversion vips-cpp
