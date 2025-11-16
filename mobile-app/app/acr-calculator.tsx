
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function ACRCalculatorScreen() {
  const [acuteLoad, setAcuteLoad] = useState('');
  const [chronicLoad, setChronicLoad] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState('');

  const calculateACR = () => {
    const acute = parseFloat(acuteLoad);
    const chronic = parseFloat(chronicLoad);

    if (isNaN(acute) || isNaN(chronic) || chronic === 0) {
      setResult(null);
      setInterpretation('Inserisci valori validi per calcolare l\'ACR');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const acr = acute / chronic;
    setResult(acr);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (acr < 0.8) {
      setInterpretation('⚠️ SOTTOCARICO - Rischio di perdita di forma. Considera di aumentare gradualmente il carico di allenamento per mantenere le prestazioni.');
    } else if (acr >= 0.8 && acr <= 1.3) {
      setInterpretation('✅ ZONA OTTIMALE - Il rapporto tra carico acuto e cronico è ideale. Continua con questo approccio per massimizzare le prestazioni riducendo il rischio infortuni.');
    } else if (acr > 1.3 && acr <= 1.5) {
      setInterpretation('⚠️ ATTENZIONE - Carico leggermente elevato. Monitora attentamente i segnali di affaticamento e considera un giorno di recupero attivo.');
    } else {
      setInterpretation('🚨 SOVRACCARICO - Alto rischio di infortuni! Riduci immediatamente il carico di allenamento e aumenta il recupero. Consulta il tuo preparatore.');
    }
  };

  const getResultColor = () => {
    if (!result) return colors.text;
    if (result < 0.8) return colors.warning;
    if (result >= 0.8 && result <= 1.3) return colors.success;
    if (result > 1.3 && result <= 1.5) return colors.warning;
    return colors.error;
  };

  const getResultGradient = () => {
    if (!result) return gradients.racing;
    if (result < 0.8) return gradients.warning;
    if (result >= 0.8 && result <= 1.3) return gradients.success;
    if (result > 1.3 && result <= 1.5) return gradients.warning;
    return gradients.error;
  };

  const getResultStatus = () => {
    if (!result) return 'IN ATTESA';
    if (result < 0.8) return 'SOTTOCARICO';
    if (result >= 0.8 && result <= 1.3) return 'OTTIMALE';
    if (result > 1.3 && result <= 1.5) return 'ATTENZIONE';
    return 'SOVRACCARICO';
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Calcolatore ACR',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={[commonStyles.cardRacing, styles.infoCard]}>
            <View style={styles.infoHeader}>
              <IconSymbol name="info.circle.fill" size={28} color={colors.primary} />
              <Text style={styles.infoTitle}>Cos&apos;è l&apos;ACR?</Text>
            </View>
            <Text style={styles.infoText}>
              L&apos;ACR (Acute:Chronic Workload Ratio) è uno strumento fondamentale per prevenire infortuni. 
              Confronta il carico di allenamento della settimana corrente con la media delle ultime 4 settimane, 
              aiutandoti a identificare picchi pericolosi di carico.
            </Text>
          </View>

          {/* Input Card */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="pencil.circle.fill" size={24} color={colors.accent} />
              <Text style={styles.sectionTitle}>Inserisci i Dati</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carico Acuto (ultima settimana)</Text>
              <Text style={styles.inputHint}>Somma delle unità di carico dell&apos;ultima settimana</Text>
              <View style={styles.inputWrapper}>
                <IconSymbol name="calendar.badge.clock" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={acuteLoad}
                  onChangeText={setAcuteLoad}
                  keyboardType="decimal-pad"
                  placeholder="es. 2500"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carico Cronico (media 4 settimane)</Text>
              <Text style={styles.inputHint}>Media del carico delle ultime 4 settimane</Text>
              <View style={styles.inputWrapper}>
                <IconSymbol name="chart.bar.fill" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={chronicLoad}
                  onChangeText={setChronicLoad}
                  keyboardType="decimal-pad"
                  placeholder="es. 2200"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <Pressable 
              style={styles.calculateButton} 
              onPress={calculateACR}
            >
              <LinearGradient
                colors={gradients.racing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.calculateButtonGradient}
              >
                <IconSymbol name="function" size={22} color="#FFFFFF" />
                <Text style={styles.calculateButtonText}>Calcola ACR</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Result Card */}
          {result !== null && (
            <LinearGradient
              colors={getResultGradient()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.resultCard}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Rapporto ACR</Text>
                <View style={styles.resultStatusBadge}>
                  <Text style={styles.resultStatusText}>{getResultStatus()}</Text>
                </View>
              </View>
              <Text style={styles.resultValue}>{result.toFixed(2)}</Text>
              <View style={styles.interpretationContainer}>
                <Text style={styles.interpretationText}>{interpretation}</Text>
              </View>
            </LinearGradient>
          )}

          {/* Guide Card */}
          <View style={commonStyles.card}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="book.fill" size={24} color={colors.purple} />
              <Text style={styles.sectionTitle}>Guida Interpretazione</Text>
            </View>
            
            <View style={styles.guideItem}>
              <LinearGradient
                colors={gradients.warning}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guideDot}
              />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>&lt; 0.8 - Sottocarico</Text>
                <Text style={styles.guideDescription}>
                  Carico insufficiente, rischio detraining. Aumenta gradualmente l&apos;intensità.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <LinearGradient
                colors={gradients.success}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guideDot}
              />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>0.8 - 1.3 - Zona Ottimale</Text>
                <Text style={styles.guideDescription}>
                  Range ideale per progressione sicura e massimizzazione prestazioni.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <LinearGradient
                colors={gradients.warning}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guideDot}
              />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>1.3 - 1.5 - Attenzione</Text>
                <Text style={styles.guideDescription}>
                  Carico elevato, monitorare attentamente. Considera recupero attivo.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <LinearGradient
                colors={gradients.error}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guideDot}
              />
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>&gt; 1.5 - Sovraccarico</Text>
                <Text style={styles.guideDescription}>
                  Alto rischio infortuni! Riduci immediatamente il carico.
                </Text>
              </View>
            </View>
          </View>

          {/* Example Card */}
          <View style={[commonStyles.card, styles.exampleCard]}>
            <View style={styles.exampleHeader}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.warning} />
              <Text style={styles.sectionTitle}>Esempio Pratico</Text>
            </View>
            <View style={styles.exampleContent}>
              <View style={styles.exampleRow}>
                <Text style={styles.exampleLabel}>Settimana corrente:</Text>
                <Text style={styles.exampleValue}>2600 unità</Text>
              </View>
              <View style={styles.exampleRow}>
                <Text style={styles.exampleLabel}>Media 4 settimane:</Text>
                <Text style={styles.exampleValue}>2200 unità</Text>
              </View>
              <View style={styles.exampleDivider} />
              <View style={styles.exampleRow}>
                <Text style={styles.exampleLabel}>ACR:</Text>
                <Text style={[styles.exampleValue, styles.exampleResult]}>1.18</Text>
              </View>
              <View style={styles.exampleBadge}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                <Text style={styles.exampleBadgeText}>Zona Ottimale ✅</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  inputHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 17,
    color: colors.text,
    fontWeight: '600',
  },
  calculateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  calculateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  resultCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    ...shadows.large,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  resultStatusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  interpretationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    padding: 18,
  },
  interpretationText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '600',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  guideDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: 14,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  guideDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: colors.highlightBlue,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  exampleContent: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  exampleValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  exampleResult: {
    fontSize: 24,
    color: colors.success,
  },
  exampleDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 12,
  },
  exampleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  exampleBadgeText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '700',
  },
});
