# 🪟 GUIDA COMPLETA PER WINDOWS - Moto3 Pilot Trainer

## 🎯 OBIETTIVO

Creare un'app che funziona SEMPRE sul telefono, anche con PC spento!

---

## 📥 FASE 1: SCARICA IL PROGETTO

### Passo 1.1: Vai su GitHub

Apri questo link nel browser:

```
https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955
```

### Passo 1.2: Scarica il ZIP

1. Clicca sul pulsante verde **"Code"**
2. Clicca **"Download ZIP"**
3. Salva sul **Desktop**

### Passo 1.3: Estrai il ZIP

1. Vai sul Desktop
2. Trova il file **preparatoreatleticomoto3app-2955-main.zip**
3. Tasto destro → **"Estrai tutto..."**
4. Clicca **"Estrai"**

Ora avrai la cartella **preparatoreatleticomoto3app-2955-main** sul Desktop!

---

## 🔧 FASE 2: INSTALLA NODE.JS (Se non ce l'hai)

### Passo 2.1: Verifica se hai Node.js

1. Premi **Win + R**
2. Scrivi: `cmd`
3. Premi Invio
4. Nel terminale scrivi: `node --version`

**Se vedi un numero (tipo v18.x.x):** ✅ Hai già Node.js, vai alla FASE 3

**Se vedi un errore:** ⬇️ Continua sotto

### Passo 2.2: Scarica Node.js

1. Vai su: https://nodejs.org/
2. Clicca **"Download Node.js (LTS)"**
3. Installa il file scaricato
4. **RIAVVIA IL COMPUTER**

---

## 📱 FASE 3: CREA L'APK STANDALONE

Ora creiamo l'APK che funziona SEMPRE!

### Passo 3.1: Apri PowerShell nella Cartella

1. Vai sul Desktop
2. Apri la cartella **preparatoreatleticomoto3app-2955-main**
3. Tieni premuto **Shift** + Tasto destro del mouse
4. Clicca **"Apri finestra PowerShell qui"** o **"Apri finestra di comando qui"**

### Passo 3.2: Vai nella Cartella mobile-app

Nel terminale, copia e incolla:

```bash
cd mobile-app
```

Premi **Invio**

### Passo 3.3: Installa Dipendenze

```bash
npm install --legacy-peer-deps
```

Premi **Invio**. Aspetta 2-5 minuti (installerà ~1400 pacchetti).

### Passo 3.4: Installa EAS CLI

```bash
npm install -g eas-cli
```

Premi **Invio**. Aspetta che finisca.

### Passo 3.5: Login a Expo

```bash
eas login
```

**Non hai un account?**
1. Apri: https://expo.dev/signup
2. Crea account gratis (usa email e password)
3. Poi torna al terminale e fai login

### Passo 3.6: Configura il Progetto

```bash
eas build:configure
```

Quando chiede:
- **Android?** → Premi **Y** (Yes) e Invio
- **iOS?** → Premi **N** (No) e Invio

### Passo 3.7: Crea l'APK

```bash
eas build --platform android --profile preview
```

**Cosa succede ora:**
- ⏱️ La build richiede **10-15 minuti**
- ☁️ Viene fatta online sui server Expo
- 📧 Riceverai un **link via email** quando è pronta
- 📱 Potrai scaricare l'APK dal link

**ASPETTA!** Non chiudere il terminale. Aspetta il messaggio di conferma.

---

## 📲 FASE 4: INSTALLA L'APK SUL TELEFONO

### Passo 4.1: Ricevi il Link

Dopo 10-15 minuti, riceverai:
- Email da Expo con il link
- Oppure vedrai il link nel terminale

### Passo 4.2: Apri il Link sul Telefono

1. Apri l'email sul telefono
2. Clicca sul link
3. Scarica l'APK

### Passo 4.3: Permetti Installazione

**Su Android:**
1. Vai in **Impostazioni** → **Sicurezza**
2. Attiva **"Installazione da fonti sconosciute"**

O quando clicchi sull'APK, Android ti chiederà se permettere l'installazione.

### Passo 4.4: Installa

1. Tocca il file APK scaricato
2. Tocca **"Installa"**
3. Aspetta
4. Tocca **"Apri"**

---

## 🎉 FATTO!

Ora hai l'app installata sul telefono e:

✅ Funziona **SEMPRE**
✅ **Non serve** il PC acceso
✅ **Non serve** Expo Go
✅ App completamente **standalone**
✅ Funziona anche **offline**
✅ Tutte le funzionalità disponibili!

---

## 🆘 PROBLEMI COMUNI

### ❌ "npm non è riconosciuto come comando"

**Soluzione:**
1. Installa Node.js da: https://nodejs.org/
2. **Riavvia il computer**
3. Riprova

### ❌ "cd mobile-app" non funziona

**Soluzione:**
Assicurati di essere nella cartella giusta:
```bash
cd C:\Users\TuoNome\Desktop\preparatoreatleticomoto3app-2955-main
cd mobile-app
```

### ❌ "eas: command not found"

**Soluzione:**
```bash
npm install -g eas-cli
```

### ❌ Build fallisce

**Soluzione:**
1. Verifica di aver fatto login: `eas whoami`
2. Riprova con: `eas build --platform android --profile preview`

### ❌ APK non si installa sul telefono

**Soluzione:**
1. Vai in **Impostazioni** → **Sicurezza**
2. Attiva **"Consenti installazione da fonti sconosciute"**
3. Riprova

### ❌ Non riesco ad aprire PowerShell

**Soluzione Alternativa:**
1. Apri **Esplora Risorse**
2. Vai nella cartella **mobile-app**
3. Clicca sulla barra degli indirizzi in alto
4. Scrivi: `cmd`
5. Premi **Invio**

---

## 📋 RIEPILOGO COMANDI

Se hai già tutto installato, questi sono i comandi da eseguire:

```bash
# 1. Vai nella cartella del progetto
cd Desktop\preparatoreatleticomoto3app-2955-main\mobile-app

# 2. Installa dipendenze (solo prima volta)
npm install --legacy-peer-deps

# 3. Installa EAS (solo prima volta)
npm install -g eas-cli

# 4. Login (solo prima volta)
eas login

# 5. Configura (solo prima volta)
eas build:configure

# 6. Crea APK
eas build --platform android --profile preview
```

---

## ⏱️ TEMPI TOTALI

- **Download progetto:** 2 minuti
- **Installazione Node.js:** 3 minuti (se necessario)
- **Installazione dipendenze:** 5 minuti
- **Setup EAS:** 2 minuti
- **Build APK:** 10-15 minuti
- **Download e installazione:** 2 minuti

**TOTALE:** ~25-30 minuti per la prima volta!

Le prossime volte che vuoi ricreare l'APK (ad esempio dopo modifiche), bastano 10-15 minuti!

---

## 📞 LINK UTILI

- **Expo Signup:** https://expo.dev/signup
- **EAS Build Docs:** https://docs.expo.dev/build/setup/
- **Node.js Download:** https://nodejs.org/
- **Repository GitHub:** https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955

---

## 💡 PROSSIMI PASSI

Dopo aver installato l'app:

1. **Modifica l'app**: Cambia i file in `mobile-app/app/`
2. **Testa le modifiche**: Usa `npm start` con Expo Go
3. **Crea nuovo APK**: Usa `eas build --platform android --profile preview`
4. **Aggiorna sul telefono**: Installa il nuovo APK

---

Creato il: 2025-11-16
Ultima modifica: 2025-11-16
