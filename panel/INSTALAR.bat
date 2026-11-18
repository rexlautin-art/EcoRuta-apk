@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title EcoRuta - Instalacion automatica
echo.
echo  ==============================================
echo    EcoRuta Admin - Instalacion automatica
echo  ==============================================
echo.

where node >nul 2>nul
if not errorlevel 1 goto hayNode

echo  [1/4] Node.js no esta instalado. Intentando instalarlo solo...
where winget >nul 2>nul
if errorlevel 1 goto sinNode
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
set "PATH=%PATH%;%ProgramFiles%\nodejs"
where node >nul 2>nul
if errorlevel 1 goto sinNode

:hayNode
echo  [1/4] Node.js listo.

if exist node_modules goto yaDeps
echo  [2/4] Instalando dependencias. Puede tardar varios minutos, no cierres esta ventana...
call npm install
if errorlevel 1 goto falla
goto depsOk
:yaDeps
echo  [2/4] Dependencias ya instaladas.
:depsOk

if exist dist\index.html goto yaBuild
echo  [3/4] Compilando la aplicacion...
call npm run build
if errorlevel 1 goto falla
goto buildOk
:yaBuild
echo  [3/4] Aplicacion ya compilada.
:buildOk

echo  [4/4] Creando accesos directos con el icono de EcoRuta...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\crear-acceso-directo.ps1"

echo.
echo  Listo. Abriendo EcoRuta...
echo  Desde ahora usa el icono "EcoRuta" del escritorio.
echo.
wscript "%~dp0scripts\iniciar.vbs"
timeout /t 4 >nul
exit /b 0

:sinNode
echo.
echo  No se pudo instalar Node.js automaticamente.
echo  Se abrira la pagina de descarga. Instala la version LTS,
echo  y luego vuelve a hacer doble clic en INSTALAR.bat
start https://nodejs.org/es/download
pause
exit /b 1

:falla
echo.
echo  Algo fallo. Copia el mensaje de error que aparece arriba y enviaselo a Claude.
pause
exit /b 1
