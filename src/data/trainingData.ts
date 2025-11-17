// Complete 18-week Moto3 Pilot Training Data

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  tempo?: string;
  rest?: number;
  rpe?: number;
  notes?: string;
}

export interface TrainingSession {
  type: string;
  exercises: Exercise[];
  notes?: string;
}

export interface DayPlan {
  morning?: TrainingSession;
  main?: TrainingSession;
  recovery?: TrainingSession;
}

export interface WeekPlan {
  week: number;
  mesocycle: string;
  focus: string;
  days: {
    Monday: DayPlan;
    Tuesday: DayPlan;
    Wednesday: DayPlan;
    Thursday: DayPlan;
    Friday: DayPlan;
    Saturday: DayPlan;
    Sunday: DayPlan;
  };
}

export const TRAINING_TYPES = {
  'Forza Massimale': { emoji: '🏋️', color: '#DC2626' },
  'Potenza': { emoji: '⚡', color: '#F59E0B' },
  'Resistenza': { emoji: '🔥', color: '#EF4444' },
  'Tecnico Specifico': { emoji: '🏍️', color: '#8B5CF6' },
  'Mobilità/Correttivo': { emoji: '🧘', color: '#10B981' },
  'Recupero Attivo': { emoji: '♻️', color: '#3B82F6' },
  'Riposo Completo': { emoji: '😴', color: '#6B7280' },
  'Deload': { emoji: '📉', color: '#14B8A6' },
  'Gara': { emoji: '🏁', color: '#EC4899' },
};

// Morning Routines
export const morningRoutines = [
  {
    id: 'activation',
    name: 'Attivazione Cardiovascolare',
    exercises: [
      { name: 'Jumping Jacks', sets: 2, reps: 30, rest: 30, rpe: 3 },
      { name: 'High Knees', sets: 2, reps: 30, rest: 30, rpe: 4 },
      { name: 'Butt Kicks', sets: 2, reps: 30, rest: 30, rpe: 3 },
    ]
  },
  {
    id: 'mobility-upper',
    name: 'Mobilità Upper Body',
    exercises: [
      { name: 'Arm Circles', sets: 2, reps: 15, rest: 20, rpe: 2 },
      { name: 'Shoulder Dislocates', sets: 2, reps: 12, rest: 20, rpe: 3 },
      { name: 'Cat-Cow', sets: 2, reps: 15, rest: 20, rpe: 2 },
    ]
  },
];

// Warmup Exercises
export const warmupExercises = [
  { name: 'Cat-Cow Stretch', sets: 2, reps: 15, notes: 'Focus on spinal mobility' },
  { name: 'Glute Bridge', sets: 3, reps: 12, notes: 'Activate posterior chain' },
  { name: 'Dead Bug', sets: 3, reps: 8, notes: 'Core stability' },
  { name: 'Bird Dog', sets: 3, reps: 8, notes: 'Balance and coordination' },
  { name: 'Psoas March', sets: 2, reps: 20, notes: 'Hip flexor activation' },
  { name: 'Wall Slides', sets: 2, reps: 12, notes: 'Shoulder mobility' },
  { name: 'Hip CARs', sets: 2, reps: 5, notes: 'Hip controlled articular rotations' },
  { name: 'Thoracic Rotations', sets: 2, reps: 10, notes: 'T-spine mobility' },
];

// Complete 18-Week Training Plan
export const COMPLETE_TRAINING_DATA: WeekPlan[] = [
  // WEEK 1 - Anatomical Adaptation
  {
    week: 1,
    mesocycle: 'Meso 1A - Fondamenta',
    focus: 'Baseline + GPP',
    days: {
      Monday: {
        morning: {
          type: 'Mobilità/Correttivo',
          exercises: [
            { name: 'Cat-Cow', sets: 2, reps: 15, tempo: '2-0-2-0', rest: 30, rpe: 3 },
            { name: 'Glute Bridge', sets: 3, reps: 12, tempo: '2-1-2-0', rest: 45, rpe: 4 },
            { name: 'Dead Bug', sets: 3, reps: 8, tempo: '3-0-3-0', rest: 45, rpe: 4 },
          ]
        },
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Goblet Squat', sets: 4, reps: 12, tempo: '3-0-1-0', rest: 90, rpe: 6, notes: 'Focus sulla tecnica' },
            { name: 'Bulgarian Split Squat', sets: 3, reps: 10, tempo: '2-0-2-0', rest: 60, rpe: 6 },
            { name: 'Plank', sets: 3, reps: '45s', rest: 60, rpe: 5 },
            { name: 'Pallof Press', sets: 3, reps: 12, rest: 60, rpe: 5 },
          ]
        },
        recovery: {
          type: 'Recupero Attivo',
          exercises: [
            { name: 'Foam Roll Lower Body', sets: 1, reps: '10min', rpe: 3 },
            { name: 'Static Stretch', sets: 1, reps: '10min', rpe: 2 },
          ]
        }
      },
      Tuesday: {
        morning: {
          type: 'Mobilità/Correttivo',
          exercises: [
            { name: 'Shoulder Dislocates', sets: 2, reps: 12, rest: 30, rpe: 3 },
            { name: 'Wall Slides', sets: 2, reps: 12, rest: 30, rpe: 3 },
          ]
        },
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Push-Up', sets: 4, reps: 12, tempo: '2-0-2-0', rest: 90, rpe: 6 },
            { name: 'TRX Row', sets: 4, reps: 12, tempo: '2-1-2-0', rest: 90, rpe: 6 },
            { name: 'Dumbbell Press', sets: 3, reps: 10, rest: 75, rpe: 6 },
            { name: 'Farmer Carry', sets: 3, reps: '40m', rest: 60, rpe: 6 },
          ]
        }
      },
      Wednesday: {
        morning: {
          type: 'Mobilità/Correttivo',
          exercises: morningRoutines[0].exercises
        },
        main: {
          type: 'Resistenza',
          exercises: [
            { name: 'Bike (Zone 2)', sets: 1, reps: '30min', rpe: 5, notes: '120-140 bpm' },
            { name: 'Core Circuit', sets: 3, reps: '10min', rest: 60, rpe: 6 },
          ]
        }
      },
      Thursday: {
        main: {
          type: 'Tecnico Specifico',
          exercises: [
            { name: 'Box Jump', sets: 4, reps: 5, rest: 120, rpe: 6, notes: 'Max altezza, focus atterraggio' },
            { name: 'Med Ball Slam', sets: 4, reps: 8, rest: 90, rpe: 7 },
            { name: 'Reaction Drills', sets: 5, reps: '30s', rest: 90, rpe: 7 },
          ]
        }
      },
      Friday: {
        morning: {
          type: 'Mobilità/Correttivo',
          exercises: morningRoutines[1].exercises
        },
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Deadlift (RDL)', sets: 4, reps: 10, tempo: '3-1-1-0', rest: 120, rpe: 6 },
            { name: 'Walking Lunge', sets: 3, reps: 12, rest: 60, rpe: 6 },
            { name: 'Single-Leg RDL', sets: 3, reps: 8, rest: 60, rpe: 6 },
          ]
        }
      },
      Saturday: {
        main: {
          type: 'Tecnico Specifico',
          exercises: [
            { name: 'Simulazione Gara', sets: 1, reps: '45min', rpe: 7, notes: 'Full gear, track simulation' },
            { name: 'Posture Work', sets: 3, reps: '5min', rest: 120, rpe: 5 },
          ]
        }
      },
      Sunday: {
        main: {
          type: 'Riposo Completo',
          exercises: [
            { name: 'Rest Day', notes: 'Recovery, idratazione, nutrizione' }
          ]
        }
      }
    }
  },

  // WEEK 2 - Progression +5%
  {
    week: 2,
    mesocycle: 'Meso 1A - Fondamenta',
    focus: 'Progressione Volume +5%',
    days: {
      Monday: {
        morning: { type: 'Mobilità/Correttivo', exercises: morningRoutines[0].exercises },
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Goblet Squat', sets: 4, reps: 13, tempo: '3-0-1-0', rest: 90, rpe: 6.5 },
            { name: 'Bulgarian Split Squat', sets: 3, reps: 11, rest: 60, rpe: 6.5 },
            { name: 'Plank', sets: 3, reps: '50s', rest: 60, rpe: 5.5 },
          ]
        }
      },
      Tuesday: {
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Push-Up', sets: 4, reps: 13, rest: 90, rpe: 6.5 },
            { name: 'TRX Row', sets: 4, reps: 13, rest: 90, rpe: 6.5 },
          ]
        }
      },
      Wednesday: {
        main: {
          type: 'Resistenza',
          exercises: [
            { name: 'Bike (Zone 2)', sets: 1, reps: '35min', rpe: 5.5 },
          ]
        }
      },
      Thursday: {
        main: {
          type: 'Potenza',
          exercises: [
            { name: 'Box Jump', sets: 5, reps: 5, rest: 120, rpe: 7 },
            { name: 'Med Ball Slam', sets: 4, reps: 10, rest: 90, rpe: 7 },
          ]
        }
      },
      Friday: {
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Deadlift (RDL)', sets: 4, reps: 11, rest: 120, rpe: 6.5 },
            { name: 'Walking Lunge', sets: 3, reps: 14, rest: 60, rpe: 6.5 },
          ]
        }
      },
      Saturday: {
        main: {
          type: 'Tecnico Specifico',
          exercises: [
            { name: 'Track Practice', sets: 1, reps: '50min', rpe: 7 },
          ]
        }
      },
      Sunday: {
        main: { type: 'Riposo Completo', exercises: [{ name: 'Rest Day' }] }
      }
    }
  },

  // WEEK 3 - Peak Week Meso 1A
  {
    week: 3,
    mesocycle: 'Meso 1A - Fondamenta',
    focus: 'Peak Week +10%',
    days: {
      Monday: {
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Goblet Squat', sets: 5, reps: 14, rest: 90, rpe: 7 },
            { name: 'Bulgarian Split Squat', sets: 4, reps: 12, rest: 60, rpe: 7 },
          ]
        }
      },
      Tuesday: {
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Push-Up Weighted', sets: 4, reps: 12, rest: 90, rpe: 7 },
            { name: 'Pull-Up', sets: 4, reps: 8, rest: 90, rpe: 7.5 },
          ]
        }
      },
      Wednesday: {
        main: {
          type: 'Resistenza',
          exercises: [
            { name: 'HIIT Bike', sets: 8, reps: '30s on/30s off', rpe: 8 },
          ]
        }
      },
      Thursday: {
        main: {
          type: 'Potenza',
          exercises: [
            { name: 'Broad Jump', sets: 5, reps: 5, rest: 120, rpe: 7.5 },
            { name: 'Power Clean', sets: 4, reps: 5, rest: 120, rpe: 7.5 },
          ]
        }
      },
      Friday: {
        main: {
          type: 'Forza Massimale',
          exercises: [
            { name: 'Trap Bar Deadlift', sets: 5, reps: 8, rest: 150, rpe: 7.5 },
          ]
        }
      },
      Saturday: {
        main: {
          type: 'Tecnico Specifico',
          exercises: [
            { name: 'Race Simulation', sets: 1, reps: '60min', rpe: 8 },
          ]
        }
      },
      Sunday: {
        main: { type: 'Riposo Completo', exercises: [{ name: 'Rest Day' }] }
      }
    }
  },

  // WEEK 4 - DELOAD
  {
    week: 4,
    mesocycle: 'Deload 1',
    focus: 'Recupero e Supercompensazione',
    days: {
      Monday: {
        main: {
          type: 'Deload',
          exercises: [
            { name: 'Goblet Squat', sets: 3, reps: 8, rest: 90, rpe: 4, notes: '50% intensità' },
            { name: 'Mobility Work', sets: 1, reps: '15min', rpe: 3 },
          ]
        }
      },
      Tuesday: {
        main: {
          type: 'Recupero Attivo',
          exercises: [
            { name: 'Swim', sets: 1, reps: '30min', rpe: 3 },
          ]
        }
      },
      Wednesday: {
        main: { type: 'Riposo Completo', exercises: [{ name: 'Rest Day' }] }
      },
      Thursday: {
        main: {
          type: 'Deload',
          exercises: [
            { name: 'Push-Up', sets: 3, reps: 8, rest: 60, rpe: 4 },
            { name: 'Yoga', sets: 1, reps: '30min', rpe: 3 },
          ]
        }
      },
      Friday: {
        main: {
          type: 'Recupero Attivo',
          exercises: [
            { name: 'Light Bike', sets: 1, reps: '20min', rpe: 3 },
          ]
        }
      },
      Saturday: {
        main: {
          type: 'Mobilità/Correttivo',
          exercises: [
            { name: 'Full Body Stretch', sets: 1, reps: '45min', rpe: 2 },
          ]
        }
      },
      Sunday: {
        main: { type: 'Riposo Completo', exercises: [{ name: 'Rest Day' }] }
      }
    }
  },

  // WEEK 5-18 (Simplified for brevity - can be expanded with full details)
  ...Array.from({ length: 14 }, (_, i) => ({
    week: i + 5,
    mesocycle: i < 3 ? 'Meso 2A - Ipertrofia' : i < 4 ? 'Deload 2' : i < 7 ? 'Meso 2B-3 - Forza/Potenza' : i < 8 ? 'Deload 3' : i < 11 ? 'Meso 4 - Peak Transfer' : i < 12 ? 'Deload 4 + Taper' : 'Taper + Peak',
    focus: i < 3 ? 'Volume Work' : i < 4 ? 'Recovery' : i < 7 ? 'Max Strength' : i < 8 ? 'Recovery' : i < 11 ? 'Race Specific' : 'Competition Prep',
    days: {
      Monday: {
        main: {
          type: i < 3 ? 'Forza Massimale' : i < 4 ? 'Deload' : i < 7 ? 'Potenza' : i < 8 ? 'Deload' : 'Tecnico Specifico',
          exercises: [
            { name: 'Primary Lift', sets: i < 4 ? 3 : 4, reps: i < 3 ? 10 : i < 4 ? 6 : 5, rest: 120, rpe: i < 4 ? 4 : i + 2 }
          ]
        }
      },
      Tuesday: {
        main: {
          type: i < 3 ? 'Forza Massimale' : i < 4 ? 'Recupero Attivo' : i < 7 ? 'Potenza' : 'Tecnico Specifico',
          exercises: [
            { name: 'Upper Body Work', sets: 4, reps: i < 3 ? 10 : 5, rest: 90, rpe: i + 3 }
          ]
        }
      },
      Wednesday: {
        main: {
          type: i < 7 ? 'Resistenza' : 'Tecnico Specifico',
          exercises: [
            { name: i < 7 ? 'Conditioning' : '🏍️ Track Work', sets: 1, reps: i < 7 ? '40min' : '60min', rpe: i + 4 }
          ]
        }
      },
      Thursday: {
        main: {
          type: 'Potenza',
          exercises: [
            { name: 'Explosive Work', sets: 5, reps: 5, rest: 120, rpe: i + 4 }
          ]
        }
      },
      Friday: {
        main: {
          type: i < 3 ? 'Forza Massimale' : 'Tecnico Specifico',
          exercises: [
            { name: 'Posterior Chain', sets: 4, reps: i < 3 ? 8 : 5, rest: 120, rpe: i + 3 }
          ]
        }
      },
      Saturday: {
        main: {
          type: i > 10 ? 'Gara' : 'Tecnico Specifico',
          exercises: [
            { name: i > 10 ? '🏁 RACE PREP' : '🏍️ Track Practice', sets: 1, reps: '90min', rpe: i + 5 }
          ]
        }
      },
      Sunday: {
        main: { type: 'Riposo Completo', exercises: [{ name: 'Rest Day' }] }
      }
    }
  }))
];

// Quick Reference Data
export const quickReference = {
  hydration: '3-4L water/day, 500ml pre-session, 150-250ml/15min during',
  nutrition: 'Carbs: 6-8g/kg, Protein: 1.6-2.2g/kg, Fats: 1g/kg',
  sleep: '8-9h target, <7h = performance drop',
  recovery: 'HRV target: ≥55ms, Readiness: ≥20/25',
};

export const redFlags = [
  { flag: 'HRV < 45ms', action: 'Reduce intensity 30-50%' },
  { flag: 'Readiness < 15/25', action: 'Active recovery only' },
  { flag: 'Sleep < 6h for 2+ nights', action: 'Deload week' },
  { flag: 'Persistent soreness > 48h', action: 'Medical check' },
];
