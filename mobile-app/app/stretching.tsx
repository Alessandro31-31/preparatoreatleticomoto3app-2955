
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { stretchingExercises } from '@/data/trainingData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/types/training';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@moto3_custom_stretching';

interface ExerciseCategory {
  id: string;
  title: string;
  icon: string;
  gradient: string[];
  exercises: Exercise[];
}

export default function StretchingScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(stretchingExercises);
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
      console.log('Error loading stretching exercises:', error);
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
      id: 'lower',
      title: 'Parte Inferiore del Corpo',
      icon: 'figure.walk',
      gradient: ['#10b981', '#059669'],
      exercises: exercises.filter(e => ['s1', 's2', 's3', 's4', 's5'].includes(e.id)),
    },
    {
      id: 'upper',
      title: 'Parte Superiore del Corpo',
      icon: 'figure.arms.open',
      gradient: ['#3b82f6', '#2563eb'],
      exercises: exercises.filter(e => ['s6', 's7', 's8', 's9', 's10'].includes(e.id)),
    },
    {
      id: 'spine',
      title: 'Colonna e Mobilità Globale',
      icon: 'figure.flexibility',
      gradient: ['#8b5cf6', '#7c3aed'],
      exercises: exercises.filter(e => ['s11', 's12'].includes(e.id)),
    },
  ];

  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Stretching Dedicato',
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
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="figure.flexibility" size={52} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Stretching</Text>
            <Text style={styles.headerSubtitle}>Dedicato</Text>
            <View style={styles.headerBadge}>
              <IconSymbol name="clock.fill" size={16} color="#FFFFFF" />
              <Text style={styles.headerBadgeText}>20-30 minuti</Text>
            </View>
            <View style={styles.headerBadge}>
              <IconSymbol name="calendar" size={16} color="#FFFFFF" />
              <Text style={styles.headerBadgeText}>Giorni di riposo</Text>
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
                colors={gradients.success}
                style={styles.infoIconGradient}
              >
                <IconSymbol name="info.circle.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.infoTitle}>Benefici dello Stretching</Text>
            </View>
            <View style={styles.objectivesList}>
              {[
                { icon: 'arrow.up.right', text: 'Migliora flessibilità e range di movimento' },
                { icon: 'figure.cooldown', text: 'Riduce tensione muscolare e stress' },
                { icon: 'shield.fill', text: 'Previene infortuni e squilibri muscolari' },
                { icon: 'figure.stand', text: 'Migliora postura e allineamento corporeo' },
                { icon: 'bolt.fill', text: 'Favorisce recupero muscolare profondo' },
              ].map((item, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <View style={styles.objectiveIcon}>
                    <IconSymbol name={item.icon as any} size={16} color="#10b981" />
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
                          {exercise.duration && (
                            <View style={styles.detailBadge}>
                              <IconSymbol name="clock.fill" size={14} color={category.gradient[0]} />
                              <Text style={styles.detailText}>
                                {exercise.duration} sec (30 sec per lato)
                              </Text>
                            </View>
                          )}
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

          {/* Guidelines Card */}
          <View style={[commonStyles.card, styles.guidelinesCard]}>
            <View style={styles.guidelinesHeader}>
              <LinearGradient
                colors={gradients.success}
                style={styles.guidelinesIconGradient}
              >
                <IconSymbol name="checkmark.seal.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.guidelinesTitle}>Linee Guida Stretching</Text>
            </View>
            <View style={styles.guidelinesList}>
              {[
                { num: '1', title: 'Non rimbalzare:', text: 'Mantieni posizioni statiche e controllate' },
                { num: '2', title: 'Respira profondamente:', text: 'Inspira ed espira lentamente' },
                { num: '3', title: 'Tensione, non dolore:', text: 'Intensità 5-6 su scala 1-10' },
                { num: '4', title: '30 secondi minimo:', text: 'Mantieni ogni posizione' },
                { num: '5', title: 'Bilaterale:', text: 'Esegui su entrambi i lati del corpo' },
              ].map((item, index) => (
                <View key={index} style={styles.guidelineItem}>
                  <View style={styles.guidelineBullet}>
                    <Text style={styles.guidelineBulletText}>{item.num}</Text>
                  </View>
                  <Text style={styles.guidelineText}>
                    <Text style={styles.guidelineBold}>{item.title}</Text> {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Best Time Card */}
          <View style={[commonStyles.card, styles.timeCard]}>
            <View style={styles.timeHeader}>
              <LinearGradient
                colors={gradients.warning}
                style={styles.timeIconGradient}
              >
                <IconSymbol name="clock.fill" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.timeTitle}>Quando Fare Stretching</Text>
            </View>
            <View style={styles.timeList}>
              <View style={styles.timeItem}>
                <Text style={styles.timeBold}>Momento ideale:</Text>
                <Text style={styles.timeText}> Giorni di riposo o sera dopo allenamento</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeBold}>Temperatura:</Text>
                <Text style={styles.timeText}> Corpo caldo (dopo doccia calda o attività leggera)</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeBold}>Frequenza:</Text>
                <Text style={styles.timeText}> 3-4 volte a settimana per risultati ottimali</Text>
              </View>
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 8,
  },
  headerBadgeText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
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
    backgroundColor: colors.highlightGreen,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
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
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
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
  guidelinesCard: {
    marginBottom: 16,
    backgroundColor: colors.highlightGreen,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guidelinesIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guidelinesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  guidelinesList: {
    gap: 14,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  guidelineBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidelineBulletText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  guidelineBold: {
    fontWeight: '700',
  },
  timeCard: {
    backgroundColor: colors.highlightGold,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  timeList: {
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeBold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  timeText: {
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
