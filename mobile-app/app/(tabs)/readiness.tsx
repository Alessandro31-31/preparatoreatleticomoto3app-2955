
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface ReadinessEntry {
  id: string;
  date: string;
  sleepQuality: number;
  muscleSoreness: number;
  mood: number;
  energy: number;
  motivation: number;
  weight: string;
  hrv: string;
  restingHR: string;
  notes: string;
  score: number;
}

const STORAGE_KEY = '@readiness_history';
const UPDATE_TRIGGER_KEY = '@progress_update_trigger';

export default function ReadinessScreen() {
  const [sleepQuality, setSleepQuality] = useState(8);
  const [muscleSoreness, setMuscleSoreness] = useState(8);
  const [mood, setMood] = useState(8);
  const [energy, setEnergy] = useState(8);
  const [motivation, setMotivation] = useState(9);
  const [weight, setWeight] = useState('');
  const [hrv, setHrv] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<ReadinessEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveHistory = async (newHistory: ReadinessEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const triggerProgressUpdate = async () => {
    try {
      // Set a timestamp to trigger progress screen update
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(UPDATE_TRIGGER_KEY, timestamp);
      console.log('Progress update triggered at:', timestamp);
    } catch (error) {
      console.log('Error triggering progress update:', error);
    }
  };

  const handleRatingPress = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderRatingScale = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    icon: string,
    iconColor: string
  ) => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingHeader}>
        <View style={[styles.ratingIconContainer, { backgroundColor: iconColor + '20' }]}>
          <IconSymbol name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.ratingLabelContainer}>
          <Text style={styles.ratingLabel}>{label}</Text>
          <Text style={styles.ratingValue}>{value}/10</Text>
        </View>
      </View>
      <View style={styles.scaleContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <Pressable
            key={num}
            style={[
              styles.scaleButton,
              value === num && styles.scaleButtonActive,
              value === num && { backgroundColor: iconColor },
            ]}
            onPress={() => {
              setValue(num);
              handleRatingPress(num);
            }}
          >
            <Text
              style={[
                styles.scaleButtonText,
                value === num && styles.scaleButtonTextActive,
              ]}
            >
              {num}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const calculateReadinessScore = () => {
    const total = sleepQuality + (11 - muscleSoreness) + mood + energy + motivation;
    return Math.round((total / 50) * 100);
  };

  const readinessScore = calculateReadinessScore();
  
  const getScoreColor = () => {
    if (readinessScore >= 85) return colors.success;
    if (readinessScore >= 70) return colors.accent;
    if (readinessScore >= 60) return colors.warning;
    return colors.error;
  };

  const getScoreGradient = () => {
    if (readinessScore >= 85) return gradients.success;
    if (readinessScore >= 70) return gradients.cyan;
    if (readinessScore >= 60) return gradients.warning;
    return gradients.error;
  };

  const getScoreStatus = () => {
    if (readinessScore >= 85) return 'ECCELLENTE';
    if (readinessScore >= 70) return 'BUONA';
    if (readinessScore >= 60) return 'MODERATA';
    return 'BASSA';
  };

  const getRecommendation = () => {
    if (readinessScore >= 85) {
      return {
        title: '✅ Condizione Ottimale',
        description: 'Pronto per sessione ad alta intensità. Tutti i parametri nella norma. Ottimo momento per spingere al massimo.',
        intensity: 'Alta intensità consigliata',
      };
    }
    if (readinessScore >= 70) {
      return {
        title: '⚡ Buona Condizione',
        description: 'Condizione fisica buona. Puoi affrontare allenamenti intensi ma monitora i segnali del corpo.',
        intensity: 'Intensità moderata-alta',
      };
    }
    if (readinessScore >= 60) {
      return {
        title: '⚠️ Attenzione',
        description: 'Alcuni parametri sotto la norma. Considera allenamento a intensità ridotta o focus sul recupero.',
        intensity: 'Intensità moderata',
      };
    }
    return {
      title: '🚨 Recupero Necessario',
      description: 'Prontezza bassa. Priorità al recupero. Evita sessioni intense. Considera giorno di riposo attivo.',
      intensity: 'Solo recupero attivo',
    };
  };

  const saveReadinessEntry = async () => {
    const newEntry: ReadinessEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sleepQuality,
      muscleSoreness,
      mood,
      energy,
      motivation,
      weight,
      hrv,
      restingHR,
      notes,
      score: readinessScore,
    };

    const newHistory = [newEntry, ...history].slice(0, 30); // Keep last 30 entries
    await saveHistory(newHistory);
    
    // Trigger progress screen update
    await triggerProgressUpdate();
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      '✅ Salvato', 
      'Valutazione prontezza salvata con successo.\n\nI dati sono stati sincronizzati con la sezione Progressi & Analisi.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getWeeklyAverage = () => {
    if (history.length === 0) return 0;
    const lastWeek = history.slice(0, 7);
    const sum = lastWeek.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round(sum / lastWeek.length);
  };

  const getTrend = () => {
    if (history.length < 2) return 'stable';
    const recent = history.slice(0, 3).reduce((acc, e) => acc + e.score, 0) / 3;
    const older = history.slice(3, 6).reduce((acc, e) => acc + e.score, 0) / 3;
    if (recent > older + 5) return 'up';
    if (recent < older - 5) return 'down';
    return 'stable';
  };

  const renderTrendChart = () => {
    if (history.length < 2) return null;

    const chartData = history.slice(0, 14).reverse();
    const maxScore = 100;
    const chartWidth = 320;
    const chartHeight = 150;
    const padding = 20;

    const points = chartData.map((entry, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / (chartData.length - 1);
      const y = chartHeight - padding - ((entry.score / maxScore) * (chartHeight - 2 * padding));
      return { x, y, score: entry.score };
    });

    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    return (
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = chartHeight - padding - ((value / maxScore) * (chartHeight - 2 * padding));
          return (
            <Line
              key={value}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}
        
        {/* Line */}
        <Path
          d={pathData}
          stroke={colors.primary}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={colors.primary}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        ))}
      </Svg>
    );
  };

  const recommendation = getRecommendation();
  const weeklyAvg = getWeeklyAverage();
  const trend = getTrend();

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Controllo Prontezza',
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable onPress={() => setShowTrends(true)}>
                  <IconSymbol name="chart.line.uptrend.xyaxis" size={22} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => setShowHistory(true)}>
                  <IconSymbol name="clock.fill" size={22} color={colors.primary} />
                </Pressable>
              </View>
            ),
          }}
        />
      )}
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Sync Info Banner */}
          <View style={styles.syncBanner}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={18} color={colors.accent} />
            <Text style={styles.syncBannerText}>
              I dati salvati vengono automaticamente sincronizzati con Progressi & Analisi
            </Text>
          </View>

          {/* Quick Stats */}
          {history.length > 0 && (
            <View style={styles.quickStatsContainer}>
              <View style={styles.quickStatCard}>
                <IconSymbol name="calendar" size={20} color={colors.primary} />
                <Text style={styles.quickStatValue}>{weeklyAvg}%</Text>
                <Text style={styles.quickStatLabel}>Media 7gg</Text>
              </View>
              <View style={styles.quickStatCard}>
                <IconSymbol 
                  name={trend === 'up' ? 'arrow.up.right' : trend === 'down' ? 'arrow.down.right' : 'arrow.right'} 
                  size={20} 
                  color={trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary} 
                />
                <Text style={styles.quickStatValue}>
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                </Text>
                <Text style={styles.quickStatLabel}>Tendenza</Text>
              </View>
              <View style={styles.quickStatCard}>
                <IconSymbol name="chart.bar.fill" size={20} color={colors.accent} />
                <Text style={styles.quickStatValue}>{history.length}</Text>
                <Text style={styles.quickStatLabel}>Valutazioni</Text>
              </View>
            </View>
          )}

          {/* Enhanced Score Card */}
          <LinearGradient
            colors={getScoreGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scoreCard}
          >
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>Punteggio Prontezza</Text>
              <View style={styles.scoreStatusBadge}>
                <Text style={styles.scoreStatusText}>{getScoreStatus()}</Text>
              </View>
            </View>
            <Text style={styles.scoreValue}>{readinessScore}%</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${readinessScore}%` }]} />
            </View>
            <Text style={styles.scoreDate}>
              {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </LinearGradient>

          {/* Recommendation Card */}
          <View style={[commonStyles.cardRacing, styles.recommendationCard]}>
            <View style={styles.recommendationHeader}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.primary} />
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            </View>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            <View style={styles.intensityBadge}>
              <IconSymbol name="bolt.fill" size={16} color={getScoreColor()} />
              <Text style={[styles.intensityText, { color: getScoreColor() }]}>
                {recommendation.intensity}
              </Text>
            </View>
          </View>

          {/* Subjective Assessment */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="person.fill" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Valutazione Soggettiva</Text>
            </View>
            
            {renderRatingScale(
              'Qualità del Sonno',
              sleepQuality,
              setSleepQuality,
              'bed.double.fill',
              colors.primary
            )}
            
            {renderRatingScale(
              'Dolori Muscolari (1=molto, 10=nessuno)',
              muscleSoreness,
              setMuscleSoreness,
              'figure.walk',
              colors.error
            )}
            
            {renderRatingScale(
              'Umore',
              mood,
              setMood,
              'face.smiling.fill',
              colors.warning
            )}
            
            {renderRatingScale(
              'Livello di Energia',
              energy,
              setEnergy,
              'bolt.fill',
              colors.success
            )}
            
            {renderRatingScale(
              'Motivazione',
              motivation,
              setMotivation,
              'flame.fill',
              colors.accent
            )}
          </View>

          {/* Objective Data */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="chart.xyaxis.line" size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>Dati Oggettivi</Text>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="scalemass.fill" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder="70.5"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>HRV (ms)</Text>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="waveform.path.ecg" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={hrv}
                    onChangeText={setHrv}
                    keyboardType="number-pad"
                    placeholder="65"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Frequenza Cardiaca a Riposo (bpm)</Text>
              <View style={styles.inputWrapper}>
                <IconSymbol name="heart.fill" size={18} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={restingHR}
                  onChangeText={setRestingHR}
                  keyboardType="number-pad"
                  placeholder="55"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="note.text" size={20} color={colors.purple} />
              <Text style={styles.sectionTitle}>Note Personali</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholder="Aggiungi note sulla tua condizione fisica e mentale..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Save Button */}
          <Pressable 
            style={styles.saveButton}
            onPress={saveReadinessEntry}
          >
            <LinearGradient
              colors={gradients.racing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <IconSymbol name="checkmark.circle.fill" size={22} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salva e Sincronizza</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </View>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={commonStyles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Storico Valutazioni</Text>
            <Pressable onPress={() => setShowHistory(false)}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.historyContent}>
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="clock" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>Nessuna valutazione salvata</Text>
              </View>
            ) : (
              history.map((entry) => (
                <View key={entry.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>
                      {new Date(entry.date).toLocaleDateString('it-IT', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </Text>
                    <View style={[styles.historyScore, { backgroundColor: entry.score >= 85 ? colors.success : entry.score >= 70 ? colors.accent : entry.score >= 60 ? colors.warning : colors.error }]}>
                      <Text style={styles.historyScoreText}>{entry.score}%</Text>
                    </View>
                  </View>
                  <View style={styles.historyMetrics}>
                    <View style={styles.historyMetric}>
                      <IconSymbol name="bed.double.fill" size={16} color={colors.textSecondary} />
                      <Text style={styles.historyMetricText}>{entry.sleepQuality}/10</Text>
                    </View>
                    <View style={styles.historyMetric}>
                      <IconSymbol name="bolt.fill" size={16} color={colors.textSecondary} />
                      <Text style={styles.historyMetricText}>{entry.energy}/10</Text>
                    </View>
                    <View style={styles.historyMetric}>
                      <IconSymbol name="face.smiling.fill" size={16} color={colors.textSecondary} />
                      <Text style={styles.historyMetricText}>{entry.mood}/10</Text>
                    </View>
                  </View>
                  {entry.notes && (
                    <Text style={styles.historyNotes} numberOfLines={2}>{entry.notes}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Trends Modal */}
      <Modal
        visible={showTrends}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTrends(false)}
      >
        <View style={commonStyles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Analisi Tendenze</Text>
            <Pressable onPress={() => setShowTrends(false)}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.trendsContent}>
            {history.length < 2 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>Servono almeno 2 valutazioni per vedere le tendenze</Text>
              </View>
            ) : (
              <>
                <View style={commonStyles.card}>
                  <Text style={styles.sectionTitle}>Andamento Prontezza (14 giorni)</Text>
                  <View style={styles.chartContainer}>
                    {renderTrendChart()}
                  </View>
                </View>

                <View style={commonStyles.card}>
                  <Text style={styles.sectionTitle}>Statistiche</Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
                      <Text style={styles.statValue}>{weeklyAvg}%</Text>
                      <Text style={styles.statLabel}>Media 7gg</Text>
                    </View>
                    <View style={styles.statCard}>
                      <IconSymbol name="arrow.up.circle.fill" size={24} color={colors.success} />
                      <Text style={styles.statValue}>
                        {Math.max(...history.slice(0, 7).map(e => e.score))}%
                      </Text>
                      <Text style={styles.statLabel}>Massimo</Text>
                    </View>
                    <View style={styles.statCard}>
                      <IconSymbol name="arrow.down.circle.fill" size={24} color={colors.error} />
                      <Text style={styles.statValue}>
                        {Math.min(...history.slice(0, 7).map(e => e.score))}%
                      </Text>
                      <Text style={styles.statLabel}>Minimo</Text>
                    </View>
                  </View>
                </View>

                <View style={commonStyles.card}>
                  <Text style={styles.sectionTitle}>Insights</Text>
                  <View style={styles.insightCard}>
                    <IconSymbol 
                      name={trend === 'up' ? 'arrow.up.right.circle.fill' : trend === 'down' ? 'arrow.down.right.circle.fill' : 'arrow.right.circle.fill'} 
                      size={32} 
                      color={trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary} 
                    />
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>
                        {trend === 'up' ? 'Tendenza Positiva' : trend === 'down' ? 'Tendenza Negativa' : 'Tendenza Stabile'}
                      </Text>
                      <Text style={styles.insightText}>
                        {trend === 'up' 
                          ? 'La tua prontezza sta migliorando. Continua così!' 
                          : trend === 'down' 
                          ? 'La prontezza sta calando. Considera più recupero.' 
                          : 'La prontezza è stabile. Mantieni la routine.'}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  syncBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
    flex: 1,
    lineHeight: 18,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...shadows.small,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scoreCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    ...shadows.large,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  scoreStatusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  scoreDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  recommendationCard: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  recommendationDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  scaleButtonActive: {
    borderColor: 'transparent',
    ...shadows.small,
  },
  scaleButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  scaleButtonTextActive: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 17,
    color: colors.text,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  historyContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  historyScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  historyMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  historyMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyMetricText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  historyNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  trendsContent: {
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
