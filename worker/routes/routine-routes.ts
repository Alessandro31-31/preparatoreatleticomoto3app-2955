import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { morningRoutines, morningRoutineTemplates } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const routineRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(morningRoutines)
      .where(eq(morningRoutines.userId, user.id))
      .$dynamic();

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(morningRoutines.date, startDate),
          lte(morningRoutines.date, endDate)
        )
      );
    }

    const routines = await query.orderBy(desc(morningRoutines.date));
    return c.json({ routines });
  })
  .get("/today", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const today = new Date().toISOString().split("T")[0];

    const [routine] = await db
      .select()
      .from(morningRoutines)
      .where(
        and(
          eq(morningRoutines.userId, user.id),
          eq(morningRoutines.date, today)
        )
      )
      .limit(1);

    return c.json({ routine: routine || null });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        stiffnessPre: z.number(),
        stiffnessPost: z.number(),
        duration: z.number().optional(),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const delta = data.stiffnessPost - data.stiffnessPre;

      const [routine] = await db
        .insert(morningRoutines)
        .values({
          ...data,
          userId: user.id,
          delta,
          completed: 1,
        })
        .returning();

      return c.json({ routine });
    }
  )
  // Template routes
  .get("/templates", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const templates = await db
      .select()
      .from(morningRoutineTemplates)
      .where(eq(morningRoutineTemplates.userId, user.id))
      .orderBy(desc(morningRoutineTemplates.order));

    return c.json({ templates });
  })
  .get("/templates/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    const [template] = await db
      .select()
      .from(morningRoutineTemplates)
      .where(
        and(
          eq(morningRoutineTemplates.id, id),
          eq(morningRoutineTemplates.userId, user.id)
        )
      )
      .limit(1);

    if (!template) {
      return c.json({ error: "Template not found" }, 404);
    }

    return c.json({ template });
  })
  .post(
    "/templates",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        description: z.string().optional(),
        exercises: z.string(), // JSON string
        estimatedDuration: z.number().optional(),
        order: z.number().default(0),
        isDefault: z.number().default(0),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [template] = await db
        .insert(morningRoutineTemplates)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ template });
    }
  )
  .put(
    "/templates/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        exercises: z.string().optional(),
        estimatedDuration: z.number().optional(),
        order: z.number().optional(),
        isDefault: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const id = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [template] = await db
        .update(morningRoutineTemplates)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(morningRoutineTemplates.id, id),
            eq(morningRoutineTemplates.userId, user.id)
          )
        )
        .returning();

      if (!template) {
        return c.json({ error: "Template not found" }, 404);
      }

      return c.json({ template });
    }
  )
  .delete("/templates/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    await db
      .delete(morningRoutineTemplates)
      .where(
        and(
          eq(morningRoutineTemplates.id, id),
          eq(morningRoutineTemplates.userId, user.id)
        )
      );

    return c.json({ success: true });
  });
