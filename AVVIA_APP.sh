#!/bin/bash

echo "=========================================="
echo "  AVVIO MOTO3 PILOT TRAINER APP"
echo "=========================================="
echo ""
echo "📱 Assicurati di aver installato Expo Go sul telefono!"
echo ""
echo "Android: Play Store → 'Expo Go'"
echo "iPhone: App Store → 'Expo Go'"
echo ""
echo "Premendo Invio avvierò l'app..."
echo "Vedrai un QR code da scansionare con Expo Go!"
echo ""
read -p "Premi INVIO per continuare..."

cd mobile-app

echo ""
echo "🚀 Avvio in corso..."
echo ""

npm start
