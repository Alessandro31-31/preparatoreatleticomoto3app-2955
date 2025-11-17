# 🚀 Deploy su Vercel - Guida Rapida

## ✅ Problema Risolto: Pagina Bianca

Ho aggiunto i file di configurazione necessari per far funzionare l'app su Vercel:

- ✅ **vercel.json** - Routing per React Router (SPA rewrites)
- ✅ **vite.config.ts** - Build configuration corretta
- ✅ **.vercelignore** - Esclude file non necessari

---

## 🔧 Deploy con Vercel CLI

### 1. Installa Vercel CLI
```bash
npm i -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

**Segui il wizard:**
- `Set up and deploy?` → **YES**
- `Which scope?` → Scegli il tuo account
- `Link to existing project?` → **NO**
- `Project name?` → **moto3-trainer** (o come preferisci)
- `In which directory?` → **./** (premendo Enter)
- `Override settings?` → **NO**

✅ **Deploy completato!** Ti darà un URL tipo:
```
https://moto3-trainer-xyz123.vercel.app
```

### 4. Deploy Production
```bash
vercel --prod
```

---

## 🌐 Deploy con Vercel Website

### Metodo 1: Import da GitHub

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Connetti GitHub e seleziona:
   ```
   Alessandro31-31/preparatoreatleticomoto3app-2955
   ```
4. **Configurazione Build:**
   - **Framework Preset:** Vite
   - **Build Command:** `bun run build` oppure `npm run build`
   - **Output Directory:** `dist/client`
   - **Install Command:** `bun install` oppure `npm install`

5. Click **"Deploy"**

✅ **Fatto!** Il sito sarà live in 2-3 minuti

### Metodo 2: Deploy dal Branch

Se hai già un progetto Vercel:

1. Dashboard Vercel → Il tuo progetto
2. Settings → Git
3. Seleziona branch: `claude/mobile-moto3-trainer-01P9s79UgYgbBTdux1B3aSuw`
4. Save

---

## ⚙️ Configurazione Vercel (vercel.json)

Il file `vercel.json` è già configurato con:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist/client",
  "installCommand": "bun install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Cosa fa:**
- ✅ **rewrites** - Tutti i percorsi puntano a `/index.html` (necessario per React Router)
- ✅ **outputDirectory** - Specifica dove Vercel trova i file buildati
- ✅ **buildCommand** - Comando custom per il build

---

## 🔍 Troubleshooting

### Pagina Bianca?

1. **Controlla la Console del Browser:**
   - F12 → Console
   - Cerca errori JavaScript
   - Errori 404 per assets

2. **Verifica Build Log su Vercel:**
   - Dashboard → Deployment → View Build Logs
   - Cerca errori nel build

3. **Settings su Vercel:**
   - Vai in **Settings** → **General**
   - **Output Directory:** `dist/client`
   - **Install Command:** `bun install` o `npm install`
   - **Build Command:** `bun run build` o `npm run build`

### Routing non funziona?

Verifica che `vercel.json` contenga i rewrites:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### 404 su refresh?

È normale! Il rewrite in `vercel.json` lo risolve automaticamente.

---

## 🎯 Environment Variables (Opzionale)

Se l'app usa variabili d'ambiente:

1. Dashboard Vercel → Settings → Environment Variables
2. Aggiungi le tue variabili:
   ```
   VITE_API_URL=https://api.example.com
   ```
3. Redeploy

---

## 📱 Dopo il Deploy

1. **Apri l'URL dal telefono**
2. **Safari (iOS):**
   - Tap ⬆️ Condividi
   - "Aggiungi a Home"

3. **Chrome (Android):**
   - Menu ⋮
   - "Installa app"

✅ **L'app funziona offline!**

---

## 🔗 Link Utili

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Docs Vercel:** https://vercel.com/docs
- **Vite + Vercel:** https://vercel.com/docs/frameworks/vite

---

## ⚡ Deploy Automatico

Ogni push su GitHub triggera un deploy automatico su Vercel!

- **Main/Master branch** → Production
- **Altri branch** → Preview deployment

---

## 📊 Monitoring

Dopo il deploy, Vercel ti offre:

- ✅ **Analytics** - Visite, performance
- ✅ **Speed Insights** - Core Web Vitals
- ✅ **Logs** - Errori e richieste
- ✅ **SSL** - HTTPS automatico

---

**🏁 Buon deploy! 🚀**

Se hai problemi, controlla:
1. Build logs su Vercel
2. Console browser (F12)
3. Configurazione in `vercel.json`
