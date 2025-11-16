
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MorningRoutineItem } from '@/types/training';
import { defaultMorningRoutine } from '@/data/trainingData';

const STORAGE_KEY = '@moto3_custom_morning_routine';

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

export default function EditMorningRoutineScreen() {
  const [items, setItems] = useState<MorningRoutineItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MorningRoutineItem | null>(null);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems(defaultMorningRoutine);
      }
    } catch (error) {
      console.log('Error loading morning routine:', error);
      setItems(defaultMorningRoutine);
    }
  };

  const saveData = async (newItems: MorningRoutineItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.log('Error saving morning routine:', error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setTime('');
    setModalVisible(true);
  };

  const openEditModal = (item: MorningRoutineItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setTime(item.time ? String(item.time) : '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const newItem: MorningRoutineItem = {
      id: editingItem?.id || Date.now().toString(),
      title: title.trim(),
      completed: editingItem?.completed || false,
      time: time ? parseInt(time) : undefined,
    };

    let newItems;
    if (editingItem) {
      newItems = items.map(item => item.id === editingItem.id ? newItem : item);
    } else {
      newItems = [...items, newItem];
    }

    saveData(newItems);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    saveData(newItems);
  };

  const resetToDefault = () => {
    saveData(defaultMorningRoutine);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Modifica Routine Mattutina',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.itemActions}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => openEditModal(item)}
                >
                  <IconSymbol name="pencil" size={18} color={colors.primary} />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <IconSymbol name="trash" size={18} color="#FF3B30" />
                </Pressable>
              </View>
            </View>
            {item.time && (
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                Durata: {Math.floor(item.time / 60)} minuti
              </Text>
            )}
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={openAddModal}>
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Aggiungi Elemento</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Modifica Elemento' : 'Nuovo Elemento'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Titolo"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Durata (secondi, opzionale)"
              placeholderTextColor={colors.textSecondary}
              value={time}
              onChangeText={setTime}
              keyboardType="numeric"
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
        </View>
      </Modal>
    </View>
  );
}
