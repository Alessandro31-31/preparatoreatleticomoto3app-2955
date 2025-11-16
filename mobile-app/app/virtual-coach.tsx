
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CoachFeedback {
  id: string;
  timestamp: string;
  type: 'technique' | 'performance' | 'safety' | 'motivation' | 'strategy';
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface SessionMetrics {
  heartRate: number;
  speed: number;
  lapTime: string;
  consistency: number;
  fatigue: number;
  focus: number;
  technique: number;
}

interface TrainingPlan {
  id: string;
  week: number;
  focus: string;
  goals: string[];
  adaptations: string[];
}

interface CoachProfile {
  name: string;
  specialty: string;
  experience: string;
  avatar: string;
}

export default function VirtualCoachScreen() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    heartRate: 72,
    speed: 0,
    lapTime: '--:--',
    consistency: 0,
    fatigue: 0,
    focus: 100,
    technique: 0,
  });
  const [feedbackHistory, setFeedbackHistory] = useState<CoachFeedback[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<CoachFeedback | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [feedbackFrequency, setFeedbackFrequency] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedCoach] = useState<CoachProfile>({
    name: 'Coach AI Pro',
    specialty: 'Moto3 Racing',
    experience: '15+ anni',
    avatar: '🏍️',
  });
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>({
    id: '1',
    week: 1,
    focus: 'Tecnica di curva',
    goals: [
      'Migliorare angolo di piega',
      'Ottimizzare punto di corda',
      'Aumentare velocità in uscita',
    ],
    adaptations: [],
  });
  const [showPlanModal, setShowPlanModal] = useState(false);

  const generateAIFeedback = useCallback((forceType?: string, forcePriority?: string) => {
    const feedbackDatabase = {
      technique: [
        { message: 'Ottima linea in curva 3! Mantieni questa traiettoria.', priority: 'low', category: 'Traiettoria' },
        { message: 'Anticipa il punto di frenata di 5 metri in curva 7.', priority: 'medium', category: 'Frenata' },
        { message: 'Perfetto! Angolo di piega ideale in curva 2.', priority: 'low', category: 'Piega' },
        { message: 'Apri il gas più gradualmente in uscita curva.', priority: 'medium', category: 'Accelerazione' },
        { message: 'Corpo troppo rigido. Rilassa le spalle.', priority: 'medium', category: 'Postura' },
      ],
      performance: [
        { message: 'Tempo sul giro migliorato di 0.3s! Continua così.', priority: 'medium', category: 'Tempo Giro' },
        { message: 'Eccellente consistenza negli ultimi 3 giri!', priority: 'low', category: 'Consistenza' },
        { message: 'Nuovo record personale nel settore 2!', priority: 'high', category: 'Record' },
        { message: 'Velocità massima aumentata di 5 km/h.', priority: 'medium', category: 'Velocità' },
        { message: 'Ottima gestione gomme. Degrado minimo.', priority: 'low', category: 'Gomme' },
      ],
      safety: [
        { message: 'Frequenza cardiaca elevata. Considera una pausa.', priority: 'high', category: 'Salute' },
        { message: 'Livello di affaticamento alto. Riduci intensità.', priority: 'high', category: 'Affaticamento' },
        { message: 'Attenzione: perdita di concentrazione rilevata.', priority: 'medium', category: 'Concentrazione' },
        { message: 'Temperatura corporea elevata. Idratati.', priority: 'medium', category: 'Idratazione' },
        { message: 'Ottimo! Parametri vitali nella norma.', priority: 'low', category: 'Salute' },
      ],
      motivation: [
        { message: 'Stai andando forte! Concentrati sul prossimo giro.', priority: 'low', category: 'Motivazione' },
        { message: 'Non mollare! Sei vicino al tuo obiettivo.', priority: 'medium', category: 'Incoraggiamento' },
        { message: 'Prestazione eccezionale oggi! Continua così.', priority: 'low', category: 'Complimento' },
        { message: 'Ricorda: ogni giro è un\'opportunità di miglioramento.', priority: 'low', category: 'Mindset' },
        { message: 'Respira profondamente. Mantieni la calma.', priority: 'medium', category: 'Rilassamento' },
      ],
      strategy: [
        { message: 'Considera cambio strategia: attacca nel settore 1.', priority: 'medium', category: 'Strategia' },
        { message: 'Gestisci le energie. Ancora 5 giri da fare.', priority: 'medium', category: 'Gestione' },
        { message: 'Momento ideale per tentare il sorpasso.', priority: 'high', category: 'Sorpasso' },
        { message: 'Difendi la posizione. Mantieni la linea interna.', priority: 'medium', category: 'Difesa' },
        { message: 'Analizza il gap: puoi recuperare 0.5s a giro.', priority: 'low', category: 'Analisi' },
      ],
    };

    const type = (forceType || ['technique', 'performance', 'safety', 'motivation', 'strategy'][Math.floor(Math.random() * 5)]) as keyof typeof feedbackDatabase;
    const feedbackOptions = feedbackDatabase[type];
    const selectedFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];

    const newFeedback: CoachFeedback = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('it-IT'),
      type,
      message: selectedFeedback.message,
      priority: (forcePriority || selectedFeedback.priority) as 'low' | 'medium' | 'high',
      category: selectedFeedback.category,
    };

    setFeedbackHistory((prev) => [newFeedback, ...prev].slice(0, 50)); // Keep last 50
    setCurrentFeedback(newFeedback);
    setShowFeedbackModal(true);
    
    // Haptic feedback based on priority
    if (newFeedback.priority === 'high') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (newFeedback.priority === 'medium') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Voice feedback simulation
    if (voiceEnabled) {
      console.log(`🔊 Voice: ${newFeedback.message}`);
    }

    setTimeout(() => {
      setShowFeedbackModal(false);
    }, 4000);
  }, [voiceEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
        
        // Simulate real-time metrics with AI-driven variations
        setMetrics((prev) => {
          const newMetrics = {
            heartRate: 140 + Math.floor(Math.random() * 20),
            speed: 180 + Math.floor(Math.random() * 40),
            lapTime: `1:${50 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 999)}`,
            consistency: Math.min(prev.consistency + (Math.random() * 2), 100),
            fatigue: Math.min(prev.fatigue + 0.3, 100),
            focus: Math.max(prev.focus - (Math.random() * 0.5), 60),
            technique: Math.min(prev.technique + (Math.random() * 1.5), 100),
          };

          // AI-driven feedback triggers
          if (newMetrics.heartRate > 170 && Math.random() > 0.7) {
            generateAIFeedback('safety', 'high');
          } else if (newMetrics.consistency > 80 && Math.random() > 0.85) {
            generateAIFeedback('performance', 'medium');
          } else if (newMetrics.focus < 70 && Math.random() > 0.8) {
            generateAIFeedback('motivation', 'medium');
          }

          return newMetrics;
        });

        // Periodic feedback based on frequency setting
        const feedbackChance = feedbackFrequency === 'high' ? 0.92 : feedbackFrequency === 'medium' ? 0.95 : 0.97;
        if (Math.random() > feedbackChance) {
          generateAIFeedback();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, feedbackFrequency]);

  const startSession = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSessionActive(true);
    setSessionDuration(0);
    setFeedbackHistory([]);
    setMetrics({
      heartRate: 72,
      speed: 0,
      lapTime: '--:--',
      consistency: 0,
      fatigue: 0,
      focus: 100,
      technique: 0,
    });

    // Save session start
    await AsyncStorage.setItem('last_session_start', new Date().toISOString());
  };

  const stopSession = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSessionActive(false);

    // Generate session summary
    const summary = {
      duration: sessionDuration,
      avgHeartRate: 150,
      maxSpeed: 220,
      feedbackCount: feedbackHistory.length,
      date: new Date().toISOString(),
    };

    await AsyncStorage.setItem('last_session_summary', JSON.stringify(summary));

    // Adapt training plan based on performance
    adaptTrainingPlan();

    Alert.alert(
      'Sessione Completata',
      `Durata: ${formatDuration(sessionDuration)}\nFeedback ricevuti: ${feedbackHistory.length}\n\nIl piano di allenamento è stato aggiornato in base alla tua performance.`,
      [{ text: 'OK' }]
    );
  };

  const adaptTrainingPlan = () => {
    const adaptations = [];
    
    if (metrics.consistency > 85) {
      adaptations.push('Aumentare difficoltà esercizi tecnici');
    }
    if (metrics.fatigue > 80) {
      adaptations.push('Aggiungere giorno di recupero');
    }
    if (metrics.technique > 90) {
      adaptations.push('Focus su velocità pura');
    }

    setTrainingPlan(prev => ({
      ...prev,
      adaptations,
      week: prev.week + 1,
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFeedbackIcon = (type: CoachFeedback['type']) => {
    switch (type) {
      case 'technique':
        return 'wrench.and.screwdriver.fill';
      case 'performance':
        return 'chart.line.uptrend.xyaxis';
      case 'safety':
        return 'exclamationmark.triangle.fill';
      case 'motivation':
        return 'bolt.fill';
      case 'strategy':
        return 'brain.head.profile';
    }
  };

  const getFeedbackColor = (priority: CoachFeedback['priority']) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Coach Virtuale AI',
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
            colors={gradients.blue}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <Text style={styles.coachAvatar}>{selectedCoach.avatar}</Text>
            </View>
            <Text style={styles.headerTitle}>{selectedCoach.name}</Text>
            <Text style={styles.headerDescription}>
              {selectedCoach.specialty} • {selectedCoach.experience}
            </Text>
            <Text style={styles.headerSubtitle}>
              Feedback AI personalizzato con analisi predittiva
            </Text>
          </LinearGradient>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable
              style={styles.quickActionButton}
              onPress={() => setShowVoiceSettings(true)}
            >
              <IconSymbol 
                name={voiceEnabled ? 'speaker.wave.3.fill' : 'speaker.slash.fill'} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.quickActionText}>Audio</Text>
            </Pressable>
            <Pressable
              style={styles.quickActionButton}
              onPress={() => setShowPlanModal(true)}
            >
              <IconSymbol name="calendar" size={20} color={colors.accent} />
              <Text style={styles.quickActionText}>Piano</Text>
            </Pressable>
            <Pressable
              style={styles.quickActionButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Statistiche', 'Visualizza le tue statistiche complete');
              }}
            >
              <IconSymbol name="chart.bar.fill" size={20} color={colors.success} />
              <Text style={styles.quickActionText}>Stats</Text>
            </Pressable>
          </View>

          {/* Session Control */}
          {!isSessionActive ? (
            <Pressable style={styles.startButton} onPress={startSession}>
              <LinearGradient
                colors={gradients.racing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startButtonGradient}
              >
                <IconSymbol name="play.circle.fill" size={48} color="#FFFFFF" />
                <View style={styles.startButtonContent}>
                  <Text style={styles.startButtonText}>Inizia Sessione</Text>
                  <Text style={styles.startButtonSubtext}>Con feedback AI real-time</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ) : (
            <View style={[commonStyles.card, styles.activeSessionCard]}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionStatus}>
                  <View style={styles.liveIndicator} />
                  <Text style={styles.liveText}>SESSIONE ATTIVA</Text>
                </View>
                <Text style={styles.sessionDuration}>{formatDuration(sessionDuration)}</Text>
              </View>

              {/* Real-time Metrics */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <IconSymbol name="heart.fill" size={24} color={colors.error} />
                  <Text style={styles.metricValue}>{metrics.heartRate}</Text>
                  <Text style={styles.metricLabel}>BPM</Text>
                </View>
                <View style={styles.metricCard}>
                  <IconSymbol name="speedometer" size={24} color={colors.primary} />
                  <Text style={styles.metricValue}>{metrics.speed}</Text>
                  <Text style={styles.metricLabel}>km/h</Text>
                </View>
                <View style={styles.metricCard}>
                  <IconSymbol name="timer" size={24} color={colors.accent} />
                  <Text style={styles.metricValue}>{metrics.lapTime}</Text>
                  <Text style={styles.metricLabel}>Giro</Text>
                </View>
              </View>

              {/* AI Performance Indicators */}
              <View style={styles.indicatorsSection}>
                <View style={styles.indicator}>
                  <View style={styles.indicatorHeader}>
                    <Text style={styles.indicatorLabel}>Consistenza</Text>
                    <Text style={styles.indicatorValue}>{Math.round(metrics.consistency)}%</Text>
                  </View>
                  <View style={styles.indicatorBar}>
                    <View
                      style={[
                        styles.indicatorBarFill,
                        {
                          width: `${metrics.consistency}%`,
                          backgroundColor: colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.indicator}>
                  <View style={styles.indicatorHeader}>
                    <Text style={styles.indicatorLabel}>Tecnica</Text>
                    <Text style={styles.indicatorValue}>{Math.round(metrics.technique)}%</Text>
                  </View>
                  <View style={styles.indicatorBar}>
                    <View
                      style={[
                        styles.indicatorBarFill,
                        {
                          width: `${metrics.technique}%`,
                          backgroundColor: colors.accent,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.indicator}>
                  <View style={styles.indicatorHeader}>
                    <Text style={styles.indicatorLabel}>Focus</Text>
                    <Text style={styles.indicatorValue}>{Math.round(metrics.focus)}%</Text>
                  </View>
                  <View style={styles.indicatorBar}>
                    <View
                      style={[
                        styles.indicatorBarFill,
                        {
                          width: `${metrics.focus}%`,
                          backgroundColor: metrics.focus > 80 ? colors.success : metrics.focus > 60 ? colors.warning : colors.error,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.indicator}>
                  <View style={styles.indicatorHeader}>
                    <Text style={styles.indicatorLabel}>Affaticamento</Text>
                    <Text style={styles.indicatorValue}>{Math.round(metrics.fatigue)}%</Text>
                  </View>
                  <View style={styles.indicatorBar}>
                    <View
                      style={[
                        styles.indicatorBarFill,
                        {
                          width: `${metrics.fatigue}%`,
                          backgroundColor:
                            metrics.fatigue > 70
                              ? colors.error
                              : metrics.fatigue > 40
                              ? colors.warning
                              : colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <Pressable style={styles.stopButton} onPress={stopSession}>
                <IconSymbol name="stop.circle.fill" size={20} color="#FFFFFF" />
                <Text style={styles.stopButtonText}>Termina Sessione</Text>
              </Pressable>
            </View>
          )}

          {/* AI Features */}
          <View style={[commonStyles.card, styles.featuresCard]}>
            <Text style={styles.sectionTitle}>Funzionalità AI Avanzate</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconSymbol name="brain.head.profile" size={20} color={colors.purple} />
                <Text style={styles.featureText}>Analisi predittiva performance</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="waveform.path.ecg" size={20} color={colors.error} />
                <Text style={styles.featureText}>Monitoraggio biometrico real-time</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.primary} />
                <Text style={styles.featureText}>Feedback contestuale intelligente</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="speaker.wave.3.fill" size={20} color={colors.accent} />
                <Text style={styles.featureText}>Coaching vocale personalizzato</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="calendar.badge.clock" size={20} color={colors.warning} />
                <Text style={styles.featureText}>Piano allenamento adattivo</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="shield.checkered" size={20} color={colors.success} />
                <Text style={styles.featureText}>Sistema allerta sicurezza</Text>
              </View>
            </View>
          </View>

          {/* Feedback History */}
          {feedbackHistory.length > 0 && (
            <>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionHeader}>Cronologia Feedback ({feedbackHistory.length})</Text>
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setFeedbackHistory([]);
                  }}
                >
                  <IconSymbol name="trash.fill" size={16} color={colors.error} />
                  <Text style={styles.clearButtonText}>Pulisci</Text>
                </Pressable>
              </View>
              {feedbackHistory.slice(0, 10).map((feedback) => (
                <View key={feedback.id} style={[commonStyles.card, styles.feedbackCard]}>
                  <View style={styles.feedbackHeader}>
                    <View
                      style={[
                        styles.feedbackIcon,
                        { backgroundColor: getFeedbackColor(feedback.priority) + '20' },
                      ]}
                    >
                      <IconSymbol
                        name={getFeedbackIcon(feedback.type) as any}
                        size={20}
                        color={getFeedbackColor(feedback.priority)}
                      />
                    </View>
                    <View style={styles.feedbackContent}>
                      <View style={styles.feedbackMeta}>
                        <Text style={styles.feedbackCategory}>{feedback.category}</Text>
                        <Text style={styles.feedbackTime}>{feedback.timestamp}</Text>
                      </View>
                      <Text style={styles.feedbackMessage}>{feedback.message}</Text>
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getFeedbackColor(feedback.priority) },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
            <Text style={styles.infoText}>
              Il Coach Virtuale AI analizza i tuoi dati in tempo reale utilizzando algoritmi di 
              machine learning per fornire feedback personalizzato, adattare il piano di allenamento 
              e ottimizzare tecnica, performance e sicurezza.
            </Text>
          </View>
        </ScrollView>

        {/* Feedback Modal */}
        <Modal
          visible={showFeedbackModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowFeedbackModal(false)}
        >
          <View style={styles.modalOverlay}>
            {currentFeedback && (
              <Pressable
                style={[
                  styles.feedbackModal,
                  { borderLeftColor: getFeedbackColor(currentFeedback.priority) },
                ]}
                onPress={() => setShowFeedbackModal(false)}
              >
                <View style={styles.modalIcon}>
                  <IconSymbol
                    name={getFeedbackIcon(currentFeedback.type) as any}
                    size={32}
                    color={getFeedbackColor(currentFeedback.priority)}
                  />
                </View>
                <View style={styles.modalContent}>
                  <Text style={styles.modalCategory}>{currentFeedback.category}</Text>
                  <Text style={styles.modalMessage}>{currentFeedback.message}</Text>
                </View>
              </Pressable>
            )}
          </View>
        </Modal>

        {/* Voice Settings Modal */}
        <Modal
          visible={showVoiceSettings}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowVoiceSettings(false)}
        >
          <View style={styles.settingsModalOverlay}>
            <View style={styles.settingsModal}>
              <Text style={styles.settingsTitle}>Impostazioni Audio</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Feedback Vocale</Text>
                <Pressable
                  style={[styles.toggle, voiceEnabled && styles.toggleActive]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setVoiceEnabled(!voiceEnabled);
                  }}
                >
                  <View style={[styles.toggleThumb, voiceEnabled && styles.toggleThumbActive]} />
                </Pressable>
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Frequenza Feedback</Text>
                <View style={styles.frequencyButtons}>
                  {(['low', 'medium', 'high'] as const).map((freq) => (
                    <Pressable
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        feedbackFrequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setFeedbackFrequency(freq);
                      }}
                    >
                      <Text
                        style={[
                          styles.frequencyButtonText,
                          feedbackFrequency === freq && styles.frequencyButtonTextActive,
                        ]}
                      >
                        {freq === 'low' ? 'Bassa' : freq === 'medium' ? 'Media' : 'Alta'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                style={styles.settingsCloseButton}
                onPress={() => setShowVoiceSettings(false)}
              >
                <Text style={styles.settingsCloseButtonText}>Chiudi</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Training Plan Modal */}
        <Modal
          visible={showPlanModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPlanModal(false)}
        >
          <View style={styles.settingsModalOverlay}>
            <View style={styles.settingsModal}>
              <Text style={styles.settingsTitle}>Piano Allenamento Adattivo</Text>
              
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planWeek}>Settimana {trainingPlan.week}</Text>
                  <Text style={styles.planFocus}>{trainingPlan.focus}</Text>
                </View>

                <View style={styles.planSection}>
                  <Text style={styles.planSectionTitle}>Obiettivi</Text>
                  {trainingPlan.goals.map((goal, index) => (
                    <View key={index} style={styles.planItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                      <Text style={styles.planItemText}>{goal}</Text>
                    </View>
                  ))}
                </View>

                {trainingPlan.adaptations.length > 0 && (
                  <View style={styles.planSection}>
                    <Text style={styles.planSectionTitle}>Adattamenti AI</Text>
                    {trainingPlan.adaptations.map((adaptation, index) => (
                      <View key={index} style={styles.planItem}>
                        <IconSymbol name="sparkles" size={16} color={colors.purple} />
                        <Text style={styles.planItemText}>{adaptation}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <Pressable
                style={styles.settingsCloseButton}
                onPress={() => setShowPlanModal(false)}
              >
                <Text style={styles.settingsCloseButtonText}>Chiudi</Text>
              </Pressable>
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
    marginBottom: 20,
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
  coachAvatar: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    ...shadows.small,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  startButton: {
    marginBottom: 24,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderRadius: 20,
    padding: 28,
    ...shadows.medium,
  },
  startButtonContent: {
    alignItems: 'flex-start',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  startButtonSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activeSessionCard: {
    marginBottom: 24,
    backgroundColor: colors.highlightGreen,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.error,
    letterSpacing: 0.5,
  },
  sessionDuration: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  indicatorsSection: {
    gap: 14,
    marginBottom: 20,
  },
  indicator: {
    gap: 8,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  indicatorBar: {
    height: 10,
    backgroundColor: colors.card,
    borderRadius: 5,
    overflow: 'hidden',
  },
  indicatorBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: 18,
  },
  stopButtonText: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
  feedbackCard: {
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackCategory: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feedbackTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  feedbackMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  priorityBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  feedbackModal: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 6,
    ...shadows.large,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  settingsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsModal: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.success,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  frequencyButtonTextActive: {
    color: '#FFFFFF',
  },
  settingsCloseButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  settingsCloseButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  planHeader: {
    marginBottom: 20,
  },
  planWeek: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  planFocus: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  planSection: {
    marginBottom: 16,
  },
  planSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  planItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
