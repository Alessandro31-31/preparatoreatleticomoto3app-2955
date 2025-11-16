import { Hono } from "hono";
import type { HonoContext } from "../types";
import { adminRoutes } from "./admin-routes";
import { aiRoutes } from "./ai-routes";
import { authRoutes } from "./auth-routes";
import { profileRoutes } from "./profile-routes";
import { trainingRoutes } from "./training-routes";
import { routineRoutes } from "./routine-routes";
import { biometricRoutes } from "./biometric-routes";
import { flagRoutes } from "./flag-routes";
import { progressionRoutes } from "./progression-routes";
import { recoveryRoutes } from "./recovery-routes";
import { calendarRoutes } from "./calendar-routes";
import { toolsRoutes } from "./tools-routes";

export const apiRoutes = new Hono<HonoContext>()
  .route("/admin", adminRoutes)
  .route("/ai", aiRoutes)
  .route("/auth", authRoutes)
  .route("/profile", profileRoutes)
  .route("/training", trainingRoutes)
  .route("/routine", routineRoutes)
  .route("/biometrics", biometricRoutes)
  .route("/flags", flagRoutes)
  .route("/progressions", progressionRoutes)
  .route("/recovery", recoveryRoutes)
  .route("/calendar", calendarRoutes)
  .route("/tools", toolsRoutes);