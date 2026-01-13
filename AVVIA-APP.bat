@echo off
echo ========================================
echo    MOTO3 TRAINING PRO
echo    Avvio applicazione...
echo ========================================
echo.

cd /d "%~dp0"

echo Installazione dipendenze (se necessario)...
call bun install

echo.
echo Avvio server di sviluppo...
echo L'app si aprira' automaticamente nel browser
echo.
echo URL: http://localhost:5173
echo.
echo ========================================
echo Premi CTRL+C per fermare il server
echo ========================================
echo.

start http://localhost:5173

call bun run dev

pause
