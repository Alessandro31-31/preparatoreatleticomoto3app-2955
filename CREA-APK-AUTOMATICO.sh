#!/bin/bash

clear

echo "════════════════════════════════════════════════════════════"
echo "  📱 CREAZIONE APK AUTOMATICA - MOTO3 PILOT TRAINER"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Questo script creerà automaticamente un APK standalone"
echo "che funziona SEMPRE sul telefono, anche senza PC!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Controlla se siamo nella directory corretta
if [ ! -d "mobile-app" ]; then
    echo "❌ ERRORE: Devi eseguire questo script dalla cartella del progetto!"
    echo "   Vai nella cartella preparatoreatleticomoto3app-2955 e riprova."
    exit 1
fi

cd mobile-app

echo "✅ Directory corretta trovata!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Controlla Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trovato!"
    echo "   Installa Node.js da: https://nodejs.org/"
    echo "   Poi riavvia il computer e riprova."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js trovato: $NODE_VERSION"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
    echo "📦 PASSO 1: Installazione dipendenze..."
    echo "   (Questo può richiedere 2-5 minuti)"
    echo ""
    npm install --legacy-peer-deps
    echo ""
    echo "✅ Dipendenze installate!"
else
    echo "✅ PASSO 1: Dipendenze già installate!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Installa EAS CLI
echo "📦 PASSO 2: Installazione EAS CLI..."
echo ""
npm install -g eas-cli
echo ""
echo "✅ EAS CLI installato!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Controlla se già loggato
if eas whoami &> /dev/null; then
    EXPO_USER=$(eas whoami 2>/dev/null | tail -n 1)
    echo "✅ Già loggato come: $EXPO_USER"
    echo ""
else
    echo "🔑 PASSO 3: Login Expo richiesto"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 NON HAI UN ACCOUNT EXPO?"
    echo ""
    echo "   1. Apri questo link nel browser:"
    echo "      https://expo.dev/signup"
    echo ""
    echo "   2. Crea un account GRATUITO (30 secondi)"
    echo "      - Inserisci email e password"
    echo "      - Conferma email"
    echo ""
    echo "   3. Poi torna qui e fai login con quei dati"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Premi INVIO quando sei pronto per fare login..."
    read

    echo "Inserisci le tue credenziali Expo:"
    eas login

    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Login fallito. Riprova con: eas login"
        exit 1
    fi

    echo ""
    echo "✅ Login effettuato con successo!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🏗️  PASSO 4: Creazione APK..."
echo ""
echo "⏱️  Questa operazione richiederà 10-15 minuti."
echo "   La build viene fatta sui server Expo (online)."
echo ""
echo "   Puoi lasciare il terminale aperto e fare altro!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Avvia build
eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "✅ ✅ ✅ BUILD COMPLETATA CON SUCCESSO! ✅ ✅ ✅"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "📥 PROSSIMI PASSI:"
    echo ""
    echo "   1. Controlla la tua EMAIL"
    echo "      → Riceverai un link da Expo"
    echo ""
    echo "   2. OPPURE vai su:"
    echo "      → https://expo.dev"
    echo "      → Accedi con il tuo account"
    echo "      → Vai su \"Builds\""
    echo "      → Troverai il link per scaricare l'APK"
    echo ""
    echo "   3. Apri il link SUL TELEFONO"
    echo "      → Scarica l'APK"
    echo ""
    echo "   4. Installa l'APK"
    echo "      → Permetti installazione da fonti sconosciute"
    echo "      → Tocca \"Installa\""
    echo ""
    echo "   5. Usa l'app SEMPRE!"
    echo "      → Non serve più il PC acceso"
    echo "      → Non serve Expo Go"
    echo "      → Tutte le funzionalità disponibili"
    echo "      → Funziona offline"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "🎉 FATTO! L'app è pronta per essere installata sul telefono!"
    echo ""
    echo "════════════════════════════════════════════════════════════"
else
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "❌ Build fallita!"
    echo ""
    echo "Possibili soluzioni:"
    echo "  1. Verifica di essere connesso a Internet"
    echo "  2. Riprova con: eas build --platform android --profile preview"
    echo "  3. Controlla errori sopra"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    exit 1
fi
