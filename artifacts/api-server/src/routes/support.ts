import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { SUPPORT_ISSUES } from "../lib/trading";

const router = Router();

router.get("/support/issues", requireAuth, async (_req, res) => {
  res.json(SUPPORT_ISSUES);
});

router.post("/support/submit", requireAuth, async (req, res) => {
  const { issueId } = req.body;
  if (!issueId) { res.status(400).json({ error: "Issue ID required" }); return; }
  res.json({
    id: Math.floor(Math.random() * 10000),
    issueId,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
});

export default router;
