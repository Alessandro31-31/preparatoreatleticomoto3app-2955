# 📱 Moto3 Pilot Trainer - App Mobile Completa

App completa per l'allenamento dei piloti Moto3 con tutte le funzionalità disponibili!

## 🎯 CREA L'APK IN 1 CLICK - Funziona SEMPRE sul Telefono!

### ✅ METODO RAPIDO (CONSIGLIATO)

**Su Windows:**
1. Scarica questo progetto (bottone verde "Code" → "Download ZIP")
2. Estrai sul Desktop
3. **Doppio click** su `CREA-APK-AUTOMATICO.bat`
4. Crea account Expo gratuito se non ce l'hai (30 secondi)
5. Aspetta 10-15 minuti
6. Ricevi link per scaricare APK via email
7. Installa sul telefono
8. **Usa l'app SEMPRE!** 🎉

**Su Mac/Linux:**
```bash
./CREA-APK-AUTOMATICO.sh
```

### 📖 Guide Complete

- **[GUIDA WINDOWS COMPLETA](GUIDA-WINDOWS-COMPLETA.md)** - Passo passo per Windows
- **[Guida Creazione APK](CREA-APK-COMPLETO.md)** - Tutti i metodi disponibili
- **[Quick Start](QUICK_START.md)** - Avvio rapido con Expo Go

---

Repository contenente l'app mobile professionale completa per l'allenamento di piloti Moto3.

## Struttura del Progetto

```
preparatoreatleticomoto3app-2955/
├── mobile-app/          # APP MOBILE COMPLETA (iOS, Android, Web)
│   ├── app/            # Schermate e navigazione
│   ├── components/     # Componenti UI
│   ├── data/          # Dati e configurazioni
│   ├── assets/        # Risorse (immagini, font)
│   └── README.md      # Documentazione completa dell'app
└── ...                # Altri file del progetto
```

## App Mobile (mobile-app/)

L'app mobile è una **applicazione professionale completa** per piloti Moto3 con oltre 40 funzionalità avanzate.

### Funzionalità Principali

#### 🏋️ Allenamento Fisico
- Routine mattutina guidata
- Calendario 18 settimane di preparazione
- Riscaldamento pre-allenamento
- Raffreddamento post-allenamento
- Stretching e flessibilità
- Foam rolling e mobilità
- Checklist stampabili

#### 📊 Monitoraggio & Analisi
- Controllo prontezza giornaliera
- Tracking progressi con grafici
- Sistema bandiera rossa (prevenzione infortuni)
- Monitor HRV (variabilità cardiaca)
- Tracker del carico di lavoro
- Calcolatore ACR (Acute:Chronic Ratio)

#### 🧠 Tecnologie Avanzate
- Analisi video con AI
- Biomeccanica 3D
- Coach virtuale intelligente
- Telemetria e comparazione dati
- Simulatore giri
- Setup moto professionale

#### 💪 Benessere & Mental Training
- Allenamento mentale e focus
- Diario alimentare completo
- Valutazione posturale
- Gestione dello stress
- Tecniche di visualizzazione

#### 🛠️ Strumenti Professionali
- Timer multi-intervallo
- Suite completa oltre 50 strumenti
- Tutti i tool modificabili
- Personalizzazione completa

### Come Iniziare

```bash
# 1. Entra nella directory dell'app
cd mobile-app

# 2. Le dipendenze sono già installate, ma se necessario:
npm install --legacy-peer-deps

# 3. Avvia l'app
npm start
```

Poi scegli:
- Premi `a` per Android
- Premi `i` per iOS
- Premi `w` per Web
- Oppure scansiona il QR code con Expo Go

### Documentazione Completa

Leggi il file [mobile-app/README.md](mobile-app/README.md) per:
- Guida completa all'installazione
- Elenco dettagliato di tutte le funzionalità
- Come personalizzare l'app
- Come modificare routine e programmi
- Come fare build per produzione
- Troubleshooting e supporto

## Caratteristiche dell'App

### ✅ Funziona Offline
Tutti i dati sono salvati localmente, nessuna connessione internet richiesta.

### ✅ Completamente Modificabile
Ogni aspetto dell'app può essere modificato:
- Colori e temi
- Routine di allenamento
- Programmi e calendari
- Aggiunta di nuove funzionalità
- Personalizzazione completa

### ✅ Multi-Platform
- **iOS**: iPhone e iPad
- **Android**: Smartphone e tablet
- **Web**: Browser desktop e mobile

### ✅ Nessuna Limitazione
- Codice sorgente completo
- Nessun paywall o limitazioni
- Tutte le funzionalità sbloccate
- Puoi distribuirla come vuoi

## Tecnologie

- **React Native 0.81**: Framework mobile cross-platform
- **Expo 54**: Toolchain professionale
- **TypeScript**: Type-safe development
- **Expo Router**: Navigazione moderna
- **AsyncStorage**: Persistenza dati locale
- **React Native Reanimated**: Animazioni fluide

## Quick Start

### Per testare subito l'app:

```bash
cd mobile-app
npm start
```

Scansiona il QR code con:
- **iOS**: App "Camera" o Expo Go
- **Android**: App Expo Go

### Per sviluppare:

1. Apri il progetto in VS Code o il tuo editor preferito
2. Modifica i file in `mobile-app/app/` per cambiare le schermate
3. Modifica `mobile-app/styles/commonStyles.ts` per i colori
4. L'app si aggiorna automaticamente (hot reload)

### Per fare build:

```bash
# Web
cd mobile-app && npm run build:web

# Android
cd mobile-app && npm run build:android

# iOS (richiede Mac)
cd mobile-app && npm run build:ios
```

## Supporto

Per qualsiasi problema:
1. Controlla [mobile-app/README.md](mobile-app/README.md)
2. Verifica che Node.js sia aggiornato (v18+)
3. Prova a cancellare `node_modules` e reinstallare
4. Usa sempre `npm install --legacy-peer-deps`

## Prossimi Passi Consigliati

1. **Testa l'app** - Avvia con `npm start` e prova tutte le funzionalità
2. **Personalizza** - Modifica colori, icone, contenuti
3. **Aggiungi dati** - Inserisci i tuoi programmi di allenamento
4. **Estendi** - Aggiungi le tue funzionalità personalizzate
5. **Distribuisci** - Crea le build per iOS/Android

## Licenza

Codice completamente open e modificabile. Usa, modifica e distribuisci come preferisci!

---

**Pronto per allenarti come un professionista!** 🏍️💪🔥
