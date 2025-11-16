# Esempi Pratici di Modifiche

## ESEMPIO 1: Cambiare il Colore Principale (Facile)

### Prima: Blu
### Dopo: Rosso

**File da modificare:** `mobile-app/styles/commonStyles.ts`

**Linea 8:** Trova:
```typescript
primary: '#007AFF',  // Blu sistema iOS
```

**Cambia in:**
```typescript
primary: '#FF0000',  // Rosso
```

**Salva il file** → L'app si aggiorna automaticamente sul telefono! 🔥

---

## ESEMPIO 2: Aggiungere un Esercizio allo Stretching (Medio)

**File da modificare:** `mobile-app/app/stretching.tsx`

**Cerca l'array degli esercizi (circa linea 50):**

```typescript
const stretchingExercises = [
  // ... esercizi esistenti ...

  // AGGIUNGI QUESTO:
  {
    name: 'Stretching Polpacci',
    duration: 30,
    sets: 2,
    description: 'In piedi di fronte a un muro, posiziona un piede avanti...',
    benefits: ['Aumenta flessibilità polpacci', 'Previene crampi'],
    image: 'figure.walk',
    targetMuscles: ['Gastrocnemio', 'Soleo'],
  },
];
```

**Salva** → Il nuovo esercizio appare nell'app!

---

## ESEMPIO 3: Nascondere una Sezione dalla Home (Facile)

**File da modificare:** `mobile-app/app/(tabs)/(home)/index.tsx`

**Trova l'array sections (linea ~68):**

```typescript
const sections: FeatureSection[] = [
  {
    title: 'Allenamento Quotidiano',
    // ... mantieni
  },
  {
    title: 'Preparazione & Recupero',
    // ... mantieni
  },
  // COMMENTA QUESTA SEZIONE PER NASCONDERLA:
  // {
  //   title: 'Tecnologie Avanzate',
  //   description: 'AI e analisi biomeccanica',
  //   icon: 'sparkles',
  //   color: colors.accent,
  //   items: [ ... ]
  // },
];
```

---

## ESEMPIO 4: Cambiare Nome App (Facile)

**File da modificare:** `mobile-app/app.json`

**Linea 3:**
```json
{
  "expo": {
    "name": "Il Mio Trainer Moto",  ← Cambia qui
    "slug": "mio-trainer-moto",     ← E qui
```

---

## ESEMPIO 5: Aggiungere una Nuova Schermata (Avanzato)

### Step 1: Crea il file
**Nome file:** `mobile-app/app/il-mio-allenamento.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function IlMioAllenamento() {
  const [completato, setCompletato] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Il Mio Allenamento',
          headerLargeTitle: true,
        }}
      />
      <ScrollView style={commonStyles.container}>
        <View style={styles.card}>
          <IconSymbol name="figure.run" size={64} color={colors.primary} />
          <Text style={styles.title}>Benvenuto nel Mio Allenamento!</Text>
          <Text style={styles.description}>
            Questo è un esempio di schermata personalizzata.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => setCompletato(!completato)}
          >
            <Text style={styles.buttonText}>
              {completato ? '✅ Completato!' : 'Inizia'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Step 2: Aggiungi il link nella Home

**File:** `mobile-app/app/(tabs)/(home)/index.tsx`

**Trova una sezione e aggiungi:**
```typescript
{
  title: 'Allenamento Quotidiano',
  items: [
    // ... items esistenti ...

    // AGGIUNGI QUESTO:
    {
      title: 'Il Mio Allenamento',
      subtitle: 'Personalizzato',
      icon: 'star.fill',
      gradient: gradients.gold,
      route: '/il-mio-allenamento',  // Nome del file senza .tsx
      badge: 'NEW',
    },
  ],
},
```

### Step 3: Testa
- Salva entrambi i file
- L'app si ricarica automaticamente
- Vai alla Home e tocca "Il Mio Allenamento"
- La tua nuova schermata si apre! 🎉

---

## ESEMPIO 6: Modificare il Calendario (Medio)

**File:** `mobile-app/app/(tabs)/calendar.tsx`

**Cerca generateTrainingCalendar (circa linea 200):**

```typescript
const generateTrainingCalendar = () => {
  return [
    {
      week: 1,
      focus: 'Preparazione di Base',  ← Cambia il focus
      sessions: [
        {
          day: 1,
          title: 'Il Mio Allenamento',      ← Cambia titolo
          type: 'strength',
          duration: '45 min',                ← Cambia durata
          completed: false,
          description: 'La mia descrizione', ← Cambia descrizione
          exercises: [
            'Esercizio 1',  ← Aggiungi esercizi
            'Esercizio 2',
          ],
        },
        // ... altri giorni
      ],
    },
    // ... altre settimane
  ];
};
```

---

## ESEMPIO 7: Cambiare Icone (Facile)

Le icone usano **SF Symbols** (iOS) - cerca l'elenco completo qui:
https://developer.apple.com/sf-symbols/

**Esempi di icone disponibili:**
- `star.fill` - Stella piena
- `heart.fill` - Cuore pieno
- `flame.fill` - Fiamma
- `bolt.fill` - Fulmine
- `figure.run` - Persona che corre
- `bicycle` - Bicicletta
- `trophy.fill` - Trofeo
- `timer` - Timer
- `chart.bar.fill` - Grafico a barre

**Per cambiare un'icona:**
```typescript
icon: 'star.fill',  // ← Cambia con qualsiasi icona SF Symbols
```

---

## ESEMPIO 8: Aggiungere Salvataggio Dati Locale

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvare
const salvaDati = async (chiave: string, valore: any) => {
  try {
    await AsyncStorage.setItem(chiave, JSON.stringify(valore));
  } catch (error) {
    console.error('Errore salvataggio:', error);
  }
};

// Leggere
const caricaDati = async (chiave: string) => {
  try {
    const valore = await AsyncStorage.getItem(chiave);
    return valore ? JSON.parse(valore) : null;
  } catch (error) {
    console.error('Errore caricamento:', error);
    return null;
  }
};

// Esempio uso:
salvaDati('allenamenti_completati', { oggi: 5, totale: 100 });
const dati = await caricaDati('allenamenti_completati');
```

---

## Tips per Modificare

1. **Inizia piccolo** - Prova prima i cambi di colore
2. **Salva spesso** - L'hot reload è istantaneo
3. **Leggi gli errori** - Sono molto chiari e utili
4. **Usa Ctrl+Z** - Per annullare le modifiche
5. **Fai backup** - Copia i file prima di modifiche grandi
6. **Testa su telefono** - Più realistico che sul web

---

## Risorse

- **Icone**: https://developer.apple.com/sf-symbols/
- **Colori**: https://colorhunt.co/
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **Expo Docs**: https://docs.expo.dev/

---

**Buon divertimento con le personalizzazioni!** 🎨
