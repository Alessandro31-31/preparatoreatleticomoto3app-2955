
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'calendar',
      route: '/(tabs)/calendar',
      icon: 'calendar',
      label: 'Calendario',
    },
    {
      name: 'readiness',
      route: '/(tabs)/readiness',
      icon: 'heart.fill',
      label: 'Prontezza',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'chart.bar.fill',
      label: 'Progressi',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="calendar">
          <Icon sf="calendar" drawable="ic_calendar" />
          <Label>Calendario</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="readiness">
          <Icon sf="heart.fill" drawable="ic_heart" />
          <Label>Prontezza</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="progress">
          <Icon sf="chart.bar.fill" drawable="ic_chart" />
          <Label>Progressi</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="readiness" />
        <Stack.Screen name="progress" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
