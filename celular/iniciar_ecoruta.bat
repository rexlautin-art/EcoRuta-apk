@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title EcoRuta - servidor

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

rem --- Firewall: permite que el celular llegue a este PC (solo redes privadas) ---
netsh advfirewall firewall show rule name=EcoRuta >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Para que el celular pueda conectarse, Windows debe permitir el puerto 3000 en redes privadas.
  choice /c SN /m " Permitirlo ahora, pide permiso de administrador"
  if not errorlevel 2 (
    powershell -NoProfile -Command "Start-Process netsh -Verb RunAs -Wait -ArgumentList 'advfirewall firewall add rule name=EcoRuta dir=in action=allow protocol=TCP localport=3000 profile=private'"
  )
)

node servidor\server.cjs --open
if errorlevel 1 (
  echo.
  echo  El servidor se detuvo con un error. Lee el mensaje de arriba.
)

:fin
echo.
pause
