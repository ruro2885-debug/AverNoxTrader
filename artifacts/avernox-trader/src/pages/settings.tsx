import { useState, useEffect } from "react";
import { useGetUserSettings, useUpdateUserSettings, useChangePassword, useGetMe, useLogout } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, ShieldAlert, Activity, User, LogOut, ExternalLink, Lock } from "lucide-react";

export default function Settings() {
  const { data: me } = useGetMe();
  const { data: settings, isLoading } = useGetUserSettings();
  const updateSettings = useUpdateUserSettings();
  const changePassword = useChangePassword();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [local, setLocal] = useState<any>({});
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  useEffect(() => { if (settings) setLocal(settings); }, [settings]);

  const update = (key: string, value: any) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    updateSettings.mutate({ data: { [key]: value } });
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword.mutate({ data: { oldPassword: oldPw, newPassword: newPw } }, {
      onSuccess: () => { toast({ title: "✅ Password updated" }); setOldPw(""); setNewPw(""); },
      onError: () => toast({ title: "Incorrect current password", variant: "destructive" })
    });
  };

  if (isLoading) return (
    <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
  );

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure AI and account preferences</p>
      </div>

      {/* Status Bar */}
      <div className="bg-card border border-[#0ECB81]/20 rounded-2xl p-3 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" /><span className="text-[#0ECB81] font-semibold">Engine Active</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground">Market: <span className="text-foreground font-medium">Normal</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground">AI Confidence: <span className="text-primary font-medium">Moderate</span></div>
        <div className="flex items-center gap-1.5 text-muted-foreground">Mode: <span className="text-foreground font-medium">Live</span></div>
      </div>

      {/* AI Engine */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Cpu className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Engine</h2>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Confluence Strength</span>
            <span className="text-muted-foreground">{local.confluenceStrength || 3}/5</span>
          </div>
          <Slider max={5} min={2} step={1} value={[local.confluenceStrength || 3]} onValueChange={v => update("confluenceStrength", v[0])} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Market Scanner</p>
            <p className="text-xs text-muted-foreground">Continuous market monitoring</p>
          </div>
          <Switch checked={local.marketScanner} onCheckedChange={v => update("marketScanner", v)} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">AI Adaptation</Label>
          <Select value={local.aiAdaptation} onValueChange={v => update("aiAdaptation", v)}>
            <SelectTrigger className="h-10 bg-muted/30 border-border rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Dynamic">Dynamic</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Signal Quality</Label>
          <Select value={local.signalQuality} onValueChange={v => update("signalQuality", v)}>
            <SelectTrigger className="h-10 bg-muted/30 border-border rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Strict">Strict</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trading */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Activity className="h-4 w-4 text-[#0ECB81]" />
          <h2 className="text-sm font-semibold">Trading Execution</h2>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Trading Style</Label>
          <Select value={local.tradingStyle} onValueChange={v => update("tradingStyle", v)}>
            <SelectTrigger className="h-10 bg-muted/30 border-border rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Conservative">Conservative</SelectItem>
              <SelectItem value="Balanced">Balanced</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Execution Mode</Label>
          <Select value={local.executionMode} onValueChange={v => update("executionMode", v)}>
            <SelectTrigger className="h-10 bg-muted/30 border-border rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Assisted">Assisted</SelectItem><SelectItem value="Automated">Automated</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Max Active Positions</span>
            <span className="text-muted-foreground">{local.maxActivePositions || 3}</span>
          </div>
          <Slider max={5} min={1} step={1} value={[local.maxActivePositions || 3]} onValueChange={v => update("maxActivePositions", v[0])} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Smart Entry</p>
            <p className="text-xs text-muted-foreground">AI-optimized entry timing</p>
          </div>
          <Switch checked={local.smartEntry} onCheckedChange={v => update("smartEntry", v)} />
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <ShieldAlert className="h-4 w-4 text-[#F6465D]" />
          <h2 className="text-sm font-semibold">Risk Management</h2>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Risk Level</span>
            <span className={`font-bold ${(local.riskLevel || 5) <= 3 ? "text-[#0ECB81]" : (local.riskLevel || 5) <= 7 ? "text-[#F0B90B]" : "text-[#F6465D]"}`}>{local.riskLevel || 5}/10</span>
          </div>
          <Slider max={10} min={1} step={1} value={[local.riskLevel || 5]} onValueChange={v => update("riskLevel", v[0])} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Capital Exposure Limit</span>
            <span className="text-muted-foreground">{local.capitalExposureLimit || 20}%</span>
          </div>
          <Slider max={40} min={10} step={1} value={[local.capitalExposureLimit || 20]} onValueChange={v => update("capitalExposureLimit", v[0])} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Stop Loss Protection</p>
            <p className="text-xs text-muted-foreground">Auto-exit at loss threshold</p>
          </div>
          <Switch checked={local.stopLossProtection} onCheckedChange={v => update("stopLossProtection", v)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Profit Lock (Trailing)</p>
            <p className="text-xs text-muted-foreground">Lock gains as price moves up</p>
          </div>
          <Switch checked={local.profitLock} onCheckedChange={v => update("profitLock", v)} />
        </div>
      </div>

      {/* Account */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <User className="h-4 w-4 text-[#F0B90B]" />
          <h2 className="text-sm font-semibold">Account</h2>
        </div>

        <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
          <div>
            <p className="text-xs text-muted-foreground">Username</p>
            <p className="text-sm font-bold">{me?.username}</p>
          </div>
          <span className="text-xs bg-[#0ECB81]/15 text-[#0ECB81] px-2 py-0.5 rounded-full font-semibold">{me?.accountStatus || "Active"}</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Change Password</p>
          </div>
          <form onSubmit={handlePassword} className="space-y-3">
            <Input type="password" placeholder="Current password" value={oldPw} onChange={e => setOldPw(e.target.value)} required className="h-11 bg-muted/30 border-border rounded-xl" />
            <Input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} required className="h-11 bg-muted/30 border-border rounded-xl" />
            <Button type="submit" variant="secondary" className="w-full h-11 rounded-xl font-semibold" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-muted/20 rounded-xl p-3 hover:bg-muted/40 transition-colors">
          <span className="text-sm font-medium">Report a Problem</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>

        <button
          onClick={() => logout.mutate(undefined, { onSuccess: () => { localStorage.removeItem("avernox_token"); setLocation("/login"); } })}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#F6465D]/10 border border-[#F6465D]/20 text-[#F6465D] text-sm font-bold rounded-xl hover:bg-[#F6465D]/20 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
