
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/types/training';
import { warmupExercises } from '@/data/trainingData';

const STORAGE_KEY = '@moto3_custom_warmup';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  itemDetails: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default function EditWarmupScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExercises(JSON.parse(stored));
      } else {
        setExercises(warmupExercises);
      }
    } catch (error) {
      console.log('Error loading warmup exercises:', error);
      setExercises(warmupExercises);
    }
  };

  const saveData = async (newExercises: Exercise[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newExercises));
      setExercises(newExercises);
    } catch (error) {
      console.log('Error saving warmup exercises:', error);
    }
  };

  const openAddModal = () => {
    setEditingExercise(null);
    setName('');
    setSets('');
    setReps('');
    setDuration('');
    setNotes('');
    setModalVisible(true);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setSets(exercise.sets ? String(exercise.sets) : '');
    setReps(exercise.reps ? String(exercise.reps) : '');
    setDuration(exercise.duration ? String(exercise.duration) : '');
    setNotes(exercise.notes || '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: name.trim(),
      sets: sets ? parseInt(sets) : undefined,
      reps: reps ? parseInt(reps) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes.trim() || undefined,
    };

    let newExercises;
    if (editingExercise) {
      newExercises = exercises.map(ex => ex.id === editingExercise.id ? newExercise : ex);
    } else {
      newExercises = [...exercises, newExercise];
    }

    saveData(newExercises);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const newExercises = exercises.filter(ex => ex.id !== id);
    saveData(newExercises);
  };

  const resetToDefault = () => {
    saveData(warmupExercises);
  };

  const formatExerciseDetails = (exercise: Exercise) => {
    const parts = [];
    if (exercise.sets && exercise.reps) {
      parts.push(`${exercise.sets} serie x ${exercise.reps} rip`);
    }
    if (exercise.duration) {
      parts.push(`${Math.floor(exercise.duration / 60)} min`);
    }
    if (exercise.notes) {
      parts.push(exercise.notes);
    }
    return parts.join(' • ');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Modifica Riscaldamento',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{exercise.name}</Text>
              <View style={styles.itemActions}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => openEditModal(exercise)}
                >
                  <IconSymbol name="pencil" size={18} color={colors.primary} />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => handleDelete(exercise.id)}
                >
                  <IconSymbol name="trash" size={18} color="#FF3B30" />
                </Pressable>
              </View>
            </View>
            <Text style={styles.itemDetails}>{formatExerciseDetails(exercise)}</Text>
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={openAddModal}>
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Aggiungi Esercizio</Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={resetToDefault}>
          <Text style={styles.resetButtonText}>Ripristina Valori Predefiniti</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingExercise ? 'Modifica Esercizio' : 'Nuovo Esercizio'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nome esercizio"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Serie (opzionale)"
                placeholderTextColor={colors.textSecondary}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Ripetizioni (opzionale)"
                placeholderTextColor={colors.textSecondary}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Durata in secondi (opzionale)"
                placeholderTextColor={colors.textSecondary}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Note (opzionale)"
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Annulla</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={[styles.modalButtonText, styles.saveButtonText]}>Salva</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
