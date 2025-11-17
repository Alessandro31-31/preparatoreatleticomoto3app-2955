#!/bin/bash

# Script per debuggare il deploy Vercel

echo "🔍 Vercel Debug Helper"
echo "======================"
echo ""

# 1. Verifica build locale
echo "📦 Step 1: Testing local build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build locale OK"
else
    echo "❌ Build locale FALLITO - controlla gli errori sopra"
    exit 1
fi

# 2. Testa build locale
echo ""
echo "🌐 Step 2: Testing local preview..."
echo "Aprirò il server preview - controlla http://localhost:4173"
echo "Premi CTRL+C per fermare"
npm run preview &
PREVIEW_PID=$!

sleep 3

echo ""
echo "📋 Checklist Debug:"
echo "1. Apri http://localhost:4173 nel browser"
echo "2. Premi F12 per aprire DevTools"
echo "3. Vai su Console - ci sono errori?"
echo "4. Vai su Network - tutti i file si caricano?"
echo "5. Se funziona qui, il problema è solo su Vercel"
echo ""
echo "Premi CTRL+C quando hai finito di testare..."

wait $PREVIEW_PID
