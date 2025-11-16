
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface LoadEntry {
  date: string;
  duration: number;
  intensity: number;
  rpe: number;
  load: number;
}

export default function LoadTrackerScreen() {
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [rpe, setRpe] = useState('');
  const [entries, setEntries] = useState<LoadEntry[]>([]);
  const [calculatedLoad, setCalculatedLoad] = useState<number | null>(null);

  const calculateLoad = () => {
    const durationNum = parseFloat(duration);
    const intensityNum = parseFloat(intensity);
    const rpeNum = parseFloat(rpe);

    if (isNaN(durationNum) || isNaN(intensityNum) || isNaN(rpeNum)) {
      setCalculatedLoad(null);
      return;
    }

    // Formula: Carico = Durata × Intensità × RPE
    const load = durationNum * (intensityNum / 100) * rpeNum;
    setCalculatedLoad(load);
  };

  const addEntry = () => {
    if (calculatedLoad === null) return;

    const newEntry: LoadEntry = {
      date: new Date().toLocaleDateString('it-IT'),
      duration: parseFloat(duration),
      intensity: parseFloat(intensity),
      rpe: parseFloat(rpe),
      load: calculatedLoad,
    };

    setEntries([newEntry, ...entries]);
    setDuration('');
    setIntensity('');
    setRpe('');
    setCalculatedLoad(null);
  };

  const getTotalWeekLoad = () => {
    return entries.reduce((sum, entry) => sum + entry.load, 0);
  };

  const getAverageRPE = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((total, entry) => total + entry.rpe, 0);
    return sum / entries.length;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tracker del Carico',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Monitora il carico di allenamento combinando durata, intensità e percezione dello sforzo (RPE).
            </Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Registra Allenamento</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Durata (minuti)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={(text) => {
                  setDuration(text);
                  setCalculatedLoad(null);
                }}
                keyboardType="decimal-pad"
                placeholder="es. 90"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Intensità (%)</Text>
              <Text style={styles.inputHint}>Percentuale della frequenza cardiaca massima</Text>
              <TextInput
                style={styles.input}
                value={intensity}
                onChangeText={(text) => {
                  setIntensity(text);
                  setCalculatedLoad(null);
                }}
                keyboardType="decimal-pad"
                placeholder="es. 75"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RPE (1-10)</Text>
              <Text style={styles.inputHint}>Rating of Perceived Exertion - Percezione dello sforzo</Text>
              <TextInput
                style={styles.input}
                value={rpe}
                onChangeText={(text) => {
                  setRpe(text);
                  setCalculatedLoad(null);
                }}
                keyboardType="decimal-pad"
                placeholder="es. 7"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <Pressable style={styles.calculateButton} onPress={calculateLoad}>
              <IconSymbol name="function" size={20} color="#FFFFFF" />
              <Text style={styles.calculateButtonText}>Calcola Carico</Text>
            </Pressable>

            {calculatedLoad !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Carico Calcolato</Text>
                <Text style={styles.resultValue}>{calculatedLoad.toFixed(0)} unità</Text>
                <Pressable style={styles.addButton} onPress={addEntry}>
                  <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Aggiungi alla Settimana</Text>
                </Pressable>
              </View>
            )}
          </View>

          {entries.length > 0 && (
            <>
              <View style={[commonStyles.card, styles.summaryCard]}>
                <Text style={styles.sectionTitle}>Riepilogo Settimana</Text>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Carico Totale</Text>
                    <Text style={[styles.summaryValue, { color: colors.primary }]}>
                      {getTotalWeekLoad().toFixed(0)}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Sessioni</Text>
                    <Text style={[styles.summaryValue, { color: colors.accent }]}>
                      {entries.length}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>RPE Medio</Text>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>
                      {getAverageRPE().toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Storico Allenamenti</Text>
                
                {entries.map((entry, index) => (
                  <View key={index} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{entry.date}</Text>
                      <Text style={styles.entryLoad}>{entry.load.toFixed(0)} unità</Text>
                    </View>
                    <View style={styles.entryDetails}>
                      <Text style={styles.entryDetail}>⏱️ {entry.duration} min</Text>
                      <Text style={styles.entryDetail}>💪 {entry.intensity}%</Text>
                      <Text style={styles.entryDetail}>🎯 RPE {entry.rpe}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Scala RPE</Text>
            
            <View style={styles.rpeScale}>
              <View style={styles.rpeItem}>
                <Text style={styles.rpeNumber}>1-2</Text>
                <Text style={styles.rpeDescription}>Molto leggero</Text>
              </View>
              <View style={styles.rpeItem}>
                <Text style={styles.rpeNumber}>3-4</Text>
                <Text style={styles.rpeDescription}>Leggero</Text>
              </View>
              <View style={styles.rpeItem}>
                <Text style={styles.rpeNumber}>5-6</Text>
                <Text style={styles.rpeDescription}>Moderato</Text>
              </View>
              <View style={styles.rpeItem}>
                <Text style={styles.rpeNumber}>7-8</Text>
                <Text style={styles.rpeDescription}>Intenso</Text>
              </View>
              <View style={styles.rpeItem}>
                <Text style={styles.rpeNumber}>9-10</Text>
                <Text style={styles.rpeDescription}>Massimale</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  entryCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  entryLoad: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rpeScale: {
    gap: 8,
  },
  rpeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  rpeNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 40,
  },
  rpeDescription: {
    fontSize: 14,
    color: colors.text,
  },
});
