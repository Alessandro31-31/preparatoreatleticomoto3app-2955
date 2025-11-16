
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

interface BiomechanicalAnalysis {
  id: string;
  date: string;
  type: 'riding' | 'training' | 'recovery';
  metrics: {
    jointAngles: {
      knee: number;
      hip: number;
      ankle: number;
      elbow: number;
      shoulder: number;
      wrist: number;
      neck: number;
    };
    forceDistribution: {
      leftFoot: number;
      rightFoot: number;
      leftHand: number;
      rightHand: number;
    };
    symmetry: number;
    efficiency: number;
    stability: number;
    flexibility: number;
  };
  recommendations: string[];
  riskAreas: string[];
}

interface PosePoint {
  x: number;
  y: number;
  confidence: number;
}

export default function Biomechanics3DScreen() {
  const [analyses, setAnalyses] = useState<BiomechanicalAnalysis[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'riding',
      metrics: {
        jointAngles: {
          knee: 125,
          hip: 110,
          ankle: 95,
          elbow: 140,
          shoulder: 85,
          wrist: 175,
          neck: 45,
        },
        forceDistribution: {
          leftFoot: 48,
          rightFoot: 52,
          leftHand: 45,
          rightHand: 55,
        },
        symmetry: 92,
        efficiency: 88,
        stability: 85,
        flexibility: 78,
      },
      recommendations: [
        'Aumentare flessione ginocchio di 5° in curva',
        'Migliorare simmetria distribuzione peso',
        'Ottimizzare angolo gomito per controllo',
        'Rafforzare core per maggiore stabilità',
      ],
      riskAreas: [
        'Tensione eccessiva polso destro',
        'Asimmetria carico piedi',
      ],
    },
    {
      id: '2',
      date: '2024-01-14',
      type: 'training',
      metrics: {
        jointAngles: {
          knee: 130,
          hip: 115,
          ankle: 92,
          elbow: 135,
          shoulder: 88,
          wrist: 178,
          neck: 42,
        },
        forceDistribution: {
          leftFoot: 50,
          rightFoot: 50,
          leftHand: 48,
          rightHand: 52,
        },
        symmetry: 95,
        efficiency: 91,
        stability: 89,
        flexibility: 82,
      },
      recommendations: [
        'Mantenere simmetria attuale',
        'Continuare esercizi di flessibilità',
        'Ottima postura generale',
      ],
      riskAreas: [],
    },
  ]);

  const [selectedAnalysis, setSelectedAnalysis] = useState<BiomechanicalAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPoseModal, setShowPoseModal] = useState(false);
  const [realTimeFeedback, setRealTimeFeedback] = useState<string[]>([]);

  const startAnalysis = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permesso negato', 'Serve il permesso per accedere alla fotocamera');
        return;
      }

      Alert.alert(
        'Analisi Biomeccanica 3D',
        'Scegli la modalità di analisi:',
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'Foto',
            onPress: () => capturePhoto(),
          },
          {
            text: 'Video',
            onPress: () => captureVideo(),
          },
          {
            text: 'Tempo Reale',
            onPress: () => startRealTimeAnalysis(),
          },
        ]
      );
    } catch (error) {
      console.error('Error starting analysis:', error);
      Alert.alert('Errore', 'Impossibile avviare l\'analisi');
    }
  };

  const capturePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        simulateAnalysis();
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const captureVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        simulateAnalysis();
      }
    } catch (error) {
      console.error('Error capturing video:', error);
    }
  };

  const startRealTimeAnalysis = () => {
    setShowPoseModal(true);
    setIsAnalyzing(true);
    setRealTimeFeedback([]);

    // Simulate real-time feedback
    const feedbackMessages = [
      'Postura rilevata',
      'Analizzando angoli articolari...',
      'Ginocchio: angolo ottimale',
      'Attenzione: asimmetria rilevata',
      'Suggerimento: spostare peso a sinistra',
      'Stabilità migliorata',
      'Analisi completata',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < feedbackMessages.length) {
        setRealTimeFeedback(prev => [...prev, feedbackMessages[index]]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        index++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const newAnalysis: BiomechanicalAnalysis = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        type: 'riding',
        metrics: {
          jointAngles: {
            knee: 120 + Math.random() * 15,
            hip: 105 + Math.random() * 15,
            ankle: 90 + Math.random() * 10,
            elbow: 135 + Math.random() * 15,
            shoulder: 80 + Math.random() * 15,
            wrist: 170 + Math.random() * 10,
            neck: 40 + Math.random() * 10,
          },
          forceDistribution: {
            leftFoot: 45 + Math.random() * 10,
            rightFoot: 45 + Math.random() * 10,
            leftHand: 45 + Math.random() * 10,
            rightHand: 45 + Math.random() * 10,
          },
          symmetry: 85 + Math.random() * 15,
          efficiency: 80 + Math.random() * 15,
          stability: 80 + Math.random() * 15,
          flexibility: 75 + Math.random() * 15,
        },
        recommendations: [
          'Ottimizzare angolo ginocchio',
          'Migliorare distribuzione peso',
          'Aumentare flessibilità caviglia',
        ],
        riskAreas: Math.random() > 0.5 ? ['Tensione polso'] : [],
      };

      setAnalyses(prev => [newAnalysis, ...prev]);
      setIsAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Analisi completata', 'La nuova analisi biomeccanica è disponibile');
    }, 3000);
  };

  const getAngleColor = (angle: number, optimal: number) => {
    const diff = Math.abs(angle - optimal);
    if (diff < 5) return colors.success;
    if (diff < 10) return colors.warning;
    return colors.error;
  };

  const getAngleStatus = (angle: number, optimal: number) => {
    const diff = Math.abs(angle - optimal);
    if (diff < 5) return 'Ottimale';
    if (diff < 10) return 'Buono';
    return 'Da migliorare';
  };

  const renderPoseSkeleton = () => {
    // Simplified pose skeleton visualization
    const width = 200;
    const height = 300;
    
    // Body points (simplified)
    const points = {
      head: { x: 100, y: 40 },
      neck: { x: 100, y: 70 },
      leftShoulder: { x: 70, y: 90 },
      rightShoulder: { x: 130, y: 90 },
      leftElbow: { x: 50, y: 130 },
      rightElbow: { x: 150, y: 130 },
      leftWrist: { x: 40, y: 170 },
      rightWrist: { x: 160, y: 170 },
      spine: { x: 100, y: 140 },
      leftHip: { x: 80, y: 180 },
      rightHip: { x: 120, y: 180 },
      leftKnee: { x: 70, y: 230 },
      rightKnee: { x: 130, y: 230 },
      leftAnkle: { x: 65, y: 280 },
      rightAnkle: { x: 135, y: 280 },
    };

    const connections = [
      ['head', 'neck'],
      ['neck', 'leftShoulder'],
      ['neck', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['rightShoulder', 'rightElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightElbow', 'rightWrist'],
      ['neck', 'spine'],
      ['spine', 'leftHip'],
      ['spine', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['rightHip', 'rightKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightKnee', 'rightAnkle'],
    ];

    return (
      <Svg width={width} height={height}>
        {/* Connections */}
        {connections.map(([start, end], index) => {
          const startPoint = points[start as keyof typeof points];
          const endPoint = points[end as keyof typeof points];
          return (
            <Line
              key={index}
              x1={startPoint.x}
              y1={startPoint.y}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={colors.primary}
              strokeWidth="3"
            />
          );
        })}
        
        {/* Joints */}
        {Object.entries(points).map(([name, point]) => (
          <Circle
            key={name}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={colors.accent}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}
      </Svg>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Analisi Biomeccanica 3D',
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
            colors={gradients.warning}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="figure.walk.motion" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Analisi Biomeccanica 3D</Text>
            <Text style={styles.headerDescription}>
              Pose estimation avanzata con feedback real-time e prevenzione infortuni
            </Text>
          </LinearGradient>

          {/* Start Analysis Button */}
          <Pressable 
            style={styles.startButton} 
            onPress={startAnalysis}
            disabled={isAnalyzing}
          >
            <LinearGradient
              colors={isAnalyzing ? [colors.textSecondary, colors.textLight] : gradients.racing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              {isAnalyzing ? (
                <>
                  <IconSymbol name="hourglass" size={32} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Analisi in corso...</Text>
                </>
              ) : (
                <>
                  <IconSymbol name="camera.fill" size={32} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Nuova Analisi 3D</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          {/* Analysis Modes */}
          <View style={[commonStyles.card, styles.modesCard]}>
            <Text style={styles.sectionTitle}>Modalità Analisi</Text>
            <View style={styles.modesList}>
              <View style={styles.modeItem}>
                <View style={[styles.modeIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="camera.fill" size={24} color={colors.primary} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>Foto Singola</Text>
                  <Text style={styles.modeDescription}>Analisi statica della postura</Text>
                </View>
              </View>
              <View style={styles.modeItem}>
                <View style={[styles.modeIcon, { backgroundColor: colors.accent + '20' }]}>
                  <IconSymbol name="video.fill" size={24} color={colors.accent} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>Video</Text>
                  <Text style={styles.modeDescription}>Analisi dinamica del movimento</Text>
                </View>
              </View>
              <View style={styles.modeItem}>
                <View style={[styles.modeIcon, { backgroundColor: colors.success + '20' }]}>
                  <IconSymbol name="waveform.path.ecg" size={24} color={colors.success} />
                </View>
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>Tempo Reale</Text>
                  <Text style={styles.modeDescription}>Feedback istantaneo durante l&apos;esercizio</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={[commonStyles.card, styles.featuresCard]}>
            <Text style={styles.sectionTitle}>Tecnologie Avanzate</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconSymbol name="figure.stand" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Pose estimation con 17 punti chiave</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="arrow.left.and.right" size={20} color={colors.accent} />
                <Text style={styles.featureText}>Analisi simmetria bilaterale</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="chart.bar.fill" size={20} color={colors.success} />
                <Text style={styles.featureText}>Distribuzione forze in tempo reale</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="waveform.path.ecg" size={20} color={colors.warning} />
                <Text style={styles.featureText}>Metriche efficienza movimento</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
                <Text style={styles.featureText}>AI per rilevamento rischio infortuni</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="sparkles" size={20} color={colors.purple} />
                <Text style={styles.featureText}>Suggerimenti personalizzati AI</Text>
              </View>
            </View>
          </View>

          {/* Recent Analyses */}
          <Text style={styles.sectionHeader}>Analisi Recenti ({analyses.length})</Text>
          {analyses.map((analysis) => (
            <Pressable
              key={analysis.id}
              style={[commonStyles.card, styles.analysisCard]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAnalysis(
                  selectedAnalysis?.id === analysis.id ? null : analysis
                );
              }}
            >
              <View style={styles.analysisHeader}>
                <View style={styles.analysisInfo}>
                  <Text style={styles.analysisDate}>
                    {new Date(analysis.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  <View style={styles.analysisTypeBadge}>
                    <Text style={styles.analysisTypeText}>
                      {analysis.type === 'riding' && '🏍️ Guida'}
                      {analysis.type === 'training' && '💪 Allenamento'}
                      {analysis.type === 'recovery' && '🧘 Recupero'}
                    </Text>
                  </View>
                </View>
                <View style={styles.analysisScores}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreValue}>{Math.round(analysis.metrics.symmetry)}%</Text>
                    <Text style={styles.scoreLabel}>Simmetria</Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreValue}>{Math.round(analysis.metrics.efficiency)}%</Text>
                    <Text style={styles.scoreLabel}>Efficienza</Text>
                  </View>
                </View>
              </View>

              {/* Risk Alerts */}
              {analysis.riskAreas.length > 0 && (
                <View style={styles.riskAlert}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.error} />
                  <Text style={styles.riskAlertText}>
                    {analysis.riskAreas.length} area{analysis.riskAreas.length > 1 ? 'e' : ''} di rischio rilevata{analysis.riskAreas.length > 1 ? 'e' : ''}
                  </Text>
                </View>
              )}

              {selectedAnalysis?.id === analysis.id && (
                <View style={styles.analysisDetails}>
                  {/* Performance Metrics */}
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                      <IconSymbol name="arrow.left.and.right" size={20} color={colors.primary} />
                      <Text style={styles.metricCardValue}>{Math.round(analysis.metrics.symmetry)}%</Text>
                      <Text style={styles.metricCardLabel}>Simmetria</Text>
                    </View>
                    <View style={styles.metricCard}>
                      <IconSymbol name="bolt.fill" size={20} color={colors.success} />
                      <Text style={styles.metricCardValue}>{Math.round(analysis.metrics.efficiency)}%</Text>
                      <Text style={styles.metricCardLabel}>Efficienza</Text>
                    </View>
                    <View style={styles.metricCard}>
                      <IconSymbol name="figure.stand" size={20} color={colors.accent} />
                      <Text style={styles.metricCardValue}>{Math.round(analysis.metrics.stability)}%</Text>
                      <Text style={styles.metricCardLabel}>Stabilità</Text>
                    </View>
                    <View style={styles.metricCard}>
                      <IconSymbol name="figure.flexibility" size={20} color={colors.warning} />
                      <Text style={styles.metricCardValue}>{Math.round(analysis.metrics.flexibility)}%</Text>
                      <Text style={styles.metricCardLabel}>Flessibilità</Text>
                    </View>
                  </View>

                  {/* Joint Angles */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>Angoli Articolari</Text>
                    <View style={styles.anglesList}>
                      {Object.entries(analysis.metrics.jointAngles).map(([joint, angle]) => {
                        const optimalAngles: { [key: string]: number } = {
                          knee: 120,
                          hip: 110,
                          ankle: 90,
                          elbow: 135,
                          shoulder: 90,
                          wrist: 180,
                          neck: 45,
                        };
                        const optimal = optimalAngles[joint];
                        const jointLabels: { [key: string]: string } = {
                          knee: 'Ginocchio',
                          hip: 'Anca',
                          ankle: 'Caviglia',
                          elbow: 'Gomito',
                          shoulder: 'Spalla',
                          wrist: 'Polso',
                          neck: 'Collo',
                        };

                        return (
                          <View key={joint} style={styles.angleItem}>
                            <View style={styles.angleHeader}>
                              <Text style={styles.angleLabel}>{jointLabels[joint]}</Text>
                              <View style={styles.angleValues}>
                                <Text style={[styles.angleValue, { color: getAngleColor(angle, optimal) }]}>
                                  {Math.round(angle)}°
                                </Text>
                                <Text style={styles.angleOptimal}>/ {optimal}°</Text>
                              </View>
                            </View>
                            <View style={styles.angleBar}>
                              <View
                                style={[
                                  styles.angleBarFill,
                                  {
                                    width: `${(angle / 180) * 100}%`,
                                    backgroundColor: getAngleColor(angle, optimal),
                                  },
                                ]}
                              />
                            </View>
                            <Text style={[styles.angleStatus, { color: getAngleColor(angle, optimal) }]}>
                              {getAngleStatus(angle, optimal)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Force Distribution */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>Distribuzione Forze</Text>
                    <View style={styles.forceGrid}>
                      {Object.entries(analysis.metrics.forceDistribution).map(([part, force]) => {
                        const partLabels: { [key: string]: string } = {
                          leftFoot: 'Piede SX',
                          rightFoot: 'Piede DX',
                          leftHand: 'Mano SX',
                          rightHand: 'Mano DX',
                        };

                        return (
                          <View key={part} style={styles.forceItem}>
                            <Text style={styles.forceLabel}>{partLabels[part]}</Text>
                            <Text style={styles.forceValue}>{Math.round(force)}%</Text>
                            <View style={styles.forceBar}>
                              <View
                                style={[
                                  styles.forceBarFill,
                                  {
                                    width: `${force}%`,
                                    backgroundColor: Math.abs(force - 50) < 5 ? colors.success : colors.warning,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Risk Areas */}
                  {analysis.riskAreas.length > 0 && (
                    <View style={styles.riskSection}>
                      <Text style={styles.riskTitle}>
                        <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.error} />
                        {' '}Aree di Rischio
                      </Text>
                      {analysis.riskAreas.map((risk, index) => (
                        <View key={index} style={styles.riskItem}>
                          <View style={styles.riskBullet} />
                          <Text style={styles.riskText}>{risk}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Recommendations */}
                  <View style={styles.recommendationsSection}>
                    <Text style={styles.recommendationsTitle}>
                      <IconSymbol name="lightbulb.fill" size={18} color={colors.warning} />
                      {' '}Raccomandazioni AI
                    </Text>
                    {analysis.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <View style={styles.recommendationNumber}>
                          <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.recommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Pressable>
          ))}

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
            <Text style={styles.infoText}>
              L&apos;analisi biomeccanica 3D utilizza algoritmi di pose estimation per tracciare 
              17 punti chiave del corpo, fornendo feedback dettagliato su postura, angoli articolari, 
              distribuzione delle forze e rilevamento precoce di potenziali rischi di infortunio.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Real-time Pose Modal */}
      <Modal
        visible={showPoseModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPoseModal(false)}
      >
        <View style={styles.poseModalContainer}>
          <LinearGradient
            colors={gradients.carbon}
            style={styles.poseModalGradient}
          >
            <View style={styles.poseModalHeader}>
              <Text style={styles.poseModalTitle}>Analisi Tempo Reale</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowPoseModal(false);
                  setIsAnalyzing(false);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={32} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.poseVisualization}>
              {renderPoseSkeleton()}
            </View>

            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>Feedback Real-Time</Text>
              <ScrollView style={styles.feedbackScroll}>
                {realTimeFeedback.map((feedback, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <View style={styles.feedbackDot} />
                    <Text style={styles.feedbackText}>{feedback}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {!isAnalyzing && realTimeFeedback.length > 0 && (
              <Pressable
                style={styles.doneButton}
                onPress={() => {
                  setShowPoseModal(false);
                  simulateAnalysis();
                }}
              >
                <Text style={styles.doneButtonText}>Salva Analisi</Text>
              </Pressable>
            )}
          </LinearGradient>
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
  startButton: {
    marginBottom: 24,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 24,
    ...shadows.medium,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modesCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  modesList: {
    gap: 12,
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  featuresCard: {
    marginBottom: 24,
  },
  featuresList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  analysisCard: {
    marginBottom: 16,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  analysisTypeBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  analysisTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  analysisScores: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  riskAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.highlightRed,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  riskAlertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
  analysisDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  metricCardValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  metricCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  anglesList: {
    gap: 16,
  },
  angleItem: {
    gap: 8,
  },
  angleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  angleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  angleValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  angleValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  angleOptimal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  angleBar: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  angleBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  angleStatus: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  forceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  forceItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
  },
  forceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  forceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  forceBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  forceBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskSection: {
    backgroundColor: colors.highlightRed,
    borderRadius: 16,
    padding: 16,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.error,
    marginBottom: 12,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  riskBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  riskText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationsSection: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '600',
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
  poseModalContainer: {
    flex: 1,
  },
  poseModalGradient: {
    flex: 1,
    padding: 20,
  },
  poseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  poseModalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  poseVisualization: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  feedbackContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  feedbackScroll: {
    flex: 1,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  feedbackDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  feedbackText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
