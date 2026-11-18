@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title EcoRuta - servidor (internet)

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  EcoRuta necesita Node.js para el servidor y no esta instalado.
  where winget >nul 2>nul
  if errorlevel 1 (
    echo  Descargalo desde https://nodejs.org ^(version LTS^), instalalo y vuelve a abrir este archivo.
    goto fin
  )
  echo.
  choice /c SN /m " Quieres instalarlo ahora con winget"
  if errorlevel 2 goto fin
  winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
  set "PATH=%PATH%;%ProgramFiles%\nodejs"
  where node >nul 2>nul
  if errorlevel 1 (
    echo.
    echo  Node.js se instalo, pero esta ventana aun no lo ve.
    echo  Cierrala y vuelve a hacer doble clic en iniciar_ecoruta.bat
    goto fin
  )
)

echo.
echo  Abriendo EcoRuta con enlace por internet. La primera vez descarga cloudflared (unos MB).
echo  El enlace aparece abajo y en la app del PC: Enviar ^> Conectar celulares.
echo.
node servidor\server.cjs --open --tunnel
if errorlevel 1 (
  echo.
  echo  El servidor se detuvo con un error. Lee el mensaje de arriba.
)

:fin
echo.
pause
