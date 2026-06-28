import { useGetInvestmentSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Crosshair, BarChart, ArrowDownToLine } from "lucide-react";

export default function Analytics() {
  const { data: summary, isLoading } = useGetInvestmentSummary();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-96" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold">Profit Analytics</h1>
        <p className="text-muted-foreground">Deep dive into algorithm performance metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" /> <span className="text-sm font-medium">Total Generated</span>
            </div>
            <div className="text-3xl font-mono text-emerald-500 font-bold">+${summary?.totalProfit?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart className="h-4 w-4" /> <span className="text-sm font-medium">Avg Monthly</span>
            </div>
            <div className="text-3xl font-mono font-bold">{summary?.monthlyReturn?.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Crosshair className="h-4 w-4" /> <span className="text-sm font-medium">Win/Loss Ratio</span>
            </div>
            <div className="text-3xl font-mono font-bold">{summary?.winRate}% / {summary?.lossRate}%</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ArrowDownToLine className="h-4 w-4" /> <span className="text-sm font-medium">Total Withdrawn</span>
            </div>
            <div className="text-3xl font-mono font-bold">${summary?.totalWithdrawn?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-black/40 border-border">
          <CardHeader>
            <CardTitle>Historical Growth Curve</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {summary?.growthCurve && summary.growthCurve.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.growthCurve}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(180 100% 40%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(180 100% 40%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickFormatter={val => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={val => `$${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(180 100% 40%)" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground">Awaiting sufficient data points.</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-card/50 border-border">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Most Profitable Strategy</div>
              <div className="text-lg font-medium text-primary">{summary?.bestStrategy || 'Gathering data...'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Average Trade Profit</div>
              <div className="text-lg font-mono text-emerald-500">+${summary?.avgTrade?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-md border border-primary/20 mt-4">
              <p className="text-sm text-primary">The Neural Network is currently favoring high-frequency macro arbitrage within the forex markets.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}