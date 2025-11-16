
/**
 * Reusable error state component
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, shadows } from '@/styles/commonStyles';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({ message, onRetry, fullScreen = false }: ErrorStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.iconContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.error} />
      </View>
      
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <IconSymbol name="arrow.clockwise" size={20} color={colors.racingWhite} />
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlightRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...commonStyles.subtitle,
    marginBottom: 8,
  },
  message: {
    ...commonStyles.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    ...commonStyles.button,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  buttonText: {
    ...commonStyles.buttonText,
  },
});
