# Moto3 Training App - Frontend Only

🚨 **NOTA IMPORTANTE**: Questa versione è solo FRONTEND (senza backend).

## Deploy su Vercel

1. Vai su https://vercel.com
2. Importa: `Alessandro31-31/preparatoreatleticomoto3app-2955`
3. Deploy

## Limitazioni

- ❌ No salvataggio dati (solo UI)
- ❌ No autenticazione
- ❌ No database
- ✅ Tutte le pagine funzionano (con dati mock)

## Per Versione Completa

Usa Cloudflare:
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist/client
```
