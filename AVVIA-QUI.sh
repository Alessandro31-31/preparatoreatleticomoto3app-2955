#!/bin/bash

clear

echo "══════════════════════════════════════════════════════"
echo "        MOTO3 PILOT TRAINER - AVVIO APP"
echo "══════════════════════════════════════════════════════"
echo ""
echo "🚀 Avvio automatico dell'app..."
echo ""
echo "📱 RICORDA:"
echo "  1. Installa Expo Go sul telefono"
echo "  2. Connettiti alla stessa WiFi del computer"
echo "  3. Scansiona il QR code che apparirà"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vai alla directory corretta
cd ~/preparatoreatleticomoto3app-2955/mobile-app

# Verifica che siamo nella directory giusta
if [ ! -f "package.json" ]; then
    echo "❌ ERRORE: File package.json non trovato!"
    echo "   Assicurati di essere nella directory corretta."
    exit 1
fi

echo "✅ Directory corretta trovata!"
echo ""
echo "🔄 Avvio del server Expo..."
echo ""

# Avvia l'app
npm start
