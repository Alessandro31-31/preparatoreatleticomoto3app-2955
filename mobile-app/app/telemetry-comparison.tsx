
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Line, Circle, Polyline, Text as SvgText, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TelemetrySession {
  id: string;
  date: string;
  circuit: string;
  lapTime: string;
  data: {
    speed: number[];
    throttle: number[];
    brake: number[];
    gear: number[];
    rpm: number[];
  };
  sectors: {
    sector1: string;
    sector2: string;
    sector3: string;
  };
  weather?: string;
  temperature?: number;
  notes?: string;
}

interface SectorAnalysis {
  sector: number;
  avgSpeed: number;
  maxSpeed: number;
  brakingPoints: number;
  throttleApplication: number;
  improvement: string;
}

export default function TelemetryComparisonScreen() {
  const [sessions] = useState<TelemetrySession[]>([
    {
      id: '1',
      date: '2024-01-15',
      circuit: 'Mugello',
      lapTime: '1:52.345',
      weather: 'Soleggiato',
      temperature: 24,
      data: {
        speed: [0, 80, 150, 180, 200, 220, 180, 140, 100, 120, 160, 200, 220, 200, 150, 100, 80, 120, 180, 210],
        throttle: [0, 50, 80, 90, 100, 100, 60, 40, 70, 90, 100, 100, 90, 70, 50, 30, 60, 85, 100, 95],
        brake: [0, 0, 0, 0, 0, 20, 80, 100, 60, 20, 0, 0, 20, 60, 80, 100, 70, 30, 0, 10],
        gear: [1, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6],
        rpm: [4000, 8000, 10000, 11000, 12000, 13000, 11000, 9000, 7000, 9000, 11000, 13000, 11000, 9000, 7000, 5000, 8000, 10000, 12000, 13000],
      },
      sectors: {
        sector1: '36.234',
        sector2: '38.567',
        sector3: '37.544',
      },
      notes: 'Ottima uscita curva 3',
    },
    {
      id: '2',
      date: '2024-01-14',
      circuit: 'Mugello',
      lapTime: '1:53.123',
      weather: 'Nuvoloso',
      temperature: 21,
      data: {
        speed: [0, 75, 145, 175, 195, 215, 175, 135, 95, 115, 155, 195, 215, 195, 145, 95, 75, 115, 175, 205],
        throttle: [0, 45, 75, 85, 95, 95, 55, 35, 65, 85, 95, 95, 85, 65, 45, 25, 55, 80, 95, 90],
        brake: [0, 0, 0, 0, 0, 25, 85, 100, 65, 25, 0, 0, 25, 65, 85, 100, 75, 35, 0, 15],
        gear: [1, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6],
        rpm: [3800, 7800, 9800, 10800, 11800, 12800, 10800, 8800, 6800, 8800, 10800, 12800, 10800, 8800, 6800, 4800, 7800, 9800, 11800, 12800],
      },
      sectors: {
        sector1: '36.789',
        sector2: '38.912',
        sector3: '37.422',
      },
      notes: 'Frenata anticipata curva 5',
    },
    {
      id: '3',
      date: '2024-01-13',
      circuit: 'Mugello',
      lapTime: '1:54.567',
      weather: 'Soleggiato',
      temperature: 26,
      data: {
        speed: [0, 70, 140, 170, 190, 210, 170, 130, 90, 110, 150, 190, 210, 190, 140, 90, 70, 110, 170, 200],
        throttle: [0, 40, 70, 80, 90, 90, 50, 30, 60, 80, 90, 90, 80, 60, 40, 20, 50, 75, 90, 85],
        brake: [0, 0, 0, 0, 0, 30, 90, 100, 70, 30, 0, 0, 30, 70, 90, 100, 80, 40, 0, 20],
        gear: [1, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 3, 4, 5, 6],
        rpm: [3600, 7600, 9600, 10600, 11600, 12600, 10600, 8600, 6600, 8600, 10600, 12600, 10600, 8600, 6600, 4600, 7600, 9600, 11600, 12600],
      },
      sectors: {
        sector1: '37.123',
        sector2: '39.234',
        sector3: '38.210',
      },
      notes: 'Prima sessione del weekend',
    },
  ]);

  const [selectedSessions, setSelectedSessions] = useState<string[]>(['1', '2']);
  const [selectedMetric, setSelectedMetric] = useState<'speed' | 'throttle' | 'brake' | 'rpm'>('speed');
  const [showOverlay, setShowOverlay] = useState(true);
  const [showSectorAnalysis, setShowSectorAnalysis] = useState(false);
  const [selectedSector, setSelectedSector] = useState<number>(1);
  const [showExportModal, setShowExportModal] = useState(false);

  const toggleSession = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSessions.includes(id)) {
      if (selectedSessions.length > 1) {
        setSelectedSessions(selectedSessions.filter(s => s !== id));
      }
    } else if (selectedSessions.length < 3) {
      setSelectedSessions([...selectedSessions, id]);
    } else {
      Alert.alert('Limite raggiunto', 'Puoi confrontare fino a 3 sessioni contemporaneamente');
    }
  };

  const renderAdvancedChart = () => {
    const width = 350;
    const height = 220;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const selectedSessionsData = selectedSessions
      .map(id => sessions.find(s => s.id === id))
      .filter(s => s !== undefined) as TelemetrySession[];

    if (selectedSessionsData.length === 0) return null;

    const allData = selectedSessionsData.flatMap(s => s.data[selectedMetric]);
    const maxValue = Math.max(...allData);
    const minValue = Math.min(...allData);
    const range = maxValue - minValue;

    const colors_chart = [colors.primary, colors.accent, colors.warning];

    return (
      <Svg width={width} height={height}>
        <Defs>
          {selectedSessionsData.map((_, index) => (
            <SvgLinearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors_chart[index]} stopOpacity="0.3" />
              <Stop offset="1" stopColor={colors_chart[index]} stopOpacity="0.05" />
            </SvgLinearGradient>
          ))}
        </Defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <Line
            key={`grid-${index}`}
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={width - padding}
            y2={padding + chartHeight * ratio}
            stroke={colors.divider}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}

        {/* Vertical grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, index) => (
          <Line
            key={`vgrid-${index}`}
            x1={padding + chartWidth * ratio}
            y1={padding}
            x2={padding + chartWidth * ratio}
            y2={padding + chartHeight}
            stroke={colors.divider}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}

        {/* Session lines with area fill */}
        {selectedSessionsData.map((session, sessionIndex) => {
          const data = session.data[selectedMetric];
          const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
            return `${x},${y}`;
          }).join(' ');

          const areaPoints = `${padding},${padding + chartHeight} ${points} ${padding + chartWidth},${padding + chartHeight}`;

          return (
            <React.Fragment key={sessionIndex}>
              {showOverlay && (
                <Path
                  d={`M ${areaPoints}`}
                  fill={`url(#gradient${sessionIndex})`}
                />
              )}
              <Polyline
                points={points}
                fill="none"
                stroke={colors_chart[sessionIndex]}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {data.map((value, index) => {
                if (index % 3 === 0) {
                  const x = padding + (index / (data.length - 1)) * chartWidth;
                  const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
                  return (
                    <Circle
                      key={`point-${sessionIndex}-${index}`}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={colors_chart[sessionIndex]}
                    />
                  );
                }
                return null;
              })}
            </React.Fragment>
          );
        })}

        {/* Y-axis labels */}
        <SvgText
          x={padding - 10}
          y={padding + 5}
          fontSize="11"
          fill={colors.textSecondary}
          textAnchor="end"
          fontWeight="600"
        >
          {Math.round(maxValue)}
        </SvgText>
        <SvgText
          x={padding - 10}
          y={padding + chartHeight / 2}
          fontSize="11"
          fill={colors.textSecondary}
          textAnchor="end"
          fontWeight="600"
        >
          {Math.round((maxValue + minValue) / 2)}
        </SvgText>
        <SvgText
          x={padding - 10}
          y={padding + chartHeight}
          fontSize="11"
          fill={colors.textSecondary}
          textAnchor="end"
          fontWeight="600"
        >
          {Math.round(minValue)}
        </SvgText>

        {/* X-axis labels (sectors) */}
        <SvgText
          x={padding}
          y={height - 10}
          fontSize="10"
          fill={colors.textSecondary}
          textAnchor="start"
          fontWeight="600"
        >
          S1
        </SvgText>
        <SvgText
          x={padding + chartWidth / 2}
          y={height - 10}
          fontSize="10"
          fill={colors.textSecondary}
          textAnchor="middle"
          fontWeight="600"
        >
          S2
        </SvgText>
        <SvgText
          x={padding + chartWidth}
          y={height - 10}
          fontSize="10"
          fill={colors.textSecondary}
          textAnchor="end"
          fontWeight="600"
        >
          S3
        </SvgText>
      </Svg>
    );
  };

  const calculateDifference = (session1: TelemetrySession, session2: TelemetrySession) => {
    const time1 = parseFloat(session1.lapTime.replace(':', '').replace('.', ''));
    const time2 = parseFloat(session2.lapTime.replace(':', '').replace('.', ''));
    const diff = ((time1 - time2) / 1000).toFixed(3);
    return diff;
  };

  const analyzeSector = (sectorNum: number): SectorAnalysis => {
    const session = sessions.find(s => s.id === selectedSessions[0]);
    if (!session) {
      return {
        sector: sectorNum,
        avgSpeed: 0,
        maxSpeed: 0,
        brakingPoints: 0,
        throttleApplication: 0,
        improvement: 'N/A',
      };
    }

    const dataLength = session.data.speed.length;
    const sectorSize = Math.floor(dataLength / 3);
    const startIdx = (sectorNum - 1) * sectorSize;
    const endIdx = sectorNum === 3 ? dataLength : startIdx + sectorSize;

    const sectorSpeed = session.data.speed.slice(startIdx, endIdx);
    const sectorBrake = session.data.brake.slice(startIdx, endIdx);
    const sectorThrottle = session.data.throttle.slice(startIdx, endIdx);

    const avgSpeed = sectorSpeed.reduce((a, b) => a + b, 0) / sectorSpeed.length;
    const maxSpeed = Math.max(...sectorSpeed);
    const brakingPoints = sectorBrake.filter(b => b > 50).length;
    const throttleApplication = (sectorThrottle.reduce((a, b) => a + b, 0) / sectorThrottle.length);

    let improvement = 'Ottimale';
    if (throttleApplication < 70) {
      improvement = 'Aumentare applicazione gas';
    } else if (brakingPoints > 3) {
      improvement = 'Ridurre frenate intermedie';
    }

    return {
      sector: sectorNum,
      avgSpeed: Math.round(avgSpeed),
      maxSpeed: Math.round(maxSpeed),
      brakingPoints,
      throttleApplication: Math.round(throttleApplication),
      improvement,
    };
  };

  const exportData = async () => {
    try {
      const selectedSessionsData = selectedSessions
        .map(id => sessions.find(s => s.id === id))
        .filter(s => s !== undefined);

      const csvData = selectedSessionsData.map(session => ({
        date: session!.date,
        circuit: session!.circuit,
        lapTime: session!.lapTime,
        ...session!.sectors,
      }));

      await AsyncStorage.setItem('telemetry_export', JSON.stringify(csvData));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Esportazione completata',
        'I dati telemetrici sono stati salvati e sono pronti per l\'esportazione.',
        [{ text: 'OK' }]
      );
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Errore', 'Impossibile esportare i dati');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Telemetria Avanzata',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <LinearGradient
            colors={gradients.cyan}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="chart.xyaxis.line" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Telemetria Avanzata</Text>
            <Text style={styles.headerDescription}>
              Analisi multi-sessione con overlay e confronto settoriale
            </Text>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={[commonStyles.card, styles.statsCard]}>
            <View style={styles.statItem}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{selectedSessions.length}</Text>
              <Text style={styles.statLabel}>Sessioni</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="flag.checkered" size={24} color={colors.accent} />
              <Text style={styles.statValue}>{sessions[0].circuit}</Text>
              <Text style={styles.statLabel}>Circuito</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="clock.fill" size={24} color={colors.success} />
              <Text style={styles.statValue}>
                {sessions.find(s => s.id === selectedSessions[0])?.lapTime || '--:--'}
              </Text>
              <Text style={styles.statLabel}>Best Lap</Text>
            </View>
          </View>

          {/* Metric Selector */}
          <View style={[commonStyles.card, styles.metricSelector]}>
            <Text style={styles.sectionTitle}>Metrica Analisi</Text>
            <View style={styles.metricButtons}>
              {[
                { key: 'speed', label: 'Velocità', icon: 'speedometer', color: colors.primary, unit: 'km/h' },
                { key: 'throttle', label: 'Gas', icon: 'bolt.fill', color: colors.success, unit: '%' },
                { key: 'brake', label: 'Freno', icon: 'brake.signal', color: colors.error, unit: '%' },
                { key: 'rpm', label: 'RPM', icon: 'gauge.high', color: colors.warning, unit: 'rpm' },
              ].map((metric) => (
                <Pressable
                  key={metric.key}
                  style={[
                    styles.metricButton,
                    selectedMetric === metric.key && styles.metricButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedMetric(metric.key as any);
                  }}
                >
                  <IconSymbol
                    name={metric.icon as any}
                    size={20}
                    color={selectedMetric === metric.key ? '#FFFFFF' : metric.color}
                  />
                  <View style={styles.metricButtonContent}>
                    <Text
                      style={[
                        styles.metricButtonText,
                        selectedMetric === metric.key && styles.metricButtonTextActive,
                      ]}
                    >
                      {metric.label}
                    </Text>
                    <Text
                      style={[
                        styles.metricButtonUnit,
                        selectedMetric === metric.key && styles.metricButtonUnitActive,
                      ]}
                    >
                      {metric.unit}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Chart Controls */}
          <View style={[commonStyles.card, styles.chartControls]}>
            <Pressable
              style={styles.controlButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowOverlay(!showOverlay);
              }}
            >
              <IconSymbol
                name={showOverlay ? 'eye.fill' : 'eye.slash.fill'}
                size={20}
                color={showOverlay ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.controlButtonText}>
                {showOverlay ? 'Area Overlay ON' : 'Area Overlay OFF'}
              </Text>
            </Pressable>
            <Pressable
              style={styles.controlButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSectorAnalysis(!showSectorAnalysis);
              }}
            >
              <IconSymbol name="chart.pie.fill" size={20} color={colors.accent} />
              <Text style={styles.controlButtonText}>Analisi Settori</Text>
            </Pressable>
            <Pressable
              style={styles.controlButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowExportModal(true);
              }}
            >
              <IconSymbol name="square.and.arrow.up.fill" size={20} color={colors.success} />
              <Text style={styles.controlButtonText}>Esporta CSV</Text>
            </Pressable>
          </View>

          {/* Advanced Chart */}
          {selectedSessions.length > 0 && (
            <View style={[commonStyles.card, styles.chartCard]}>
              <Text style={styles.sectionTitle}>Grafico Comparativo Multi-Sessione</Text>
              <View style={styles.chartContainer}>
                {renderAdvancedChart()}
              </View>
              <View style={styles.chartLegend}>
                {selectedSessions.map((sessionId, index) => {
                  const session = sessions.find(s => s.id === sessionId);
                  const legendColors = [colors.primary, colors.accent, colors.warning];
                  return (
                    <View key={sessionId} style={styles.legendItem}>
                      <View style={[styles.legendLine, { backgroundColor: legendColors[index] }]} />
                      <Text style={styles.legendText}>
                        {session?.date} - {session?.lapTime}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Sector Analysis */}
          {showSectorAnalysis && (
            <View style={[commonStyles.card, styles.sectorAnalysisCard]}>
              <Text style={styles.sectionTitle}>Analisi Dettagliata Settori</Text>
              <View style={styles.sectorTabs}>
                {[1, 2, 3].map((sector) => (
                  <Pressable
                    key={sector}
                    style={[
                      styles.sectorTab,
                      selectedSector === sector && styles.sectorTabActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedSector(sector);
                    }}
                  >
                    <Text
                      style={[
                        styles.sectorTabText,
                        selectedSector === sector && styles.sectorTabTextActive,
                      ]}
                    >
                      Settore {sector}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {(() => {
                const analysis = analyzeSector(selectedSector);
                return (
                  <View style={styles.sectorAnalysisContent}>
                    <View style={styles.analysisMetric}>
                      <Text style={styles.analysisMetricLabel}>Velocità Media</Text>
                      <Text style={styles.analysisMetricValue}>{analysis.avgSpeed} km/h</Text>
                    </View>
                    <View style={styles.analysisMetric}>
                      <Text style={styles.analysisMetricLabel}>Velocità Massima</Text>
                      <Text style={styles.analysisMetricValue}>{analysis.maxSpeed} km/h</Text>
                    </View>
                    <View style={styles.analysisMetric}>
                      <Text style={styles.analysisMetricLabel}>Punti Frenata</Text>
                      <Text style={styles.analysisMetricValue}>{analysis.brakingPoints}</Text>
                    </View>
                    <View style={styles.analysisMetric}>
                      <Text style={styles.analysisMetricLabel}>Applicazione Gas</Text>
                      <Text style={styles.analysisMetricValue}>{analysis.throttleApplication}%</Text>
                    </View>
                    <View style={styles.improvementBox}>
                      <IconSymbol name="lightbulb.fill" size={20} color={colors.warning} />
                      <Text style={styles.improvementText}>{analysis.improvement}</Text>
                    </View>
                  </View>
                );
              })()}
            </View>
          )}

          {/* Session Comparison */}
          {selectedSessions.length >= 2 && (
            <View style={[commonStyles.card, styles.comparisonCard]}>
              <Text style={styles.sectionTitle}>Confronto Diretto</Text>
              {(() => {
                const session1 = sessions.find(s => s.id === selectedSessions[0]);
                const session2 = sessions.find(s => s.id === selectedSessions[1]);
                if (!session1 || !session2) return null;

                const diff = calculateDifference(session1, session2);
                const isFaster = parseFloat(diff) < 0;

                return (
                  <>
                    <View style={styles.timeDifference}>
                      <Text style={styles.timeDifferenceLabel}>Differenza Tempo Giro</Text>
                      <Text style={[
                        styles.timeDifferenceValue,
                        { color: isFaster ? colors.success : colors.error }
                      ]}>
                        {isFaster ? '-' : '+'}{Math.abs(parseFloat(diff)).toFixed(3)}s
                      </Text>
                      <View style={styles.sessionComparisonInfo}>
                        <Text style={styles.sessionComparisonText}>
                          {session1.weather} ({session1.temperature}°C) vs {session2.weather} ({session2.temperature}°C)
                        </Text>
                      </View>
                    </View>

                    <View style={styles.sectorsComparison}>
                      {['sector1', 'sector2', 'sector3'].map((sector, index) => {
                        const time1 = parseFloat(session1.sectors[sector as keyof typeof session1.sectors]);
                        const time2 = parseFloat(session2.sectors[sector as keyof typeof session2.sectors]);
                        const sectorDiff = time1 - time2;
                        const isSectorFaster = sectorDiff < 0;

                        return (
                          <View key={sector} style={styles.sectorItem}>
                            <View style={styles.sectorItemHeader}>
                              <Text style={styles.sectorLabel}>Settore {index + 1}</Text>
                              <IconSymbol
                                name={isSectorFaster ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
                                size={18}
                                color={isSectorFaster ? colors.success : colors.error}
                              />
                            </View>
                            <View style={styles.sectorTimes}>
                              <View style={styles.sectorTimeBox}>
                                <Text style={styles.sectorTimeLabel}>Sessione 1</Text>
                                <Text style={styles.sectorTime}>{session1.sectors[sector as keyof typeof session1.sectors]}</Text>
                              </View>
                              <View style={styles.sectorDiffBox}>
                                <Text style={[
                                  styles.sectorDiff,
                                  { color: isSectorFaster ? colors.success : colors.error }
                                ]}>
                                  {isSectorFaster ? '' : '+'}{sectorDiff.toFixed(3)}s
                                </Text>
                              </View>
                              <View style={styles.sectorTimeBox}>
                                <Text style={styles.sectorTimeLabel}>Sessione 2</Text>
                                <Text style={styles.sectorTime}>{session2.sectors[sector as keyof typeof session2.sectors]}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </>
                );
              })()}
            </View>
          )}

          {/* Sessions List */}
          <Text style={styles.sectionHeader}>Sessioni Disponibili ({sessions.length})</Text>
          {sessions.map((session) => (
            <Pressable
              key={session.id}
              style={[
                commonStyles.card,
                styles.sessionCard,
                selectedSessions.includes(session.id) && styles.sessionCardSelected,
              ]}
              onPress={() => toggleSession(session.id)}
            >
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={styles.sessionCircuit}>{session.circuit}</Text>
                    {selectedSessions.includes(session.id) && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.sessionDate}>
                    {new Date(session.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  <View style={styles.sessionMeta}>
                    <View style={styles.metaBadge}>
                      <IconSymbol name="cloud.sun.fill" size={14} color={colors.info} />
                      <Text style={styles.metaText}>{session.weather}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <IconSymbol name="thermometer.medium" size={14} color={colors.warning} />
                      <Text style={styles.metaText}>{session.temperature}°C</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.sessionTime}>
                  <Text style={styles.sessionTimeValue}>{session.lapTime}</Text>
                  <Text style={styles.sessionTimeLabel}>Tempo Giro</Text>
                </View>
              </View>
              <View style={styles.sessionSectors}>
                <View style={styles.sectorBadge}>
                  <Text style={styles.sectorBadgeLabel}>S1</Text>
                  <Text style={styles.sectorBadgeText}>{session.sectors.sector1}</Text>
                </View>
                <View style={styles.sectorBadge}>
                  <Text style={styles.sectorBadgeLabel}>S2</Text>
                  <Text style={styles.sectorBadgeText}>{session.sectors.sector2}</Text>
                </View>
                <View style={styles.sectorBadge}>
                  <Text style={styles.sectorBadgeLabel}>S3</Text>
                  <Text style={styles.sectorBadgeText}>{session.sectors.sector3}</Text>
                </View>
              </View>
              {session.notes && (
                <View style={styles.sessionNotes}>
                  <IconSymbol name="note.text" size={14} color={colors.textSecondary} />
                  <Text style={styles.sessionNotesText}>{session.notes}</Text>
                </View>
              )}
            </Pressable>
          ))}

          {/* Info */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
            <Text style={styles.infoText}>
              Seleziona fino a 3 sessioni per confrontare i dati telemetrici con overlay avanzato. 
              Analizza velocità, gas, freno e RPM per settore per identificare aree di miglioramento specifiche.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exportModal}>
            <Text style={styles.modalTitle}>Esporta Dati Telemetrici</Text>
            <Text style={styles.modalDescription}>
              I dati delle sessioni selezionate verranno esportati in formato CSV per analisi esterna.
            </Text>
            <View style={styles.exportInfo}>
              <IconSymbol name="doc.text.fill" size={32} color={colors.primary} />
              <Text style={styles.exportInfoText}>
                {selectedSessions.length} sessioni selezionate
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Annulla</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={exportData}
              >
                <IconSymbol name="square.and.arrow.up.fill" size={18} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Esporta</Text>
              </Pressable>
            </View>
          </View>
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
  headerCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    alignItems: 'center',
    ...shadows.large,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  metricSelector: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  metricButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  metricButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricButtonContent: {
    alignItems: 'flex-start',
  },
  metricButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  metricButtonTextActive: {
    color: '#FFFFFF',
  },
  metricButtonUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metricButtonUnitActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chartControls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  chartCard: {
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  chartLegend: {
    gap: 12,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendLine: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  sectorAnalysisCard: {
    marginBottom: 24,
  },
  sectorTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sectorTab: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  sectorTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sectorTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sectorTabTextActive: {
    color: '#FFFFFF',
  },
  sectorAnalysisContent: {
    gap: 12,
  },
  analysisMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  analysisMetricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  analysisMetricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  improvementBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  improvementText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  comparisonCard: {
    marginBottom: 24,
  },
  timeDifference: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  timeDifferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  timeDifferenceValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
  },
  sessionComparisonInfo: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
  },
  sessionComparisonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectorsComparison: {
    gap: 12,
  },
  sectorItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  sectorItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectorLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sectorTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectorTimeBox: {
    flex: 1,
    alignItems: 'center',
  },
  sectorTimeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  sectorTime: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectorDiffBox: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 8,
  },
  sectorDiff: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  sessionCard: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sessionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlightRed,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sessionCircuit: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  sessionTime: {
    alignItems: 'flex-end',
  },
  sessionTimeValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  sessionTimeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sessionSectors: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sectorBadge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  sectorBadgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  sectorBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  sessionNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 8,
  },
  sessionNotesText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlightBlue,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exportModal: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...shadows.large,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  exportInfo: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  exportInfoText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    padding: 16,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
});
