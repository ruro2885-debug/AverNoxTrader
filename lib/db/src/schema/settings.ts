import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userSettingsTable = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  tradingStyle: text("trading_style").notNull().default("balanced"),
  executionMode: text("execution_mode").notNull().default("automated"),
  maxActivePositions: integer("max_active_positions").notNull().default(3),
  smartEntry: boolean("smart_entry").notNull().default(true),
  riskLevel: integer("risk_level").notNull().default(5),
  stopLossProtection: boolean("stop_loss_protection").notNull().default(true),
  profitLock: boolean("profit_lock").notNull().default(true),
  capitalExposureLimit: integer("capital_exposure_limit").notNull().default(25),
  confluenceStrength: integer("confluence_strength").notNull().default(3),
  marketScanner: boolean("market_scanner").notNull().default(true),
  aiAdaptation: text("ai_adaptation").notNull().default("dynamic"),
  signalQuality: text("signal_quality").notNull().default("high"),
  allocationMethod: text("allocation_method").notNull().default("dynamic"),
  reserveCapital: integer("reserve_capital").notNull().default(10),
  autoRebalancing: boolean("auto_rebalancing").notNull().default(true),
  tradeNotifications: boolean("trade_notifications").notNull().default(true),
  performanceReports: text("performance_reports").notNull().default("weekly"),
  dashboardMode: text("dashboard_mode").notNull().default("advanced"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettingsTable).omit({ id: true, updatedAt: true });
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettingsTable.$inferSelect;
