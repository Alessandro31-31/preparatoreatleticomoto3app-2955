# Moto3 Pilot Trainer - App Mobile Completa

App professionale completa per l'allenamento di piloti Moto3. Funziona su **iOS, Android e Web** senza limitazioni.

## Caratteristiche Principali

### Allenamento Quotidiano
- **Routine Mattutina**: Protocollo giornaliero ottimizzato
- **Calendario 18 Settimane**: Programma completo di preparazione
- **Checklist Stampabili**: Liste di controllo per ogni sessione

### Preparazione & Recupero
- **Riscaldamento**: Protocolli pre-allenamento
- **Raffreddamento**: Routine post-allenamento
- **Stretching**: Programmi di flessibilità
- **Foam Rolling**: Rilascio miofasciale guidato
- **Mobilità**: Esercizi di mobilità articolare

### Monitoraggio & Analisi
- **Controllo Prontezza**: Valutazione giornaliera dello stato fisico
- **Progressi & Analisi**: Grafici e statistiche dettagliate
- **Sistema Bandiera Rossa**: Prevenzione infortuni
- **Traguardi**: Tracking dei record personali

### Strumenti Professionali
- **Timer Multi-Intervallo**: Gestione sessioni di allenamento
- **Calcolatore ACR**: Acute:Chronic Workload Ratio
- **Tracker del Carico**: Monitoraggio del carico settimanale
- **Monitor HRV**: Variabilità della frequenza cardiaca
- **Suite Strumenti Completa**: Oltre 50 strumenti professionali

### Tecnologie Avanzate
- **Analisi Video AI**: Feedback intelligente sui movimenti
- **Telemetria**: Comparazione dati di performance
- **Biomeccanica 3D**: Visualizzazione e analisi del movimento
- **Coach Virtuale**: Assistente AI per consigli personalizzati

### Benessere & Performance
- **Allenamento Mentale**: Tecniche di focus e concentrazione
- **Diario Alimentare**: Tracking nutrizionale completo
- **Valutazione Postura**: Analisi posturale professionale
- **Simulatore Giri**: Simulazione percorso e tempi sul giro
- **Setup Moto**: Calcolatore impostazioni moto

## Installazione e Utilizzo

### Requisiti
- Node.js 18 o superiore
- Expo CLI
- Per iOS: Expo Go app o Mac con Xcode
- Per Android: Expo Go app o Android Studio

### Setup Iniziale

```bash
# Entra nella directory dell'app
cd mobile-app

# Le dipendenze sono già installate, ma se necessario:
npm install --legacy-peer-deps

# Avvia l'app
npm start
```

### Eseguire su Dispositivi

#### Android
```bash
npm run android
```
Oppure scansiona il QR code con l'app Expo Go.

#### iOS
```bash
npm run ios
```
Oppure scansiona il QR code con l'app Expo Go (solo su dispositivi iOS).

#### Web
```bash
npm run web
```
L'app si aprirà automaticamente nel browser.

### Build per Produzione

#### Build Web
```bash
npm run build:web
```
I file verranno generati nella cartella `dist/`.

#### Build Android
```bash
npm run build:android
```
Genera i file nativi per Android.

#### Build iOS
```bash
npm run build:ios
```
Genera i file nativi per iOS (richiede Mac).

## Struttura del Progetto

```
mobile-app/
├── app/                    # Schermate dell'app (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   │   ├── (home)/        # Home con dashboard
│   │   ├── calendar.tsx   # Calendario 18 settimane
│   │   ├── readiness.tsx  # Controllo prontezza
│   │   └── progress.tsx   # Analisi progressi
│   ├── warmup.tsx         # Riscaldamento
│   ├── cooldown.tsx       # Raffreddamento
│   ├── stretching.tsx     # Stretching
│   ├── foam-rolling.tsx   # Foam rolling
│   ├── mobility.tsx       # Mobilità
│   ├── mental-training.tsx # Allenamento mentale
│   ├── video-analysis.tsx  # Analisi video
│   ├── biomechanics-3d.tsx # Biomeccanica 3D
│   ├── virtual-coach.tsx   # Coach virtuale
│   ├── nutrition-diary.tsx # Diario alimentare
│   ├── lap-simulator.tsx   # Simulatore giri
│   ├── bike-setup.tsx      # Setup moto
│   ├── timer.tsx           # Timer
│   ├── tools.tsx           # Suite strumenti
│   └── ...                 # Altri moduli
├── components/            # Componenti riutilizzabili
├── constants/            # Costanti e configurazioni
├── contexts/             # Context providers (stato globale)
├── data/                 # Dati e configurazioni
├── hooks/                # Custom hooks React
├── styles/               # Stili condivisi
├── types/                # Type definitions TypeScript
├── utils/                # Funzioni utility
└── assets/               # Immagini, font, etc.
```

## Funzionalità Offline

L'app funziona completamente **offline**:
- Tutti i dati vengono salvati localmente con AsyncStorage
- Le routine e i programmi sono accessibili senza connessione
- Sincronizzazione automatica quando torni online

## Personalizzazione

### Modificare le Routine
I file di configurazione delle routine si trovano in `data/`:
- Modifica `data/warmup-data.json` per personalizzare il riscaldamento
- Modifica `data/stretching-data.json` per lo stretching
- Etc.

### Modificare i Colori e Temi
I colori e stili sono in `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  // ... personalizza qui
};
```

### Aggiungere Nuove Funzionalità
1. Crea un nuovo file in `app/nome-funzionalita.tsx`
2. Aggiungi il link nella home: `app/(tabs)/(home)/index.tsx`
3. L'app si aggiornerà automaticamente

## Dati Salvati

L'app salva localmente:
- Routine giornaliere
- Progressi e statistiche
- Dati biometrici
- Video analisi
- Diario alimentare
- Impostazioni personalizzate

Tutti i dati sono salvati in modo sicuro sul dispositivo usando `@react-native-async-storage/async-storage`.

## Tecnologie Utilizzate

- **React Native 0.81**: Framework mobile
- **Expo 54**: Toolchain e runtime
- **Expo Router**: Navigazione basata su file
- **TypeScript**: Type safety
- **React Navigation**: Navigazione nativa
- **AsyncStorage**: Storage persistente
- **Expo Camera/ImagePicker**: Cattura foto/video
- **React Native Reanimated**: Animazioni fluide
- **React Native SVG**: Grafici e visualizzazioni

## Supporto e Modifiche

Questa è la TUA app! Puoi:
- Modificare qualsiasi file
- Aggiungere nuove funzionalità
- Personalizzare i colori e lo stile
- Rimuovere funzionalità che non usi
- Distribuirla come vuoi

## Troubleshooting

### L'app non si avvia
```bash
# Cancella la cache
rm -rf node_modules
npm install --legacy-peer-deps

# Reset Expo
npx expo start -c
```

### Problemi con le dipendenze
```bash
# Usa legacy peer deps
npm install --legacy-peer-deps
```

### Build fallisce
```bash
# Verifica la configurazione
npx expo-doctor

# Aggiorna Expo
npm install expo@latest
```

## Prossimi Passi

1. **Testa l'app**: Esegui `npm start` e prova tutte le funzionalità
2. **Personalizza**: Modifica colori, icone e contenuti
3. **Aggiungi dati**: Inserisci i tuoi programmi di allenamento
4. **Condividi**: Build per iOS/Android e distribuisci
5. **Migliora**: Aggiungi le funzionalità che desideri!

## Licenza

Questa app è completamente tua - modificala, distribuiscila e usala come preferisci!

---

**Buon allenamento!** 🏍️💪
