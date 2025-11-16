
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, commonStyles, shadows } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@printable_checklists_progress';

interface ChecklistItem {
  id: number;
  title: string;
  color: string;
  items: string[];
}

const CHECKLISTS: ChecklistItem[] = [
  {
    id: 1,
    title: 'Routine Mattutina 12\'',
    color: '#FF6B6B',
    items: [
      'HRV misurata: ___ ms (baseline: ___ ms)',
      'Rigidità lombare PRE: ___/10',
      'Energia generale: ___/10',
      'Sleep ore: ___ h',
      'Cat-Cow 2×15 - Retroversione: ___/10',
      'Child\'s Pose 2×45" - Stretch tollerabile',
      'Glute Bridge 2×12 - Glutei attivi >8/10',
      'Psoas Stretch 2×40" - Lato tight: DX/SX',
      'Plank 2×40" - Forma OK, Lombare piatta',
      'Dead Bug 2×8/lato - Lombare a terra',
      'Bird Dog 2×6/lato - Schiena neutra',
      'Rigidità lombare POST: ___/10 (Δ: ___)'
    ]
  },
  {
    id: 2,
    title: 'Red Flags Decision Tree',
    color: '#F59E0B',
    items: [
      'HRV >55ms → GO | 50-55 → CAUTIOUS | 45-50 → EASY -30% | <45 → DELOAD',
      'Rigidità 0-3 → GO | 4-5 → Routine 2× | 6-7 → SKIP gym | >7 → FISIO',
      'Dolore 0 → GO | 1-2 → Reduce -20% | 3-4 → SKIP lower | >4 → OFF',
      'Sleep >7h → GO | 6-7 → No finisher | 5-6 → EASY -30% | <5 → OFF',
      'Energia 7-10 → GO | 5-6 → No finisher | 3-4 → EASY -50% | <3 → OFF',
      'DECISIONE FINALE: FULL / MODIFY / EASY / OFF'
    ]
  },
  {
    id: 3,
    title: 'Front Squat Form Check',
    color: '#3B82F6',
    items: [
      'SETUP: Bilanciere su deltoidi, gomiti ALTI',
      'SETUP: Piedi larghezza anche, retroversione attiva',
      'SETUP: Core braced, respiro profondo',
      'DISCESA 3": Tronco VERTICALE (NO inclinazione)',
      'DISCESA: Ginocchia tracking su punte, schiena PIATTA',
      'DISCESA: Peso su talloni, gomiti ALTI mantenuti',
      'BOTTOM: Zero iperestensione lombare (CRITICO!)',
      'BOTTOM: Retroversione mantenuta, petto alto',
      'SALITA: Drive talloni, tronco verticale',
      'SALITA: Gomiti ALTI, schiena piatta, lock-out',
      'RESPIRO: Inspira top→hold discesa→espira salita',
      'Carico: ___ kg × ___ reps - RPE: ___/10',
      'Forma: 10/10 | 8-9/10 | <8/10 → REDUCE -20%',
      'RED FLAG: Lombare estende/Dolore >2/10 → STOP'
    ]
  },
  {
    id: 4,
    title: 'Trap-Bar Deadlift Form Check',
    color: '#8B5CF6',
    items: [
      'SETUP: Maniglie ALTE (riduce ROM, safe lombare)',
      'SETUP: Piedi centro trap-bar, schiena NEUTRA',
      'SETUP: Scapole sopra barra, retroversione attiva',
      'PULL: Leg drive simultaneo (NO sequenziale)',
      'PULL: Schiena NEUTRA mantenuta (angle costante)',
      'PULL: Spalle retracted, petto alto, drive talloni',
      'PULL: Zero arrotondamento lombare (CRITICO!)',
      'LOCK-OUT: Anche estese, torace alto, controllo',
      'DISCESA 3": Controllata, schiena neutra, NO drop',
      'RESET: Pausa terra 1", NO touch-and-go',
      'RESPIRO: Inspira pre-pull→hold→espira top',
      'Carico: ___ kg × ___ reps - RPE: ___/10',
      'Forma: 10/10 → +5% | 8-9 → Mantieni | <8 → -10-20%',
      'RED FLAG: Lombare flette/Dolore >2 → STOP'
    ]
  },
  {
    id: 5,
    title: 'Plank Hold Form Check',
    color: '#10B981',
    items: [
      'SETUP: Gomiti sotto spalle 90°',
      'SETUP: Retroversione ATTIVA prima di sollevare',
      'SETUP: Glutei squeeze 9/10, core braced',
      'HOLD: Linea retta spalle-anche-caviglie',
      'HOLD: Schiena PIATTA (zero arch lombare)',
      'HOLD: Glutei squeeze 8-9/10 mantenuto',
      'HOLD: Retroversione locked, collo neutro',
      'RESPIRO: Box 4-2-4 continua (NO apnea)',
      'CHECK 15": Glutei contratti? SI/NO',
      'CHECK 30": Schiena piatta? SI/NO',
      'CHECK 45": Respirazione fluida? SI/NO',
      'Target: ___ sec | Actual: ___ sec',
      'Forma mantenuta fino alla fine: SI/NO',
      'STOP SE: Lombare estende/Glutei rilassano/Apnea'
    ]
  },
  {
    id: 6,
    title: 'Session Tracking Palestra',
    color: '#EF4444',
    items: [
      'Data: ___/___ | Sett: ___/22 | Tipo: Lower/Upper/Acc',
      'PRE: HRV ___ ms | Rigidità ___/10 | Energia ___/10',
      'PRE: Sleep ___ h | Decisione: FULL/MODIFY/EASY',
      'ES.1: _______ | ___ kg × ___ reps × ___ serie',
      'ES.1: S1: ___×___ RPE___ | S2: ___×___ RPE___',
      'ES.1: S3: ___×___ RPE___ | S4: ___×___ RPE___',
      'ES.1: Forma 10|8-9|<8 | Rep crolla: ___ | +5%: SI/NO',
      'ES.2: _______ | ___ kg × ___ × ___ serie',
      'ES.2: Serie tracking + Forma + Progress',
      'ES.3-6: [Ripeti format sopra per altri esercizi]',
      'FINISHER: Tipo _______ | ___ min | RPE ___/10',
      'POST: Durata ___ min | Load: RPE___ × ___min = ___',
      'POST: Rigidità ___/10 | Fatica ___/10 | Soddisf ___/10',
      'RED FLAG: Dolore >2 | Rigidità↑ | Form breakdown >3'
    ]
  },
  {
    id: 7,
    title: 'Tracking Settimanale',
    color: '#3B82F6',
    items: [
      'Settimana: ___ | Periodo: ___/___ → ___/___',
      'ADERENZA: Routine 12\' ___/6 | Allenamenti ___/6',
      'ADERENZA: Stretching sera ___/6 | Finisher ___/3',
      'HRV media: ___ ms (baseline: ___) | Δ: ___%',
      'RED FLAG: HRV drop >12% vs 4-week baseline',
      'Peso: ___ kg (Δ: ___) | Sleep: ___ h/notte',
      'Rigidità media: ___/10 (Lu_Ma_Me_Gi_Ve_Sa)',
      'Energia media: ___/10 | Recovery: OK/LIMIT/POOR',
      'LOAD: Totale ___ unità | 4 sett: ___+___+___+___',
      'ACR: ___÷4 = ___ | VERDE <1.3 | GIALLO 1.3-1.5 | ROSSO >1.5',
      'FORZA: F.Squat ___kg×5 (Δ:___) | TrapDL ___kg×5 (Δ:___)',
      'FORZA: Pull +___kg×5 | Dips +___kg×5',
      'CORE: Plank ___ sec | Wall sit ___ sec | L-sit ___ sec',
      'CARDIO: Z2 120\' HR avg ___bpm | RSA recovery ___/8 <130',
      'RED FLAGS: HRV drop | ACR >1.3 | Rigidità >3.5 (sett 8-10)',
      'RED FLAGS: Aderenza <80% | Dolore >2 | Sleep <6h 4+ notti',
      'DECISIONE: CONTINUA | SWITCH B | DELOAD 48h',
      'DECISIONE: REDUCE 20% (ACR >1.3) | Consulto fisio'
    ]
  },
  {
    id: 8,
    title: 'Review Mensile',
    color: '#8B5CF6',
    items: [
      'MESE: ___ | Periodo: ___/___ → ___/___',
      'POSTURA: Rigidità inizio ___/10 → fine ___/10 (Δ: ___)',
      'POSTURA: Target ___/10 | ON TRACK: SI/NO',
      'ROM Hip Flexion: DX ___° SX ___° (target >115°)',
      'CORE: Plank max ___ sec | Wall sit ___ sec | L-sit ___ sec',
      'FORZA: Front Squat ___kg×5 → ___kg×5 (Δ: +___kg +___%)',
      'FORZA: Trap-Bar DL ___kg×5 → ___kg×5 (Δ: +___kg +___%)',
      'FORZA: Weighted Pull +___kg → +___kg | Dips +___kg → +___kg',
      'Status progressione: ON / STALLO / REGRESSION',
      'CARDIO Z2: HR avg ___bpm → ___bpm (Δ: ___ target -2/-5)',
      'RSA: Recovery <130 bpm ___/8 | Power drop 1→8: ___%',
      'ADERENZA: Routine ___/26 | Allenamenti ___/26 | Stretch ___/26',
      'Overall aderenza: ___% (target >85%)',
      'BIOMETRICS: HRV medio ___ ms | Peso ___ kg | Sleep ___ h',
      'RED FLAGS: HRV drop >15% | Rigidità NO migliora | Injury',
      'RED FLAGS: Aderenza <75% | Stallo forza 4+ sett',
      'ADJUSTMENT necessari mese prossimo:',
      'Meeting preparatore: Data ___/___ | CONTINUA/MODIFY/SWITCH B'
    ]
  },
  {
    id: 9,
    title: 'Quick Reference - Limiti Sicuri',
    color: '#DC2626',
    items: [
      'HRV: >50ms ✅ | 45-50 ⚠️ | <45 🛑',
      'Rigidità: <4/10 ✅ | 4-5 ⚠️ | >5 🛑',
      'Dolore lombare: 0-1 ✅ | 2-3 ⚠️ | >3 🛑',
      'Sleep: >7h ✅ | 6-7h ⚠️ | <6h 🛑',
      'Energia: >7/10 ✅ | 5-6 ⚠️ | <5 🛑',
      'ACR: 0.8-1.3 ✅ | 1.3-1.5 ⚠️ | >1.5 🛑',
      'PROGRESSIONE: Forma 10/10 → +5% | 8-9 → Mantieni | <8 → -10-20%',
      'STOP SET: Lombare arch | Dolore >2 | Form breakdown | Grip fail',
      'SKIP GYM: HRV <45 | Rigidità >6 | Dolore >3 | Sleep <5 | Energia <3',
      'FISIO URGENTE: Dolore >4/10 48h+ | Rigidità >7 2gg+ | Sciatalgia',
      'CLAUSOLE AUTO: Sett 8-10 rigidità >3.5 → SWITCH B',
      'CLAUSOLE: HRV <50 2gg → DELOAD 48h | Dolore >3 → FISIO 24h'
    ]
  }
];

export default function PrintableChecklistsScreen() {
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistItem | null>(null);
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({});
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChecks(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading checklist progress:', error);
    }
  };

  const saveProgress = async (newChecks: { [key: string]: boolean }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newChecks));
    } catch (error) {
      console.log('Error saving checklist progress:', error);
    }
  };

  const toggleCheck = (listId: number, itemIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const key = `${listId}-${itemIndex}`;
    const newChecks = { ...checks, [key]: !checks[key] };
    setChecks(newChecks);
    saveProgress(newChecks);
  };

  const resetChecklist = (listId: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newChecks = { ...checks };
    CHECKLISTS.find(c => c.id === listId)?.items.forEach((_, i) => {
      delete newChecks[`${listId}-${i}`];
    });
    setChecks(newChecks);
    saveProgress(newChecks);
  };

  const getProgress = (checklist: ChecklistItem) => {
    let completed = 0;
    checklist.items.forEach((_, i) => {
      if (checks[`${checklist.id}-${i}`]) completed++;
    });
    return Math.round((completed / checklist.items.length) * 100);
  };

  const getCompletedCount = (checklist: ChecklistItem) => {
    let completed = 0;
    checklist.items.forEach((_, i) => {
      if (checks[`${checklist.id}-${i}`]) completed++;
    });
    return completed;
  };

  const openChecklist = (checklist: ChecklistItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedChecklist(checklist);
    setShowDetailModal(true);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Checklist Stampabili',
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
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✓</Text>
          </View>
          <Text style={styles.headerTitle}>Checklist Stampabili</Text>
          <Text style={styles.headerSubtitle}>Sistema tracking Moto3</Text>
        </LinearGradient>

        {/* Checklists Grid */}
        <View style={styles.grid}>
          {CHECKLISTS.map((checklist) => {
            const progress = getProgress(checklist);
            const completed = getCompletedCount(checklist);

            return (
              <Pressable
                key={checklist.id}
                style={styles.checklistCard}
                onPress={() => openChecklist(checklist)}
              >
                <View style={[styles.checklistIcon, { backgroundColor: checklist.color }]}>
                  <Text style={styles.checklistIconText}>✓</Text>
                </View>
                <Text style={styles.checklistTitle}>{checklist.title}</Text>
                <Text style={styles.checklistCount}>
                  ✓ {completed}/{checklist.items.length}
                </Text>
                
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                
                <View style={styles.checklistFooter}>
                  <Text style={styles.progressText}>{progress}%</Text>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Note Preparatore</Text>
          <Text style={styles.infoText}>
            Sistema con 9 checklist per tracking giornaliero, form check esercizi, 
            monitoraggio settimanale/mensile. Include red flags, limiti sicuri iperlordosi.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🏍️ Moto3 - Winter 2025-2026</Text>
          <Text style={styles.footerSubtext}>Programma Ale | 22 settimane</Text>
        </View>
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
            {selectedChecklist && (
              <>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[styles.modalIcon, { backgroundColor: selectedChecklist.color }]}>
                    <Text style={styles.modalIconText}>✓</Text>
                  </View>
                  
                  <Text style={styles.modalTitle}>{selectedChecklist.title}</Text>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{getCompletedCount(selectedChecklist)}</Text>
                      <Text style={styles.statLabel}>Fatti</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{selectedChecklist.items.length}</Text>
                      <Text style={styles.statLabel}>Totali</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{getProgress(selectedChecklist)}%</Text>
                      <Text style={styles.statLabel}>%</Text>
                    </View>
                  </View>

                  <View style={styles.itemsList}>
                    {selectedChecklist.items.map((item, index) => {
                      const isChecked = checks[`${selectedChecklist.id}-${index}`];
                      
                      return (
                        <Pressable
                          key={index}
                          style={[
                            styles.checklistItem,
                            isChecked && styles.checklistItemChecked
                          ]}
                          onPress={() => toggleCheck(selectedChecklist.id, index)}
                        >
                          <View style={styles.itemNumber}>
                            <Text style={styles.itemNumberText}>{index + 1}</Text>
                          </View>
                          <Text style={[
                            styles.itemText,
                            isChecked && styles.itemTextChecked
                          ]}>
                            {item}
                          </Text>
                          <View style={[
                            styles.checkbox,
                            isChecked && styles.checkboxChecked
                          ]}>
                            {isChecked && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.actionButton, styles.resetButton]}
                    onPress={() => resetChecklist(selectedChecklist.id)}
                  >
                    <Text style={styles.resetButtonText}>🔄 Reset</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.closeButton]}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Chiudi</Text>
                  </Pressable>
                </View>
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
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 30,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  checklistCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...shadows.medium,
  },
  checklistIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  checklistIconText: {
    fontSize: 24,
    color: '#fff',
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  checklistCount: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  checklistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  arrowText: {
    fontSize: 18,
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 30,
    color: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#d1d5db',
  },
  itemsList: {
    marginBottom: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  checklistItemChecked: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  itemNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 18,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#fef3c7',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  closeButton: {
    backgroundColor: colors.primary,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
