import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authenticatedOnly } from "../middleware/auth";
import type { HonoContext } from "../types";
import { userProfiles, settings } from "../db/schema";
import { eq } from "drizzle-orm";

export const profileRoutes = new Hono<HonoContext>()
  .use("*", authenticatedOnly)
  .get("/", async (c) => {
    const db = c.get("db");
    const user = c.get("user");
    
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    return c.json({ profile: profile || null });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1),
        age: z.number().optional(),
        category: z.string().optional(),
        startDate: z.string(),
        weight: z.number().optional(),
        targetWeight: z.number().optional(),
        photoUrl: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [existing] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, user.id))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(userProfiles)
          .set({ ...data, updatedAt: new Date().toISOString() })
          .where(eq(userProfiles.userId, user.id))
          .returning();
        return c.json({ profile: updated });
      }

      const [profile] = await db
        .insert(userProfiles)
        .values({ ...data, userId: user.id })
        .returning();

      return c.json({ profile });
    }
  )
  .get("/settings", async (c) => {
    const db = c.get("db");
    const user = c.get("user");

    const [userSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, user.id))
      .limit(1);

    return c.json({ settings: userSettings || null });
  })
  .post(
    "/settings",
    zValidator(
      "json",
      z.object({
        notifications: z.number().optional(),
        unitSystem: z.string().optional(),
        language: z.string().optional(),
        trainingStartDate: z.string().optional(),
        trainingEndDate: z.string().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const data = c.req.valid("json");

      const [existing] = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, user.id))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(settings)
          .set({ ...data, updatedAt: new Date().toISOString() })
          .where(eq(settings.userId, user.id))
          .returning();
        return c.json({ settings: updated });
      }

      const [newSettings] = await db
        .insert(settings)
        .values({ ...data, userId: user.id })
        .returning();

      return c.json({ settings: newSettings });
    }
  );
