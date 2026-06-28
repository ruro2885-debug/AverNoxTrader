import { useGetReferral } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, Share2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Referral() {
  const { data: referral, isLoading } = useGetReferral();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyText = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
    else { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
    toast({ title: "Copied!", description: "Share it with your friends." });
  };

  if (isLoading) return (
    <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-sm text-muted-foreground">Invite friends and earn $15 per referral</p>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#1a2c4a] to-[#0f1e36] border border-[#1a56db]/30 rounded-2xl p-6 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F0B90B]/10 rounded-full blur-xl" />
        <div className="relative z-10">
          <Gift className="h-10 w-10 text-[#F0B90B] mb-3" />
          <h2 className="text-xl font-bold text-white">Earn $15 Per Friend</h2>
          <p className="text-sm text-[#848E9C] mt-1">Share your code. When they register and deposit, you both benefit.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Users className="h-6 w-6 text-[#3b82f6] mx-auto mb-2" />
          <p className="text-2xl font-bold">{referral?.totalReferrals || 0}</p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Gift className="h-6 w-6 text-[#F0B90B] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#F0B90B]">${referral?.referralReward || 15}</p>
          <p className="text-xs text-muted-foreground">Per Invite</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Share2 className="h-6 w-6 text-[#0ECB81] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#0ECB81]">${referral?.totalEarned?.toFixed(0) || "0"}</p>
          <p className="text-xs text-muted-foreground">Total Earned</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold">Your Unique Code</h3>
        <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
          <p className="font-mono text-2xl font-black text-primary tracking-widest">{referral?.code}</p>
        </div>
        <button
          onClick={() => copyText(referral?.code || "", "code")}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all ${
            copiedCode ? "bg-[#0ECB81]/10 border-[#0ECB81]/40 text-[#0ECB81]" : "bg-muted/20 border-border hover:border-primary/40"
          }`}
        >
          {copiedCode ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedCode ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* Referral Link */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold">Referral Link</h3>
        <div className="bg-muted/20 border border-border rounded-xl px-3 py-2.5">
          <p className="font-mono text-xs text-muted-foreground break-all">{referral?.link}</p>
        </div>
        <button
          onClick={() => copyText(referral?.link || "", "link")}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all ${
            copiedLink ? "bg-[#0ECB81]/10 border-[#0ECB81]/40 text-[#0ECB81]" : "bg-muted/20 border-border hover:border-primary/40"
          }`}
        >
          {copiedLink ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copiedLink ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* History */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Referral History</h3>
        </div>
        {!referral?.history?.length ? (
          <div className="py-10 text-center">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No referrals yet. Share your code to start earning!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {referral.history.map(entry => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary uppercase">
                    {entry.username.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{entry.username}</p>
                    <p className="text-xs text-muted-foreground">{new Date(entry.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#0ECB81]">+${entry.reward.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
