
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { MorningRoutineItem, Exercise } from '@/types/training';

interface Section {
  id: string;
  title: string;
  storageKey: string;
  icon: string;
  color: string;
  type: 'routine' | 'exercises' | 'reference';
}

const SECTIONS: Section[] = [
  {
    id: 'morning-routine',
    title: 'Routine mattutina',
    storageKey: '@moto3_custom_morning_routine',
    icon: 'sunny',
    color: colors.primary,
    type: 'routine',
  },
  {
    id: 'warmup',
    title: 'Esercizi di riscaldamento',
    storageKey: '@moto3_custom_warmup',
    icon: 'flame',
    color: '#FF9500',
    type: 'exercises',
  },
  {
    id: 'cooldown',
    title: 'Raffreddamento',
    storageKey: '@moto3_custom_cooldown',
    icon: 'water',
    color: '#5AC8FA',
    type: 'exercises',
  },
  {
    id: 'stretching',
    title: 'Stretching',
    storageKey: '@moto3_custom_stretching',
    icon: 'figure.flexibility',
    color: '#34C759',
    type: 'exercises',
  },
  {
    id: 'foam-rolling',
    title: 'Foam rolling',
    storageKey: '@moto3_custom_foam_rolling',
    icon: 'circle.grid.cross',
    color: '#AF52DE',
    type: 'exercises',
  },
  {
    id: 'mobility',
    title: 'Mobilità',
    storageKey: '@moto3_custom_quick_reference',
    icon: 'book',
    color: '#FF2D55',
    type: 'reference',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow,
  },
  uploadButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  fileInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  fileInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: '#34C759',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    ...commonStyles.shadow,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    flex: 1,
  },
  instructionsCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  examplesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 6,
  },
  examplesButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default function EditDataScreen() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('Document picker cancelled');
        return;
      }

      const file = result.assets[0];
      console.log('File picked:', file.name);

      // Read file content
      const response = await fetch(file.uri);
      const text = await response.text();

      // Check if file is empty
      if (!text || text.trim().length === 0) {
        Alert.alert(
          'File vuoto',
          'Il file selezionato è vuoto. Seleziona un file con contenuto valido.',
          [{ text: 'OK' }]
        );
        return;
      }

      setFileContent(text);
      setFileName(file.name);
      setFileSize(file.size || text.length);
      console.log('File content loaded, size:', text.length);
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert(
        'Errore',
        'Impossibile leggere il file. Assicurati che sia un file .txt valido.',
        [{ text: 'OK' }]
      );
    }
  };

  const parseRoutineContent = (content: string): MorningRoutineItem[] => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      id: Date.now().toString() + index,
      title: line.trim(),
      completed: false,
    }));
  };

  const parseExercisesContent = (content: string): Exercise[] => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      const exercise: Exercise = {
        id: Date.now().toString() + index,
        name: parts[0] || line.trim(),
      };

      // Try to parse additional fields if separated by |
      if (parts.length > 1) {
        const durationMatch = parts[1].match(/(\d+)\s*(sec|secondi|s)/i);
        if (durationMatch) {
          exercise.duration = parseInt(durationMatch[1]);
        }

        const setsMatch = parts[1].match(/(\d+)\s*(set|serie)/i);
        if (setsMatch) {
          exercise.sets = parseInt(setsMatch[1]);
        }

        const repsMatch = parts[1].match(/(\d+)\s*(rep|ripetizioni)/i);
        if (repsMatch) {
          exercise.reps = parseInt(repsMatch[1]);
        }

        if (parts.length > 2) {
          exercise.notes = parts.slice(2).join(' | ');
        }
      }

      return exercise;
    });
  };

  const parseReferenceContent = (content: string) => {
    // Try to parse as structured data or use as plain text
    const lines = content.split('\n');
    const data: any = {};

    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if line starts with a key (contains :)
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0 && colonIndex < 30) {
        // Save previous key-value pair
        if (currentKey) {
          data[currentKey] = currentValue.trim();
        }

        // Start new key-value pair
        const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
        currentValue = trimmed.substring(colonIndex + 1).trim();

        // Map Italian keys to expected keys
        if (key.includes('idrat')) currentKey = 'hydration';
        else if (key.includes('nutri')) currentKey = 'nutrition';
        else if (key.includes('sonn')) currentKey = 'sleep';
        else if (key.includes('recup')) currentKey = 'recovery';
        else if (key.includes('band') || key.includes('flag')) currentKey = 'redFlags';
        else currentKey = key;
      } else {
        // Continue current value
        currentValue += ' ' + trimmed;
      }
    }

    // Save last key-value pair
    if (currentKey) {
      data[currentKey] = currentValue.trim();
    }

    // If no structured data found, use default structure with full content
    if (Object.keys(data).length === 0) {
      return {
        hydration: content,
        nutrition: '',
        sleep: '',
        recovery: '',
        redFlags: '',
      };
    }

    return data;
  };

  const confirmUpdate = async () => {
    if (!selectedSection || !fileContent) return;

    try {
      let dataToSave: any;

      // Parse content based on section type
      if (selectedSection.type === 'routine') {
        dataToSave = parseRoutineContent(fileContent);
      } else if (selectedSection.type === 'exercises') {
        dataToSave = parseExercisesContent(fileContent);
      } else if (selectedSection.type === 'reference') {
        dataToSave = parseReferenceContent(fileContent);
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(selectedSection.storageKey, JSON.stringify(dataToSave));

      console.log('Data updated successfully for:', selectedSection.title);

      // Show success message
      setSuccessMessage(`${selectedSection.title} aggiornata con successo!`);
      setShowSuccess(true);

      // Reset form
      setFileContent(null);
      setFileName(null);
      setFileSize(null);
      setSelectedSection(null);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);

      Alert.alert(
        'Successo',
        `La sezione "${selectedSection.title}" è stata aggiornata con successo.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Error updating data:', error);
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante l\'aggiornamento dei dati.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Modifica Dati',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Aggiorna Sezione</Text>
          <Text style={styles.subtitle}>
            Seleziona una sezione e carica un file .txt per sostituire il contenuto esistente.
          </Text>
        </View>

        {showSuccess && (
          <View style={styles.successMessage}>
            <IconSymbol name="checkmark.circle.fill" size={24} color="#34C759" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📋 Formato File</Text>
          <Text style={styles.instructionText}>
            - Routine/Esercizi: Un elemento per riga
          </Text>
          <Text style={styles.instructionText}>
            - Esercizi avanzati: Nome | Durata/Serie | Note
          </Text>
          <Text style={styles.instructionText}>
            - Mobilità: Chiave: Valore (es. Idratazione: 3L al giorno)
          </Text>
          <Pressable
            style={styles.examplesButton}
            onPress={() => router.push('/content-examples' as any)}
          >
            <IconSymbol name="doc.text.magnifyingglass" size={16} color={colors.primary} />
            <Text style={styles.examplesButtonText}>Vedi Esempi Formato</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: 18, fontWeight: '700', marginBottom: 12 }]}>
          Seleziona Sezione
        </Text>

        {SECTIONS.map((section) => (
          <Pressable
            key={section.id}
            style={[
              styles.sectionCard,
              selectedSection?.id === section.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedSection(section)}
          >
            <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
              <IconSymbol name={section.icon as any} size={24} color={section.color} />
            </View>
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {selectedSection?.id === section.id && (
              <View style={styles.checkmark}>
                <IconSymbol name="checkmark" size={18} color="#FFFFFF" />
              </View>
            )}
          </Pressable>
        ))}

        <View style={styles.uploadSection}>
          <Pressable
            style={[
              styles.uploadButton,
              !selectedSection && styles.uploadButtonDisabled,
            ]}
            onPress={pickDocument}
            disabled={!selectedSection}
          >
            <IconSymbol name="doc.text" size={20} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>
              {fileName ? 'Cambia File' : 'Carica File .txt'}
            </Text>
          </Pressable>

          {fileName && fileContent && (
            <>
              <View style={styles.fileInfo}>
                <IconSymbol name="doc.fill" size={32} color={colors.primary} />
                <View style={styles.fileInfoText}>
                  <Text style={styles.fileName}>{fileName}</Text>
                  <Text style={styles.fileSize}>
                    {fileSize ? formatFileSize(fileSize) : 'Dimensione sconosciuta'}
                  </Text>
                </View>
                <Pressable onPress={() => {
                  setFileContent(null);
                  setFileName(null);
                  setFileSize(null);
                }}>
                  <IconSymbol name="xmark.circle.fill" size={24} color={colors.textSecondary} />
                </Pressable>
              </View>

              <Pressable
                style={[
                  styles.confirmButton,
                  (!selectedSection || !fileContent) && styles.confirmButtonDisabled,
                ]}
                onPress={confirmUpdate}
                disabled={!selectedSection || !fileContent}
              >
                <Text style={styles.confirmButtonText}>
                  Conferma e Sostituisci Contenuto
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
