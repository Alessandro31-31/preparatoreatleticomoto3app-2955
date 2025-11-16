import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { recoveryProtocols, recoveryProtocolLogs } from "../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const recoveryRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  // Get all recovery protocols
  .get("/protocols", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const type = c.req.query("type"); // warmup, cooldown, stretching, foam_rolling

    let query = db
      .select()
      .from(recoveryProtocols)
      .where(eq(recoveryProtocols.userId, user.id))
      .$dynamic();

    if (type) {
      query = query.where(eq(recoveryProtocols.type, type));
    }

    const protocols = await query
      .where(eq(recoveryProtocols.isActive, 1))
      .orderBy(desc(recoveryProtocols.order));

    return c.json({ protocols });
  })
  // Get single protocol
  .get("/protocols/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    const [protocol] = await db
      .select()
      .from(recoveryProtocols)
      .where(
        and(
          eq(recoveryProtocols.id, id),
          eq(recoveryProtocols.userId, user.id)
        )
      )
      .limit(1);

    if (!protocol) {
      return c.json({ error: "Protocol not found" }, 404);
    }

    return c.json({ protocol });
  })
  // Create new protocol
  .post(
    "/protocols",
    zValidator(
      "json",
      z.object({
        type: z.enum(["warmup", "cooldown", "stretching", "foam_rolling"]),
        name: z.string(),
        description: z.string().optional(),
        duration: z.number().optional(),
        exercises: z.string(), // JSON string
        instructions: z.string().optional(),
        videoUrl: z.string().optional(),
        order: z.number().default(0),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [protocol] = await db
        .insert(recoveryProtocols)
        .values({
          ...data,
          userId: user.id,
          isActive: 1,
        })
        .returning();

      return c.json({ protocol });
    }
  )
  // Update protocol
  .put(
    "/protocols/:id",
    zValidator(
      "json",
      z.object({
        type: z.enum(["warmup", "cooldown", "stretching", "foam_rolling"]).optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        duration: z.number().optional(),
        exercises: z.string().optional(),
        instructions: z.string().optional(),
        videoUrl: z.string().optional(),
        order: z.number().optional(),
        isActive: z.number().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const id = parseInt(c.req.param("id"));
      const data = c.req.valid("json");

      const [protocol] = await db
        .update(recoveryProtocols)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(recoveryProtocols.id, id),
            eq(recoveryProtocols.userId, user.id)
          )
        )
        .returning();

      if (!protocol) {
        return c.json({ error: "Protocol not found" }, 404);
      }

      return c.json({ protocol });
    }
  )
  // Delete protocol
  .delete("/protocols/:id", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    await db
      .delete(recoveryProtocols)
      .where(
        and(
          eq(recoveryProtocols.id, id),
          eq(recoveryProtocols.userId, user.id)
        )
      );

    return c.json({ success: true });
  })
  // Get protocol logs
  .get("/logs", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    let query = db
      .select()
      .from(recoveryProtocolLogs)
      .where(eq(recoveryProtocolLogs.userId, user.id))
      .$dynamic();

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(recoveryProtocolLogs.date, startDate),
          lte(recoveryProtocolLogs.date, endDate)
        )
      );
    }

    const logs = await query.orderBy(desc(recoveryProtocolLogs.date));

    return c.json({ logs });
  })
  // Log protocol execution
  .post(
    "/logs",
    zValidator(
      "json",
      z.object({
        protocolId: z.number(),
        date: z.string(),
        duration: z.number().optional(),
        completed: z.number().default(1),
        notes: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [log] = await db
        .insert(recoveryProtocolLogs)
        .values({
          ...data,
          userId: user.id,
        })
        .returning();

      return c.json({ log });
    }
  );
