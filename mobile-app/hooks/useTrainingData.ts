
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  MorningRoutineItem, 
  WorkoutSession, 
  DailyReadiness, 
  RedFlag, 
  ProgressData,
  WeekPlan 
} from '@/types/training';

const STORAGE_KEYS = {
  MORNING_ROUTINE: '@moto3_morning_routine',
  WORKOUTS: '@moto3_workouts',
  READINESS: '@moto3_readiness',
  RED_FLAGS: '@moto3_red_flags',
  PROGRESS: '@moto3_progress',
  WEEK_PLANS: '@moto3_week_plans',
};

export function useTrainingData() {
  const [morningRoutine, setMorningRoutine] = useState<MorningRoutineItem[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [readinessData, setReadinessData] = useState<DailyReadiness[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [routine, workoutsData, readiness, flags, progress, plans] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MORNING_ROUTINE),
        AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
        AsyncStorage.getItem(STORAGE_KEYS.READINESS),
        AsyncStorage.getItem(STORAGE_KEYS.RED_FLAGS),
        AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.WEEK_PLANS),
      ]);

      if (routine) setMorningRoutine(JSON.parse(routine));
      if (workoutsData) setWorkouts(JSON.parse(workoutsData));
      if (readiness) setReadinessData(JSON.parse(readiness));
      if (flags) setRedFlags(JSON.parse(flags));
      if (progress) setProgressData(JSON.parse(progress));
      if (plans) setWeekPlans(JSON.parse(plans));
    } catch (error) {
      console.log('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMorningRoutine = async (routine: MorningRoutineItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MORNING_ROUTINE, JSON.stringify(routine));
      setMorningRoutine(routine);
    } catch (error) {
      console.log('Error saving morning routine:', error);
    }
  };

  const saveWorkout = async (workout: WorkoutSession) => {
    try {
      const updated = [...workouts, workout];
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
      setWorkouts(updated);
    } catch (error) {
      console.log('Error saving workout:', error);
    }
  };

  const saveReadiness = async (readiness: DailyReadiness) => {
    try {
      const updated = [...readinessData, readiness];
      await AsyncStorage.setItem(STORAGE_KEYS.READINESS, JSON.stringify(updated));
      setReadinessData(updated);
    } catch (error) {
      console.log('Error saving readiness:', error);
    }
  };

  const saveRedFlag = async (flag: RedFlag) => {
    try {
      const updated = [...redFlags, flag];
      await AsyncStorage.setItem(STORAGE_KEYS.RED_FLAGS, JSON.stringify(updated));
      setRedFlags(updated);
    } catch (error) {
      console.log('Error saving red flag:', error);
    }
  };

  const saveProgress = async (progress: ProgressData) => {
    try {
      const updated = [...progressData, progress];
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
      setProgressData(updated);
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  const saveWeekPlan = async (plan: WeekPlan) => {
    try {
      const existingIndex = weekPlans.findIndex(p => p.weekNumber === plan.weekNumber);
      let updated;
      if (existingIndex >= 0) {
        updated = [...weekPlans];
        updated[existingIndex] = plan;
      } else {
        updated = [...weekPlans, plan];
      }
      await AsyncStorage.setItem(STORAGE_KEYS.WEEK_PLANS, JSON.stringify(updated));
      setWeekPlans(updated);
    } catch (error) {
      console.log('Error saving week plan:', error);
    }
  };

  return {
    morningRoutine,
    workouts,
    readinessData,
    redFlags,
    progressData,
    weekPlans,
    loading,
    saveMorningRoutine,
    saveWorkout,
    saveReadiness,
    saveRedFlag,
    saveProgress,
    saveWeekPlan,
  };
}
