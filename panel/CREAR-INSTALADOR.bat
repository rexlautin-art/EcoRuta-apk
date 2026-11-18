@echo off
chcp 65001 >nul
setlocal
title EcoRuta - Creando instalador

rem Pedir permisos de administrador (necesarios para que electron-builder funcione bien en Windows)
net session >nul 2>&1
if errorlevel 1 goto pedirAdmin
goto sigue
:pedirAdmin
echo Pidiendo permisos de administrador...
powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
exit /b
:sigue

cd /d "%~dp0"
echo.
echo  ==============================================
echo    EcoRuta Admin - Creador del instalador
echo  ==============================================
echo.

where node >nul 2>nul
if not errorlevel 1 goto hayNode
echo  Node.js no esta instalado. Intentando instalarlo solo...
where winget >nul 2>nul
if errorlevel 1 goto sinNode
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
set "PATH=%PATH%;%ProgramFiles%\nodejs"
where node >nul 2>nul
if errorlevel 1 goto sinNode
:hayNode

echo  [1/2] Instalando dependencias, puede tardar varios minutos...
call npm install
if errorlevel 1 goto falla

echo  [2/2] Creando el instalador, puede tardar varios minutos...
call npm run dist
if errorlevel 1 goto falla

echo.
echo  LISTO. Tu instalador esta en la carpeta "release":
echo  EcoRuta-Setup-(version).exe
start "" "%~dp0release"
pause
exit /b 0

:sinNode
echo  No se pudo instalar Node.js. Instala la version LTS desde https://nodejs.org y vuelve a intentar.
start https://nodejs.org/es/download
pause
exit /b 1

:falla
echo.
echo  Algo fallo. Copia el error que aparece arriba y enviaselo a Claude.
pause
exit /b 1
