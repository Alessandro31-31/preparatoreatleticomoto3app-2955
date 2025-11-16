#!/bin/bash

clear

echo "════════════════════════════════════════════════════════════"
echo "  📱 CREAZIONE APK - MOTO3 PILOT TRAINER"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Questo script creerà un APK che puoi installare sul telefono"
echo "e usare SEMPRE, anche senza PC acceso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vai nella directory dell'app
cd ~/preparatoreatleticomoto3app-2955/mobile-app

echo "📦 PASSO 1: Installazione EAS CLI..."
echo ""
npm install -g eas-cli
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔑 PASSO 2: Login Expo..."
echo ""
echo "Se non hai un account Expo, creane uno (è gratis!):"
echo "https://expo.dev/signup"
echo ""
eas login
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚙️  PASSO 3: Configurazione progetto..."
echo ""
eas build:configure
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🏗️  PASSO 4: Creazione APK..."
echo ""
echo "Questa operazione richiederà 10-15 minuti."
echo "Riceverai un link per scaricare l'APK quando sarà pronto!"
echo ""
eas build --platform android --profile preview
echo ""

echo "════════════════════════════════════════════════════════════"
echo ""
echo "✅ BUILD COMPLETATA!"
echo ""
echo "📥 PROSSIMI PASSI:"
echo "  1. Apri il link che hai ricevuto sul telefono"
echo "  2. Scarica l'APK"
echo "  3. Installa (permetti installazione da fonti sconosciute)"
echo "  4. Usa l'app SEMPRE, anche senza PC!"
echo ""
echo "════════════════════════════════════════════════════════════"
