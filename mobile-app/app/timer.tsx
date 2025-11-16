
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TimerScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [workDuration, setWorkDuration] = useState('30');
  const [restDuration, setRestDuration] = useState('10');
  const [sets, setSets] = useState('8');
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const maxTime = isWorkPhase ? parseInt(workDuration) : parseInt(restDuration);
          
          if (prev >= maxTime) {
            if (isWorkPhase) {
              setIsWorkPhase(false);
              return 0;
            } else {
              if (currentSet < parseInt(sets)) {
                setCurrentSet(currentSet + 1);
                setIsWorkPhase(true);
                return 0;
              } else {
                setIsRunning(false);
                return 0;
              }
            }
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isWorkPhase, currentSet, workDuration, restDuration, sets]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentSet(1);
    setIsWorkPhase(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Timer Multi-Intervallo',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.timerCard]}>
            <Text style={styles.phaseLabel}>
              {isWorkPhase ? 'LAVORO' : 'RIPOSO'}
            </Text>
            <Text style={[
              styles.timerDisplay,
              { color: isWorkPhase ? colors.accent : colors.warning }
            ]}>
              {formatTime(currentTime)}
            </Text>
            <Text style={styles.setLabel}>
              Serie {currentSet} di {sets}
            </Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Configurazione</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Durata Lavoro (secondi)</Text>
              <TextInput
                style={styles.input}
                value={workDuration}
                onChangeText={setWorkDuration}
                keyboardType="number-pad"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Durata Riposo (secondi)</Text>
              <TextInput
                style={styles.input}
                value={restDuration}
                onChangeText={setRestDuration}
                keyboardType="number-pad"
                editable={!isRunning}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numero Serie</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
                editable={!isRunning}
              />
            </View>
          </View>

          <View style={styles.controlsContainer}>
            {!isRunning ? (
              <Pressable
                style={[styles.controlButton, styles.startButton]}
                onPress={handleStart}
              >
                <IconSymbol name="play.fill" size={24} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Avvia</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.controlButton, styles.pauseButton]}
                onPress={handlePause}
              >
                <IconSymbol name="pause.fill" size={24} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Pausa</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.controlButton, styles.resetButton]}
              onPress={handleReset}
            >
              <IconSymbol name="arrow.counterclockwise" size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Reset</Text>
            </Pressable>
          </View>

          <View style={[commonStyles.card, styles.presetsCard]}>
            <Text style={styles.sectionTitle}>Preset Comuni</Text>
            
            <Pressable
              style={styles.presetButton}
              onPress={() => {
                setWorkDuration('30');
                setRestDuration('10');
                setSets('8');
                handleReset();
              }}
            >
              <Text style={styles.presetName}>Tabata</Text>
              <Text style={styles.presetDescription}>30s lavoro / 10s riposo × 8</Text>
            </Pressable>

            <Pressable
              style={styles.presetButton}
              onPress={() => {
                setWorkDuration('40');
                setRestDuration('20');
                setSets('8');
                handleReset();
              }}
            >
              <Text style={styles.presetName}>HIIT Standard</Text>
              <Text style={styles.presetDescription}>40s lavoro / 20s riposo × 8</Text>
            </Pressable>

            <Pressable
              style={styles.presetButton}
              onPress={() => {
                setWorkDuration('60');
                setRestDuration('30');
                setSets('6');
                handleReset();
              }}
            >
              <Text style={styles.presetName}>Resistenza</Text>
              <Text style={styles.presetDescription}>60s lavoro / 30s riposo × 6</Text>
            </Pressable>
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
  timerCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 2,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: '700',
    marginBottom: 16,
  },
  setLabel: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  startButton: {
    backgroundColor: colors.accent,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  resetButton: {
    backgroundColor: colors.textSecondary,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  presetsCard: {
    marginTop: 8,
  },
  presetButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
