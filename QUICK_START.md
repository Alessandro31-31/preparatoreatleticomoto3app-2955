# Quick Start - In 5 Minuti!

## Setup Rapido (Prima Volta)

### 1. Preparazione (1 minuto)
```bash
cd mobile-app
```

### 2. Installa Expo Go sul telefono (2 minuti)
- **Android**: Play Store → "Expo Go"
- **iPhone**: App Store → "Expo Go"

### 3. Avvia l'app (30 secondi)
```bash
npm start
```

### 4. Scansiona il QR Code (30 secondi)
- Apri Expo Go sul telefono
- Tocca "Scan QR Code"
- Punta la camera sul QR code nel terminale
- Aspetta 10-20 secondi

### 5. Inizia ad allenarti! (subito)
L'app è caricata sul tuo telefono! 🎉

---

## Uso Quotidiano

### Avviare l'app ogni giorno:
```bash
cd mobile-app
npm start
```

Poi apri Expo Go e riconnettiti (o scansiona di nuovo il QR).

### Fermare l'app:
```
Ctrl + C
```

---

## Problemi Comuni - Soluzioni Rapide

### ❌ "Cannot find module" o errori di dipendenze
```bash
cd mobile-app
rm -rf node_modules
npm install --legacy-peer-deps
npm start
```

### ❌ QR code non funziona
1. Assicurati che telefono e computer siano sulla **stessa WiFi**
2. Premi `t` nel terminale per tunnel mode
3. Ri-scansiona il QR

### ❌ App non si aggiorna
- Scuoti il telefono
- Tocca "Reload"

### ❌ Errore "Port already in use"
```bash
# Uccidi il processo sulla porta 8081
npx kill-port 8081
npm start
```

### ❌ Metro bundler lento
```bash
npm start -- --clear
```

---

## Comandi Utili

```bash
# Avvia normalmente
npm start

# Avvia e pulisci cache
npm start -- --clear

# Solo web (browser)
npm run web

# Solo Android (con emulatore)
npm run android

# Solo iOS (con simulator, solo Mac)
npm run ios

# Verifica errori
npm run lint
```

---

## Shortcuts nel Terminale

Dopo `npm start`, puoi premere:

- `a` → Apri su Android
- `i` → Apri su iOS
- `w` → Apri nel browser
- `r` → Reload app
- `m` → Menu sviluppo
- `?` → Mostra tutti i comandi

---

## Modifiche Rapide

### Cambiare colore principale:
File: `mobile-app/styles/commonStyles.ts`
```typescript
primary: '#007AFF',  // ← cambia questo
```

### Aggiungere esercizio:
File: `mobile-app/data/trainingData.ts`

### Modificare home:
File: `mobile-app/app/(tabs)/(home)/index.tsx`

Leggi `GUIDA_MODIFICHE.md` per dettagli completi.

---

## Build per Produzione (Quando Pronto)

### Web:
```bash
npm run build:web
```

### Android APK:
```bash
npm run build:android
```

### iOS (solo su Mac):
```bash
npm run build:ios
```

Per build complete di produzione, usa Expo EAS:
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

---

## Supporto

1. **README**: Leggi `mobile-app/README.md`
2. **Modifiche**: Leggi `GUIDA_MODIFICHE.md`
3. **Expo Docs**: https://docs.expo.dev

---

**Pronto in 5 minuti!** 🚀
