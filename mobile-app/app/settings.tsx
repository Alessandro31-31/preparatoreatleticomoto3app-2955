
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, shadows, gradients } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface Setting {
  title: string;
  description: string;
  icon: string;
  color: string;
  route?: string;
  action?: () => void;
  isDanger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  const handlePress = (route?: string, action?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action) {
      action();
    } else if (route) {
      router.push(route as any);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Cancella Tutti i Dati',
      'Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Cancella',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('All data cleared successfully');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Successo', 'Tutti i dati sono stati cancellati');
            } catch (error) {
              console.log('Error clearing data:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Errore', 'Errore durante la cancellazione dei dati');
            }
          },
        },
      ]
    );
  };

  const contentManagement: Setting[] = [
    {
      title: 'Modifica Dati da File',
      description: 'Aggiorna sezioni caricando file .txt',
      icon: 'arrow.up.doc.fill',
      color: colors.primary,
      route: '/edit-data',
    },
    {
      title: 'Aggiornamento Automatico',
      description: 'Gestisci e aggiorna contenuti automaticamente',
      icon: 'doc.text.fill',
      color: colors.primary,
      route: '/content-manager',
    },
  ];

  const dataSettings: Setting[] = [
    {
      title: 'Routine Mattutina',
      description: 'Modifica gli elementi della routine',
      icon: 'sunrise.fill',
      color: '#FF9500',
      route: '/edit-morning-routine',
    },
    {
      title: 'Esercizi Riscaldamento',
      description: 'Personalizza gli esercizi di warmup',
      icon: 'flame.fill',
      color: '#FF3B30',
      route: '/edit-warmup',
    },
    {
      title: 'Esercizi Raffreddamento',
      description: 'Modifica gli esercizi di cooldown',
      icon: 'figure.cooldown',
      color: '#5AC8FA',
      route: '/edit-cooldown',
    },
    {
      title: 'Esercizi Stretching',
      description: 'Personalizza gli esercizi di stretching',
      icon: 'figure.flexibility',
      color: '#34C759',
      route: '/edit-stretching',
    },
    {
      title: 'Foam Rolling',
      description: 'Modifica il protocollo foam rolling',
      icon: 'cylinder.fill',
      color: '#AF52DE',
      route: '/edit-foam-rolling',
    },
    {
      title: 'Riferimento Rapido',
      description: 'Modifica le linee guida rapide',
      icon: 'book.fill',
      color: '#0A84FF',
      route: '/edit-quick-reference',
    },
  ];

  const renderSettingCard = (setting: Setting, index: number) => (
    <Pressable
      key={index}
      style={[
        styles.settingCard,
        setting.isDanger && styles.dangerCard,
      ]}
      onPress={() => handlePress(setting.route, setting.action)}
    >
      <View style={[styles.iconContainer, { backgroundColor: setting.color + '20' }]}>
        <IconSymbol name={setting.icon as any} size={24} color={setting.color} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, setting.isDanger && styles.dangerText]}>
          {setting.title}
        </Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      <IconSymbol 
        name="chevron.right" 
        size={20} 
        color={setting.isDanger ? '#FF3B30' : colors.textSecondary} 
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Impostazioni',
          presentation: 'card',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.scrollView}
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
              <IconSymbol name="gearshape.fill" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Impostazioni</Text>
            <Text style={styles.headerDescription}>
              Personalizza e gestisci i contenuti dell&apos;app
            </Text>
          </LinearGradient>

          {/* Content Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="doc.text.fill" size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Gestione Contenuti</Text>
            </View>
            {contentManagement.map((setting, index) => renderSettingCard(setting, index))}
          </View>

          {/* Data Editing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="pencil.circle.fill" size={22} color={colors.info} />
              <Text style={styles.sectionTitle}>Modifica Dati</Text>
            </View>
            {dataSettings.map((setting, index) => renderSettingCard(setting, index))}
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="externaldrive.fill" size={22} color={colors.warning} />
              <Text style={styles.sectionTitle}>Gestione Dati</Text>
            </View>
            {renderSettingCard({
              title: 'Cancella Tutti i Dati',
              description: 'Rimuovi tutti i dati salvati dall&apos;app',
              icon: 'trash.fill',
              color: '#FF3B30',
              action: clearAllData,
              isDanger: true,
            }, 0)}
          </View>

          {/* Info Card */}
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={styles.infoIconContainer}>
              <IconSymbol name="info.circle.fill" size={28} color={colors.info} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Suggerimento</Text>
              <Text style={styles.infoText}>
                Puoi aggiornare i contenuti caricando file di testo o modificando direttamente i dati esistenti
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
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
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  dangerCard: {
    backgroundColor: '#FF3B3010',
    borderWidth: 1,
    borderColor: '#FF3B3040',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  dangerText: {
    color: '#FF3B30',
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlightBlue,
  },
  infoIconContainer: {
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
});
