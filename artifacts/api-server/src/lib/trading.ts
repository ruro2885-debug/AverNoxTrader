const ASSETS = [
  { name: "BTC/USD", category: "crypto" },
  { name: "ETH/USD", category: "crypto" },
  { name: "SOL/USD", category: "crypto" },
  { name: "EUR/USD", category: "forex" },
  { name: "GBP/USD", category: "forex" },
  { name: "USD/JPY", category: "forex" },
  { name: "AAPL", category: "stocks" },
  { name: "TSLA", category: "stocks" },
  { name: "NVDA", category: "stocks" },
  { name: "MSFT", category: "stocks" },
  { name: "SPY", category: "stocks" },
  { name: "QQQ", category: "stocks" },
  { name: "BNB/USD", category: "crypto" },
  { name: "XRP/USD", category: "crypto" },
  { name: "ADA/USD", category: "crypto" },
];

const STRATEGIES = [
  "Momentum Breakout",
  "Mean Reversion",
  "Scalp Entry",
  "Trend Following",
  "AI Pattern Recognition",
  "Fibonacci Confluence",
  "Volume Spike",
  "RSI Divergence",
  "MACD Crossover",
  "Support/Resistance Flip",
];

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateTrades(investmentId: number, count: number, baseAmount: number) {
  const trades = [];
  // bias: ~70% wins, ~30% losses but profit dominated by wins
  for (let i = 0; i < count; i++) {
    const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
    const type = Math.random() > 0.5 ? "LONG" : "SHORT";
    const amount = randomBetween(baseAmount * 0.01, baseAmount * 0.08);
    const isWin = Math.random() < 0.68;
    const isLoss = !isWin;
    let profitLoss: number;
    if (isWin) {
      profitLoss = amount * randomBetween(0.02, 0.12);
    } else {
      profitLoss = -(amount * randomBetween(0.01, 0.05));
    }
    const msAgo = Math.floor(Math.random() * 3600000 * 8);
    trades.push({
      investmentId,
      asset: asset.name,
      type,
      amount: amount.toFixed(2),
      result: isWin ? "win" : "loss",
      profitLoss: profitLoss.toFixed(2),
      executedAt: new Date(Date.now() - msAgo),
      status: "closed",
      strategy: STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)],
    });
  }
  return trades.sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime());
}

export function computeDailySnapshots(principal: number, daysElapsed: number): Array<{ day: number; value: number; profit: number }> {
  const snapshots = [];
  let value = principal;
  for (let day = 1; day <= Math.min(daysElapsed, 7); day++) {
    // Each day grows roughly 8-18% of principal, with some variance
    const dailyGrowthRate = randomBetween(0.008, 0.025);
    const dailyLoss = randomBetween(0.001, 0.005);
    const netRate = dailyGrowthRate - dailyLoss;
    value = value * (1 + netRate);
    snapshots.push({ day, value: parseFloat(value.toFixed(2)), profit: parseFloat((value - principal).toFixed(2)) });
  }
  return snapshots;
}

export const VALID_TXN_CODES = new Set([
  "TXN-AX7K-9F2D-QW81-7C4E",
  "TXN-BR4M-3J8X-VP26-1LA9",
  "TXN-CK9Z-7N1F-XE84-2RW5",
  "TXN-DQ2H-8B6P-TM91-4YC7",
  "TXN-EV8L-5R3K-ZA72-9GX1",
  "TXN-FM1Q-4C9W-LD85-6NB2",
  "TXN-GX7D-2V8E-RT34-1PK9",
  "TXN-HZ5A-6Y2N-CF80-3QM4",
  "TXN-JN3T-8L7B-WX61-5RD2",
  "TXN-KP4F-1M9Z-VE73-8HA6",
  "TXN-LC8R-5Q2D-YN14-7BT3",
  "TXN-MW2X-7E6A-KR95-0CF8",
  "TXN-NF9P-3T1L-DX62-4GV7",
  "TXN-PR6B-8W5Q-AM30-9JK2",
  "TXN-QD1Y-4K8F-ZN57-6EX9",
  "TXN-RV7C-2P9H-LA84-1WM5",
  "TXN-SX5N-6D3R-QF20-8TB1",
  "TXN-TA9E-1V7K-CM65-4PY8",
  "TXN-UK4W-8B2X-JR91-5DN3",
  "TXN-VE6M-3F9A-XQ47-2LC8",
]);

export const TRENDING_GAINERS = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 134.82, change: 8.45, changePercent: 6.69, volume: "142.3M", category: "stocks" },
  { symbol: "BTC", name: "Bitcoin", price: 67420.50, change: 2310.20, changePercent: 3.55, volume: "38.2B", category: "crypto" },
  { symbol: "SOL", name: "Solana", price: 182.34, change: 12.67, changePercent: 7.47, volume: "4.1B", category: "crypto" },
  { symbol: "META", name: "Meta Platforms", price: 508.32, change: 18.90, changePercent: 3.86, volume: "22.1M", category: "stocks" },
  { symbol: "ETH", name: "Ethereum", price: 3542.10, change: 98.40, changePercent: 2.86, volume: "18.4B", category: "crypto" },
];

export const TRENDING_LOSERS = [
  { symbol: "BABA", name: "Alibaba Group", price: 78.21, change: -4.82, changePercent: -5.81, volume: "18.7M", category: "stocks" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1284, change: -0.0091, changePercent: -6.62, volume: "2.3B", category: "crypto" },
  { symbol: "INTC", name: "Intel Corp", price: 29.45, change: -1.73, changePercent: -5.55, volume: "42.1M", category: "stocks" },
  { symbol: "XRP", name: "Ripple", price: 0.5821, change: -0.0382, changePercent: -6.15, volume: "1.4B", category: "crypto" },
  { symbol: "WMT", name: "Walmart Inc", price: 67.82, change: -2.41, changePercent: -3.43, volume: "9.8M", category: "stocks" },
];

export const TRADE_ALERTS = [
  {
    title: "Federal Reserve Rate Decision — Markets on Edge",
    description: "Fed signals potential rate hold amid cooling inflation. Tech sector expected to rally as borrowing costs stabilize. Risk-on sentiment building.",
    impact: "high",
    category: "Macro",
    assets: ["SPY", "QQQ", "AAPL", "MSFT"],
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    title: "NVIDIA Earnings Beat — AI Chip Demand Surges",
    description: "NVDA reports Q3 revenue 18% above consensus on unprecedented data center demand. Analysts upgrade price targets across semiconductor sector.",
    impact: "high",
    category: "Earnings",
    assets: ["NVDA", "AMD", "INTC", "TSM"],
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    title: "Bitcoin ETF Inflows Hit Record $1.2B",
    description: "Spot Bitcoin ETFs see record daily inflows, pushing BTC above key $67K resistance. Institutional buying accelerating ahead of halving cycle.",
    impact: "high",
    category: "Crypto",
    assets: ["BTC", "ETH", "SOL", "BNB"],
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    title: "USD Weakens on Jobs Data Miss",
    description: "Non-farm payrolls come in 40K below forecast at 185K. Dollar index drops 0.8%. EUR/USD and GBP/USD surge on weak employment data.",
    impact: "medium",
    category: "Forex",
    assets: ["EUR/USD", "GBP/USD", "USD/JPY"],
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    title: "Apple Vision Pro Supply Chain Concerns",
    description: "Analyst reports cite component shortages for Vision Pro production ramp. AAPL shares under pressure. Watch for support at $168 level.",
    impact: "medium",
    category: "Tech",
    assets: ["AAPL", "FOXC", "TSM"],
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    title: "China PMI Beats Expectations — Risk-On",
    description: "China manufacturing PMI prints at 50.8, first expansion in 6 months. Commodity currencies AUD, CAD rally. Emerging market assets bid.",
    impact: "medium",
    category: "Macro",
    assets: ["BABA", "FXI", "AUD/USD"],
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
  },
];

export const CRYPTO_RATES = [
  { symbol: "BTC", name: "Bitcoin", usdRate: 67420.50, logoUrl: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
  { symbol: "ETH", name: "Ethereum", usdRate: 3542.10, logoUrl: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" },
  { symbol: "USDT", name: "Tether", usdRate: 1.00, logoUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png" },
  { symbol: "BNB", name: "BNB", usdRate: 598.40, logoUrl: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png" },
  { symbol: "SOL", name: "Solana", usdRate: 182.34, logoUrl: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png" },
  { symbol: "XRP", name: "Ripple", usdRate: 0.5821, logoUrl: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" },
  { symbol: "USDC", name: "USD Coin", usdRate: 1.00, logoUrl: "https://assets.coingecko.com/coins/images/6319/thumb/usdc.png" },
  { symbol: "ADA", name: "Cardano", usdRate: 0.4812, logoUrl: "https://assets.coingecko.com/coins/images/975/thumb/cardano.png" },
];

export const SUPPORT_ISSUES = [
  { id: 1, title: "Deposit not reflected in balance", category: "Deposits", description: null },
  { id: 2, title: "Unable to log in to my account", category: "Account", description: null },
  { id: 3, title: "Withdrawal transaction failed", category: "Withdrawals", description: null },
  { id: 4, title: "Investment not starting after deposit", category: "Investments", description: null },
  { id: 5, title: "Transaction code not accepted", category: "Deposits", description: null },
  { id: 6, title: "Portfolio not updating correctly", category: "Portfolio", description: null },
  { id: 7, title: "Trade history showing incorrect data", category: "Trading", description: null },
  { id: 8, title: "Cannot change password", category: "Account", description: null },
  { id: 9, title: "Referral reward not credited", category: "Referral", description: null },
  { id: 10, title: "App is running slow or freezing", category: "Technical", description: null },
];
