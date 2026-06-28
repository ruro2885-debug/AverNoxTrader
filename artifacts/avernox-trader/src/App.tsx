import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useEffect } from "react";

import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Deposit from "@/pages/deposit";
import Invest from "@/pages/invest";
import Withdraw from "@/pages/withdraw";
import Market from "@/pages/market";
import Portfolio from "@/pages/portfolio";
import Treasury from "@/pages/treasury";
import Goals from "@/pages/goals";
import Analytics from "@/pages/analytics";
import Referral from "@/pages/referral";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import { Layout } from "@/components/layout";

setAuthTokenGetter(() => localStorage.getItem("avernox_token"));

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: any }) {
  const [location, setLocation] = useLocation();
  const token = localStorage.getItem("avernox_token");
  
  useEffect(() => {
    if (!token) {
      setLocation("/login");
    }
  }, [token, setLocation]);

  if (!token) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route path="/deposit" component={() => <ProtectedRoute component={Deposit} />} />
            <Route path="/invest" component={() => <ProtectedRoute component={Invest} />} />
            <Route path="/withdraw" component={() => <ProtectedRoute component={Withdraw} />} />
            <Route path="/market" component={() => <ProtectedRoute component={Market} />} />
            <Route path="/portfolio" component={() => <ProtectedRoute component={Portfolio} />} />
            <Route path="/treasury" component={() => <ProtectedRoute component={Treasury} />} />
            <Route path="/goals" component={() => <ProtectedRoute component={Goals} />} />
            <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
            <Route path="/referral" component={() => <ProtectedRoute component={Referral} />} />
            <Route path="/support" component={() => <ProtectedRoute component={Support} />} />
            <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;