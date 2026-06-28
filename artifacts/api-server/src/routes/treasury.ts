import { Router } from "express";
import { db } from "@workspace/db";
import { treasurySettingsTable, accountsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

async function getTreasuryData(userId: number) {
  const [settings] = await db.select().from(treasurySettingsTable).where(eq(treasurySettingsTable.userId, userId)).limit(1);
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, userId)).limit(1);
  const ts = settings ?? { reinvestPercent: 50, reservePercent: 30, withdrawablePercent: 20, compoundingRate: 40, compoundingMode: "balanced" };
  return {
    tradingBalance: acct ? parseFloat(acct.tradingBalance) : 0,
    profitReserve: acct ? parseFloat(acct.profitReserve) : 0,
    emergencyReserve: acct ? parseFloat(acct.emergencyReserve) : 0,
    withdrawableBalance: acct ? parseFloat(acct.withdrawableBalance) : 0,
    historicalProfit: acct ? parseFloat(acct.historicalProfit) : 0,
    reinvestPercent: ts.reinvestPercent,
    reservePercent: ts.reservePercent,
    withdrawablePercent: ts.withdrawablePercent,
    compoundingRate: ts.compoundingRate,
    compoundingMode: ts.compoundingMode,
  };
}

router.get("/treasury", requireAuth, async (req, res) => {
  res.json(await getTreasuryData(req.userId!));
});

router.patch("/treasury/settings", requireAuth, async (req, res) => {
  const { reinvestPercent, reservePercent, withdrawablePercent, compoundingRate, compoundingMode } = req.body;
  if (reinvestPercent !== undefined && reservePercent !== undefined && withdrawablePercent !== undefined) {
    if (reinvestPercent + reservePercent + withdrawablePercent !== 100) {
      res.status(400).json({ error: "Profit distribution percentages must sum to 100" });
      return;
    }
  }
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (reinvestPercent !== undefined) update.reinvestPercent = reinvestPercent;
  if (reservePercent !== undefined) update.reservePercent = reservePercent;
  if (withdrawablePercent !== undefined) update.withdrawablePercent = withdrawablePercent;
  if (compoundingRate !== undefined) update.compoundingRate = compoundingRate;
  if (compoundingMode !== undefined) update.compoundingMode = compoundingMode;

  let [settings] = await db.select().from(treasurySettingsTable).where(eq(treasurySettingsTable.userId, req.userId!)).limit(1);
  if (!settings) {
    [settings] = await db.insert(treasurySettingsTable).values({ userId: req.userId! }).returning();
  }
  await db.update(treasurySettingsTable).set(update).where(eq(treasurySettingsTable.userId, req.userId!));
  res.json(await getTreasuryData(req.userId!));
});

export default router;
