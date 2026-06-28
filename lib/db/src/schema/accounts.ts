import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accountsTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  tradingBalance: numeric("trading_balance", { precision: 18, scale: 2 }).notNull().default("0"),
  profitReserve: numeric("profit_reserve", { precision: 18, scale: 2 }).notNull().default("0"),
  emergencyReserve: numeric("emergency_reserve", { precision: 18, scale: 2 }).notNull().default("0"),
  withdrawableBalance: numeric("withdrawable_balance", { precision: 18, scale: 2 }).notNull().default("0"),
  historicalProfit: numeric("historical_profit", { precision: 18, scale: 2 }).notNull().default("0"),
  totalWithdrawn: numeric("total_withdrawn", { precision: 18, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accountsTable).omit({ id: true, updatedAt: true });
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accountsTable.$inferSelect;
