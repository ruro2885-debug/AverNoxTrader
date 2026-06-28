import { Router } from "express";
import { db } from "@workspace/db";
import { depositsTable, txnCodeUsagesTable, accountsTable, investmentsTable, treasurySettingsTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { VALID_TXN_CODES, generateTrades, computeDailySnapshots } from "../lib/trading";
import { tradesTable } from "@workspace/db";

const router = Router();

router.post("/deposit", requireAuth, async (req, res) => {
  const { amount, transactionCode, method } = req.body;
  if (!amount || !transactionCode) {
    res.status(400).json({ error: "Amount and transaction code are required" });
    return;
  }
  const code = String(transactionCode).trim().toUpperCase();
  if (!VALID_TXN_CODES.has(code)) {
    res.status(400).json({ error: "Invalid transaction code" });
    return;
  }

  // Check 44 hour cooldown per user per code
  const fortyFourHoursAgo = new Date(Date.now() - 44 * 60 * 60 * 1000);
  const recentUsage = await db.select().from(txnCodeUsagesTable)
    .where(and(eq(txnCodeUsagesTable.userId, req.userId!), eq(txnCodeUsagesTable.code, code), gte(txnCodeUsagesTable.usedAt, fortyFourHoursAgo)))
    .limit(1);
  if (recentUsage.length) {
    res.status(400).json({ error: "Transaction code already used. Please try again later." });
    return;
  }

  // Record usage
  await db.insert(txnCodeUsagesTable).values({ userId: req.userId!, code });

  // Create deposit record
  const [deposit] = await db.insert(depositsTable).values({
    userId: req.userId!, amount: String(amount), transactionCode: code, method: method ?? "code", status: "completed",
  }).returning();

  // Update account balance (using treasury split defaults)
  const [treasSettings] = await db.select().from(treasurySettingsTable).where(eq(treasurySettingsTable.userId, req.userId!)).limit(1);
  const reinvest = treasSettings ? treasSettings.reinvestPercent / 100 : 0.5;
  const reserve = treasSettings ? treasSettings.reservePercent / 100 : 0.3;
  const withdrawable = treasSettings ? treasSettings.withdrawablePercent / 100 : 0.2;

  const depositAmount = parseFloat(String(amount));

  // Directly update balances
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  const currentTrading = parseFloat(acct.tradingBalance);
  const currentReserve = parseFloat(acct.profitReserve);
  const currentWithdrawable = parseFloat(acct.withdrawableBalance);
  const currentEmergency = parseFloat(acct.emergencyReserve);

  await db.update(accountsTable).set({
    tradingBalance: String((currentTrading + depositAmount * reinvest).toFixed(2)),
    profitReserve: String((currentReserve + depositAmount * reserve).toFixed(2)),
    withdrawableBalance: String((currentWithdrawable + depositAmount * withdrawable).toFixed(2)),
    updatedAt: new Date(),
  }).where(eq(accountsTable.userId, req.userId!));

  // Check if there's an active investment; if not, start one
  const existingInvestment = await db.select().from(investmentsTable)
    .where(and(eq(investmentsTable.userId, req.userId!), eq(investmentsTable.status, "active")))
    .limit(1);

  if (!existingInvestment.length) {
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const snapshots = computeDailySnapshots(depositAmount, 1);
    const currentVal = snapshots.length ? snapshots[snapshots.length - 1].value : depositAmount;
    const [investment] = await db.insert(investmentsTable).values({
      userId: req.userId!,
      principal: String(depositAmount),
      currentValue: String(currentVal.toFixed(2)),
      endDate,
      status: "active",
      dayNumber: 1,
      profitPercent: String(((currentVal - depositAmount) / depositAmount * 100).toFixed(4)),
      dailySnapshots: snapshots,
    }).returning();

    // Generate initial trades
    const trades = generateTrades(investment.id, 12, depositAmount);
    for (const trade of trades) {
      await db.insert(tradesTable).values(trade);
    }
  }

  res.json({
    id: deposit.id, userId: deposit.userId, amount: parseFloat(deposit.amount),
    transactionCode: deposit.transactionCode, method: deposit.method, status: deposit.status,
    createdAt: deposit.createdAt.toISOString(),
  });
});

router.get("/deposit", requireAuth, async (req, res) => {
  const deposits = await db.select().from(depositsTable).where(eq(depositsTable.userId, req.userId!));
  res.json(deposits.map(d => ({
    id: d.id, userId: d.userId, amount: parseFloat(d.amount),
    transactionCode: d.transactionCode, method: d.method, status: d.status,
    createdAt: d.createdAt.toISOString(),
  })));
});

export default router;
