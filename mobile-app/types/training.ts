
export interface MorningRoutineItem {
  id: string;
  title: string;
  completed: boolean;
  time?: number;
  description?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  notes?: string;
  description?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: 'warmup' | 'cooldown' | 'stretching' | 'foam-rolling' | 'mobility' | 'training';
  exercises: Exercise[];
  duration: number;
  completed: boolean;
  notes?: string;
}

export interface DailyReadiness {
  id: string;
  date: string;
  sleepQuality: number;
  musclesSoreness: number;
  mood: number;
  energy: number;
  motivation: number;
  hrv?: number;
  restingHeartRate?: number;
  weight?: number;
  notes?: string;
}

export interface RedFlag {
  id: string;
  date: string;
  type: 'injury' | 'illness' | 'fatigue' | 'pain' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
}

export interface ProgressData {
  date: string;
  weight?: number;
  stiffness?: number;
  load?: number;
  hrv?: number;
  exercisePerformance?: { [exerciseId: string]: number };
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  focus: string;
  days: DayPlan[];
}

export interface DayPlan {
  dayOfWeek: number;
  date: string;
  type: 'training' | 'recovery' | 'rest';
  sessions: WorkoutSession[];
  completed: boolean;
}

export interface TimerInterval {
  id: string;
  name: string;
  duration: number;
  rest?: number;
  sets?: number;
}
