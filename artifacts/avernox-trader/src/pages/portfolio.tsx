import { useState, useEffect } from "react";
import { useGetPortfolio, useUpdatePortfolio, useGetTreasury, useUpdateTreasurySettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, TrendingUp, Zap, ShieldCheck } from "lucide-react";

const ALLOCATION_COLORS = {
  crypto: "#F0B90B",
  forex: "#3b82f6",
  stocks: "#0ECB81",
  exp: "#a855f7",
};

export default function Portfolio() {
  const { data: portfolio, isLoading: loadingPortfolio } = useGetPortfolio();
  const { data: treasury, isLoading: loadingTreasury } = useGetTreasury();
  const updatePortfolio = useUpdatePortfolio();
  const updateTreasury = useUpdateTreasurySettings();
  const { toast } = useToast();

  const [allocations, setAllocations] = useState({ crypto: 40, forex: 20, stocks: 30, exp: 10 });
  const [dist, setDist] = useState({ reinvest: 40, reserve: 20, withdrawable: 40 });
  const [compounding, setCompounding] = useState({ mode: "Balanced", rate: 50 });

  useEffect(() => {
    if (portfolio) setAllocations({ crypto: portfolio.cryptoPercent, forex: portfolio.forexPercent, stocks: portfolio.stocksPercent, exp: portfolio.experimentalPercent });
  }, [portfolio]);
  useEffect(() => {
    if (treasury) {
      setDist({ reinvest: treasury.reinvestPercent, reserve: treasury.reservePercent, withdrawable: treasury.withdrawablePercent });
      setCompounding({ mode: treasury.compoundingMode, rate: treasury.compoundingRate });
    }
  }, [treasury]);

  const total = allocations.crypto + allocations.forex + allocations.stocks + allocations.exp;
  const distTotal = dist.reinvest + dist.reserve + dist.withdrawable;

  if (loadingPortfolio || loadingTreasury) return (
    <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Configure AI capital allocation</p>
      </div>

      {/* Visual Allocation Bar */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Asset Allocation</h2>
          <span className={`ml-auto text-xs font-bold ${total === 100 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>{total}%</span>
        </div>

        {/* Color bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {[
            { key: "crypto", label: "Crypto", val: allocations.crypto },
            { key: "forex", label: "Forex", val: allocations.forex },
            { key: "stocks", label: "Stocks", val: allocations.stocks },
            { key: "exp", label: "AI Exp", val: allocations.exp },
          ].map(({ key, val }) => (
            <div key={key} style={{ width: `${val}%`, backgroundColor: ALLOCATION_COLORS[key as keyof typeof ALLOCATION_COLORS] }} />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { key: "crypto", label: "Crypto" },
            { key: "forex", label: "Forex" },
            { key: "stocks", label: "Stocks" },
            { key: "exp", label: "AI Experimental" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ALLOCATION_COLORS[key as keyof typeof ALLOCATION_COLORS] }} />
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="ml-auto text-xs font-bold">{allocations[key as keyof typeof allocations]}%</span>
            </div>
          ))}
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {[
            { key: "crypto" as const, label: "Cryptocurrency" },
            { key: "forex" as const, label: "Forex" },
            { key: "stocks" as const, label: "Equities / Stocks" },
            { key: "exp" as const, label: "AI Experimental" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium" style={{ color: ALLOCATION_COLORS[key] }}>{label}</span>
                <span className="text-muted-foreground">{allocations[key]}%</span>
              </div>
              <Slider
                value={[allocations[key]]}
                max={100} step={1}
                onValueChange={v => setAllocations(p => ({ ...p, [key]: v[0] }))}
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-4 rounded-xl h-11 font-bold"
          disabled={total !== 100 || updatePortfolio.isPending}
          onClick={() => updatePortfolio.mutate({ data: { cryptoPercent: allocations.crypto, forexPercent: allocations.forex, stocksPercent: allocations.stocks, experimentalPercent: allocations.exp } }, {
            onSuccess: () => toast({ title: "✅ Allocation Saved" })
          })}
        >
          {total !== 100 ? `Total must be 100% (currently ${total}%)` : "Save Allocation"}
        </Button>
      </div>

      {/* Profit Distribution */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
          <h2 className="text-sm font-semibold">Profit Distribution</h2>
          <span className={`ml-auto text-xs font-bold ${distTotal === 100 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>{distTotal}%</span>
        </div>

        <div className="space-y-4">
          {[
            { key: "reinvest" as const, label: "Auto-Reinvest", color: "#0ECB81" },
            { key: "reserve" as const, label: "Emergency Reserve", color: "#F6465D" },
            { key: "withdrawable" as const, label: "Withdrawable", color: "#3b82f6" },
          ].map(({ key, label, color }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium" style={{ color }}>{label}</span>
                <span className="text-muted-foreground">{dist[key]}%</span>
              </div>
              <Slider value={[dist[key]]} max={100} step={1} onValueChange={v => setDist(p => ({ ...p, [key]: v[0] }))} />
            </div>
          ))}
        </div>

        {/* Compounding mode */}
        <div className="mt-5 pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Compounding Mode</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Conservative", "Balanced", "Aggressive"].map(mode => (
              <button
                key={mode}
                onClick={() => setCompounding(p => ({ ...p, mode }))}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${
                  compounding.mode === mode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-4 rounded-xl h-11 font-bold"
          disabled={distTotal !== 100 || updateTreasury.isPending}
          onClick={() => updateTreasury.mutate({ data: { reinvestPercent: dist.reinvest, reservePercent: dist.reserve, withdrawablePercent: dist.withdrawable, compoundingMode: compounding.mode, compoundingRate: compounding.rate } }, {
            onSuccess: () => toast({ title: "✅ Distribution Saved" })
          })}
        >
          {distTotal !== 100 ? `Total must be 100% (currently ${distTotal}%)` : "Save Distribution"}
        </Button>
      </div>

      {/* Capital Protection */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-[#0ECB81]" />
          <h2 className="text-sm font-semibold">Capital Protection</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Safety Status", value: "Secure", color: "#0ECB81" },
            { label: "Risk Score", value: "3.4 / 10", color: "#F0B90B" },
            { label: "Daily Loss Limit", value: "-$2,500", color: "#F6465D" },
            { label: "Current Exposure", value: "14.2%", color: "#3b82f6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-muted/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
