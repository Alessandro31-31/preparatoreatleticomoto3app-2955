
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quickReference } from '@/data/trainingData';

const STORAGE_KEY = '@moto3_custom_quick_reference';

interface QuickReferenceData {
  hydration: string;
  nutrition: string;
  sleep: string;
  recovery: string;
  redFlags: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    ...commonStyles.shadow,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.card,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  resetButtonText: {
    color: colors.primary,
  },
  successMessage: {
    backgroundColor: '#34C75920',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    color: '#34C759',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default function EditQuickReferenceScreen() {
  const [data, setData] = useState<QuickReferenceData>(quickReference);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading quick reference:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      console.log('Quick reference saved successfully');
    } catch (error) {
      console.log('Error saving quick reference:', error);
    }
  };

  const resetToDefault = () => {
    setData(quickReference);
    saveData();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Modifica Riferimento Rapido',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showSuccess && (
          <View style={styles.successMessage}>
            <IconSymbol name="checkmark.circle.fill" size={24} color="#34C759" />
            <Text style={styles.successText}>Salvato con successo!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>💧 Idratazione</Text>
          <TextInput
            style={styles.input}
            value={data.hydration}
            onChangeText={(text) => setData({ ...data, hydration: text })}
            multiline
            placeholder="Linee guida per l'idratazione"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>🍎 Nutrizione</Text>
          <TextInput
            style={styles.input}
            value={data.nutrition}
            onChangeText={(text) => setData({ ...data, nutrition: text })}
            multiline
            placeholder="Linee guida nutrizionali"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>😴 Sonno</Text>
          <TextInput
            style={styles.input}
            value={data.sleep}
            onChangeText={(text) => setData({ ...data, sleep: text })}
            multiline
            placeholder="Linee guida per il sonno"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>🔄 Recupero</Text>
          <TextInput
            style={styles.input}
            value={data.recovery}
            onChangeText={(text) => setData({ ...data, recovery: text })}
            multiline
            placeholder="Linee guida per il recupero"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>🚩 Bandiere Rosse</Text>
          <TextInput
            style={styles.input}
            value={data.redFlags}
            onChangeText={(text) => setData({ ...data, redFlags: text })}
            multiline
            placeholder="Segnali di allarme da monitorare"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.resetButton]}
            onPress={resetToDefault}
          >
            <Text style={[styles.buttonText, styles.resetButtonText]}>Ripristina</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.saveButton]}
            onPress={saveData}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>Salva</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
