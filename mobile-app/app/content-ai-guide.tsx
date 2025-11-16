
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ContentAIGuideScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Guida AI Enhancement',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.card, styles.headerCard]}>
          <IconSymbol name="sparkles" size={48} color={colors.accent} />
          <Text style={styles.headerTitle}>Potenziamento AI</Text>
          <Text style={styles.headerSubtitle}>
            Migliora il Content Manager con intelligenza artificiale
          </Text>
        </View>

        {/* Quick Access to Edit Data */}
        <Pressable
          style={[commonStyles.card, styles.quickAccessCard]}
          onPress={() => router.push('/edit-data' as any)}
        >
          <View style={styles.quickAccessIcon}>
            <IconSymbol name="arrow.up.doc.fill" size={28} color={colors.primary} />
          </View>
          <View style={styles.quickAccessInfo}>
            <Text style={styles.quickAccessTitle}>Modifica Dati da File</Text>
            <Text style={styles.quickAccessDescription}>
              Aggiorna rapidamente le sezioni caricando file .txt
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.primary} />
        </Pressable>

        {/* Current Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Funzionalità Attuali</Text>
          <View style={[commonStyles.card, styles.featureCard]}>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
              <Text style={styles.featureText}>
                Analisi automatica delle sezioni del documento
              </Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
              <Text style={styles.featureText}>
                Matching intelligente tra sezioni vecchie e nuove
              </Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
              <Text style={styles.featureText}>
                Evidenziazione automatica delle modifiche
              </Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
              <Text style={styles.featureText}>
                Gestione locale senza necessità di backend
              </Text>
            </View>
          </View>
        </View>

        {/* AI Enhancement Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Potenziamenti AI Disponibili</Text>
          
          <View style={[commonStyles.card, styles.enhancementCard]}>
            <View style={styles.enhancementHeader}>
              <IconSymbol name="brain" size={24} color={colors.primary} />
              <Text style={styles.enhancementTitle}>OpenAI GPT-4</Text>
            </View>
            <Text style={styles.enhancementDescription}>
              Integra GPT-4 per analisi semantica avanzata, miglioramento automatico del testo, 
              e suggerimenti intelligenti per l&apos;organizzazione dei contenuti.
            </Text>
            <View style={styles.enhancementFeatures}>
              <Text style={styles.enhancementFeature}>• Analisi semantica profonda</Text>
              <Text style={styles.enhancementFeature}>• Miglioramento automatico della fluidità</Text>
              <Text style={styles.enhancementFeature}>• Suggerimenti di organizzazione</Text>
              <Text style={styles.enhancementFeature}>• Correzione grammaticale e stilistica</Text>
            </View>
          </View>

          <View style={[commonStyles.card, styles.enhancementCard]}>
            <View style={styles.enhancementHeader}>
              <IconSymbol name="doc.text.magnifyingglass" size={24} color={colors.purple} />
              <Text style={styles.enhancementTitle}>Analisi Avanzata</Text>
            </View>
            <Text style={styles.enhancementDescription}>
              Utilizza algoritmi di NLP per identificare automaticamente argomenti, 
              entità e relazioni tra sezioni.
            </Text>
            <View style={styles.enhancementFeatures}>
              <Text style={styles.enhancementFeature}>• Riconoscimento automatico di argomenti</Text>
              <Text style={styles.enhancementFeature}>• Estrazione di entità (date, nomi, luoghi)</Text>
              <Text style={styles.enhancementFeature}>• Analisi delle relazioni tra sezioni</Text>
              <Text style={styles.enhancementFeature}>• Suggerimenti di collegamenti</Text>
            </View>
          </View>

          <View style={[commonStyles.card, styles.enhancementCard]}>
            <View style={styles.enhancementHeader}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={24} color="#FF9500" />
              <Text style={styles.enhancementTitle}>Merge Intelligente</Text>
            </View>
            <Text style={styles.enhancementDescription}>
              AI che comprende il contesto e unisce contenuti in modo intelligente, 
              preservando informazioni importanti.
            </Text>
            <View style={styles.enhancementFeatures}>
              <Text style={styles.enhancementFeature}>• Risoluzione automatica dei conflitti</Text>
              <Text style={styles.enhancementFeature}>• Preservazione delle informazioni critiche</Text>
              <Text style={styles.enhancementFeature}>• Unione contestuale dei contenuti</Text>
              <Text style={styles.enhancementFeature}>• Rilevamento di duplicati semantici</Text>
            </View>
          </View>
        </View>

        {/* Implementation Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠 Come Implementare</Text>
          
          <View style={[commonStyles.card, styles.guideCard]}>
            <Text style={styles.guideStep}>1. Abilita Supabase</Text>
            <Text style={styles.guideText}>
              Premi il pulsante Supabase nell&apos;interfaccia e connettiti a un progetto Supabase 
              (crea uno nuovo se necessario).
            </Text>
          </View>

          <View style={[commonStyles.card, styles.guideCard]}>
            <Text style={styles.guideStep}>2. Configura OpenAI</Text>
            <Text style={styles.guideText}>
              Aggiungi la tua chiave API OpenAI come variabile d&apos;ambiente in Supabase:
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>OPENAI_API_KEY=sk-...</Text>
            </View>
          </View>

          <View style={[commonStyles.card, styles.guideCard]}>
            <Text style={styles.guideStep}>3. Crea Edge Function</Text>
            <Text style={styles.guideText}>
              Crea una Supabase Edge Function per gestire le richieste AI. 
              Usa gli esempi forniti nella documentazione Natively.
            </Text>
          </View>

          <View style={[commonStyles.card, styles.guideCard]}>
            <Text style={styles.guideStep}>4. Integra nel Content Manager</Text>
            <Text style={styles.guideText}>
              Modifica il Content Manager per chiamare la tua Edge Function invece 
              dell&apos;analisi locale.
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💎 Vantaggi dell&apos;AI</Text>
          
          <View style={[commonStyles.card, styles.benefitsCard]}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <IconSymbol name="bolt.fill" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Velocità</Text>
                <Text style={styles.benefitText}>
                  Analisi e aggiornamento istantanei anche per documenti complessi
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.accent }]}>
                <IconSymbol name="star.fill" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Qualità</Text>
                <Text style={styles.benefitText}>
                  Miglioramento automatico della coerenza e fluidità del testo
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.purple }]}>
                <IconSymbol name="brain" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Intelligenza</Text>
                <Text style={styles.benefitText}>
                  Comprensione semantica profonda del contenuto
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#FF9500' }]}>
                <IconSymbol name="wand.and.stars" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Automazione</Text>
                <Text style={styles.benefitText}>
                  Riduzione drastica del lavoro manuale di editing
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={[commonStyles.card, styles.ctaCard]}>
          <IconSymbol name="info.circle.fill" size={32} color={colors.primary} />
          <Text style={styles.ctaTitle}>Pronto per il Potenziamento?</Text>
          <Text style={styles.ctaText}>
            Il sistema attuale funziona perfettamente senza AI, ma se vuoi portare 
            la gestione dei contenuti al livello successivo, segui la guida sopra 
            per integrare OpenAI.
          </Text>
          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push('/content-manager' as any)}
          >
            <Text style={styles.ctaButtonText}>Torna al Content Manager</Text>
            <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
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
  headerCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
  featureCard: {
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  enhancementCard: {
    padding: 20,
    marginBottom: 12,
  },
  enhancementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  enhancementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  enhancementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  enhancementFeatures: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  enhancementFeature: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  guideCard: {
    padding: 20,
    marginBottom: 12,
  },
  guideStep: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  codeText: {
    fontSize: 12,
    color: colors.accent,
    fontFamily: 'monospace',
  },
  benefitsCard: {
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    ...commonStyles.shadow,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAccessCard: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickAccessInfo: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  quickAccessDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
