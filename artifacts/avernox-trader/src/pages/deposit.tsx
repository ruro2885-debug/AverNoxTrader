import { useState } from "react";
import { useCreateDeposit } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [txCode, setTxCode] = useState("");
  const createDeposit = useCreateDeposit();
  const { toast } = useToast();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeposit.mutate({ data: { amount: Number(amount), transactionCode: txCode } }, {
      onSuccess: () => {
        toast({ title: "Deposit Submitted", description: "Your deposit is being verified." });
        setAmount("");
        setTxCode("");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Address copied to clipboard." });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-sans font-bold">Capital Injection</h1>
        <p className="text-muted-foreground">Fund your account to engage the AI engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Transfer Instructions</CardTitle>
            <CardDescription>Send funds to one of the addresses below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Bitcoin (BTC) Network</Label>
              <div className="flex gap-2">
                <Input readOnly value="bc1qkaw6jwev9mj65ywmy8h4rtjhdea3epvh08st03" className="font-mono text-xs bg-black/50" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("bc1qkaw6jwev9mj65ywmy8h4rtjhdea3epvh08st03")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Ethereum (ERC20) Network</Label>
              <div className="flex gap-2">
                <Input readOnly value="0x8372A7eAde07B979333866544696aBbc6e49DF36" className="font-mono text-xs bg-black/50" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("0x8372A7eAde07B979333866544696aBbc6e49DF36")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-md text-sm">
              After transfer, contact <a href="https://t.me/AverNoxTraderbot" target="_blank" rel="noreferrer" className="text-primary hover:underline">@AverNoxTraderbot</a> on Telegram to receive your Transaction Code.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Verify Deposit</CardTitle>
            <CardDescription>Enter details to credit your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="100" placeholder="1000" className="font-mono bg-black/50" />
              </div>
              <div className="space-y-2">
                <Label>Transaction Code</Label>
                <Input value={txCode} onChange={e => setTxCode(e.target.value)} required placeholder="AVX-..." className="font-mono bg-black/50" />
              </div>
              <Button type="submit" className="w-full" disabled={createDeposit.isPending}>
                {createDeposit.isPending ? "Verifying..." : "Confirm Deposit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}