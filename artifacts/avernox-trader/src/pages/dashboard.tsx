import { useGetMe, useGetBalance, useGetActiveInvestment, useGetTrades } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight, Activity, TrendingUp, RefreshCw, ArrowRight } from "lucide-react";
import { AssetIcon } from "@/components/layout";

const QUICK_ACTIONS = [
  { label: "Deposit", icon: ArrowDownLeft, href: "/deposit", color: "#0ECB81", bg: "#0ECB81/10" },
  { label: "Withdraw", icon: ArrowUpRight, href: "/withdraw", color: "#F6465D", bg: "#F6465D/10" },
  { label: "AI Trade", icon: Activity, href: "/invest", color: "#F0B90B", bg: "#F0B90B/10" },
  { label: "Markets", icon: TrendingUp, href: "/market", color: "#3b82f6", bg: "#3b82f6/10" },
];

const MARKET_PREVIEW = [
  { symbol: "BTC", name: "Bitcoin", price: 67420.52, change: +2.41 },
  { symbol: "ETH", name: "Ethereum", price: 3512.88, change: -0.87 },
  { symbol: "SOL", name: "Solana", price: 182.34, change: +5.12 },
  { symbol: "BNB", name: "BNB", price: 612.70, change: +1.23 },
];

export default function Dashboard() {
  const { data: me } = useGetMe();
  const { data: balance, isLoading: loadingBalance } = useGetBalance();
  const { data: investment } = useGetActiveInvestment();
  const { data: trades, isLoading: loadingTrades } = useGetTrades();

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="pt-1">
        <p className="text-sm text-muted-foreground">Good day 👋</p>
        <h1 className="text-xl font-bold text-foreground capitalize">{me?.username || "Investor"}</h1>
      </div>

      {/* Balance Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0ECB81] via-[#059669] to-[#047857] p-6 shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-6 -right-6 w-36 h-36 bg-white rounded-full" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white rounded-full" />
        </div>
        <div className="relative z-10">
          <p className="text-[#0B0E11]/70 text-sm font-medium mb-1">Total Portfolio Value</p>
          {loadingBalance ? (
            <Skeleton className="h-10 w-40 bg-white/20 rounded-xl" />
          ) : (
            <p className="text-[#0B0E11] text-4xl font-black">${balance?.total.toFixed(2)}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-[#0B0E11]/60 text-xs">Profit</p>
              <p className="text-[#0B0E11] font-bold text-sm">+${balance?.historicalProfit.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-px h-8 bg-[#0B0E11]/20" />
            <div>
              <p className="text-[#0B0E11]/60 text-xs">Available</p>
              <p className="text-[#0B0E11] font-bold text-sm">${balance?.withdrawableBalance.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-px h-8 bg-[#0B0E11]/20" />
            <div>
              <p className="text-[#0B0E11]/60 text-xs">AI Active</p>
              <p className="text-[#0B0E11] font-bold text-sm">{investment ? "Running" : "None"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <div className="flex flex-col items-center gap-2 bg-card border border-border rounded-2xl p-3 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-foreground">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* AI Engine Status */}
      {investment && (
        <div className="bg-card border border-[#F0B90B]/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" />
              <span className="text-sm font-semibold text-foreground">AI Engine Running</span>
            </div>
            <Link href="/invest">
              <span className="text-xs text-[#0ECB81] flex items-center gap-1">View <ArrowRight className="h-3 w-3" /></span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Principal</p>
              <p className="text-sm font-bold">${investment.principal.toFixed(0)}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="text-sm font-bold text-[#0ECB81]">${investment.currentValue.toFixed(0)}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Gain</p>
              <p className="text-sm font-bold text-[#0ECB81]">+{investment.profitPercent?.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Market Snapshot */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Market</h2>
          <Link href="/market">
            <span className="text-xs text-[#0ECB81] flex items-center gap-1">See all <ArrowRight className="h-3 w-3" /></span>
          </Link>
        </div>
        {MARKET_PREVIEW.map((asset, i) => (
          <div key={asset.symbol} className={`flex items-center justify-between px-4 py-3 ${i < MARKET_PREVIEW.length - 1 ? "border-b border-border/40" : ""}`}>
            <div className="flex items-center gap-3">
              <AssetIcon symbol={asset.symbol} size={36} />
              <div>
                <p className="text-sm font-semibold">{asset.symbol}</p>
                <p className="text-xs text-muted-foreground">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">${asset.price.toLocaleString()}</p>
              <p className={`text-xs font-medium ${asset.change >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trades */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Recent AI Trades</h2>
          <Link href="/invest">
            <span className="text-xs text-[#0ECB81] flex items-center gap-1">All trades <ArrowRight className="h-3 w-3" /></span>
          </Link>
        </div>

        {loadingTrades ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !trades?.length ? (
          <div className="py-10 text-center">
            <RefreshCw className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No trades yet. Fund your account to start.</p>
          </div>
        ) : (
          trades.slice(0, 5).map((trade, i) => (
            <div key={trade.id} className={`flex items-center justify-between px-4 py-3 ${i < 4 && i < (trades.length - 1) ? "border-b border-border/40" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${trade.type === "BUY" ? "bg-[#0ECB81]/15" : "bg-[#F6465D]/15"}`}>
                  {trade.type === "BUY" ? (
                    <ArrowDownLeft className="h-4 w-4 text-[#0ECB81]" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-[#F6465D]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{trade.asset}</p>
                  <p className="text-xs text-muted-foreground">{trade.type} · {new Date(trade.executedAt).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${trade.amount.toFixed(2)}</p>
                <p className={`text-xs font-medium ${trade.profitLoss >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                  {trade.profitLoss >= 0 ? "+" : ""}{trade.profitLoss.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refer Banner */}
      <div className="bg-gradient-to-r from-[#1a2c4a] to-[#0f1e36] border border-[#1a56db]/30 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Invite Friends & Earn</p>
          <p className="text-xs text-[#848E9C] mt-0.5">Get <span className="text-[#F0B90B] font-bold">$15</span> for every person you refer</p>
        </div>
        <Link href="/referral">
          <div className="bg-[#1a56db] hover:bg-[#1447c4] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
            Invite
          </div>
        </Link>
      </div>
    </div>
  );
}
