# 🏍️ Moto3 Training App - Manuale Completo

App professionale per la gestione completa dell'allenamento di piloti Moto3.

---

## 📋 **INDICE**

1. [Caratteristiche](#caratteristiche)
2. [Installazione](#installazione)
3. [Avvio Applicazione](#avvio-applicazione)
4. [Guida Utilizzo](#guida-utilizzo)
5. [Struttura Pagine](#struttura-pagine)
6. [API Routes](#api-routes)
7. [Database Schema](#database-schema)
8. [Export PDF](#export-pdf)
9. [Deployment](#deployment)

---

## ✨ **CARATTERISTICHE**

### **🎯 Gestione Allenamento**
- ✅ Calendario 18 settimane con periodizzazione
- ✅ Sessioni giornaliere con template esercizi
- ✅ Tracking completo (sets, reps, peso, RPE)
- ✅ Morning routine mobilità (12 min)
- ✅ Tutto modificabile in tempo reale

### **🔧 Preparazione & Recupero**
- ✅ Riscaldamento pre-allenamento (8 esercizi, 8 min)
- ✅ Raffreddamento post-allenamento (7 esercizi, 7 min)
- ✅ Stretching dedicato giorno riposo (10 esercizi, 20-30 min)
- ✅ Protocollo foam rolling (8 aree, 15 min)
- ✅ Quick reference rapidi

### **🛠️ Monitoring Tools**
- ✅ Daily Readiness Check (5 metriche, score /25)
- ✅ Interval Timer personalizzabile
- ✅ ACR Calculator per carico
- ✅ HRV Monitor con soglie

### **🚩 Sistema Bandiera Rossa**
- ✅ 6 categorie (HRV, Carico, Prontezza, Infortunio, Sonno, Altro)
- ✅ 4 livelli gravità (Bassa, Media, Alta, Critica)
- ✅ Tracking risoluzione con note
- ✅ Alert automatici su Dashboard

### **📊 Progress & Analytics**
- ✅ Grafici biometrici (Peso, HRV, Rigidità, Prontezza)
- ✅ Progressioni esercizi (Target vs Attuale)
- ✅ Monitoraggio carico settimanale
- ✅ ACR ratio per prevenzione infortuni
- ✅ Export PDF/TXT report completi

### **👤 Profilo Utente**
- ✅ Informazioni personali e fisiche
- ✅ Obiettivi fisici e forza
- ✅ Statistiche programma
- ✅ Impostazioni app
- ✅ Notifiche personalizzabili

---

## 🚀 **INSTALLAZIONE**

### **Prerequisiti**
- Node.js ≥18 o Bun ≥1.0
- Git

### **Clone Repository**
```bash
git clone https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955.git
cd preparatoreatleticomoto3app-2955
```

### **Installa Dipendenze**
```bash
# Con Bun (consigliato)
bun install

# Oppure con npm
npm install
```

---

## 🏁 **AVVIO APPLICAZIONE**

### **Development**
```bash
# Con Bun
bun run dev

# Con npm
npm run dev
```

Apri il browser su: **http://localhost:5173**

### **Build Production**
```bash
bun run build
# oppure
npm run build
```

I file compilati saranno in `/dist`

### **Preview Production Build**
```bash
bun run preview
# oppure
npm run preview
```

---

## 📖 **GUIDA UTILIZZO**

### **1️⃣ Primo Accesso**

1. Vai su **http://localhost:5173**
2. Click su **"Get Started"** o **"Sign Up"**
3. Crea account (email + password)
4. Fai login

### **2️⃣ Setup Iniziale**

1. Vai su **Profile** (icona User in alto a destra Dashboard)
2. Compila informazioni:
   - Nome completo
   - Età
   - Peso attuale
   - Peso target
   - Data inizio programma (default: 6 Nov 2025)
3. Salva

### **3️⃣ Routine Giornaliera**

#### **🌅 MATTINA**
1. Vai su **Dashboard** → Click "Morning Routine"
2. Valuta rigidità pre-routine (scala 0-10)
3. Completa 5 esercizi mobilità (~12 min)
4. Valuta rigidità post-routine
5. Salva (target: delta ≥2.0)

#### **📊 READINESS CHECK**
1. Dashboard → "Monitoring Tools" → Tab "Readiness"
2. Valuta 5 metriche (1-5):
   - Qualità sonno
   - Dolore muscolare
   - Livello stress
   - Energia
   - Motivazione
3. Controlla Readiness Score /25 (target: ≥20)
4. Inserisci HRV se misurato (target: ≥55ms)
5. Salva assessment

#### **🏋️ PRE-ALLENAMENTO**
1. Vai su "Prep & Recovery" → Tab "Riscaldamento"
2. Completa 8 esercizi (~8 min)
3. Usa timer integrato

#### **💪 ALLENAMENTO**
1. Dashboard → "Calendar" → Seleziona settimana → Click giorno
2. Visualizza template esercizi giornalieri
3. Durante allenamento:
   - Spunta esercizi completati ✓
   - Modifica peso/reps se diverso da pianificato
   - Annota RPE per serie
   - Aggiungi note
4. Usa "Interval Timer" in Tools se necessario
5. Fine sessione: inserisci durata totale e RPE medio
6. Salva sessione

#### **❄️ POST-ALLENAMENTO**
1. "Prep & Recovery" → Tab "Raffreddamento"
2. Completa cooldown (~7 min)

#### **📈 TRACKING**
1. Vai su "Progress" → Vedi tutti i grafici
2. Tab "Biometria": peso, HRV, rigidità
3. Tab "Esercizi": progressioni su esercizi chiave
4. Tab "Carico": ACR ratio
5. Export report: Click "Esporta PDF"

### **4️⃣ Gestione Bandiere Rosse**

#### **Quando Creare una Bandiera?**
- HRV < 45ms per 3+ giorni consecutivi
- Readiness Score < 15/25
- ACR ratio > 1.5 (sovraccarico) o < 0.5 (sottoccarico)
- Dolore/infortunio
- Sonno < 6h per più notti

#### **Come Creare**
1. Dashboard → Click alert rosso (se presente)
2. Oppure: Menu → "Red Flags" → "Nuova Bandiera"
3. Seleziona:
   - Categoria (es. "HRV Basso")
   - Gravità (Bassa/Media/Alta/Critica)
4. Descrivi situazione
5. Indica azione raccomandata
6. Salva

#### **Come Risolvere**
1. "Red Flags" → Click su bandiera attiva
2. Click "Risolvi"
3. Aggiungi note risoluzione
4. Conferma

### **5️⃣ Giorno di Riposo (Domenica)**

1. **Mattina**: Morning Routine
2. **Stretching**: "Prep & Recovery" → Tab "Stretching" (20-30 min)
3. **Foam Rolling**: Tab "Foam Rolling" (15 min)
4. **Readiness**: Tools → Readiness Check
5. **Review**: Progress → Analizza settimana

---

## 🗺️ **STRUTTURA PAGINE**

### **Route Pubbliche**
- `/` - Homepage con presentazione
- `/signin` - Login
- `/signup` - Registrazione

### **Route Protette (Require Auth)**

#### **Dashboard & Profilo**
- `/` (autenticato) - Dashboard principale
- `/profile` - Profilo utente e impostazioni

#### **Allenamento**
- `/calendar` - Calendario 18 settimane
- `/session/:week/:day` - Dettaglio sessione (es. `/session/1/monday`)
- `/routine` - Morning routine mobilità

#### **Preparazione**
- `/preparation` - Prep & Recovery (5 tabs)

#### **Monitoring**
- `/tools` - Monitoring Tools (4 tabs)

#### **Analisi**
- `/progress` - Progress & Analytics (4 tabs)
- `/red-flags` - Sistema bandiere rosse

#### **Extra**
- `/chat` - Chat AI (se configurato)
- `/billing` - Gestione subscription

---

## 🔌 **API ROUTES**

### **Authentication** (`/api/auth/*`)
- POST `/signup` - Registrazione
- POST `/signin` - Login
- POST `/signout` - Logout
- GET `/session` - Get current session

### **Training** (`/api/training/*`)
- GET `/sessions` - Lista sessioni (query: weekNumber, startDate, endDate)
- GET `/sessions/:id` - Dettaglio sessione + esercizi
- POST `/sessions` - Crea sessione
- PUT `/sessions/:id` - Aggiorna sessione
- POST `/exercises` - Crea esercizio
- PUT `/exercises/:id` - Aggiorna esercizio

### **Routine** (`/api/routine/*`)
- GET `/` - Lista routine
- GET `/today` - Routine oggi
- POST `/` - Salva routine

### **Biometrics** (`/api/biometrics/*`)
- GET `/` - Lista biometria (query: startDate, endDate)
- GET `/today` - Biometria oggi
- POST `/` - Salva biometria
- GET `/load` - Load tracking
- POST `/load` - Salva load
- GET `/posture` - Posture assessments
- POST `/posture` - Salva posture

### **Red Flags** (`/api/flags/*`)
- GET `/` - Lista flags (query: resolved)
- GET `/active` - Solo flags attive
- POST `/` - Crea flag
- PUT `/:id/resolve` - Risolvi flag

### **Progressions** (`/api/progressions/*`)
- GET `/` - Lista progressioni (query: week, exerciseName)
- POST `/` - Crea progressione
- PUT `/:id` - Aggiorna progressione

---

## 🗄️ **DATABASE SCHEMA**

### **Tabelle Principali**

#### **user_profiles**
```sql
- id, userId, name, age, category
- startDate, weight, targetWeight, photoUrl
- createdAt, updatedAt
```

#### **training_sessions**
```sql
- id, userId, date, weekNumber, dayName
- sessionType, sessionName, duration
- rpeAvg, load, completed, notes
- createdAt, updatedAt
```

#### **exercises**
```sql
- id, sessionId, name, category
- sets, reps, weight, targetWeight
- duration, rest, rpeTarget, rpeActual
- completed, notes, setupInstructions
- techniqueNotes, breathingPattern, muscleFocus
- createdAt
```

#### **morning_routines**
```sql
- id, userId, date
- stiffnessPre, stiffnessPost, delta
- duration, completed, notes
- createdAt
```

#### **biometrics**
```sql
- id, userId, date
- weight, hrv, sleepQuality, sleepHours
- muscleSoreness, stressLevel, energyLevel
- motivation, readinessScore, notes
- createdAt
```

#### **red_flags**
```sql
- id, userId, date, category, severity
- description, action, resolved
- resolvedDate, resolvedNotes
- createdAt
```

#### **progressions**
```sql
- id, userId, exerciseName, week
- targetWeight, targetReps, targetDuration
- actualWeight, actualReps, actualDuration
- percentAchieved, milestone
- createdAt, updatedAt
```

#### **load_tracking**
```sql
- id, userId, date, dailyLoad
- acuteLoad, chronicLoad, acrRatio, weeklyLoad
- createdAt
```

---

## 📄 **EXPORT PDF**

### **Funzionalità Attuale**
- ✅ Export TXT con riepilogo completo
- ✅ Dati inclusi: biometria, sessioni, progressioni, flags
- ⏳ PDF vero in sviluppo (serve jsPDF)

### **Per Implementare PDF Completo**

1. **Installa jsPDF**:
```bash
bun add jspdf jspdf-autotable
```

2. **Decommentare codice in** `src/lib/export-pdf.ts` (righe commentate)

3. **Funzionerà automaticamente!**

---

## 🌐 **DEPLOYMENT**

### **Cloudflare Pages (Consigliato)**

1. **Build settings**:
   - Build command: `npm run build`
   - Build output: `/dist/client`
   - Root directory: `/`

2. **Environment variables**:
   - Configurare nel dashboard Cloudflare

3. **Worker routes**: Configurati automaticamente da Wrangler

### **Vercel**

```bash
vercel --prod
```

### **Netlify**

```bash
netlify deploy --prod
```

---

## 🎨 **CUSTOMIZZAZIONE**

### **Cambiare Colori**
Modifica `tailwind.config.ts`:
```ts
colors: {
  primary: "#ef4444", // Rosso Moto3
  // ... altri colori
}
```

### **Modificare Esercizi Template**
Modifica `src/pages/session.tsx` → `exerciseTemplates`

### **Cambiare Mesocicli**
Modifica `src/pages/calendar.tsx` → `mesocycles`

### **Personalizzare Protocolli**
Modifica `src/pages/preparation.tsx`:
- `warmupProtocol`
- `cooldownProtocol`
- `stretchingProtocol`
- `foamRollingProtocol`

---

## 🆘 **TROUBLESHOOTING**

### **Build Fallisce**
```bash
# Pulisci e reinstalla
rm -rf node_modules bun.lockb
bun install
bun run build
```

### **Errori TypeScript**
```bash
# Verifica tipi
bun run lint
```

### **Database Non Funziona**
```bash
# Rigenera schema
bun run db:generate
```

### **Componenti UI Mancanti**
Tutti i componenti Radix UI sono già installati. Se ne manca uno:
```bash
bun add @radix-ui/react-[component-name]
```

---

## 📦 **DIPENDENZE PRINCIPALI**

### **Frontend**
- React 19
- TypeScript 5.8
- TanStack Query (react-query)
- React Router 7
- Radix UI Components
- Tailwind CSS 4
- Lucide Icons

### **Backend**
- Hono (API framework)
- Better Auth (Authentication)
- Drizzle ORM (Database)
- Zod (Validation)

### **Development**
- Vite 7
- Bun runtime
- ESLint
- Wrangler (Cloudflare)

---

## 🎯 **BEST PRACTICES**

### **Per l'Atleta**
1. ✅ Completare morning routine OGNI giorno
2. ✅ Fare readiness check PRE-allenamento
3. ✅ Monitorare HRV quotidianamente
4. ✅ Mantenere ACR ratio 0.8-1.3
5. ✅ Creare bandiera rossa se HRV < 45ms per 3+ giorni
6. ✅ Giorno riposo: stretching + foam rolling
7. ✅ Export PDF settimanale per coach

### **Per il Coach**
1. ✅ Controllare bandiere rosse attive
2. ✅ Analizzare trend HRV settimanale
3. ✅ Verificare progressioni target vs attuale
4. ✅ Modulare carico in base ACR ratio
5. ✅ Review export PDF per aggiustamenti programma

---

## 📝 **CHANGELOG**

### **v1.0.0 - Release Completa**
- ✅ 8 pagine principali
- ✅ Sistema calendario 18 settimane
- ✅ Morning routine con tracking
- ✅ 4 protocolli prep & recovery
- ✅ 4 monitoring tools
- ✅ Sistema bandiere rosse completo
- ✅ Progress analytics con grafici
- ✅ Profilo utente + impostazioni
- ✅ Export PDF/TXT
- ✅ Database completo
- ✅ API routes tutte funzionanti

---

## 📞 **SUPPORTO**

- **Issues**: https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955/issues
- **Documentation**: Questo file
- **Email**: [tua-email]

---

## 📜 **LICENSE**

Proprietario - Tutti i diritti riservati

---

## 🏆 **CREDITS**

Sviluppato per piloti Moto3 professionisti.

**Tech Stack**:
- React + TypeScript
- Hono + Drizzle
- Cloudflare Workers
- Radix UI + Tailwind

---

**🏁 Buon allenamento! 🏍️**
