import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, accountsTable, userSettingsTable, treasurySettingsTable, portfoliosTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, generateToken, generateReferralCode } from "../lib/auth";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { username, password, referralCode } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (existing.length) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  let referredByCode: string | undefined;
  if (referralCode) {
    const referrer = await db.select().from(usersTable).where(eq(usersTable.referralCode, referralCode)).limit(1);
    if (referrer.length) referredByCode = referralCode;
  }

  const [user] = await db.insert(usersTable).values({
    username,
    passwordHash: hashPassword(password),
    referralCode: generateReferralCode(),
    referredBy: referredByCode ?? null,
    accountStatus: "active",
  }).returning();

  // Create account, settings, treasury, portfolio
  await Promise.all([
    db.insert(accountsTable).values({ userId: user.id }),
    db.insert(userSettingsTable).values({ userId: user.id }),
    db.insert(treasurySettingsTable).values({ userId: user.id }),
    db.insert(portfoliosTable).values({ userId: user.id }),
  ]);

  const token = generateToken(user.id);
  res.status(201).json({
    user: { id: user.id, username: user.username, createdAt: user.createdAt.toISOString(), referralCode: user.referralCode, accountStatus: user.accountStatus },
    token,
  });
});

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const token = generateToken(user.id);
  res.json({
    user: { id: user.id, username: user.username, createdAt: user.createdAt.toISOString(), referralCode: user.referralCode, accountStatus: user.accountStatus },
    token,
  });
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true });
});

export default router;
