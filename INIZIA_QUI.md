# 🚀 INIZIA QUI - Moto3 Pilot Trainer App

## PRIMI PASSI (5 Minuti)

### 1️⃣ Installa Expo Go sul Telefono
- **Android**: Play Store → "Expo Go"
- **iPhone**: App Store → "Expo Go"

### 2️⃣ Avvia l'App
```bash
cd mobile-app
npm start
```

### 3️⃣ Scansiona il QR Code
- Apri Expo Go
- Tocca "Scan QR Code"
- Scansiona il QR nel terminale
- Aspetta 10-30 secondi

### 4️⃣ Inizia ad Allenarti!
L'app è ora sul tuo telefono! 🎉

---

## GUIDE DISPONIBILI

### 📖 [README.md](README.md)
**Panoramica completa del progetto**
- Cos'è l'app
- Tutte le funzionalità
- Come installarla

### 🚀 [QUICK_START.md](QUICK_START.md)
**Guida rapida in 5 minuti**
- Setup veloce
- Comandi essenziali
- Problemi comuni risolti

### 📱 [mobile-app/README.md](mobile-app/README.md)
**Documentazione tecnica completa**
- Architettura app
- Tutte le API
- Build per produzione

### ✏️ [GUIDA_MODIFICHE.md](GUIDA_MODIFICHE.md)
**Come personalizzare l'app**
- Cambiare colori
- Modificare routine
- Creare nuove schermate
- Aggiungere funzionalità

### 🎯 [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md)
**Esempi pratici passo-passo**
- 8 esempi pronti all'uso
- Copia-incolla il codice
- Risultati immediati

---

## FUNZIONALITÀ PRINCIPALI

### 🏋️ Allenamento Fisico
✅ Routine mattutina guidata
✅ Calendario 18 settimane
✅ Riscaldamento pre-allenamento
✅ Raffreddamento post-allenamento
✅ Stretching e flessibilità
✅ Foam rolling
✅ Mobilità articolare

### 📊 Monitoraggio
✅ Controllo prontezza giornaliera
✅ Tracking progressi con grafici
✅ Sistema bandiera rossa
✅ Monitor HRV
✅ Tracker del carico
✅ Calcolatore ACR

### 🧠 Tecnologie Avanzate
✅ Analisi video AI
✅ Biomeccanica 3D
✅ Coach virtuale
✅ Telemetria
✅ Simulatore giri
✅ Setup moto

### 💪 Benessere
✅ Allenamento mentale
✅ Diario alimentare
✅ Valutazione posturale
✅ Timer multi-intervallo

---

## COMANDI ESSENZIALI

```bash
# Avvia app
cd mobile-app
npm start

# Ferma app
Ctrl + C

# Pulisci cache
npm start -- --clear

# Solo web
npm run web
```

---

## SHORTCUTS NEL TERMINALE

Dopo `npm start`:
- `a` → Android
- `i` → iOS
- `w` → Web
- `r` → Reload
- `?` → Aiuto

---

## PROBLEMI? SOLUZIONI RAPIDE

### QR Code non funziona
```bash
# Nel terminale premi:
t   # Attiva tunnel mode
```

### Errori dipendenze
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### App non si aggiorna
Scuoti il telefono → "Reload"

### Metro lento
```bash
npm start -- --clear
```

---

## PERSONALIZZAZIONE RAPIDA

### Cambiare colore principale
**File**: `mobile-app/styles/commonStyles.ts`
```typescript
primary: '#007AFF',  // ← Cambia questo
```

### Modificare home
**File**: `mobile-app/app/(tabs)/(home)/index.tsx`

### Aggiungere esercizi
**File**: `mobile-app/data/trainingData.ts`

**Leggi [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md) per 8 esempi pronti!**

---

## STRUTTURA PROGETTO

```
preparatoreatleticomoto3app-2955/
│
├── mobile-app/              ← LA TUA APP MOBILE
│   ├── app/                ← Schermate
│   ├── components/         ← Componenti UI
│   ├── styles/            ← Colori e stili
│   ├── data/              ← Dati allenamenti
│   └── assets/            ← Immagini, font
│
├── INIZIA_QUI.md          ← SEI QUI! 👈
├── QUICK_START.md         ← Setup rapido
├── GUIDA_MODIFICHE.md     ← Come personalizzare
├── ESEMPI_MODIFICHE.md    ← Esempi pratici
└── README.md              ← Panoramica completa
```

---

## PROSSIMI PASSI

### Oggi (5 minuti)
1. ✅ Installa Expo Go
2. ✅ Avvia `npm start`
3. ✅ Scansiona QR code
4. ✅ Esplora le funzionalità

### Questa Settimana
1. Testa tutte le funzioni
2. Prova routine mattutina
3. Usa il calendario 18 settimane
4. Personalizza colori (leggi ESEMPI_MODIFICHE.md)

### Quando Vuoi
1. Aggiungi i tuoi allenamenti
2. Crea nuove schermate
3. Build per produzione
4. Distribuisci l'app

---

## SUPPORTO

### Documentazione
- 📖 Leggi le guide in questa cartella
- 🌐 [Expo Docs](https://docs.expo.dev/)
- ⚛️ [React Native Docs](https://reactnative.dev/)

### Problemi Comuni
Controlla [QUICK_START.md](QUICK_START.md) → Sezione "Problemi Comuni"

---

## CARATTERISTICHE

✅ **100% Offline** - Nessuna connessione richiesta
✅ **100% Modificabile** - Codice sorgente completo
✅ **Zero Limitazioni** - Tutte le funzioni sbloccate
✅ **Multi-Platform** - iOS, Android, Web
✅ **Hot Reload** - Modifiche istantanee
✅ **Nessun Paywall** - Completamente gratis

---

## Quick Reference

| Cosa Vuoi Fare | Dove Guardare |
|----------------|---------------|
| Setup veloce | [QUICK_START.md](QUICK_START.md) |
| Cambiare colori | [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md) #1 |
| Aggiungere esercizi | [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md) #2 |
| Nuova schermata | [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md) #5 |
| Build produzione | [mobile-app/README.md](mobile-app/README.md) |
| Problemi | [QUICK_START.md](QUICK_START.md) |

---

## AVVIO RAPIDO

**Script automatico:**
```bash
./AVVIA_APP.sh
```

**Manuale:**
```bash
cd mobile-app && npm start
```

---

**Pronto per iniziare? Vai → [QUICK_START.md](QUICK_START.md)** 🚀

**Vuoi personalizzare? Vai → [ESEMPI_MODIFICHE.md](ESEMPI_MODIFICHE.md)** 🎨

**Problemi? Vai → Sezione "Problemi Comuni" in QUICK_START.md** 🔧

---

**Buon allenamento!** 🏍️💪🔥
