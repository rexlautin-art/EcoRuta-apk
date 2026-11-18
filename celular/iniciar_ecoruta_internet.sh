#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "EcoRuta necesita Node.js (version 18 o superior). Instalalo desde https://nodejs.org y vuelve a ejecutar este archivo."
  exit 1
fi
echo "Abriendo EcoRuta con enlace por internet (la primera vez descarga cloudflared)."
echo "En Mac instala antes: brew install cloudflared"
exec node servidor/server.cjs --open --tunnel
