import { useState } from "react";
import { useGetActiveInvestment, useGetTrades, useRefreshTrades } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Invest() {
  const { data: investment, isLoading: loadingInv } = useGetActiveInvestment();
  const { data: trades, isLoading: loadingTrades } = useGetTrades();
  const refreshTrades = useRefreshTrades();

  const handleRefresh = () => {
    refreshTrades.mutate({});
  };

  if (loadingInv || loadingTrades) {
    return <div className="space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-sans font-bold">Live AI Engine</h1>
          <p className="text-muted-foreground">Real-time algorithmic trading tracker.</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshTrades.isPending} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <RefreshCcw className={`h-4 w-4 mr-2 ${refreshTrades.isPending ? 'animate-spin' : ''}`} />
          Force Sync
        </Button>
      </div>

      {investment ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Principal</div>
                <div className="text-2xl font-mono">${investment.principal.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Value</div>
                <div className="text-2xl font-mono text-emerald-400">${investment.currentValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Profit %</div>
                <div className="text-2xl font-mono text-emerald-400">+{investment.profitPercent?.toFixed(2)}%</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cycle Day</div>
                <div className="text-2xl font-mono">{investment.dayNumber}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/40 border-border h-80">
            <CardHeader>
              <CardTitle className="text-sm">Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {investment.dailySnapshots && investment.dailySnapshots.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={investment.dailySnapshots}>
                    <XAxis dataKey="day" stroke="#666" fontSize={12} tickFormatter={(val) => `Day ${val}`} />
                    <YAxis stroke="#666" fontSize={12} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                    <Line type="monotone" dataKey="value" stroke="hsl(180 100% 40%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">Accumulating data...</div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-card/50 border-border p-8 text-center">
          <div className="text-muted-foreground">No active investment cycle. Fund your account to begin.</div>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-sans font-semibold">Live Trade Feed</h2>
        <Card className="bg-black/40 border-border">
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">P/L</th>
                </tr>
              </thead>
              <tbody>
                {trades?.map(trade => (
                  <tr key={trade.id} className="border-b border-border/50">
                    <td className="px-4 py-3 text-muted-foreground">{new Date(trade.executedAt).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 font-medium">{trade.asset}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{trade.type}</span></td>
                    <td className="px-4 py-3">{trade.result}</td>
                    <td className={`px-4 py-3 font-mono ${trade.profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}