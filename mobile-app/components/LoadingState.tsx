
/**
 * Reusable loading state component
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, gradients } from '@/styles/commonStyles';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  if (fullScreen) {
    return (
      <LinearGradient colors={gradients.carbon} style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.fullScreenText}>{message}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...commonStyles.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenText: {
    ...commonStyles.text,
    color: colors.racingWhite,
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
});
