
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function LapSimulatorScreen() {
  const [targetLapTime, setTargetLapTime] = useState('');
  const [currentLapTime, setCurrentLapTime] = useState('');
  const [sectors, setSectors] = useState([
    { id: 1, name: 'Settore 1', target: '', current: '', improvement: 0 },
    { id: 2, name: 'Settore 2', target: '', current: '', improvement: 0 },
    { id: 3, name: 'Settore 3', target: '', current: '', improvement: 0 },
  ]);
  const [heartRate, setHeartRate] = useState('');
  const [gForce, setGForce] = useState('');
  const [brakePoints, setBrakePoints] = useState('');

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const [min, sec] = parts;
      return parseFloat(min) * 60 + parseFloat(sec);
    }
    return parseFloat(timeStr);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60).toFixed(3);
    return `${min}:${sec.padStart(6, '0')}`;
  };

  const calculateDifference = () => {
    const target = parseTime(targetLapTime);
    const current = parseTime(currentLapTime);
    if (target && current) {
      const diff = current - target;
      return {
        value: Math.abs(diff),
        isFaster: diff < 0,
        percentage: ((Math.abs(diff) / target) * 100).toFixed(2),
      };
    }
    return null;
  };

  const updateSector = (id, field, value) => {
    setSectors(sectors.map(sector => {
      if (sector.id === id) {
        const updated = { ...sector, [field]: value };
        if (field === 'target' || field === 'current') {
          const targetTime = parseTime(updated.target);
          const currentTime = parseTime(updated.current);
          if (targetTime && currentTime) {
            updated.improvement = ((targetTime - currentTime) / targetTime * 100).toFixed(2);
          }
        }
        return updated;
      }
      return sector;
    }));
  };

  const getPhysiologicalStatus = () => {
    const hr = parseInt(heartRate);
    if (!hr) return null;
    
    if (hr < 140) return { status: 'Sotto sforzo', color: '#4CAF50', advice: 'Puoi spingere di più' };
    if (hr < 160) return { status: 'Zona ottimale', color: '#8BC34A', advice: 'Mantieni questo ritmo' };
    if (hr < 180) return { status: 'Sforzo elevato', color: '#FFC107', advice: 'Attenzione alla fatica' };
    return { status: 'Zona rossa', color: '#FF5722', advice: 'Rischio affaticamento' };
  };

  const getGForceAnalysis = () => {
    const g = parseFloat(gForce);
    if (!g) return null;
    
    if (g < 1.5) return { status: 'Basso', color: '#FF5722', advice: 'Aumenta velocità in curva' };
    if (g < 2.0) return { status: 'Medio', color: '#FFC107', advice: 'Buono, margine di miglioramento' };
    if (g < 2.5) return { status: 'Alto', color: '#8BC34A', advice: 'Ottimo carico laterale' };
    return { status: 'Estremo', color: '#4CAF50', advice: 'Massimo sfruttamento grip' };
  };

  const diff = calculateDifference();
  const physioStatus = getPhysiologicalStatus();
  const gForceAnalysis = getGForceAnalysis();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Simulatore Giro',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="flag.checkered" size={32} color={colors.primary} />
            <Text style={styles.infoText}>
              Analizza i tuoi giri e confrontali con i target per migliorare le prestazioni
            </Text>
          </View>

          {/* Lap Times */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>⏱️ Tempi Giro</Text>
            
            <Text style={styles.inputLabel}>Tempo Target (mm:ss.sss)</Text>
            <TextInput
              style={styles.input}
              value={targetLapTime}
              onChangeText={setTargetLapTime}
              placeholder="es. 1:45.234"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Tempo Attuale (mm:ss.sss)</Text>
            <TextInput
              style={styles.input}
              value={currentLapTime}
              onChangeText={setCurrentLapTime}
              placeholder="es. 1:44.987"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />

            {diff && (
              <View style={[styles.resultCard, { backgroundColor: diff.isFaster ? '#E8F5E9' : '#FFEBEE' }]}>
                <Text style={[styles.resultTitle, { color: diff.isFaster ? '#4CAF50' : '#FF5722' }]}>
                  {diff.isFaster ? '🏆 PIÙ VELOCE!' : '⏱️ PIÙ LENTO'}
                </Text>
                <Text style={[styles.resultValue, { color: diff.isFaster ? '#4CAF50' : '#FF5722' }]}>
                  {diff.isFaster ? '-' : '+'}{diff.value.toFixed(3)}s
                </Text>
                <Text style={styles.resultPercentage}>
                  {diff.percentage}% {diff.isFaster ? 'più veloce' : 'più lento'}
                </Text>
              </View>
            )}
          </View>

          {/* Sector Analysis */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>📍 Analisi Settori</Text>
            {sectors.map((sector) => (
              <View key={sector.id} style={styles.sectorCard}>
                <Text style={styles.sectorName}>{sector.name}</Text>
                <View style={styles.sectorInputs}>
                  <View style={styles.sectorInputGroup}>
                    <Text style={styles.sectorLabel}>Target</Text>
                    <TextInput
                      style={styles.sectorInput}
                      value={sector.target}
                      onChangeText={(value) => updateSector(sector.id, 'target', value)}
                      placeholder="30.5"
                      keyboardType="numeric"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.sectorInputGroup}>
                    <Text style={styles.sectorLabel}>Attuale</Text>
                    <TextInput
                      style={styles.sectorInput}
                      value={sector.current}
                      onChangeText={(value) => updateSector(sector.id, 'current', value)}
                      placeholder="30.2"
                      keyboardType="numeric"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                {sector.improvement !== 0 && (
                  <Text style={[
                    styles.sectorImprovement,
                    { color: sector.improvement > 0 ? '#4CAF50' : '#FF5722' }
                  ]}>
                    {sector.improvement > 0 ? '+' : ''}{sector.improvement}%
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Physiological Data */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>💓 Dati Fisiologici</Text>
            
            <Text style={styles.inputLabel}>Frequenza Cardiaca Media (bpm)</Text>
            <TextInput
              style={styles.input}
              value={heartRate}
              onChangeText={setHeartRate}
              placeholder="es. 165"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />

            {physioStatus && (
              <View style={[styles.statusCard, { borderLeftColor: physioStatus.color }]}>
                <Text style={[styles.statusTitle, { color: physioStatus.color }]}>
                  {physioStatus.status}
                </Text>
                <Text style={styles.statusAdvice}>{physioStatus.advice}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Forza G Massima</Text>
            <TextInput
              style={styles.input}
              value={gForce}
              onChangeText={setGForce}
              placeholder="es. 2.3"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />

            {gForceAnalysis && (
              <View style={[styles.statusCard, { borderLeftColor: gForceAnalysis.color }]}>
                <Text style={[styles.statusTitle, { color: gForceAnalysis.color }]}>
                  Carico G: {gForceAnalysis.status}
                </Text>
                <Text style={styles.statusAdvice}>{gForceAnalysis.advice}</Text>
              </View>
            )}
          </View>

          {/* Brake Points */}
          <View style={[commonStyles.card]}>
            <Text style={styles.sectionTitle}>🛑 Punti di Frenata</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={brakePoints}
              onChangeText={setBrakePoints}
              placeholder="Curva 1: 100m prima apice&#10;Curva 3: 80m, frenata progressiva&#10;Curva 5: 120m, frenata forte"
              multiline
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Tips */}
          <View style={[commonStyles.card, styles.tipsCard]}>
            <Text style={styles.sectionTitle}>💡 Consigli Analisi</Text>
            <Text style={styles.tipText}>
              - Analizza ogni settore separatamente{'\n'}
              - Identifica i punti deboli del giro{'\n'}
              - Confronta con i dati telemetrici{'\n'}
              - Monitora la frequenza cardiaca per gestire lo sforzo{'\n'}
              - Annota i punti di frenata per ogni curva{'\n'}
              - Rivedi i video onboard per migliorare la tecnica
            </Text>
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
    alignItems: 'center',
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
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  resultCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectorCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectorInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectorInputGroup: {
    flex: 1,
  },
  sectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  sectorInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectorImprovement: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusAdvice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tipsCard: {
    marginTop: 16,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});
