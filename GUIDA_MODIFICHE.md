# Guida Modifiche - Moto3 Pilot Trainer

## Come Modificare l'App

L'app è 100% modificabile. Ecco come personalizzarla.

## 1. Cambiare Colori e Tema

File: `mobile-app/styles/commonStyles.ts`

```typescript
export const colors = {
  // CAMBIA QUESTI COLORI
  primary: '#007AFF',      // Blu principale
  success: '#34C759',      // Verde successo
  warning: '#FF9500',      // Arancione warning
  error: '#FF3B30',        // Rosso errore

  // Colori racing
  racingRed: '#DC143C',
  racingGold: '#FFD700',
  // ... aggiungi i tuoi colori qui
};
```

**Dopo aver modificato:**
- Salva il file
- L'app si aggiorna automaticamente sul telefono (hot reload)!

## 2. Modificare la Home

File: `mobile-app/app/(tabs)/(home)/index.tsx`

**Rimuovere una sezione:**
```typescript
// Trova l'array 'sections' (linea ~68)
const sections: FeatureSection[] = [
  // COMMENTA le sezioni che non vuoi:
  // {
  //   title: 'Benessere & Performance',
  //   ...
  // },
];
```

**Aggiungere una nuova funzionalità:**
```typescript
{
  title: 'La Mia Funzione',
  subtitle: 'Descrizione',
  icon: 'star.fill',
  gradient: gradients.blue,
  route: '/la-mia-schermata',
}
```

## 3. Modificare una Routine di Allenamento

File: `mobile-app/data/trainingData.ts`

```typescript
// Trova la routine che vuoi modificare
export const warmupRoutine = [
  {
    name: "Il Mio Esercizio",
    duration: 60,  // secondi
    description: "Fai questo...",
  },
  // Aggiungi altri esercizi
];
```

## 4. Creare una Nuova Schermata

### Passo 1: Crea il file
```bash
# Nella cartella mobile-app/app/
touch app/la-mia-schermata.tsx
```

### Passo 2: Scrivi il codice base
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function LaMiaSchermata() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Il Mio Titolo',
          headerLargeTitle: true,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>La Mia Schermata!</Text>
        <Text>Contenuto personalizzato qui...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});
```

### Passo 3: Aggiungi il link nella Home
File: `mobile-app/app/(tabs)/(home)/index.tsx`

```typescript
// Trova una sezione e aggiungi:
{
  title: 'La Mia Funzione',
  subtitle: 'Descrizione',
  icon: 'star.fill',
  gradient: gradients.blue,
  route: '/la-mia-schermata',  // <-- nome del file
}
```

## 5. Modificare il Calendario 18 Settimane

File: `mobile-app/app/(tabs)/calendar.tsx`

```typescript
// Cerca la funzione generateTrainingCalendar (linea ~200 circa)
const weeks = [
  {
    week: 1,
    focus: "Il Mio Focus",
    sessions: [
      {
        day: 1,
        title: "Il Mio Allenamento",
        type: "strength",
        duration: "60 min",
        // ...
      },
    ],
  },
];
```

## 6. Cambiare Nome e Icona dell'App

File: `mobile-app/app.json`

```json
{
  "expo": {
    "name": "Il Mio Nome App",
    "slug": "il-mio-slug",
    "icon": "./assets/images/mia-icona.png",
    // ...
  }
}
```

**Per l'icona:**
1. Crea un'immagine PNG 1024x1024 pixel
2. Salvala in `mobile-app/assets/images/`
3. Cambia il path nell'app.json

## 7. Aggiungere Nuovi Dati

### Dati Biometrici
File: `mobile-app/app/(tabs)/readiness.tsx`

### Esercizi di Stretching
File: `mobile-app/app/stretching.tsx`

### Programmi di Allenamento
File: `mobile-app/data/trainingData.ts`

## 8. Testare le Modifiche

**Metodo 1: Hot Reload Automatico**
- Modifica il file e salva
- L'app si aggiorna automaticamente sul telefono!

**Metodo 2: Reload Manuale**
- Scuoti il telefono
- Tocca "Reload"

**Metodo 3: Riavvia**
```bash
# Ctrl+C per fermare
npm start
```

## 9. Debugging

### Vedere gli Errori
- Scuoti il telefono
- Tocca "Debug Remote JS"
- Apri Chrome Developer Tools

### Reset della Cache
```bash
cd mobile-app
npm start -- --clear
```

## 10. Modifiche Comuni

### Cambiare Font
File: `mobile-app/app/_layout.tsx` (linea 35)

```typescript
const [loaded] = useFonts({
  'MioFont': require('../assets/fonts/MioFont.ttf'),
});
```

### Disabilitare una Tab
File: `mobile-app/app/(tabs)/_layout.tsx`

```typescript
// Commenta la tab che non vuoi:
// {
//   name: 'progress',
//   route: '/(tabs)/progress',
//   icon: 'chart.bar.fill',
//   label: 'Progressi',
// },
```

### Cambiare i Gradienti
File: `mobile-app/styles/commonStyles.ts`

```typescript
export const gradients = {
  mioGradiente: ['#FF0000', '#00FF00'],
};
```

## Tips

1. **Sempre salva** prima di testare
2. **Usa Ctrl+C** per fermare il server
3. **Fai backup** prima di modifiche grandi
4. **Testa su telefono reale** per le funzioni native
5. **Leggi gli errori** - sono molto utili!

## Struttura File Importante

```
mobile-app/
├── app/                    # SCHERMATE
│   ├── (tabs)/            # Tab principali
│   ├── warmup.tsx         # Riscaldamento
│   ├── stretching.tsx     # Stretching
│   └── ...                # Altre schermate
├── components/            # COMPONENTI RIUTILIZZABILI
├── styles/
│   └── commonStyles.ts    # COLORI E STILI
├── data/
│   └── trainingData.ts    # DATI ALLENAMENTI
└── app.json               # CONFIGURAZIONE APP
```

## Esempi Pratici

### Esempio 1: Cambiare il colore principale
```typescript
// mobile-app/styles/commonStyles.ts
export const colors = {
  primary: '#FF0000',  // Ora è rosso invece di blu!
};
```

### Esempio 2: Aggiungere esercizio allo stretching
```typescript
// mobile-app/data/trainingData.ts
{
  name: "Stretching Gambe",
  duration: 45,
  description: "Allunga i quadricipiti tenendo...",
  image: "figure.flexibility",
}
```

### Esempio 3: Nascondere una sezione
```typescript
// mobile-app/app/(tabs)/(home)/index.tsx
// Commenta la sezione:
// {
//   title: 'Tecnologie Avanzate',
//   ...
// },
```

---

**Ricorda**: Ogni modifica viene applicata automaticamente grazie all'hot reload! 🔥
