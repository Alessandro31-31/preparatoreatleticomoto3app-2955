
/**
 * Offline mode indicator component
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetworkState } from 'expo-network';
import { IconSymbol } from './IconSymbol';
import { colors, shadows } from '@/styles/commonStyles';

export function OfflineIndicator() {
  const networkState = useNetworkState();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const offline = !networkState.isConnected || networkState.isInternetReachable === false;
    
    if (offline !== isOffline) {
      setIsOffline(offline);
      
      Animated.spring(slideAnim, {
        toValue: offline ? 0 : -100,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <IconSymbol name="wifi.slash" size={16} color={colors.racingWhite} />
      <Text style={styles.text}>Offline Mode - Changes saved locally</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 1000,
    ...shadows.medium,
  },
  text: {
    color: colors.racingWhite,
    fontSize: 14,
    fontWeight: '600',
  },
});
