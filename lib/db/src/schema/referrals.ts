import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const referralHistoryTable = pgTable("referral_history", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  referredUserId: integer("referred_user_id").notNull(),
  referredUsername: text("referred_username").notNull(),
  reward: numeric("reward", { precision: 10, scale: 2 }).notNull().default("15"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertReferralHistorySchema = createInsertSchema(referralHistoryTable).omit({ id: true });
export type InsertReferralHistory = z.infer<typeof insertReferralHistorySchema>;
export type ReferralHistory = typeof referralHistoryTable.$inferSelect;
