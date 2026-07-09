#!/usr/bin/env bash
# Re-vendors Bootstrap into assets/. Bump BS_VERSION and run from the repo root.
set -euo pipefail
BS_VERSION=5.3.8
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

curl -sL -o "$tmp/src.tar.gz" \
  "https://github.com/twbs/bootstrap/archive/refs/tags/v${BS_VERSION}.tar.gz"
curl -sL -o "$tmp/dist.zip" \
  "https://github.com/twbs/bootstrap/releases/download/v${BS_VERSION}/bootstrap-${BS_VERSION}-dist.zip"

tar -xzf "$tmp/src.tar.gz" -C "$tmp" "bootstrap-${BS_VERSION}/scss" "bootstrap-${BS_VERSION}/LICENSE"
unzip -qo "$tmp/dist.zip" -d "$tmp" "bootstrap-${BS_VERSION}-dist/js/bootstrap.bundle.min.js"

rm -rf assets/scss/bootstrap
mkdir -p assets/scss/bootstrap assets/js/vendor
cp -r "$tmp/bootstrap-${BS_VERSION}/scss/." assets/scss/bootstrap/
cp "$tmp/bootstrap-${BS_VERSION}/LICENSE" assets/scss/bootstrap/LICENSE
cp "$tmp/bootstrap-${BS_VERSION}-dist/js/bootstrap.bundle.min.js" assets/js/vendor/

echo "Vendored Bootstrap ${BS_VERSION}"
