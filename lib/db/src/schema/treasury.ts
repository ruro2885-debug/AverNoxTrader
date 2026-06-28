import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const treasurySettingsTable = pgTable("treasury_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  reinvestPercent: integer("reinvest_percent").notNull().default(50),
  reservePercent: integer("reserve_percent").notNull().default(30),
  withdrawablePercent: integer("withdrawable_percent").notNull().default(20),
  compoundingRate: integer("compounding_rate").notNull().default(40),
  compoundingMode: text("compounding_mode").notNull().default("balanced"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTreasurySettingsSchema = createInsertSchema(treasurySettingsTable).omit({ id: true, updatedAt: true });
export type InsertTreasurySettings = z.infer<typeof insertTreasurySettingsSchema>;
export type TreasurySettings = typeof treasurySettingsTable.$inferSelect;
