import { useGetTrending, useGetTradeAlerts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Activity } from "lucide-react";

export default function Market() {
  const { data: trending, isLoading: loadingTrending } = useGetTrending();
  const { data: alerts, isLoading: loadingAlerts } = useGetTradeAlerts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold">Market Intelligence</h1>
        <p className="text-muted-foreground">Real-time market scanning and AI trade alerts.</p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 bg-black/40 border border-border">
          <TabsTrigger value="trending">Trending Assets</TabsTrigger>
          <TabsTrigger value="alerts">AI Trade Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-6 mt-6">
          {loadingTrending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
                  <CardTitle className="text-emerald-500 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5" /> Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {trending?.gainers.map((asset, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="p-4 font-medium">{asset.symbol}</td>
                          <td className="p-4 text-muted-foreground">{asset.name}</td>
                          <td className="p-4 font-mono text-right">${asset.price.toFixed(2)}</td>
                          <td className="p-4 font-mono text-right text-emerald-500">+{asset.changePercent.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
                  <CardTitle className="text-rose-500 flex items-center gap-2">
                    <ArrowDownRight className="h-5 w-5" /> Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {trending?.losers.map((asset, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="p-4 font-medium">{asset.symbol}</td>
                          <td className="p-4 text-muted-foreground">{asset.name}</td>
                          <td className="p-4 font-mono text-right">${asset.price.toFixed(2)}</td>
                          <td className="p-4 font-mono text-right text-rose-500">{asset.changePercent.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          {loadingAlerts ? (
            <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
          ) : (
            <div className="space-y-4">
              {alerts?.map((alert) => (
                <Card key={alert.id} className="bg-black/40 border-border overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className={`w-2 md:w-2 ${alert.impact === 'High' ? 'bg-rose-500' : alert.impact === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {alert.impact === 'High' ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Activity className="h-4 w-4 text-blue-500" />}
                          <h3 className="font-bold text-lg">{alert.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(alert.publishedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{alert.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-black/60 rounded text-xs text-muted-foreground border border-border">
                          Impact: <span className={alert.impact === 'High' ? 'text-rose-500' : 'text-amber-500'}>{alert.impact}</span>
                        </span>
                        <span className="px-2 py-1 bg-black/60 rounded text-xs text-muted-foreground border border-border">
                          Category: {alert.category}
                        </span>
                        {alert.assets?.map(asset => (
                          <span key={asset} className="px-2 py-1 bg-primary/10 rounded text-xs text-primary border border-primary/20">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {!alerts?.length && (
                <div className="text-center p-12 text-muted-foreground border border-dashed border-border rounded-lg">
                  No active trade alerts at this time.
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}