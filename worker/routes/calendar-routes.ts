import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { weeklyCalendar, dailySchedule } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const calendarRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  // Get all weeks
  .get("/weeks", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const weeks = await db
      .select()
      .from(weeklyCalendar)
      .where(eq(weeklyCalendar.userId, user.id))
      .orderBy(weeklyCalendar.weekNumber);

    return c.json({ weeks });
  })
  // Get specific week
  .get("/weeks/:weekNumber", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const weekNumber = parseInt(c.req.param("weekNumber"));

    const [week] = await db
      .select()
      .from(weeklyCalendar)
      .where(
        and(
          eq(weeklyCalendar.userId, user.id),
          eq(weeklyCalendar.weekNumber, weekNumber)
        )
      )
      .limit(1);

    if (!week) {
      return c.json({ error: "Week not found" }, 404);
    }

    return c.json({ week });
  })
  // Create/Update week
  .post(
    "/weeks",
    zValidator(
      "json",
      z.object({
        weekNumber: z.number().min(1).max(18),
        weekStartDate: z.string(),
        weekEndDate: z.string(),
        phase: z.enum(["base", "build", "peak", "taper", "race", "recovery"]).optional(),
        focusArea: z.enum(["strength", "endurance", "power", "technique", "recovery"]).optional(),
        targetWeeklyLoad: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      // Check if week exists
      const [existing] = await db
        .select()
        .from(weeklyCalendar)
        .where(
          and(
            eq(weeklyCalendar.userId, user.id),
            eq(weeklyCalendar.weekNumber, data.weekNumber)
          )
        )
        .limit(1);

      if (existing) {
        // Update existing week
        const [week] = await db
          .update(weeklyCalendar)
          .set({
            ...data,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(weeklyCalendar.userId, user.id),
              eq(weeklyCalendar.weekNumber, data.weekNumber)
            )
          )
          .returning();

        return c.json({ week });
      } else {
        // Create new week
        const [week] = await db
          .insert(weeklyCalendar)
          .values({
            ...data,
            userId: user.id,
          })
          .returning();

        return c.json({ week });
      }
    }
  )
  // Update week load
  .put(
    "/weeks/:weekNumber/load",
    zValidator(
      "json",
      z.object({
        actualWeeklyLoad: z.number(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const weekNumber = parseInt(c.req.param("weekNumber"));
      const data = c.req.valid("json");

      const [week] = await db
        .update(weeklyCalendar)
        .set({
          actualWeeklyLoad: data.actualWeeklyLoad,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(weeklyCalendar.userId, user.id),
            eq(weeklyCalendar.weekNumber, weekNumber)
          )
        )
        .returning();

      if (!week) {
        return c.json({ error: "Week not found" }, 404);
      }

      return c.json({ week });
    }
  )
  // Get daily schedule
  .get("/days", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    const weekNumber = c.req.query("weekNumber");

    let query = db
      .select()
      .from(dailySchedule)
      .where(eq(dailySchedule.userId, user.id))
      .$dynamic();

    if (weekNumber) {
      query = query.where(eq(dailySchedule.weekId, parseInt(weekNumber)));
    }

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(dailySchedule.date, startDate),
          lte(dailySchedule.date, endDate)
        )
      );
    }

    const days = await query.orderBy(dailySchedule.date);

    return c.json({ days });
  })
  // Get specific day
  .get("/days/:date", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const date = c.req.param("date");

    const [day] = await db
      .select()
      .from(dailySchedule)
      .where(
        and(
          eq(dailySchedule.userId, user.id),
          eq(dailySchedule.date, date)
        )
      )
      .limit(1);

    return c.json({ day: day || null });
  })
  // Create/Update daily schedule
  .post(
    "/days",
    zValidator(
      "json",
      z.object({
        weekId: z.number(),
        date: z.string(),
        dayOfWeek: z.number().min(1).max(7),
        sessionType: z.enum(["training", "recovery", "rest", "testing"]),
        plannedSessions: z.string(), // JSON string
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      // Check if day exists
      const [existing] = await db
        .select()
        .from(dailySchedule)
        .where(
          and(
            eq(dailySchedule.userId, user.id),
            eq(dailySchedule.date, data.date)
          )
        )
        .limit(1);

      if (existing) {
        // Update existing day
        const [day] = await db
          .update(dailySchedule)
          .set({
            ...data,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(dailySchedule.userId, user.id),
              eq(dailySchedule.date, data.date)
            )
          )
          .returning();

        return c.json({ day });
      } else {
        // Create new day
        const [day] = await db
          .insert(dailySchedule)
          .values({
            ...data,
            userId: user.id,
          })
          .returning();

        return c.json({ day });
      }
    }
  )
  // Mark day as completed
  .put("/days/:date/complete", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const date = c.req.param("date");

    const [day] = await db
      .update(dailySchedule)
      .set({
        completed: 1,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(dailySchedule.userId, user.id),
          eq(dailySchedule.date, date)
        )
      )
      .returning();

    if (!day) {
      return c.json({ error: "Day not found" }, 404);
    }

    return c.json({ day });
  })
  // Initialize 18-week calendar
  .post(
    "/initialize",
    zValidator(
      "json",
      z.object({
        startDate: z.string(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const { startDate } = c.req.valid("json");

      const start = new Date(startDate);
      const weeks = [];

      for (let i = 0; i < 18; i++) {
        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() + i * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Determine phase based on week number
        let phase: "base" | "build" | "peak" | "taper" | "race" | "recovery";
        if (i < 4) phase = "base";
        else if (i < 12) phase = "build";
        else if (i < 15) phase = "peak";
        else if (i < 17) phase = "taper";
        else phase = "race";

        weeks.push({
          userId: user.id,
          weekNumber: i + 1,
          weekStartDate: weekStart.toISOString().split("T")[0],
          weekEndDate: weekEnd.toISOString().split("T")[0],
          phase,
          focusArea: "strength" as const,
          targetWeeklyLoad: 0,
        });
      }

      const created = await db.insert(weeklyCalendar).values(weeks).returning();

      return c.json({ weeks: created });
    }
  );
