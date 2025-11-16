
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { warmupExercises } from '@/data/trainingData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/types/training';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@moto3_custom_warmup';

interface ExerciseCategory {
  id: string;
  title: string;
  icon: string;
  gradient: string[];
  exercises: Exercise[];
}

export default function WarmupScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(warmupExercises);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExercises(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading warmup exercises:', error);
    }
  };

  const toggleExercise = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(e => e !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const showDetails = (exercise: Exercise) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const categories: ExerciseCategory[] = [
    {
      id: 'cardio',
      title: 'Attivazione Cardiovascolare',
      icon: 'heart.fill',
      gradient: ['#ef4444', '#dc2626'],
      exercises: exercises.filter(e => e.id === 'w1' || e.id === 'w8'),
    },
    {
      id: 'upper',
      title: 'Mobilità Parte Superiore',
      icon: 'figure.arms.open',
      gradient: ['#3b82f6', '#2563eb'],
      exercises: exercises.filter(e => e.id === 'w2' || e.id === 'w3'),
    },
    {
      id: 'core',
      title: 'Core e Bacino',
      icon: 'figure.core.training',
      gradient: ['#8b5cf6', '#7c3aed'],
      exercises: exercises.filter(e => e.id === 'w4' || e.id === 'w7'),
    },
    {
      id: 'lower',
      title: 'Attivazione Parte Inferiore',
      icon: 'figure.walk',
      gradient: ['#10b981', '#059669'],
      exercises: exercises.filter(e => e.id === 'w5' || e.id === 'w6'),
    },
  ];

  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Riscaldamento Pre-Allenamento',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header */}
          <LinearGradient
            colors={['#f59e0b', '#ef4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="flame.fill" size={52} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Riscaldamento</Text>
            <Text style={styles.headerSubtitle}>Pre-Allenamento</Text>
            <View style={styles.headerBadge}>
              <IconSymbol name="clock.fill" size={16} color="#FFFFFF" />
              <Text style={styles.headerBadgeText}>15-20 minuti</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FFFFFF', 'rgba(255, 255, 255, 0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {completedCount} di {totalCount} esercizi • {Math.round(progress)}% completato
              </Text>
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={styles.infoHeader}>
              <LinearGradient
                colors={gradients.blue}
                style={styles.infoIconGradient}
              >
                <IconSymbol name="info.circle.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.infoTitle}>Obiettivi del Riscaldamento</Text>
            </View>
            <View style={styles.objectivesList}>
              {[
                { icon: 'thermometer', text: 'Aumentare temperatura corporea di 1-2°C' },
                { icon: 'bolt.fill', text: 'Attivare sistema cardiovascolare e nervoso' },
                { icon: 'figure.flexibility', text: 'Preparare articolazioni e muscoli' },
                { icon: 'shield.fill', text: 'Ridurre rischio infortuni fino al 50%' },
                { icon: 'chart.line.uptrend.xyaxis', text: 'Migliorare prestazioni del 10-15%' },
              ].map((item, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <View style={styles.objectiveIcon}>
                    <IconSymbol name={item.icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.objectiveText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Exercise Categories */}
          {categories.map((category, categoryIndex) => {
            const categoryCompleted = category.exercises.filter(e => 
              completedExercises.includes(e.id)
            ).length;
            const categoryProgress = (categoryCompleted / category.exercises.length) * 100;

            return (
              <View key={category.id} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <LinearGradient
                    colors={category.gradient}
                    style={styles.categoryIconContainer}
                  >
                    <IconSymbol name={category.icon as any} size={22} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <View style={styles.categoryProgressBar}>
                      <View style={[styles.categoryProgressFill, { width: `${categoryProgress}%` }]} />
                    </View>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {categoryCompleted}/{category.exercises.length}
                    </Text>
                  </View>
                </View>

                {category.exercises.map((exercise, index) => {
                  const exerciseNumber = categories
                    .slice(0, categoryIndex)
                    .reduce((sum, cat) => sum + cat.exercises.length, 0) + index + 1;
                  const isCompleted = completedExercises.includes(exercise.id);

                  return (
                    <Pressable
                      key={exercise.id}
                      style={[
                        styles.exerciseCard,
                        isCompleted && styles.exerciseCardCompleted,
                      ]}
                      onPress={() => toggleExercise(exercise.id)}
                    >
                      <View style={styles.exerciseHeader}>
                        <View style={styles.exerciseLeft}>
                          <View style={styles.exerciseNumber}>
                            <Text style={styles.exerciseNumberText}>{exerciseNumber}</Text>
                          </View>
                          <Pressable
                            style={[
                              styles.exerciseCheckbox,
                              isCompleted && styles.exerciseCheckboxChecked,
                            ]}
                            onPress={() => toggleExercise(exercise.id)}
                          >
                            {isCompleted && (
                              <IconSymbol name="checkmark" size={18} color="#FFFFFF" />
                            )}
                          </Pressable>
                        </View>
                        
                        <View style={styles.exerciseContent}>
                          <Text style={[
                            styles.exerciseName,
                            isCompleted && styles.exerciseNameCompleted,
                          ]}>
                            {exercise.name}
                          </Text>
                          <View style={styles.exerciseDetails}>
                            {exercise.duration && (
                              <View style={styles.detailBadge}>
                                <IconSymbol name="clock.fill" size={14} color={category.gradient[0]} />
                                <Text style={styles.detailText}>
                                  {exercise.duration >= 60 
                                    ? `${Math.floor(exercise.duration / 60)} min` 
                                    : `${exercise.duration} sec`}
                                </Text>
                              </View>
                            )}
                            {exercise.sets && exercise.reps && (
                              <View style={styles.detailBadge}>
                                <IconSymbol name="repeat" size={14} color={category.gradient[0]} />
                                <Text style={styles.detailText}>
                                  {exercise.sets} × {exercise.reps}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        <Pressable 
                          style={styles.infoButton}
                          onPress={() => showDetails(exercise)}
                        >
                          <IconSymbol name="info.circle.fill" size={26} color={colors.info} />
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}

          {/* Tips Card */}
          <View style={[commonStyles.card, styles.tipsCard]}>
            <View style={styles.tipsHeader}>
              <LinearGradient
                colors={gradients.warning}
                style={styles.tipsIconGradient}
              >
                <IconSymbol name="lightbulb.fill" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.tipsTitle}>Consigli Importanti</Text>
            </View>
            <View style={styles.tipsList}>
              {[
                'Inizia gradualmente e aumenta l\'intensità progressivamente',
                'Mantieni una respirazione regolare e profonda',
                'Non forzare i movimenti, ascolta il tuo corpo',
                'Adatta l\'intensità alla temperatura ambientale',
                'Completa sempre l\'intera sequenza per risultati ottimali',
              ].map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet}>
                    <View style={styles.tipBulletInner} />
                  </View>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Enhanced Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowDetailModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
              <Pressable 
                style={styles.modalCloseButton}
                onPress={() => setShowDetailModal(false)}
              >
                <IconSymbol name="xmark.circle.fill" size={32} color={colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {selectedExercise?.notes && (
                <Text style={styles.modalDescription}>{selectedExercise.notes}</Text>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    ...shadows.large,
  },
  headerIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontWeight: '600',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  headerBadgeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: colors.highlightBlue,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  objectivesList: {
    gap: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectiveIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...shadows.small,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...shadows.small,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardCompleted: {
    backgroundColor: colors.highlightGreen,
    borderColor: colors.success,
    opacity: 0.7,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...shadows.small,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exerciseCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  exerciseCheckboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  tipsCard: {
    backgroundColor: colors.highlightGold,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipBulletInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
    ...shadows.large,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 500,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
  },
});
