# 🚀 Moto3 Training App - Quick Start per Windows

## ✅ Status: APP PRONTA PER IL DEPLOY

Tutti gli errori sono stati corretti. L'app compila senza problemi.

---

## 📋 **COMANDI DA ESEGUIRE (in ordine)**

Apri il terminale PowerShell o CMD nella cartella del progetto e esegui questi comandi **uno alla volta**:

### **1️⃣ Verifica che npm install sia completato**

Se non hai ancora installato le dipendenze:

```bash
npm install
```

Aspetta che finisca (vedrai il prompt del terminale tornare).

---

### **2️⃣ Login a Cloudflare**

```bash
npx wrangler login
```

- Si aprirà il browser
- Fai login con il tuo account Cloudflare
- Se non hai un account, creane uno GRATIS su: https://dash.cloudflare.com/sign-up
- Torna al terminale quando vedi "Successfully logged in"

---

### **3️⃣ Crea il Database D1**

```bash
npx wrangler d1 create moto3-training-db
```

**IMPORTANTE**: Copia il `database_id` che appare nell'output.

Vedrai qualcosa tipo:

```
✅ Successfully created DB 'moto3-training-db'

[[d1_databases]]
binding = "D1"
database_name = "moto3-training-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  ← COPIA QUESTO!
```

---

### **4️⃣ Configura wrangler.jsonc**

Apri il file `wrangler.jsonc` con un editor di testo (Notepad, VSCode, etc.)

Trova questa sezione (verso la riga 23):

```json
"d1_databases": [
  {
    "binding": "D1",
    "database_name": "testing",
    "database_id": "xyz",
    "migrations_dir": "./drizzle"
  }
]
```

**Sostituisci**:
- `"database_name": "testing"` → `"database_name": "moto3-training-db"`
- `"database_id": "xyz"` → `"database_id": "IL-TUO-DATABASE-ID-COPIATO"`

Esempio finale:

```json
"d1_databases": [
  {
    "binding": "D1",
    "database_name": "moto3-training-db",
    "database_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "migrations_dir": "./drizzle"
  }
]
```

**SALVA IL FILE!**

---

### **5️⃣ Applica le Migrazioni al Database**

```bash
npx wrangler d1 migrations apply moto3-training-db --remote
```

Quando chiede conferma, digita `y` e premi Invio.

Vedrai: `✅ Applied X migrations`

---

### **6️⃣ Deploy l'App su Cloudflare!**

```bash
npx wrangler deploy
```

---

## 🎉 **FATTO!**

Dopo il deploy, vedrai un output tipo:

```
✨ Deployment complete!
🌍 https://my-react-app.XXXX.workers.dev
```

**Quel link è l'URL PUBBLICO della tua app!** 🎉

---

## 🔧 **Configurazione Finale (IMPORTANTE)**

### **Aggiorna l'URL nell'app**

Apri di nuovo `wrangler.jsonc` e trova (riga ~17):

```json
"vars": {
  "VITE_BETTER_AUTH_URL": "http://localhost:5173",
```

**Sostituisci** con il tuo URL pubblico:

```json
"vars": {
  "VITE_BETTER_AUTH_URL": "https://my-react-app.XXXX.workers.dev",
```

**Sostituisci anche** `BETTER_AUTH_SECRET` con una chiave segreta casuale:

```json
"BETTER_AUTH_SECRET": "una-stringa-casuale-molto-lunga-e-sicura-123456789",
```

**SALVA** e rideploya:

```bash
npx wrangler deploy
```

---

## 🎮 **Come Usare l'App**

1. Apri il link: `https://my-react-app.XXXX.workers.dev`
2. Click su **"Sign Up"** (in alto a destra)
3. Crea un account (email + password)
4. Login
5. Compila il profilo
6. Inizia a usare l'app! 🏁

---

## 📱 **Cosa Puoi Fare nell'App**

### **Pagine Disponibili:**

- 🏠 **Dashboard** - Overview generale
- 📅 **Calendar** - Programma 18 settimane
- 🏋️ **Session Detail** - Allenamenti giornalieri
- 🌅 **Morning Routine** - Routine mobilità mattutina
- 🔧 **Prep & Recovery** - 4 protocolli (riscaldamento, cooldown, stretching, foam rolling)
- 🛠️ **Monitoring Tools** - Readiness check, timer, calcolatori
- 🚩 **Red Flags** - Sistema alert e bandiere rosse
- 📊 **Progress** - Grafici e analisi + Export PDF
- 👤 **Profile** - Profilo utente e impostazioni

---

## ⚠️ **Troubleshooting**

### **"database_id is invalid"**
➡️ Hai sbagliato a copiare il database_id. Ricontrolla in `wrangler.jsonc`.

### **"Authentication failed"**
➡️ Hai dimenticato di aggiornare `VITE_BETTER_AUTH_URL` in `wrangler.jsonc` con il tuo URL pubblico.

### **"Migrations failed"**
➡️ Assicurati di aver eseguito:
```bash
npx drizzle-kit generate --config=drizzle.config.ts
```

### **Il sito non carica**
➡️ Aspetta 30-60 secondi dopo il deploy. Cloudflare impiega un po' a propagare.

### **Errore 500**
➡️ Controlla che `BETTER_AUTH_SECRET` non sia vuoto in `wrangler.jsonc`.

---

## 🆓 **Costi**

**Cloudflare Workers è GRATIS** per:
- 100.000 richieste/giorno
- Database D1 fino a 5GB
- Larghissimamente sufficiente per uso personale!

---

## 📝 **Aggiornamenti Futuri**

Per aggiornare l'app dopo modifiche:

```bash
npm run build
npx wrangler deploy
```

---

## 📞 **Supporto**

- **Documentazione completa**: Vedi `README_APP.md`
- **Problemi**: Crea issue su GitHub
- **Deploy Guide**: Vedi `DEPLOY.md`

---

## 🏁 **Checklist Finale**

Prima di usare l'app, assicurati di aver fatto:

- [ ] `npm install` completato
- [ ] `npx wrangler login` fatto
- [ ] Database D1 creato
- [ ] `database_id` copiato in `wrangler.jsonc`
- [ ] `database_name` cambiato in `moto3-training-db`
- [ ] Migrazioni applicate con `migrations apply`
- [ ] `npx wrangler deploy` eseguito
- [ ] `VITE_BETTER_AUTH_URL` aggiornato con URL pubblico
- [ ] `BETTER_AUTH_SECRET` impostato
- [ ] Secondo deploy fatto
- [ ] Account creato sull'app
- [ ] Profilo compilato

**Buon allenamento! 🏍️💨**
