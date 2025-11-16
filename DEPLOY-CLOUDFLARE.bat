@echo off
echo ========================================
echo    MOTO3 TRAINING PRO
echo    Deploy su Cloudflare
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Elimino worker esistente...
call bunx wrangler delete my-react-app -y

echo.
echo Step 2: Build applicazione...
call bun run build

echo.
echo Step 3: Deploy su Cloudflare...
call bunx wrangler deploy --config wrangler.jsonc

echo.
echo ========================================
echo Deploy completato!
echo ========================================
echo.

pause
