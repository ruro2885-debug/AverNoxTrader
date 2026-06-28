import { pgTable, serial, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tradesTable = pgTable("trades", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").notNull(),
  asset: text("asset").notNull(),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  result: text("result").notNull(),
  profitLoss: numeric("profit_loss", { precision: 18, scale: 2 }).notNull(),
  executedAt: timestamp("executed_at").notNull().defaultNow(),
  status: text("status").notNull().default("closed"),
  strategy: text("strategy"),
});

export const insertTradeSchema = createInsertSchema(tradesTable).omit({ id: true });
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof tradesTable.$inferSelect;
