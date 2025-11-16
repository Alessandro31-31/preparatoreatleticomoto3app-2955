
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  target: number;
  category: 'strength' | 'endurance' | 'consistency' | 'milestone';
}

interface PersonalRecord {
  id: string;
  exercise: string;
  value: number;
  unit: string;
  date: string;
  improvement: number;
}

const STORAGE_KEY = '@achievements_data';
const RECORDS_KEY = '@personal_records';

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const categories = [
    { key: 'all', label: 'Tutti', icon: 'star.fill' },
    { key: 'strength', label: 'Forza', icon: 'dumbbell.fill' },
    { key: 'endurance', label: 'Resistenza', icon: 'figure.run' },
    { key: 'consistency', label: 'Costanza', icon: 'calendar' },
    { key: 'milestone', label: 'Traguardi', icon: 'flag.checkered' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const achievementsData = await AsyncStorage.getItem(STORAGE_KEY);
      const recordsData = await AsyncStorage.getItem(RECORDS_KEY);

      if (achievementsData) {
        setAchievements(JSON.parse(achievementsData));
      } else {
        // Initialize with default achievements
        const defaultAchievements: Achievement[] = [
          {
            id: '1',
            title: 'Prima Settimana',
            description: 'Completa la prima settimana di allenamento',
            icon: 'calendar.badge.checkmark',
            color: colors.primary,
            unlocked: true,
            unlockedDate: new Date().toISOString(),
            progress: 7,
            target: 7,
            category: 'consistency',
          },
          {
            id: '2',
            title: 'Forza Massimale',
            description: 'Raggiungi 100kg di squat',
            icon: 'dumbbell.fill',
            color: colors.error,
            unlocked: false,
            progress: 85,
            target: 100,
            category: 'strength',
          },
          {
            id: '3',
            title: 'Resistenza Estrema',
            description: 'Completa 120 minuti di bike Z2',
            icon: 'figure.outdoor.cycle',
            color: colors.success,
            unlocked: true,
            unlockedDate: new Date().toISOString(),
            progress: 120,
            target: 120,
            category: 'endurance',
          },
          {
            id: '4',
            title: 'Guerriero del Core',
            description: 'Mantieni plank per 90 secondi con casco',
            icon: 'figure.core.training',
            color: colors.warning,
            unlocked: false,
            progress: 75,
            target: 90,
            category: 'strength',
          },
          {
            id: '5',
            title: 'Dedizione Totale',
            description: 'Completa 30 giorni consecutivi',
            icon: 'flame.fill',
            color: colors.accent,
            unlocked: false,
            progress: 18,
            target: 30,
            category: 'consistency',
          },
          {
            id: '6',
            title: 'Metà Percorso',
            description: 'Completa 9 settimane su 18',
            icon: 'chart.line.uptrend.xyaxis',
            color: colors.purple,
            unlocked: false,
            progress: 8,
            target: 9,
            category: 'milestone',
          },
        ];
        setAchievements(defaultAchievements);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAchievements));
      }

      if (recordsData) {
        setRecords(JSON.parse(recordsData));
      } else {
        // Initialize with default records
        const defaultRecords: PersonalRecord[] = [
          {
            id: '1',
            exercise: 'Squat',
            value: 85,
            unit: 'kg',
            date: new Date().toISOString(),
            improvement: 15,
          },
          {
            id: '2',
            exercise: 'Dead-Hang',
            value: 75,
            unit: 'sec',
            date: new Date().toISOString(),
            improvement: 30,
          },
          {
            id: '3',
            exercise: 'Wall Sit',
            value: 110,
            unit: 'sec',
            date: new Date().toISOString(),
            improvement: 65,
          },
        ];
        setRecords(defaultRecords);
        await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(defaultRecords));
      }
    } catch (error) {
      console.error('Error loading achievements data:', error);
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const handleAchievementPress = (achievement: Achievement) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAchievement(achievement);
    setShowDetail(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Traguardi & Record',
          headerLargeTitle: true,
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Overview */}
          <LinearGradient
            colors={gradients.racing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewCard}
          >
            <View style={styles.overviewHeader}>
              <IconSymbol name="trophy.fill" size={48} color="#FFFFFF" />
              <View style={styles.overviewStats}>
                <Text style={styles.overviewValue}>{unlockedCount}/{totalCount}</Text>
                <Text style={styles.overviewLabel}>Traguardi Sbloccati</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{completionPercentage}% Completato</Text>
          </LinearGradient>

          {/* Category Filter */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.key && styles.categoryButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.key);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <IconSymbol
                    name={cat.icon as any}
                    size={20}
                    color={selectedCategory === cat.key ? '#FFFFFF' : colors.text}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === cat.key && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Achievements Grid */}
          <View style={styles.achievementsGrid}>
            {filteredAchievements.map((achievement) => (
              <Pressable
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked,
                ]}
                onPress={() => handleAchievementPress(achievement)}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.color + '20' },
                    !achievement.unlocked && styles.achievementIconLocked,
                  ]}
                >
                  <IconSymbol
                    name={achievement.icon as any}
                    size={32}
                    color={achievement.unlocked ? achievement.color : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                  numberOfLines={2}
                >
                  {achievement.title}
                </Text>
                {achievement.unlocked ? (
                  <View style={[styles.unlockedBadge, { backgroundColor: achievement.color }]}>
                    <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                    <Text style={styles.unlockedText}>Sbloccato</Text>
                  </View>
                ) : (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarSmall}>
                      <View
                        style={[
                          styles.progressFillSmall,
                          {
                            width: `${(achievement.progress / achievement.target) * 100}%`,
                            backgroundColor: achievement.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressTextSmall}>
                      {achievement.progress}/{achievement.target}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* Personal Records */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Record Personali</Text>
            </View>
            {records.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordExercise}>{record.exercise}</Text>
                  <Text style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <View style={styles.recordValue}>
                  <Text style={styles.recordNumber}>
                    {record.value} {record.unit}
                  </Text>
                  <View style={styles.improvementBadge}>
                    <IconSymbol name="arrow.up" size={12} color={colors.success} />
                    <Text style={styles.improvementText}>+{record.improvement}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Achievement Detail Modal */}
      <Modal
        visible={showDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetail(false)}
      >
        {selectedAchievement && (
          <View style={commonStyles.container}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dettagli Traguardo</Text>
              <Pressable onPress={() => setShowDetail(false)}>
                <IconSymbol name="xmark.circle.fill" size={32} color={colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <LinearGradient
                colors={
                  selectedAchievement.unlocked
                    ? [selectedAchievement.color, selectedAchievement.color + 'CC']
                    : [colors.surface, colors.surface]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailCard}
              >
                <View
                  style={[
                    styles.detailIcon,
                    {
                      backgroundColor: selectedAchievement.unlocked
                        ? 'rgba(255, 255, 255, 0.3)'
                        : colors.border,
                    },
                  ]}
                >
                  <IconSymbol
                    name={selectedAchievement.icon as any}
                    size={64}
                    color={selectedAchievement.unlocked ? '#FFFFFF' : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.detailTitle,
                    { color: selectedAchievement.unlocked ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {selectedAchievement.title}
                </Text>
                <Text
                  style={[
                    styles.detailDescription,
                    {
                      color: selectedAchievement.unlocked
                        ? 'rgba(255, 255, 255, 0.9)'
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {selectedAchievement.description}
                </Text>
                {selectedAchievement.unlocked && selectedAchievement.unlockedDate && (
                  <View style={styles.unlockedInfo}>
                    <IconSymbol name="calendar" size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.unlockedDate}>
                      Sbloccato il{' '}
                      {new Date(selectedAchievement.unlockedDate).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                )}
              </LinearGradient>

              {!selectedAchievement.unlocked && (
                <View style={commonStyles.card}>
                  <Text style={styles.progressTitle}>Progresso</Text>
                  <View style={styles.progressBarLarge}>
                    <View
                      style={[
                        styles.progressFillLarge,
                        {
                          width: `${(selectedAchievement.progress / selectedAchievement.target) * 100}%`,
                          backgroundColor: selectedAchievement.color,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.progressStats}>
                    <Text style={styles.progressStat}>
                      Attuale: {selectedAchievement.progress}
                    </Text>
                    <Text style={styles.progressStat}>
                      Obiettivo: {selectedAchievement.target}
                    </Text>
                  </View>
                  <Text style={styles.remainingText}>
                    Mancano ancora {selectedAchievement.target - selectedAchievement.progress} per
                    sbloccare questo traguardo!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  overviewCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    ...shadows.large,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  overviewStats: {
    flex: 1,
  },
  overviewValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    ...shadows.small,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...shadows.small,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: colors.surface + ' !important',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    minHeight: 36,
  },
  achievementTitleLocked: {
    color: colors.textSecondary,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  unlockedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordExercise: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  recordValue: {
    alignItems: 'flex-end',
  },
  recordNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  improvementText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.success,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  modalContent: {
    padding: 16,
  },
  detailCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    ...shadows.large,
  },
  detailIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  unlockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  unlockedDate: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressStat: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  remainingText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
});
