@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title EcoRuta - mapa sin internet para la app

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Necesitas Node.js para esto. Instalalo desde https://nodejs.org ^(version LTS^) y vuelve a abrir este archivo.
  goto fin
)

node servidor\descargar_mapa.cjs

:fin
echo.
pause
