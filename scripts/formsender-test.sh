#!/bin/sh
# Run a local formsender in DRY_RUN mode for testing the request forms (README:
# "Testing the request forms"). Builds from a formsender checkout when
# FORMSENDER_SRC (default ../formsender) has one, otherwise uses the published
# image. Extra arguments go to "docker compose up", e.g. -d.
set -eu

cd "$(dirname "$0")/.."

src="${FORMSENDER_SRC:-../formsender}"
if [ -f "$src/Dockerfile" ] && [ -f "$src/request_handler.py" ]; then
  FORMSENDER_SRC="$(cd "$src" && pwd)"
  export FORMSENDER_SRC
  echo "Building formsender from $FORMSENDER_SRC"
  exec docker compose -f compose.yaml -f compose.formsender-src.yaml up --build "$@"
fi

echo "No formsender checkout at $src; using ${FORMSENDER_IMAGE:-ghcr.io/osuosl/formsender:master}"
exec docker compose -f compose.yaml up "$@"
