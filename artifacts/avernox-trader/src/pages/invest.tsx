import { useGetActiveInvestment, useGetTrades, useRefreshTrades } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw, ArrowDownLeft, ArrowUpRight, TrendingUp, Zap, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "wouter";

export default function Invest() {
  const { data: investment, isLoading: loadingInv } = useGetActiveInvestment();
  const { data: trades, isLoading: loadingTrades } = useGetTrades();
  const refreshTrades = useRefreshTrades();

  if (loadingInv || loadingTrades) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Engine</h1>
          <p className="text-sm text-muted-foreground">7-day algorithmic trading</p>
        </div>
        <button
          onClick={() => refreshTrades.mutate(undefined)}
          disabled={refreshTrades.isPending}
          className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-sm font-medium hover:border-primary/40 transition-colors"
        >
          <RefreshCcw className={`h-4 w-4 text-primary ${refreshTrades.isPending ? "animate-spin" : ""}`} />
          Sync
        </button>
      </div>

      {investment ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Principal</p>
              <p className="text-xl font-bold">${investment.principal.toFixed(2)}</p>
            </div>
            <div className="bg-card border border-[#0ECB81]/30 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Current Value</p>
              <p className="text-xl font-bold text-[#0ECB81]">${investment.currentValue.toFixed(2)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Profit</p>
              <p className="text-xl font-bold text-[#0ECB81]">+{investment.profitPercent?.toFixed(2)}%</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Day</p>
              <p className="text-xl font-bold">{investment.dayNumber} <span className="text-sm text-muted-foreground">/ 7</span></p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Cycle Progress</span>
              <span className="text-xs text-muted-foreground">Day {investment.dayNumber} of 7</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0ECB81] to-[#059669] rounded-full transition-all"
                style={{ width: `${((investment.dayNumber || 1) / 7) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4, 5, 6, 7].map(d => (
                <span key={d} className={`text-xs ${d <= (investment.dayNumber || 0) ? "text-[#0ECB81]" : "text-muted-foreground"}`}>{d}</span>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Performance Chart</h2>
            </div>
            <div className="h-52">
              {investment.dailySnapshots && investment.dailySnapshots.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={investment.dailySnapshots} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
                    <XAxis dataKey="day" stroke="#848E9C" fontSize={11} tickFormatter={(v) => `D${v}`} />
                    <YAxis stroke="#848E9C" fontSize={11} tickFormatter={(v) => `$${v}`} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1E2329", borderColor: "#2B3139", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => [`$${v.toFixed(2)}`, "Value"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0ECB81"
                      strokeWidth={2.5}
                      dot={{ fill: "#0ECB81", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2" />
                  <p className="text-sm">Accumulating data...</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">No Active Investment</h3>
            <p className="text-sm text-muted-foreground">Fund your account to start the 7-day AI cycle.</p>
          </div>
          <Link href="/deposit">
            <div className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
              Fund Account
            </div>
          </Link>
        </div>
      )}

      {/* Live Trade Feed */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" />
          <h2 className="text-sm font-semibold">Live Trade Feed</h2>
          <span className="ml-auto text-xs text-muted-foreground">{trades?.length || 0} trades</span>
        </div>

        {!trades?.length ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No trades recorded yet</div>
        ) : (
          <div className="divide-y divide-border/40">
            {trades.map((trade) => (
              <div key={trade.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${trade.type === "BUY" ? "bg-[#0ECB81]/15" : "bg-[#F6465D]/15"}`}>
                  {trade.type === "BUY" ? (
                    <ArrowDownLeft className="h-4 w-4 text-[#0ECB81]" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-[#F6465D]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{trade.asset}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${trade.type === "BUY" ? "bg-[#0ECB81]/15 text-[#0ECB81]" : "bg-[#F6465D]/15 text-[#F6465D]"}`}>
                      {trade.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(trade.executedAt).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">${trade.amount.toFixed(2)}</p>
                  <p className={`text-xs font-medium ${trade.profitLoss >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                    {trade.profitLoss >= 0 ? "+" : ""}{trade.profitLoss.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
