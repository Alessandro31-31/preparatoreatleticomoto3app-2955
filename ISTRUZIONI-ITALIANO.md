# 🏍️ MOTO3 TRAINING PRO - Istruzioni

## 🚀 AVVIO RAPIDO (1 CLICK)

### ✅ Metodo 1: Locale (Raccomandato per iniziare)

1. **Doppio click su `AVVIA-APP.bat`**
2. Aspetta che si apra il browser automaticamente
3. Vai su `http://localhost:5173`
4. Crea un account e inizia ad usare l'app!

### 🌐 Metodo 2: Deploy Online (Per usare da telefono)

1. **Doppio click su `DEPLOY-CLOUDFLARE.bat`**
2. Premi **Y** quando richiesto
3. Aspetta il completamento (2-3 minuti)
4. Riceverai un URL tipo: `https://my-react-app.workers.dev`
5. Apri quell'URL da qualsiasi dispositivo!

---

## 📱 USARE L'APP SUL TELEFONO

Dopo il deploy su Cloudflare:

### iPhone:
1. Apri Safari e vai all'URL della tua app
2. Tap sul pulsante "Condividi" (quadrato con freccia)
3. Scorri e tap "Aggiungi a Home"
4. Tap "Aggiungi"
5. Ora hai l'app sulla home screen! 🎉

### Android:
1. Apri Chrome e vai all'URL della tua app
2. Tap sul menu (3 puntini)
3. Tap "Aggiungi a Home"
4. Tap "Aggiungi"
5. Ora hai l'app sulla home screen! 🎉

---

## 📊 FUNZIONALITÀ DISPONIBILI

### 1. **Dashboard** (/)
- Panoramica HRV, carico settimanale, rigidità
- Alert bandiere rosse
- Statistiche settimana corrente

### 2. **Mattutina di Routine** (/routine)
- 12 minuti di mobilità guidata
- Timer integrato per ogni esercizio
- Valutazione rigidità pre/post
- Target: miglioramento ≥2.0 punti

### 3. **Calendario 18 Settimane** (/calendar)
- Programmazione completa mesocicli
- Click su settimana → vedi 7 giorni
- Colori per fase (Adattamento → Ipertrofia → Forza → Potenza → Picco)

### 4. **Tools di Monitoraggio** (/tools)
- **Readiness Check**: 5 metriche giornaliere
- **Timer Multi-Intervallo**: Work/Rest personalizzabile
- **Calcolatore ACR**: Prevenzione infortuni (sweet spot 0.8-1.3)
- **Monitor HRV**: Target ≥55ms

### 5. **Preparazione e Recupero** (/preparation)
- **Riscaldamento**: 6 esercizi Moto3-specifici
- **Raffreddamento**: 5 esercizi post-allenamento
- **Stretching**: 8 esercizi dedicati (giorno riposo)
- **Foam Rolling**: 8 zone muscolari
- **Riferimento Rapido**: Protocolli pre/post track

### 6. **Sistema Bandiera Rossa** (/red-flags)
- 8 categorie warning (infortunio, fatica, HRV, dolore...)
- 3 livelli severità (Low/Medium/High)
- Azioni raccomandate automatiche
- Tracking risoluzione

### 7. **Progressioni Attese** (/progressions)
- Target settimana 1 → 6 → 12 → 18
- 4 categorie (Forza, Potenza, Core, Conditioning)
- Badge "On Track" / "Behind"
- 5 milestones programma

### 8. **Progressi e Analisi** (/progress)
- **Grafici Peso**: Trend temporale
- **Grafici HRV**: Con badge Good/Fair/Low
- **Grafici Rigidità**: Delta routine mattutina
- **Grafici Carico**: RPE × Duration
- **Export PDF**: Report completo
- Range: 7/14/30/90 giorni

### 9. **Profilo** (/profile)
- Impostazioni account
- Tema Dark/Light
- Lingua (IT/EN/ES)
- Unità misura (Metrico/Imperiale)

---

## 🎯 METRICHE CHIAVE

- **HRV Target**: ≥55ms (recupero ottimale)
- **Rigidità Delta**: ≥2.0 punti miglioramento
- **ACR Sweet Spot**: 0.8-1.3 (prevenzione infortuni)
- **Completamento Sessioni**: >90%
- **Sonno**: 8-9 ore raccomandato

---

## ⚙️ RISOLUZIONE PROBLEMI

### L'app non si avvia localmente
1. Verifica di avere **Bun** installato: `bun --version`
2. Se non ce l'hai, installa da: https://bun.sh
3. Riprova con `AVVIA-APP.bat`

### Il deploy fallisce
1. Verifica di essere loggato: `bunx wrangler whoami`
2. Se non loggato: `bunx wrangler login`
3. Riprova con `DEPLOY-CLOUDFLARE.bat`

### Database D1 errori
Il file `DEPLOY-CLOUDFLARE.bat` elimina automaticamente il worker vecchio e lo ricrea, risolvendo problemi di configurazione.

---

## 📞 SUPPORTO

- **Email**: support@moto3training.com
- **AI Coach**: Disponibile in `/chat` nell'app
- **GitHub**: https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955

---

## 🏁 FASI ALLENAMENTO (18 SETTIMANE)

1. **Settimane 1-3**: Adattamento Anatomico
2. **Settimana 4**: Scarico 1
3. **Settimane 5-7**: Ipertrofia
4. **Settimana 8**: Scarico 2
5. **Settimana 9**: Base Forza
6. **Settimane 10-11**: Transfer + Potenza
7. **Settimana 12**: Scarico 3
8. **Settimane 13-15**: Picco Transfer
9. **Settimana 16**: Taper + Scarico
10. **Settimane 17-18**: Picco Competizione 🏆

---

**Moto3 Training Pro** - Allenati come un campione! 🏍️💨
