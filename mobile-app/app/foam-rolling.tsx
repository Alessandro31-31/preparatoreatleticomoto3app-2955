
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { foamRollingExercises } from '@/data/trainingData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/types/training';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@moto3_custom_foam_rolling';

interface ExerciseCategory {
  id: string;
  title: string;
  icon: string;
  gradient: string[];
  exercises: Exercise[];
}

export default function FoamRollingScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(foamRollingExercises);
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
      console.log('Error loading foam rolling exercises:', error);
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
      title: 'Gambe e Anche',
      icon: 'figure.walk',
      gradient: ['#8b5cf6', '#7c3aed'],
      exercises: exercises.filter(e => ['f1', 'f2', 'f3', 'f4', 'f6', 'f7'].includes(e.id)),
    },
    {
      id: 'back',
      title: 'Schiena e Dorsali',
      icon: 'figure.cooldown',
      gradient: ['#3b82f6', '#2563eb'],
      exercises: exercises.filter(e => ['f5', 'f8'].includes(e.id)),
    },
  ];

  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Protocollo Foam Rolling',
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
            colors={['#8b5cf6', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="cylinder.fill" size={52} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Foam Rolling</Text>
            <Text style={styles.headerSubtitle}>Rilascio Miofasciale</Text>
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
                {completedCount} di {totalCount} aree trattate • {Math.round(progress)}% completato
              </Text>
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={styles.infoHeader}>
              <LinearGradient
                colors={gradients.purple}
                style={styles.infoIconGradient}
              >
                <IconSymbol name="info.circle.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.infoTitle}>Cos&apos;è il Foam Rolling</Text>
            </View>
            <Text style={styles.infoText}>
              Il foam rolling è una tecnica di auto-massaggio che utilizza un rullo di schiuma 
              per rilasciare tensioni muscolari e migliorare la mobilità. Per i piloti Moto3 è 
              essenziale per:
            </Text>
            <View style={styles.objectivesList}>
              {[
                { icon: 'figure.cooldown', text: 'Ridurre rigidità muscolare post-allenamento' },
                { icon: 'drop.fill', text: 'Migliorare circolazione sanguigna' },
                { icon: 'shield.fill', text: 'Prevenire infortuni da sovraccarico' },
                { icon: 'bolt.fill', text: 'Accelerare recupero muscolare' },
                { icon: 'scope', text: 'Identificare e trattare trigger points' },
              ].map((item, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <View style={styles.objectiveIcon}>
                    <IconSymbol name={item.icon as any} size={16} color="#8b5cf6" />
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
                                {exercise.duration} sec (45 sec per lato)
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

          {/* Technique Card */}
          <View style={[commonStyles.card, styles.techniqueCard]}>
            <View style={styles.techniqueHeader}>
              <LinearGradient
                colors={gradients.purple}
                style={styles.techniqueIconGradient}
              >
                <IconSymbol name="checkmark.seal.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.techniqueTitle}>Tecnica Corretta</Text>
            </View>
            <View style={styles.techniqueList}>
              {[
                { num: '1', title: 'Rotola lentamente:', text: '2-3 cm al secondo, non veloce' },
                { num: '2', title: 'Fermati sui trigger points:', text: '20-30 secondi sui punti più tesi' },
                { num: '3', title: 'Respira profondamente:', text: 'Non trattenere il respiro' },
                { num: '4', title: 'Evita articolazioni:', text: 'Non rotolare su ginocchia, gomiti, colonna' },
                { num: '5', title: 'Intensità 6-7/10:', text: 'Deve essere intenso ma tollerabile' },
              ].map((item, index) => (
                <View key={index} style={styles.techniqueItem}>
                  <View style={styles.techniqueBullet}>
                    <Text style={styles.techniqueBulletText}>{item.num}</Text>
                  </View>
                  <Text style={styles.techniqueText}>
                    <Text style={styles.techniqueBold}>{item.title}</Text> {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Frequency Card */}
          <View style={[commonStyles.card, styles.frequencyCard]}>
            <View style={styles.frequencyHeader}>
              <LinearGradient
                colors={gradients.warning}
                style={styles.frequencyIconGradient}
              >
                <IconSymbol name="calendar" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.frequencyTitle}>Quando e Quanto Spesso</Text>
            </View>
            <View style={styles.frequencyList}>
              <View style={styles.frequencyItem}>
                <Text style={styles.frequencyBold}>Frequenza ideale:</Text>
                <Text style={styles.frequencyText}> 3-4 volte a settimana</Text>
              </View>
              <View style={styles.frequencyItem}>
                <Text style={styles.frequencyBold}>Momento migliore:</Text>
                <Text style={styles.frequencyText}> Dopo allenamento o sera prima di dormire</Text>
              </View>
              <View style={styles.frequencyItem}>
                <Text style={styles.frequencyBold}>Durata:</Text>
                <Text style={styles.frequencyText}> 15-20 minuti per sessione completa</Text>
              </View>
              <View style={styles.frequencyItem}>
                <Text style={styles.frequencyBold}>Giorni intensi:</Text>
                <Text style={styles.frequencyText}> Focus su aree più sollecitate (gambe, schiena)</Text>
              </View>
            </View>
          </View>

          {/* Warning Card */}
          <View style={[commonStyles.card, styles.warningCard]}>
            <View style={styles.warningHeader}>
              <LinearGradient
                colors={gradients.error}
                style={styles.warningIconGradient}
              >
                <IconSymbol name="exclamationmark.triangle.fill" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.warningTitle}>Quando NON Usare il Foam Roller</Text>
            </View>
            <View style={styles.warningList}>
              {[
                'Su infortuni acuti o infiammazioni',
                'Su contusioni o ematomi',
                'In caso di dolore acuto o lancinante',
                'Su vene varicose o problemi circolatori',
                'In presenza di fratture o lesioni ossee',
              ].map((warning, index) => (
                <View key={index} style={styles.warningItem}>
                  <IconSymbol name="xmark.circle.fill" size={18} color={colors.error} />
                  <Text style={styles.warningText}>{warning}</Text>
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
    backgroundColor: colors.highlightPurple,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
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
  techniqueCard: {
    marginBottom: 16,
    backgroundColor: colors.highlightPurple,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  techniqueIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  techniqueTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  techniqueList: {
    gap: 14,
  },
  techniqueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  techniqueBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techniqueBulletText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  techniqueText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  techniqueBold: {
    fontWeight: '700',
  },
  frequencyCard: {
    marginBottom: 16,
    backgroundColor: colors.highlightGold,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  frequencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  frequencyIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  frequencyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  frequencyList: {
    gap: 12,
  },
  frequencyItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyBold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  frequencyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: colors.highlightRed,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  warningList: {
    gap: 12,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warningText: {
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
