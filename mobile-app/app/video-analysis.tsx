
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

interface VideoAnalysis {
  id: string;
  date: string;
  videoUri: string;
  duration: number;
  analysis: {
    posture: number;
    cornering: number;
    braking: number;
    acceleration: number;
    bodyPosition: number;
  };
  feedback: string[];
  improvements: string[];
}

export default function VideoAnalysisScreen() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<VideoAnalysis[]>([
    {
      id: '1',
      date: '2024-01-15',
      videoUri: '',
      duration: 120,
      analysis: {
        posture: 85,
        cornering: 78,
        braking: 92,
        acceleration: 88,
        bodyPosition: 82,
      },
      feedback: [
        'Postura eccellente in frenata',
        'Migliorare inclinazione in curva 3',
        'Ottima transizione gas-freno',
      ],
      improvements: [
        'Aumentare angolo di piega nelle curve veloci',
        'Anticipare il punto di frenata di 5m',
        'Mantenere gomito più alto in uscita curva',
      ],
    },
  ]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoAnalysis | null>(null);

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permesso negato', 'Serve il permesso per accedere alla galleria');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Video caricato',
          'L\'analisi AI inizierà automaticamente. Tempo stimato: 2-3 minuti',
          [{ text: 'OK' }]
        );
        console.log('Video selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Errore', 'Impossibile caricare il video');
    }
  };

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permesso negato', 'Serve il permesso per accedere alla fotocamera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Video registrato',
          'L\'analisi AI inizierà automaticamente. Tempo stimato: 2-3 minuti',
          [{ text: 'OK' }]
        );
        console.log('Video recorded:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Errore', 'Impossibile registrare il video');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return colors.success;
    if (score >= 70) return colors.warning;
    return colors.error;
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    return 'C';
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Analisi Video AI',
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
            colors={gradients.racing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="camera.fill" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Analisi Video Tecnica</Text>
            <Text style={styles.headerDescription}>
              Intelligenza artificiale avanzata per analizzare la tua tecnica di guida
            </Text>
          </LinearGradient>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              style={styles.actionButton}
              onPress={recordVideo}
            >
              <LinearGradient
                colors={gradients.error}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <IconSymbol name="video.fill" size={28} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Registra</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={pickVideo}
            >
              <LinearGradient
                colors={gradients.blue}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <IconSymbol name="photo.on.rectangle" size={28} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Carica</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* AI Features */}
          <View style={[commonStyles.card, styles.featuresCard]}>
            <Text style={styles.sectionTitle}>Analisi AI Avanzata</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconSymbol name="figure.stand" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Analisi postura e posizione corpo</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="arrow.triangle.turn.up.right.circle.fill" size={20} color={colors.accent} />
                <Text style={styles.featureText}>Valutazione tecnica di curva</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="brake.signal" size={20} color={colors.error} />
                <Text style={styles.featureText}>Analisi punti di frenata</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="bolt.fill" size={20} color={colors.warning} />
                <Text style={styles.featureText}>Timing accelerazione</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.success} />
                <Text style={styles.featureText}>Confronto con piloti professionisti</Text>
              </View>
            </View>
          </View>

          {/* Recent Analyses */}
          <Text style={styles.sectionHeader}>Analisi Recenti</Text>
          
          {analyses.map((analysis) => (
            <Pressable
              key={analysis.id}
              style={[commonStyles.card, styles.analysisCard]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis);
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
                  <Text style={styles.analysisDuration}>
                    <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />
                    {' '}{Math.floor(analysis.duration / 60)}:{(analysis.duration % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.overallScore}>
                  <Text style={styles.overallScoreValue}>
                    {Math.round(
                      (analysis.analysis.posture +
                        analysis.analysis.cornering +
                        analysis.analysis.braking +
                        analysis.analysis.acceleration +
                        analysis.analysis.bodyPosition) / 5
                    )}
                  </Text>
                  <Text style={styles.overallScoreLabel}>
                    {getScoreGrade(
                      Math.round(
                        (analysis.analysis.posture +
                          analysis.analysis.cornering +
                          analysis.analysis.braking +
                          analysis.analysis.acceleration +
                          analysis.analysis.bodyPosition) / 5
                      )
                    )}
                  </Text>
                </View>
              </View>

              {selectedAnalysis?.id === analysis.id && (
                <View style={styles.analysisDetails}>
                  <View style={styles.scoresList}>
                    {Object.entries(analysis.analysis).map(([key, value]) => (
                      <View key={key} style={styles.scoreItem}>
                        <View style={styles.scoreHeader}>
                          <Text style={styles.scoreLabel}>
                            {key === 'posture' && 'Postura'}
                            {key === 'cornering' && 'Curva'}
                            {key === 'braking' && 'Frenata'}
                            {key === 'acceleration' && 'Accelerazione'}
                            {key === 'bodyPosition' && 'Posizione Corpo'}
                          </Text>
                          <Text style={[styles.scoreValue, { color: getScoreColor(value) }]}>
                            {value}%
                          </Text>
                        </View>
                        <View style={styles.scoreBar}>
                          <View
                            style={[
                              styles.scoreBarFill,
                              { width: `${value}%`, backgroundColor: getScoreColor(value) },
                            ]}
                          />
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackTitle}>
                      <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                      {' '}Punti di Forza
                    </Text>
                    {analysis.feedback.map((item, index) => (
                      <Text key={index} style={styles.feedbackItem}>• {item}</Text>
                    ))}
                  </View>

                  <View style={styles.improvementsSection}>
                    <Text style={styles.improvementsTitle}>
                      <IconSymbol name="arrow.up.circle.fill" size={18} color={colors.warning} />
                      {' '}Aree di Miglioramento
                    </Text>
                    {analysis.improvements.map((item, index) => (
                      <Text key={index} style={styles.improvementItem}>• {item}</Text>
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
              Per risultati ottimali, registra video da angolazioni laterali con buona illuminazione. 
              L&apos;AI analizzerà automaticamente postura, tecnica di curva, frenata e accelerazione.
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    ...shadows.medium,
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  featuresCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
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
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  analysisDuration: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  overallScore: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    minWidth: 70,
  },
  overallScoreValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  overallScoreLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  analysisDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  scoresList: {
    gap: 16,
    marginBottom: 20,
  },
  scoreItem: {
    gap: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  feedbackSection: {
    backgroundColor: colors.highlightGreen,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  feedbackItem: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  improvementsSection: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 16,
  },
  improvementsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  improvementItem: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 6,
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
});
