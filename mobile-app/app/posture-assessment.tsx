
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface PostureCheck {
  id: string;
  area: string;
  question: string;
  score: number;
}

export default function PostureAssessmentScreen() {
  const [checks, setChecks] = useState<PostureCheck[]>([
    { id: '1', area: 'Collo', question: 'Posizione neutra del collo in sella', score: 0 },
    { id: '2', area: 'Spalle', question: 'Spalle rilassate e abbassate', score: 0 },
    { id: '3', area: 'Schiena', question: 'Curva lombare naturale mantenuta', score: 0 },
    { id: '4', area: 'Braccia', question: 'Gomiti leggermente flessi', score: 0 },
    { id: '5', area: 'Polsi', question: 'Polsi in linea con avambracci', score: 0 },
    { id: '6', area: 'Core', question: 'Addominali attivati e stabili', score: 0 },
    { id: '7', area: 'Anche', question: 'Anche mobili e flessibili', score: 0 },
    { id: '8', area: 'Ginocchia', question: 'Ginocchia aderenti al serbatoio', score: 0 },
    { id: '9', area: 'Caviglie', question: 'Caviglie mobili per controllo pedane', score: 0 },
    { id: '10', area: 'Equilibrio', question: 'Peso distribuito correttamente', score: 0 },
  ]);

  const [showResults, setShowResults] = useState(false);

  const updateScore = (id: string, score: number) => {
    setChecks(checks.map(check => 
      check.id === id ? { ...check, score } : check
    ));
    setShowResults(false);
  };

  const calculateTotalScore = () => {
    const total = checks.reduce((sum, check) => sum + check.score, 0);
    const maxScore = checks.length * 5;
    return Math.round((total / maxScore) * 100);
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 90) return { text: 'ECCELLENTE', color: colors.accent, icon: 'star.fill' };
    if (score >= 75) return { text: 'BUONO', color: colors.primary, icon: 'checkmark.circle.fill' };
    if (score >= 60) return { text: 'DISCRETO', color: colors.warning, icon: 'exclamationmark.circle.fill' };
    return { text: 'DA MIGLIORARE', color: colors.secondary, icon: 'xmark.circle.fill' };
  };

  const getRecommendations = () => {
    const lowScoreAreas = checks.filter(check => check.score <= 2);
    if (lowScoreAreas.length === 0) {
      return ['Ottima postura! Continua con il lavoro di mantenimento.'];
    }
    
    const recommendations: string[] = [];
    lowScoreAreas.forEach(check => {
      switch (check.area) {
        case 'Collo':
          recommendations.push('- Esercizi di mobilità cervicale e rinforzo muscolatura del collo');
          break;
        case 'Spalle':
          recommendations.push('- Stretching pettorali e rinforzo trapezio medio/basso');
          break;
        case 'Schiena':
          recommendations.push('- Esercizi di core stability e mobilità toracica');
          break;
        case 'Braccia':
          recommendations.push('- Rinforzo bicipiti e tricipiti con focus su resistenza');
          break;
        case 'Polsi':
          recommendations.push('- Esercizi di mobilità e rinforzo avambracci');
          break;
        case 'Core':
          recommendations.push('- Plank, dead bug, bird dog per stabilità core');
          break;
        case 'Anche':
          recommendations.push('- Stretching flessori anca e mobilità articolare');
          break;
        case 'Ginocchia':
          recommendations.push('- Rinforzo quadricipiti e adduttori');
          break;
        case 'Caviglie':
          recommendations.push('- Esercizi di mobilità caviglia e propriocezione');
          break;
        case 'Equilibrio':
          recommendations.push('- Esercizi su superfici instabili e propriocezione');
          break;
      }
    });
    return recommendations;
  };

  const analyzePosture = () => {
    setShowResults(true);
  };

  const totalScore = calculateTotalScore();
  const interpretation = getScoreInterpretation(totalScore);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Valutazione Postura',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[commonStyles.card, styles.infoCard]}>
            <IconSymbol name="figure.stand" size={24} color={colors.warning} />
            <Text style={styles.infoText}>
              Valuta la tua postura in sella. Assegna un punteggio da 1 (scarso) a 5 (ottimo) per ogni aspetto.
            </Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Valutazione Posturale</Text>
            
            {checks.map((check) => (
              <View key={check.id} style={styles.checkContainer}>
                <View style={styles.checkHeader}>
                  <Text style={styles.checkArea}>{check.area}</Text>
                  <Text style={styles.checkQuestion}>{check.question}</Text>
                </View>
                
                <View style={styles.scoreButtons}>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Pressable
                      key={score}
                      style={[
                        styles.scoreButton,
                        check.score === score && styles.scoreButtonActive,
                      ]}
                      onPress={() => updateScore(check.id, score)}
                    >
                      <Text
                        style={[
                          styles.scoreButtonText,
                          check.score === score && styles.scoreButtonTextActive,
                        ]}
                      >
                        {score}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}

            <Pressable style={styles.analyzeButton} onPress={analyzePosture}>
              <IconSymbol name="chart.bar.fill" size={20} color="#FFFFFF" />
              <Text style={styles.analyzeButtonText}>Analizza Postura</Text>
            </Pressable>
          </View>

          {showResults && (
            <>
              <View style={[commonStyles.card, styles.resultCard]}>
                <IconSymbol name={interpretation.icon as any} size={48} color={interpretation.color} />
                <Text style={styles.resultLabel}>Punteggio Totale</Text>
                <Text style={[styles.resultValue, { color: interpretation.color }]}>
                  {totalScore}%
                </Text>
                <Text style={[styles.resultInterpretation, { color: interpretation.color }]}>
                  {interpretation.text}
                </Text>
              </View>

              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Raccomandazioni</Text>
                {getRecommendations().map((rec, index) => (
                  <Text key={index} style={styles.recommendation}>
                    {rec}
                  </Text>
                ))}
              </View>

              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Aree di Forza</Text>
                {checks
                  .filter(check => check.score >= 4)
                  .map((check) => (
                    <View key={check.id} style={styles.strengthItem}>
                      <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
                      <Text style={styles.strengthText}>{check.area}: {check.question}</Text>
                    </View>
                  ))}
                {checks.filter(check => check.score >= 4).length === 0 && (
                  <Text style={styles.noDataText}>
                    Continua a lavorare per migliorare la tua postura
                  </Text>
                )}
              </View>

              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Aree da Migliorare</Text>
                {checks
                  .filter(check => check.score <= 2 && check.score > 0)
                  .map((check) => (
                    <View key={check.id} style={styles.weaknessItem}>
                      <IconSymbol name="exclamationmark.circle.fill" size={20} color={colors.warning} />
                      <Text style={styles.weaknessText}>{check.area}: {check.question}</Text>
                    </View>
                  ))}
                {checks.filter(check => check.score <= 2 && check.score > 0).length === 0 && (
                  <Text style={styles.noDataText}>
                    Nessuna area critica identificata
                  </Text>
                )}
              </View>
            </>
          )}

          <View style={[commonStyles.card, styles.tipsCard]}>
            <Text style={styles.sectionTitle}>Consigli per la Valutazione</Text>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipText}>
                Esegui la valutazione dopo una sessione di guida o simulazione
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipText}>
                Chiedi a un compagno o allenatore di osservarti in sella
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipText}>
                Ripeti la valutazione ogni 2-3 settimane per monitorare i progressi
              </Text>
            </View>

            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4</Text>
              <Text style={styles.tipText}>
                Registra video della tua postura per un&apos;analisi più accurata
              </Text>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  checkContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkHeader: {
    marginBottom: 12,
  },
  checkArea: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  checkQuestion: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  scoreButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  scoreButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreButtonTextActive: {
    color: '#FFFFFF',
  },
  analyzeButton: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultInterpretation: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
  recommendation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  strengthText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  weaknessItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  weaknessText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: colors.highlight,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
