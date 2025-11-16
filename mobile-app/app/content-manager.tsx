
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  isNew?: boolean;
  isModified?: boolean;
}

interface DocumentVersion {
  id: string;
  name: string;
  sections: ContentSection[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = '@content_documents';

export default function ContentManagerScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentVersion[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentVersion | null>(null);
  const [newContent, setNewContent] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading documents:', error);
    }
  };

  const saveDocuments = async (docs: DocumentVersion[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      setDocuments(docs);
    } catch (error) {
      console.log('Error saving documents:', error);
    }
  };

  const analyzeContent = (text: string): ContentSection[] => {
    const sections: ContentSection[] = [];
    
    // Split by common section markers
    const lines = text.split('\n');
    let currentSection: ContentSection | null = null;
    let sectionContent: string[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Detect section headers (lines that are short, capitalized, or have special markers)
      const isHeader = 
        /^#{1,3}\s/.test(trimmed) || // Markdown headers
        /^[A-Z][A-Z\s]{3,30}:?$/.test(trimmed) || // ALL CAPS headers
        /^\d+\.\s*[A-Z]/.test(trimmed) || // Numbered headers
        /^[-•]\s*[A-Z]/.test(trimmed.substring(0, 20)); // Bullet headers
      
      if (isHeader && trimmed.length > 3 && trimmed.length < 100) {
        // Save previous section
        if (currentSection) {
          currentSection.content = sectionContent.join('\n').trim();
          sections.push(currentSection);
        }
        
        // Start new section
        const title = trimmed
          .replace(/^#{1,3}\s/, '')
          .replace(/^[-•]\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/:$/, '')
          .trim();
        
        currentSection = {
          id: `section_${Date.now()}_${index}`,
          title,
          content: '',
          lastUpdated: new Date().toISOString(),
        };
        sectionContent = [];
      } else if (trimmed.length > 0) {
        sectionContent.push(line);
      }
    });
    
    // Save last section
    if (currentSection) {
      currentSection.content = sectionContent.join('\n').trim();
      sections.push(currentSection);
    }
    
    // If no sections detected, create one section with all content
    if (sections.length === 0) {
      sections.push({
        id: `section_${Date.now()}`,
        title: 'Contenuto Principale',
        content: text.trim(),
        lastUpdated: new Date().toISOString(),
      });
    }
    
    return sections;
  };

  const findMatchingSection = (newSection: ContentSection, existingSections: ContentSection[]): ContentSection | null => {
    // Try exact title match first
    let match = existingSections.find(s => 
      s.title.toLowerCase() === newSection.title.toLowerCase()
    );
    
    if (match) return match;
    
    // Try fuzzy title match
    match = existingSections.find(s => {
      const similarity = calculateSimilarity(s.title.toLowerCase(), newSection.title.toLowerCase());
      return similarity > 0.7;
    });
    
    if (match) return match;
    
    // Try content similarity
    match = existingSections.find(s => {
      const similarity = calculateSimilarity(
        s.content.substring(0, 200).toLowerCase(),
        newSection.content.substring(0, 200).toLowerCase()
      );
      return similarity > 0.6;
    });
    
    return match || null;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const mergeContent = (oldDoc: DocumentVersion, newText: string): DocumentVersion => {
    const newSections = analyzeContent(newText);
    const mergedSections: ContentSection[] = [...oldDoc.sections];
    
    newSections.forEach(newSection => {
      const matchingSection = findMatchingSection(newSection, oldDoc.sections);
      
      if (matchingSection) {
        // Replace existing section
        const index = mergedSections.findIndex(s => s.id === matchingSection.id);
        mergedSections[index] = {
          ...newSection,
          id: matchingSection.id,
          isModified: true,
          lastUpdated: new Date().toISOString(),
        };
      } else {
        // Add new section
        mergedSections.push({
          ...newSection,
          isNew: true,
        });
      }
    });
    
    return {
      ...oldDoc,
      sections: mergedSections,
      updatedAt: new Date().toISOString(),
    };
  };

  const handleUpdateContent = () => {
    if (!selectedDoc || !newContent.trim()) {
      Alert.alert('Errore', 'Seleziona un documento e inserisci il nuovo contenuto');
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const updatedDoc = mergeContent(selectedDoc, newContent);
      const updatedDocs = documents.map(d => 
        d.id === updatedDoc.id ? updatedDoc : d
      );
      
      saveDocuments(updatedDocs);
      setSelectedDoc(updatedDoc);
      setNewContent('');
      setIsAnalyzing(false);
      
      Alert.alert(
        'Aggiornamento Completato',
        `Documento aggiornato con successo!\n\n` +
        `Sezioni modificate: ${updatedDoc.sections.filter(s => s.isModified).length}\n` +
        `Nuove sezioni: ${updatedDoc.sections.filter(s => s.isNew).length}`
      );
    }, 1000);
  };

  const createNewDocument = () => {
    if (!newContent.trim()) {
      Alert.alert('Errore', 'Inserisci del contenuto per creare un nuovo documento');
      return;
    }
    
    const sections = analyzeContent(newContent);
    const newDoc: DocumentVersion = {
      id: `doc_${Date.now()}`,
      name: `Documento ${documents.length + 1}`,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedDocs = [...documents, newDoc];
    saveDocuments(updatedDocs);
    setSelectedDoc(newDoc);
    setNewContent('');
    
    Alert.alert('Successo', 'Nuovo documento creato!');
  };

  const exportDocument = (doc: DocumentVersion) => {
    let exportText = `${doc.name}\n`;
    exportText += `Ultimo aggiornamento: ${new Date(doc.updatedAt).toLocaleString('it-IT')}\n`;
    exportText += `${'='.repeat(50)}\n\n`;
    
    doc.sections.forEach((section, index) => {
      const marker = section.isNew ? '🔹 NUOVO' : section.isModified ? '🔹 AGGIORNATO' : '';
      exportText += `${index + 1}. ${section.title} ${marker}\n`;
      exportText += `${'-'.repeat(40)}\n`;
      exportText += `${section.content}\n\n`;
    });
    
    console.log('Exported document:', exportText);
    Alert.alert(
      'Esportazione',
      'Il documento è stato preparato per l\'esportazione. Controlla la console per il contenuto completo.',
      [
        { text: 'OK' }
      ]
    );
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        console.log('Document picking cancelled');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('File picked:', file.name);
        
        // For now, show alert that file was selected
        Alert.alert(
          'File Selezionato',
          `File: ${file.name}\n\nIncolla il contenuto del file nell'area di testo sottostante.`
        );
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Errore', 'Impossibile selezionare il file');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Gestione Contenuti',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={[commonStyles.card, styles.infoCard]}>
          <View style={styles.infoHeader}>
            <IconSymbol name="doc.text.fill" size={32} color={colors.primary} />
            <Text style={styles.infoTitle}>Aggiornamento Automatico</Text>
          </View>
          <Text style={styles.infoText}>
            Carica o incolla nuovi contenuti per aggiornare automaticamente i tuoi documenti. 
            Il sistema identificherà le sezioni corrispondenti e sostituirà quelle obsolete.
          </Text>
          <Pressable
            style={styles.examplesButton}
            onPress={() => router.push('/content-examples' as any)}
          >
            <IconSymbol name="lightbulb.fill" size={18} color={colors.accent} />
            <Text style={styles.examplesButtonText}>Vedi Esempi</Text>
          </Pressable>
        </View>

        {/* Document Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documenti Salvati</Text>
          
          {documents.length === 0 ? (
            <View style={[commonStyles.card, styles.emptyCard]}>
              <IconSymbol name="doc.badge.plus" size={48} color={colors.textLight} />
              <Text style={styles.emptyText}>Nessun documento salvato</Text>
              <Text style={styles.emptySubtext}>Crea il tuo primo documento qui sotto</Text>
            </View>
          ) : (
            <View style={styles.documentsGrid}>
              {documents.map((doc) => (
                <Pressable
                  key={doc.id}
                  style={[
                    styles.documentCard,
                    selectedDoc?.id === doc.id && styles.documentCardSelected
                  ]}
                  onPress={() => setSelectedDoc(doc)}
                >
                  <View style={styles.documentHeader}>
                    <IconSymbol 
                      name="doc.text" 
                      size={24} 
                      color={selectedDoc?.id === doc.id ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.documentName,
                      selectedDoc?.id === doc.id && styles.documentNameSelected
                    ]}>
                      {doc.name}
                    </Text>
                  </View>
                  <Text style={styles.documentInfo}>
                    {doc.sections.length} sezioni
                  </Text>
                  <Text style={styles.documentDate}>
                    {new Date(doc.updatedAt).toLocaleDateString('it-IT')}
                  </Text>
                  
                  {selectedDoc?.id === doc.id && (
                    <Pressable
                      style={styles.exportButton}
                      onPress={() => exportDocument(doc)}
                    >
                      <IconSymbol name="square.and.arrow.up" size={16} color={colors.primary} />
                      <Text style={styles.exportButtonText}>Esporta</Text>
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Selected Document Preview */}
        {selectedDoc && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sezioni Attuali</Text>
            <View style={[commonStyles.card, styles.sectionsCard]}>
              {selectedDoc.sections.map((section, index) => (
                <View key={section.id} style={styles.sectionItem}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionNumber}>{index + 1}</Text>
                    <View style={styles.sectionInfo}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      {section.isNew && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>🔹 NUOVO</Text>
                        </View>
                      )}
                      {section.isModified && (
                        <View style={[styles.badge, styles.badgeModified]}>
                          <Text style={styles.badgeText}>🔹 AGGIORNATO</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.sectionPreview} numberOfLines={2}>
                    {section.content}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carica Nuovo Contenuto</Text>
          
          <Pressable
            style={styles.uploadButton}
            onPress={pickDocument}
          >
            <IconSymbol name="doc.badge.plus" size={24} color={colors.primary} />
            <Text style={styles.uploadButtonText}>Seleziona File</Text>
          </Pressable>

          <Text style={styles.orText}>oppure</Text>

          <View style={[commonStyles.card, styles.textInputCard]}>
            <Text style={styles.inputLabel}>Incolla o scrivi il nuovo contenuto:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Inserisci qui il testo aggiornato o nuovo contenuto..."
              placeholderTextColor={colors.textLight}
              value={newContent}
              onChangeText={setNewContent}
              textAlignVertical="top"
            />
            <Text style={styles.inputHint}>
              💡 Suggerimento: Usa intestazioni chiare per identificare le sezioni
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {selectedDoc ? (
            <Pressable
              style={[styles.actionButton, styles.updateButton]}
              onPress={handleUpdateContent}
              disabled={isAnalyzing || !newContent.trim()}
            >
              {isAnalyzing ? (
                <>
                  <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Analisi in corso...</Text>
                </>
              ) : (
                <>
                  <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Aggiorna Documento</Text>
                </>
              )}
            </Pressable>
          ) : (
            <Pressable
              style={[styles.actionButton, styles.createButton]}
              onPress={createNewDocument}
              disabled={!newContent.trim()}
            >
              <IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Crea Nuovo Documento</Text>
            </Pressable>
          )}
        </View>

        {/* Instructions */}
        <View style={[commonStyles.card, styles.instructionsCard]}>
          <Text style={styles.instructionsTitle}>📋 Come Funziona</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1.</Text>
              <Text style={styles.instructionText}>
                Seleziona un documento esistente o crea uno nuovo
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2.</Text>
              <Text style={styles.instructionText}>
                Carica un file o incolla il nuovo contenuto
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3.</Text>
              <Text style={styles.instructionText}>
                Il sistema analizza e identifica le sezioni
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4.</Text>
              <Text style={styles.instructionText}>
                Le sezioni corrispondenti vengono aggiornate automaticamente
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>5.</Text>
              <Text style={styles.instructionText}>
                I cambiamenti vengono evidenziati con 🔹
              </Text>
            </View>
          </View>
          
          <Pressable
            style={styles.aiGuideButton}
            onPress={() => router.push('/content-ai-guide' as any)}
          >
            <IconSymbol name="sparkles" size={18} color={colors.accent} />
            <Text style={styles.aiGuideButtonText}>Scopri il Potenziamento AI</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    marginBottom: 24,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  examplesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  examplesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  documentsGrid: {
    gap: 12,
  },
  documentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    ...commonStyles.shadow,
  },
  documentCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  documentNameSelected: {
    color: colors.primary,
  },
  documentInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary + '15',
    borderRadius: 8,
    gap: 6,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionsCard: {
    padding: 16,
  },
  sectionItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    width: 24,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionPreview: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: 36,
  },
  badge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  badgeModified: {
    backgroundColor: colors.primary + '20',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: 12,
    ...commonStyles.shadow,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
    marginVertical: 16,
  },
  textInputCard: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: colors.text,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  inputHint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 18,
    gap: 10,
    ...commonStyles.shadow,
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  createButton: {
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionsCard: {
    padding: 20,
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 24,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aiGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 16,
  },
  aiGuideButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
