import { useGetMe, useGetBalance, useLogout } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import {
  PieChart, TrendingUp, Users, Vault, Target, BarChart2,
  Headset, Settings, LogOut, ChevronRight, Shield, Bell, Star
} from "lucide-react";

const MENU_SECTIONS = [
  {
    title: "Portfolio",
    items: [
      { href: "/portfolio", icon: PieChart, label: "Portfolio & Allocation", sub: "Manage AI asset split", color: "#F0B90B" },
      { href: "/treasury", icon: Vault, label: "Treasury", sub: "Capital distribution", color: "#3b82f6" },
      { href: "/analytics", icon: BarChart2, label: "Analytics", sub: "Performance insights", color: "#0ECB81" },
    ],
  },
  {
    title: "Grow",
    items: [
      { href: "/goals", icon: Target, label: "Goals", sub: "Set financial targets", color: "#a855f7" },
      { href: "/referral", icon: Users, label: "Referrals", sub: "Earn $15 per invite", color: "#f59e0b" },
    ],
  },
  {
    title: "Support & Settings",
    items: [
      { href: "/support", icon: Headset, label: "Help & Support", sub: "Get assistance", color: "#229ed9" },
      { href: "/settings", icon: Settings, label: "Settings", sub: "Account & AI config", color: "#848E9C" },
    ],
  },
];

export default function Account() {
  const { data: me } = useGetMe();
  const { data: balance } = useGetBalance();
  const logout = useLogout();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-sm text-muted-foreground">Manage your trading profile</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#059669] flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-black text-xl uppercase">
              {me?.username?.slice(0, 2) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold capitalize">{me?.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="h-3.5 w-3.5 text-[#0ECB81]" />
              <span className="text-xs text-[#0ECB81] font-semibold">{me?.accountStatus || "Verified"}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Portfolio</p>
            <p className="text-lg font-black text-primary">${balance?.total?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-3 text-center">
          <TrendingUp className="h-5 w-5 text-[#0ECB81] mx-auto mb-1" />
          <p className="text-base font-bold text-[#0ECB81]">+${balance?.historicalProfit?.toFixed(0) || "0"}</p>
          <p className="text-xs text-muted-foreground">Total Profit</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3 text-center">
          <Vault className="h-5 w-5 text-[#3b82f6] mx-auto mb-1" />
          <p className="text-base font-bold">${balance?.withdrawableBalance?.toFixed(0) || "0"}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-3 text-center">
          <Star className="h-5 w-5 text-[#F0B90B] mx-auto mb-1" />
          <p className="text-base font-bold">Pro</p>
          <p className="text-xs text-muted-foreground">Account</p>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="flex items-center gap-3 bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-2xl p-3">
        <Bell className="h-5 w-5 text-[#F0B90B] shrink-0" />
        <p className="text-xs text-[#EAECEF]">AI Engine is actively trading. Check the Trade tab for live updates.</p>
      </div>

      {/* Menu Sections */}
      {MENU_SECTIONS.map(({ title, items }) => (
        <div key={title} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          </div>
          <div className="divide-y divide-border/40">
            {items.map(({ href, icon: Icon, label, sub, color }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="h-4.5 w-4.5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button
        onClick={() => logout.mutate(undefined, {
          onSuccess: () => { localStorage.removeItem("avernox_token"); setLocation("/login"); }
        })}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F6465D]/10 border border-[#F6465D]/20 text-[#F6465D] font-bold text-sm rounded-2xl hover:bg-[#F6465D]/20 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </button>

      <p className="text-center text-xs text-muted-foreground pb-2">AverNoxTrader v2.0 · Secure AI Trading</p>
    </div>
  );
}
