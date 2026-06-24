import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, Package, BarChart3, Building2, Settings, Bell, Search, LogOut, Pill, ChevronDown,
  FileBarChart2, Truck, Boxes, Upload, FlaskConical, Store,
} from "lucide-react";
import { logout, setRole, useUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  adminOnly?: boolean;
  agencyOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/produits", label: "Produits", icon: Boxes },
  { to: "/stocks", label: "Stocks", icon: Package },
  { to: "/fournisseurs", label: "Stocks fournisseurs", icon: Truck },
  { to: "/grossistes", label: "Fournisseurs", icon: Store, adminOnly: true },
  { to: "/laboratoires", label: "Laboratoires", icon: FlaskConical, adminOnly: true },
  { to: "/rapports", label: "Rapports", icon: FileBarChart2, adminOnly: true },
  { to: "/stats", label: "Statistiques", icon: BarChart3 },
  { to: "/agences", label: "Agences", icon: Building2, adminOnly: true },
  { to: "/import", label: "Import / Export", icon: Upload, agencyOnly: true },
  { to: "/parametres", label: "Paramètres", icon: Settings },
];

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const user = useUser();
  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">

        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Pill className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight tracking-tight">DATA<span className="text-primary">FUSE</span></div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ANF Cloud</div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {NAV.filter(n => {
            if (n.adminOnly && user?.role !== "admin") return false;
            if (n.agencyOnly && user?.role !== "pharmacy") return false;
            return true;
          }).map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as never}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-card text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => { logout(); navigate({ to: "/login" }); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Rechercher un produit, une agence, un pays…</span>
              <kbd className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Role switch */}
              <div className="hidden sm:flex items-center rounded-xl border border-border bg-surface p-1 text-xs font-medium">
                <button
                  onClick={() => setRole("pharmacy")}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    user?.role === "pharmacy" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Agence
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    user?.role === "admin" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Super-Admin
                </button>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 hover:bg-card">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium leading-tight">{user?.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{user?.pharmacyName}</div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}>
                    <Settings className="mr-2 h-4 w-4" /> Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/login" }); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="px-6 py-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
              <div className="min-w-0">
                {subtitle && <div className="text-xs font-medium uppercase tracking-wider text-primary">{subtitle}</div>}
                <h1 className="mt-1 truncate font-display text-4xl text-foreground sm:text-5xl">{title}</h1>
              </div>
              {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "bg-destructive/10", text: "text-destructive", label: "Critique" },
    low: { bg: "bg-warning/15", text: "text-warning-foreground", label: "Faible" },
    ok: { bg: "bg-primary/12", text: "text-primary", label: "OK" },
    rupture: { bg: "bg-destructive/15", text: "text-destructive", label: "Rupture" },
    completed: { bg: "bg-primary/12", text: "text-primary", label: "Terminé" },
    processing: { bg: "bg-accent", text: "text-accent-foreground", label: "En cours" },
    active: { bg: "bg-primary/12", text: "text-primary", label: "Actif" },
    warning: { bg: "bg-warning/15", text: "text-warning-foreground", label: "Attention" },
    inactive: { bg: "bg-muted", text: "text-muted-foreground", label: "Inactif" },
    blocked: { bg: "bg-destructive/15", text: "text-destructive", label: "Bloqué" },
  };
  const v = map[status] ?? map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${v.bg} ${v.text}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {v.label}
    </span>
  );
}
