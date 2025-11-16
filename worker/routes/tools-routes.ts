import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { timerPresets, bodyMetrics, quickReferences } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const toolsRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  // ===== TIMER PRESETS =====
  .get("/timers", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const timers = await db
      .select()
      .from(timerPresets)
      .where(eq(timerPresets.userId, user.id))
      .orderBy(desc(timerPresets.isDefault));

    return c.json({ timers });
  })
  .get("/timers/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    const [timer] = await db
      .select()
      .from(timerPresets)
      .where(
        and(
          eq(timerPresets.id, id),
          eq(timerPresets.userId, user.id)
        )
      )
      .limit(1);

    if (!timer) {
      return c.json({ error: "Timer not found" }, 404);
    }

    return c.json({ timer });
  })
  .post(
    "/timers",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        intervals: z.string(), // JSON string
        totalDuration: z.number(),
        description: z.string().optional(),
        isDefault: z.number().default(0),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [timer] = await db
        .insert(timerPresets)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ timer });
    }
  )
  .put(
    "/timers/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        intervals: z.string().optional(),
        totalDuration: z.number().optional(),
        description: z.string().optional(),
        isDefault: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const id = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [timer] = await db
        .update(timerPresets)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(timerPresets.id, id),
            eq(timerPresets.userId, user.id)
          )
        )
        .returning();

      if (!timer) {
        return c.json({ error: "Timer not found" }, 404);
      }

      return c.json({ timer });
    }
  )
  .delete("/timers/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    await db
      .delete(timerPresets)
      .where(
        and(
          eq(timerPresets.id, id),
          eq(timerPresets.userId, user.id)
        )
      );

    return c.json({ success: true });
  })
  // ===== BODY METRICS =====
  .get("/body-metrics", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(bodyMetrics)
      .where(eq(bodyMetrics.userId, user.id))
      .$dynamic();

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(bodyMetrics.date, startDate),
          lte(bodyMetrics.date, endDate)
        )
      );
    }

    const metrics = await query.orderBy(desc(bodyMetrics.date));

    return c.json({ metrics });
  })
  .get("/body-metrics/:date", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const date = c.req.param("date");

    const [metric] = await db
      .select()
      .from(bodyMetrics)
      .where(
        and(
          eq(bodyMetrics.userId, user.id),
          eq(bodyMetrics.date, date)
        )
      )
      .limit(1);

    return c.json({ metric: metric || null });
  })
  .post(
    "/body-metrics",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        weight: z.number().optional(),
        bodyFat: z.number().optional(),
        muscleMass: z.number().optional(),
        hydration: z.number().optional(),
        neckCircumference: z.number().optional(),
        shoulderWidth: z.number().optional(),
        chestCircumference: z.number().optional(),
        waistCircumference: z.number().optional(),
        hipCircumference: z.number().optional(),
        thighCircumference: z.number().optional(),
        calfCircumference: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [metric] = await db
        .insert(bodyMetrics)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ metric });
    }
  )
  .put(
    "/body-metrics/:date",
    zValidator(
      "json",
      z.object({
        weight: z.number().optional(),
        bodyFat: z.number().optional(),
        muscleMass: z.number().optional(),
        hydration: z.number().optional(),
        neckCircumference: z.number().optional(),
        shoulderWidth: z.number().optional(),
        chestCircumference: z.number().optional(),
        waistCircumference: z.number().optional(),
        hipCircumference: z.number().optional(),
        thighCircumference: z.number().optional(),
        calfCircumference: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const date = c.req.param("date");
      const data = c.req.valid("json");

      const [metric] = await db
        .update(bodyMetrics)
        .set(data)
        .where(
          and(
            eq(bodyMetrics.userId, user.id),
            eq(bodyMetrics.date, date)
          )
        )
        .returning();

      if (!metric) {
        return c.json({ error: "Metric not found" }, 404);
      }

      return c.json({ metric });
    }
  )
  // ===== QUICK REFERENCES =====
  .get("/references", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const category = c.req.query("category");

    let query = db
      .select()
      .from(quickReferences)
      .where(eq(quickReferences.userId, user.id))
      .$dynamic();

    if (category) {
      query = query.where(eq(quickReferences.category, category));
    }

    const references = await query
      .orderBy(desc(quickReferences.isPinned), desc(quickReferences.createdAt));

    return c.json({ references });
  })
  .get("/references/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    const [reference] = await db
      .select()
      .from(quickReferences)
      .where(
        and(
          eq(quickReferences.id, id),
          eq(quickReferences.userId, user.id)
        )
      )
      .limit(1);

    if (!reference) {
      return c.json({ error: "Reference not found" }, 404);
    }

    return c.json({ reference });
  })
  .post(
    "/references",
    zValidator(
      "json",
      z.object({
        category: z.enum(["technique", "nutrition", "recovery", "warmup", "injury"]),
        title: z.string(),
        content: z.string(),
        tags: z.string().optional(), // JSON string
        isPinned: z.number().default(0),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [reference] = await db
        .insert(quickReferences)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ reference });
    }
  )
  .put(
    "/references/:id",
    zValidator(
      "json",
      z.object({
        category: z.enum(["technique", "nutrition", "recovery", "warmup", "injury"]).optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        tags: z.string().optional(),
        isPinned: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const id = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [reference] = await db
        .update(quickReferences)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(quickReferences.id, id),
            eq(quickReferences.userId, user.id)
          )
        )
        .returning();

      if (!reference) {
        return c.json({ error: "Reference not found" }, 404);
      }

      return c.json({ reference });
    }
  )
  .delete("/references/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    await db
      .delete(quickReferences)
      .where(
        and(
          eq(quickReferences.id, id),
          eq(quickReferences.userId, user.id)
        )
      );

    return c.json({ success: true });
  });
