#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Necesitas Node.js (version 18 o superior). Instalalo desde https://nodejs.org y vuelve a ejecutar este archivo."
  exit 1
fi
exec node servidor/descargar_mapa.cjs
