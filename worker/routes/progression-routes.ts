import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { progressions } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const progressionRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const week = c.req.query("week");
    const exerciseName = c.req.query("exerciseName");

    let query = db
      .select()
      .from(progressions)
      .where(eq(progressions.userId, user.id))
      .$dynamic();

    if (week) {
      query = query.where(eq(progressions.week, parseInt(week)));
    }

    if (exerciseName) {
      query = query.where(eq(progressions.exerciseName, exerciseName));
    }

    const data = await query;
    return c.json({ progressions: data });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        exerciseName: z.string(),
        week: z.number(),
        targetWeight: z.number().optional(),
        targetReps: z.number().optional(),
        targetDuration: z.number().optional(),
        actualWeight: z.number().optional(),
        actualReps: z.number().optional(),
        actualDuration: z.number().optional(),
        milestone: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      let percentAchieved = 0;
      if (data.targetWeight && data.actualWeight) {
        percentAchieved = (data.actualWeight / data.targetWeight) * 100;
      } else if (data.targetReps && data.actualReps) {
        percentAchieved = (data.actualReps / data.targetReps) * 100;
      } else if (data.targetDuration && data.actualDuration) {
        percentAchieved = (data.actualDuration / data.targetDuration) * 100;
      }

      const [progression] = await db
        .insert(progressions)
        .values({
          ...data,
          userId: user.id,
          percentAchieved,
        })
        .returning();

      return c.json({ progression });
    }
  )
  .put(
    "/:id",
    zValidator(
      "json",
      z.object({
        actualWeight: z.number().optional(),
        actualReps: z.number().optional(),
        actualDuration: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const progressionId = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [existing] = await db
        .select()
        .from(progressions)
        .where(
          and(
            eq(progressions.id, progressionId),
            eq(progressions.userId, user.id)
          )
        )
        .limit(1);

      if (!existing) {
        return c.json({ error: "Progression not found" }, 404);
      }

      let percentAchieved = existing.percentAchieved;
      if (existing.targetWeight && data.actualWeight) {
        percentAchieved = (data.actualWeight / existing.targetWeight) * 100;
      } else if (existing.targetReps && data.actualReps) {
        percentAchieved = (data.actualReps / existing.targetReps) * 100;
      } else if (existing.targetDuration && data.actualDuration) {
        percentAchieved = (data.actualDuration / existing.targetDuration) * 100;
      }

      const [updated] = await db
        .update(progressions)
        .set({
          ...data,
          percentAchieved,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(progressions.id, progressionId))
        .returning();

      return c.json({ progression: updated });
    }
  );
