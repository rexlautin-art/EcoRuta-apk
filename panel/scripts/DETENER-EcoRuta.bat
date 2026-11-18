@echo off
rem Apaga el servidor de EcoRuta que quedo corriendo en segundo plano
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>nul
echo EcoRuta detenido.
timeout /t 2 >nul
