CREATE TABLE `biometrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`weight` real,
	`hrv` real,
	`sleep_quality` integer,
	`sleep_hours` real,
	`muscle_soreness` integer,
	`stress_level` integer,
	`energy_level` integer,
	`motivation` integer,
	`readiness_score` real,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`sets` integer,
	`reps` text,
	`weight` real,
	`target_weight` real,
	`duration` integer,
	`rest` integer,
	`rpe_target` real,
	`rpe_actual` real,
	`completed` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`setup_instructions` text,
	`technique_notes` text,
	`breathing_pattern` text,
	`muscle_focus` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `load_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`daily_load` real NOT NULL,
	`acute_load` real,
	`chronic_load` real,
	`acr_ratio` real,
	`weekly_load` real,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `morning_routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`stiffness_pre` real NOT NULL,
	`stiffness_post` real NOT NULL,
	`delta` real NOT NULL,
	`duration` integer,
	`completed` integer DEFAULT 1 NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posture_assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`flexi_trace_score` real,
	`wall_test_distance` real,
	`pelvic_tilt` real,
	`photo_url` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `progressions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`exercise_name` text NOT NULL,
	`week` integer NOT NULL,
	`target_weight` real,
	`target_reps` integer,
	`target_duration` integer,
	`actual_weight` real,
	`actual_reps` integer,
	`actual_duration` integer,
	`percent_achieved` real,
	`milestone` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `red_flags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`category` text NOT NULL,
	`severity` text NOT NULL,
	`description` text NOT NULL,
	`action` text NOT NULL,
	`resolved` integer DEFAULT 0 NOT NULL,
	`resolved_date` text,
	`resolved_notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`notifications` integer DEFAULT 1 NOT NULL,
	`unit_system` text DEFAULT 'metric' NOT NULL,
	`language` text DEFAULT 'it' NOT NULL,
	`training_start_date` text,
	`training_end_date` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_user_id_unique` ON `settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`week_number` integer NOT NULL,
	`day_name` text NOT NULL,
	`session_type` text NOT NULL,
	`session_name` text,
	`duration` integer,
	`rpe_avg` real,
	`load` real,
	`completed` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`age` integer,
	`category` text,
	`start_date` text NOT NULL,
	`weight` real,
	`target_weight` real,
	`photo_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);