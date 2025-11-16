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

// Protocolli di preparazione e recupero
export const recoveryProtocols = sqliteTable("recovery_protocols", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'warmup', 'cooldown', 'stretching', 'foam_rolling'
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minuti
  exercises: text("exercises"), // JSON array di esercizi
  instructions: text("instructions"),
  videoUrl: text("video_url"),
  order: integer("order").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// Esecuzioni dei protocolli di recupero
export const recoveryProtocolLogs = sqliteTable("recovery_protocol_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  protocolId: integer("protocol_id").notNull(),
  date: text("date").notNull(),
  duration: integer("duration"), // durata effettiva
  completed: integer("completed").notNull().default(1),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// Template per routine mattutina
export const morningRoutineTemplates = sqliteTable("morning_routine_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  exercises: text("exercises"), // JSON array con esercizi dettagliati
  estimatedDuration: integer("estimated_duration"),
  order: integer("order").notNull().default(0),
  isDefault: integer("is_default").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// Calendario settimanale strutturato (18 settimane)
export const weeklyCalendar = sqliteTable("weekly_calendar", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  weekNumber: integer("week_number").notNull(), // 1-18
  weekStartDate: text("week_start_date").notNull(),
  weekEndDate: text("week_end_date").notNull(),
  phase: text("phase"), // 'base', 'build', 'peak', 'taper', 'race', 'recovery'
  focusArea: text("focus_area"), // 'strength', 'endurance', 'power', 'technique', 'recovery'
  targetWeeklyLoad: real("target_weekly_load"),
  actualWeeklyLoad: real("actual_weekly_load"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// Sessioni giornaliere programmate
export const dailySchedule = sqliteTable("daily_schedule", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  weekId: integer("week_id").notNull(),
  date: text("date").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 1-7
  sessionType: text("session_type").notNull(), // 'training', 'recovery', 'rest', 'testing'
  plannedSessions: text("planned_sessions"), // JSON array di sessioni programmate
  completed: integer("completed").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// Timer e intervalli multi-fase
export const timerPresets = sqliteTable("timer_presets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  intervals: text("intervals"), // JSON array con fasi: [{type: 'work', duration: 300}, {type: 'rest', duration: 60}]
  totalDuration: integer("total_duration"),
  description: text("description"),
  isDefault: integer("is_default").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// Dati corporei per grafici progressione
export const bodyMetrics = sqliteTable("body_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  weight: real("weight"),
  bodyFat: real("body_fat"),
  muscleMass: real("muscle_mass"),
  hydration: real("hydration"),
  neckCircumference: real("neck_circumference"),
  shoulderWidth: real("shoulder_width"),
  chestCircumference: real("chest_circumference"),
  waistCircumference: real("waist_circumference"),
  hipCircumference: real("hip_circumference"),
  thighCircumference: real("thigh_circumference"),
  calfCircumference: real("calf_circumference"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// Riferimenti rapidi e note tecniche
export const quickReferences = sqliteTable("quick_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  category: text("category").notNull(), // 'technique', 'nutrition', 'recovery', 'warmup', 'injury'
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"), // JSON array
  isPinned: integer("is_pinned").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});
