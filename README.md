# 🏍️ Moto3 Pilot Trainer

Sistema completo di allenamento professionale per piloti Moto3. Web app mobile-first con tutte le funzionalità per massimizzare le performance in pista.

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript) ![Mobile](https://img.shields.io/badge/Mobile-First-4CAF50?style=flat-square) ![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square)

## ✨ Funzionalità Complete

### 📱 Pagine Principali
- **🏠 Home** - Dashboard con Quick Actions, statistiche giornaliere e 8+ strumenti
- **📅 Calendar** - 18 settimane (126 giorni) con tracking completo esercizi
- **💪 Readiness** - Valutazione giornaliera (HRV, sonno, stress, energia, motivazione)
- **📊 Progress** - Statistiche, achievement system, strength tracking con grafici

### 🛠️ Strumenti Avanzati
- **🤖 Virtual Coach AI** - Coach con 15+ anni esperienza Moto3, chat interattiva
- **⏱️ Lap Simulator** - Confronto lap time con analisi settori e heart rate zones
- **🧠 Mental Training** - 6 esercizi guidati (meditazione, visualizzazione, breathing)
- **🍽️ Nutrition Diary** - Tracking macro (2800 cal, 180g protein, 320g carbs, 85g fats)
- **🎥 Video Analysis** - AI scoring per postura, cornering, braking, acceleration
- **🏍️ Bike Setup** - Guida completa (suspension, ergonomics, tires, electronics)

### 💾 Caratteristiche Tecniche
- ✅ **18 settimane complete** di allenamento strutturato in 6 mesocicli
- ✅ **9 tipi di training** - Forza, Potenza, Resistenza, Tecnico, Mobilità, Recupero, Deload, Gara
- ✅ **localStorage** - Tutti i dati salvati offline, funziona senza internet
- ✅ **PWA Support** - Installabile come app nativa su iOS e Android
- ✅ **Bottom Navigation** - UI mobile-friendly ottimizzata per pollice
- ✅ **Responsive Design** - Perfetto su tutti gli schermi
- ✅ **Dark/Light Mode** - Theme switching automatico

## 🏗️ Struttura Progetto

```
src/
├── components/
│   ├── MobileNav.tsx              # Bottom navigation mobile
│   └── ui/                        # shadcn/ui components
├── data/
│   └── trainingData.ts            # 18 settimane complete allenamento
├── pages/
│   ├── moto3/
│   │   ├── home.tsx               # 🏠 Dashboard principale
│   │   ├── calendar-full.tsx      # 📅 Calendario 18 settimane
│   │   ├── readiness.tsx          # 💪 Valutazione giornaliera
│   │   ├── progress.tsx           # 📊 Progress & Statistics
│   │   ├── virtual-coach.tsx      # 🤖 AI Coach interattivo
│   │   ├── lap-simulator.tsx      # ⏱️ Lap time analysis
│   │   ├── mental-training.tsx    # 🧠 6 esercizi mentali
│   │   ├── nutrition.tsx          # 🍽️ Diario nutrizionale
│   │   ├── video-analysis.tsx     # 🎥 Analisi video AI
│   │   └── bike-setup.tsx         # 🏍️ Setup guide
│   ├── calendar.tsx               # Calendario overview
│   ├── tools.tsx                  # Monitoring tools (HRV, ACR, Timer)
│   └── routine.tsx                # Morning routine 12-min
├── lib/                           # Utilities
└── app.tsx                        # Routing principale
```

## 🚀 Quick Start

### Installazione

```bash
# Clona il repository
git clone https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955.git
cd preparatoreatleticomoto3app-2955

# Installa dipendenze
bun install

# Avvia in development
bun run dev
```

L'app sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
# Build
bun run build

# Preview
bun run preview
```

## 📱 Installazione su Mobile

### iOS (iPhone/iPad)
1. Apri il sito in **Safari**
2. Tocca l'icona **Condividi** (⬆️)
3. Seleziona **"Aggiungi a Home"**
4. ✅ L'app è installata!

### Android
1. Apri il sito in **Chrome**
2. Tocca il **menu** (⋮)
3. Seleziona **"Installa app"**
4. ✅ L'app è installata!

### 🔥 Funziona Offline!
- Tutti i dati salvati in localStorage
- Nessuna connessione internet richiesta
- PWA completa con manifest.json

## 🎨 Personalizzazione

### Cambiare i Colori

**index.html** - Theme:
```html
<meta name="theme-color" content="#E10600" />  <!-- Rosso Moto3 -->
```

**public/manifest.json** - PWA:
```json
{
  "theme_color": "#E10600",
  "background_color": "#000000"
}
```

### Modificare il Calendario

**src/data/trainingData.ts**:
```typescript
export const COMPLETE_TRAINING_DATA: WeekPlan[] = [
  {
    week: 1,
    mesocycle: 'Meso 1A - Fondamenta',
    focus: 'Baseline + GPP',
    days: { Monday: { ... }, Tuesday: { ... } }
  }
]
```

### Obiettivi Nutrizionali

**src/pages/moto3/nutrition.tsx**:
```typescript
const goals = {
  calories: 2800,  // Modifica qui
  protein: 180,
  carbs: 320,
  fats: 85
}
```

## 🌐 Deploy

### Vercel (Raccomandato)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
bun run build
# Drag & drop cartella dist/ su netlify.com
```

### Cloudflare Pages
```bash
npx wrangler pages deploy dist/client
```

## 💾 Storage & Dati

### localStorage Keys
```typescript
'moto3_completed_sessions'    // Sessioni completate
'moto3_today_stats'           // Stats giornaliere
'moto3_readiness_history'     // Storico readiness 30gg
'moto3_nutrition_YYYY-MM-DD'  // Pasti per giorno
```

### Esempio
```typescript
// Completare sessione
const completed = ['1-Monday-morning', '1-Monday-main'];
localStorage.setItem('moto3_completed_sessions', JSON.stringify(completed));

// Salvare readiness
const entry = {
  date: '2025-01-17',
  sleepQuality: 4,
  hrv: 58,
  readinessScore: 21
};
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2 + TypeScript 5.8
- **Build**: Vite 7.1
- **Routing**: React Router 7.9
- **Styling**: Tailwind CSS 4.1
- **UI**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State**: React Hooks + localStorage
- **Animations**: Motion (Framer Motion)

## 📋 Roadmap

- [x] Calendario 18 settimane
- [x] Readiness + HRV
- [x] Progress tracking
- [x] Virtual Coach AI
- [x] Lap Simulator
- [x] Mental Training
- [x] Nutrition Diary
- [x] Video Analysis
- [x] Bike Setup Guide
- [x] PWA Support
- [ ] Backend sync
- [ ] Export PDF
- [ ] Apple Watch sync

## 🤝 Contribuire

Pull request benvenute!

1. Fork il progetto
2. Crea il tuo branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 👨‍💻 Autore

**Alessandro**
- GitHub: [@Alessandro31-31](https://github.com/Alessandro31-31)

## 📄 Licenza

MIT License

---

**🏁 Buon allenamento! 🏍️**

Made with ❤️ for Moto3 pilots