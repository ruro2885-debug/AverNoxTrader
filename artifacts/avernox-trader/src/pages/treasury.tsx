import { useGetBalance } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Vault, Banknote, ShieldAlert, Coins, History, TrendingUp } from "lucide-react";

export default function Treasury() {
  const { data: balance, isLoading } = useGetBalance();

  if (isLoading) return (
    <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
  );

  const total = balance?.total || 1;

  const categories = [
    { title: "Trading Balance", value: balance?.tradingBalance || 0, icon: Banknote, color: "#3b82f6", bg: "#3b82f6" },
    { title: "Withdrawable", value: balance?.withdrawableBalance || 0, icon: Coins, color: "#0ECB81", bg: "#0ECB81" },
    { title: "Profit Reserve", value: balance?.profitReserve || 0, icon: Vault, color: "#F0B90B", bg: "#F0B90B" },
    { title: "Emergency Reserve", value: balance?.emergencyReserve || 0, icon: ShieldAlert, color: "#F6465D", bg: "#F6465D" },
    { title: "Historical Profit", value: balance?.historicalProfit || 0, icon: History, color: "#0ECB81", bg: "#0ECB81" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Treasury</h1>
        <p className="text-sm text-muted-foreground">Capital distribution overview</p>
      </div>

      {/* Total Value */}
      <div className="bg-gradient-to-br from-[#1E2329] to-[#1a2c3a] border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">Total Asset Value</p>
        </div>
        <p className="text-4xl font-black text-foreground">${balance?.total.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-2">Combined sum of all active, reserved & liquid capital</p>
      </div>

      {/* Donut-style visual */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="text-sm font-semibold mb-4">Liquidity Distribution</h2>

        {/* Stacked bar */}
        <div className="h-5 rounded-full overflow-hidden flex mb-4">
          {categories.map(({ title, value, bg }) => (
            <div
              key={title}
              style={{ width: `${Math.max(1, (value / total) * 100)}%`, backgroundColor: bg }}
              className="transition-all"
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {categories.map(({ title, color }) => (
            <div key={title} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground truncate">{title}</span>
            </div>
          ))}
        </div>

        {/* Category rows */}
        <div className="space-y-3">
          {categories.map(({ title, value, icon: Icon, color, bg }) => (
            <div key={title} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${bg}18` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <span className="text-sm font-bold" style={{ color }}>${value.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden ml-9">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(1, (value / total) * 100)}%`, backgroundColor: bg }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Liquid Rate</p>
          <p className="text-xl font-bold text-[#0ECB81]">
            {((((balance?.withdrawableBalance || 0) + (balance?.tradingBalance || 0)) / total) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Reserve Rate</p>
          <p className="text-xl font-bold text-[#F0B90B]">
            {((((balance?.emergencyReserve || 0) + (balance?.profitReserve || 0)) / total) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
