
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

const exampleDocuments = [
  {
    title: 'Routine Mattutina - Formato File',
    content: `Controllo peso corporeo
Misurazione HRV
Valutazione rigidità muscolare
Idratazione (500ml acqua)
Colazione bilanciata
Mobilità articolare (10 min)
Stretching dinamico`,
    description: 'Un elemento per riga. Opzionale: durata tra parentesi.',
  },
  {
    title: 'Esercizi Riscaldamento - Formato File',
    content: `Jogging leggero | 300 sec | 5 minuti
Rotazioni cervicali | 2 serie 10 rep
Rotazioni spalle | 2 serie 15 rep
Rotazioni bacino | 2 serie 10 rep
Affondi dinamici | 2 serie 10 rep
Squat a corpo libero | 2 serie 15 rep
Plank dinamico | 60 sec | 2 serie da 30 secondi`,
    description: 'Nome | Durata/Serie | Note (separati da |)',
  },
  {
    title: 'Mobilità - Formato File',
    content: `Idratazione: Bere almeno 3L di acqua al giorno. Aumentare durante allenamenti intensi.
Nutrizione: Carboidrati: 6-8g/kg, Proteine: 1.6-2g/kg, Grassi: 1g/kg
Sonno: Minimo 8 ore per notte. Mantenere orari regolari.
Recupero: Almeno 1 giorno di riposo completo a settimana.
Bandiere Rosse: Dolore persistente, affaticamento estremo, calo prestazioni, disturbi del sonno.`,
    description: 'Chiave: Valore (una per riga)',
  },
  {
    title: 'Routine Mattutina - Esempio',
    content: `ROUTINE MATTUTINA

Controllo Fisico
- Peso corporeo: 65kg
- Misurazione HRV: 75ms
- Valutazione rigidità muscolare: 3/10

Idratazione e Nutrizione
- Idratazione: 500ml acqua al risveglio
- Colazione bilanciata: carboidrati complessi, proteine, grassi sani
- Integratori: vitamina D, omega-3

Mobilità Articolare
- Rotazioni cervicali: 2x10
- Rotazioni spalle: 2x15
- Mobilità anche: 10 minuti
- Stretching dinamico: 5 minuti`,
    description: 'Esempio completo per Content Manager',
  },
  {
    title: 'Obiettivi Settimanali - Esempio',
    content: `OBIETTIVI SETTIMANALI

Settimana 12 - Focus Forza

Obiettivi Principali
- Incremento carico squat: +5kg
- Miglioramento tempo plank: +30 secondi
- Riduzione tempo recupero: -15 secondi

Obiettivi Secondari
- Mantenere HRV sopra 70ms
- Dormire minimo 8 ore per notte
- Completare tutte le sessioni di foam rolling

Note
- Attenzione particolare alla tecnica negli esercizi di forza
- Monitorare eventuali dolori o fastidi
- Aumentare gradualmente l'intensità`,
  },
  {
    title: 'Note di Progetto - Esempio',
    content: `NOTE DI PROGETTO

Preparazione Gara - Circuito Mugello

Analisi Circuito
- Lunghezza: 5.245 km
- Curve: 15 (6 sinistra, 9 destra)
- Rettilineo principale: 1.141 metri
- Punti critici: Curva San Donato, Arrabbiata 1 e 2

Preparazione Fisica
- Focus su resistenza muscolare collo e braccia
- Esercizi specifici per G-force laterali
- Allenamento cardiovascolare ad alta intensità

Setup Moto
- Pressione gomme anteriore: 1.9 bar
- Pressione gomme posteriore: 1.7 bar
- Rapporti: configurazione standard
- Sospensioni: setup medio-rigido

Strategia
- Qualifica: spingere al massimo nei primi 3 giri
- Gara: gestione gomme nei primi 5 giri
- Sorpassi: rettilineo principale e San Donato`,
  },
];

export default function ContentExamplesScreen() {
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    console.log('Content to copy:', text);
    alert('Contenuto copiato! Ora puoi incollarlo nel Content Manager.');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Esempi di Contenuti',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="lightbulb.fill" size={32} color={colors.accent} />
          <Text style={styles.infoTitle}>Esempi di Documenti</Text>
          <Text style={styles.infoText}>
            Questi sono esempi di documenti che puoi usare per testare il sistema di gestione contenuti. 
            Copia un esempio e incollalo nel Content Manager per vedere come funziona l&apos;aggiornamento automatico.
          </Text>
        </View>

        {exampleDocuments.map((doc, index) => (
          <View key={index} style={[commonStyles.card, styles.exampleCard]}>
            <View style={styles.exampleHeader}>
              <IconSymbol name="doc.text" size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.exampleTitle}>{doc.title}</Text>
                {doc.description && (
                  <Text style={styles.exampleDescription}>{doc.description}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.contentPreview}>
              <Text style={styles.contentText}>{doc.content}</Text>
            </View>

            <View style={styles.exampleActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => copyToClipboard(doc.content)}
              >
                <IconSymbol name="doc.on.clipboard" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Copia Contenuto</Text>
              </Pressable>
              
              <Pressable
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => router.push('/edit-data' as any)}
              >
                <IconSymbol name="arrow.right.circle" size={18} color={colors.accent} />
                <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                  Modifica Dati
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={[commonStyles.card, styles.tipsCard]}>
          <Text style={styles.tipsTitle}>💡 Suggerimenti per la Formattazione</Text>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Usa intestazioni chiare in MAIUSCOLO o con numeri (es. &quot;1. ROUTINE MATTUTINA&quot;)
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Separa le sezioni con righe vuote per una migliore identificazione
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Usa elenchi puntati (-) per organizzare i contenuti all&apos;interno delle sezioni
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Mantieni titoli delle sezioni coerenti tra versioni diverse per un matching migliore
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Puoi usare markdown (# Titolo) per una formattazione ancora più precisa
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.startButton}
          onPress={() => router.push('/content-manager' as any)}
        >
          <IconSymbol name="play.circle.fill" size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Inizia a Gestire i Contenuti</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exampleCard: {
    padding: 20,
    marginBottom: 16,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  exampleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  contentPreview: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  contentText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  exampleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: colors.accent + '15',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionButtonTextSecondary: {
    color: colors.accent,
  },
  tipsCard: {
    padding: 20,
    marginBottom: 24,
    backgroundColor: colors.accent + '10',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipBullet: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '700',
    width: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    marginBottom: 32,
    ...commonStyles.shadow,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
