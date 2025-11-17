# 🎯 QUICK START - Deploy in 3 Click! 🚀

## 📱 Hai Fretta? Ecco il Link per Deployare SUBITO!

### ⚡ OPZIONE 1: Deploy con Vercel (60 secondi)

**👉 [CLICCA QUI PER DEPLOYARE SU VERCEL](https://vercel.com/new/clone?repository-url=https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955)**

**Cosa succede:**
1. Ti chiederà di fare login con GitHub
2. Click su "Deploy"
3. Aspetta 30-60 secondi
4. **PRONTO!** Riceverai un link tipo: `https://moto3-training.vercel.app`

---

### 🟠 OPZIONE 2: Deploy con Netlify

**👉 [CLICCA QUI PER DEPLOYARE SU NETLIFY](https://app.netlify.com/start/deploy?repository=https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955)**

**Cosa succede:**
1. Login con GitHub
2. Click "Connect to GitHub"
3. Click "Save & Deploy"
4. **PRONTO!** Link: `https://moto3-training.netlify.app`

---

## 🎉 Dopo il Deploy

### Installare l'App su Mobile

#### iPhone/iPad:
1. Vai al link del tuo sito
2. Tap sul pulsante Condividi (quadrato con freccia ↗️)
3. Scorri e tap "Aggiungi a Home"
4. Tap "Aggiungi"
5. **FATTO!** Hai l'app sulla home screen! 📱

#### Android:
1. Vai al link del tuo sito
2. Tap sul menu (3 puntini verticali ⋮)
3. Tap "Installa app" o "Aggiungi a Home"
4. Tap "Installa"
5. **FATTO!** L'app è installata! 📱

---

## ✨ Tutte le Funzionalità Disponibili

### 🏋️ Allenamento
- ✅ **Calendario 18 Settimane** - Visualizza tutto il programma
- ✅ **Routine Mattutina** - 12 minuti di mobilità guidata
- ✅ **Sessioni Allenamento** - Traccia ogni workout

### 💪 Monitoraggio
- ✅ **HRV Tracking** - Monitora recupero
- ✅ **Sleep Quality** - Qualità del sonno
- ✅ **Readiness Score** - Valuta disponibilità giornaliera
- ✅ **Red Flags** - Alert automatici

### 🛠️ Tools
- ✅ **Timer Intervalli** - Personalizzabile per work/rest
- ✅ **ACR Calculator** - Prevenzione infortuni
- ✅ **Readiness Check** - Valutazione quotidiana
- ✅ **HRV Monitor** - Tracking variabilità cardiaca

### 📊 Analytics
- ✅ **Progress Charts** - Grafici performance
- ✅ **Weekly Load** - Gestione carico allenamento
- ✅ **Milestone Tracking** - Obiettivi raggiunti

### 📱 Mobile PWA
- ✅ **Offline Mode** - Funziona senza internet
- ✅ **Home Screen** - Si installa come app nativa
- ✅ **Push Notifications** - Alert e promemoria
- ✅ **Touch Optimized** - Perfetto per touchscreen
- ✅ **Safe Areas** - Supporto notch iPhone

---

## 🔧 Personalizzazione

### Cambiare Colori
Modifica `/src/styles/global.css`:
```css
:root {
  --primary: oklch(0.6 0.12 190);  /* Blu primario */
  --background: oklch(0.985 0.008 95); /* Sfondo chiaro */
}
```

### Modificare Esercizi
Edita `/public/training-data.json`:
```json
{
  "exercises": [
    {
      "name": "Nuovo Esercizio",
      "sets": 3,
      "reps": 12
    }
  ]
}
```

### Aggiungere Pagine
1. Crea file in `/src/pages/nuova-pagina.tsx`
2. Aggiungi route in `/src/app.tsx`:
```tsx
<Route path="/nuova-pagina" element={<NuovaPagina />} />
```

---

## 📝 Link Utili

- 🌐 **Repository GitHub**: https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955
- 📖 **Guida Completa**: Vedi `README.md`
- 🚀 **Deployment Dettagliato**: Vedi `DEPLOYMENT.md`
- 💻 **Test Locale**: `bun install && bun dev`

---

## 🆘 Hai Problemi?

### Build non funziona?
```bash
rm -rf node_modules dist
bun install
bun run build
```

### PWA non si installa?
- ✅ Assicurati di usare HTTPS (Vercel/Netlify lo fanno automatico)
- ✅ Prova a ricaricare la pagina
- ✅ Controlla che Service Worker sia registrato (DevTools → Application)

### Link non funzionano?
- È normale per le route SPA
- Vercel e Netlify gestiscono automaticamente i redirect
- Se usi altro hosting, vedi `DEPLOYMENT.md`

---

## 💡 Tips & Tricks

1. **Auto-Deploy**: Ogni volta che fai push su GitHub, l'app si aggiorna automaticamente!

2. **Domini Custom**:
   - Su Vercel: Settings → Domains → Add
   - Su Netlify: Domain Settings → Add custom domain

3. **Analytics Gratuiti**:
   - Vercel fornisce analytics automatici
   - Netlify ha analytics integrati

4. **Performance**:
   - PWA carica istantaneamente dopo la prima visita
   - Service Worker fa cache intelligente
   - Funziona offline dopo il primo caricamento

---

## 🎯 Checklist Post-Deploy

- [ ] Visitare il link del sito deployato
- [ ] Testare la registrazione utente
- [ ] Installare l'app su telefono
- [ ] Provare modalità offline (disattiva WiFi)
- [ ] Testare tutte le pagine (Calendar, Routine, Tools)
- [ ] Verificare che i dati si salvino
- [ ] Provare il timer intervalli
- [ ] Testare la routine mattutina

---

## 🎊 Congratulazioni!

Hai ora una **app mobile completa e professionale** per il training Moto3!

- ✅ Funziona su qualsiasi dispositivo
- ✅ Installabile come app nativa
- ✅ Funziona offline
- ✅ Completamente personalizzabile
- ✅ Deploy automatico da GitHub

**Buon allenamento! 🏍️💨**

---

**Made with ❤️ for Moto3 Training**
