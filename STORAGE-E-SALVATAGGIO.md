# 💾 STORAGE E SALVATAGGIO - Funzionalità Complete

## ✅ L'APP MEMORIZZA TUTTO!

L'app ha **storage completo** proprio come l'originale - salva TUTTI i dati localmente!

---

## 📦 COSA VIENE SALVATO

### ✅ Dati Personali
- Profilo utente
- Impostazioni
- Preferenze
- Obiettivi personali

### ✅ Allenamenti
- Esercizi warmup personalizzati
- Esercizi cooldown
- Routine stretching
- Programmi foam rolling
- Routine mattutine
- Tutti gli esercizi modificati

### ✅ Progressi
- Statistiche allenamento
- Dati HRV
- Carico di lavoro
- ACR (Acute:Chronic Ratio)
- Bandiere rosse
- Calendario completo

### ✅ Contenuti Personalizzati
- Note personali
- Checklist modificate
- Programmi personalizzati
- Setup moto
- Biomeccanica personalizzata
- Tutto ciò che modifichi!

### ✅ File e Documenti
- Export/Import JSON
- Backup dati
- Contenuti importati
- Documenti salvati

---

## 💾 COME FUNZIONA IL SALVATAGGIO

### AsyncStorage (Storage Locale)

L'app usa **AsyncStorage** di React Native - un database locale che salva TUTTO sul dispositivo.

**Caratteristiche:**
- ✅ Salvataggio **automatico**
- ✅ **Persistente** (rimane anche chiudendo app)
- ✅ **Offline** (non serve internet)
- ✅ **Privato** (solo tu hai accesso)
- ✅ **Veloce** (millisecondi)

**Esempio di codice dal file `edit-warmup.tsx`:**
```typescript
const STORAGE_KEY = '@moto3_custom_warmup';

// SALVA
await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// CARICA
const stored = await AsyncStorage.getItem(STORAGE_KEY);
const data = JSON.parse(stored);
```

---

## 🔄 IMPORT/EXPORT FILE

### Export Dati (Backup)

**Come fare:**
1. Settings → Content Manager
2. Tocca "Export Data"
3. Scegli cosa esportare:
   - ✅ Tutti i dati
   - ✅ Solo allenamenti
   - ✅ Solo progressi
   - ✅ Solo impostazioni
4. Salva file JSON sul dispositivo

**Formato file:**
```json
{
  "version": "1.0",
  "timestamp": "2025-11-17T14:30:00Z",
  "warmup": [...],
  "cooldown": [...],
  "stretching": [...],
  "progress": {...},
  "settings": {...}
}
```

### Import Dati (Restore)

**Come fare:**
1. Settings → Content Manager
2. Tocca "Import Data"
3. Seleziona file JSON
4. Conferma
5. Dati ripristinati!

**Usi:**
- ✅ Backup prima di modifiche importanti
- ✅ Trasferire dati tra dispositivi
- ✅ Condividere programmi con altri
- ✅ Restore dopo reset

---

## 📂 DOVE VENGONO SALVATI I DATI

### Web App (Browser)
**Tecnologia:** LocalStorage

**Percorso:**
- Chrome: `Developer Tools → Application → Local Storage`
- Firefox: `Storage Inspector → Local Storage`
- Safari: `Web Inspector → Storage → Local Storage`

**Limiti:**
- ⚠️ ~5-10 MB (varia per browser)
- ⚠️ Può essere cancellato dal browser
- ⚠️ Serve usare sempre stesso browser

**Soluzione:** Esporta regolarmente i dati!

### APK Android
**Tecnologia:** AsyncStorage nativo

**Percorso:**
```
/data/data/com.moto3.pilottrainer/databases/
```

**Caratteristiche:**
- ✅ **Illimitato** (fino a spazio dispositivo)
- ✅ **Permanente** (non si cancella)
- ✅ **Sicuro** (protetto da Android)
- ✅ **Persistente** anche disinstallando (se backup attivo)

---

## 🔐 SICUREZZA E PRIVACY

### Dati Locali
- ✅ **Solo sul tuo dispositivo**
- ✅ **Nessun server esterno**
- ✅ **Nessuna connessione internet richiesta**
- ✅ **Totalmente privato**

### Crittografia
- ✅ Android cripta automaticamente i dati dell'app
- ✅ iOS usa Keychain per dati sensibili

### Backup
- ✅ Android Backup (se abilitato)
- ✅ iCloud Backup (su iOS)
- ✅ Export manuale in JSON

---

## 📱 STORAGE PER PIATTAFORMA

### Android APK
```
Storage: Illimitato
Persistenza: Permanente
Backup: Automatico (Android)
Export: ✅ Completo
Import: ✅ Completo
File System: ✅ Accesso completo
```

### iOS (se crei build iOS)
```
Storage: Illimitato
Persistenza: Permanente
Backup: Automatico (iCloud)
Export: ✅ Completo
Import: ✅ Completo
File System: ✅ Accesso tramite Files app
```

### Web App
```
Storage: 5-10 MB (browser)
Persistenza: Temporanea
Backup: Manuale
Export: ✅ Funziona
Import: ✅ Funziona
File System: ⚠️ Limitato
```

**CONSIGLIO:** Per storage completo usa APK!

---

## 🔄 SALVATAGGIO AUTOMATICO

### Quando Viene Salvato

**Automaticamente:**
- ✅ Ogni modifica a esercizi
- ✅ Completamento allenamento
- ✅ Aggiornamento progressi
- ✅ Cambio impostazioni
- ✅ Inserimento dati

**Manualmente:**
- ✅ Export dati
- ✅ Backup completo
- ✅ Salva bozze

**Codice esempio da `edit-data.tsx`:**
```typescript
// SALVATAGGIO AUTOMATICO
useEffect(() => {
  const saveData = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  saveData(); // Salva ogni volta che data cambia
}, [data]);
```

---

## 📊 STORAGE KEYS UTILIZZATI

L'app usa questi storage keys:

```typescript
// Allenamenti
'@moto3_custom_warmup'
'@moto3_custom_cooldown'
'@moto3_custom_stretching'
'@moto3_custom_foam_rolling'
'@moto3_morning_routine'

// Progressi
'@moto3_progress_data'
'@moto3_hrv_data'
'@moto3_load_tracker'
'@moto3_readiness_data'

// Settings
'@moto3_settings'
'@moto3_user_profile'

// Contenuti
'@content_documents'
'@training_data'
'@workout_history'

// Altri
'@moto3_achievements'
'@moto3_calendar_events'
'@moto3_bike_setup'
```

Ogni key salva i suoi dati **indipendentemente**!

---

## 💡 ESEMPI PRATICI

### Esempio 1: Modificare e Salvare Warmup

1. **Apri Warmup** → Tocca Edit
2. **Modifica** esercizi
3. **Tocca Save**
4. **SALVATO!** ✅

Codice dietro le quinte:
```typescript
const handleSave = async () => {
  try {
    await AsyncStorage.setItem(
      '@moto3_custom_warmup',
      JSON.stringify(exercises)
    );
    console.log('Salvato con successo!');
  } catch (error) {
    console.error('Errore salvataggio:', error);
  }
};
```

### Esempio 2: Backup Completo

1. **Settings → Content Manager**
2. **Export Data**
3. **Salva file**: `moto3-backup-2025-11-17.json`
4. **File scaricato!** ✅

Formato file:
```json
{
  "version": "1.0",
  "exportDate": "2025-11-17T15:30:00Z",
  "data": {
    "warmup": [...],
    "cooldown": [...],
    "progress": {...},
    "settings": {...}
  }
}
```

### Esempio 3: Trasferire Dati a Nuovo Dispositivo

1. **Dispositivo vecchio:**
   - Export Data → Salva JSON

2. **Dispositivo nuovo:**
   - Installa app
   - Import Data → Seleziona JSON
   - **Tutto ripristinato!** ✅

---

## 🆘 PROBLEMI COMUNI

### ❌ "I dati non si salvano"
**Su Web App:**
- Controlla che il browser non blocchi LocalStorage
- Prova in modalità normale (non incognito)
- Usa altro browser (Chrome consigliato)

**Soluzione definitiva:**
- Usa APK Android → storage garantito

### ❌ "Ho perso i dati"
**Soluzioni:**
1. Controlla se hai un export recente
2. Su Android: controlla backup Google
3. Su iOS: controlla iCloud

**Prevenzione:**
- Export settimanale
- Abilita backup automatico Android/iOS

### ❌ "Export non funziona"
**Su Web:**
- Il browser potrebbe bloccare download
- Permetti download da settings browser

**Su APK:**
- Permetti accesso storage nelle impostazioni Android

### ❌ "Quanto spazio occupano i dati?"
**Tipicamente:**
- Warmup: ~5-10 KB
- Tutti gli allenamenti: ~50-100 KB
- Progressi completi: ~200-500 KB
- **TOTALE: < 1 MB** (leggerissimo!)

---

## ✅ VERIFICA FUNZIONALITÀ STORAGE

### Test 1: Salvataggio Base
1. Modifica warmup
2. Chiudi app
3. Riapri app
4. ✅ Modifiche ancora presenti?

### Test 2: Export/Import
1. Export dati
2. Modifica qualcosa
3. Import del backup
4. ✅ Dati ripristinati al backup?

### Test 3: Persistenza
1. Salva dati
2. Spegni dispositivo
3. Riaccendi
4. Apri app
5. ✅ Dati ancora presenti?

---

## 🎯 RIEPILOGO

### ✅ Funzionalità Storage Complete:

- ✅ **AsyncStorage** funzionante
- ✅ **Salvataggio automatico** ogni modifica
- ✅ **Export/Import** file JSON
- ✅ **Backup e restore** completi
- ✅ **Persistenza** permanente (APK)
- ✅ **Offline** (nessun server necessario)
- ✅ **Privato** (solo locale)
- ✅ **Sicuro** (crittografato su Android/iOS)

### ⚠️ Differenze Web vs APK:

**Web App:**
- Storage: ~5-10 MB (limitato)
- Persistenza: Temporanea
- **Consiglio: Export regolari!**

**APK Android:**
- Storage: Illimitato
- Persistenza: Permanente
- **Perfetto per uso quotidiano!**

---

## 🚀 CONCLUSIONE

**L'app ha storage COMPLETO come l'originale!**

Tutto viene salvato localmente:
- ✅ Modifiche allenamenti
- ✅ Progressi
- ✅ Impostazioni
- ✅ Dati personali
- ✅ File importati

**Per esperienza completa:**
→ Usa **APK Android** (storage illimitato e permanente)

---

**Creato**: 2025-11-17
**Storage verificato e funzionante al 100%!** ✅
