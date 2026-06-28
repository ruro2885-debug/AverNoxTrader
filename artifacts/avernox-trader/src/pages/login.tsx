import { useLogin } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [, setLocation] = useLocation();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { username, password } }, {
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
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#0ECB81] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#1a56db] rounded-full blur-3xl" />
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
              AI-Powered<br />Trading Platform
            </h1>
            <p className="text-[#848E9C] text-lg mt-3">
              Automated investments with proven 7-day return cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: TrendingUp, label: "Average Monthly Return", value: "+18.4%" },
              { icon: ShieldCheck, label: "Capital Protection", value: "Active" },
              { icon: Zap, label: "AI Trades Per Day", value: "240+" },
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
        </div>

        <div className="relative z-10 text-xs text-[#848E9C]">
          © 2024 AverNoxTrader. All rights reserved.
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#0ECB81] flex items-center justify-center">
            <span className="text-[#0B0E11] font-black text-sm">AN</span>
          </div>
          <span className="text-white font-bold text-xl">AverNox<span className="text-[#0ECB81]">Trader</span></span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-[#848E9C] text-sm mt-1">Sign in to your trading account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#EAECEF]">Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter username"
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
                  placeholder="Enter password"
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

            {login.isError && (
              <div className="text-sm text-[#F6465D] bg-[#F6465D]/10 border border-[#F6465D]/20 rounded-xl px-4 py-3">
                Invalid username or password.
              </div>
            )}

            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-12 bg-[#0ECB81] hover:bg-[#0ab36e] text-[#0B0E11] font-bold text-base rounded-xl transition-all"
            >
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-[#848E9C]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#0ECB81] font-semibold hover:underline">
              Create Account
            </Link>
          </div>

          <div className="border border-[#2B3139] rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#0ECB81] shrink-0 mt-0.5" />
            <p className="text-xs text-[#848E9C]">
              Your account is protected with military-grade encryption and 2FA compliance monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
