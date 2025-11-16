import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@moto3_custom_mobility';

// MOBILITÀ ARTICOLARE COMPLETA 20 MINUTI
const MOBILITY_EXERCISES = [
  {
    id: 'cervical-cars',
    name: 'Cervical CARs (Collo)',
    zone: 'Cervicale',
    duration: 180, // 3 minuti
    completed: false,
    description: `TIMING: 3 minuti

QUANDO INTRODURRE:
• Settimane 1-4: NO CARs (focus base)
• Settimana 5+: INTRODUCE gradualmente
• Frequenza: 3×/settimana → 5-6×/settimana (daily)

SETUP & SAFETY:
• Posizione: Seduto o in piedi, postura perfetta
• Core: Engaged (torso STABILE)
• Velocità: ULTRA-SLOW (10"/rep minimum)
• ROM: Max pain-free (NO forcing)
• Red flags: Vertigini, nausea, dolore sharp = STOP

═════════════════════════════════════
MOVIMENTO 1: FLEXION-EXTENSION | 2×8
═════════════════════════════════════

Flexion:
• Chin towards chest (slow 5")
• Max ROM comfortable
• NO shrug spalle (depress)
• Pause 2" end-range

Extension:
• Gaze upward ceiling (slow 5")
• Max ROM comfortable
• NO compression feeling
• Pause 2" end-range

Respirazione: Espira durante movimento
Focus: Cervical segmentation
Tempo: ~80"

═════════════════════════════════════
MOVIMENTO 2: LATERAL FLEXION | 2×8/lato
═════════════════════════════════════

Lato DX:
• Ear towards shoulder DX (slow 5")
• NO shrug shoulder (depress)
• NO rotation (pure lateral)
• Max ROM comfortable
• Pause 2" end

Lato SX: Repeat opposto
Focus: Lateral flexors stretch
Tempo: ~80"

═════════════════════════════════════
MOVIMENTO 3: ROTATION | 2×8/lato
═════════════════════════════════════

Rotation DX:
• Turn head DX (chin over shoulder)
• Slow 5" controlled
• Torso: FIXED (NO twist trunk)
• Max ROM
• Pause 2"

Rotation SX: Repeat
Target: ~80-90° bilaterale
Tempo: ~80"

═════════════════════════════════════
MOVIMENTO 4: FULL CARs | 2×3/direzione
═════════════════════════════════════

Clockwise:
• Start: Flexion (chin down)
• Rotate DX mentre estendi
• Extension (gaze up)
• Rotate SX mentre fletti
• Return flexion
• Movimento circolare SLOW, fluido

Counter-clockwise: Opposite direction

Velocità: 12-15" per CAR completo
Focus: Capsular end-range ogni direzione
Tempo: ~80"

PROGRESSIONE:
• Settimane 5-6: 1×6 reps, 70-80% ROM
• Settimane 7-9: 2×6 reps, 85-90% ROM
• Settimane 10+: 2×8 reps, 90-95% ROM`
  },
  {
    id: 'scapular-circles',
    name: 'Scapular Circles',
    zone: 'Scapole & Spalle',
    duration: 100, // ~2 minuti
    completed: false,
    description: `TIMING: ~2 minuti

SETUP:
• Posizione: In piedi o seduto, postura neutra
• Focus: Movimento puro scapolare (NO trunk)

ESECUZIONE:
• Circle scapole SLOW, massimo ROM
• Sequenza: Elevation → Retraction → Depression → Protraction
• 10× clockwise
• 10× counterclockwise

VELOCITÀ: 5" per circle (ultra-slow)

TARGET:
• Scapulothoracic mobility
• Dissociazione scapola da tronco
• Range completo in tutte le direzioni

FOCUS:
• Movimento fluido e controllato
• Massima escursione articolare
• Zero compenso trunk/lombare

BENEFICIO:
Migliora controllo scapolare essenziale per upper body strength e shoulder health.`
  },
  {
    id: 'shoulder-cars',
    name: 'Shoulder CARs',
    zone: 'Scapole & Spalle',
    duration: 120, // 2 minuti
    completed: false,
    description: `TIMING: 2 minuti

SETUP: In piedi, core stable

ESECUZIONE: 2×5 per lato

Fase 1 - Flexion:
• Braccio DX: Solleva davanti (sagittal plane)
• Overhead completo (180° se possibile)
• Palm facing in

Fase 2 - External Rotation:
• Rotate arm externally (thumb back)
• Mantieni overhead

Fase 3 - Extension:
• Arc braccio laterale-dietro
• Scendi in extension (shoulder behind body)

Fase 4 - Internal Rotation + Return:
• Rotate internally
• Return start via side

VELOCITÀ: 8-10" per CAR completo

FOCUS:
• MASSIMO ROM ogni fase
• NO compenso trunk (core locked)
• Movimento controllato e deliberato

ERRORI DA EVITARE:
× Velocità eccessiva
× Trunk rotation per compensare
× Riduzione ROM per facilità

BENEFICIO:
Comprehensive shoulder capsule mobility - critico per overhead movements e shoulder health.`
  },
  {
    id: 'thoracic-rotation',
    name: 'Quadruped Thoracic Rotation',
    zone: 'Thoracic Spine',
    duration: 90, // ~1.5 minuti
    completed: false,
    description: `TIMING: ~90"

SETUP: Quadrupedia, mano DX dietro testa

ESECUZIONE: 2×10 per lato

Movimento:
• Rotate torace DX (gomito verso soffitto)
• Max rotation thoracic (T1-T12)
• Lumbar: LOCKED (NO rotazione lombare)
• Pause 2" top
• Return, repeat

RESPIRAZIONE: Espira durante rotation

FOCUS CRITICO:
• Mobilità SOLO toracica
• Lombare completamente bloccata
• Massima rotazione T-spine

ERRORE COMUNE:
× Lombare rotate (STOP questo)
× Movimento trunk intero
× Velocità eccessiva

TEST PROPRIOCEZIONE:
"Sento rotazione SOLO tra scapole?"
→ SI = corretto
→ NO = stai compensando con lombare

BENEFICIO:
Mobilità toracica essenziale per posture guida e prevenzione dolore lombare compensatorio.`
  },
  {
    id: 'cat-camel-segmental',
    name: 'Cat-Camel Segmentale',
    zone: 'Thoracic Spine',
    duration: 90, // ~1.5 minuti
    completed: false,
    description: `TIMING: ~90"

SETUP: Quadrupedia

ESECUZIONE: 1×20 reps ultra-slow

SEQUENZA CAT (Flessione):
• Start: Cervicale flette
• Poi: Toracica alta
• Poi: Toracica bassa
• Infine: Lombare (minimal)

SEQUENZA COW (Estensione):
• Reverse sequence
• Lombare prima (minimal)
• Toracica bassa
• Toracica alta
• Cervicale per ultima

VELOCITÀ: 6-8" per rep (ultra-slow)

FOCUS:
• Segmentazione movimento colonna
• Vertebra per vertebra awareness
• Dissociazione segmenti spinali

RESPIRAZIONE:
• Espira durante CAT
• Inspira durante COW

BENEFICIO:
Sviluppa propriocezione segmentale spinale e migliora controllo dissociato delle regioni vertebrali.

NOTA PER IPERLORDOSI:
• Enfasi CAT (retroversione)
• COW moderata (evita iperestensione lombare)`
  },
  {
    id: 'hip-90-90',
    name: 'Hip 90-90 Transitions',
    zone: 'Anche',
    duration: 120, // 2 minuti
    completed: false,
    description: `TIMING: 2 minuti

SETUP: Seduto, gamba anteriore 90° external rotation

ESECUZIONE: 2×10 transitions

Movimento:
• Start: 90-90 DX (gamba dx davanti)
• Transition: Lift hips, rotate, 90-90 SX
• Fluido, controllato
• 10× transitions complete

FOCUS:
• Hip internal + external rotation
• Multi-planar hip mobility
• Controllo durante transizione

TECNICA:
• Entrambe ginocchia 90°
• Piedi aligned con ginocchia
• Torso upright (no slouch)
• Smooth transition (no jerking)

RESPIRAZIONE: Espira durante lift/rotation

BENEFICIO:
Eccezionale per mobility anca multi-planare, essenziale per trasferimenti peso rapidi su moto.

DIFFICOLTÀ:
Se impossibile 90-90 iniziale:
→ Reduce angle a 60-70°
→ Progressione graduale verso 90°`
  },
  {
    id: 'hip-cars',
    name: 'Hip CARs',
    zone: 'Anche',
    duration: 150, // ~2.5 minuti
    completed: false,
    description: `TIMING: ~2.5 minuti

SETUP: In piedi, appoggio muro

ESECUZIONE: 2×5 per gamba

SEQUENZA COMPLETA:

Fase 1 - Flexion:
• Solleva ginocchio 90° davanti

Fase 2 - Abduction:
• Apri gamba laterale (mantenendo 90° knee)

Fase 3 - External Rotation:
• Rotate anca out

Fase 4 - Extension:
• Estendi gamba dietro

Fase 5 - Adduction + Return:
• Porta gamba mediale
• Return start

VELOCITÀ: 8" per CAR completo

FOCUS:
• Capsular end-range ogni direzione
• Hip joint isolation (non spinal compensation)
• Massimo ROM confortevole

CONTROLLO:
• Bacino STABILE (no tilt)
• Standing leg locked
• Smooth transitions

BENEFICIO:
Comprehensive hip capsule mobility - fondamentale per hanging off e weight transfers su moto.`
  },
  {
    id: 'ankle-cars',
    name: 'Ankle CARs',
    zone: 'Caviglie',
    duration: 120, // 2 minuti
    completed: false,
    description: `TIMING: 2 minuti

SETUP: Seduto o in piedi (single-leg balance)

ESECUZIONE: 2×8 per piede

SEQUENZA:
• Plantarflexion max (point toes)
• Inversion (sole mediale)
• Dorsiflexion max (pull toes up)
• Eversion (sole laterale)
• Circle completo, max ROM

VELOCITÀ: 6" per CAR

FOCUS:
• Ankle joint capsule mobility
• Non solo gastrocnemius/soleus stretch
• Movimento deliberato ogni direzione

PROGRESSIONE:
• Seduto (più facile): Supporto completo
• Standing (difficile): Single-leg balance
  → Aggiunge proprioception challenge

BENEFICIO:
Ankle mobility critica per:
• Rear-set pegs control
• Brake/shift precision
• Landing stability (possibili crashes)

NOTA:
Se history ankle sprains → extra attenzione eversion, progressione graduale.`
  },
  {
    id: 'wrist-cars',
    name: 'Wrist CARs',
    zone: 'Wrists & Fingers',
    duration: 90, // ~1.5 minuti
    completed: false,
    description: `TIMING: ~1.5 minuti

SETUP: Avambraccio supportato, mano libera

ESECUZIONE: 2×8 per polso

SEQUENZA:
• Extension max
• Radial deviation
• Flexion max
• Ulnar deviation
• Circle completo

VELOCITÀ: Controllata, 6" per circle

FOCUS:
• Wrist capsule mobility
• Importante per grip sport (throttle control)
• Range completo tutte direzioni

VARIANTE PRO:
Con light dumbbell (0.5-1kg):
→ Aumenta range e attivazione
→ Prep per wrist strength work

BENEFICIO:
Wrist mobility essenziale per:
• Throttle control endurance
• Brake lever precision
• Vibration dampening
• Prevenzione overuse injuries

NOTA:
Se dolore wrist durante sessioni → priorità questo esercizio daily.`
  },
  {
    id: 'finger-flossing',
    name: 'Finger Flossing',
    zone: 'Wrists & Fingers',
    duration: 30, // 30 secondi
    completed: false,
    description: `TIMING: 30 secondi

SETUP: Mani davanti

ESECUZIONE: 1×20 reps veloci

Movimento:
• Close fist tight (squeeze)
• Open fingers extension max (spread)
• 20× reps veloci
• Focus: Propriocezione digitale

VELOCITÀ: Rapida, 1-2"/rep

FOCUS:
• Massima contrazione fist
• Massima extension spread
• Velocità controllata

BENEFICIO:
• Grip prep
• Finger mobility
• Propriocezione digitale
• Blood flow mani

UTILIZZO STRATEGICO:
• Pre-allenamento grip work
• Pre-sessione moto
• Durante pause lunghe seduta

SEMPLICE MA EFFICACE:
Non sottovalutare - finger proprioception critica per fine motor control su moto (throttle, brake, clutch).`
  },
  {
    id: 'worlds-greatest',
    name: 'World\'s Greatest Stretch Flow',
    zone: 'Full-Body Integration',
    duration: 60, // 1 minuto
    completed: false,
    description: `TIMING: 1 minuto

SETUP: In piedi

ESECUZIONE: 2×5 per lato flow continuo

SEQUENZA COMPLETA:

1. Lunge profondo DX
• Ginocchio posteriore terra
• Torso verticale

2. Gomito interno terra (hip opener)
• Gomito DX verso terra (inside gamba DX)
• Stretch hip flexor + adductor

3. Rotation toracica, braccio cielo
• Rotate torace DX
• Braccio DX verso cielo
• Sguardo segue mano

4. Extend gamba posteriore (hamstring)
• Straighten gamba anteriore
• Hamstring stretch gamba DX

5. Return stand, ripeti SX
• Alzati fluido
• Opposite side

VELOCITÀ: Controllata, fluida, NO rushing

FOCUS:
• Full-chain mobility integration
• Hip + thoracic + hamstring
• Transizioni smooth

RESPIRAZIONE: Profonda, espira during stretches

BENEFICIO:
Il "king" degli stretches dinamici:
• Multi-planar
• Full-body integration
• Functional mobility
• Perfetto pre-workout

NOME:
Chiamato "World's Greatest Stretch" per una ragione - probabilmente il singolo esercizio mobilità più completo esistente.`
  }
];

export default function MobilityScreen() {
  const [exercises, setExercises] = useState(MOBILITY_EXERCISES);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<typeof MOBILITY_EXERCISES[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedCompleted = JSON.parse(stored);
        setCompletedExercises(storedCompleted);
      }
    } catch (error) {
      console.log('Error loading mobility exercises:', error);
    }
  };

  const saveProgress = async (completed: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  const toggleExercise = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let newCompleted: string[];
    if (completedExercises.includes(id)) {
      newCompleted = completedExercises.filter(e => e !== id);
    } else {
      newCompleted = [...completedExercises, id];
    }
    setCompletedExercises(newCompleted);
    saveProgress(newCompleted);
  };

  const resetProgress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCompletedExercises([]);
    saveProgress([]);
  };

  const showDetails = (exercise: typeof MOBILITY_EXERCISES[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const progress = (completedCount / totalCount) * 100;
  const totalMinutes = Math.floor(exercises.reduce((sum, ex) => sum + ex.duration, 0) / 60);

  // Group by zone
  const groupedExercises = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.zone]) {
      acc[exercise.zone] = [];
    }
    acc[exercise.zone].push(exercise);
    return acc;
  }, {} as Record<string, typeof MOBILITY_EXERCISES>);

  const zones = Object.keys(groupedExercises);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mobilità Articolare',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="figure.flexibility" size={52} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Mobilità Articolare</Text>
            <Text style={styles.headerSubtitle}>Protocollo Head-to-Toe Completo</Text>
            
            <View style={styles.headerBadges}>
              <View style={styles.headerBadge}>
                <IconSymbol name="clock.fill" size={16} color="#FFFFFF" />
                <Text style={styles.headerBadgeText}>{totalMinutes} minuti</Text>
              </View>
              <View style={styles.headerBadge}>
                <IconSymbol name="calendar" size={16} color="#FFFFFF" />
                <Text style={styles.headerBadgeText}>1-2×/settimana</Text>
              </View>
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
                {completedCount} di {totalCount} esercizi • {Math.round(progress)}%
              </Text>
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={styles.infoHeader}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.infoIconGradient}
              >
                <IconSymbol name="info.circle.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.infoTitle}>Protocollo Mobilità Completa</Text>
            </View>
            <Text style={styles.infoText}>
              Sequenza head-to-toe (testa ai piedi) per mantenimento ROM articolare completo. 
              CARs (Controlled Articular Rotations) per ogni articolazione principale.
            </Text>
            <View style={styles.usageList}>
              <View style={styles.usageItem}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#667eea" />
                <Text style={styles.usageText}>Giorni OFF allenamento</Text>
              </View>
              <View style={styles.usageItem}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#667eea" />
                <Text style={styles.usageText}>Deload weeks</Text>
              </View>
              <View style={styles.usageItem}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#667eea" />
                <Text style={styles.usageText}>Post-viaggio (immobilità prolungata)</Text>
              </View>
              <View style={styles.usageItem}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#667eea" />
                <Text style={styles.usageText}>Rigidità generale {'>'} 4/10</Text>
              </View>
            </View>
          </View>

          {/* Exercises by Zone */}
          {zones.map((zone, zoneIndex) => (
            <View key={zone} style={styles.zoneSection}>
              <View style={styles.zoneHeader}>
                <View style={styles.zoneNumberBadge}>
                  <Text style={styles.zoneNumberText}>{zoneIndex + 1}</Text>
                </View>
                <Text style={styles.zoneTitle}>{zone}</Text>
                {completedExercises.length > 0 && (
                  <Pressable onPress={resetProgress} style={styles.resetButton}>
                    <IconSymbol name="arrow.clockwise" size={18} color={colors.primary} />
                  </Pressable>
                )}
              </View>

              {groupedExercises[zone].map((exercise, index) => {
                const isCompleted = completedExercises.includes(exercise.id);
                const overallIndex = exercises.findIndex(e => e.id === exercise.id);

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
                          <Text style={styles.exerciseNumberText}>{overallIndex + 1}</Text>
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
                        <View style={styles.detailBadge}>
                          <IconSymbol name="clock.fill" size={14} color="#667eea" />
                          <Text style={styles.detailText}>
                            {exercise.duration >= 60 
                              ? `${Math.floor(exercise.duration / 60)} min` 
                              : `${exercise.duration} sec`}
                          </Text>
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
          ))}

          {/* Guidelines Card */}
          <View style={[commonStyles.card, styles.guidelinesCard]}>
            <View style={styles.guidelinesHeader}>
              <LinearGradient
                colors={gradients.warning}
                style={styles.guidelinesIconGradient}
              >
                <IconSymbol name="lightbulb.fill" size={22} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.guidelinesTitle}>Principi Esecuzione</Text>
            </View>
            <View style={styles.guidelinesList}>
              {[
                'Velocità ULTRA-SLOW: 10" minimum per rep CARs',
                'ROM massimo confortevole (NO forcing oltre dolore)',
                'Core sempre engaged (stabilità trunk)',
                'Respirazione profonda e controllata',
                'Focus: Movimento articolare puro (no compensation)',
                'Se dolore sharp o vertigini: STOP immediato',
              ].map((guideline, index) => (
                <View key={index} style={styles.guidelineItem}>
                  <View style={styles.guidelineBullet}>
                    <View style={styles.guidelineBulletInner} />
                  </View>
                  <Text style={styles.guidelineText}>{guideline}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Complete Button */}
          <Pressable 
            style={[
              styles.completeButton,
              completedCount === totalCount && styles.completeButtonActive,
            ]}
            disabled={completedCount !== totalCount}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          >
            <LinearGradient
              colors={completedCount === totalCount ? gradients.success : ['#9CA3AF', '#6B7280']}
              style={styles.completeButtonGradient}
            >
              <IconSymbol 
                name={completedCount === totalCount ? "checkmark.seal.fill" : "circle"} 
                size={28} 
                color="#FFFFFF" 
              />
              <Text style={styles.completeButtonText}>
                {completedCount === totalCount ? 'Sessione Completata!' : `Completa ${totalCount - completedCount} rimanenti`}
              </Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
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
              <Text style={styles.modalDescription}>
                {selectedExercise?.description || 'Nessuna descrizione disponibile.'}
              </Text>
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  headerBadgeText: {
    fontSize: 13,
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
    borderLeftColor: '#667eea',
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
  usageList: {
    gap: 10,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  usageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  zoneSection: {
    marginBottom: 20,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  zoneNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  zoneNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  zoneTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  resetButton: {
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    ...shadows.small,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...shadows.small,
  },
  exerciseNumberText: {
    fontSize: 13,
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
    backgroundColor: colors.highlightGold,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
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
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelineBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  guidelineBulletInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  completeButtonActive: {
    ...shadows.large,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
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
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
}); 