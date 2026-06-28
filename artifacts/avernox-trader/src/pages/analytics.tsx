import { useGetInvestmentSummary } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Target, Activity, DollarSign, Cpu } from "lucide-react";

export default function Analytics() {
  const { data: summary, isLoading } = useGetInvestmentSummary();

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );

  const stats = [
    { label: "Total Profit", value: `+$${summary?.totalProfit?.toFixed(2) || "0.00"}`, icon: TrendingUp, color: "#0ECB81", positive: true },
    { label: "Monthly Return", value: `${summary?.monthlyReturn?.toFixed(1)}%`, icon: Target, color: "#F0B90B", positive: true },
    { label: "Win Rate", value: `${summary?.winRate}%`, icon: Activity, color: "#3b82f6", positive: true },
    { label: "Withdrawn", value: `$${summary?.totalWithdrawn?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "#848E9C" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Performance deep dive</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Win/Loss Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="text-sm font-semibold mb-4">Win / Loss Breakdown</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#0ECB81] font-semibold">Wins</span>
              <span className="text-muted-foreground">{summary?.winRate}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#0ECB81] rounded-full" style={{ width: `${summary?.winRate || 0}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#F6465D] font-semibold">Losses</span>
              <span className="text-muted-foreground">{summary?.lossRate}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#F6465D] rounded-full" style={{ width: `${summary?.lossRate || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Historical Growth Curve</h2>
        </div>
        <div className="h-56">
          {summary?.growthCurve && summary.growthCurve.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.growthCurve} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ECB81" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ECB81" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" />
                <XAxis dataKey="date" stroke="#848E9C" fontSize={10} tickFormatter={v => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
                <YAxis stroke="#848E9C" fontSize={10} tickFormatter={v => `$${v}`} width={55} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E2329", borderColor: "#2B3139", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Portfolio"]}
                />
                <Area type="monotone" dataKey="value" stroke="#0ECB81" strokeWidth={2} fillOpacity={1} fill="url(#greenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Activity className="h-8 w-8 mb-2" />
              <p className="text-sm">Not enough data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Insights</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/20 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Best Strategy</p>
            <p className="text-sm font-bold text-primary">{summary?.bestStrategy || "Gathering..."}</p>
          </div>
          <div className="bg-muted/20 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Trade Profit</p>
            <p className="text-sm font-bold text-[#0ECB81]">+${summary?.avgTrade?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
          <p className="text-sm text-primary">🤖 The Neural Network is currently favoring high-frequency macro arbitrage within forex markets, targeting 18-22% monthly returns.</p>
        </div>
      </div>
    </div>
  );
}
