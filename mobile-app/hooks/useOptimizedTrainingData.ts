
/**
 * Optimized training data hook with caching and performance improvements
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '@/utils/storage';
import { dataSync } from '@/utils/dataSync';
import { measurePerformance, debounce } from '@/utils/performance';
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

export function useOptimizedTrainingData() {
  const [morningRoutine, setMorningRoutine] = useState<MorningRoutineItem[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [readinessData, setReadinessData] = useState<DailyReadiness[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data with performance monitoring
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await measurePerformance('loadAllData', async () => {
        // Use parallel loading with caching
        const [routine, workoutsData, readiness, flags, progress, plans] = await Promise.all([
          storage.getItem<MorningRoutineItem[]>(STORAGE_KEYS.MORNING_ROUTINE, true),
          storage.getItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS, true),
          storage.getItem<DailyReadiness[]>(STORAGE_KEYS.READINESS, true),
          storage.getItem<RedFlag[]>(STORAGE_KEYS.RED_FLAGS, true),
          storage.getItem<ProgressData[]>(STORAGE_KEYS.PROGRESS, true),
          storage.getItem<WeekPlan[]>(STORAGE_KEYS.WEEK_PLANS, true),
        ]);

        if (routine.success && routine.data) setMorningRoutine(routine.data);
        if (workoutsData.success && workoutsData.data) setWorkouts(workoutsData.data);
        if (readiness.success && readiness.data) setReadinessData(readiness.data);
        if (flags.success && flags.data) setRedFlags(flags.data);
        if (progress.success && progress.data) setProgressData(progress.data);
        if (plans.success && plans.data) setWeekPlans(plans.data);
      });
    } catch (err) {
      console.error('Error loading training data:', err);
      setError('Failed to load training data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Debounced save functions for better performance
  const saveMorningRoutine = useCallback(async (routine: MorningRoutineItem[]) => {
    try {
      await storage.setItem(STORAGE_KEYS.MORNING_ROUTINE, routine);
      setMorningRoutine(routine);
      await dataSync.addToQueue('update', 'morning_routine', routine);
    } catch (err) {
      console.error('Error saving morning routine:', err);
      setError('Failed to save morning routine');
    }
  }, []);

  const saveWorkout = useCallback(async (workout: WorkoutSession) => {
    try {
      const updated = [...workouts, workout];
      await storage.setItem(STORAGE_KEYS.WORKOUTS, updated);
      setWorkouts(updated);
      await dataSync.addToQueue('create', 'workouts', workout);
    } catch (err) {
      console.error('Error saving workout:', err);
      setError('Failed to save workout');
    }
  }, [workouts]);

  const saveReadiness = useCallback(async (readiness: DailyReadiness) => {
    try {
      const updated = [...readinessData, readiness];
      await storage.setItem(STORAGE_KEYS.READINESS, updated);
      setReadinessData(updated);
      await dataSync.addToQueue('create', 'readiness', readiness);
    } catch (err) {
      console.error('Error saving readiness:', err);
      setError('Failed to save readiness');
    }
  }, [readinessData]);

  const saveRedFlag = useCallback(async (flag: RedFlag) => {
    try {
      const updated = [...redFlags, flag];
      await storage.setItem(STORAGE_KEYS.RED_FLAGS, updated);
      setRedFlags(updated);
      await dataSync.addToQueue('create', 'red_flags', flag);
    } catch (err) {
      console.error('Error saving red flag:', err);
      setError('Failed to save red flag');
    }
  }, [redFlags]);

  const saveProgress = useCallback(async (progress: ProgressData) => {
    try {
      const updated = [...progressData, progress];
      await storage.setItem(STORAGE_KEYS.PROGRESS, updated);
      setProgressData(updated);
      await dataSync.addToQueue('create', 'progress', progress);
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress');
    }
  }, [progressData]);

  const saveWeekPlan = useCallback(async (plan: WeekPlan) => {
    try {
      const existingIndex = weekPlans.findIndex(p => p.weekNumber === plan.weekNumber);
      let updated;
      if (existingIndex >= 0) {
        updated = [...weekPlans];
        updated[existingIndex] = plan;
      } else {
        updated = [...weekPlans, plan];
      }
      await storage.setItem(STORAGE_KEYS.WEEK_PLANS, updated);
      setWeekPlans(updated);
      await dataSync.addToQueue('update', 'week_plans', plan);
    } catch (err) {
      console.error('Error saving week plan:', err);
      setError('Failed to save week plan');
    }
  }, [weekPlans]);

  // Memoized computed values
  const stats = useMemo(() => ({
    totalWorkouts: workouts.length,
    totalReadinessChecks: readinessData.length,
    activeRedFlags: redFlags.filter(f => !f.resolved).length,
    weeksCovered: weekPlans.length,
  }), [workouts.length, readinessData.length, redFlags, weekPlans.length]);

  // Sync status
  const syncStatus = useMemo(() => dataSync.getStatus(), []);

  return {
    // Data
    morningRoutine,
    workouts,
    readinessData,
    redFlags,
    progressData,
    weekPlans,
    
    // State
    loading,
    error,
    stats,
    syncStatus,
    
    // Actions
    saveMorningRoutine,
    saveWorkout,
    saveReadiness,
    saveRedFlag,
    saveProgress,
    saveWeekPlan,
    reload: loadAllData,
  };
}
