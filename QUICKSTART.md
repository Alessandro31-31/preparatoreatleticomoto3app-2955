# 🏍️ Moto3 Pilot Trainer - Guida Rapida

## 🚀 Inizia in 3 Minuti

### 1️⃣ Installa sul Telefono

**iPhone/iPad:**
1. Apri Safari → Vai al sito
2. Tocca **⬆️ Condividi**
3. Seleziona **"Aggiungi a Home"**
4. ✅ Fatto! L'icona è sulla home

**Android:**
1. Apri Chrome → Vai al sito
2. Tocca **⋮ Menu**
3. Seleziona **"Installa app"**
4. ✅ Fatto! L'app è installata

### 2️⃣ Prima Configurazione

**Mattina - Readiness Check:**
1. Apri l'app
2. Vai su **Readiness** (bottom nav)
3. Valuta: Sonno, Stress, Energia, Motivazione
4. Inserisci HRV (se hai un monitor)
5. Tap **"Save Assessment"**

**Programma Allenamento:**
1. Vai su **Calendar**
2. Seleziona **Week 1**
3. Scegli il giorno (es. Monday)
4. Inizia con **Morning Routine**
5. Completa gli esercizi
6. Tap **"Mark as Complete"**

### 3️⃣ Usa gli Strumenti

**🤖 Virtual Coach AI:**
- Domande rapide: "Come migliorare in curva?"
- Consigli personalizzati in tempo reale
- 15+ anni esperienza Moto3

**⏱️ Lap Simulator:**
- Inserisci target lap: `1:45.234`
- Inserisci tuo lap: `1:46.012`
- Analizza delta e settori

**🧠 Mental Training:**
- Pre-gara: Meditazione 5 min
- Visualizza il giro perfetto
- Box breathing anti-stress

**🍽️ Nutrition:**
- Aggiungi pasti giornalieri
- Target: 2800 cal, 180g protein
- Tracking automatico macro

## 📊 Come Funziona

### Bottom Navigation (sempre visibile)
- **🏠 Home** - Dashboard e quick access
- **📅 Calendar** - 18 settimane allenamento
- **💪 Readiness** - Valutazione giornaliera
- **📊 Progress** - Statistiche e achievement

### Dati Salvati Automaticamente
- ✅ Tutto salvato in **localStorage**
- ✅ Funziona **offline** (senza internet)
- ✅ Nessun account richiesto
- ✅ Privacy totale (dati solo sul tuo device)

## 🎯 Routine Consigliata

### Ogni Mattina (5 min)
1. Apri **Readiness**
2. Compila assessment (HRV, sonno, energia)
3. Controlla score (target: ≥20/25)
4. Se <15 → considera recovery day

### Prima dell'Allenamento (10 min)
1. **Morning Routine** (mobilità 12 min)
2. Controlla **Calendar** → Esercizi del giorno
3. Leggi note tecniche e RPE target

### Durante l'Allenamento
1. Segui gli esercizi indicati
2. Rispetta sets, reps, rest, tempo
3. Marca **completato** dopo ogni sessione

### Dopo l'Allenamento (5 min)
1. Recovery/Cooldown session
2. Aggiungi **Nutrition** (pasti e macro)
3. **Progress** → controlla trend

### Prima di Dormire (10 min)
1. **Mental Training** → Deep Recovery
2. Rivedi **Progress** settimanale
3. Prepara il giorno dopo

## 🏁 Prima della Gara

### 3 Giorni Prima
- Controlla **Readiness** ogni mattina
- HRV deve essere ≥55ms
- Ridurre volume allenamento

### Giorno Gara - Mattina
1. **Mental Training** → Pre-race Meditation (5 min)
2. **Mental Training** → Visualizzazione Circuito (10 min)
3. Readiness check finale

### Pre-Qualifying
1. **Mental Training** → Laser Focus (3 min)
2. **Bike Setup** → verifica checklist
3. Breathing exercises

### Post-Sessione
1. **Lap Simulator** → analizza tempi
2. **Video Analysis** → review tecnica
3. Note per miglioramento

## 💡 Tips & Tricks

### Massimizza HRV
- Dormi 8-9h
- Idratazione: 3-4L/giorno
- Recovery attivo nei giorni off
- Box Breathing prima dormire

### Progressione Ottimale
- **Settimane 1-3:** Tecnica e fondamenta
- **Settimana 4:** Deload (50% volume)
- **Settimane 5-11:** Forza e potenza
- **Settimane 12-15:** Peak specifico moto
- **Settimane 16-18:** Taper per gara

### Red Flags - Quando Fermarsi
- ⚠️ HRV < 45ms per 2+ giorni
- ⚠️ Readiness < 15/25 per 3+ giorni
- ⚠️ Sonno < 6h per 2+ notti
- ⚠️ Dolore persistente >48h
- → **Prendi un giorno off!**

### Nutrizione Pre-Gara
- **-3h:** Pasto carboidrati complessi
- **-1h:** Snack leggero (banana + acqua)
- **-30min:** Sorseggia acqua
- **Durante:** 150-250ml/15min

## 🔧 Personalizzazione Rapida

### Cambia Obiettivi Nutrizionali
File: `src/pages/moto3/nutrition.tsx`
```typescript
const goals = {
  calories: 3000,  // Il tuo target
  protein: 200,
  carbs: 350,
  fats: 90
}
```

### Aggiungi Esercizi Custom
File: `src/data/trainingData.ts`
```typescript
{
  name: 'Mio Esercizio',
  sets: 4,
  reps: 10,
  tempo: '2-0-2-0',
  rest: 90,
  rpe: 7,
  notes: 'Focus sulla forma'
}
```

### Modifica Colore App
File: `index.html`
```html
<meta name="theme-color" content="#FF0000" />
```

## ❓ FAQ

**Q: I dati si sincronizzano tra dispositivi?**
A: No, tutto è salvato localmente per privacy. Usa un solo device.

**Q: Funziona senza internet?**
A: Sì! Una volta caricata, funziona 100% offline.

**Q: Posso modificare gli allenamenti?**
A: Sì, edita `src/data/trainingData.ts`

**Q: Come esporto i dati?**
A: Usa browser DevTools → Application → localStorage → copia JSON

**Q: Quanto spazio occupa?**
A: ~2-3MB. Tutti i dati sono in localStorage.

**Q: È sicuro per i miei dati?**
A: Sì, nessun dato esce dal tuo telefono. Zero server, zero tracking.

## 📞 Supporto

**Problemi?**
- Controlla che JavaScript sia abilitato
- Prova modalità incognito
- Cancella cache browser
- Reinstalla l'app

**Feature requests?**
- Apri issue su GitHub
- Contribuisci con PR

---

## 🏆 Obiettivo Finale

**Settimana 18 → Sei pronto per:**
- ✅ Peak performance fisica
- ✅ Forza e potenza ottimali
- ✅ Recovery perfetta (HRV ≥60ms)
- ✅ Mental game solido
- ✅ Setup moto dialed in
- ✅ Lap times consistenti
- ✅ Nutrition ottimizzata

**🏁 VAI E VINCI! 🏍️💨**

---

Made with ❤️ for Moto3 pilots
