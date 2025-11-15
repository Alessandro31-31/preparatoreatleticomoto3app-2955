import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { redFlags } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const flagRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const resolved = c.req.query("resolved");

    let query = db
      .select()
      .from(redFlags)
      .where(eq(redFlags.userId, user.id))
      .$dynamic();

    if (resolved !== undefined) {
      query = query.where(eq(redFlags.resolved, parseInt(resolved)));
    }

    const flags = await query.orderBy(desc(redFlags.date));
    return c.json({ flags });
  })
  .get("/active", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const flags = await db
      .select()
      .from(redFlags)
      .where(and(eq(redFlags.userId, user.id), eq(redFlags.resolved, 0)))
      .orderBy(desc(redFlags.date));

    return c.json({ flags });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        date: z.string(),
        category: z.string(),
        severity: z.string(),
        description: z.string(),
        action: z.string(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [flag] = await db
        .insert(redFlags)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ flag });
    }
  )
  .put(
    "/:id/resolve",
    zValidator(
      "json",
      z.object({
        resolvedNotes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const flagId = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [updated] = await db
        .update(redFlags)
        .set({
          resolved: 1,
          resolvedDate: new Date().toISOString().split("T")[0],
          resolvedNotes: data.resolvedNotes,
        })
        .where(
          and(eq(redFlags.id, flagId), eq(redFlags.userId, user.id))
        )
        .returning();

      return c.json({ flag: updated });
    }
  );
