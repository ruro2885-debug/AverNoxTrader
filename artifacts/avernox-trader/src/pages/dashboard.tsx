import { useGetMe, useGetBalance, useGetActiveInvestment, useGetTrades } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, DollarSign, PieChart, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const { data: me, isLoading: loadingMe } = useGetMe();
  const { data: balance, isLoading: loadingBalance } = useGetBalance();
  const { data: investment, isLoading: loadingInvestment } = useGetActiveInvestment();
  const { data: trades, isLoading: loadingTrades } = useGetTrades();

  if (loadingMe || loadingBalance || loadingInvestment || loadingTrades) {
    return <div className="space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold text-foreground">Welcome back, {me?.username}</h1>
        <p className="text-muted-foreground">Terminal active. Systems nominal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">${balance?.total?.toFixed(2)}</div>
            <p className="text-xs text-primary mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> Active</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Investment</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">${investment?.currentValue?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground mt-1">Status: {investment?.status || "None"}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Historical Profit</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-emerald-400">${balance?.historicalProfit?.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-sans font-semibold">Recent AI Activity</h2>
        <Card className="bg-black/40 border-border">
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-black/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">P/L</th>
                </tr>
              </thead>
              <tbody>
                {trades?.slice(0, 5).map(trade => (
                  <tr key={trade.id} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium">{trade.asset}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{trade.type}</span></td>
                    <td className="px-4 py-3 font-mono">${trade.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{trade.result}</td>
                    <td className={`px-4 py-3 font-mono ${trade.profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!trades?.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No recent trades</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}