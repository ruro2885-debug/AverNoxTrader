import { Router } from "express";
import { db } from "@workspace/db";
import { investmentsTable, tradesTable, accountsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { generateTrades, computeDailySnapshots } from "../lib/trading";

const router = Router();

function formatInvestment(inv: typeof investmentsTable.$inferSelect) {
  return {
    id: inv.id, userId: inv.userId,
    principal: parseFloat(inv.principal),
    currentValue: parseFloat(inv.currentValue),
    startDate: inv.startDate.toISOString(),
    endDate: inv.endDate.toISOString(),
    status: inv.status,
    dayNumber: inv.dayNumber,
    profitPercent: parseFloat(inv.profitPercent),
    dailySnapshots: Array.isArray(inv.dailySnapshots) ? inv.dailySnapshots : [],
  };
}

// Progress active investment's day/value
async function progressInvestment(inv: typeof investmentsTable.$inferSelect) {
  const now = new Date();
  const start = inv.startDate;
  const daysElapsed = Math.min(7, Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);

  if (daysElapsed > inv.dayNumber || daysElapsed === 7) {
    const principal = parseFloat(inv.principal);
    const snapshots = computeDailySnapshots(principal, daysElapsed);
    const currentVal = snapshots.length ? snapshots[snapshots.length - 1].value : principal;
    const status = now >= inv.endDate ? "completed" : "active";
    const profitPercent = ((currentVal - principal) / principal * 100);

    const [updated] = await db.update(investmentsTable).set({
      dayNumber: daysElapsed,
      currentValue: String(currentVal.toFixed(2)),
      profitPercent: String(profitPercent.toFixed(4)),
      dailySnapshots: snapshots,
      status,
    }).where(eq(investmentsTable.id, inv.id)).returning();

    // Update account balance with new current value
    if (status === "active") {
      const profit = currentVal - principal;
      const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, inv.userId)).limit(1);
      if (acct) {
        const newTrading = parseFloat(acct.tradingBalance) + profit * 0.5;
        const newReserve = parseFloat(acct.profitReserve) + profit * 0.3;
        const newWithdrawable = parseFloat(acct.withdrawableBalance) + profit * 0.2;
        const newHistorical = parseFloat(acct.historicalProfit) + profit;
        await db.update(accountsTable).set({
          tradingBalance: String(Math.max(0, newTrading).toFixed(2)),
          profitReserve: String(Math.max(0, newReserve).toFixed(2)),
          withdrawableBalance: String(Math.max(0, newWithdrawable).toFixed(2)),
          historicalProfit: String(Math.max(0, newHistorical).toFixed(2)),
          updatedAt: new Date(),
        }).where(eq(accountsTable.userId, inv.userId));
      }
    }
    return updated;
  }
  return inv;
}

router.get("/investment/active", requireAuth, async (req, res) => {
  const [inv] = await db.select().from(investmentsTable)
    .where(and(eq(investmentsTable.userId, req.userId!), eq(investmentsTable.status, "active")))
    .orderBy(desc(investmentsTable.startDate))
    .limit(1);
  if (!inv) { res.status(404).json({ error: "No active investment" }); return; }
  const updated = await progressInvestment(inv);
  res.json(formatInvestment(updated));
});

router.get("/investment/history", requireAuth, async (req, res) => {
  const investments = await db.select().from(investmentsTable)
    .where(eq(investmentsTable.userId, req.userId!))
    .orderBy(desc(investmentsTable.startDate));
  res.json(investments.map(formatInvestment));
});

router.get("/investment/summary", requireAuth, async (req, res) => {
  const investments = await db.select().from(investmentsTable).where(eq(investmentsTable.userId, req.userId!));
  const allTrades = [];
  for (const inv of investments) {
    const trades = await db.select().from(tradesTable).where(eq(tradesTable.investmentId, inv.id));
    allTrades.push(...trades);
  }
  const wins = allTrades.filter(t => t.result === "win").length;
  const losses = allTrades.filter(t => t.result === "loss").length;
  const totalTrades = allTrades.length;
  const totalProfit = allTrades.reduce((s, t) => s + parseFloat(t.profitLoss), 0);
  const avgTrade = totalTrades > 0 ? totalProfit / totalTrades : 0;

  const growthCurve = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const val = 1000 + Math.sin(i * 0.4) * 200 + totalProfit * (1 - i / 30);
    growthCurve.push({ date: d.toISOString().split("T")[0], value: parseFloat(val.toFixed(2)) });
  }

  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  const totalWithdrawn = acct ? parseFloat(acct.totalWithdrawn) : 0;

  res.json({
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    monthlyReturn: parseFloat((totalProfit * 0.3).toFixed(2)),
    avgTrade: parseFloat(avgTrade.toFixed(2)),
    winRate: totalTrades > 0 ? parseFloat(((wins / totalTrades) * 100).toFixed(1)) : 0,
    lossRate: totalTrades > 0 ? parseFloat(((losses / totalTrades) * 100).toFixed(1)) : 0,
    totalWithdrawn,
    bestStrategy: "AI Pattern Recognition",
    growthCurve,
  });
});

router.get("/trades", requireAuth, async (req, res) => {
  const [inv] = await db.select().from(investmentsTable)
    .where(and(eq(investmentsTable.userId, req.userId!), eq(investmentsTable.status, "active")))
    .orderBy(desc(investmentsTable.startDate))
    .limit(1);
  if (!inv) { res.json([]); return; }
  const trades = await db.select().from(tradesTable).where(eq(tradesTable.investmentId, inv.id))
    .orderBy(desc(tradesTable.executedAt));
  res.json(trades.map(t => ({
    id: t.id, investmentId: t.investmentId, asset: t.asset, type: t.type,
    amount: parseFloat(t.amount), result: t.result, profitLoss: parseFloat(t.profitLoss),
    executedAt: t.executedAt.toISOString(), status: t.status, strategy: t.strategy,
  })));
});

router.post("/trades/refresh", requireAuth, async (req, res) => {
  const [inv] = await db.select().from(investmentsTable)
    .where(and(eq(investmentsTable.userId, req.userId!), eq(investmentsTable.status, "active")))
    .orderBy(desc(investmentsTable.startDate))
    .limit(1);
  if (!inv) { res.json([]); return; }

  const newTrades = generateTrades(inv.id, 5, parseFloat(inv.principal));
  for (const trade of newTrades) {
    await db.insert(tradesTable).values(trade);
  }
  const trades = await db.select().from(tradesTable).where(eq(tradesTable.investmentId, inv.id))
    .orderBy(desc(tradesTable.executedAt));
  res.json(trades.map(t => ({
    id: t.id, investmentId: t.investmentId, asset: t.asset, type: t.type,
    amount: parseFloat(t.amount), result: t.result, profitLoss: parseFloat(t.profitLoss),
    executedAt: t.executedAt.toISOString(), status: t.status, strategy: t.strategy,
  })));
});

export default router;
