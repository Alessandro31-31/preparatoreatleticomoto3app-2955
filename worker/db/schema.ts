import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export * from "./auth-schema";

export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age"),
  category: text("category"),
  startDate: text("start_date").notNull(),
  weight: real("weight"),
  targetWeight: real("target_weight"),
  photoUrl: text("photo_url"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const trainingSessions = sqliteTable("training_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  weekNumber: integer("week_number").notNull(),
  dayName: text("day_name").notNull(),
  sessionType: text("session_type").notNull(),
  sessionName: text("session_name"),
  duration: integer("duration"),
  rpeAvg: real("rpe_avg"),
  load: real("load"),
  completed: integer("completed").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id").notNull(),
  name: text("name").notNull(),
  category: text("category"),
  sets: integer("sets"),
  reps: text("reps"),
  weight: real("weight"),
  targetWeight: real("target_weight"),
  duration: integer("duration"),
  rest: integer("rest"),
  rpeTarget: real("rpe_target"),
  rpeActual: real("rpe_actual"),
  completed: integer("completed").notNull().default(0),
  notes: text("notes"),
  setupInstructions: text("setup_instructions"),
  techniqueNotes: text("technique_notes"),
  breathingPattern: text("breathing_pattern"),
  muscleFocus: text("muscle_focus"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const morningRoutines = sqliteTable("morning_routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  stiffnessPre: real("stiffness_pre").notNull(),
  stiffnessPost: real("stiffness_post").notNull(),
  delta: real("delta").notNull(),
  duration: integer("duration"),
  completed: integer("completed").notNull().default(1),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const biometrics = sqliteTable("biometrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  weight: real("weight"),
  hrv: real("hrv"),
  sleepQuality: integer("sleep_quality"),
  sleepHours: real("sleep_hours"),
  muscleSoreness: integer("muscle_soreness"),
  stressLevel: integer("stress_level"),
  energyLevel: integer("energy_level"),
  motivation: integer("motivation"),
  readinessScore: real("readiness_score"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const redFlags = sqliteTable("red_flags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  action: text("action").notNull(),
  resolved: integer("resolved").notNull().default(0),
  resolvedDate: text("resolved_date"),
  resolvedNotes: text("resolved_notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const progressions = sqliteTable("progressions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  exerciseName: text("exercise_name").notNull(),
  week: integer("week").notNull(),
  targetWeight: real("target_weight"),
  targetReps: integer("target_reps"),
  targetDuration: integer("target_duration"),
  actualWeight: real("actual_weight"),
  actualReps: integer("actual_reps"),
  actualDuration: integer("actual_duration"),
  percentAchieved: real("percent_achieved"),
  milestone: text("milestone"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const loadTracking = sqliteTable("load_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  dailyLoad: real("daily_load").notNull(),
  acuteLoad: real("acute_load"),
  chronicLoad: real("chronic_load"),
  acrRatio: real("acr_ratio"),
  weeklyLoad: real("weekly_load"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const postureAssessments = sqliteTable("posture_assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  flexiTraceScore: real("flexi_trace_score"),
  wallTestDistance: real("wall_test_distance"),
  pelvicTilt: real("pelvic_tilt"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique(),
  notifications: integer("notifications").notNull().default(1),
  unitSystem: text("unit_system").notNull().default("metric"),
  language: text("language").notNull().default("it"),
  trainingStartDate: text("training_start_date"),
  trainingEndDate: text("training_end_date"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});
