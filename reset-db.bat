@echo off
echo ============================
echo RESET DE LA BASE DE DONNEES
echo ============================

cd /d "%~dp0backend"

echo.
echo Arret du backend sur le port 5678...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5678" ^| findstr "LISTENING"') do taskkill /PID %%a /F

echo.
echo Restauration de database.sqlite...

git restore database.sqlite

echo.

echo.
echo Base restauree !
pause