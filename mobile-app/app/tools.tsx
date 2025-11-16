
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Tool {
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  info: string;
  route: string;
  badge: string;
  category: string;
}

export default function ToolsScreen() {
  const router = useRouter();

  const handleToolPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route as any);
  };

  const tools: Tool[] = [
    // Essential Tools
    {
      title: 'Calcolatore ACR',
      description: 'Acute:Chronic Workload Ratio',
      icon: 'function',
      gradient: gradients.racing,
      info: 'Monitora il rapporto tra carico acuto e cronico per prevenire infortuni',
      route: '/acr-calculator',
      badge: 'ESSENZIALE',
      category: 'essential',
    },
    {
      title: 'Timer Multi-Intervallo',
      description: 'Gestione sessioni allenamento',
      icon: 'timer',
      gradient: gradients.blue,
      info: 'Timer avanzato per gestire intervalli e sessioni di allenamento',
      route: '/timer',
      badge: 'ESSENZIALE',
      category: 'essential',
    },
    {
      title: 'Tracker del Carico',
      description: 'Monitoraggio carico allenamento',
      icon: 'chart.line.uptrend.xyaxis',
      gradient: gradients.success,
      info: 'Registra e analizza il carico di allenamento settimanale',
      route: '/load-tracker',
      badge: 'PRO',
      category: 'essential',
    },

    // Performance Analysis
    {
      title: 'Monitor HRV',
      description: 'Heart Rate Variability',
      icon: 'waveform.path.ecg',
      gradient: gradients.error,
      info: 'Traccia la variabilità della frequenza cardiaca per valutare il recupero',
      route: '/hrv-monitor',
      badge: 'AVANZATO',
      category: 'performance',
    },
    {
      title: 'Valutazione Postura',
      description: 'Analisi posturale pilota',
      icon: 'figure.stand',
      gradient: gradients.warning,
      info: 'Valuta e migliora la postura specifica per la guida',
      route: '/posture-assessment',
      badge: 'SPECIFICO',
      category: 'performance',
    },
    {
      title: 'Test Tempo di Reazione',
      description: 'Simulazione partenza gara',
      icon: 'bolt.fill',
      gradient: ['#FF8C00', '#FF6B00'],
      info: 'Allena e misura il tempo di reazione ai semafori di partenza',
      route: '/reaction-time',
      badge: 'GARA',
      category: 'performance',
    },

    // Racing Tools
    {
      title: 'Simulatore Giro',
      description: 'Analisi tempi e settori',
      icon: 'flag.checkered',
      gradient: gradients.blue,
      info: 'Analizza i tempi sul giro e confronta i settori',
      route: '/lap-simulator',
      badge: 'PERFORMANCE',
      category: 'racing',
    },
    {
      title: 'Setup Moto',
      description: 'Configurazione e telemetria',
      icon: 'wrench.and.screwdriver.fill',
      gradient: gradients.purple,
      info: 'Registra e ottimizza il setup della moto per ogni circuito',
      route: '/bike-setup',
      badge: 'TECNICO',
      category: 'racing',
    },
    {
      title: 'Telemetria Avanzata',
      description: 'Comparazione dati telemetrici',
      icon: 'chart.xyaxis.line',
      gradient: gradients.cyan,
      info: 'Confronta velocità, gas, freno e RPM tra diverse sessioni',
      route: '/telemetry-comparison',
      badge: 'PRO',
      category: 'racing',
    },

    // AI & Advanced
    {
      title: 'Analisi Video AI',
      description: 'Analisi tecnica con intelligenza artificiale',
      icon: 'camera.fill',
      gradient: gradients.racing,
      info: 'Carica video e ricevi feedback dettagliato su postura e tecnica',
      route: '/video-analysis',
      badge: 'AI',
      category: 'ai',
    },
    {
      title: 'Biomeccanica 3D',
      description: 'Analisi movimento avanzata',
      icon: 'figure.walk.motion',
      gradient: gradients.warning,
      info: 'Analisi tridimensionale di angoli articolari e distribuzione forze',
      route: '/biomechanics-3d',
      badge: '3D',
      category: 'ai',
    },
    {
      title: 'Coach Virtuale',
      description: 'Feedback real-time durante sessione',
      icon: 'person.badge.shield.checkmark.fill',
      gradient: gradients.blue,
      info: 'Assistente AI che monitora le tue prestazioni in tempo reale',
      route: '/virtual-coach',
      badge: 'LIVE',
      category: 'ai',
    },

    // Wellness
    {
      title: 'Allenamento Mentale',
      description: 'Meditazione e visualizzazione',
      icon: 'brain.head.profile',
      gradient: gradients.purple,
      info: 'Esercizi guidati per migliorare concentrazione e gestire la pressione',
      route: '/mental-training',
      badge: 'MENTAL',
      category: 'wellness',
    },
    {
      title: 'Diario Alimentare',
      description: 'Tracking macro e nutrizione',
      icon: 'fork.knife',
      gradient: gradients.success,
      info: 'Monitora calorie e macronutrienti per ottimizzare le prestazioni',
      route: '/nutrition-diary',
      badge: 'NUTRITION',
      category: 'wellness',
    },
  ];

  const categories = [
    { id: 'essential', title: 'Strumenti Essenziali', icon: 'star.fill', color: colors.racingGold },
    { id: 'performance', title: 'Analisi Performance', icon: 'chart.bar.fill', color: colors.primary },
    { id: 'racing', title: 'Strumenti Gara', icon: 'flag.checkered', color: colors.info },
    { id: 'ai', title: 'Tecnologie AI', icon: 'sparkles', color: colors.accent },
    { id: 'wellness', title: 'Benessere', icon: 'heart.fill', color: colors.success },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Strumenti Professionali',
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
            colors={gradients.racing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <View style={styles.headerIconContainer}>
              <IconSymbol name="wrench.and.screwdriver.fill" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Suite Professionale</Text>
            <Text style={styles.headerDescription}>
              {tools.length} strumenti avanzati per piloti professionisti
            </Text>
          </LinearGradient>

          {/* Organized by Category */}
          {categories.map((category) => {
            const categoryTools = tools.filter(tool => tool.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <View key={category.id} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                    <IconSymbol name={category.icon as any} size={20} color={category.color} />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{categoryTools.length}</Text>
                  </View>
                </View>

                {categoryTools.map((tool, index) => (
                  <Pressable
                    key={index}
                    style={styles.toolCard}
                    onPress={() => handleToolPress(tool.route)}
                  >
                    <LinearGradient
                      colors={tool.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.toolGradient}
                    >
                      <View style={styles.toolIconContainer}>
                        <IconSymbol name={tool.icon as any} size={32} color="#FFFFFF" />
                      </View>
                    </LinearGradient>
                    
                    <View style={styles.toolContent}>
                      <View style={styles.toolHeader}>
                        <Text style={styles.toolTitle}>{tool.title}</Text>
                        <View style={[styles.toolBadge, { backgroundColor: category.color + '15' }]}>
                          <Text style={[styles.toolBadgeText, { color: category.color }]}>{tool.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.toolDescription}>{tool.description}</Text>
                      <Text style={styles.toolInfo}>{tool.info}</Text>
                    </View>
                    
                    <View style={styles.toolArrow}>
                      <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
                    </View>
                  </Pressable>
                ))}
              </View>
            );
          })}

          {/* Bottom Spacing */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
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
    marginBottom: 8,
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
  categorySection: {
    marginBottom: 28,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  toolCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  toolGradient: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toolIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolContent: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  toolTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    flex: 1,
  },
  toolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  toolBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  toolDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 5,
  },
  toolInfo: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  toolArrow: {
    marginLeft: 12,
  },
});
