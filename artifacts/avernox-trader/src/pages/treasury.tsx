import { useGetBalance, useGetTreasury } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Vault, Banknote, ShieldAlert, Coins, History } from "lucide-react";

export default function Treasury() {
  const { data: balance, isLoading } = useGetBalance();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-96 w-full" /></div>;

  const total = balance?.total || 1;
  const getWidth = (val: number) => `${Math.max(1, (val / total) * 100)}%`;

  const categories = [
    { title: "Trading Balance", value: balance?.tradingBalance, icon: Banknote, color: "text-blue-500", bg: "bg-blue-500" },
    { title: "Withdrawable Balance", value: balance?.withdrawableBalance, icon: Coins, color: "text-emerald-500", bg: "bg-emerald-500" },
    { title: "Profit Reserve", value: balance?.profitReserve, icon: Vault, color: "text-amber-500", bg: "bg-amber-500" },
    { title: "Emergency Reserve", value: balance?.emergencyReserve, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500" },
    { title: "Historical Profit", value: balance?.historicalProfit, icon: History, color: "text-primary", bg: "bg-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold">Corporate Treasury</h1>
        <p className="text-muted-foreground">Comprehensive overview of capital distribution and liquidity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-1 bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Total Asset Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-mono font-bold text-foreground mb-4">
              ${balance?.total.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">Represents the combined sum of all active, reserved, and liquid capital within the AverNox ecosystem.</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 bg-black/40 border-border">
          <CardHeader>
            <CardTitle>Liquidity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <cat.icon className={`h-4 w-4 ${cat.color}`} />
                    <span className="font-medium text-sm">{cat.title}</span>
                  </div>
                  <span className="font-mono text-sm">${cat.value?.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-border">
                  <div className={`h-full ${cat.bg} rounded-full`} style={{ width: getWidth(cat.value || 0) }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}