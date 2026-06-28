import { useState } from "react";
import { useGetSupportIssues, useSubmitSupportRequest } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ExternalLink, HelpCircle, ChevronRight, CheckCircle2, Send } from "lucide-react";

export default function Support() {
  const { data: issues, isLoading } = useGetSupportIssues();
  const submitRequest = useSubmitSupportRequest();
  const { toast } = useToast();
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [resolvedIds, setResolvedIds] = useState<number[]>([]);

  const handleSubmit = (id: number) => {
    setSubmittingId(id);
    submitRequest.mutate({ data: { issueId: id } }, {
      onSuccess: () => {
        toast({ title: "✅ Request Submitted", description: "Our team will resolve this shortly." });
        setResolvedIds(p => [...p, id]);
        setSubmittingId(null);
      },
      onError: () => setSubmittingId(null)
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-sm text-muted-foreground">Priority assistance for AverNox users</p>
      </div>

      {/* Direct Telegram CTA */}
      <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer">
        <div className="bg-gradient-to-r from-[#229ed9]/15 to-[#1a7ab5]/10 border border-[#229ed9]/30 rounded-2xl p-4 flex items-center justify-between hover:border-[#229ed9]/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#229ed9] flex items-center justify-center shrink-0">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Live Support via Telegram</p>
              <p className="text-xs text-muted-foreground">@AverAssistancebot — Fastest response</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-[#229ed9]" />
        </div>
      </a>

      {/* Response Times */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Telegram", time: "< 5 min", color: "#0ECB81" },
          { label: "Email", time: "< 24 hr", color: "#F0B90B" },
          { label: "Resolution", time: "< 48 hr", color: "#3b82f6" },
        ].map(({ label, time, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-bold" style={{ color }}>{time}</p>
          </div>
        ))}
      </div>

      {/* Common Issues */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Common Issues</h2>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : (
          <div className="divide-y divide-border/40">
            {issues?.map(issue => {
              const resolved = resolvedIds.includes(issue.id);
              return (
                <div key={issue.id} className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${resolved ? "bg-[#0ECB81]/15" : "bg-muted/40"}`}>
                      {resolved
                        ? <CheckCircle2 className="h-4 w-4 text-[#0ECB81]" />
                        : <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.category}</p>
                    </div>
                  </div>
                  {resolved ? (
                    <span className="text-xs text-[#0ECB81] font-semibold">Submitted ✓</span>
                  ) : (
                    <button
                      disabled={submittingId === issue.id}
                      onClick={() => handleSubmit(issue.id)}
                      className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      {submittingId === issue.id ? "Submitting..." : <>Report <ChevronRight className="h-3 w-3" /></>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Frequently Asked Questions</h2>
        </div>
        {[
          { q: "How does the 7-day AI cycle work?", a: "Our AI trades for 7 consecutive days, compounding profits daily before settling returns." },
          { q: "When will my deposit appear?", a: "After sending crypto and submitting your transaction code, balances update within 1-3 hours." },
          { q: "Why was my withdrawal reversed?", a: "Security systems flag cold wallets and unusual patterns. Contact @AverAssistancebot for resolution." },
          { q: "How do I earn from referrals?", a: "Share your unique code. When a referred user registers and deposits, $15 is credited to your account." },
        ].map(({ q, a }, i) => (
          <details key={i} className="group border-b border-border/40 last:border-0">
            <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none hover:bg-muted/20 transition-colors">
              <span className="text-sm font-medium pr-4">{q}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
