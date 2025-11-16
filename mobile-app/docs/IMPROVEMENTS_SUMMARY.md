import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';

const TRAINING_TYPES = {
  FORZA_MAX: { label: 'Forza Massimale', color: '#FF4444', icon: 'dumbbell.fill' },
  POTENZA: { label: 'Potenza', color: '#FF8C00', icon: 'bolt.fill' },
  RESISTENZA: { label: 'Resistenza', color: '#4CAF50', icon: 'figure.run' },
  TECNICO: { label: 'Tecnico Specifico', color: '#2196F3', icon: 'figure.motorcycle' },
  MOBILITA: { label: 'Mobilità/Correttivo', color: '#9C27B0', icon: 'figure.flexibility' },
  RECUPERO: { label: 'Recupero Attivo', color: '#00BCD4', icon: 'wind' },
  RIPOSO: { label: 'Riposo Completo', color: '#757575', icon: 'bed.double.fill' },
  DELOAD: { label: 'Deload', color: '#FFB300', icon: 'arrow.down.circle.fill' },
  GARA: { label: 'Gara', color: '#FFD700', icon: 'flag.checkered' },
};

// ============================================================================
// DATI COMPLETI 18 SETTIMANE - MESOCICLO 1-5
// ============================================================================

const COMPLETE_TRAINING_DATA = {
  
  // ========================================================================
  // SETTIMANA 1 (16-22 Novembre 2025) - Anatomical Adaptation
  // ========================================================================
  1: {
    0: { // LUNEDÌ 16 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' - Anti-Iperlordosi',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, tempo: '3" per fase', rest: '0"', notes: 'Mobilità TUTTA colonna', rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', tempo: 'Box 4-2-4', rest: '0"', notes: 'Allungamento lombare passivo', rpe: 3 },
          { name: 'Glute Bridge Activation', sets: 2, reps: 12, tempo: 'Pausa 2" alto', rest: '0"', notes: 'RETROVERSIONE prima salire', rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', tempo: 'Hold', rest: '0"', notes: 'NO iperestensione lombare', rpe: 3 },
        ],
        rpe: 3,
        notes: 'Prima routine! Focus forma perfetta'
      },
      main: {
        time: '10:00-11:30',
        type: 'FORZA_MAX',
        description: 'Lower Body + Core Forza',
        exercises: [
          { name: 'Goblet Squat', sets: 4, reps: 10, weight: '16kg', tempo: '3-0-1', rest: '90"', notes: 'Tronco verticale, NO iperestensione', rpe: 6, tracking: { target: '16kg×10' } },
          { name: 'Trap-Bar Deadlift', sets: 4, reps: 8, weight: '40kg', tempo: '3-0-1', rest: '120"', notes: 'Reset ogni rep, schiena neutra', rpe: 6, tracking: { target: '40kg×8' } },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10/gamba', weight: 'BW', tempo: '2-0-2', rest: '75"', notes: 'Corpo libero, equilibrio focus', rpe: 5, tracking: {} },
          { name: 'Nordic Curl (assistito)', sets: 3, reps: '5-6', weight: 'Elastico forte', tempo: '5" ecc', rest: '90"', notes: 'Resistere caduta, femorali attivi', rpe: 7, tracking: {} },
          { name: 'Ab Wheel (ginocchia)', sets: 4, reps: 8, weight: 'BW', tempo: '4-2-1', rest: '90"', notes: 'RETROVERSIONE costante, stop se lombare estende', rpe: 7, tracking: { critical: true } },
          { name: 'Hollow Hold', sets: 4, reps: '35"', weight: 'BW', tempo: 'Isometric', rest: '75"', notes: 'Schiena PIATTA terra', rpe: 6, tracking: {} },
          { name: 'Dead Bug Breathing', sets: 3, reps: 12, weight: 'BW', tempo: '4-2-4 breath', rest: '75"', notes: 'Espira FORTE quando estendi', rpe: 5, tracking: {} },
          { name: 'Pallof Press', sets: 3, reps: '12/lato', weight: 'Elastico forte', tempo: '2" hold', rest: '60"', notes: 'NO rotazione busto', rpe: 5, tracking: {} },
        ],
        rpe: 6.5,
        volume: '90min',
        notes: 'Baseline settimana 1! Registra tutto'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        description: 'Stretching Post-Workout',
        exercises: [
          { name: 'Psoas Stretch', sets: 2, reps: '60"/lato', notes: 'Focus iperlordosi' },
          { name: 'Child\'s Pose', sets: 2, reps: '60"', notes: 'Respirazione profonda' },
          { name: 'Pigeon Pose', sets: 2, reps: '45"/lato', notes: 'Anche mobility' },
        ],
        rpe: 2
      },
      notes: '🎯 PRIMA SESSIONE! Focus: baseline tecnica + tracking rigidità lombare PRE/POST'
    },

    1: { // MARTEDÌ 17 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, tempo: '3"', rest: '0"', rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', tempo: 'Box 4-2-4', rest: '0"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rest: '0"', rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rest: '0"', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:15',
        type: 'FORZA_MAX',
        description: 'Upper Body + Neck Specialist',
        exercises: [
          { name: 'Panca Piana Manubri', sets: 4, reps: 10, weight: '8kg/mano', tempo: '2-0-1', rest: '90"', notes: 'Scapole retratte, gomiti 45°', rpe: 6 },
          { name: 'Lat Pull-Down', sets: 4, reps: 10, weight: '35kg', tempo: '2-0-1', rest: '75"', notes: 'Depressione scapole, porta a clavicola', rpe: 6 },
          { name: 'Push-Up Piedi Elevati', sets: 3, reps: '12-15', weight: 'Box 30cm', tempo: '2-0-1', rest: '60"', notes: 'Corpo linea retta', rpe: 6, tracking: { totalReps: true } },
          { name: 'Dumbbell Row Unilaterale', sets: 3, reps: '10/lato', weight: '12kg', tempo: '2-0-1', rest: '45"', notes: 'Schiena piatta, scapola retratta', rpe: 6 },
          { name: 'Neck Isometrics 4 Dir', sets: 4, reps: '30"/dir', weight: 'Mano', tempo: 'Hold', rest: '45"', notes: 'Forza 70% max, NO movimento', rpe: 6, tracking: { critical: true, note: 'BASELINE neck strength' } },
          { name: 'Dead-Hang Grip', sets: 3, reps: 'Max tempo', weight: 'BW', tempo: 'Hold', rest: '120"', notes: 'Target 40-50" per serie', rpe: 8, tracking: { baseline: true, critical: true } },
        ],
        rpe: 6.5,
        volume: '75min',
        notes: '📊 BASELINE GRIP: Dead-hang best time è CRITICO per tracking futuro'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        description: 'Stretching Upper + Neck',
        exercises: [
          { name: 'Pettorale Stretch', sets: 2, reps: '60"' },
          { name: 'Dorsali Stretch', sets: 2, reps: '60"' },
          { name: 'Neck Stretch 4 Dir', sets: 1, reps: '30"/dir' },
        ],
        rpe: 2
      },
      notes: 'Dead-hang baseline: registra tempo migliore!'
    },

    2: { // MERCOLEDÌ 18 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:30',
        type: 'RESISTENZA',
        description: 'Bike Z2 Steady State + Core Post-Bike',
        exercises: [
          { 
            name: 'Bike Z2', 
            sets: 1, 
            reps: '75min', 
            weight: 'HR 130-145', 
            tempo: 'Steady', 
            rest: 'N/A', 
            notes: '🚴 Outdoor/Indoor, cadenza 80-90 rpm, acqua ogni 15min', 
            rpe: 6,
            tracking: { 
              hrAvg: true, 
              distance: true, 
              cadence: true 
            }
          },
          { name: 'Plank Hold (post-bike)', sets: 3, reps: '45"', weight: 'BW', tempo: 'Isometric', rest: '30"', notes: '⚠️ SOTTO FATICA = transfer gara', rpe: 7, tracking: { postFatigue: true } },
          { name: 'Side Plank (post-bike)', sets: 3, reps: '30"/lato', weight: 'BW', tempo: 'Isometric', rest: '30"', notes: 'Stabilità laterale stanco', rpe: 7 },
          { name: 'Glute Bridge Iso (post-bike)', sets: 3, reps: '40"', weight: 'BW', tempo: 'Isometric', rest: '30"', notes: 'Glutei attivi anche faticati', rpe: 6 },
        ],
        rpe: 6.5,
        volume: '90min',
        notes: '🎯 Core POST-BIKE = transfer cruciale ultimo giro gara. Target: drop <10% giro 1→3'
      },
      recovery: null,
      notes: '🚴 Prima bike Z2 lunga! Monitorare HR + cadenza'
    },

    3: { // GIOVEDÌ 19 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:15',
        type: 'RESISTENZA',
        description: 'Lower Endurance + Core Specifico',
        exercises: [
          { name: 'Wall Sit', sets: 3, reps: '45"', weight: 'BW', tempo: 'Isometric', rest: '90"', notes: '🎯 BASELINE! Coscia parallela, schiena muro', rpe: 7, tracking: { baseline: true, critical: true, target: '45" tutte' } },
          { name: 'Step-Up', sets: 3, reps: '12/gamba', weight: 'BW', tempo: '2-0-2', rest: '60"', notes: 'Box 40cm, spinta tallone', rpe: 5 },
          { name: 'Calf Raise Bipodalico', sets: 4, reps: 20, weight: 'BW', tempo: '2-0-1', rest: '45"', notes: 'Rialzo 10-15cm, ROM completo', rpe: 6 },
          { name: 'Hamstring Curl Fitball', sets: 3, reps: 12, weight: 'BW', tempo: '2-0-2', rest: '75"', notes: 'Piega ginocchia, NO crampi polpacci', rpe: 6 },
          { name: 'Pallof Press Squat Stance', sets: 3, reps: '12/lato', weight: 'Elastico forte', tempo: '2" hold', rest: '60"', notes: 'Anti-rotazione', rpe: 6 },
          { name: 'Side Plank con Rotation', sets: 3, reps: '8/lato', weight: 'BW', tempo: 'Controlled', rest: '60"', notes: 'Thread needle movimento', rpe: 6 },
          { name: 'Dead Bug Long Hold', sets: 3, reps: '6/lato', weight: 'BW', tempo: '10" hold', rest: '60"', notes: 'Box 4-2-4 respirazione', rpe: 6 },
          { name: 'Bird Dog Slow Tempo', sets: 3, reps: '6/lato', weight: 'BW', tempo: '5-3-5', rest: '60"', notes: 'Zero movimento lombare', rpe: 6 },
        ],
        rpe: 6,
        volume: '75min',
        notes: '🎯 Wall Sit BASELINE 45" - target finale sarà 120"×3 = 6 min totali'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Quad Stretch', sets: 2, reps: '60"/lato' },
          { name: 'Hamstring Stretch', sets: 2, reps: '60"' },
          { name: 'Hip Flexor Stretch', sets: 2, reps: '60"/lato' },
        ],
        rpe: 2
      },
      notes: '📊 Wall sit baseline: fondamentale per tracking progressione'
    },

    4: { // VENERDÌ 20 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'RESISTENZA',
        description: 'Upper Endurance + Grip Specialist',
        exercises: [
          { name: 'Push-Up Standard', sets: 4, reps: '15-20', weight: 'BW', tempo: '2-0-1', rest: '60"', notes: 'Target totale: 60-80 reps', rpe: 6, tracking: { totalReps: true } },
          { name: 'Inverted Row', sets: 4, reps: 12, weight: 'BW', tempo: '2-0-1', rest: '60"', notes: 'Sbarra bassa O TRX, 45° inclinazione', rpe: 6 },
          { name: 'Pike Push-Up', sets: 3, reps: '10-12', weight: 'BW', tempo: '2-0-1', rest: '60"', notes: 'Deltoidi anteriori focus', rpe: 6 },
          { name: 'Dead-Hang', sets: 4, reps: 'Max tempo', weight: 'BW', tempo: 'Hold', rest: '120"', notes: '🎯 Tentare battere baseline Martedì +5-10"', rpe: 9, tracking: { baseline: true, critical: true, target: 'Beat Tuesday' } },
          { name: 'Wrist Roller Bidirezionale', sets: 3, reps: 'Up+Down', weight: '5kg', tempo: 'Slow', rest: '90"', notes: '⚡ NOVITÀ! Avambracci burn normale', rpe: 7, tracking: { new: true } },
          { name: 'Plate Pinch Hold', sets: 3, reps: 'Max/mano', weight: '2×2.5kg', tempo: 'Hold', rest: '90"', notes: 'Target 20-30"/mano', rpe: 7, tracking: { baseline: true } },
        ],
        rpe: 7,
        volume: '60min',
        notes: '💪 Grip focus! Dead-hang deve battere baseline Martedì'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Forearm Stretch', sets: 2, reps: '45"/lato' },
          { name: 'Wrist Circles', sets: 2, reps: '20/dir' },
          { name: 'Upper Back Stretch', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: 'Wrist roller: PRIMA VOLTA! Normale se avambracci bruciano'
    },

    5: { // SABATO 21 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:45',
        type: 'RESISTENZA',
        description: 'Bike Z2 Long + Core + 🍌 +600 KCAL',
        exercises: [
          { 
            name: 'Bike Z2 Extended', 
            sets: 1, 
            reps: '90min', 
            weight: 'HR 130-145', 
            tempo: 'Steady', 
            rest: 'N/A', 
            notes: '🍌 +600 KCAL: PRE 190kcal + INTRA 200kcal + POST 225kcal + CENA 115kcal extra', 
            rpe: 6,
            tracking: { 
              hrAvg: true, 
              distance: true, 
              nutrition: '+600kcal protocol' 
            }
          },
          { name: 'Plank Hold (post-bike)', sets: 3, reps: '45"', tempo: 'Iso', rest: '30"', notes: 'FATICA metabolica', rpe: 7 },
          { name: 'Side Plank (post-bike)', sets: 3, reps: '30"/lato', tempo: 'Iso', rest: '30"', rpe: 7 },
          { name: 'Glute Bridge Iso (post-bike)', sets: 3, reps: '40"', tempo: 'Iso', rest: '30"', rpe: 6 },
        ],
        rpe: 6,
        volume: '105min',
        notes: '🍌 SABATO +600 KCAL OBBLIGATORIO! PRE: banana+mandorle | INTRA: 2 gel | POST: shake+banana extra | CENA: +pasta+olio'
      },
      recovery: null,
      notes: '⚠️ Calorie totali sabato: ~2670 kcal (vs 2080 normale). Peso sera può salire 0.3-0.5kg = normale (glicogeno)'
    },

    6: { // DOMENICA 22 Nov
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' (OPZIONALE se 6/7 già fatto)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'RECUPERO',
        description: 'Recovery Attivo + Core Volume',
        exercises: [
          { name: 'Walk Aerobico O Yoga', sets: 1, reps: '30-40min', weight: 'N/A', notes: '🧘 HR <120 bpm, conversational, nature', rpe: 3, tracking: { optional: true } },
          { name: 'Ab Wheel (ginocchia)', sets: 3, reps: 8, weight: 'BW', tempo: '4-2-1', rest: '90"', rpe: 6 },
          { name: 'Weighted Plank', sets: 3, reps: '50"', weight: 'BW', tempo: 'Iso', rest: '75"', notes: 'Settimana 1: ancora senza zavorra', rpe: 6 },
          { name: 'L-Sit Hold', sets: 3, reps: '15-20"', weight: 'Parallette/terra', tempo: 'Hold', rest: '60"', rpe: 7 },
          { name: 'Hollow Hold Long', sets: 3, reps: '45"', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 6 },
          { name: 'Superman Hold', sets: 3, reps: '40"', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 6 },
          { name: 'Side Plank', sets: 3, reps: '40"/lato', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 6 },
          { name: 'Russian Twist', sets: 3, reps: 20, weight: 'BW', tempo: 'Controlled', rest: '60"', notes: '⚡ NOVITÀ rotational', rpe: 6 },
          { name: 'Pallof Press Slow', sets: 3, reps: '8/lato', weight: 'Elastico', tempo: 'Slow', rest: '60"', rpe: 6 },
          { name: 'Bicycle Crunch', sets: 3, reps: 20, weight: 'BW', tempo: 'Controlled', rest: '60"', rpe: 6 },
        ],
        rpe: 6,
        volume: '60min',
        notes: '📊 Core volume domenica: ~40min. Totale settimana: ~210min'
      },
      recovery: {
        time: '18:00-18:10',
        type: 'RECUPERO',
        exercises: [
          { name: 'Child\'s Pose', sets: 2, reps: '60"' },
          { name: 'Pigeon Pose', sets: 2, reps: '45"/lato' },
          { name: 'Spinal Twist', sets: 2, reps: '30"/lato' },
        ],
        rpe: 2
      },
      notes: '✅ SETTIMANA 1 COMPLETATA! Review domenica sera: aderenza, HRV, rigidità, performance baseline'
    }
  },

  // ========================================================================
  // SETTIMANA 4 (7-13 Dicembre 2025) - DELOAD 1
  // ========================================================================
  4: {
    0: { // LUNEDÌ 7 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'DELOAD',
        description: '🔄 Lower Deload + Core Light',
        exercises: [
          { name: 'Goblet Squat', sets: 3, reps: 10, weight: '14kg', tempo: '3-2-1', rest: '90"', notes: '⬇️ -22% carico, focus tecnica', rpe: 4, tracking: { deload: true, formFocus: true } },
          { name: 'Trap-Bar Deadlift', sets: 3, reps: 8, weight: '30kg', tempo: '3-2-1', rest: '90"', notes: '⬇️ -33% carico', rpe: 4, tracking: { deload: true } },
          { name: 'Bulgarian Split Squat', sets: 2, reps: '10/gamba', weight: 'BW', tempo: '2-0-2', rest: '60"', notes: '⬇️ No carico, -1 serie', rpe: 3 },
          { name: 'Plank Hold', sets: 2, reps: '40"', weight: 'BW', tempo: 'Iso', rest: '60"', notes: 'Respirazione focus', rpe: 4 },
          { name: 'Dead Bug', sets: 2, reps: '10/lato', weight: 'BW', tempo: 'Slow', rest: '60"', rpe: 3 },
          { name: 'Bird Dog', sets: 2, reps: '8/lato', weight: 'BW', tempo: 'Controlled', rest: '60"', rpe: 3 },
        ],
        rpe: 4,
        volume: '60min',
        notes: '🔄 DELOAD WEEK! Load: RPE 4 × 60\' = 240 unità (vs ~630 sett 3). Target: easy workout, energia post 9+/10'
      },
      recovery: {
        time: '18:00-18:25',
        type: 'RECUPERO',
        description: 'Stretching Esteso',
        exercises: [
          { name: 'Psoas Stretch', sets: 3, reps: '60"/lato' },
          { name: 'Child\'s Pose', sets: 3, reps: '90"' },
          { name: 'Pigeon Pose', sets: 2, reps: '60"/lato' },
          { name: 'Hamstring Stretch', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: '🔄 DELOAD SETTIMANA 4: Volume -50%, Intensità -30%. Focus: HRV recovery +10-15%, Rigidità <3/10'
    },

    1: { // MARTEDÌ 8 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:50',
        type: 'DELOAD',
        description: 'Upper Deload + Neck Light',
        exercises: [
          { name: 'Panca Manubri', sets: 3, reps: 10, weight: '6kg/mano', tempo: '3-2-1', rest: '90"', notes: '⬇️ -40% carico', rpe: 4, tracking: { deload: true } },
          { name: 'Lat Pull-Down', sets: 3, reps: 10, weight: '25kg', tempo: '2-1-1', rest: '75"', notes: '⬇️ -37.5% carico', rpe: 4 },
          { name: 'Push-Up Standard', sets: 3, reps: 12, weight: 'BW', tempo: '3-0-1', rest: '60"', notes: 'NO elevazione piedi', rpe: 3 },
          { name: 'Neck Isometrics', sets: 3, reps: '20"/dir', weight: 'Mano', tempo: 'Hold', rest: '45"', notes: '⬇️ -50% durata, 50% forza', rpe: 3 },
          { name: 'Dead-Hang', sets: 2, reps: '30-40"', weight: 'BW', tempo: 'Hold', rest: '120"', notes: 'NO max, comfortable', rpe: 4 },
        ],
        rpe: 4,
        volume: '50min',
        notes: 'Load: RPE 4 × 50\' = 200 unità. Riposo upper completo'
      },
      recovery: {
        time: '18:00-18:20',
        type: 'RECUPERO',
        exercises: [
          { name: 'Pettorale Stretch', sets: 2, reps: '90"' },
          { name: 'Dorsali Stretch', sets: 2, reps: '90"' },
          { name: 'Neck Gentle Stretch', sets: 1, reps: '45"/dir' },
        ],
        rpe: 2
      },
      notes: 'Upper deve sentirsi FACILE. Se fatica alta = extend deload'
    },

    2: { // MERCOLEDÌ 9 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (OPZIONALE deload)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:45',
        type: 'DELOAD',
        description: 'Bike Z1 Recovery',
        exercises: [
          { 
            name: 'Bike Z1 Recovery', 
            sets: 1, 
            reps: '45min', 
            weight: 'HR 115-130', 
            tempo: 'Easy', 
            rest: 'N/A', 
            notes: '⬇️ -47% durata vs normale, Z1 very easy (can sing)', 
            rpe: 3,
            tracking: { 
              hrAvg: 'Target 120-125',
              alternative: 'Walk 30-40\' O OFF se HRV <50'
            }
          },
        ],
        rpe: 3,
        volume: '45min',
        notes: '🚴 Z1 easy O OFF completo. Load: RPE 3 × 45\' = 135 unità. SKIP core post-bike (riposo)'
      },
      recovery: null,
      notes: '⚠️ Se HRV <50 → OFF obbligatorio. Se HRV >55 → Bike Z1 ok'
    },

    3: { // GIOVEDÌ 10 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:35',
        type: 'DELOAD',
        description: 'Lower Maintenance + Core Optional',
        exercises: [
          { name: 'Wall Sit', sets: 2, reps: '40"', weight: 'BW', tempo: 'Iso', rest: '90"', notes: '⬇️ -1 serie, -15" durata', rpe: 4 },
          { name: 'Step-Up', sets: 2, reps: '10/gamba', weight: 'BW', tempo: '2-0-2', rest: '60"', rpe: 3 },
          { name: 'Calf Raise', sets: 3, reps: 15, weight: 'BW', tempo: '2-0-1', rest: '45"', rpe: 4 },
          { name: 'Plank (OPTIONAL)', sets: 2, reps: '35"', weight: 'BW', tempo: 'Iso', rest: '60"', notes: '⚠️ Fai SOLO se energia >8/10', rpe: 4, tracking: { optional: true } },
          { name: 'Side Plank (OPTIONAL)', sets: 2, reps: '25"/lato', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 4, tracking: { optional: true } },
        ],
        rpe: 3,
        volume: '35min',
        notes: 'Core optional: fai SOLO se energia >8/10, altrimenti SKIP → stretching only. Load: ~105 unità'
      },
      recovery: {
        time: '18:00-18:22',
        type: 'RECUPERO',
        description: 'Stretching Esteso',
        exercises: [
          { name: 'Hip Flexor Stretch', sets: 3, reps: '60"/lato' },
          { name: 'Quad Stretch', sets: 2, reps: '60"/lato' },
          { name: 'IT Band Stretch', sets: 2, reps: '45"/lato' },
          { name: 'Calves Stretch', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: 'Energia <8/10 → SKIP core optional'
    },

    4: { // VENERDÌ 11 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (OPZIONALE)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:40',
        type: 'DELOAD',
        description: 'Upper Maintenance O OFF',
        exercises: [
          { name: 'Push-Up', sets: 3, reps: 10, weight: 'BW', tempo: '3-1-3', rest: '60"', notes: 'Slow tempo', rpe: 3 },
          { name: 'Inverted Row', sets: 3, reps: 8, weight: 'Angolo easy', tempo: '2-0-2', rest: '60"', rpe: 3 },
        ],
        rpe: 3,
        volume: '40min',
        notes: '⚠️ RACCOMANDATO: OFF completo. Fai light SOLO se energia >8/10. Load: RPE 3 × 40\' = 120 unità'
      },
      recovery: {
        time: '18:00-18:30',
        type: 'RECUPERO',
        description: 'Stretching Completo',
        exercises: [
          { name: 'Pettorale Stretch', sets: 3, reps: '90"' },
          { name: 'Dorsali Stretch', sets: 3, reps: '90"' },
          { name: 'Deltoidi Stretch', sets: 2, reps: '60"/lato' },
          { name: 'Tricipiti Stretch', sets: 2, reps: '60"/lato' },
          { name: 'Neck Gentle', sets: 1, reps: '60"/dir' },
          { name: 'Upper Back Stretch', sets: 3, reps: '60"' },
        ],
        rpe: 2
      },
      notes: 'Opzione A (raccomandato): OFF completo'
    },

    5: { // SABATO 12 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (fai SOLO se energia ottima)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'DELOAD',
        description: 'Bike Z1 Extended',
        exercises: [
          { 
            name: 'Bike Z1 Extended', 
            sets: 1, 
            reps: '60min', 
            weight: 'HR 115-130', 
            tempo: 'Easy', 
            rest: 'N/A', 
            notes: '⬇️ -40% durata vs normale Z2. NO gel intra (non necessario Z1)', 
            rpe: 3,
            tracking: { 
              hrAvg: 'Target 120-125',
              feel: 'Deve essere piacevole'
            }
          },
        ],
        rpe: 3,
        volume: '60min',
        notes: '⚠️ NO +600 kcal sabato (deload, expenditure basso). Calorie normali: ~2080 kcal. SKIP core post-bike'
      },
      recovery: null,
      notes: 'Nutrizione: normale 2080 kcal (NO +600 extra). Focus: qualità, idratazione'
    },

    6: { // DOMENICA 13 Dic - DELOAD
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' OPZIONALE (fai solo se ti va)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: null,
        type: 'RIPOSO',
        description: '🛏️ OFF COMPLETO O Yoga Dolce',
        exercises: [
          { name: 'Yoga Flow Dolce (OPTIONAL)', sets: 1, reps: '30min', weight: 'N/A', notes: '🧘 Sun salutation, hip openers, twists, breathing 5min, savasana 10min', rpe: 2, tracking: { optional: true } },
        ],
        rpe: 0,
        volume: '0-30min',
        notes: '🛏️ RACCOMANDATO: OFF completo. Zero allenamento. Focus: famiglia, amici, hobby, riposo. Walk lento opzionale 10-20\' (no tracking)'
      },
      recovery: null,
      notes: '✅ DELOAD WEEK COMPLETATA! Review sera: HRV (target +10-15%), Rigidità (<3/10), DOMS (10/10=zero), Energia (>8/10), Ready Meso 2'
    }
  },

  // ========================================================================
  // SETTIMANA 10 (18-24 Gennaio 2026) - TRANSFER START + 🏍️ PLANK CASCO
  // ========================================================================
  10: {
    0: { // LUNEDÌ 18 Gen - TRANSFER START
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:40',
        type: 'POTENZA',
        description: '⚡ Lower Power PAP Complex + 🏍️ PLANK CASCO (NOVITÀ!)',
        exercises: [
          { name: '🔥 Attivazione Neurale', sets: 1, reps: '8min', weight: 'N/A', notes: 'Box jump 40cm 3×2, Med ball slam 8kg 3×3, Vertical jump 3×2, Sprint place 3×10"', rpe: 6 },
          { name: 'Front Squat HEAVY', sets: 5, reps: 3, weight: '40kg', tempo: '3-0-X', rest: '120"', notes: '🎯 +8kg vs sett 9 (85% 1RM), attivazione neurale MAX', rpe: 8.5, tracking: { peak: true, pap: true } },
          { name: 'Box Jump PAP', sets: 5, reps: 2, weight: '60cm', tempo: 'Explosive', rest: '<10" da squat', notes: '⚡ IMMEDIATO post-squat! PAP effect check', rpe: 8, tracking: { pap: 'Salto più alto post-squat?' } },
          { name: 'Trap-Bar Deadlift POWER', sets: 5, reps: 2, weight: '65kg', tempo: '3-0-X', rest: '120"', notes: '+7kg, velocità concentrica MASSIMA', rpe: 8.5, tracking: { peak: true } },
          { name: 'Broad Jump PAP', sets: 5, reps: 2, weight: 'BW', tempo: 'Explosive', rest: '<10"', notes: '⚡ IMMEDIATO post-trap! Misura distanza', rpe: 8, tracking: { distance: true, pap: true } },
          { name: 'Bulgarian Split Squat Explosive', sets: 3, reps: '6/gamba', weight: '10kg/mano', tempo: 'X-0-2', rest: '90"', notes: 'Salita esplosiva', rpe: 7 },
          { name: 'Nordic Curl Eccentrica Slow', sets: 4, reps: 5, weight: 'Elastico leggero', tempo: '8-10" ecc', rest: '120"', notes: 'Ultra-slow eccentric strength', rpe: 9 },
          { name: 'Ab Wheel Piedi ROM Corto', sets: 4, reps: '5-6', weight: 'BW', tempo: '4-2-1', rest: '120"', notes: '🎯 DA PIEDI! 50% ROM. Se impossibile → ginocchia 4×10', rpe: 8.5, tracking: { newVariation: true, critical: true } },
          { name: 'Weighted Plank', sets: 4, reps: '55"', weight: '12kg', tempo: 'Iso', rest: '90"', notes: '+2kg vs sett 9', rpe: 8 },
          { name: '🏍️ PLANK CON CASCO INTEGRALE', sets: 4, reps: '45"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: '⚡ NOVITÀ MOTO3! Respirazione box 4-2-4 CRITICA. Simula posizione gara + peso casco', rpe: 8, tracking: { new: true, critical: true, moto3: true, note: 'MILESTONE: First plank con casco!' } },
          { name: 'Dead Bug Breathing Racing', sets: 4, reps: '12/lato', weight: 'BW', tempo: '4-2-4 breath', rest: '75"', notes: 'Respirazione FORZATA, simula breathing gara', rpe: 7 },
        ],
        rpe: 8.5,
        volume: '95min',
        notes: '🏍️ SETTIMANA 10 = START TRANSFER MOTO3! NOVITÀ: PAP complexes + Plank casco + Ab wheel piedi. Tracking: PAP effect sentito? Plank casco tollerato? Respirazione con casco difficoltà /10'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Psoas Stretch', sets: 2, reps: '60"/lato' },
          { name: 'Child\'s Pose', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: '🏍️ MILESTONE SETTIMANA: Prima plank con casco! PAP complexes introduced. Ab wheel tentativo da piedi. Ready per transfer specifico Moto3'
    },

    1: { // MARTEDÌ 19 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' + Cervical CARs',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
          { name: 'Cervical CARs', sets: 1, reps: '3min', weight: 'N/A', notes: '⚡ NOVITÀ! Rotations 5/lato, Lateral flex 5/lato, Flex/Ext 5, Circles 3/dir. Check spalla curva Moto3', rpe: 3, tracking: { new: true } },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:25',
        type: 'POTENZA',
        description: 'Upper Power PAP + Neck + Grip',
        exercises: [
          { name: 'Attivazione Upper', sets: 1, reps: '8min', notes: 'Clap push 3×3, Med ball throw 6kg 3×3, Band pull explosive 3×10', rpe: 6 },
          { name: 'Panca Manubri HEAVY', sets: 5, reps: 4, weight: '15kg/mano', tempo: '3-0-X', rest: '120"', notes: '+2kg, potenza focus', rpe: 8.5, tracking: { peak: true } },
          { name: 'Clap Push-Up PAP', sets: 5, reps: '4-5', weight: 'BW', tempo: 'Explosive', rest: '<10"', notes: '⚡ IMMEDIATO post-panca! Clap mani in volo', rpe: 8, tracking: { pap: true } },
          { name: 'Weighted Pull-Up HEAVY', sets: 5, reps: 4, weight: '+5kg', tempo: '3-0-X', rest: '120"', notes: '⚡ NOVITÀ! +2.5kg double peso sett 9', rpe: 8.5, tracking: { new: true, baseline: true } },
          { name: 'Med Ball Chest Throw PAP', sets: 5, reps: 5, weight: '8kg', tempo: 'Explosive', rest: '<10"', notes: '⚡ IMMEDIATO post-pull! Throw + catch', rpe: 8 },
          { name: 'Overhead Press', sets: 4, reps: 5, weight: '28kg', tempo: '3-0-X', rest: '90"', notes: '+3kg', rpe: 8 },
          { name: 'Barbell Row', sets: 4, reps: 6, weight: '38kg', tempo: '2-0-1', rest: '90"', notes: '+3kg', rpe: 8 },
          { name: 'Dips Weighted', sets: 4, reps: 6, weight: '+2.5kg', tempo: '2-0-2', rest: '90"', notes: 'Cintura + disco', rpe: 8 },
          { name: 'Neck Harness', sets: 4, reps: 10, weight: '8kg', tempo: '2-0-2', rest: '90"', notes: '+1kg. Extension + Flexion', rpe: 8 },
          { name: 'Lateral Neck', sets: 4, reps: '12/lato', weight: '5kg', tempo: '2-0-2', rest: '75"', notes: '+1kg', rpe: 8 },
          { name: 'Dead-Hang Weighted', sets: 4, reps: '40-50"', weight: '+5kg', tempo: 'Hold', rest: '150"', notes: '⚡ +2.5kg progression! Cintura + disco', rpe: 8.5, tracking: { weighted: true } },
          { name: 'Farmer\'s Walk Heavy', sets: 4, reps: '50m', weight: '26kg/mano', tempo: 'Steady', rest: '150"', notes: '+2kg', rpe: 8 },
          { name: 'Wrist Roller', sets: 3, reps: 'Up+Down', weight: '7kg', tempo: 'Slow', rest: '90"', notes: '+0.5kg. Target 8kg finale', rpe: 7 },
        ],
        rpe: 8.5,
        volume: '85min',
        notes: 'PAP upper complexes. Weighted pull-up baseline +5kg. Dead-hang weighted +5kg. Neck approaching 10kg target'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Pettorale Stretch', sets: 2, reps: '60"' },
          { name: 'Dorsali Stretch', sets: 2, reps: '60"' },
          { name: 'Neck Gentle', sets: 1, reps: '30"/dir' },
        ],
        rpe: 2
      },
      notes: 'Weighted pull-up +5kg × 4: baseline importante! PAP clap push: sentito?'
    },

    2: { // MERCOLEDÌ 20 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:30',
        type: 'TECNICO',
        description: '🚴 RSA INTERVALS (Repeated Sprint Ability) + Core + 🧠 DUAL-TASK',
        exercises: [
          { 
            name: '🚴 RSA Z4-Z5 Protocol', 
            sets: 8, 
            reps: '30" sprint', 
            weight: 'HR 155-165', 
            tempo: '1:5 ratio', 
            rest: '2\'30" Z1', 
            notes: '⚡ NOVITÀ MESO 3! 8×30" Z4-Z5 @ 155-165 bpm, recovery 2\'30" Z1 active. Ratio 1:5. Simula attacchi multipli gara', 
            rpe: 9,
            tracking: { 
              new: true, 
              critical: true,
              hrPeaks: 'Record ogni interval',
              hrRecovery: 'Target <130 bpm entro 2\'30"',
              powerDrop: 'Target <10% interval 1→8'
            }
          },
          { name: 'Warm-up Z1→Z2', sets: 1, reps: '15min', weight: 'HR 120-135', notes: 'Graduale', rpe: 4 },
          { name: 'Cooldown Z1', sets: 1, reps: '20min', weight: 'HR 115-125', notes: 'Recovery', rpe: 3 },
          { name: 'Plank Post-RSA', sets: 3, reps: '50"', weight: 'BW', tempo: 'Iso', rest: '30"', notes: '⚠️ SOTTO FATICA METABOLICA! Transfer gara', rpe: 7, tracking: { postFatigue: true } },
          { name: 'Side Plank Post-RSA', sets: 3, reps: '35"/lato', weight: 'BW', tempo: 'Iso', rest: '30"', rpe: 7 },
          { name: 'Glute Bridge Post-RSA', sets: 3, reps: '45"', weight: 'BW', tempo: 'Iso', rest: '30"', notes: 'Drop giro 1→3 target <15%', rpe: 6 },
          { name: '🧠 Plank Count-Back', sets: 3, reps: '40"', weight: 'BW', tempo: 'Iso', rest: '60"', notes: '⚡ NOVITÀ DUAL-TASK! Conta -3 da 100 DURANTE plank. Simula piloting + thinking', rpe: 7, tracking: { new: true, cognitive: true, note: 'Conteggio corretto? Forma mantenuta?' } },
          { name: '🧠 Dead Bug Math', sets: 3, reps: '8/lato', weight: 'BW', tempo: 'Controlled', rest: '60"', notes: 'Partner dice somme 2 numeri, rispondi DURANTE extend. Es: "7+5"→"12"', rpe: 6, tracking: { cognitive: true, accuracy: true } },
        ],
        rpe: 8,
        volume: '90min',
        notes: '🏍️ RSA = SPECIFICO MOTO3! Simula attacchi ripetuti gara. Dual-task = core + cervello simultaneo (cruciale gara). Tracking: HR recovery <130? Power drop <10%? Dual-task accuracy?'
      },
      recovery: null,
      notes: '⚡ RSA PRIMA VOLTA! Protocol chiave transfer. Mental fatigue normale. Dual-task difficoltà prevista'
    },

    3: { // GIOVEDÌ 21 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' + Cervical CARs',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
          { name: 'Cervical CARs', sets: 1, reps: '3min', notes: 'Rotations, lateral flex, circles', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:30',
        type: 'RESISTENZA',
        description: 'Lower Accessory + ⚡ FARMER\'S WALKS (NOVITÀ) + 🏍️ Plank Casco',
        exercises: [
          { name: 'Wall Sit', sets: 4, reps: '80"', weight: 'BW', tempo: 'Iso', rest: '90"', notes: '+10" progression. Target 120" finale', rpe: 7, tracking: { progression: 'Target tutte >75"' } },
          { name: 'Step-Up', sets: 4, reps: '8/gamba', weight: '18kg/mano', tempo: '2-0-2', rest: '75"', notes: '+2kg', rpe: 7 },
          { name: 'Walking Lunge', sets: 4, reps: '20 passi', weight: '12kg/mano', tempo: 'Controlled', rest: '90"', notes: '10 passi/gamba alternati', rpe: 6 },
          { name: 'Copenhagen Plank', sets: 4, reps: '30"/lato', weight: 'Panca', tempo: 'Iso', rest: '90"', notes: 'Gamba sopra su panca, sotto libera. Adductor strength', rpe: 7, tracking: { note: 'Stabilità bacino critica' } },
          { name: '⚡ FARMER\'S WALKS', sets: 3, reps: '40m', weight: '16kg/mano', tempo: 'Steady', rest: '120"', notes: '🎯 NOVITÀ SETT 3! Grip endurance specifico Moto3 (30\' vibrazione). Walk 40m costante, postura eretta', rpe: 7, tracking: { new: true, moto3: true, critical: true, note: 'Grip burn normale. Completati tutti?' } },
          { name: 'Single-Leg RDL', sets: 4, reps: '8/gamba', weight: '14kg/mano', tempo: '2-0-2', rest: '75"', notes: '+2kg. Balance + posterior chain', rpe: 7 },
          { name: 'Landmine Rotation', sets: 3, reps: '8/lato', weight: '25kg', tempo: '2-0-1', rest: '60"', notes: '⚡ NOVITÀ! Bilanciere in angolo, push + rotation. Potenza rotazionale = transfer controsterzo', rpe: 6, tracking: { new: true, moto3: true } },
          { name: 'Pallof Press', sets: 3, reps: '12/lato', weight: 'Elastico forte', tempo: '2" hold', rest: '60"', notes: 'Anti-rotazione', rpe: 6 },
          { name: '🏍️ PLANK CON CASCO', sets: 4, reps: '50"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: '+5" vs Lunedì. Respirazione box 4-2-4 CRITICA', rpe: 8, tracking: { progression: true, respiratory: 'Difficoltà /10 vs Lunedì' } },
          { name: 'Dead Bug Long Hold', sets: 3, reps: '7/lato', weight: 'BW', tempo: '10" hold', rest: '60"', notes: '+1 rep. Box 4-2-4 breathing', rpe: 6 },
          { name: 'Bird Dog Slow', sets: 3, reps: '7/lato', weight: 'BW', tempo: '5-3-5', rest: '60"', notes: '+1 rep', rpe: 6 },
        ],
        rpe: 7,
        volume: '90min',
        notes: '⚡ NOVITÀ: Farmer\'s walks (grip endurance Moto3) + Landmine rotation (potenza controsterzo). Plank casco +5" = progression. Wall sit 80" approaching 120" target'
      },
      recovery: {
        time: '18:00-18:25',
        type: 'RECUPERO',
        exercises: [
          { name: 'Hip Flexor Stretch', sets: 3, reps: '60"/lato' },
          { name: 'Child\'s Pose', sets: 3, reps: '90"' },
          { name: 'Pigeon Pose', sets: 2, reps: '60"/lato' },
        ],
        rpe: 2
      },
      notes: '🏍️ Farmer\'s walks: prima volta! Simula grip endurance 30\' gara con vibrazione. Landmine = potenza rotazionale transfer'
    },

    4: { // VENERDÌ 22 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:15',
        type: 'RESISTENZA',
        description: 'Upper Endurance + Grip Endurance TEST',
        exercises: [
          { name: 'Push-Up Circuit', sets: 1, reps: 'Circuit 3×', weight: 'BW', notes: 'Standard 20, Wide 15, Diamond 10, Decline 30cm 12. Rest 30" tra varianti, 90" tra circuit. Totale: 171 reps target', rpe: 7, tracking: { circuitCompleted: true, totalReps: true } },
          { name: 'Inverted Row', sets: 5, reps: 10, weight: 'Angolo 45°', tempo: '2-0-1', rest: '60"', notes: '+1 serie', rpe: 6 },
          { name: 'Pike Push-Up', sets: 4, reps: 15, weight: 'BW', tempo: '2-0-1', rest: '60"', notes: '+3 reps', rpe: 6 },
          { name: 'Band Pull-Apart', sets: 3, reps: 25, weight: 'Band', tempo: 'Controlled', rest: '45"', notes: 'Pump deltoidi posteriori', rpe: 6 },
          { name: '🎯 DEAD-HANG TEST 70"', sets: 3, reps: 'Max tempo', weight: 'BW', tempo: 'Hold', rest: '180"', notes: '⚡ TARGET: >70" single set! Set 1: MAX effort. Milestone importante', rpe: 9, tracking: { test: true, critical: true, milestone: '>70" achieved?', baseline: 'vs Sett 1: ~45"' } },
          { name: 'Farmer\'s Walk', sets: 5, reps: '50m', weight: '24kg/mano', tempo: 'Steady', rest: '120"', notes: 'Volume up, endurance focus', rpe: 8 },
          { name: 'Wrist Roller', sets: 4, reps: 'Up+Down', weight: '7kg', tempo: 'Slow', rest: '90"', notes: 'Maintenance', rpe: 7 },
          { name: 'Plate Pinch', sets: 3, reps: 'Max/mano', weight: '9kg', tempo: 'Hold', rest: '90"', notes: '+1kg. Target 30-40"', rpe: 7 },
        ],
        rpe: 7.5,
        volume: '75min',
        notes: '🎯 DEAD-HANG TEST: target >70" = MILESTONE! vs Sett 1 baseline (~45") = +25" = +55% improvement. Push-up circuit: 171 reps totali'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Forearm Stretch', sets: 2, reps: '45"/lato' },
          { name: 'Wrist Circles', sets: 2, reps: '20/dir' },
          { name: 'Upper Back', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: 'Dead-hang >70" = critical milestone grip endurance. Se raggiunto = on track per 90" finale'
    },

    5: { // SABATO 23 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-12:00',
        type: 'RESISTENZA',
        description: '🚴 Bike Long 120\' + Core + 🏍️ Plank Casco + 🍌 +600 KCAL',
        exercises: [
          { 
            name: '🚴 Bike Z2 120min', 
            sets: 1, 
            reps: '120min', 
            weight: 'HR 130-145', 
            tempo: 'Steady', 
            rest: 'N/A', 
            notes: '🎯 120 min target maintenance. Gel min 35, min 75', 
            rpe: 6,
            tracking: { 
              hrAvg: 'Target 135-140',
              distance: true,
              cadenceDrop: 'Target <5% 90-120min'
            }
          },
          { name: 'Plank Post-Bike', sets: 3, reps: '50"', tempo: 'Iso', rest: '30"', notes: 'Fatica metabolica', rpe: 7 },
          { name: 'Side Plank Post-Bike', sets: 3, reps: '35"/lato', tempo: 'Iso', rest: '30"', rpe: 7 },
          { name: 'Glute Bridge Post-Bike', sets: 3, reps: '45"', tempo: 'Iso', rest: '30"', notes: 'Drop 1→3 <15%', rpe: 6 },
          { name: '🏍️ PLANK CON CASCO', sets: 3, reps: '55"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: '⚡ +5" (3× questa settimana). Post-120\' bike = fatica MAX = transfer gara', rpe: 9, tracking: { postBike120: true, critical: true, note: 'Tollerato post-120min?' } },
          { name: 'Propriocezione (NOVITÀ)', sets: 1, reps: '15min', weight: 'N/A', notes: '⚡ NOVITÀ SETT 5! Balance eyes open/closed, mini squat, ankle circles. Feedback piede = input critico moto', rpe: 5, tracking: { new: true, baseline: true, moto3: true } },
        ],
        rpe: 7,
        volume: '150min',
        notes: '🍌 +600 KCAL: PRE 190 + INTRA 200 + POST 225 + CENA 115 extra = 2670 kcal totali. 🏍️ Plank casco 55" post-120\' = CRITICAL transfer ultimo giro gara'
      },
      recovery: null,
      notes: '⚡ Propriocezione: PRIMA VOLTA! Baseline balance. Plank casco post-120\' = transfer specifico massimo'
    },

    6: { // DOMENICA 24 Gen
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (OPZIONALE se 6/7 già fatto)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:00',
        type: 'TECNICO',
        description: 'Core Volume Transfer',
        exercises: [
          { name: 'Ab Wheel da Piedi Corto', sets: 4, reps: 8, weight: 'BW', tempo: '4-2-1', rest: '120"', notes: '50-60cm ROM. Progressione verso full', rpe: 8 },
          { name: 'Weighted Plank', sets: 4, reps: '60"', weight: '12kg', tempo: 'Iso', rest: '90"', notes: '+5" progression', rpe: 7.5 },
          { name: 'L-Sit', sets: 4, reps: '35-40"', weight: 'Parallette', tempo: 'Hold', rest: '75"', notes: 'Peak hold', rpe: 8 },
          { name: 'Hollow Hold', sets: 4, reps: '70"', weight: 'BW', tempo: 'Iso', rest: '60"', notes: 'Peak duration', rpe: 7 },
          { name: 'Superman', sets: 4, reps: '70"', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 7 },
          { name: 'Side Plank Weighted', sets: 4, reps: '50"/lato', weight: '5kg', tempo: 'Iso', rest: '75"', notes: 'Disco su fianco', rpe: 7 },
          { name: 'Copenhagen', sets: 4, reps: '35"/lato', weight: 'Panca', tempo: 'Iso', rest: '90"', notes: '+5" progression', rpe: 7.5 },
          { name: 'Dead Bug Long', sets: 4, reps: '15/lato', weight: 'BW', tempo: '8" hold', rest: '60"', rpe: 6 },
          { name: 'Russian Twist', sets: 4, reps: 40, weight: '12kg', tempo: 'Controlled', rest: '60"', notes: 'Disco 12kg', rpe: 7 },
          { name: 'Landmine Rotation', sets: 4, reps: '10/lato', weight: '35kg', tempo: '2-0-1', rest: '75"', notes: '+10kg vs Giovedì', rpe: 7.5 },
          { name: 'Cable Chop', sets: 4, reps: '12/lato', weight: '22kg', tempo: 'Explosive', rest: '60"', notes: '+2kg', rpe: 7 },
          { name: 'Bicycle Crunch', sets: 4, reps: 45, weight: 'BW', tempo: 'Controlled', rest: '60"', rpe: 6 },
          { name: 'Burpee Finisher', sets: 3, reps: 10, weight: 'BW', tempo: 'Fast', rest: '45"', notes: 'Metabolic finish', rpe: 8 },
          { name: 'Mountain Climber', sets: 3, reps: 20, weight: 'BW', tempo: 'Fast', rest: '45"', rpe: 7 },
        ],
        rpe: 7.5,
        volume: '60min',
        notes: '📊 Core volume: 55min. Totale settimana 10: ~250min. Ab wheel piedi progressione. Rotational power up'
      },
      recovery: {
        time: '18:00-18:20',
        type: 'RECUPERO',
        exercises: [
          { name: 'Full Body Flow', sets: 1, reps: '10min' },
          { name: 'Child\'s Pose', sets: 3, reps: '60"' },
          { name: 'Hip Openers', sets: 1, reps: '10min' },
        ],
        rpe: 2
      },
      notes: '✅ SETTIMANA 10 COMPLETATA! Transfer protocols started. Review: PAP effect? Plank casco tollerato? RSA quality? Dead-hang >70"? Ready sett 11'
    }
  },

  // ========================================================================
  // SETTIMANA 15 (22-28 Febbraio 2026) - ABSOLUTE PEAK TRANSFER 🏁
  // ========================================================================
  15: {
    0: { // LUNEDÌ 22 Feb - ABSOLUTE PEAK
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:40',
        type: 'POTENZA',
        description: '🏁 LOWER ABSOLUTE PEAK + 🏍️ CORE FINALE',
        exercises: [
          { name: 'Attivazione Neurale MAX', sets: 1, reps: '10min', notes: 'Box jump 50cm 3×3, Med ball 12kg 3×4, Vertical 3×4, Sprint 3×15"', rpe: 7 },
          { name: '🏁 Front Squat PEAK ASSOLUTO', sets: 5, reps: 3, weight: '48kg', tempo: '3-0-X', rest: '120"', notes: '🎯 +2kg vs sett 14 (PEAK MESO 3). ~90-92% 1RM. Forma 10/10 CRITICAL', rpe: 9.5, tracking: { absolutePeak: true, critical: true, note: 'Tutte 3 clean? Feels faster than peak?', milestone: 'ABSOLUTE PEAK questo ciclo' } },
          { name: 'Box Jump PEAK', sets: 5, reps: 2, weight: '75cm', tempo: 'Explosive', rest: '<10"', notes: '⚡ +5cm (PEAK HEIGHT absolute). PAP effect peak', rpe: 9, tracking: { peakHeight: true } },
          { name: 'Trap-Bar PEAK', sets: 5, reps: 2, weight: '76kg', tempo: '3-0-X', rest: '120"', notes: '🎯 +2kg (PEAK WEIGHT)', rpe: 9.5, tracking: { absolutePeak: true } },
          { name: 'Broad Jump', sets: 5, reps: 2, weight: 'BW', tempo: 'Explosive', rest: '<10"', notes: 'Target: best ever distance', rpe: 9, tracking: { distance: 'Record personale?', pap: true } },
          { name: 'Bulgarian Explosive', sets: 4, reps: '6/gamba', weight: '14kg/mano', tempo: 'X-0-2', rest: '90"', notes: '+2kg peak', rpe: 7 },
          { name: 'Nordic Curl', sets: 4, reps: 6, weight: 'Elastico leggero', tempo: '10" ecc', rest: '120"', notes: '10" eccentrica ultra-slow. Peak eccentric', rpe: 9.5, tracking: { note: '10" achieved?' } },
          { name: '🏁 AB WHEEL PIEDI FULL ROM', sets: 4, reps: 10, weight: 'BW', tempo: '4-2-1', rest: '120"', notes: '⚡ 100% FULL ROM! (era 95%). MILESTONE FINALE: Full extension da piedi', rpe: 10, tracking: { absolutePeak: true, critical: true, milestone: 'FULL ROM ACHIEVED? Form perfetta?' } },
          { name: 'Weighted Plank', sets: 4, reps: '75"', weight: '15kg', tempo: 'Iso', rest: '90"', notes: '🎯 +1kg PEAK weight. ABSOLUTE PEAK weighted plank', rpe: 8.5, tracking: { absolutePeak: true } },
          { name: '🏍️🏁 PLANK CON CASCO - TARGET FINALE 90"', sets: 4, reps: '90"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: '⚡⚡⚡ +5" vs sett 14 (85"). 🎯 TARGET FINALE RAGGIUNTO: 90"! Respirazione box 4-2-4 perfetta. RPE 10/10', rpe: 10, tracking: { absolutePeak: true, critical: true, milestone: 'TARGET FINALE 90"×4 = OBIETTIVO RAGGIUNTO! All 90"? All >85"? Respiratory 10/10? Form 10/10?', note: 'Se 4×90" completati = 🏁 FINALE TARGET ACHIEVED 🏁' } },
          { name: 'Dead Bug Breathing', sets: 4, reps: '18/lato', weight: 'BW', tempo: '4-2-4', rest: '75"', notes: 'Peak reps', rpe: 7 },
        ],
        rpe: 9.5,
        volume: '100min',
        notes: '🏁🏁🏁 ABSOLUTE PEAK SETTIMANA 15! Front squat 48kg, Ab wheel FULL ROM, PLANK CASCO 90"×4 = TARGET FINALE! Tracking: All milestones achieved?'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Psoas Stretch', sets: 2, reps: '60"/lato' },
          { name: 'Child\'s Pose', sets: 2, reps: '60"' },
        ],
        rpe: 2
      },
      notes: '🏁 MILESTONE DAY: Ab wheel FULL ROM + Plank casco 90" = obiettivi finali! Front squat 48kg peak. Ready per deload+taper'
    },

    1: { // MARTEDÌ 23 Feb - ABSOLUTE PEAK
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' + Cervical CARs',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
          { name: 'Cervical CARs', sets: 1, reps: '3min', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:25',
        type: 'POTENZA',
        description: 'Upper ABSOLUTE PEAK + Neck + Grip',
        exercises: [
          { name: 'Attivazione Upper', sets: 1, reps: '10min', notes: 'Clap push 3×5, Med ball 10kg 3×4, Band pull explosive 3×15', rpe: 7 },
          { name: 'Panca Manubri PEAK', sets: 5, reps: 4, weight: '18kg/mano', tempo: '3-0-X', rest: '120"', notes: '🏁 +0.5kg (PEAK WEIGHT)', rpe: 9.5, tracking: { absolutePeak: true, note: 'Tutte 4 clean?' } },
          { name: 'Clap Push-Up', sets: 5, reps: 8, weight: 'BW', tempo: 'Explosive', rest: '<10"', notes: '+1 rep peak. PAP peak effect', rpe: 9 },
          { name: 'Pull-Up Weighted PEAK', sets: 5, reps: 4, weight: '+8kg', tempo: '3-0-X', rest: '120"', notes: '🏁 +0.5kg (PEAK)', rpe: 9.5, tracking: { absolutePeak: true } },
          { name: 'Med Ball Throw', sets: 5, reps: 6, weight: '12kg', tempo: 'Explosive', rest: '<10"', notes: '+2kg peak weight ball', rpe: 9 },
          { name: 'Overhead Press', sets: 4, reps: 5, weight: '35kg', tempo: '3-0-X', rest: '90"', notes: '+2kg peak', rpe: 8 },
          { name: 'Barbell Row', sets: 4, reps: 6, weight: '45kg', tempo: '2-0-1', rest: '90"', notes: '+3kg peak', rpe: 8 },
          { name: 'Dips Weighted', sets: 4, reps: 6, weight: '+7kg', tempo: '2-0-2', rest: '90"', notes: '+2kg peak', rpe: 8.5 },
          { name: '🏁 NECK HARNESS 10KG', sets: 4, reps: 10, weight: '10kg', tempo: '2-0-2', rest: '90"', notes: '⚡⚡⚡ +1kg (TARGET 10KG RAGGIUNTO!). Extension + Flexion', rpe: 9, tracking: { absolutePeak: true, milestone: '10kg achieved! Tutte 10 reps?', critical: true } },
          { name: 'Lateral Neck', sets: 4, reps: '12/lato', weight: '6kg', tempo: '2-0-2', rest: '75"', notes: '+0.5kg peak', rpe: 8.5 },
          { name: '🏁 DEAD-HANG TEST 90"', sets: 3, reps: 'Max', weight: 'BW', tempo: 'Hold', rest: '360"', notes: '⚡⚡⚡ TARGET FINALE: >90"! Set 1: MAX ALL-OUT. 6 min rest', rpe: 10, tracking: { absolutePeak: true, critical: true, milestone: '>90" achieved? >85" minimum? vs Sett 1 (~45"): DOUBLING?', note: 'FINAL TARGET grip endurance' } },
          { name: 'Farmer\'s Walk PEAK', sets: 4, reps: '50m', weight: '32kg/mano', tempo: 'Steady', rest: '150"', notes: '🏁 +1kg (PEAK WEIGHT)', rpe: 9, tracking: { absolutePeak: true } },
          { name: 'Wrist Roller', sets: 4, reps: 'Up+Down', weight: '8kg', tempo: 'Slow', rest: '90"', notes: '🎯 Target weight maintenance (8kg = target)', rpe: 8 },
        ],
        rpe: 9.5,
        volume: '85min',
        notes: '🏁🏁🏁 ABSOLUTE PEAK UPPER: Neck 10kg target ✓, Dead-hang >90" test ✓, Farmer 32kg peak ✓, Panca 18kg ✓, Pull +8kg ✓'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Pettorale Stretch', sets: 2, reps: '60"' },
          { name: 'Dorsali Stretch', sets: 2, reps: '60"' },
          { name: 'Neck Gentle', sets: 1, reps: '30"/dir' },
        ],
        rpe: 2
      },
      notes: '🎯 MILESTONES: Neck 10kg ✓, Dead-hang >90" ✓, Farmer 32kg ✓. vs Sett 1: dead-hang ~45" → 90" = +100% (DOUBLING!)'
    },

    2: { // MERCOLEDÌ 24 Feb - RSA PEAK
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-11:30',
        type: 'TECNICO',
        description: '🚴 RSA ABSOLUTE PEAK + Core + 🧠 Dual-Task PEAK',
        exercises: [
          { 
            name: '🚴 RSA Z5 ABSOLUTE PEAK', 
            sets: 6, 
            reps: '30" sprint', 
            weight: 'HR 165-170', 
            tempo: '1:4 ratio', 
            rest: '120" Z1', 
            notes: '🏁 6×30" @ Z5 (165-170 bpm). Recovery 1:4 (120"). Target: power drop <4% (più strict vs 5%)', 
            rpe: 10,
            tracking: { 
              absolutePeak: true,
              critical: true,
              hrPeaks: 'Tutte 165-170 bpm?',
              hrRecovery: '<135 bpm entro 120"',
              powerDrop: '<4% achieved?',
              consistency: '10/10?'
            }
          },
          { name: 'Warm-up Z1→Z2', sets: 1, reps: '15min', weight: 'HR 120-135', rpe: 4 },
          { name: 'Cooldown Z1', sets: 1, reps: '18min', weight: 'HR 115-125', rpe: 3 },
          { name: 'Plank Post-RSA', sets: 3, reps: '60"', weight: 'BW', tempo: 'Iso', rest: '30"', notes: 'Peak duration post-Z5', rpe: 9 },
          { name: 'Side Plank Post-RSA', sets: 3, reps: '45"/lato', weight: 'BW', tempo: 'Iso', rest: '30"', rpe: 9 },
          { name: 'Glute Bridge Post-RSA', sets: 3, reps: '55"', weight: 'BW', tempo: 'Iso', rest: '30"', notes: 'Drop 1→3 target <15%', rpe: 8 },
          { name: '🧠 Plank Count-Back PEAK', sets: 3, reps: '60"', weight: 'BW', tempo: 'Iso', rest: '60"', notes: '+5" vs sett 14. Conta -7 da 200 (più difficile vs -3). Accuracy target >90%', rpe: 9, tracking: { cognitive: true, accuracy: true } },
          { name: '🧠 Dead Bug Math Complex', sets: 3, reps: '16/lato', weight: 'BW', tempo: 'Controlled', rest: '60"', notes: '+2 reps. 2-digit addition. Target >10/12 correct (83%+)', rpe: 8, tracking: { cognitive: true } },
          { name: '🧠 Side Plank Memory Task', sets: 2, reps: '45"/lato', weight: 'BW', tempo: 'Iso', rest: '60"', notes: '+10" peak. Sequenza 6 numeri ricordare durante hold. Memory under stress', rpe: 8, tracking: { cognitive: true, note: 'Sequenza corretta?' } },
        ],
        rpe: 9.5,
        volume: '90min',
        notes: '🏁 RSA PEAK: 6×30" Z5, power drop <4%, HR recovery <135. Dual-task accuracy >90% = cognitive sotto fatica. Mental fatigue 9-10/10 normale'
      },
      recovery: null,
      notes: 'RSA quality check: All HR peaks 165+? Power drop <4%? Dual-task >90% accuracy? = Race readiness'
    },

    3: { // GIOVEDÌ 25 Feb - METABOLIC CIRCUIT PEAK + WALL SIT FINALE
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' + Cervical CARs',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
          { name: 'Cervical CARs', sets: 1, reps: '3min', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-12:00',
        type: 'TECNICO',
        description: '🏁 METABOLIC CIRCUIT PEAK + 🎯🎯🎯 WALL SIT 3×120" = 6 MIN FINALE',
        exercises: [
          { 
            name: '🏁 METABOLIC CORE CIRCUIT - TARGET <36\'', 
            sets: 5, 
            reps: '5 stazioni', 
            weight: 'Bodyweight', 
            tempo: '60" work / 30" rest', 
            rest: '90" tra giri', 
            notes: '⚡⚡⚡ TARGET FINALE: <36 min (era <38\' sett 14, <40\' sett 13). PUSH MAX REPS ogni stazione. 5 giri: Plank 60" → Russian Twist 10kg → Mountain Climber → Bicycle Crunch → Burpee', 
            rpe: 10,
            tracking: { 
              absolutePeak: true,
              critical: true,
              tempo: 'Target: <36 min achieved?',
              plankDrop: '<15%? (più strict)',
              russianTotali: '+15 reps vs sett 13?',
              mountainTotali: '+25 reps vs sett 13?',
              burpeeTotali: '+12 reps vs sett 13?',
              hrMedia: true,
              hrPeak: '<170 bpm controllata?',
              note: 'Tempo completamento: ___ min. vs sett 14: -___ min. vs sett 13: -___ min'
            }
          },
          { name: 'Circuit Giro 1', sets: 1, reps: 'Track all', notes: 'Plank ___", Russian ___ reps, Mountain ___ reps, Bicycle ___ reps, Burpee ___ reps, HR end: ___ bpm', rpe: 10 },
          { name: 'Circuit Giro 2', sets: 1, reps: 'Track all', notes: 'Same tracking', rpe: 10 },
          { name: 'Circuit Giro 3', sets: 1, reps: 'Track all', notes: 'Same tracking', rpe: 10 },
          { name: 'Circuit Giro 4', sets: 1, reps: 'Track all', notes: 'Same tracking', rpe: 10 },
          { name: 'Circuit Giro 5', sets: 1, reps: 'Track all', notes: 'Same tracking', rpe: 10 },
          { name: 'Recovery Post-Circuit', sets: 1, reps: '10min', notes: 'Walk lento, breathing exercises, HR sotto 120', rpe: 3 },
          { 
            name: '🎯🎯🎯 WALL SIT - TARGET FINALE 3×120" = 6 MINUTI', 
            sets: 3, 
            reps: '120"', 
            weight: 'BW', 
            tempo: 'Isometric', 
            rest: '150"', 
            notes: '⚡⚡⚡ TARGET ASSOLUTO FINALE MESO 3! +10" vs sett 14 (110"). Post-circuit metabolico = difficoltà MAX. PROGRESSIONE: Sett 13: 100" (5min) → Sett 14: 110" (5.5min) → Sett 15: 120" (6min) ✓', 
            rpe: 10,
            tracking: { 
              absolutePeak: true,
              critical: true,
              milestone: '🏁 TARGET FINALE: 3×120" = 360" = 6 MINUTI TOTALI',
              set1: 'Set 1: ___ " (target: 120")',
              set2: 'Set 2: ___ " (target: 120")',
              set3: 'Set 3: ___ " (target: 120")',
              allTarget: 'All 120": SI/NO ← FINALE TARGET',
              allMin: 'All >115": SI/NO (acceptable)',
              allAcceptable: 'All >110": SI/NO (minimum)',
              forma: 'Forma perfetta: SI/NO',
              quadBurn: 'Quad burn 10/10: SI/NO (normale)',
              note: 'SE 3×120" COMPLETATI = 🏁🏁🏁 OBIETTIVO FINALE RAGGIUNTO! TOTAL: 360" = 6 MINUTI WALL SIT. vs Sett 1 baseline (45"): +75" = +166% improvement'
            }
          },
          { name: 'Step-Up', sets: 3, reps: '8/gamba', weight: '22kg/mano', tempo: '2-0-2', rest: '75"', notes: 'Maintenance post-wall sit', rpe: 7 },
          { name: 'Copenhagen', sets: 4, reps: '45"/lato', weight: 'Panca', tempo: 'Iso', rest: '90"', notes: 'Peak duration', rpe: 8 },
        ],
        rpe: 10,
        volume: '120min',
        notes: '🏁🏁🏁 GIORNATA FINALE MILESTONE: Circuit <36min + Wall Sit 3×120" = 6 min totali! Load: circuit RPE 10 × 40\' = 400 + wall sit RPE 10 × 6\' = 60 = 460 unità total. Mental toughness 10/10 required'
      },
      recovery: {
        time: '18:00-18:25',
        type: 'RECUPERO',
        description: 'Stretching Esteso Recovery',
        exercises: [
          { name: 'Hip Openers Flow', sets: 1, reps: '12min' },
          { name: 'Psoas Stretch', sets: 3, reps: '90"/lato' },
          { name: 'Quad Stretch', sets: 3, reps: '90"/lato' },
          { name: 'Child\'s Pose', sets: 3, reps: '120"' },
        ],
        rpe: 2
      },
      notes: '🏁 SE COMPLETATI: Circuit <36\' ✓ + Wall Sit 3×120" ✓ = DUE OBIETTIVI FINALI RAGGIUNTI! Achievement feeling 10/10. Ready Friday recovery'
    },

    4: { // VENERDÌ 26 Feb - RECOVERY ACTIVE
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:35',
        type: 'RECUPERO',
        description: '🔄 Recovery Active Post-Peak',
        exercises: [
          { name: 'Push-Up Light', sets: 3, reps: 15, weight: 'BW', tempo: '3-0-1', rest: '60"', notes: 'Facile, controlled', rpe: 5 },
          { name: 'Inverted Row', sets: 3, reps: 10, weight: 'Angolo easy', tempo: '2-0-2', rest: '60"', rpe: 5 },
          { name: 'Pike Push-Up', sets: 3, reps: 12, weight: 'BW', tempo: '2-0-1', rest: '60"', rpe: 5 },
          { name: 'Dead-Hang', sets: 2, reps: '40-50"', weight: 'BW', tempo: 'Hold', rest: '120"', notes: 'NO peso, comfortable maintenance', rpe: 5 },
          { name: 'Farmer\'s Walk', sets: 2, reps: '40m', weight: '24kg/mano', tempo: 'Steady', rest: '120"', notes: 'Ridotto -8kg recovery', rpe: 5 },
          { name: 'Wrist Roller', sets: 2, reps: 'Up+Down', weight: '7kg', tempo: 'Slow', rest: '90"', notes: 'Ridotto -1kg', rpe: 5 },
        ],
        rpe: 5,
        volume: '35min',
        notes: '🔄 Post-peak absolute recovery. Load: RPE 5 × 35\' = 175 unità. Recovery quality /10? Ready deload?'
      },
      recovery: {
        time: '18:00-18:20',
        type: 'RECUPERO',
        exercises: [
          { name: 'Full Body Stretching', sets: 1, reps: '20min' },
        ],
        rpe: 2
      },
      notes: 'Recovery post-Giovedì intenso. Energia /10? Ready per deload sett 16?'
    },

    5: { // SABATO 27 Feb - BIKE LONG + PLANK CASCO CONSOLIDAMENTO
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-12:00',
        type: 'RESISTENZA',
        description: '🚴 Bike 120\' + Core + 🏍️ Plank Casco 90" + 🍌 +600 KCAL',
        exercises: [
          { 
            name: '🚴 Bike Z2 120min', 
            sets: 1, 
            reps: '120min', 
            weight: 'HR 130-145', 
            tempo: 'Steady', 
            rest: 'N/A', 
            notes: 'Consolidamento 120\' consistency. Gel min 35, min 75', 
            rpe: 6,
            tracking: { 
              hrAvg: 'Target 135-140',
              distance: true,
              cadenceDrop: 'Target <5%',
              powerConsistency: '/10'
            }
          },
          { name: 'Plank Post-Bike', sets: 3, reps: '50"', tempo: 'Iso', rest: '30"', rpe: 7 },
          { name: 'Side Plank Post-Bike', sets: 3, reps: '35"/lato', tempo: 'Iso', rest: '30"', rpe: 7 },
          { name: 'Glute Bridge Post-Bike', sets: 3, reps: '45"', tempo: 'Iso', rest: '30"', notes: 'Drop <15%', rpe: 6 },
          { name: '🏍️ PLANK CON CASCO 90" CONSOLIDAMENTO', sets: 4, reps: '90"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: 'Consolidamento target finale. All 90": SI/NO. Consistency /10', rpe: 9, tracking: { consolidation: true, note: 'All 90" clean? vs Lunedì consistency?' } },
          { name: 'Propriocezione PEAK', sets: 1, reps: '15min', notes: 'Eyes closed 40"/gamba peak. Bosu 35"/gamba. Single-leg reach 12/gamba', rpe: 5, tracking: { peak: true } },
        ],
        rpe: 7,
        volume: '150min',
        notes: '🍌 +600 KCAL protocol standard. 🏍️ Plank casco 90" consolidato post-120\' = transfer MAX. Consistency check vs Lunedì'
      },
      recovery: null,
      notes: 'Plank casco 90"×4 post-120\': se tutte clean = target consolidato ✓'
    },

    6: { // DOMENICA 28 Feb - OFF O CORE LIGHT
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (OPZIONALE)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: null,
        type: 'RIPOSO',
        description: '🛏️ OFF COMPLETO RACCOMANDATO O Core Light (30\')',
        exercises: [
          { name: 'OPZIONE A: OFF COMPLETO', sets: 1, reps: 'N/A', notes: '🛏️ RACCOMANDATO: Riposo completo post-peak. Zero workout. Famiglia, relax, mental recovery', rpe: 0, tracking: { recommended: true } },
          { name: 'OPZIONE B: Core Light (SE energia >9/10)', sets: 1, reps: '30min', notes: 'Plank 3×45", Dead Bug 3×12/lato, Bird Dog 3×10/lato, Stretching 15min', rpe: 4, tracking: { optional: true, note: 'Fai SOLO se ti senti freschissimo' } },
        ],
        rpe: 0,
        volume: '0-30min',
        notes: '🛏️ Post-5 giorni peak intensity: OFF completo priorità. Fatica fine Meso 3: /10 (expect 9-10/10). Motivation: /10. Ready deload+taper: /10'
      },
      recovery: {
        time: '18:00-18:20',
        type: 'RECUPERO',
        description: 'Stretching Gentle (opzionale)',
        exercises: [
          { name: 'Full Body Flow', sets: 1, reps: '10min', notes: 'Se fatto core light' },
          { name: 'Child\'s Pose', sets: 3, reps: '60"', notes: 'Sempre ok' },
        ],
        rpe: 2
      },
      notes: '✅ MESO 3 PEAK TRANSFER COMPLETATO! Review sera OBBLIGATORIO: All milestones? HRV? Rigidità? Performance vs targets? Ready deload 16?'
    }
  },

  // ========================================================================
  // SETTIMANA 18 (15-21 Marzo 2026) - 🏁 PEAK READINESS FINALE + KPI TEST
  // ========================================================================
  18: {
    0: { // LUNEDÌ 15 Mar - MOVEMENT QUALITY
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:40',
        type: 'MOBILITA',
        description: 'Movement Quality Light',
        exercises: [
          { name: 'Goblet Squat', sets: 2, reps: 8, weight: '14kg', tempo: '3-2-1', rest: '60"', notes: 'Pattern maintenance', rpe: 4 },
          { name: 'Step-Up', sets: 2, reps: '8/gamba', weight: 'BW', tempo: '2-0-2', rest: '60"', rpe: 4 },
          { name: 'Plank', sets: 2, reps: '45"', weight: 'BW', tempo: 'Iso', rest: '60"', rpe: 4 },
          { name: 'Push-Up', sets: 2, reps: 12, weight: 'BW', tempo: '2-0-1', rest: '60"', rpe: 4 },
          { name: 'Row Easy', sets: 2, reps: 10, weight: 'Light', tempo: '2-0-2', rest: '60"', rpe: 4 },
          { name: 'Mobility Flow', sets: 1, reps: '10min', notes: 'Full body gentle', rpe: 3 },
        ],
        rpe: 4,
        volume: '40min',
        notes: 'Load: RPE 4 × 40\' = 160 unità. Movement quality /10. Taper profondo'
      },
      recovery: {
        time: '18:00-18:15',
        type: 'RECUPERO',
        exercises: [
          { name: 'Full Body Stretching', sets: 1, reps: '15min' },
        ],
        rpe: 2
      },
      notes: 'Taper week: minimum movimento, maximum freshness. Energy /10 (target: 10/10)'
    },

    1: { // MARTEDÌ 16 Mar - OFF
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine 12\' (OPZIONALE)',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: null,
        type: 'RIPOSO',
        description: '🛏️ OFF RACCOMANDATO O Walk Gentle',
        exercises: [
          { name: 'Walk Gentle', sets: 1, reps: '30min', weight: 'HR <110', notes: 'Opzionale, molto gentle', rpe: 2, tracking: { optional: true } },
        ],
        rpe: 0,
        volume: '0-30min',
        notes: 'Riposo pre-KPI test Giovedì. Load: 0 unità. HRV morning: ___ ms (target: >60)'
      },
      recovery: null,
      notes: 'OFF priorità. Mental prep inizia. Visualization 10min sera'
    },

    2: { // MERCOLEDÌ 17 Mar - BIKE SHORT
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\'',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-10:40',
        type: 'RECUPERO',
        description: 'Bike Z1 Short',
        exercises: [
          { name: 'Bike Z1', sets: 1, reps: '40min', weight: 'HR 115-120', tempo: 'Very easy', rest: 'N/A', notes: 'Spin legs gentle. Conversational++', rpe: 3, tracking: { feel: 'Deve essere piacevole', legsF fresh: 'SI/NO' } },
        ],
        rpe: 3,
        volume: '40min',
        notes: 'Load: RPE 3 × 40\' = 120 unità. Legs feel fresh: SI/NO. HRV: ___ ms'
      },
      recovery: null,
      notes: 'Light spin pre-KPI test. Gambe devono sentirsi fresche. Domani = THE DAY'
    },

    3: { // 🏁🏁🏁 GIOVEDÌ 18 Mar - KPI FINALI TEST 🏁🏁🏁
      morning: {
        time: '06:00-06:12',
        type: 'MOBILITA',
        description: 'Routine Mattutina 12\' PERFETTA',
        exercises: [
          { name: 'Cat-Cow', sets: 2, reps: 15, notes: 'Focus perfect form', rpe: 3 },
          { name: 'Child\'s Pose', sets: 2, reps: '45"', notes: 'Breathing deep', rpe: 3 },
          { name: 'Glute Bridge', sets: 2, reps: 12, notes: 'Activation', rpe: 3 },
          { name: 'Psoas Stretch', sets: 2, reps: '40"/lato', notes: 'Full mobility', rpe: 3 },
        ],
        rpe: 3
      },
      main: {
        time: '10:00-12:30',
        type: 'GARA',
        description: '🏁🏁🏁 KPI FINALI TEST - CHECKLIST 22 ITEMS 🏁🏁🏁',
        exercises: [
          { name: '=== BLOCCO 1: CORE (60min) ===', sets: 1, reps: 'N/A', notes: '⚡ Eseguire IN ORDINE con 10min rest tra blocchi', rpe: 0 },
          { name: '1. WALL SIT 3×120" TEST', sets: 3, reps: '120"', weight: 'BW', tempo: 'Iso', rest: '150"', notes: '🎯 TARGET FINALE: 3×120" = 360" = 6 MINUTI TOTALI. Set1:___ Set2:___ Set3:___ | All 120": SI/NO ✓✓✓ | All >110": SI/NO (min)', rpe: 10, tracking: { kpi: true, critical: true, item: '1/22', milestone: 'TARGET FINALE' } },
          { name: '2. PLANK CASCO 4×90"', sets: 4, reps: '90"', weight: 'Casco 1.4kg', tempo: 'Iso', rest: '90"', notes: '🏍️ Set1-4: ___ / ___ / ___ / ___ | All 90": SI/NO ✓✓✓', rpe: 10, tracking: { kpi: true, critical: true, item: '2/22', moto3: true } },
          { name: '3. DEAD-HANG >90"', sets: 1, reps: 'Max', weight: 'BW', tempo: 'Hold', rest: 'N/A', notes: '💪 Max attempt: ___ " | >90": SI/NO ✓✓✓ | >85": SI/NO (min)', rpe: 10, tracking: { kpi: true, critical: true, item: '3/22' } },
          { name: '4. AB WHEEL PIEDI FULL ROM', sets: 1, reps: 10, weight: 'BW', tempo: '4-2-1', rest: 'N/A', notes: '🎯 10 reps clean: SI/NO ✓✓✓ | Forma perfetta: SI/NO', rpe: 10, tracking: { kpi: true, critical: true, item: '4/22' } },

			