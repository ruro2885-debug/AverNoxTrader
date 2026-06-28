import { useGetTrending, useGetTradeAlerts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Activity, Flame, TrendingDown } from "lucide-react";
import { AssetIcon } from "@/components/layout";
import { useState } from "react";

const CRYPTO_EXTRA = [
  { symbol: "BTC", name: "Bitcoin", price: 67420.52, change: +2.41, vol: "48.2B" },
  { symbol: "ETH", name: "Ethereum", price: 3512.88, change: -0.87, vol: "22.1B" },
  { symbol: "BNB", name: "BNB", price: 612.70, change: +1.23, vol: "4.8B" },
  { symbol: "SOL", name: "Solana", price: 182.34, change: +5.12, vol: "6.7B" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: +0.02, vol: "94.5B" },
  { symbol: "XRP", name: "XRP", price: 0.6148, change: -1.44, vol: "3.2B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1623, change: -2.31, vol: "1.9B" },
];

export default function Market() {
  const { data: trending, isLoading: loadingTrending } = useGetTrending();
  const { data: alerts, isLoading: loadingAlerts } = useGetTradeAlerts();
  const [tab, setTab] = useState<"crypto" | "stocks" | "alerts">("crypto");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="text-sm text-muted-foreground">Live prices & AI trade alerts</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
        {(["crypto", "stocks", "alerts"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "alerts" ? "AI Alerts" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "crypto" && (
        <div className="space-y-3">
          {/* Top mover banner */}
          <div className="bg-gradient-to-r from-[#0ECB81]/10 to-[#0ECB81]/5 border border-[#0ECB81]/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0ECB81]/20 flex items-center justify-center">
              <Flame className="h-5 w-5 text-[#0ECB81]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Top Mover Today</p>
              <p className="text-base font-bold">SOL <span className="text-[#0ECB81]">+5.12%</span> — $182.34</p>
            </div>
          </div>

          {/* Crypto list */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 px-4 py-2 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">Asset</span>
              <span className="text-xs font-medium text-muted-foreground text-center">24h Vol</span>
              <span className="text-xs font-medium text-muted-foreground text-right">Price / Change</span>
            </div>
            {CRYPTO_EXTRA.map((asset, i) => (
              <div key={asset.symbol} className={`flex items-center gap-3 px-4 py-3.5 ${i < CRYPTO_EXTRA.length - 1 ? "border-b border-border/40" : ""}`}>
                <div className="flex items-center gap-3 flex-1">
                  <AssetIcon symbol={asset.symbol} size={38} />
                  <div>
                    <p className="text-sm font-bold">{asset.symbol}</p>
                    <p className="text-xs text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground">{asset.vol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${asset.price.toLocaleString()}</p>
                  <p className={`text-xs font-semibold ${asset.change >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>
                    {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "stocks" && (
        <div className="space-y-3">
          {loadingTrending ? (
            <div className="space-y-3">
              <Skeleton className="h-32" /><Skeleton className="h-32" />
            </div>
          ) : (
            <>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <ArrowUpRight className="h-4 w-4 text-[#0ECB81]" />
                  <h3 className="text-sm font-semibold text-[#0ECB81]">Top Gainers</h3>
                </div>
                {trending?.gainers.map((asset, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3.5 ${i < (trending.gainers.length - 1) ? "border-b border-border/40" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0ECB81]/10 flex items-center justify-center font-bold text-sm text-[#0ECB81]">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${asset.price.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-[#0ECB81]">+{asset.changePercent.toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <TrendingDown className="h-4 w-4 text-[#F6465D]" />
                  <h3 className="text-sm font-semibold text-[#F6465D]">Top Losers</h3>
                </div>
                {trending?.losers.map((asset, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3.5 ${i < (trending.losers.length - 1) ? "border-b border-border/40" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F6465D]/10 flex items-center justify-center font-bold text-sm text-[#F6465D]">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${asset.price.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-[#F6465D]">{asset.changePercent.toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "alerts" && (
        <div className="space-y-3">
          {loadingAlerts ? (
            <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
          ) : alerts?.length ? (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className={`h-1 w-full ${alert.impact === "High" ? "bg-[#F6465D]" : alert.impact === "Medium" ? "bg-[#F0B90B]" : "bg-[#3b82f6]"}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {alert.impact === "High" ? (
                        <AlertTriangle className="h-4 w-4 text-[#F6465D]" />
                      ) : (
                        <Activity className="h-4 w-4 text-[#3b82f6]" />
                      )}
                      <h3 className="text-sm font-bold">{alert.title}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.impact === "High" ? "bg-[#F6465D]/15 text-[#F6465D]" :
                      alert.impact === "Medium" ? "bg-[#F0B90B]/15 text-[#F0B90B]" : "bg-[#3b82f6]/15 text-[#3b82f6]"
                    }`}>{alert.impact}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{alert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.assets?.map(asset => (
                      <span key={asset} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">{asset}</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(alert.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-2xl py-12 text-center">
              <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active alerts right now</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
