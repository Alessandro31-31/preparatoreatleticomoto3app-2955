
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';

interface Meal {
  id: string;
  date: string;
  time: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function NutritionDiaryScreen() {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      name: 'Colazione Proteica',
      type: 'breakfast',
      calories: 520,
      protein: 35,
      carbs: 45,
      fats: 18,
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      time: '13:00',
      name: 'Pranzo Bilanciato',
      type: 'lunch',
      calories: 680,
      protein: 45,
      carbs: 70,
      fats: 22,
    },
  ]);

  const [dailyGoals] = useState<DailyGoals>({
    calories: 2800,
    protein: 180,
    carbs: 320,
    fats: 85,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'breakfast' as Meal['type'],
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  const todayMeals = meals.filter(
    (meal) => meal.date === new Date().toISOString().split('T')[0]
  );

  const calculateTotals = () => {
    return todayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const totals = calculateTotals();

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      Alert.alert('Errore', 'Inserisci almeno nome e calorie');
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      name: newMeal.name,
      type: newMeal.type,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
    };

    setMeals([...meals, meal]);
    setShowAddModal(false);
    setNewMeal({
      name: '',
      type: 'breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const deleteMeal = (id: string) => {
    Alert.alert('Elimina Pasto', 'Sei sicuro di voler eliminare questo pasto?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () => {
          setMeals(meals.filter((m) => m.id !== id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const renderMacroCircle = (value: number, goal: number, color: string, label: string) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.macroCircle}>
        <Svg width={120} height={120}>
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke={colors.surface}
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={60}
            cy={60}
            r={radius}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 60 60)`}
          />
        </Svg>
        <View style={styles.macroCircleContent}>
          <Text style={styles.macroCircleValue}>{value}</Text>
          <Text style={styles.macroCircleGoal}>/ {goal}</Text>
          <Text style={styles.macroCircleLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  const getMealIcon = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast':
        return 'sunrise.fill';
      case 'lunch':
        return 'sun.max.fill';
      case 'dinner':
        return 'moon.fill';
      case 'snack':
        return 'leaf.fill';
    }
  };

  const getMealLabel = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast':
        return 'Colazione';
      case 'lunch':
        return 'Pranzo';
      case 'dinner':
        return 'Cena';
      case 'snack':
        return 'Spuntino';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Diario Alimentare',
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
            colors={gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="fork.knife" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Diario Alimentare</Text>
            <Text style={styles.headerDescription}>
              Traccia macro e ottimizza la nutrizione per massime prestazioni
            </Text>
          </LinearGradient>

          {/* Daily Summary */}
          <View style={[commonStyles.card, styles.summaryCard]}>
            <Text style={styles.sectionTitle}>Riepilogo Giornaliero</Text>
            <View style={styles.caloriesProgress}>
              <View style={styles.caloriesHeader}>
                <Text style={styles.caloriesLabel}>Calorie</Text>
                <Text style={styles.caloriesValue}>
                  {totals.calories} / {dailyGoals.calories}
                </Text>
              </View>
              <View style={styles.caloriesBar}>
                <View
                  style={[
                    styles.caloriesBarFill,
                    {
                      width: `${Math.min((totals.calories / dailyGoals.calories) * 100, 100)}%`,
                      backgroundColor:
                        totals.calories > dailyGoals.calories
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                />
              </View>
              <Text style={styles.caloriesRemaining}>
                {dailyGoals.calories - totals.calories > 0
                  ? `Rimangono ${dailyGoals.calories - totals.calories} kcal`
                  : `Superato di ${totals.calories - dailyGoals.calories} kcal`}
              </Text>
            </View>
          </View>

          {/* Macros Circles */}
          <View style={[commonStyles.card, styles.macrosCard]}>
            <Text style={styles.sectionTitle}>Macronutrienti</Text>
            <View style={styles.macrosGrid}>
              {renderMacroCircle(totals.protein, dailyGoals.protein, colors.primary, 'Proteine')}
              {renderMacroCircle(totals.carbs, dailyGoals.carbs, colors.warning, 'Carboidrati')}
              {renderMacroCircle(totals.fats, dailyGoals.fats, colors.accent, 'Grassi')}
            </View>
          </View>

          {/* Add Meal Button */}
          <Pressable
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowAddModal(true);
            }}
          >
            <LinearGradient
              colors={gradients.racing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <IconSymbol name="plus.circle.fill" size={28} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Aggiungi Pasto</Text>
            </LinearGradient>
          </Pressable>

          {/* Meals List */}
          <Text style={styles.sectionHeader}>Pasti di Oggi</Text>
          {todayMeals.length === 0 ? (
            <View style={[commonStyles.card, styles.emptyCard]}>
              <IconSymbol name="tray" size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>Nessun pasto registrato oggi</Text>
            </View>
          ) : (
            todayMeals.map((meal) => (
              <View key={meal.id} style={[commonStyles.card, styles.mealCard]}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealInfo}>
                    <View style={styles.mealTypeIcon}>
                      <IconSymbol
                        name={getMealIcon(meal.type) as any}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.mealDetails}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>
                        {getMealLabel(meal.type)} • {meal.time}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteMeal(meal.id)}
                  >
                    <IconSymbol name="trash" size={20} color={colors.error} />
                  </Pressable>
                </View>
                <View style={styles.mealMacros}>
                  <View style={styles.mealMacroItem}>
                    <Text style={styles.mealMacroValue}>{meal.calories}</Text>
                    <Text style={styles.mealMacroLabel}>kcal</Text>
                  </View>
                  <View style={styles.mealMacroItem}>
                    <Text style={[styles.mealMacroValue, { color: colors.primary }]}>
                      {meal.protein}g
                    </Text>
                    <Text style={styles.mealMacroLabel}>Proteine</Text>
                  </View>
                  <View style={styles.mealMacroItem}>
                    <Text style={[styles.mealMacroValue, { color: colors.warning }]}>
                      {meal.carbs}g
                    </Text>
                    <Text style={styles.mealMacroLabel}>Carbo</Text>
                  </View>
                  <View style={styles.mealMacroItem}>
                    <Text style={[styles.mealMacroValue, { color: colors.accent }]}>
                      {meal.fats}g
                    </Text>
                    <Text style={styles.mealMacroLabel}>Grassi</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Nutrition Tips */}
          <View style={[commonStyles.card, styles.tipsCard]}>
            <View style={styles.tipsHeader}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.racingGold} />
              <Text style={styles.tipsTitle}>Consigli Nutrizionali</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Mantieni un apporto proteico di 2g/kg peso corporeo</Text>
              <Text style={styles.tipItem}>• Carboidrati complessi 3-4h prima dell&apos;allenamento</Text>
              <Text style={styles.tipItem}>• Idratazione costante: 3-4L acqua al giorno</Text>
              <Text style={styles.tipItem}>• Pasto post-workout entro 30 minuti</Text>
              <Text style={styles.tipItem}>• Grassi sani: omega-3 per recupero muscolare</Text>
            </View>
          </View>
        </ScrollView>

        {/* Add Meal Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nuovo Pasto</Text>
                <Pressable onPress={() => setShowAddModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={28} color={colors.textLight} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalForm}>
                <Text style={styles.inputLabel}>Nome Pasto</Text>
                <TextInput
                  style={styles.input}
                  value={newMeal.name}
                  onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
                  placeholder="Es: Pasta al pomodoro"
                  placeholderTextColor={colors.textLight}
                />

                <Text style={styles.inputLabel}>Tipo</Text>
                <View style={styles.typeButtons}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeButton,
                        newMeal.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setNewMeal({ ...newMeal, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newMeal.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {getMealLabel(type)}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Calorie (kcal)</Text>
                <TextInput
                  style={styles.input}
                  value={newMeal.calories}
                  onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
                  placeholder="500"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />

                <Text style={styles.inputLabel}>Proteine (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMeal.protein}
                  onChangeText={(text) => setNewMeal({ ...newMeal, protein: text })}
                  placeholder="30"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />

                <Text style={styles.inputLabel}>Carboidrati (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMeal.carbs}
                  onChangeText={(text) => setNewMeal({ ...newMeal, carbs: text })}
                  placeholder="60"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />

                <Text style={styles.inputLabel}>Grassi (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMeal.fats}
                  onChangeText={(text) => setNewMeal({ ...newMeal, fats: text })}
                  placeholder="15"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textLight}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Annulla</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={addMeal}
                >
                  <Text style={styles.modalButtonText}>Aggiungi</Text>
                </Pressable>
              </View>
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
  summaryCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  caloriesProgress: {
    gap: 8,
  },
  caloriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  caloriesBar: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  caloriesBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  caloriesRemaining: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  macrosCard: {
    marginBottom: 24,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  macroCircle: {
    position: 'relative',
    alignItems: 'center',
  },
  macroCircleContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroCircleValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  macroCircleGoal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  macroCircleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    marginBottom: 24,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 20,
    ...shadows.medium,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 16,
    fontWeight: '600',
  },
  mealCard: {
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  mealTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  mealMacroItem: {
    alignItems: 'center',
  },
  mealMacroValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  mealMacroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  modalForm: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.surface,
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalButtonTextSecondary: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
});
