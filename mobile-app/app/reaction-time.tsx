
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ReactionTimeScreen() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const [averageTime, setAverageTime] = useState(null);

  useEffect(() => {
    if (isWaiting) {
      const delay = Math.random() * 3000 + 2000; // 2-5 secondi
      const timer = setTimeout(() => {
        setIsReady(true);
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isWaiting]);

  const startTest = () => {
    setIsWaiting(true);
    setIsReady(false);
    setReactionTime(null);
  };

  const handleReaction = () => {
    if (!isReady) {
      // Partenza anticipata
      setIsWaiting(false);
      setReactionTime('FALSA PARTENZA');
      return;
    }

    const endTime = Date.now();
    const time = endTime - startTime;
    setReactionTime(time);
    setIsWaiting(false);
    setIsReady(false);

    const newAttempts = [...attempts, time];
    setAttempts(newAttempts);

    // Calcola best e average
    const best = Math.min(...newAttempts);
    const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
    setBestTime(best);
    setAverageTime(avg);
  };

  const reset = () => {
    setAttempts([]);
    setBestTime(null);
    setAverageTime(null);
    setReactionTime(null);
    setIsWaiting(false);
    setIsReady(false);
  };

  const getReactionQuality = (time) => {
    if (time < 200) return { label: 'ECCELLENTE', color: '#4CAF50' };
    if (time < 250) return { label: 'OTTIMO', color: '#8BC34A' };
    if (time < 300) return { label: 'BUONO', color: '#FFC107' };
    if (time < 350) return { label: 'MEDIO', color: '#FF9800' };
    return { label: 'DA MIGLIORARE', color: '#FF5722' };
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Test Tempo di Reazione',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="bolt.fill" size={32} color={colors.warning} />
            <Text style={styles.infoText}>
              Test specifico per piloti Moto3: misura il tuo tempo di reazione ai semafori di partenza
            </Text>
          </View>

          {/* Test Area */}
          <Pressable
            style={[
              styles.testArea,
              isWaiting && !isReady && { backgroundColor: '#FF5722' },
              isReady && { backgroundColor: '#4CAF50' },
            ]}
            onPress={isWaiting || isReady ? handleReaction : startTest}
            disabled={isWaiting && !isReady}
          >
            {!isWaiting && !isReady && !reactionTime && (
              <>
                <IconSymbol name="hand.tap.fill" size={64} color="#FFFFFF" />
                <Text style={styles.testText}>TAP PER INIZIARE</Text>
                <Text style={styles.testSubtext}>Attendi il verde e reagisci!</Text>
              </>
            )}
            {isWaiting && !isReady && (
              <>
                <IconSymbol name="exclamationmark.triangle.fill" size={64} color="#FFFFFF" />
                <Text style={styles.testText}>ATTENDI...</Text>
                <Text style={styles.testSubtext}>Non anticipare!</Text>
              </>
            )}
            {isReady && (
              <>
                <IconSymbol name="flag.checkered" size={64} color="#FFFFFF" />
                <Text style={styles.testText}>VAI! TAP ORA!</Text>
              </>
            )}
            {reactionTime && !isWaiting && !isReady && (
              <>
                {reactionTime === 'FALSA PARTENZA' ? (
                  <>
                    <IconSymbol name="xmark.circle.fill" size={64} color="#FFFFFF" />
                    <Text style={styles.testText}>FALSA PARTENZA!</Text>
                    <Text style={styles.testSubtext}>Hai anticipato il verde</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.reactionTimeText}>{reactionTime}ms</Text>
                    <Text style={[styles.qualityText, { color: getReactionQuality(reactionTime).color }]}>
                      {getReactionQuality(reactionTime).label}
                    </Text>
                  </>
                )}
              </>
            )}
          </Pressable>

          {/* Stats */}
          {attempts.length > 0 && (
            <View style={[commonStyles.card]}>
              <Text style={styles.sectionTitle}>📊 Statistiche</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tentativi</Text>
                  <Text style={styles.statValue}>{attempts.length}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Miglior Tempo</Text>
                  <Text style={[styles.statValue, { color: colors.success }]}>{bestTime}ms</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Media</Text>
                  <Text style={styles.statValue}>{Math.round(averageTime)}ms</Text>
                </View>
              </View>

              <View style={styles.attemptsContainer}>
                <Text style={styles.attemptsTitle}>Ultimi tentativi:</Text>
                {attempts.slice(-5).reverse().map((time, index) => (
                  <View key={index} style={styles.attemptRow}>
                    <Text style={styles.attemptNumber}>#{attempts.length - index}</Text>
                    <Text style={styles.attemptTime}>{time}ms</Text>
                    <Text style={[styles.attemptQuality, { color: getReactionQuality(time).color }]}>
                      {getReactionQuality(time).label}
                    </Text>
                  </View>
                ))}
              </View>

              <Pressable style={styles.resetButton} onPress={reset}>
                <IconSymbol name="arrow.counterclockwise" size={20} color="#FFFFFF" />
                <Text style={styles.resetButtonText}>Reset Statistiche</Text>
              </Pressable>
            </View>
          )}

          {/* Info Card */}
          <View style={[commonStyles.card, styles.benchmarkCard]}>
            <Text style={styles.sectionTitle}>🎯 Benchmark Professionisti</Text>
            <View style={styles.benchmarkRow}>
              <View style={[styles.benchmarkDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.benchmarkText}>{'<'}200ms - Livello MotoGP</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <View style={[styles.benchmarkDot, { backgroundColor: '#8BC34A' }]} />
              <Text style={styles.benchmarkText}>200-250ms - Eccellente (Moto3)</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <View style={[styles.benchmarkDot, { backgroundColor: '#FFC107' }]} />
              <Text style={styles.benchmarkText}>250-300ms - Buono</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <View style={[styles.benchmarkDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.benchmarkText}>300-350ms - Medio</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <View style={[styles.benchmarkDot, { backgroundColor: '#FF5722' }]} />
              <Text style={styles.benchmarkText}>{'>'}350ms - Da migliorare</Text>
            </View>
          </View>

          <View style={[commonStyles.card, styles.tipsCard]}>
            <Text style={styles.sectionTitle}>💡 Consigli per Migliorare</Text>
            <Text style={styles.tipText}>
              - Allenati regolarmente (3-5 volte/settimana){'\n'}
              - Mantieni focus visivo sul punto di riferimento{'\n'}
              - Rilassa le spalle e le mani{'\n'}
              - Respira normalmente, non trattenere il respiro{'\n'}
              - Riposa adeguatamente tra i tentativi{'\n'}
              - Simula condizioni di gara (stress, rumore)
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
  testArea: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    marginBottom: 16,
  },
  testText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  testSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  reactionTimeText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qualityText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  attemptsContainer: {
    marginBottom: 16,
  },
  attemptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  attemptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  attemptNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 40,
  },
  attemptTime: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  attemptQuality: {
    fontSize: 12,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  benchmarkCard: {
    marginTop: 16,
    backgroundColor: colors.highlight,
  },
  benchmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benchmarkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  benchmarkText: {
    fontSize: 14,
    color: colors.text,
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
