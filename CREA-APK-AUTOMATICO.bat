@echo off
cls
echo ========================================================
echo   CREAZIONE APK AUTOMATICA - MOTO3 PILOT TRAINER
echo ========================================================
echo.
echo Questo script creerà automaticamente un APK standalone
echo che funziona SEMPRE sul telefono, anche senza PC!
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

REM Installa EAS CLI
echo PASSO 2: Installazione EAS CLI...
echo.
call npm install -g eas-cli
echo.
echo OK: EAS CLI installato!
echo.
echo --------------------------------------------------------
echo.

REM Controlla se già loggato
call eas whoami >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('eas whoami') do set EXPO_USER=%%i
    echo OK: Gia loggato come: %EXPO_USER%
    echo.
) else (
    echo PASSO 3: Login Expo richiesto
    echo.
    echo --------------------------------------------------------
    echo.
    echo NON HAI UN ACCOUNT EXPO?
    echo.
    echo    1. Apri questo link nel browser:
    echo       https://expo.dev/signup
    echo.
    echo    2. Crea un account GRATUITO (30 secondi^)
    echo       - Inserisci email e password
    echo       - Conferma email
    echo.
    echo    3. Poi torna qui e fai login con quei dati
    echo.
    echo --------------------------------------------------------
    echo.
    echo Premi INVIO quando sei pronto per fare login...
    pause >nul

    echo Inserisci le tue credenziali Expo:
    call eas login

    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERRORE: Login fallito. Riprova con: eas login
        pause
        exit /b 1
    )

    echo.
    echo OK: Login effettuato con successo!
)

echo.
echo --------------------------------------------------------
echo.
echo PASSO 4: Creazione APK...
echo.
echo Questa operazione richiedera 10-15 minuti.
echo La build viene fatta sui server Expo (online^).
echo.
echo Puoi lasciare il terminale aperto e fare altro!
echo.
echo --------------------------------------------------------
echo.

REM Avvia build
call eas build --platform android --profile preview --non-interactive

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo.
    echo    BUILD COMPLETATA CON SUCCESSO!
    echo.
    echo ========================================================
    echo.
    echo PROSSIMI PASSI:
    echo.
    echo    1. Controlla la tua EMAIL
    echo       - Riceverai un link da Expo
    echo.
    echo    2. OPPURE vai su:
    echo       - https://expo.dev
    echo       - Accedi con il tuo account
    echo       - Vai su "Builds"
    echo       - Troverai il link per scaricare l'APK
    echo.
    echo    3. Apri il link SUL TELEFONO
    echo       - Scarica l'APK
    echo.
    echo    4. Installa l'APK
    echo       - Permetti installazione da fonti sconosciute
    echo       - Tocca "Installa"
    echo.
    echo    5. Usa l'app SEMPRE!
    echo       - Non serve piu il PC acceso
    echo       - Non serve Expo Go
    echo       - Tutte le funzionalita disponibili
    echo       - Funziona offline
    echo.
    echo ========================================================
    echo.
    echo FATTO! L'app e pronta per essere installata sul telefono!
    echo.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo.
    echo ERRORE: Build fallita!
    echo.
    echo Possibili soluzioni:
    echo   1. Verifica di essere connesso a Internet
    echo   2. Riprova con: eas build --platform android --profile preview
    echo   3. Controlla errori sopra
    echo.
    echo ========================================================
)

echo.
pause
