import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  targetAmount: numeric("target_amount", { precision: 18, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  deadline: timestamp("deadline").notNull(),
  status: text("status").notNull().default("active"),
  actionOnCompletion: text("action_on_completion").notNull().default("continue"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true, createdAt: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goalsTable.$inferSelect;
