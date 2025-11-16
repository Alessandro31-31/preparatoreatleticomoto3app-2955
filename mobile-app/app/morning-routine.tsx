
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, commonStyles, shadows } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@morning_routine_progress';

interface RoutineItem {
  id: string;
  title: string;
  time: number;
  completed: boolean;
  category: string;
  sets: string;
  description: string;
}

const MOBILITY_12MIN_ROUTINE: RoutineItem[] = [
  {
    id: 'cat-cow',
    title: 'Cat-Cow',
    time: 90,
    completed: false,
    category: 'mobilità',
    sets: '2×15 reps',
    description: `TIMING: 90 secondi totali | 3" per fase

SETUP:
• Posizione quadrupedia
• Mani larghezza spalle, ginocchia larghezza anche
• Schiena neutra iniziale

ESECUZIONE:
COW (Estensione):
• INSPIRA 3": Pancia giù, petto avanti, testa su
• Focus mobilità TORACICA (NO iperestensione lombare)

CAT (Flessione):
• ESPIRA 3": Retroversione MASSIMA, schiena arco
• Ombelico verso colonna, glutei squeeze
• Testa verso ombelico

RESPIRAZIONE:
Box 4-0-4: Inspira 3" nasale, espira 3" bocca

FOCUS:
• Retroversione CAT massimale (obiettivo primario)
• Movimento fluido vertebra per vertebra
• Velocità costante 3" per fase`
  },
  {
    id: 'childs-pose',
    title: "Child's Pose",
    time: 90,
    completed: false,
    category: 'mobilità',
    sets: '2×45"',
    description: `TIMING: 90 secondi totali | 2×45" hold

SETUP:
• Seduto su talloni
• Braccia estese avanti
• Fronte a terra
• Glutei cercano talloni

ESECUZIONE:
• Hold statico 45"
• Respirazione Box 4-2-4
• Ogni espira: Sink più profondo
• Focus decompressione lombare`
  },
  {
    id: 'glute-bridge',
    title: 'Glute Bridge',
    time: 90,
    completed: false,
    category: 'mobilità',
    sets: '2×12 reps',
    description: `TIMING: 90 secondi totali | Hold 2" per rep

SETUP:
• Supino, piedi vicino glutei
• Ginocchia 90°
• Schiena PIATTA

ESECUZIONE:
FASE 1 - Retroversione PRE-movimento
FASE 2 - Salita (2"): Glutei guidano
FASE 3 - Hold top (2"): Glutei squeeze MASSIMO
FASE 4 - Discesa (2"): Controllato

FOCUS:
• Glutei attivazione 9/10
• Lombari OFF (deprogrammazione estensori)
• Retroversione costante`
  },
  {
    id: 'psoas-stretch',
    title: 'Psoas Stretch',
    time: 160,
    completed: false,
    category: 'mobilità',
    sets: '2×40"/lato',
    description: `TIMING: 160 secondi totali | 40" per lato × 2 serie

SETUP:
• Affondo, ginocchio posteriore a terra
• Torso VERTICALE
• Retroversione attiva

ESECUZIONE:
• Spingi bacino AVANTI e BASSO
• Mantieni retroversione (CRITICO!)
• Hold 40" con respirazione 4-2-4

FOCUS:
• Psoas stretch gamba posteriore
• Retroversione ATTIVA
• Intensità 6-7/10`
  },
  {
    id: 'plank-hold',
    title: 'Plank Hold',
    time: 125,
    completed: false,
    category: 'core',
    sets: '2×40" rec 45"',
    description: `TIMING: 125 secondi totali | 2×40" + recupero 45"

SETUP:
• Avambracci, gomiti sotto spalle
• Corpo linea retta
• Piedi larghezza anche

ESECUZIONE:
FASE 1 - Attivazione:
• Retroversione bacino MASSIMA
• Glutei squeeze 9/10
• POI solleva ginocchia

FASE 2 - Hold 40":
• Retroversione LOCKED
• Glutei costanti 8-9/10
• Respirazione Box 4-2-4

STOP SE:
• Lombare estende → STOP immediato`
  },
  {
    id: 'dead-bug',
    title: 'Dead Bug',
    time: 100,
    completed: false,
    category: 'core',
    sets: '2×8/lato rec 45"',
    description: `TIMING: 100 secondi totali | 2×8 per lato + recupero 45"

SETUP:
• Supino, schiena PIATTA
• Ginocchia 90°, braccia estese su

ESECUZIONE:
• INSPIRA: Setup lombare piatta
• ESPIRA 4": Extend braccio DX + gamba SX
• Lombare RESTA PIATTA (critico)
• INSPIRA: Return

FOCUS:
• Dissociazione anca-colonna
• Lombare piatta 100% reps
• Espirazione forzata`
  },
  {
    id: 'bird-dog',
    title: 'Bird Dog',
    time: 125,
    completed: false,
    category: 'core',
    sets: '2×6/lato rec 45"',
    description: `TIMING: 125 secondi totali | 2×6 per lato + recupero 45"

SETUP:
• Quadrupedia
• Schiena neutra PIATTA
• Core pre-attivato

ESECUZIONE:
FASE 1 - Extend (4"): Simultaneo braccio + gamba opposta
FASE 2 - Hold (2"): Linea retta
FASE 3 - Return (4"): Controllato

FOCUS:
• Schiena RIGIDA
• Stabilità anti-rotazione
• Controllo massimo`
  }
];

export default function MorningRoutineScreen() {
  const [routine, setRoutine] = useState<RoutineItem[]>(MOBILITY_12MIN_ROUTINE);
  const [selectedItem, setSelectedItem] = useState<RoutineItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = MOBILITY_12MIN_ROUTINE.map(defaultItem => {
          const storedItem = parsed.find((item: RoutineItem) => item.id === defaultItem.id);
          return storedItem ? { ...defaultItem, completed: storedItem.completed } : defaultItem;
        });
        setRoutine(merged);
      }
    } catch (error) {
      console.log('Error loading routine:', error);
    }
  };

  const saveRoutine = async (newRoutine: RoutineItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRoutine));
    } catch (error) {
      console.log('Error saving routine:', error);
    }
  };

  const toggleItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newRoutine = routine.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setRoutine(newRoutine);
    saveRoutine(newRoutine);
  };

  const resetRoutine = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const resetRoutine = routine.map(item => ({ ...item, completed: false }));
    setRoutine(resetRoutine);
    saveRoutine(resetRoutine);
  };

  const completedCount = routine.filter(item => item.completed).length;
  const progress = (completedCount / routine.length) * 100;
  const totalMinutes = Math.floor(routine.reduce((sum, item) => sum + item.time, 0) / 60);

  const mobilityExercises = routine.filter(item => item.category === 'mobilità');
  const coreExercises = routine.filter(item => item.category === 'core');

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Mobilità 12 Min',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerIcon}>💪</Text>
          <Text style={styles.headerTitle}>Mobilità 12 Min</Text>
          <Text style={styles.headerSubtitle}>Protocollo Anti-Iperlordosi Lombare</Text>
          
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completati</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{routine.length}</Text>
              <Text style={styles.statLabel}>Esercizi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalMinutes}'</Text>
              <Text style={styles.statLabel}>Durata</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>⚠️</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Target: Iperlordosi 4° → &lt;2/10</Text>
            <Text style={styles.infoText}>
              Routine specifica correzione iperlordosi lombare SEVERA. 
              Enfasi retroversione bacino, attivazione glutei, deprogrammazione estensori lombari.
            </Text>
          </View>
        </View>

        {/* PARTE 1: MOBILITÀ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>PARTE 1</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Mobilità Anti-Iperlordosi</Text>
              <Text style={styles.sectionSubtitle}>7 minuti • 4 esercizi</Text>
            </View>
            {completedCount > 0 && (
              <Pressable style={styles.resetButton} onPress={resetRoutine}>
                <Text style={styles.resetButtonText}>🔄</Text>
              </Pressable>
            )}
          </View>

          {mobilityExercises.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.exerciseCard,
                item.completed && styles.exerciseCardCompleted
              ]}
            >
              <View style={styles.exerciseContent}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                
                <Pressable
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxChecked
                  ]}
                  onPress={() => toggleItem(item.id)}
                >
                  {item.completed && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
                
                <View style={styles.exerciseInfo}>
                  <Text style={[
                    styles.exerciseTitle,
                    item.completed && styles.exerciseTitleCompleted
                  ]}>
                    {item.title}
                  </Text>
                  <View style={styles.exerciseMeta}>
                    <Text style={styles.exerciseMetaText}>
                      ⏱️ {Math.floor(item.time / 60)}'
                    </Text>
                    <Text style={styles.exerciseMetaText}>
                      📊 {item.sets}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.infoButton}
                  onPress={() => {
                    setSelectedItem(item);
                    setShowDetailModal(true);
                  }}
                >
                  <Text style={styles.infoButtonText}>ℹ️</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* PARTE 2: CORE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionBadge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.sectionBadgeText}>PARTE 2</Text>
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Core Anti-Estensione</Text>
              <Text style={styles.sectionSubtitle}>5 minuti • 3 esercizi</Text>
            </View>
          </View>

          {coreExercises.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.exerciseCard,
                item.completed && styles.exerciseCardCompleted
              ]}
            >
              <View style={styles.exerciseContent}>
                <View style={[styles.exerciseNumber, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.exerciseNumberText}>{index + 5}</Text>
                </View>
                
                <Pressable
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxChecked
                  ]}
                  onPress={() => toggleItem(item.id)}
                >
                  {item.completed && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
                
                <View style={styles.exerciseInfo}>
                  <Text style={[
                    styles.exerciseTitle,
                    item.completed && styles.exerciseTitleCompleted
                  ]}>
                    {item.title}
                  </Text>
                  <View style={styles.exerciseMeta}>
                    <Text style={styles.exerciseMetaText}>
                      ⏱️ {Math.floor(item.time / 60)}'
                    </Text>
                    <Text style={styles.exerciseMetaText}>
                      📊 {item.sets}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.infoButton}
                  onPress={() => {
                    setSelectedItem(item);
                    setShowDetailModal(true);
                  }}
                >
                  <Text style={styles.infoButtonText}>ℹ️</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Principi */}
        <View style={styles.principlesCard}>
          <View style={styles.principlesHeader}>
            <Text style={styles.principlesIcon}>🛡️</Text>
            <Text style={styles.principlesTitle}>Principi NON Negoziabili</Text>
          </View>
          <Text style={styles.principleItem}>
            • <Text style={styles.principleBold}>RETROVERSIONE</Text> attiva in OGNI esercizio (fondamentale)
          </Text>
          <Text style={styles.principleItem}>
            • <Text style={styles.principleBold}>Glutei</Text> attivazione 8-9/10 costante
          </Text>
          <Text style={styles.principleItem}>
            • <Text style={styles.principleBold}>ZERO dolore</Text> durante esecuzione → STOP immediato
          </Text>
          <Text style={styles.principleItem}>
            • <Text style={styles.principleBold}>Respirazione</Text> Box 4-2-4 (no apnea)
          </Text>
          <Text style={styles.principleItem}>
            • <Text style={styles.principleBold}>Lombare piatta</Text> 100% tempo (se arch = STOP)
          </Text>
        </View>

        {/* Complete Button */}
        <Pressable
          style={[
            styles.completeButton,
            completedCount === routine.length && styles.completeButtonActive
          ]}
          disabled={completedCount !== routine.length}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Text style={styles.completeButtonText}>
            {completedCount === routine.length 
              ? '✅ Routine Completata! 💪' 
              : `Completa ${routine.length - completedCount} esercizi`}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </Pressable>
                </View>
                
                <View style={styles.modalMeta}>
                  <Text style={styles.modalMetaText}>
                    ⏱️ {Math.floor(selectedItem.time / 60)} min
                  </Text>
                  <Text style={styles.modalMetaText}>
                    📊 {selectedItem.sets}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {selectedItem.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    ...shadows.large,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  infoIcon: {
    fontSize: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  resetButtonText: {
    fontSize: 18,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  exerciseCardCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    opacity: 0.7,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  exerciseNumberText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#3b82f6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  exerciseTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseMetaText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoButton: {
    padding: 8,
  },
  infoButtonText: {
    fontSize: 24,
  },
  principlesCard: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  principlesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  principlesIcon: {
    fontSize: 32,
  },
  principlesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
  },
  principleItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  principleBold: {
    fontWeight: '700',
  },
  completeButton: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    ...shadows.medium,
  },
  completeButtonActive: {
    backgroundColor: '#10B981',
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 32,
    color: '#6b7280',
    lineHeight: 32,
  },
  modalMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexWrap: 'wrap',
  },
  modalMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  modalDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});
