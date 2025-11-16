
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'meditation' | 'visualization' | 'breathing' | 'focus';
  icon: string;
  gradient: string[];
  steps: string[];
}

export default function MentalTrainingScreen() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Meditazione Pre-Gara',
      description: 'Calma la mente e aumenta la concentrazione prima della gara',
      duration: 600,
      type: 'meditation',
      icon: 'brain.head.profile',
      gradient: gradients.purple,
      steps: [
        'Trova una posizione comoda e chiudi gli occhi',
        'Respira profondamente per 5 volte',
        'Concentrati sul tuo respiro naturale',
        'Lascia andare i pensieri che emergono',
        'Visualizza te stesso calmo e concentrato',
        'Mantieni questa sensazione per alcuni minuti',
      ],
    },
    {
      id: '2',
      title: 'Visualizzazione Giro Perfetto',
      description: 'Immagina ogni curva, frenata e accelerazione del circuito',
      duration: 900,
      type: 'visualization',
      icon: 'eye.fill',
      gradient: gradients.racing,
      steps: [
        'Chiudi gli occhi e respira profondamente',
        'Visualizza il circuito dall\'alto',
        'Immagina di essere sulla moto in griglia',
        'Vedi il semaforo che si spegne',
        'Percorri mentalmente ogni curva',
        'Senti l\'accelerazione e la frenata',
        'Vedi la bandiera a scacchi',
      ],
    },
    {
      id: '3',
      title: 'Respirazione Box',
      description: 'Tecnica di respirazione per ridurre stress e ansia',
      duration: 300,
      type: 'breathing',
      icon: 'wind',
      gradient: gradients.cyan,
      steps: [
        'Inspira contando fino a 4',
        'Trattieni il respiro per 4 secondi',
        'Espira contando fino a 4',
        'Pausa per 4 secondi',
        'Ripeti il ciclo',
      ],
    },
    {
      id: '4',
      title: 'Focus Laser',
      description: 'Esercizio per migliorare concentrazione e attenzione',
      duration: 420,
      type: 'focus',
      icon: 'scope',
      gradient: gradients.warning,
      steps: [
        'Scegli un punto fisso davanti a te',
        'Concentra tutta la tua attenzione su quel punto',
        'Quando la mente vaga, riportala gentilmente al punto',
        'Mantieni la concentrazione per 2 minuti',
        'Aumenta gradualmente la durata',
      ],
    },
    {
      id: '5',
      title: 'Gestione Pressione',
      description: 'Tecniche per gestire la pressione in situazioni critiche',
      duration: 480,
      type: 'meditation',
      icon: 'shield.fill',
      gradient: gradients.success,
      steps: [
        'Riconosci la sensazione di pressione',
        'Accetta che è normale sentirsi così',
        'Respira profondamente 3 volte',
        'Ricorda i tuoi successi passati',
        'Visualizza te stesso che gestisci la situazione',
        'Trasforma la pressione in energia positiva',
      ],
    },
    {
      id: '6',
      title: 'Recupero Mentale',
      description: 'Rilassamento profondo dopo sessioni intense',
      duration: 720,
      type: 'meditation',
      icon: 'moon.stars.fill',
      gradient: gradients.blue,
      steps: [
        'Sdraiati in posizione comoda',
        'Rilassa ogni parte del corpo progressivamente',
        'Inizia dai piedi e sali verso la testa',
        'Respira lentamente e profondamente',
        'Lascia andare ogni tensione',
        'Rimani in questo stato per 10 minuti',
      ],
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const startExercise = (exercise: Exercise) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlaying(!isPlaying);
  };

  const stopExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(false);
    setSelectedExercise(null);
    setTimeRemaining(0);
    setCurrentStep(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Allenamento Mentale',
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
            colors={gradients.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="brain.head.profile" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Allenamento Mentale</Text>
            <Text style={styles.headerDescription}>
              Esercizi di meditazione, visualizzazione e focus per piloti professionisti
            </Text>
          </LinearGradient>

          {/* Benefits */}
          <View style={[commonStyles.card, styles.benefitsCard]}>
            <Text style={styles.sectionTitle}>Benefici</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <IconSymbol name="brain" size={20} color={colors.purple} />
                <Text style={styles.benefitText}>Migliora concentrazione e focus</Text>
              </View>
              <View style={styles.benefitItem}>
                <IconSymbol name="heart.fill" size={20} color={colors.error} />
                <Text style={styles.benefitText}>Riduce stress e ansia pre-gara</Text>
              </View>
              <View style={styles.benefitItem}>
                <IconSymbol name="bolt.fill" size={20} color={colors.warning} />
                <Text style={styles.benefitText}>Aumenta tempi di reazione</Text>
              </View>
              <View style={styles.benefitItem}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.success} />
                <Text style={styles.benefitText}>Ottimizza prestazioni in gara</Text>
              </View>
            </View>
          </View>

          {/* Exercises */}
          <Text style={styles.sectionHeader}>Esercizi Disponibili</Text>
          {exercises.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={[commonStyles.card, styles.exerciseCard]}
              onPress={() => startExercise(exercise)}
            >
              <LinearGradient
                colors={exercise.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.exerciseIcon}
              >
                <IconSymbol name={exercise.icon as any} size={32} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.exerciseMetaItem}>
                    <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />
                    <Text style={styles.exerciseMetaText}>{Math.floor(exercise.duration / 60)} min</Text>
                  </View>
                  <View style={styles.exerciseTypeBadge}>
                    <Text style={styles.exerciseTypeText}>
                      {exercise.type === 'meditation' && 'Meditazione'}
                      {exercise.type === 'visualization' && 'Visualizzazione'}
                      {exercise.type === 'breathing' && 'Respirazione'}
                      {exercise.type === 'focus' && 'Focus'}
                    </Text>
                  </View>
                </View>
              </View>
              <IconSymbol name="play.circle.fill" size={32} color={colors.primary} />
            </Pressable>
          ))}

          {/* Tips */}
          <View style={[commonStyles.card, styles.tipsCard]}>
            <View style={styles.tipsHeader}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.racingGold} />
              <Text style={styles.tipsTitle}>Consigli per l&apos;Allenamento</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Pratica quotidianamente per risultati ottimali</Text>
              <Text style={styles.tipItem}>• Trova un ambiente tranquillo e senza distrazioni</Text>
              <Text style={styles.tipItem}>• Usa cuffie per un&apos;esperienza immersiva</Text>
              <Text style={styles.tipItem}>• Pratica la visualizzazione prima di ogni gara</Text>
              <Text style={styles.tipItem}>• Combina con allenamento fisico per massimi benefici</Text>
            </View>
          </View>
        </ScrollView>

        {/* Exercise Modal */}
        <Modal
          visible={selectedExercise !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={stopExercise}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedExercise && (
                <>
                  <LinearGradient
                    colors={selectedExercise.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalHeader}
                  >
                    <IconSymbol name={selectedExercise.icon as any} size={48} color="#FFFFFF" />
                    <Text style={styles.modalTitle}>{selectedExercise.title}</Text>
                  </LinearGradient>

                  <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${(timeRemaining / selectedExercise.duration) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <ScrollView style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>Passaggi</Text>
                    {selectedExercise.steps.map((step, index) => (
                      <View key={index} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <View style={styles.modalControls}>
                    <Pressable
                      style={[styles.controlButton, styles.controlButtonSecondary]}
                      onPress={stopExercise}
                    >
                      <IconSymbol name="xmark" size={24} color={colors.text} />
                      <Text style={styles.controlButtonTextSecondary}>Chiudi</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.controlButton, styles.controlButtonPrimary]}
                      onPress={togglePlayPause}
                    >
                      <IconSymbol
                        name={isPlaying ? 'pause.fill' : 'play.fill'}
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text style={styles.controlButtonText}>
                        {isPlaying ? 'Pausa' : 'Riprendi'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
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
  benefitsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  benefitsList: {
    gap: 14,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
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
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  exerciseIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  exerciseTypeBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exerciseTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  tipsCard: {
    backgroundColor: colors.highlightGold,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    ...shadows.large,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    padding: 24,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -2,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    flex: 1,
    padding: 24,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    paddingTop: 4,
  },
  modalControls: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    padding: 18,
  },
  controlButtonPrimary: {
    backgroundColor: colors.primary,
  },
  controlButtonSecondary: {
    backgroundColor: colors.surface,
  },
  controlButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  controlButtonTextSecondary: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
});
