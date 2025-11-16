
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface RedFlag {
  id: string;
  date: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
}

export default function RedFlagsScreen() {
  const [flags, setFlags] = useState<RedFlag[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'Dolore',
      severity: 'medium',
      description: 'Dolore al ginocchio destro durante squat',
      resolved: false,
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlagType, setNewFlagType] = useState('');
  const [newFlagDescription, setNewFlagDescription] = useState('');
  const [newFlagSeverity, setNewFlagSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return colors.secondary;
      case 'medium': return colors.warning;
      case 'low': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Bassa';
      default: return '';
    }
  };

  const toggleResolved = (id: string) => {
    setFlags(flags.map(flag =>
      flag.id === id ? { ...flag, resolved: !flag.resolved } : flag
    ));
  };

  const addNewFlag = () => {
    if (newFlagType && newFlagDescription) {
      const newFlag: RedFlag = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        type: newFlagType,
        severity: newFlagSeverity,
        description: newFlagDescription,
        resolved: false,
      };
      setFlags([newFlag, ...flags]);
      setShowAddModal(false);
      setNewFlagType('');
      setNewFlagDescription('');
      setNewFlagSeverity('medium');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sistema Bandiera Rossa',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.warningCard]}>
            <IconSymbol name="exclamationmark.triangle.fill" size={32} color={colors.secondary} />
            <Text style={styles.warningTitle}>Monitoraggio Segnali di Allarme</Text>
            <Text style={styles.warningText}>
              Registra e monitora sintomi, dolori o problemi che potrebbero richiedere attenzione
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Aggiungi Bandiera Rossa</Text>
          </Pressable>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>
              Bandiere Attive ({flags.filter(f => !f.resolved).length})
            </Text>
            {flags.filter(f => !f.resolved).length === 0 ? (
              <Text style={styles.emptyText}>Nessuna bandiera rossa attiva</Text>
            ) : (
              flags.filter(f => !f.resolved).map((flag) => (
                <View key={flag.id} style={styles.flagCard}>
                  <View style={styles.flagHeader}>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(flag.severity) }
                    ]}>
                      <Text style={styles.severityText}>
                        {getSeverityLabel(flag.severity)}
                      </Text>
                    </View>
                    <Text style={styles.flagDate}>
                      {new Date(flag.date).toLocaleDateString('it-IT')}
                    </Text>
                  </View>
                  <Text style={styles.flagType}>{flag.type}</Text>
                  <Text style={styles.flagDescription}>{flag.description}</Text>
                  <Pressable
                    style={styles.resolveButton}
                    onPress={() => toggleResolved(flag.id)}
                  >
                    <IconSymbol name="checkmark.circle" size={20} color={colors.accent} />
                    <Text style={styles.resolveButtonText}>Segna come Risolto</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>

          {flags.filter(f => f.resolved).length > 0 && (
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>
                Bandiere Risolte ({flags.filter(f => f.resolved).length})
              </Text>
              {flags.filter(f => f.resolved).map((flag) => (
                <View key={flag.id} style={[styles.flagCard, styles.resolvedFlagCard]}>
                  <View style={styles.flagHeader}>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: colors.textSecondary }
                    ]}>
                      <Text style={styles.severityText}>Risolto</Text>
                    </View>
                    <Text style={styles.flagDate}>
                      {new Date(flag.date).toLocaleDateString('it-IT')}
                    </Text>
                  </View>
                  <Text style={styles.flagType}>{flag.type}</Text>
                  <Text style={styles.flagDescription}>{flag.description}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nuova Bandiera Rossa</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo</Text>
                <TextInput
                  style={styles.input}
                  value={newFlagType}
                  onChangeText={setNewFlagType}
                  placeholder="es. Dolore, Affaticamento, Infortunio"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gravità</Text>
                <View style={styles.severitySelector}>
                  {(['low', 'medium', 'high'] as const).map((severity) => (
                    <Pressable
                      key={severity}
                      style={[
                        styles.severityOption,
                        newFlagSeverity === severity && styles.severityOptionActive,
                        { borderColor: getSeverityColor(severity) }
                      ]}
                      onPress={() => setNewFlagSeverity(severity)}
                    >
                      <Text style={[
                        styles.severityOptionText,
                        newFlagSeverity === severity && { color: getSeverityColor(severity) }
                      ]}>
                        {getSeverityLabel(severity)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descrizione</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newFlagDescription}
                  onChangeText={setNewFlagDescription}
                  placeholder="Descrivi il problema in dettaglio..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Annulla</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addNewFlag}
                >
                  <Text style={styles.saveButtonText}>Salva</Text>
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
  warningCard: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  flagCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  resolvedFlagCard: {
    opacity: 0.6,
    borderLeftColor: colors.textSecondary,
  },
  flagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  flagDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  flagType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  flagDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resolveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  severitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  severityOptionActive: {
    backgroundColor: colors.background,
  },
  severityOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
