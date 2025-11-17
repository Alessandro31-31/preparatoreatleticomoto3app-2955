# ✏️ COME MODIFICARE TUTTO - Guida Completa

## 🎯 TUTTE LE FUNZIONALITÀ DI EDITING SONO PRESENTI!

L'app ha **10 schermate di editing** per modificare ogni aspetto.

---

## 📝 SCHERMATE DI MODIFICA DISPONIBILI

### 1. **Edit Warmup** (Modifica Riscaldamento)
📍 **Percorso**: Home → Warmup → Pulsante "Edit" in alto a destra

**Puoi modificare:**
- ✅ Esercizi di riscaldamento
- ✅ Durata di ogni esercizio
- ✅ Numero di ripetizioni
- ✅ Note e descrizioni
- ✅ Ordine degli esercizi

**File**: `mobile-app/app/edit-warmup.tsx`

---

### 2. **Edit Cooldown** (Modifica Raffreddamento)
📍 **Percorso**: Home → Cooldown → Pulsante "Edit"

**Puoi modificare:**
- ✅ Esercizi di raffreddamento
- ✅ Durata
- ✅ Intensità
- ✅ Descrizioni

**File**: `mobile-app/app/edit-cooldown.tsx`

---

### 3. **Edit Stretching** (Modifica Stretching)
📍 **Percorso**: Home → Stretching → Pulsante "Edit"

**Puoi modificare:**
- ✅ Esercizi di stretching
- ✅ Muscoli coinvolti
- ✅ Durata hold
- ✅ Ripetizioni

**File**: `mobile-app/app/edit-stretching.tsx`

---

### 4. **Edit Foam Rolling** (Modifica Foam Rolling)
📍 **Percorso**: Home → Foam Rolling → Pulsante "Edit"

**Puoi modificare:**
- ✅ Zone da trattare
- ✅ Durata per zona
- ✅ Pressione
- ✅ Note tecniche

**File**: `mobile-app/app/edit-foam-rolling.tsx`

---

### 5. **Edit Morning Routine** (Modifica Routine Mattutina)
📍 **Percorso**: Home → Morning Routine → Pulsante "Edit"

**Puoi modificare:**
- ✅ Attività mattutine
- ✅ Orari
- ✅ Sequenza
- ✅ Checklist personale

**File**: `mobile-app/app/edit-morning-routine.tsx`

---

### 6. **Edit Quick Reference** (Modifica Riferimento Rapido)
📍 **Percorso**: Home → Quick Reference → Pulsante "Edit"

**Puoi modificare:**
- ✅ Checklist rapide
- ✅ Promemoria
- ✅ Note importanti

**File**: `mobile-app/app/edit-quick-reference.tsx`

---

### 7. **Edit Data** (Editor Dati Generale)
📍 **Percorso**: Settings → Edit Data

**Puoi modificare:**
- ✅ Tutti i dati dell'app
- ✅ Programmi di allenamento
- ✅ Esercizi personalizzati
- ✅ Calendari
- ✅ Obiettivi

**File**: `mobile-app/app/edit-data.tsx`

---

### 8. **Content Manager** (Gestione Contenuti)
📍 **Percorso**: Settings → Content Manager

**Puoi modificare:**
- ✅ Gestione completa contenuti
- ✅ Import/Export dati
- ✅ Backup e restore
- ✅ Organizzazione contenuti

**File**: `mobile-app/app/content-manager.tsx`

---

### 9. **Content AI Guide** (Guida AI per Contenuti)
📍 **Percorso**: Content Manager → AI Guide

**Funzionalità:**
- ✅ Suggerimenti AI per creare contenuti
- ✅ Template predefiniti
- ✅ Idee per esercizi
- ✅ Programmi automatici

**File**: `mobile-app/app/content-ai-guide.tsx`

---

### 10. **Content Examples** (Esempi Contenuti)
📍 **Percorso**: Content Manager → Examples

**Funzionalità:**
- ✅ Esempi di programmi
- ✅ Template pronti
- ✅ Best practices
- ✅ Ispirazione

**File**: `mobile-app/app/content-examples.tsx`

---

## 🎨 COME ACCEDERE ALLE FUNZIONI DI MODIFICA

### Metodo 1: Dalla Schermata Principale
1. Apri l'app
2. Vai alla funzionalità che vuoi modificare (es. Warmup)
3. Cerca il pulsante "Edit" o l'icona ✏️ in alto a destra
4. Tocca per entrare in modalità editing

### Metodo 2: Da Settings
1. Apri l'app
2. Vai su "Settings" (tab in basso)
3. Trovi:
   - "Edit Data" → Editor generale
   - "Content Manager" → Gestione avanzata contenuti

### Metodo 3: Da Content Manager
1. Settings → Content Manager
2. Scegli cosa modificare:
   - Training Programs
   - Exercises
   - Routines
   - Calendars
   - etc.

---

## 📂 MODIFICARE I FILE DIRETTAMENTE

Se vuoi modificare il codice sorgente:

### Dati di Allenamento
**File**: `mobile-app/data/trainingData.ts`

Contiene TUTTI i dati:
- Esercizi
- Programmi
- Routine
- Calendari
- Setup

**Come modificare:**
```bash
1. Apri il file in un editor (VS Code, Notepad++)
2. Modifica i dati
3. Salva
4. Riavvia l'app
```

### Stili e Colori
**File**: `mobile-app/styles/commonStyles.ts`

**Puoi modificare:**
- Colori
- Font
- Dimensioni
- Spaziature
- Bordi

### Schermate
**Cartella**: `mobile-app/app/`

Ogni schermata è un file `.tsx`:
- `warmup.tsx` → Schermata riscaldamento
- `cooldown.tsx` → Schermata raffreddamento
- etc.

---

## 🔧 MODIFICHE COMUNI

### Cambiare i Colori dell'App

1. Apri: `mobile-app/styles/commonStyles.ts`
2. Modifica i colori:
```typescript
export const colors = {
  primary: '#FF0000',      // Colore principale
  secondary: '#00FF00',    // Colore secondario
  background: '#000000',   // Sfondo
  text: '#FFFFFF',         // Testo
  // etc.
}
```

### Aggiungere Nuovi Esercizi

1. Apri: `mobile-app/data/trainingData.ts`
2. Aggiungi nel array degli esercizi:
```typescript
{
  id: 'nuovo-esercizio',
  name: 'Nome Esercizio',
  duration: 60,
  description: 'Descrizione...',
  // etc.
}
```

### Cambiare Nome App

1. Apri: `mobile-app/app.json`
2. Modifica:
```json
{
  "expo": {
    "name": "Tuo Nome App",
    "slug": "tuo-slug"
  }
}
```

### Cambiare Icona App

1. Sostituisci: `mobile-app/assets/images/natively-dark.png`
2. Con la tua icona (512x512 px)

---

## ⚠️ WEB APP vs APK

### Web App (Browser)
- ⚠️ Storage limitato
- ⚠️ Modifiche potrebbero non salvarsi tra sessioni
- ⚠️ Alcune funzioni di editing limitate

### APK Android
- ✅ Storage completo
- ✅ Tutte le modifiche salvate permanentemente
- ✅ Accesso completo al file system
- ✅ Import/Export file

**CONSIGLIO**: Per modificare liberamente, usa l'APK!

---

## 📱 COME USARE LE MODIFICHE

### Opzione 1: Modifica nell'App
1. Apri l'app
2. Usa gli editor integrati
3. Salva
4. Le modifiche sono immediate!

### Opzione 2: Modifica i File Sorgente
1. Scarica il progetto da GitHub
2. Apri i file in un editor
3. Modifica il codice
4. Ricompila:
   - Per Web: `npm run web`
   - Per APK: `eas build --platform android`

---

## 🎓 TUTORIAL COMPLETO

### Esempio: Modificare il Warmup

**PASSO 1**: Apri l'app

**PASSO 2**: Vai su "Warmup"

**PASSO 3**: Tocca il pulsante "Edit" (✏️) in alto a destra

**PASSO 4**: Vedrai la schermata di editing con:
- Lista di tutti gli esercizi
- Pulsante "+" per aggiungere
- Pulsante "🗑️" per eliminare
- Drag & drop per riordinare

**PASSO 5**: Fai le modifiche:
- Aggiungi esercizi
- Cambia durate
- Modifica descrizioni
- Riordina la sequenza

**PASSO 6**: Tocca "Save" o "Salva"

**PASSO 7**: Le modifiche sono salvate!

---

## 🔑 ACCESSO COMPLETO AI DATI

### Storage Locale
L'app usa **AsyncStorage** per salvare i dati.

**Dove sono i dati:**
- Web: LocalStorage del browser
- Android: `/data/data/com.moto3.pilottrainer/`
- iOS: App container

**Esportare i dati:**
1. Settings → Content Manager
2. Tocca "Export Data"
3. Salva il file JSON
4. Puoi modificarlo e re-importarlo

---

## 💡 SUGGERIMENTI

### Per Modifiche Rapide
→ Usa gli editor integrati nell'app

### Per Modifiche Avanzate
→ Modifica i file sorgente in `mobile-app/data/trainingData.ts`

### Per Personalizzazione Completa
→ Modifica il codice sorgente e ricompila

### Per Backup
→ Usa Content Manager → Export Data

---

## 🆘 PROBLEMI COMUNI

### ❌ "Non vedo il pulsante Edit"
→ Assicurati di essere nella schermata giusta
→ Cerca l'icona ✏️ in alto a destra
→ Oppure vai in Settings → Edit Data

### ❌ "Le modifiche non si salvano"
→ Su web app: limiti del browser
→ Soluzione: usa APK Android

### ❌ "Non trovo Content Manager"
→ Settings (tab in basso) → Content Manager

### ❌ "Voglio modificare il codice"
→ Scarica progetto da GitHub
→ Modifica i file .tsx e .ts
→ Ricompila con npm

---

## 📚 FILE CHIAVE PER MODIFICHE

```
mobile-app/
├── data/
│   └── trainingData.ts         ← TUTTI I DATI DELL'APP
├── styles/
│   └── commonStyles.ts         ← COLORI E STILI
├── app/
│   ├── edit-warmup.tsx         ← Editor warmup
│   ├── edit-cooldown.tsx       ← Editor cooldown
│   ├── edit-stretching.tsx     ← Editor stretching
│   ├── edit-foam-rolling.tsx   ← Editor foam rolling
│   ├── edit-morning-routine.tsx ← Editor morning routine
│   ├── edit-quick-reference.tsx ← Editor quick reference
│   ├── edit-data.tsx           ← Editor generale
│   ├── content-manager.tsx     ← Gestione contenuti
│   ├── content-ai-guide.tsx    ← Guida AI
│   └── content-examples.tsx    ← Esempi
└── app.json                    ← Config app
```

---

## 🚀 CONCLUSIONE

**TUTTE le funzionalità di modifica sono presenti!**

Puoi modificare:
- ✅ Esercizi
- ✅ Programmi
- ✅ Routine
- ✅ Calendari
- ✅ Dati personali
- ✅ Stili e colori
- ✅ Contenuti
- ✅ TUTTO!

**Metodi disponibili:**
1. Editor integrati nell'app
2. Modifica file sorgente
3. Export/Import dati JSON

**Per esperienza completa di editing:**
→ Usa l'APK Android (storage permanente e completo)

---

**Creato**: 2025-11-17
**Tutte le funzionalità di editing verificate e funzionanti!** ✅
