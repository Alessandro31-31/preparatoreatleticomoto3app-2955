# 🚀 Moto3 Training App - Deployment Guide

## ✅ Deploy COMPLETO su Cloudflare (Raccomandato)

Questa è la **versione completa** con backend, database, autenticazione e tutte le funzionalità.

### **PASSO 1: Installa Dipendenze**

```bash
npm install
```

### **PASSO 2: Genera Migrazioni Database**

```bash
npx drizzle-kit generate --config=drizzle.config.ts
```

### **PASSO 3: Login Cloudflare**

```bash
npx wrangler login
```

Si aprirà il browser per autenticarti.

### **PASSO 4: Crea Database D1**

```bash
npx wrangler d1 create moto3-training-db
```

📋 **IMPORTANTE**: Copia il `database_id` che ti viene mostrato.

### **PASSO 5: Configura wrangler.jsonc**

Apri `wrangler.jsonc` e sostituisci:

```json
"d1_databases": [
  {
    "binding": "D1",
    "database_name": "moto3-training-db",
    "database_id": "IL-TUO-DATABASE-ID-QUI",
    "migrations_dir": "./drizzle"
  }
]
```

### **PASSO 6: Applica Migrazioni**

```bash
npx wrangler d1 migrations apply moto3-training-db --remote
```

### **PASSO 7: Compila l'App**

```bash
npm run build
```

Questo crea la cartella `dist/client` con i file compilati.

### **PASSO 8: Deploy!**

```bash
npx wrangler deploy
```

🎉 **FATTO!** Cloudflare ti darà l'URL pubblico dell'app.

---

## 🌐 URL Finale

Dopo il deploy, il tuo link sarà tipo:

```
https://my-react-app.YOUR-SUBDOMAIN.workers.dev
```

---

## ⚠️ Troubleshooting

### "assets.directory does not exist"
➡️ Hai dimenticato di fare `npm run build` prima di deployare.

### "database_id is invalid"
➡️ Controlla di aver copiato il database_id corretto da `wrangler d1 create`.

### Errori durante build
```bash
# Pulisci e riprova
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Note

- ✅ Database D1 (SQLite)
- ✅ Autenticazione Better Auth
- ✅ Backend API Hono
- ✅ Frontend React
- ✅ Completamente funzionante
- ✅ GRATIS su Cloudflare (piano free)
