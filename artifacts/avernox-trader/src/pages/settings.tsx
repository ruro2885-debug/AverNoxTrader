import { useState, useEffect } from "react";
import { useGetUserSettings, useUpdateUserSettings, useChangePassword, useGetMe, useLogout } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Activity, ShieldAlert, Cpu, Briefcase, Bell, User, LogOut, Settings2 } from "lucide-react";

export default function Settings() {
  const { data: me } = useGetMe();
  const { data: settings, isLoading } = useGetUserSettings();
  const updateSettings = useUpdateUserSettings();
  const changePassword = useChangePassword();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [localSettings, setLocalSettings] = useState<any>({});
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleUpdate = (key: string, value: any) => {
    const next = { ...localSettings, [key]: value };
    setLocalSettings(next);
    // Auto save
    updateSettings.mutate({ data: { [key]: value } });
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword.mutate({ data: { oldPassword: oldPw, newPassword: newPw } }, {
      onSuccess: () => {
        toast({ title: "Security Updated", description: "Password changed successfully." });
        setOldPw(""); setNewPw("");
      },
      onError: () => {
        toast({ title: "Failed to change password", description: "Verify your old password.", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-sans font-bold flex items-center gap-3">
          <Settings2 className="h-8 w-8" /> System Configuration
        </h1>
        <p className="text-muted-foreground">Adjust Neural Engine parameters and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* System Indicators */}
        <Card className="col-span-1 md:col-span-4 bg-black/60 border-primary/20">
          <CardContent className="p-4 flex flex-wrap justify-between gap-4 text-sm">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/> Engine: <span className="font-mono text-emerald-500">Active</span></div>
            <div className="flex items-center gap-2">Market: <span className="font-mono">Normal</span></div>
            <div className="flex items-center gap-2">AI Confidence: <span className="font-mono text-primary">Moderate</span></div>
            <div className="flex items-center gap-2">Exposure: <span className="font-mono">Live</span></div>
            <div className="flex items-center gap-2 text-muted-foreground">Last Analysis: Real-time</div>
          </CardContent>
        </Card>

        {/* Left Column: AI & Trading */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Cpu className="h-5 w-5 text-primary" /> AI Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Confluence Strength</Label><span className="font-mono text-xs">{localSettings.confluenceStrength}/5</span></div>
                <Slider max={5} min={2} step={1} value={[localSettings.confluenceStrength || 3]} onValueChange={v => handleUpdate('confluenceStrength', v[0])} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Market Scanner</Label>
                <Switch checked={localSettings.marketScanner} onCheckedChange={v => handleUpdate('marketScanner', v)} />
              </div>
              <div className="space-y-2">
                <Label>AI Adaptation</Label>
                <Select value={localSettings.aiAdaptation} onValueChange={v => handleUpdate('aiAdaptation', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Dynamic">Dynamic</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Signal Quality</Label>
                <Select value={localSettings.signalQuality} onValueChange={v => handleUpdate('signalQuality', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Strict">Strict</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Activity className="h-5 w-5 text-emerald-500" /> Trading Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label>Style</Label>
                <Select value={localSettings.tradingStyle} onValueChange={v => handleUpdate('tradingStyle', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Conservative">Conservative</SelectItem><SelectItem value="Balanced">Balanced</SelectItem><SelectItem value="Growth">Growth</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Execution Mode</Label>
                <Select value={localSettings.executionMode} onValueChange={v => handleUpdate('executionMode', v)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Assisted">Assisted</SelectItem><SelectItem value="Automated">Automated</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Max Active Positions</Label><span className="font-mono text-xs">{localSettings.maxActivePositions}</span></div>
                <Slider max={5} min={1} step={1} value={[localSettings.maxActivePositions || 3]} onValueChange={v => handleUpdate('maxActivePositions', v[0])} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Smart Entry</Label>
                <Switch checked={localSettings.smartEntry} onCheckedChange={v => handleUpdate('smartEntry', v)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Risk & Account */}
        <div className="md:col-span-2 space-y-6">
           <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><ShieldAlert className="h-5 w-5 text-rose-500" /> Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between"><Label>Risk Level</Label><span className="font-mono text-xs">{localSettings.riskLevel}/10</span></div>
                <Slider max={10} min={1} step={1} value={[localSettings.riskLevel || 5]} onValueChange={v => handleUpdate('riskLevel', v[0])} />
              </div>
               <div className="space-y-3">
                <div className="flex justify-between"><Label>Capital Exposure Limit</Label><span className="font-mono text-xs">{localSettings.capitalExposureLimit}%</span></div>
                <Slider max={40} min={10} step={1} value={[localSettings.capitalExposureLimit || 20]} onValueChange={v => handleUpdate('capitalExposureLimit', v[0])} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Stop Loss Protection</Label>
                <Switch checked={localSettings.stopLossProtection} onCheckedChange={v => handleUpdate('stopLossProtection', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Profit Lock (Trailing)</Label>
                <Switch checked={localSettings.profitLock} onCheckedChange={v => handleUpdate('profitLock', v)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-amber-500" /> Account Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Client ID (Username)</Label>
                <Input readOnly value={me?.username || ""} className="bg-black/50 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <div className="font-mono text-emerald-500 text-sm">{me?.accountStatus || "VERIFIED"}</div>
              </div>
              
              <Separator className="my-4" />
              
              <form onSubmit={handlePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Security Key</Label>
                  <Input type="password" placeholder="Current Password" value={oldPw} onChange={e => setOldPw(e.target.value)} required />
                  <Input type="password" placeholder="New Password" value={newPw} onChange={e => setNewPw(e.target.value)} required />
                </div>
                <Button type="submit" variant="secondary" size="sm" disabled={changePassword.isPending}>Update Password</Button>
              </form>

              <Separator className="my-4" />

              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full justify-start border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                  <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer">Report a Problem @AverAssistancebot</a>
                </Button>
                <Button variant="destructive" className="w-full justify-start" onClick={() => logout.mutate(undefined, { onSuccess: () => { localStorage.removeItem("avernox_token"); setLocation("/login"); } })}>
                  <LogOut className="mr-2 h-4 w-4" /> Terminate Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}