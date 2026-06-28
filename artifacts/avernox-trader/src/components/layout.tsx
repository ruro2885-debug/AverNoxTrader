import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Wallet,
  User,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useGetMe, useGetBalance } from "@workspace/api-client-react";

const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/market", label: "Markets", icon: TrendingUp },
  { href: "/invest", label: "Trade", icon: Activity },
  { href: "/deposit", label: "Wallet", icon: Wallet },
  { href: "/account", label: "Account", icon: User },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const { data: balance } = useGetBalance();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background dark text-foreground">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[#0d1117] border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xs">AN</span>
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">AverNox<span className="text-primary">Trader</span></span>
        </div>

        <div className="flex items-center gap-3">
          {balance && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Portfolio</span>
              <span className="text-sm font-bold text-primary">${balance.total.toFixed(2)}</span>
            </div>
          )}
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#059669] flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs uppercase">
              {user?.username?.slice(0, 2) || "U"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-5">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0d1117] border-t border-border flex items-stretch">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
              <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>{item.label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-t-full" style={{ position: "relative" }} />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  positive,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && (
        <div className={`text-xs mt-1 font-medium ${positive === true ? "text-[#0ECB81]" : positive === false ? "text-[#F6465D]" : "text-muted-foreground"}`}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function SectionCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export function ListItem({
  icon,
  title,
  subtitle,
  right,
  href,
  onClick,
  showArrow = true,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer">
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {right}
        {showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  if (onClick) return <button className="w-full text-left" onClick={onClick}>{inner}</button>;
  return inner;
}

export const CRYPTO_ICONS: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
};

export const STOCK_COLORS: Record<string, string> = {
  NVDA: "#76b900",
  AAPL: "#555555",
  TSLA: "#cc0000",
  META: "#1877f2",
  MSFT: "#00a4ef",
  GOOGL: "#4285f4",
  AMZN: "#ff9900",
  BABA: "#ff6600",
  INTC: "#0071c5",
};

export function AssetIcon({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const url = CRYPTO_ICONS[symbol];
  const color = STOCK_COLORS[symbol];
  const s = `${size}px`;

  if (url) {
    return (
      <img
        src={url}
        alt={symbol}
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: s, height: s }}
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.style.display = "none";
          (t.nextSibling as HTMLElement)?.removeAttribute("style");
        }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white"
      style={{ width: s, height: s, backgroundColor: color || "#333", fontSize: size * 0.32 }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}
