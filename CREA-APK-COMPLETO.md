# 📱 COME CREARE L'APK STANDALONE - Guida Completa

## 🎯 OBIETTIVO

Creare un file APK che puoi installare sul telefono e usare SEMPRE, senza bisogno del PC acceso!

---

## ⚡ METODO RAPIDO - EAS Build (Consigliato)

### PASSO 1: Scarica il Progetto

1. Vai su: https://github.com/Alessandro31-31/preparatoreatleticomoto3app-2955
2. Clicca "Code" → "Download ZIP"
3. Estrai sul Desktop

### PASSO 2: Apri PowerShell/CMD nella Cartella

1. Entra nella cartella estratta
2. Shift + Tasto Destro
3. "Apri PowerShell qui" o "Apri finestra di comando qui"

### PASSO 3: Installa EAS CLI

Nel terminale, copia e incolla:

```bash
npm install -g eas-cli
```

Premi Invio. Aspetta che finisca.

### PASSO 4: Vai nella Cartella mobile-app

```bash
cd mobile-app
```

### PASSO 5: Login a Expo

```bash
eas login
```

**Non hai un account?**
- Vai su: https://expo.dev/signup
- Crea account gratis
- Poi fai login con: eas login

### PASSO 6: Configura il Progetto

```bash
eas build:configure
```

Scegli:
- Android? → **Y** (Yes)
- iOS? → **N** (No, a meno che non hai Mac)

### PASSO 7: Crea l'APK

```bash
eas build --platform android --profile preview
```

**Cosa succede:**
- ⏱️ Build richiede 10-15 minuti
- ☁️ Viene fatto online sui server Expo
- 📧 Riceverai un link via email
- 📱 Scarica l'APK dal link
- ✅ Installa sul telefono
- 🎉 Funziona SEMPRE!

---

## 🔧 METODO ALTERNATIVO - Build Locale

### Se hai Android Studio installato:

```bash
cd mobile-app
npx expo run:android
```

Connetti telefono via USB e l'app viene installata subito!

---

## 📱 COME INSTALLARE L'APK

### Passo 1: Scarica l'APK

Dal link che ricevi via email, apri sul telefono e scarica.

### Passo 2: Permetti Installazione

1. Vai in **Impostazioni** → **Sicurezza**
2. Attiva **"Consenti installazione da fonti sconosciute"**

### Passo 3: Installa

1. Apri il file APK scaricato
2. Tocca **"Installa"**
3. Aspetta
4. Tocca **"Apri"**

### Passo 4: Usa Sempre!

✅ L'app ora è installata permanentemente
✅ Funziona senza PC
✅ Funziona senza Expo Go
✅ Funziona offline
✅ Tutte le funzionalità disponibili!

---

## 🆘 TROUBLESHOOTING

### ❌ "npm non riconosciuto"

**Soluzione:**
1. Installa Node.js da: https://nodejs.org/
2. Riavvia il computer
3. Riprova

### ❌ "eas non riconosciuto"

**Soluzione:**
```bash
npm install -g eas-cli
```

### ❌ Build fallisce

**Soluzione:**
1. Verifica che app.json sia corretto (è già configurato!)
2. Riprova con: `eas build --platform android --profile preview`
3. Controlla errori nel terminale

### ❌ APK non si installa

**Soluzione:**
1. Impostazioni → Sicurezza
2. Attiva installazione da fonti sconosciute
3. Riprova

---

## ⏱️ TEMPI

- **Setup iniziale:** 5 minuti
- **Build EAS:** 10-15 minuti
- **Download APK:** 1-2 minuti
- **Installazione:** 30 secondi

**TOTALE:** ~20 minuti per avere l'app pronta!

---

## 💾 DIMENSIONE

APK finale: circa 50-80 MB

---

## 📋 COMANDI COMPLETI

```bash
# 1. Installa EAS
npm install -g eas-cli

# 2. Vai nella cartella
cd mobile-app

# 3. Login
eas login

# 4. Configura (solo prima volta)
eas build:configure

# 5. Crea APK
eas build --platform android --profile preview
```

---

## ✅ DOPO LA BUILD

Riceverai:
1. Email con link
2. Oppure controlla su: https://expo.dev/accounts/[tuoaccount]/projects

Scarica l'APK, installa, e usa sempre!

---

## 🎉 VANTAGGI APK STANDALONE

✅ Funziona SEMPRE
✅ Non serve PC acceso
✅ Non serve Expo Go
✅ App completa standalone
✅ Offline al 100%
✅ Puoi condividerla
✅ Puoi pubblicarla su Play Store

---

## 📞 LINK UTILI

- **Expo Signup:** https://expo.dev/signup
- **EAS Build Docs:** https://docs.expo.dev/build/setup/
- **Node.js Download:** https://nodejs.org/

---

Creato il: 2025-11-16
