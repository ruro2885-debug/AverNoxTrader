import { useRegister } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Gift, Users, TrendingUp } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [, setLocation] = useLocation();
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ data: { username, password, referralCode: referralCode || undefined } }, {
      onSuccess: (res) => {
        localStorage.setItem("avernox_token", res.token);
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex dark bg-[#0B0E11]">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 bg-gradient-to-br from-[#0d1117] via-[#0f1923] to-[#0B0E11] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#0ECB81] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#F0B90B] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#0ECB81] flex items-center justify-center">
            <span className="text-[#0B0E11] font-black text-sm">AN</span>
          </div>
          <span className="text-white font-bold text-xl">AverNox<span className="text-[#0ECB81]">Trader</span></span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Start Earning<br />in Minutes
            </h1>
            <p className="text-[#848E9C] text-lg mt-3">
              Join thousands of investors already using our AI engine.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: TrendingUp, label: "7-Day Return Cycle", value: "Automated" },
              { icon: Users, label: "Active Investors", value: "12,400+" },
              { icon: Gift, label: "Referral Bonus", value: "$15 / invite" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-[#0ECB81]/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#0ECB81]" />
                </div>
                <div>
                  <div className="text-sm text-[#848E9C]">{label}</div>
                  <div className="text-white font-bold">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-xl p-4">
            <p className="text-[#F0B90B] text-sm font-medium">🎉 New users get priority AI allocation for their first cycle</p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#848E9C]">
          © 2024 AverNoxTrader. All rights reserved.
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#0ECB81] flex items-center justify-center">
            <span className="text-[#0B0E11] font-black text-sm">AN</span>
          </div>
          <span className="text-white font-bold text-xl">AverNox<span className="text-[#0ECB81]">Trader</span></span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-[#848E9C] text-sm mt-1">Start your AI trading journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#EAECEF]">Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                className="h-12 bg-[#1E2329] border-[#2B3139] text-[#EAECEF] placeholder:text-[#848E9C] rounded-xl focus:border-[#0ECB81] focus:ring-[#0ECB81]/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#EAECEF]">Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="h-12 bg-[#1E2329] border-[#2B3139] text-[#EAECEF] placeholder:text-[#848E9C] rounded-xl pr-12 focus:border-[#0ECB81] focus:ring-[#0ECB81]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#848E9C] hover:text-[#EAECEF]"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#EAECEF]">
                Referral Code <span className="text-[#848E9C] font-normal">(Optional)</span>
              </Label>
              <Input
                value={referralCode}
                onChange={e => setReferralCode(e.target.value)}
                placeholder="AVN-XXXXXXXX"
                className="h-12 bg-[#1E2329] border-[#2B3139] text-[#EAECEF] placeholder:text-[#848E9C] rounded-xl font-mono focus:border-[#0ECB81] focus:ring-[#0ECB81]/20"
              />
            </div>

            {register.isError && (
              <div className="text-sm text-[#F6465D] bg-[#F6465D]/10 border border-[#F6465D]/20 rounded-xl px-4 py-3">
                Username may already be taken. Try another.
              </div>
            )}

            <Button
              type="submit"
              disabled={register.isPending}
              className="w-full h-12 bg-[#0ECB81] hover:bg-[#0ab36e] text-[#0B0E11] font-bold text-base rounded-xl transition-all"
            >
              {register.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-[#848E9C]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0ECB81] font-semibold hover:underline">
              Sign In
            </Link>
          </div>

          <p className="text-center text-xs text-[#848E9C]">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
