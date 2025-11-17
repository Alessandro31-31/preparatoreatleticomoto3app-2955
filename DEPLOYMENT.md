# 🚀 Guida al Deploy - Moto3 Training Pro

Questa guida ti mostra come deployare l'app in produzione usando diverse piattaforme.

## 📋 Preparazione

Prima di deployare, assicurati di:
1. ✅ Aver completato il build locale: `bun run build`
2. ✅ Verificare che non ci siano errori TypeScript
3. ✅ Testare l'app localmente: `bun dev`

---

## 🟢 Opzione 1: Vercel (Raccomandato - Più Semplice)

### Vantaggi
- ✅ Deploy gratuito
- ✅ SSL automatico
- ✅ Deploy automatico da GitHub
- ✅ CDN globale
- ✅ Zero configurazione

### Passaggi

1. **Crea account Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Registrati con GitHub

2. **Deploy da GitHub**
   ```bash
   # Push il codice su GitHub (già fatto)
   # Poi su Vercel:
   # - Click "New Project"
   # - Seleziona il repository
   # - Click "Deploy"
   ```

3. **Configurazione Automatica**
   Vercel rileva automaticamente Vite e configura:
   - Build Command: `bun run build`
   - Output Directory: `dist/client`
   - Install Command: `bun install`

4. **Variabili d'Ambiente** (opzionali per funzionalità avanzate)
   ```
   VITE_BETTER_AUTH_URL=https://tuo-sito.vercel.app
   ```

**🎉 Il tuo sito sarà live su: `https://tuo-progetto.vercel.app`**

---

## 🟠 Opzione 2: Netlify

### Vantaggi
- ✅ Deploy gratuito
- ✅ Form handling
- ✅ Serverless functions
- ✅ CDN globale

### Passaggi

1. **Crea account Netlify**
   - Vai su [netlify.com](https://netlify.com)
   - Registrati con GitHub

2. **Deploy da GitHub**
   ```bash
   # Push il codice su GitHub
   # Poi su Netlify:
   # - Click "New site from Git"
   # - Seleziona il repository
   ```

3. **Configurazione Build**
   ```yaml
   Build command: bun run build
   Publish directory: dist/client
   ```

4. **Aggiungi file netlify.toml** (opzionale)
   ```toml
   [build]
     command = "bun run build"
     publish = "dist/client"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

**🎉 Il tuo sito sarà live su: `https://tuo-progetto.netlify.app`**

---

## 🔵 Opzione 3: Cloudflare Pages (Con Autumn)

### Vantaggi
- ✅ Completamente gratuito
- ✅ CDN globale ultra-veloce
- ✅ Workers integrati
- ✅ Database D1
- ✅ Autenticazione e billing con Autumn

### Passaggi

1. **Setup Autumn**
   ```bash
   # Login su Autumn
   bun x atmn login

   # Segui le istruzioni per ottenere il tuo API key
   ```

2. **Configura .env**
   Crea file `.env` nella root:
   ```env
   AUTUMN_PROD_SECRET_KEY=your_autumn_key_here
   VITE_BETTER_AUTH_URL=https://tuo-sito.pages.dev
   BETTER_AUTH_SECRET=genera_una_stringa_casuale_sicura
   ```

3. **Deploy**
   ```bash
   bun run pre-deploy
   bun run autumn:push:prod
   ```

4. **Database Setup**
   ```bash
   # Visualizza dashboard
   bun run autumn:dashboard

   # Gestisci variabili d'ambiente
   bun run autumn:env
   ```

**🎉 Il tuo sito sarà live su: `https://tuo-progetto.pages.dev`**

---

## 🟣 Opzione 4: Deploy Manuale (Qualsiasi Hosting)

### Per hosting statici come GitHub Pages, Firebase Hosting, etc.

1. **Build dell'app**
   ```bash
   bun install
   bun run build
   ```

2. **La cartella `dist/client` contiene tutto il necessario**
   ```
   dist/client/
   ├── index.html
   ├── assets/
   ├── manifest.json
   └── sw.js
   ```

3. **Upload su qualsiasi hosting**
   - GitHub Pages: Push `dist/client` su branch `gh-pages`
   - Firebase: `firebase deploy --only hosting`
   - FTP: Upload contenuto di `dist/client`

---

## 🔧 Configurazioni Aggiuntive

### PWA su Dominio Personalizzato

Dopo il deploy, aggiorna `public/manifest.json`:
```json
{
  "start_url": "https://tuo-dominio.com/",
  "scope": "https://tuo-dominio.com/"
}
```

### Variabili d'Ambiente Necessarie

**Minime (solo frontend):**
```env
VITE_BETTER_AUTH_URL=https://tuo-sito.com
```

**Complete (con backend):**
```env
VITE_BETTER_AUTH_URL=https://tuo-sito.com
BETTER_AUTH_SECRET=genera-stringa-casuale-lunga-64-caratteri
AUTUMN_SECRET_KEY=ottieni-da-autumn.dev
ADMIN_EMAIL=tuo@email.com
```

### Generare Secret Sicuri

```bash
# Su Mac/Linux
openssl rand -base64 32

# Su qualsiasi sistema con Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔒 Note di Sicurezza

1. **Non committare mai i file .env**
   - Sono già in `.gitignore`
   - Usa variabili d'ambiente della piattaforma

2. **HTTPS Obbligatorio per PWA**
   - Tutte le piattaforme sopra forniscono HTTPS automatico
   - PWA non funziona su HTTP (tranne localhost)

3. **Service Worker**
   - Registrato automaticamente in `src/main.tsx`
   - Cache gestita in `public/sw.js`

---

## 📱 Test Mobile dopo Deploy

1. **iOS Safari**
   - Visita il sito deployato
   - Tap Share → Add to Home Screen
   - Apri l'app installata

2. **Android Chrome**
   - Visita il sito deployato
   - Verrà mostrato automaticamente il banner "Installa"
   - Oppure: Menu → Install app

3. **Desktop Chrome**
   - Visita il sito deployato
   - Click sull'icona + nella barra degli indirizzi
   - Oppure: Menu → Install Moto3 Training Pro

---

## 🐛 Risoluzione Problemi

### Build fallisce
```bash
# Pulisci cache e riprova
rm -rf node_modules dist .vite
bun install
bun run build
```

### PWA non installa
- ✅ Verifica HTTPS attivo
- ✅ Controlla `manifest.json` è accessibile
- ✅ Verifica Service Worker registrato (DevTools → Application)

### 404 su route
Aggiungi redirect SPA:
- **Vercel**: automatico
- **Netlify**: vedi `netlify.toml` sopra
- **Cloudflare**: automatico

---

## 📊 Monitoraggio

### Analytics (opzionale)

Aggiungi a `index.html` (prima di `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

### Performance Monitoring

- Vercel Analytics: automatico
- Cloudflare Web Analytics: gratuito, privacy-first
- Google Analytics: classico

---

## 🎯 Quick Deploy Summary

**Per iniziare SUBITO (5 minuti):**

1. Push su GitHub ✅ (già fatto)
2. Vai su [vercel.com](https://vercel.com)
3. Click "New Project"
4. Seleziona il repository
5. Click "Deploy"

**FATTO! 🚀**

Il tuo link sarà: `https://[repo-name]-[hash].vercel.app`

---

## 💡 Tips

- 🔄 **Auto-deploy**: Ogni push su `main` deploya automaticamente
- 🌍 **Domini custom**: Configura in Settings → Domains
- 📈 **Analytics**: Vercel/Netlify forniscono analytics gratuiti
- 🔐 **Environment Variables**: Configura nel dashboard della piattaforma

---

**Hai bisogno di aiuto?** Apri un issue su GitHub! 🤝
