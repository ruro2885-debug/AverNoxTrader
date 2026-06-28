import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable, accountsTable, userSettingsTable, treasurySettingsTable,
  portfoliosTable, referralHistoryTable, goalsTable,
} from "@workspace/db";
import { eq, and, sum } from "drizzle-orm";
import { requireAuth, hashPassword } from "../lib/auth";

const router = Router();

router.get("/user/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: user.id, username: user.username, createdAt: user.createdAt.toISOString(), referralCode: user.referralCode, accountStatus: user.accountStatus });
});

router.get("/user/balance", requireAuth, async (req, res) => {
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  if (!acct) { res.json({ total: 0, tradingBalance: 0, profitReserve: 0, emergencyReserve: 0, withdrawableBalance: 0, historicalProfit: 0 }); return; }
  const trading = parseFloat(acct.tradingBalance);
  const reserve = parseFloat(acct.profitReserve);
  const emergency = parseFloat(acct.emergencyReserve);
  const withdrawable = parseFloat(acct.withdrawableBalance);
  const historical = parseFloat(acct.historicalProfit);
  res.json({ total: trading + reserve + emergency + withdrawable, tradingBalance: trading, profitReserve: reserve, emergencyReserve: emergency, withdrawableBalance: withdrawable, historicalProfit: historical });
});

router.get("/user/settings", requireAuth, async (req, res) => {
  let [settings] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, req.userId!)).limit(1);
  if (!settings) {
    [settings] = await db.insert(userSettingsTable).values({ userId: req.userId! }).returning();
  }
  res.json(settings);
});

router.patch("/user/settings", requireAuth, async (req, res) => {
  const update: Record<string, unknown> = {};
  const allowed = ["tradingStyle","executionMode","maxActivePositions","smartEntry","riskLevel","stopLossProtection","profitLock","capitalExposureLimit","confluenceStrength","marketScanner","aiAdaptation","signalQuality","allocationMethod","reserveCapital","autoRebalancing","tradeNotifications","performanceReports","dashboardMode"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }
  const [updated] = await db.update(userSettingsTable).set({ ...update, updatedAt: new Date() }).where(eq(userSettingsTable.userId, req.userId!)).returning();
  res.json(updated);
});

router.post("/user/change-password", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) { res.status(400).json({ error: "Both passwords required" }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user || user.passwordHash !== hashPassword(oldPassword)) {
    res.status(400).json({ error: "Old password is incorrect" }); return;
  }
  await db.update(usersTable).set({ passwordHash: hashPassword(newPassword) }).where(eq(usersTable.id, req.userId!));
  res.json({ success: true });
});

router.get("/portfolio", requireAuth, async (req, res) => {
  let [portfolio] = await db.select().from(portfoliosTable).where(eq(portfoliosTable.userId, req.userId!)).limit(1);
  if (!portfolio) {
    [portfolio] = await db.insert(portfoliosTable).values({ userId: req.userId! }).returning();
  }
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  const totalValue = acct ? parseFloat(acct.tradingBalance) + parseFloat(acct.profitReserve) : 0;
  res.json({ ...portfolio, totalValue });
});

router.patch("/portfolio", requireAuth, async (req, res) => {
  const { cryptoPercent, forexPercent, stocksPercent, experimentalPercent } = req.body;
  const total = (cryptoPercent ?? 0) + (forexPercent ?? 0) + (stocksPercent ?? 0) + (experimentalPercent ?? 0);
  if (total !== 100) { res.status(400).json({ error: "Percentages must sum to 100" }); return; }
  const [updated] = await db.update(portfoliosTable).set({ cryptoPercent, forexPercent, stocksPercent, experimentalPercent, updatedAt: new Date() }).where(eq(portfoliosTable.userId, req.userId!)).returning();
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  const totalValue = acct ? parseFloat(acct.tradingBalance) + parseFloat(acct.profitReserve) : 0;
  res.json({ ...updated, totalValue });
});

router.get("/referral", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  const history = await db.select().from(referralHistoryTable).where(eq(referralHistoryTable.referrerId, req.userId!));
  const totalEarned = history.reduce((s, r) => s + parseFloat(r.reward), 0);
  res.json({
    code: user.referralCode,
    link: `https://avernoxtrader.replit.app/register?ref=${user.referralCode}`,
    totalReferrals: history.length,
    totalEarned,
    referralReward: 15,
    history: history.map(h => ({ id: h.id, username: h.referredUsername, joinedAt: h.joinedAt.toISOString(), reward: parseFloat(h.reward) })),
  });
});

router.get("/goals", requireAuth, async (req, res) => {
  const goals = await db.select().from(goalsTable).where(eq(goalsTable.userId, req.userId!));
  res.json(goals.map(g => ({
    id: g.id, userId: g.userId, title: g.title,
    targetAmount: parseFloat(g.targetAmount), currentAmount: parseFloat(g.currentAmount),
    deadline: g.deadline.toISOString(), status: g.status, actionOnCompletion: g.actionOnCompletion,
  })));
});

router.post("/goals", requireAuth, async (req, res) => {
  const { title, targetAmount, deadline, actionOnCompletion } = req.body;
  if (!title || !targetAmount || !deadline) { res.status(400).json({ error: "Missing required fields" }); return; }
  const [goal] = await db.insert(goalsTable).values({
    userId: req.userId!, title, targetAmount: String(targetAmount), deadline: new Date(deadline), actionOnCompletion: actionOnCompletion ?? "continue",
  }).returning();
  res.status(201).json({ id: goal.id, userId: goal.userId, title: goal.title, targetAmount: parseFloat(goal.targetAmount), currentAmount: parseFloat(goal.currentAmount), deadline: goal.deadline.toISOString(), status: goal.status, actionOnCompletion: goal.actionOnCompletion });
});

export default router;
