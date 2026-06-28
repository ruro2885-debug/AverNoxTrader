import { useGetReferral } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, Share2 } from "lucide-react";

export default function Referral() {
  const { data: referral, isLoading } = useGetReferral();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Share this with your network." });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-sans font-bold">Partner Network</h1>
        <p className="text-muted-foreground">Expand the AverNox ecosystem and earn capital rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <div className="text-sm text-muted-foreground">Total Partners</div>
            <div className="text-3xl font-bold font-mono">{referral?.totalReferrals || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Gift className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-sm text-muted-foreground">Reward Per Partner</div>
            <div className="text-3xl font-bold font-mono text-amber-500">${referral?.referralReward || 15}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Share2 className="h-8 w-8 text-emerald-500 mb-2" />
            <div className="text-sm text-muted-foreground">Total Earned</div>
            <div className="text-3xl font-bold font-mono text-emerald-500">${referral?.totalEarned?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-border">
        <CardHeader>
          <CardTitle>Your Invitation Assets</CardTitle>
          <CardDescription>Share these to register new partners under your ID.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Unique Code</div>
            <div className="flex gap-2">
              <Input readOnly value={referral?.code} className="font-mono bg-black/50 font-bold tracking-widest text-primary" />
              <Button onClick={() => handleCopy(referral?.code || "")} variant="secondary"><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Direct Link</div>
            <div className="flex gap-2">
              <Input readOnly value={referral?.link} className="font-mono text-sm bg-black/50" />
              <Button onClick={() => handleCopy(referral?.link || "")} variant="secondary"><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Reward History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-black/30">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Partner ID</th>
                <th className="text-right p-3">Reward</th>
              </tr>
            </thead>
            <tbody>
              {referral?.history?.map(entry => (
                <tr key={entry.id} className="border-b border-border/50">
                  <td className="p-3">{new Date(entry.joinedAt).toLocaleDateString()}</td>
                  <td className="p-3 font-mono">{entry.username}</td>
                  <td className="p-3 text-right font-mono text-emerald-500">+${entry.reward.toFixed(2)}</td>
                </tr>
              ))}
              {(!referral?.history || referral.history.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-muted-foreground">No partners recruited yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}