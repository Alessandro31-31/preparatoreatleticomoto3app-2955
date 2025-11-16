
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface HRVEntry {
  date: string;
  hrv: number;
  restingHR: number;
  status: string;
}

export default function HRVMonitorScreen() {
  const [hrv, setHrv] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [baseline, setBaseline] = useState('65');
  const [entries, setEntries] = useState<HRVEntry[]>([]);
  const [analysis, setAnalysis] = useState('');

  const analyzeHRV = () => {
    const hrvNum = parseFloat(hrv);
    const baselineNum = parseFloat(baseline);
    const restingHRNum = parseFloat(restingHR);

    if (isNaN(hrvNum) || isNaN(baselineNum)) {
      setAnalysis('Inserisci valori validi per l\'analisi');
      return;
    }

    const deviation = ((hrvNum - baselineNum) / baselineNum) * 100;
    let status = '';
    let recommendation = '';

    if (deviation > 10) {
      status = '✅ OTTIMO RECUPERO';
      recommendation = 'Il tuo corpo è ben recuperato. Puoi affrontare allenamenti intensi.';
    } else if (deviation >= -5 && deviation <= 10) {
      status = '✓ NORMALE';
      recommendation = 'Recupero nella norma. Procedi con il programma di allenamento pianificato.';
    } else if (deviation >= -15 && deviation < -5) {
      status = '⚠️ ATTENZIONE';
      recommendation = 'Possibile affaticamento. Considera un allenamento più leggero o recupero attivo.';
    } else {
      status = '🚨 STRESS ELEVATO';
      recommendation = 'Forte indicazione di stress o affaticamento. Riposo o recupero attivo consigliato.';
    }

    const fullAnalysis = `${status}\n\nDeviazione dalla baseline: ${deviation.toFixed(1)}%\n\n${recommendation}`;
    setAnalysis(fullAnalysis);

    // Add entry
    const newEntry: HRVEntry = {
      date: new Date().toLocaleDateString('it-IT'),
      hrv: hrvNum,
      restingHR: restingHRNum,
      status: status,
    };
    setEntries([newEntry, ...entries.slice(0, 6)]);
  };

  const getAverageHRV = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((total, entry) => total + entry.hrv, 0);
    return sum / entries.length;
  };

  const getTrend = () => {
    if (entries.length < 2) return 'N/A';
    const recent = entries[0].hrv;
    const previous = entries[1].hrv;
    const diff = recent - previous;
    
    if (diff > 5) return '📈 In miglioramento';
    if (diff < -5) return '📉 In calo';
    return '➡️ Stabile';
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Monitor HRV',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="waveform.path.ecg" size={24} color={colors.secondary} />
            <Text style={styles.infoText}>
              L&apos;HRV (Heart Rate Variability) misura la variazione tra i battiti cardiaci. Un HRV più alto indica generalmente un migliore recupero.
            </Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Misura Giornaliera</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>HRV (ms)</Text>
              <Text style={styles.inputHint}>Misurato al risveglio, prima di alzarsi</Text>
              <TextInput
                style={styles.input}
                value={hrv}
                onChangeText={setHrv}
                keyboardType="decimal-pad"
                placeholder="es. 68"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequenza Cardiaca a Riposo (bpm)</Text>
              <TextInput
                style={styles.input}
                value={restingHR}
                onChangeText={setRestingHR}
                keyboardType="decimal-pad"
                placeholder="es. 52"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Baseline HRV Personale (ms)</Text>
              <Text style={styles.inputHint}>Media del tuo HRV in condizioni normali</Text>
              <TextInput
                style={styles.input}
                value={baseline}
                onChangeText={setBaseline}
                keyboardType="decimal-pad"
                placeholder="es. 65"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <Pressable style={styles.analyzeButton} onPress={analyzeHRV}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#FFFFFF" />
              <Text style={styles.analyzeButtonText}>Analizza HRV</Text>
            </Pressable>

            {analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>{analysis}</Text>
              </View>
            )}
          </View>

          {entries.length > 0 && (
            <>
              <View style={[commonStyles.card, styles.statsCard]}>
                <Text style={styles.sectionTitle}>Statistiche</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>HRV Medio</Text>
                    <Text style={[styles.statValue, { color: colors.secondary }]}>
                      {getAverageHRV().toFixed(1)} ms
                    </Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Trend</Text>
                    <Text style={[styles.statValue, { color: colors.primary, fontSize: 16 }]}>
                      {getTrend()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Storico (ultimi 7 giorni)</Text>
                
                {entries.map((entry, index) => (
                  <View key={index} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryDate}>{entry.date}</Text>
                      <Text style={styles.entryStatus}>{entry.status}</Text>
                    </View>
                    <View style={styles.entryDetails}>
                      <Text style={styles.entryDetail}>HRV: {entry.hrv} ms</Text>
                      <Text style={styles.entryDetail}>FC: {entry.restingHR} bpm</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Guida HRV</Text>
            
            <View style={styles.guideItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Quando Misurare</Text>
                <Text style={styles.guideDescription}>
                  Al risveglio, prima di alzarsi dal letto, alla stessa ora ogni giorno
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <IconSymbol name="chart.bar.fill" size={20} color={colors.primary} />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Valori Tipici</Text>
                <Text style={styles.guideDescription}>
                  Atleti: 50-100 ms. Più alto è meglio, ma la consistenza è più importante del valore assoluto
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>Fattori che Influenzano</Text>
                <Text style={styles.guideDescription}>
                  Sonno, stress, alimentazione, idratazione, alcol, malattie
                </Text>
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
  analyzeButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analysisContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  analysisText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
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
  entryStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  guideContent: {
    flex: 1,
    marginLeft: 12,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
