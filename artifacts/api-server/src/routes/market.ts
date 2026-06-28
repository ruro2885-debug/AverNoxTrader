import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { TRENDING_GAINERS, TRENDING_LOSERS, TRADE_ALERTS, CRYPTO_RATES, SUPPORT_ISSUES } from "../lib/trading";

const router = Router();

router.get("/market/trending", requireAuth, async (_req, res) => {
  // Add small random noise to prices to simulate live data
  const noise = (base: number) => parseFloat((base * (1 + (Math.random() - 0.5) * 0.002)).toFixed(base > 1000 ? 2 : base > 1 ? 4 : 6));
  res.json({
    gainers: TRENDING_GAINERS.map(a => ({ ...a, price: noise(a.price) })),
    losers: TRENDING_LOSERS.map(a => ({ ...a, price: noise(a.price) })),
  });
});

router.get("/market/alerts", requireAuth, async (_req, res) => {
  res.json(TRADE_ALERTS.map((a, i) => ({ id: i + 1, ...a })));
});

router.get("/market/crypto-rates", requireAuth, async (_req, res) => {
  res.json(CRYPTO_RATES);
});

export default router;
