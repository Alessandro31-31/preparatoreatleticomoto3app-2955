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

export const apiRoutes = new Hono<HonoContext>()
  .route("/admin", adminRoutes)
  .route("/ai", aiRoutes)
  .route("/auth", authRoutes)
  .route("/profile", profileRoutes)
  .route("/training", trainingRoutes)
  .route("/routine", routineRoutes)
  .route("/biometrics", biometricRoutes)
  .route("/flags", flagRoutes)
  .route("/progressions", progressionRoutes);