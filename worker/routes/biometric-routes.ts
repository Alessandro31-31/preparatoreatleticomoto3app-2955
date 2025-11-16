import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { biometrics, loadTracking, postureAssessments } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const biometricRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(biometrics)
      .where(eq(biometrics.userId, user.id))
      .$dynamic();

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(biometrics.date, startDate),
          lte(biometrics.date, endDate)
        )
      );
    }

    const data = await query.orderBy(desc(biometrics.date));
    return c.json({ biometrics: data });
  })
  .get("/today", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const today = new Date().toISOString().split("T")[0];

    const [data] = await db
      .select()
      .from(biometrics)
      .where(
        and(
          eq(biometrics.userId, user.id),
          eq(biometrics.date, today)
        )
      )
      .limit(1);

    return c.json({ biometric: data || null });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        weight: z.number().optional(),
        hrv: z.number().optional(),
        sleepQuality: z.number().optional(),
        sleepHours: z.number().optional(),
        muscleSoreness: z.number().optional(),
        stressLevel: z.number().optional(),
        energyLevel: z.number().optional(),
        motivation: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const readinessScore =
        (data.sleepQuality || 0) +
        (6 - (data.muscleSoreness || 0)) +
        (6 - (data.stressLevel || 0)) +
        (data.energyLevel || 0) +
        (data.motivation || 0);

      const [biometric] = await db
        .insert(biometrics)
        .values({
          ...data,
          userId: user.id,
          readinessScore,
        })
        .returning();

      return c.json({ biometric });
    }
  )
  .get("/load", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(loadTracking)
      .where(eq(loadTracking.userId, user.id))
      .$dynamic();

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(loadTracking.date, startDate),
          lte(loadTracking.date, endDate)
        )
      );
    }

    const loads = await query.orderBy(desc(loadTracking.date));
    return c.json({ loads });
  })
  .post(
    "/load",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        dailyLoad: z.number(),
        acuteLoad: z.number().optional(),
        chronicLoad: z.number().optional(),
        acrRatio: z.number().optional(),
        weeklyLoad: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [load] = await db
        .insert(loadTracking)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ load });
    }
  )
  .get("/posture", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const assessments = await db
      .select()
      .from(postureAssessments)
      .where(eq(postureAssessments.userId, user.id))
      .orderBy(desc(postureAssessments.date));

    return c.json({ assessments });
  })
  .post(
    "/posture",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        flexiTraceScore: z.number().optional(),
        wallTestDistance: z.number().optional(),
        pelvicTilt: z.number().optional(),
        photoUrl: z.string().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [assessment] = await db
        .insert(postureAssessments)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ assessment });
    }
  );
