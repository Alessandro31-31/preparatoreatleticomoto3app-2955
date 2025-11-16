import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { trainingSessions, exercises } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const trainingRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/sessions", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const weekNumber = c.req.query("weekNumber");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, user.id))
      .$dynamic();

    if (weekNumber) {
      query = query.where(
        eq(trainingSessions.weekNumber, parseInt(weekNumber))
      );
    }

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(trainingSessions.date, startDate),
          lte(trainingSessions.date, endDate)
        )
      );
    }

    const sessions = await query.orderBy(desc(trainingSessions.date));
    return c.json({ sessions });
  })
  .get("/sessions/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const sessionId = parseInt(c.req.param("id"));

    const [session] = await db
      .select()
      .from(trainingSessions)
      .where(
        and(
          eq(trainingSessions.id, sessionId),
          eq(trainingSessions.userId, user.id)
        )
      )
      .limit(1);

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const sessionExercises = await db
      .select()
      .from(exercises)
      .where(eq(exercises.sessionId, sessionId));

    return c.json({ session, exercises: sessionExercises });
  })
  .post(
    "/sessions",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        weekNumber: z.number(),
        dayName: z.string(),
        sessionType: z.string(),
        sessionName: z.string().optional(),
        duration: z.number().optional(),
        rpeAvg: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const load = data.rpeAvg && data.duration ? data.rpeAvg * data.duration : 0;

      const [session] = await db
        .insert(trainingSessions)
        .values({
          ...data,
          userId: user.id,
          load,
        })
        .returning();

      return c.json({ session });
    }
  )
  .put(
    "/sessions/:id",
    zValidator(
      "json",
      z.object({
        duration: z.number().optional(),
        rpeAvg: z.number().optional(),
        completed: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const sessionId = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const load = data.rpeAvg && data.duration ? data.rpeAvg * data.duration : undefined;

      const [updated] = await db
        .update(trainingSessions)
        .set({
          ...data,
          load,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(trainingSessions.id, sessionId),
            eq(trainingSessions.userId, user.id)
          )
        )
        .returning();

      return c.json({ session: updated });
    }
  )
  .post(
    "/exercises",
    zValidator(
      "json",
      z.object({
        sessionId: z.number(),
        name: z.string(),
        category: z.string().optional(),
        sets: z.number().optional(),
        reps: z.string().optional(),
        weight: z.number().optional(),
        targetWeight: z.number().optional(),
        duration: z.number().optional(),
        rest: z.number().optional(),
        rpeTarget: z.number().optional(),
        rpeActual: z.number().optional(),
        completed: z.number().optional(),
        notes: z.string().optional(),
        setupInstructions: z.string().optional(),
        techniqueNotes: z.string().optional(),
        breathingPattern: z.string().optional(),
        muscleFocus: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const data = c.req.valid("json");

      const [exercise] = await db
        .insert(exercises)
        .values(data)
        .returning();

      return c.json({ exercise });
    }
  )
  .put(
    "/exercises/:id",
    zValidator(
      "json",
      z.object({
        weight: z.number().optional(),
        rpeActual: z.number().optional(),
        completed: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const exerciseId = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [updated] = await db
        .update(exercises)
        .set(data)
        .where(eq(exercises.id, exerciseId))
        .returning();

      return c.json({ exercise: updated });
    }
  );
