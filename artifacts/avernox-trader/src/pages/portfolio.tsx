import { useState, useEffect } from "react";
import { useGetPortfolio, useUpdatePortfolio, useGetTreasury, useUpdateTreasurySettings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, PieChart, TrendingUp, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Portfolio() {
  const { data: portfolio, isLoading: loadingPortfolio } = useGetPortfolio();
  const { data: treasury, isLoading: loadingTreasury } = useGetTreasury();
  const updatePortfolio = useUpdatePortfolio();
  const updateTreasury = useUpdateTreasurySettings();
  const { toast } = useToast();

  const [allocations, setAllocations] = useState({ crypto: 0, forex: 0, stocks: 0, exp: 0 });
  const [dist, setDist] = useState({ reinvest: 0, reserve: 0, withdrawable: 0 });
  const [compounding, setCompounding] = useState({ mode: 'Balanced', rate: 50 });

  useEffect(() => {
    if (portfolio) {
      setAllocations({
        crypto: portfolio.cryptoPercent,
        forex: portfolio.forexPercent,
        stocks: portfolio.stocksPercent,
        exp: portfolio.experimentalPercent
      });
    }
  }, [portfolio]);

  useEffect(() => {
    if (treasury) {
      setDist({
        reinvest: treasury.reinvestPercent,
        reserve: treasury.reservePercent,
        withdrawable: treasury.withdrawablePercent
      });
      setCompounding({
        mode: treasury.compoundingMode,
        rate: treasury.compoundingRate
      });
    }
  }, [treasury]);

  const handleSavePortfolio = () => {
    const total = allocations.crypto + allocations.forex + allocations.stocks + allocations.exp;
    if (total !== 100) {
      toast({ title: "Invalid Allocation", description: "Total allocation must equal 100%", variant: "destructive" });
      return;
    }
    updatePortfolio.mutate({ data: {
      cryptoPercent: allocations.crypto,
      forexPercent: allocations.forex,
      stocksPercent: allocations.stocks,
      experimentalPercent: allocations.exp
    }}, {
      onSuccess: () => toast({ title: "Portfolio Updated", description: "Asset allocation algorithm synced." })
    });
  };

  const handleSaveTreasury = () => {
    const total = dist.reinvest + dist.reserve + dist.withdrawable;
    if (total !== 100) {
      toast({ title: "Invalid Distribution", description: "Total distribution must equal 100%", variant: "destructive" });
      return;
    }
    updateTreasury.mutate({ data: {
      reinvestPercent: dist.reinvest,
      reservePercent: dist.reserve,
      withdrawablePercent: dist.withdrawable,
      compoundingMode: compounding.mode,
      compoundingRate: compounding.rate
    }}, {
      onSuccess: () => toast({ title: "Treasury Updated", description: "Profit distribution parameters synced." })
    });
  };

  if (loadingPortfolio || loadingTreasury) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold">Portfolio Architecture</h1>
        <p className="text-muted-foreground">Configure AI capital allocation and risk parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Asset Allocation</CardTitle>
            </div>
            <CardDescription>Target distribution across market sectors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Cryptocurrency</Label>
                  <span className="font-mono text-sm">{allocations.crypto}%</span>
                </div>
                <Slider 
                  value={[allocations.crypto]} 
                  max={100} step={1} 
                  onValueChange={v => setAllocations(p => ({...p, crypto: v[0]}))} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Forex</Label>
                  <span className="font-mono text-sm">{allocations.forex}%</span>
                </div>
                <Slider 
                  value={[allocations.forex]} 
                  max={100} step={1} 
                  onValueChange={v => setAllocations(p => ({...p, forex: v[0]}))} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Equities/Stocks</Label>
                  <span className="font-mono text-sm">{allocations.stocks}%</span>
                </div>
                <Slider 
                  value={[allocations.stocks]} 
                  max={100} step={1} 
                  onValueChange={v => setAllocations(p => ({...p, stocks: v[0]}))} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-primary">Experimental AI Funds</Label>
                  <span className="font-mono text-sm text-primary">{allocations.exp}%</span>
                </div>
                <Slider 
                  value={[allocations.exp]} 
                  max={100} step={1} 
                  onValueChange={v => setAllocations(p => ({...p, exp: v[0]}))} 
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="text-sm">
                Total: <span className={`font-mono font-bold ${allocations.crypto + allocations.forex + allocations.stocks + allocations.exp !== 100 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {allocations.crypto + allocations.forex + allocations.stocks + allocations.exp}%
                </span>
              </div>
              <Button onClick={handleSavePortfolio} disabled={updatePortfolio.isPending}>
                Commit Allocation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <CardTitle>Profit Distribution</CardTitle>
            </div>
            <CardDescription>How generated profits are routed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
             <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Auto-Reinvest (Compounding)</Label>
                  <span className="font-mono text-sm">{dist.reinvest}%</span>
                </div>
                <Slider 
                  value={[dist.reinvest]} 
                  max={100} step={1} 
                  onValueChange={v => setDist(p => ({...p, reinvest: v[0]}))} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Emergency Reserve</Label>
                  <span className="font-mono text-sm">{dist.reserve}%</span>
                </div>
                <Slider 
                  value={[dist.reserve]} 
                  max={100} step={1} 
                  onValueChange={v => setDist(p => ({...p, reserve: v[0]}))} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Withdrawable Balance</Label>
                  <span className="font-mono text-sm">{dist.withdrawable}%</span>
                </div>
                <Slider 
                  value={[dist.withdrawable]} 
                  max={100} step={1} 
                  onValueChange={v => setDist(p => ({...p, withdrawable: v[0]}))} 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Compounding Engine</h3>
              <div className="flex gap-2">
                {['Conservative', 'Balanced', 'Aggressive'].map(mode => (
                  <Button 
                    key={mode} 
                    variant={compounding.mode === mode ? 'default' : 'outline'} 
                    className="flex-1 text-xs h-8"
                    onClick={() => setCompounding(p => ({...p, mode}))}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={handleSaveTreasury} disabled={updateTreasury.isPending}>
                Update Treasury
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <CardTitle>Capital Protection Layer</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-black/60 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground uppercase mb-1">Safety Status</div>
              <div className="text-lg font-semibold text-emerald-500">Secure</div>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground uppercase mb-1">Risk Score</div>
              <div className="text-lg font-semibold font-mono text-amber-500">3.4 / 10</div>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground uppercase mb-1">Daily Loss Limit</div>
              <div className="text-lg font-semibold font-mono">-$2,500.00</div>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border border-border">
              <div className="text-xs text-muted-foreground uppercase mb-1">Current Exposure</div>
              <div className="text-lg font-semibold font-mono">14.2%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}