
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingState } from '@/components/LoadingState';
import { LinearGradient } from 'expo-linear-gradient';
import { ErrorState } from '@/components/ErrorState';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Dimensions, Modal, Alert } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { measurePerformance, debounce } from '@/utils/performance';
import * as Haptics from 'expo-haptics';
import { storage } from '@/utils/storage';
import { colors, commonStyles, shadows, gradients, spacing, borderRadius, typography } from '@/styles/commonStyles';
import Svg, { Circle, Line, Text as SvgText, Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

interface ProgressData {
  date: string;
  weight: number;
  hrv: number;
  load: number;
  stiffness: number;
}

interface ExerciseProgress {
  name: string;
  current: number;
  target: number;
  unit: string;
}

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

const STORAGE_KEY = '@progress_data';
const READINESS_STORAGE_KEY = '@readiness_history';
const UPDATE_TRIGGER_KEY = '@progress_update_trigger';

export default function ProgressScreen() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'hrv' | 'load' | 'stiffness'>('weight');
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      checkForUpdates();
      loadProgressData();
    }, [])
  );

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      await loadProgressData();
      setError(null);
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const checkForUpdates = async () => {
    try {
      const trigger = await AsyncStorage.getItem(UPDATE_TRIGGER_KEY);
      if (trigger) {
        const triggerTime = parseInt(trigger, 10);
        const now = Date.now();
        if (now - triggerTime < 5000) {
          await updateProgressFromReadiness();
          await AsyncStorage.removeItem(UPDATE_TRIGGER_KEY);
        }
      }
    } catch (err) {
      console.error('Error checking for updates:', err);
    }
  };

  const updateProgressFromReadiness = async () => {
    try {
      const readinessData = await AsyncStorage.getItem(READINESS_STORAGE_KEY);
      if (!readinessData) {
        console.log('No readiness data found');
        return;
      }

      const readinessHistory: ReadinessEntry[] = JSON.parse(readinessData);
      const last7Days = readinessHistory.slice(-7);

      const newProgressData: ProgressData[] = last7Days.map((entry) => ({
        date: entry.date,
        weight: parseFloat(entry.weight) || 0,
        hrv: parseFloat(entry.hrv) || 0,
        load: entry.score || 0,
        stiffness: (10 - entry.muscleSoreness) * 10,
      }));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgressData));
      setProgressData(newProgressData);
      setLastUpdate(new Date().toLocaleString('it-IT'));
    } catch (err) {
      console.error('Error updating progress from readiness:', err);
    }
  };

  const loadProgressData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setProgressData(parsed);
      } else {
        const mockData: ProgressData[] = [
          { date: '2024-01-01', weight: 65, hrv: 55, load: 450, stiffness: 70 },
          { date: '2024-01-02', weight: 64.8, hrv: 58, load: 480, stiffness: 75 },
          { date: '2024-01-03', weight: 64.5, hrv: 60, load: 500, stiffness: 80 },
          { date: '2024-01-04', weight: 64.3, hrv: 62, load: 520, stiffness: 78 },
          { date: '2024-01-05', weight: 64.2, hrv: 65, load: 550, stiffness: 82 },
          { date: '2024-01-06', weight: 64.0, hrv: 68, load: 580, stiffness: 85 },
          { date: '2024-01-07', weight: 63.8, hrv: 70, load: 600, stiffness: 88 },
        ];
        setProgressData(mockData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      }

      const mockExercises: ExerciseProgress[] = [
        { name: 'Squat', current: 80, target: 100, unit: 'kg' },
        { name: 'Panca', current: 60, target: 80, unit: 'kg' },
        { name: 'Stacco', current: 100, target: 120, unit: 'kg' },
        { name: 'Trazioni', current: 12, target: 15, unit: 'reps' },
      ];
      setExerciseProgress(mockExercises);
    } catch (err) {
      console.error('Error loading progress data:', err);
      throw err;
    }
  };

  const getMetricData = useMemo(() => {
    return progressData.map((item) => item[selectedMetric]);
  }, [progressData, selectedMetric]);

  const getMetricInfo = () => {
    const data = getMetricData;
    if (data.length === 0) return { current: 0, change: 0, trend: 'neutral' as const };

    const current = data[data.length - 1];
    const previous = data[data.length - 2] || current;
    const change = ((current - previous) / previous) * 100;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

    return { current, change, trend };
  };

  const renderLineChart = (data: number[], metric: string) => {
    if (data.length === 0) return null;

    const width = Dimensions.get('window').width - 64;
    const height = 200;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      return { x, y };
    });

    const pathData = points.map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    }).join(' ');

    const gradientPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0.05" />
          </SvgLinearGradient>
        </Defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (i / 4) * chartHeight;
          return (
            <Line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Gradient fill */}
        <Path d={gradientPathData} fill="url(#chartGradient)" />

        {/* Line */}
        <Path
          d={pathData}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={colors.card}
            stroke={colors.primary}
            strokeWidth="3"
          />
        ))}

        {/* Labels */}
        <SvgText
          x={padding}
          y={padding - 5}
          fill={colors.textSecondary}
          fontSize="12"
          fontWeight="600"
        >
          {maxValue.toFixed(1)}
        </SvgText>
        <SvgText
          x={padding}
          y={height - padding + 15}
          fill={colors.textSecondary}
          fontSize="12"
          fontWeight="600"
        >
          {minValue.toFixed(1)}
        </SvgText>
      </Svg>
    );
  };

  const renderDoughnutChart = (percentage: number) => {
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (percentage / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="doughnutGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor={colors.primaryLight} />
          </SvgLinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#doughnutGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Percentage text */}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy=".3em"
          fontSize="24"
          fontWeight="bold"
          fill={colors.text}
        >
          {percentage}%
        </SvgText>
      </Svg>
    );
  };

  const metricInfo = getMetricInfo();

  const metricLabels = {
    weight: { label: 'Peso', unit: 'kg', icon: 'scalemass.fill' },
    hrv: { label: 'HRV', unit: 'ms', icon: 'waveform.path.ecg' },
    load: { label: 'Carico', unit: 'AU', icon: 'chart.bar.fill' },
    stiffness: { label: 'Rigidità', unit: '%', icon: 'figure.flexibility' },
  };

  if (loading) {
    return <LoadingState message="Caricamento progressi..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={initializeData} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Progressi & Analisi',
          headerLargeTitle: true,
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Overview */}
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={gradients.racing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <IconSymbol name="flame.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Giorni Attivi</Text>
            </LinearGradient>

            <LinearGradient
              colors={gradients.championship}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <IconSymbol name="trophy.fill" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Traguardi</Text>
            </LinearGradient>

            <LinearGradient
              colors={gradients.success}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color="#FFFFFF" />
              <Text style={styles.statValue}>+15%</Text>
              <Text style={styles.statLabel}>Miglioramento</Text>
            </LinearGradient>
          </View>

          {/* Metric Selector */}
          <View style={[commonStyles.card, styles.metricCard]}>
            <View style={styles.metricHeader}>
              <View>
                <Text style={styles.metricTitle}>Andamento Metriche</Text>
                <Text style={styles.metricSubtitle}>Ultimi 7 giorni</Text>
              </View>
              {lastUpdate && (
                <Text style={styles.lastUpdate}>Agg. {lastUpdate.split(',')[1]}</Text>
              )}
            </View>

            <View style={styles.metricSelector}>
              {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map((key) => (
                <Pressable
                  key={key}
                  style={[
                    styles.metricButton,
                    selectedMetric === key && styles.metricButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedMetric(key);
                  }}
                >
                  <IconSymbol
                    name={metricLabels[key].icon as any}
                    size={20}
                    color={selectedMetric === key ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.metricButtonText,
                      selectedMetric === key && styles.metricButtonTextActive,
                    ]}
                  >
                    {metricLabels[key].label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Current Value Display */}
            <View style={styles.currentValueContainer}>
              <View style={styles.currentValueLeft}>
                <Text style={styles.currentValueLabel}>Valore Attuale</Text>
                <View style={styles.currentValueRow}>
                  <Text style={styles.currentValue}>
                    {metricInfo.current.toFixed(1)}
                  </Text>
                  <Text style={styles.currentValueUnit}>
                    {metricLabels[selectedMetric].unit}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.trendBadge,
                metricInfo.trend === 'up' && styles.trendBadgeUp,
                metricInfo.trend === 'down' && styles.trendBadgeDown,
              ]}>
                <IconSymbol
                  name={metricInfo.trend === 'up' ? 'arrow.up' : metricInfo.trend === 'down' ? 'arrow.down' : 'minus'}
                  size={16}
                  color={colors.textInverse}
                />
                <Text style={styles.trendBadgeText}>
                  {Math.abs(metricInfo.change).toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
              {renderLineChart(getMetricData, selectedMetric)}
            </View>
          </View>

          {/* Exercise Progress */}
          <View style={[commonStyles.card, styles.exerciseCard]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <IconSymbol name="figure.strengthtraining.traditional" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Progressione Esercizi</Text>
              </View>
            </View>

            {exerciseProgress.map((exercise, index) => {
              const percentage = Math.round((exercise.current / exercise.target) * 100);
              return (
                <View key={index} style={styles.exerciseItem}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseValues}>
                      {exercise.current} / {exercise.target} {exercise.unit}
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={percentage >= 100 ? gradients.success : gradients.racing}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]}
                      />
                    </View>
                    <Text style={styles.progressPercentage}>{percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Weekly Summary */}
          <View style={[commonStyles.card, styles.summaryCard]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <IconSymbol name="calendar" size={24} color={colors.info} />
                <Text style={styles.sectionTitle}>Riepilogo Settimanale</Text>
              </View>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  {renderDoughnutChart(85)}
                </View>
                <Text style={styles.summaryLabel}>Completamento</Text>
              </View>

              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  {renderDoughnutChart(92)}
                </View>
                <Text style={styles.summaryLabel}>Consistenza</Text>
              </View>
            </View>
          </View>

          {/* Export Button */}
          <Pressable
            style={styles.exportButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert(
                'Esporta Dati',
                'Funzionalità di esportazione in arrivo',
                [{ text: 'OK' }]
              );
            }}
          >
            <LinearGradient
              colors={gradients.blue}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.exportButtonGradient}
            >
              <IconSymbol name="square.and.arrow.up" size={24} color="#FFFFFF" />
              <Text style={styles.exportButtonText}>Esporta Report PDF</Text>
            </LinearGradient>
          </Pressable>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  statValue: {
    ...typography.title,
    color: colors.textInverse,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  metricCard: {
    marginBottom: spacing.xl,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  metricTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metricSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  lastUpdate: {
    ...typography.small,
    color: colors.textLight,
  },
  metricSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  metricButtonActive: {
    backgroundColor: colors.primary + '15',
  },
  metricButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metricButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  currentValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  currentValueLeft: {
    flex: 1,
  },
  currentValueLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  currentValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  currentValue: {
    ...typography.hero,
    color: colors.text,
  },
  currentValueUnit: {
    ...typography.heading,
    color: colors.textSecondary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.textSecondary,
  },
  trendBadgeUp: {
    backgroundColor: colors.success,
  },
  trendBadgeDown: {
    backgroundColor: colors.error,
  },
  trendBadgeText: {
    ...typography.small,
    color: colors.textInverse,
    fontWeight: '700',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  exerciseCard: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  exerciseItem: {
    marginBottom: spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  exerciseValues: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
  progressPercentage: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    minWidth: 45,
    textAlign: 'right',
  },
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIconContainer: {
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  exportButton: {
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  exportButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  exportButtonText: {
    ...typography.heading,
    color: colors.textInverse,
  },
});
