@echo off
cls
echo ========================================================
echo   PUBBLICAZIONE WEB APP - MOTO3 PILOT TRAINER
echo ========================================================
echo.
echo Questo script prepara la web app per la pubblicazione!
echo.
echo --------------------------------------------------------
echo.

REM Controlla se siamo nella directory corretta
if not exist "mobile-app" (
    echo ERRORE: Devi eseguire questo script dalla cartella del progetto!
    echo        Vai nella cartella preparatoreatleticomoto3app-2955 e riprova.
    pause
    exit /b 1
)

cd mobile-app

echo OK: Directory corretta trovata!
echo.
echo --------------------------------------------------------
echo.

REM Controlla Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRORE: Node.js non trovato!
    echo        Installa Node.js da: https://nodejs.org/
    echo        Poi riavvia il computer e riprova.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo OK: Node.js trovato: %NODE_VERSION%
echo.
echo --------------------------------------------------------
echo.

REM Installa dipendenze se necessario
if not exist "node_modules" (
    echo PASSO 1: Installazione dipendenze...
    echo         (Questo puo richiedere 2-5 minuti)
    echo.
    call npm install --legacy-peer-deps
    echo.
    echo OK: Dipendenze installate!
) else (
    echo OK: PASSO 1: Dipendenze gia installate!
)

echo.
echo --------------------------------------------------------
echo.
echo PASSO 2: Creazione build web...
echo         (Questo puo richiedere 1-2 minuti)
echo.

REM Crea build web
call npx expo export --platform web

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRORE: Build fallita!
    echo        Controlla gli errori sopra.
    pause
    exit /b 1
)

echo.
echo OK: Build completata!
echo.
echo --------------------------------------------------------
echo.
echo PASSO 3: La tua web app e pronta!
echo.
echo La trovi in: mobile-app\dist\
echo.
echo --------------------------------------------------------
echo.
echo COME PUBBLICARLA ONLINE:
echo.
echo METODO 1 - NETLIFY DROP (PIU FACILE):
echo   1. Vai su: https://app.netlify.com/drop
echo   2. Trascina la cartella "dist" nella finestra
echo   3. Ricevi il link subito!
echo.
echo METODO 2 - VERCEL:
echo   1. Vai su: https://vercel.com/new
echo   2. Importa il progetto da GitHub
echo   3. Deploy automatico!
echo.
echo METODO 3 - GITHUB PAGES:
echo   1. Vai su Settings del repository
echo   2. Abilita GitHub Pages
echo   3. Seleziona branch e folder /docs
echo.
echo --------------------------------------------------------
echo.
echo Leggi PUBBLICA-WEB-APP.md per istruzioni dettagliate!
echo.
echo ========================================================
echo.
echo FATTO! La web app e pronta in: dist\
echo.
echo Apri il file dist\index.html nel browser per testare!
echo.
echo ========================================================
echo.

REM Apri cartella dist
start "" "%CD%\dist"

pause
