import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { morningRoutines } from "../db/schema";
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
  );
