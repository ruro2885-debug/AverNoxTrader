import { useState } from "react";
import { useCreateDeposit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle2, Send, Shield, ExternalLink } from "lucide-react";

const BTC_ADDRESS = "bc1qkaw6jwev9mj65ywmy8h4rtjhdea3epvh08st03";
const ETH_ADDRESS = "0x8372A7eAde07B979333866544696aBbc6e49DF36";

type Crypto = "BTC" | "ETH";

export default function Deposit() {
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>("BTC");
  const [amount, setAmount] = useState("");
  const [txCode, setTxCode] = useState("");
  const [copied, setCopied] = useState(false);
  const createDeposit = useCreateDeposit();
  const { toast } = useToast();

  const address = selectedCrypto === "BTC" ? BTC_ADDRESS : ETH_ADDRESS;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeposit.mutate({ data: { amount: Number(amount), transactionCode: txCode } }, {
      onSuccess: () => {
        toast({ title: "✅ Deposit Submitted", description: "Your deposit is being verified. Balance will update shortly." });
        setAmount("");
        setTxCode("");
      },
      onError: () => {
        toast({ title: "Invalid Code", description: "Transaction code is invalid or on cooldown.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Deposit</h1>
        <p className="text-sm text-muted-foreground">Fund your account with crypto</p>
      </div>

      {/* How it Works */}
      <div className="bg-[#1a2c4a]/60 border border-[#1a56db]/30 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">How to deposit:</h3>
        <div className="space-y-2">
          {[
            "Send crypto to the address below",
            "Message @AverNoxTraderbot on Telegram",
            "Receive your unique Transaction Code",
            "Enter code below to credit your account",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-[#EAECEF]">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto Selector */}
      <div>
        <p className="text-sm font-semibold mb-2">Select Network</p>
        <div className="grid grid-cols-2 gap-3">
          {(["BTC", "ETH"] as Crypto[]).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrypto(c)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                selectedCrypto === c
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <img
                src={c === "BTC"
                  ? "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                  : "https://assets.coingecko.com/coins/images/279/small/ethereum.png"}
                alt={c}
                className="w-8 h-8 rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="text-left">
                <p className="font-bold text-sm">{c}</p>
                <p className="text-xs text-muted-foreground">{c === "BTC" ? "Bitcoin" : "Ethereum ERC-20"}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{selectedCrypto} Deposit Address</p>
          <span className="text-xs bg-[#0ECB81]/10 text-[#0ECB81] px-2 py-0.5 rounded-full font-medium">
            {selectedCrypto === "BTC" ? "BTC Network" : "ERC-20"}
          </span>
        </div>

        {/* QR-style visual */}
        <div className="bg-muted/20 border border-border rounded-xl p-4 text-center">
          <div className="w-24 h-24 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
            <div className="grid grid-cols-5 gap-0.5 p-2">
              {Array(25).fill(0).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} style={{ opacity: [0,4,20,24,2,3,10,14,11,13,22,23].includes(i) ? 1 : Math.random() > 0.4 ? 1 : 0 }} />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Scan QR or copy address below</p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2.5">
            <p className="font-mono text-xs text-[#EAECEF] break-all">{address}</p>
          </div>
          <button
            onClick={copyAddress}
            className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
              copied ? "bg-[#0ECB81]/20 border-[#0ECB81]/40" : "bg-card border-border hover:border-primary/40"
            }`}
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-[#0ECB81]" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>

        <div className="flex items-start gap-2 bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-xl p-3">
          <Shield className="h-4 w-4 text-[#F0B90B] shrink-0 mt-0.5" />
          <p className="text-xs text-[#EAECEF]">
            Only send <strong>{selectedCrypto}</strong> to this address. Sending other assets will result in permanent loss.
          </p>
        </div>
      </div>

      {/* Telegram CTA */}
      <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer">
        <div className="flex items-center justify-between bg-[#229ed9]/10 border border-[#229ed9]/30 rounded-2xl p-4 hover:bg-[#229ed9]/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#229ed9] flex items-center justify-center">
              <Send className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">@AverNoxTraderbot</p>
              <p className="text-xs text-muted-foreground">Get your Transaction Code here</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-[#229ed9]" />
        </div>
      </a>

      {/* Verify Deposit */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-4">Verify Deposit</h3>
        <form onSubmit={handleDeposit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Amount (USD)</Label>
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="100"
              placeholder="Minimum $100"
              className="h-11 bg-muted/30 border-border rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Transaction Code</Label>
            <Input
              value={txCode}
              onChange={e => setTxCode(e.target.value)}
              required
              placeholder="TXN-XXXXXXXX (from Telegram)"
              className="h-11 bg-muted/30 border-border rounded-xl font-mono"
            />
          </div>
          <Button
            type="submit"
            disabled={createDeposit.isPending}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
          >
            {createDeposit.isPending ? "Verifying..." : "Confirm Deposit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
