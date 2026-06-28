import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Wallet, 
  Activity, 
  ArrowRightLeft, 
  BarChart2, 
  PieChart, 
  Vault, 
  Target, 
  TrendingUp, 
  Users, 
  Headset, 
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";
import { useGetMe, useLogout } from "@workspace/api-client-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("avernox_token");
        setLocation("/login");
      }
    });
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/deposit", label: "Deposit", icon: Wallet },
    { href: "/invest", label: "Live AI Engine", icon: Activity },
    { href: "/withdraw", label: "Withdraw", icon: ArrowRightLeft },
    { href: "/market", label: "Market Data", icon: BarChart2 },
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/treasury", label: "Treasury", icon: Vault },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/referral", label: "Referrals", icon: Users },
    { href: "/support", label: "Support", icon: Headset },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full bg-background dark text-foreground font-mono">
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="font-sans font-bold text-xl text-primary tracking-tighter">AverNoxTrader</div>
          {user && <div className="mt-2 text-xs text-muted-foreground uppercase tracking-widest">ID: {user.username}</div>}
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === item.href ? 'bg-primary text-primary-foreground font-semibold' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}