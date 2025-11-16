
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, commonStyles, shadows } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = '@calendar_completion_data';

const TRAINING_TYPES = {
  FORZA_MAX: { label: 'Forza Massimale', color: '#FF4444', icon: '💪' },
  POTENZA: { label: 'Potenza', color: '#FF8C00', icon: '⚡' },
  RESISTENZA: { label: 'Resistenza', color: '#4CAF50', icon: '🏃' },
  TECNICO: { label: 'Tecnico Specifico', color: '#2196F3', icon: '🏍️' },
  MOBILITA: { label: 'Mobilità/Correttivo', color: '#9C27B0', icon: '🧘' },
  RECUPERO: { label: 'Recupero Attivo', color: '#00BCD4', icon: '💨' },
  RIPOSO: { label: 'Riposo Completo', color: '#757575', icon: '🛏️' },
  DELOAD: { label: 'Deload', color: '#FFB300', icon: '⬇️' },
  GARA: { label: 'Gara', color: '#FFD700', icon: '🏁' },
};

// Dati completi 18 settimane
const COMPLETE_TRAINING_DATA = {
  // SETTIMANA 1
  1: {
    0: { // Lunedì
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' - Anti-Iperlordosi',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, tempo: '3"', rest: '0"', notes: 'Mobilità TUTTA colonna', rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', tempo: 'Box 4-2-4', rest: '0"', notes: 'Allungamento lombare', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, tempo: '2" pausa', rest: '0"', notes: 'RETROVERSIONE', rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', tempo: 'Hold', rest: '0"', notes: 'NO iperestensione', rpe: 3 },
        ],
        rpe: 3,
      },
      main: {
        time: '10:00-11:30',
        type: 'FORZA_MAX',
        description: 'Lower Body + Core Forza',
        exercises: [
          { name: 'Goblet Squat', sets: 4, reps: 10, weight: '16kg', tempo: '3-0-1', rest: '90"', notes: 'Tronco verticale', rpe: 6 },
          { name: 'Trap-Bar Deadlift', sets: 4, reps: 8, weight: '40kg', tempo: '3-0-1', rest: '120"', notes: 'Reset ogni rep', rpe: 6 },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10/gamba', weight: 'BW', tempo: '2-0-2', rest: '75"', notes: 'Equilibrio focus', rpe: 5 },
          { name: 'Nordic Curl assistito', sets: 3, reps: '5-6', weight: 'Elastico', tempo: '5" ecc', rest: '90"', notes: 'Femorali attivi', rpe: 7 },
          { name: 'Ab Wheel ginocchia', sets: 4, reps: 8, weight: 'BW', tempo: '4-2-1', rest: '90"', notes: 'RETROVERSIONE', rpe: 7 },
          { name: 'Hollow Hold', sets: 4, reps: '35"', weight: 'BW', tempo: 'Iso', rest: '75"', notes: 'Schiena piatta terra', rpe: 6 },
        ],
        rpe: 6.5,
        volume: '90min',
        notes: '🎯 BASELINE settimana 1! Registra tutto'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        description: 'Stretching Post-Workout',
        exercises: [
          { name: 'Psoas Stretch', sets: 2, reps: '60"/lato', notes: 'Focus iperlordosi' },
          { name: 'Child\'s Pose', sets: 2, reps: '60"', notes: 'Respirazione profonda' },
        ],
        rpe: 2
      },
      notes: '🎯 PRIMA SESSIONE! Focus: baseline tecnica + tracking rigidità'
    },
    1: { // Martedì
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:15',
        type: 'FORZA_MAX',
        description: 'Upper Body + Neck Specialist',
        exercises: [
          { name: 'Panca Piana Manubri', sets: 4, reps: 10, weight: '8kg/mano', tempo: '2-0-1', rest: '90"', notes: 'Scapole retratte', rpe: 6 },
          { name: 'Lat Pull-Down', sets: 4, reps: 10, weight: '35kg', tempo: '2-0-1', rest: '75"', notes: 'Porta a clavicola', rpe: 6 },
          { name: 'Neck Isometrics 4 Dir', sets: 4, reps: '30"/dir', weight: 'Mano', tempo: 'Hold', rest: '45"', notes: 'Forza 70% max', rpe: 6 },
          { name: 'Dead-Hang', sets: 4, reps: 'Max tempo', weight: 'BW', tempo: 'Hold', rest: '120"', notes: 'Baseline test', rpe: 9 },
        ],
        rpe: 6.5,
        volume: '75min',
        notes: 'Dead-hang baseline: registra tempo migliore!'
      },
      notes: '💪 Upper body baseline + neck work'
    },
    2: { // Mercoledì
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }],
        rpe: 3
      },
      main: {
        time: '10:00-11:30',
        type: 'RESISTENZA',
        description: 'Bike Z2 Steady State + Core Post-Bike',
        exercises: [
          { name: 'Bike Z2', sets: 1, reps: '75min', weight: 'HR 130-145', tempo: 'Steady', rest: 'N/A', notes: '🚴 Cadenza 80-90rpm', rpe: 6 },
          { name: 'Plank Hold post-bike', sets: 3, reps: '45"', weight: 'BW', tempo: 'Iso', rest: '30"', notes: 'SOTTO FATICA', rpe: 7 },
        ],
        rpe: 6.5,
        volume: '90min',
        notes: '🎯 Core POST-BIKE = transfer cruciale'
      },
    },
    3: { // Giovedì
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }],
        rpe: 3
      },
      main: {
        time: '10:00-11:15',
        type: 'RESISTENZA',
        description: 'Lower Endurance + Core Specifico',
        exercises: [
          { name: 'Wall Sit', sets: 3, reps: '45"', weight: 'BW', tempo: 'Iso', rest: '90"', notes: 'BASELINE! Coscia parallela', rpe: 7 },
          { name: 'Step-Up', sets: 3, reps: '12/gamba', weight: 'BW', tempo: '2-0-2', rest: '60"', notes: 'Box 40cm', rpe: 5 },
        ],
        rpe: 6,
        volume: '75min',
        notes: '🎯 Wall Sit BASELINE 45" - target 120"×3'
      },
    },
    4: { // Venerdì
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'RESISTENZA',
        description: 'Upper Endurance + Grip Specialist',
        exercises: [
          { name: 'Push-Up Standard', sets: 4, reps: '15-20', weight: 'BW', tempo: '2-0-1', rest: '60"', notes: 'Target 60-80 reps', rpe: 6 },
          { name: 'Dead-Hang', sets: 4, reps: 'Max', weight: 'BW', tempo: 'Hold', rest: '120"', notes: 'Tentare battere baseline', rpe: 9 },
        ],
        rpe: 7,
        volume: '60min',
        notes: '💪 Grip focus! Dead-hang baseline'
      },
    },
    5: { // Sabato
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }],
        rpe: 3
      },
      main: {
        time: '10:00-11:45',
        type: 'RESISTENZA',
        description: 'Bike Z2 Long + Core + 🍌 +600 KCAL',
        exercises: [
          { name: 'Bike Z2 Extended', sets: 1, reps: '90min', weight: 'HR 130-145', notes: '🍌 +600 KCAL protocol', rpe: 6 },
          { name: 'Plank Hold post-bike', sets: 3, reps: '45"', notes: 'FATICA metabolica', rpe: 7 },
        ],
        rpe: 6,
        volume: '105min',
        notes: '🍌 SABATO +600 KCAL OBBLIGATORIO!'
      },
    },
    6: { // Domenica
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' (OPZIONALE)',
        exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'RECUPERO',
        description: 'Recovery Attivo + Core Volume',
        exercises: [
          { name: 'Walk Aerobico O Yoga', sets: 1, reps: '30-40min', notes: '🧘 HR <120 bpm', rpe: 3 },
          { name: 'Ab Wheel ginocchia', sets: 3, reps: 8, weight: 'BW', rest: '90"', rpe: 6 },
        ],
        rpe: 6,
        volume: '60min',
        notes: '✅ SETTIMANA 1 COMPLETATA!'
      },
    }
  },
  
  // SETTIMANA 2 - Progressione +5%
  2: {
    0: {
      morning: { time: '06:00-06:12', type: 'MOBILITA', description: 'Routine Mattutina 12\'', exercises: [{ name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 }], rpe: 3 },
      main: {
        time: '10:00-11:30',
        type: 'FORZA_MAX',
        description: 'Lower Body + Core (Progressione)',
        exercises: [
          { name: 'Goblet Squat', sets: 4, reps: 10, weight: '18kg', tempo: '3-0-1', rest: '90"', notes: '+2kg vs S1', rpe: 6 },
          { name: 'Trap-Bar Deadlift', sets: 4, reps: 8, weight: '45kg', tempo: '3-0-1', rest: '120"', notes: '+5kg', rpe: 6 },
          { name: 'Bulgarian Split', sets: 3, reps: '10/g', weight: '2×5kg', notes: '+5kg/mano', rpe: 5 },
          { name: 'Nordic Curl', sets: 3, reps: 6, notes: '+1 rep', rpe: 7 },
          { name: 'Ab Wheel', sets: 4, reps: 10, notes: '+2 reps', rpe: 7 },
          { name: 'Weighted Plank', sets: 4, reps: '40"', weight: '2.5kg', notes: 'Disco su schiena', rpe: 6 },
        ],
        rpe: 6.5,
        notes: '📈 Progressione carichi +5%'
      },
      notes: 'Consolidamento tecnica + volume'
    },
    1: {
      main: {
        type: 'FORZA_MAX',
        description: 'Upper Body Progression',
        exercises: [
          { name: 'Panca Manubri', sets: 4, reps: 10, weight: '10kg/mano', notes: '+2kg', rpe: 6 },
          { name: 'Lat Pull-Down', sets: 4, reps: 10, weight: '40kg', notes: '+5kg', rpe: 6 },
          { name: 'Dead-Hang', sets: 3, reps: 'Max', notes: 'Target >baseline', rpe: 9 },
        ],
        rpe: 6.5,
        notes: 'Upper strength building'
      }
    },
    2: { main: { type: 'RESISTENZA', description: 'Bike Z2 80min + Core', exercises: [{ name: 'Bike Z2', reps: '80min', notes: '+5min', rpe: 6 }], rpe: 6 }},
    3: { main: { type: 'RESISTENZA', description: 'Wall Sit Progression', exercises: [{ name: 'Wall Sit', sets: 3, reps: '50"', notes: '+5"', rpe: 7 }], rpe: 6 }},
    4: { main: { type: 'RESISTENZA', description: 'Upper Endurance', exercises: [{ name: 'Push-Ups', reps: '160', notes: '+10 totali', rpe: 7 }], rpe: 7 }},
    5: { main: { type: 'RESISTENZA', description: 'Bike Long 95min + +600kcal', exercises: [{ name: 'Bike', reps: '95min', rpe: 6 }], rpe: 6, notes: '🍌 +600 KCAL' }},
    6: { main: { type: 'RECUPERO', description: 'Core Volume 55min', exercises: [{ name: 'Core Circuit', reps: '55min', rpe: 6 }], rpe: 6 }},
  },

  // Settimane 3-18 con dati semplificati per brevità
  3: {
    0: { main: { type: 'FORZA_MAX', description: 'Lower Peak Meso 1A', rpe: 7, notes: '🔥 PEAK settimana Meso 1A' }},
    1: { main: { type: 'FORZA_MAX', description: 'Upper Peak', rpe: 7 }},
    2: { main: { type: 'RESISTENZA', description: 'Bike 85min', rpe: 6 }},
    3: { main: { type: 'RESISTENZA', description: 'Wall Sit 3×55"', rpe: 7 }},
    4: { main: { type: 'RESISTENZA', description: 'Push-Ups 170', rpe: 7 }},
    5: { main: { type: 'RESISTENZA', description: 'Bike 100min PEAK + +600', notes: '🍌 +600 KCAL', rpe: 6 }},
    6: { main: { type: 'RECUPERO', description: 'Core Volume 60min PEAK', rpe: 6 }},
  },

  4: {
    0: { main: { type: 'DELOAD', description: 'Lower Deload -50% volume', rpe: 4, notes: '🔄 DELOAD Week' }},
    1: { main: { type: 'DELOAD', description: 'Upper Deload', rpe: 4 }},
    2: { main: { type: 'RECUPERO', description: 'Bike Z1 55min Recovery', rpe: 3 }},
    3: { main: { type: 'DELOAD', description: 'Lower Light', rpe: 4 }},
    4: { main: { type: 'RECUPERO', description: 'Upper Light O OFF', rpe: 3 }},
    5: { main: { type: 'RECUPERO', description: 'Bike Z1 65min O Walk', rpe: 3, notes: 'NO +600 kcal' }},
    6: { main: { type: 'RIPOSO', description: 'OFF O Yoga 45min', rpe: 0, notes: '✅ DELOAD 1 completato' }},
  },

  // Settimane 5-18 con struttura simile...
  5: { 0: { main: { type: 'FORZA_MAX', description: 'Lower Hypertrophy Start', rpe: 7 }}, 1: { main: { type: 'FORZA_MAX', rpe: 7 }}, 2: { main: { type: 'RESISTENZA', rpe: 6 }}, 3: { main: { type: 'RESISTENZA', rpe: 7 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  6: { 0: { main: { type: 'FORZA_MAX', rpe: 7 }}, 1: { main: { type: 'FORZA_MAX', rpe: 7 }}, 2: { main: { type: 'RESISTENZA', rpe: 6 }}, 3: { main: { type: 'RESISTENZA', rpe: 7 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  7: { 0: { main: { type: 'FORZA_MAX', rpe: 8, notes: '🔥 Peak Hypertrophy' }}, 1: { main: { type: 'FORZA_MAX', rpe: 8 }}, 2: { main: { type: 'RESISTENZA', rpe: 6 }}, 3: { main: { type: 'RESISTENZA', rpe: 8 }}, 4: { main: { type: 'RESISTENZA', rpe: 8 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 7 }}},
  8: { 0: { main: { type: 'DELOAD', rpe: 4, notes: '🔄 DELOAD 2' }}, 1: { main: { type: 'DELOAD', rpe: 4 }}, 2: { main: { type: 'RECUPERO', rpe: 3 }}, 3: { main: { type: 'DELOAD', rpe: 4 }}, 4: { main: { type: 'RECUPERO', rpe: 3 }}, 5: { main: { type: 'RECUPERO', rpe: 3 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '✅ M2A completato' }}},
  9: { 0: { main: { type: 'FORZA_MAX', description: 'Lower Strength Start', rpe: 8, notes: '💪 Strength phase start' }}, 1: { main: { type: 'FORZA_MAX', rpe: 8 }}, 2: { main: { type: 'RESISTENZA', rpe: 6 }}, 3: { main: { type: 'RESISTENZA', rpe: 7 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  10: { 0: { main: { type: 'POTENZA', description: 'Lower Power + 🏍️ Plank Casco', rpe: 8.5, notes: '🏍️ TRANSFER PROTOCOLS START!' }}, 1: { main: { type: 'POTENZA', rpe: 8.5 }}, 2: { main: { type: 'TECNICO', description: '🏍️ RSA Intervals', rpe: 9 }}, 3: { main: { type: 'RESISTENZA', rpe: 7 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  11: { 0: { main: { type: 'POTENZA', rpe: 9 }}, 1: { main: { type: 'POTENZA', rpe: 9 }}, 2: { main: { type: 'TECNICO', rpe: 9 }}, 3: { main: { type: 'RESISTENZA', rpe: 8 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  12: { 0: { main: { type: 'DELOAD', rpe: 4, notes: '🔄 DELOAD 3 pre-peak' }}, 1: { main: { type: 'DELOAD', rpe: 4 }}, 2: { main: { type: 'RECUPERO', rpe: 3 }}, 3: { main: { type: 'DELOAD', rpe: 4 }}, 4: { main: { type: 'RECUPERO', rpe: 3 }}, 5: { main: { type: 'RECUPERO', rpe: 3 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '✅ Ready Meso 3B Peak' }}},
  13: { 0: { main: { type: 'POTENZA', description: 'Lower PEAK + 🏍️ Plank Casco 70"', rpe: 9, notes: '🔥 PEAK TRANSFER start' }}, 1: { main: { type: 'POTENZA', rpe: 9 }}, 2: { main: { type: 'TECNICO', rpe: 9 }}, 3: { main: { type: 'TECNICO', description: '🔥 METABOLIC CORE CIRCUIT', rpe: 9.5, notes: '🏍️🔥 MAJOR MILESTONE DAY!' }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  14: { 0: { main: { type: 'POTENZA', rpe: 9 }}, 1: { main: { type: 'POTENZA', rpe: 9 }}, 2: { main: { type: 'TECNICO', rpe: 9 }}, 3: { main: { type: 'TECNICO', rpe: 9.5 }}, 4: { main: { type: 'RESISTENZA', rpe: 7 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RECUPERO', rpe: 6 }}},
  15: { 0: { main: { type: 'POTENZA', description: '🏆 ABSOLUTE PEAK', rpe: 10, notes: '🏆🏆🏆 ABSOLUTE PEAK DAY!' }}, 1: { main: { type: 'POTENZA', description: '🏆 Upper PEAK', rpe: 9.5, notes: '🏆 Grip + Neck peak achieved' }}, 2: { main: { type: 'TECNICO', rpe: 9 }}, 3: { main: { type: 'TECNICO', description: '🏆 METABOLIC <36min', rpe: 10, notes: '🏆🏆🏆 FINALE TARGETS ACHIEVED!' }}, 4: { main: { type: 'RECUPERO', rpe: 5 }}, 5: { main: { type: 'RESISTENZA', notes: '🍌', rpe: 6 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '✅ MESO 3 COMPLETATO!' }}},
  16: { 0: { main: { type: 'DELOAD', rpe: 7, notes: '🏁 TAPER START' }}, 1: { main: { type: 'DELOAD', rpe: 7 }}, 2: { main: { type: 'RECUPERO', rpe: 4 }}, 3: { main: { type: 'DELOAD', rpe: 5 }}, 4: { main: { type: 'RIPOSO', rpe: 0 }}, 5: { main: { type: 'RECUPERO', rpe: 3 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '✅ Freshness building' }}},
  17: { 0: { main: { type: 'DELOAD', rpe: 7, notes: '🏁 Taper deep -65%' }}, 1: { main: { type: 'DELOAD', rpe: 7 }}, 2: { main: { type: 'RECUPERO', rpe: 3 }}, 3: { main: { type: 'DELOAD', rpe: 5 }}, 4: { main: { type: 'RIPOSO', rpe: 0 }}, 5: { main: { type: 'RECUPERO', rpe: 3 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '✅ Ultra fresh' }}},
  18: { 0: { main: { type: 'MOBILITA', rpe: 4, notes: '🏁 PEAK READINESS WEEK' }}, 1: { main: { type: 'RIPOSO', rpe: 0 }}, 2: { main: { type: 'RECUPERO', rpe: 3 }}, 3: { main: { type: 'GARA', description: '🏆 KPI FINALI TEST', rpe: 9, notes: '🏆 GIORNO DELLA VERITÀ - KPI TEST' }}, 4: { main: { type: 'RIPOSO', rpe: 0 }}, 5: { main: { type: 'RECUPERO', rpe: 3 }}, 6: { main: { type: 'RIPOSO', rpe: 0, notes: '🏁🏁🏁 READY TO RACE!' }}},
};

const getRPEColor = (rpe: number) => {
  if (rpe <= 3) return '#4CAF50';
  if (rpe <= 5) return '#8BC34A';
  if (rpe <= 7) return '#FFC107';
  if (rpe <= 8) return '#FF9800';
  return '#FF5722';
};

interface SessionCardProps {
  session: any;
  title: string;
  onExercisePress: (exercise: any) => void;
  onToggleComplete: () => void;
  isCompleted: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, title, onExercisePress, onToggleComplete, isCompleted }) => {
  if (!session) return null;

  const typeInfo = TRAINING_TYPES[session.type as keyof typeof TRAINING_TYPES] || TRAINING_TYPES.RIPOSO;

  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionTitleRow}>
          <Text style={styles.sessionIcon}>{typeInfo.icon}</Text>
          <Text style={styles.sessionTitle}>{title}</Text>
        </View>
        {session.rpe && (
          <View style={[styles.rpeSmallBadge, { backgroundColor: getRPEColor(session.rpe) }]}>
            <Text style={styles.rpeSmallText}>RPE {session.rpe}</Text>
          </View>
        )}
      </View>

      {session.time && (
        <Text style={styles.sessionTime}>⏰ {session.time}</Text>
      )}

      <Text style={styles.sessionDescription}>{session.description}</Text>

      {session.exercises && session.exercises.length > 0 && (
        <View style={styles.exercisesList}>
          <Text style={styles.exercisesTitle}>Esercizi ({session.exercises.length}):</Text>
          {session.exercises.slice(0, 3).map((exercise: any, index: number) => (
            <Pressable
              key={index}
              style={styles.exerciseItem}
              onPress={() => onExercisePress(exercise)}
            >
              <Text style={styles.exerciseName}>• {exercise.name}</Text>
              {exercise.sets && (
                <Text style={styles.exerciseDetails}>
                  {exercise.sets}×{exercise.reps}
                  {exercise.weight && ` @ ${exercise.weight}`}
                </Text>
              )}
            </Pressable>
          ))}
          {session.exercises.length > 3 && (
            <Text style={styles.moreExercises}>
              +{session.exercises.length - 3} altri esercizi
            </Text>
          )}
        </View>
      )}

      {session.notes && (
        <View style={styles.sessionNotes}>
          <Text style={styles.sessionNotesText}>{session.notes}</Text>
        </View>
      )}

      <Pressable
        style={[styles.completeButton, isCompleted && styles.completeButtonActive]}
        onPress={onToggleComplete}
      >
        <Text style={styles.completeButtonIcon}>
          {isCompleted ? '✓' : '○'}
        </Text>
        <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextActive]}>
          {isCompleted ? 'Completato' : 'Segna come completato'}
        </Text>
      </Pressable>
    </View>
  );
};

export default function CalendarScreen() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [completionData, setCompletionData] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadCompletionData();
  }, []);

  const loadCompletionData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletionData(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading completion data:', error);
    }
  };

  const saveCompletionData = async (data: { [key: string]: boolean }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Error saving completion data:', error);
    }
  };

  const toggleSessionComplete = (week: number, day: number, sessionType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const key = `${week}-${day}-${sessionType}`;
    const newData = { ...completionData, [key]: !completionData[key] };
    setCompletionData(newData);
    saveCompletionData(newData);
  };

  const isSessionComplete = (week: number, day: number, sessionType: string) => {
    const key = `${week}-${day}-${sessionType}`;
    return completionData[key] || false;
  };

  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const getWeekDates = (weekNumber: number) => {
    const startDate = new Date('2025-11-16');
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(selectedWeek);
  const currentDayData = selectedDay !== null ? COMPLETE_TRAINING_DATA[selectedWeek as keyof typeof COMPLETE_TRAINING_DATA]?.[selectedDay] : null;

  const openExerciseDetail = (exercise: any) => {
    setSelectedExercise(exercise);
    setDetailModalVisible(true);
  };

  const getMesoLabel = (week: number) => {
    if (week <= 3) return 'M1A';
    if (week === 4) return 'D1';
    if (week <= 7) return 'M2A';
    if (week === 8) return 'D2';
    if (week === 9) return 'M2B';
    if (week <= 11) return 'M3';
    if (week === 12) return 'D3';
    if (week <= 15) return 'M3B';
    if (week === 16) return 'D4';
    if (week === 17) return 'TAP';
    return 'PEAK';
  };

  const getDayCompletionStatus = (week: number, day: number) => {
    const dayData = COMPLETE_TRAINING_DATA[week as keyof typeof COMPLETE_TRAINING_DATA]?.[day];
    if (!dayData) return { total: 0, completed: 0 };

    let total = 0;
    let completed = 0;

    if (dayData.morning) {
      total++;
      if (isSessionComplete(week, day, 'morning')) completed++;
    }
    if (dayData.main) {
      total++;
      if (isSessionComplete(week, day, 'main')) completed++;
    }
    if (dayData.recovery) {
      total++;
      if (isSessionComplete(week, day, 'recovery')) completed++;
    }

    return { total, completed };
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Calendario Training',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏍️ Training Moto3</Text>
          <Text style={styles.headerSubtitle}>18 Settimane Complete</Text>
        </View>

        {/* Week Selector */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Seleziona Settimana</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekList}
          >
            {weeks.map((week) => {
              const mesoLabel = getMesoLabel(week);
              const isDeload = [4, 8, 12, 16].includes(week);
              const isTaper = week >= 17;

              return (
                <Pressable
                  key={week}
                  style={[
                    styles.weekButton,
                    selectedWeek === week && styles.weekButtonActive,
                    isDeload && styles.weekButtonDeload,
                    isTaper && styles.weekButtonTaper,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedWeek(week);
                    setSelectedDay(null);
                  }}
                >
                  <Text
                    style={[
                      styles.weekButtonText,
                      selectedWeek === week && styles.weekButtonTextActive,
                    ]}
                  >
                    S{week}
                  </Text>
                  <Text style={[styles.weekButtonMeso, selectedWeek === week && styles.weekButtonTextActive]}>
                    {mesoLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Week View */}
        <View style={styles.card}>
          <View style={styles.weekHeader}>
            <Text style={styles.sectionTitle}>Settimana {selectedWeek}</Text>
            <Text style={styles.weekDates}>
              {weekDates[0].toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {' '}
              {weekDates[6].toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>

          <View style={styles.daysGrid}>
            {daysOfWeek.map((day, index) => {
              const date = weekDates[index];
              const isSelected = selectedDay === index;
              const isToday = date.toDateString() === new Date().toDateString();
              const dayData = COMPLETE_TRAINING_DATA[selectedWeek as keyof typeof COMPLETE_TRAINING_DATA]?.[index];
              const mainType = dayData?.main?.type || 'RIPOSO';
              const typeColor = TRAINING_TYPES[mainType as keyof typeof TRAINING_TYPES]?.color || '#757575';
              const completion = getDayCompletionStatus(selectedWeek, index);
              
              return (
                <Pressable
                  key={index}
                  style={[
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                    isToday && styles.dayCardToday,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDay(index);
                  }}
                >
                  <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                    {day}
                  </Text>
                  <Text style={[styles.dayDate, isSelected && styles.dayDateSelected]}>
                    {date.getDate()}
                  </Text>
                  <View style={[styles.dayIndicator, { backgroundColor: typeColor }]} />
                  {completion.total > 0 && (
                    <Text style={styles.completionText}>
                      {completion.completed}/{completion.total}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Day Details */}
        {selectedDay !== null && currentDayData && (
          <>
            <View style={styles.card}>
              <View style={styles.dayDetailHeader}>
                <Text style={styles.sectionTitle}>
                  {daysOfWeek[selectedDay]} {weekDates[selectedDay].getDate()} {weekDates[selectedDay].toLocaleDateString('it-IT', { month: 'long' })}
                </Text>
                {currentDayData.main && (
                  <View style={[styles.rpeSmallBadge, { backgroundColor: getRPEColor(currentDayData.main.rpe) }]}>
                    <Text style={styles.rpeSmallText}>RPE {currentDayData.main.rpe}</Text>
                  </View>
                )}
              </View>
              
              {currentDayData.morning && (
                <SessionCard 
                  session={currentDayData.morning} 
                  title="🌅 Mattutina" 
                  onExercisePress={openExerciseDetail}
                  onToggleComplete={() => toggleSessionComplete(selectedWeek, selectedDay, 'morning')}
                  isCompleted={isSessionComplete(selectedWeek, selectedDay, 'morning')}
                />
              )}

              {currentDayData.main && (
                <SessionCard 
                  session={currentDayData.main} 
                  title="💪 Principale" 
                  onExercisePress={openExerciseDetail}
                  onToggleComplete={() => toggleSessionComplete(selectedWeek, selectedDay, 'main')}
                  isCompleted={isSessionComplete(selectedWeek, selectedDay, 'main')}
                />
              )}

              {currentDayData.recovery && (
                <SessionCard 
                  session={currentDayData.recovery} 
                  title="🔄 Recupero" 
                  onExercisePress={openExerciseDetail}
                  onToggleComplete={() => toggleSessionComplete(selectedWeek, selectedDay, 'recovery')}
                  isCompleted={isSessionComplete(selectedWeek, selectedDay, 'recovery')}
                />
              )}

              {currentDayData.notes && (
                <View style={styles.dayNotesCard}>
                  <Text style={styles.dayNotesTitle}>📝 Note Giornata:</Text>
                  <Text style={styles.dayNotesText}>{currentDayData.notes}</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Legend */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Legenda Allenamenti</Text>
          {Object.entries(TRAINING_TYPES).map(([key, value]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: value.color }]} />
              <Text style={styles.legendIcon}>{value.icon}</Text>
              <Text style={styles.legendText}>{value.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Exercise Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedExercise && (
                <>
                  <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                  
                  {selectedExercise.sets && (
                    <View style={styles.exerciseDetailRow}>
                      <Text style={styles.exerciseDetailLabel}>📊 Volume:</Text>
                      <Text style={styles.exerciseDetailValue}>
                        {selectedExercise.sets}×{selectedExercise.reps}
                        {selectedExercise.weight && ` @ ${selectedExercise.weight}`}
                      </Text>
                    </View>
                  )}

                  {selectedExercise.tempo && (
                    <View style={styles.exerciseDetailRow}>
                      <Text style={styles.exerciseDetailLabel}>⏱️ Tempo:</Text>
                      <Text style={styles.exerciseDetailValue}>{selectedExercise.tempo}</Text>
                    </View>
                  )}

                  {selectedExercise.rest && (
                    <View style={styles.exerciseDetailRow}>
                      <Text style={styles.exerciseDetailLabel}>💤 Recupero:</Text>
                      <Text style={styles.exerciseDetailValue}>{selectedExercise.rest}</Text>
                    </View>
                  )}

                  {selectedExercise.rpe && (
                    <View style={styles.exerciseDetailRow}>
                      <Text style={styles.exerciseDetailLabel}>🔥 RPE:</Text>
                      <View style={[styles.rpeBadge, { backgroundColor: getRPEColor(selectedExercise.rpe) }]}>
                        <Text style={styles.rpeBadgeText}>{selectedExercise.rpe}/10</Text>
                      </View>
                    </View>
                  )}

                  {selectedExercise.notes && (
                    <View style={styles.exerciseNotesSection}>
                      <Text style={styles.exerciseNotesLabel}>📝 Note Tecniche:</Text>
                      <Text style={styles.exerciseNotesText}>{selectedExercise.notes}</Text>
                    </View>
                  )}

                  <Pressable 
                    style={styles.closeButton}
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Chiudi</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...shadows.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  weekList: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  weekButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 70,
    alignItems: 'center',
  },
  weekButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  weekButtonDeload: {
    borderColor: '#FFB300',
    borderWidth: 2,
  },
  weekButtonTaper: {
    borderColor: '#9C27B0',
    borderWidth: 2,
  },
  weekButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weekButtonTextActive: {
    color: '#fff',
  },
  weekButtonMeso: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
  weekHeader: {
    marginBottom: 16,
  },
  weekDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayCard: {
    width: '13%',
    minWidth: 45,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dayCardToday: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  dayNameSelected: {
    color: '#fff',
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  dayDateSelected: {
    color: '#fff',
  },
  dayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  completionText: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
  },
  dayDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rpeSmallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rpeSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  sessionCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sessionIcon: {
    fontSize: 20,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  sessionTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  exercisesList: {
    marginTop: 8,
  },
  exercisesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  exerciseItem: {
    paddingVertical: 6,
    paddingLeft: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
  },
  moreExercises: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
    fontStyle: 'italic',
  },
  sessionNotes: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  sessionNotesText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  completeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  completeButtonIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  completeButtonTextActive: {
    color: '#fff',
  },
  dayNotesCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  dayNotesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 8,
  },
  dayNotesText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendIcon: {
    fontSize: 16,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  exerciseDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseDetailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  exerciseDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  rpeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rpeBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseNotesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
  exerciseNotesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  exerciseNotesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
