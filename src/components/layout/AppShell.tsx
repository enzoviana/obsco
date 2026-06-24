import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Package, BarChart3, Building2, Settings, Bell, Search, LogOut, Pill, ChevronDown, ChevronRight,
  FileBarChart2, Boxes, Upload, FlaskConical, Store, Globe2, Users, ShieldCheck, FolderOpen, PackageOpen, Target, Tag,
} from "lucide-react";
import { logout, setRole, useUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

type LeafItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type GroupItem = {
  group: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
  to?: string;
  children: LeafItem[];
};

type NavEntry = (LeafItem & { adminOnly?: boolean; agencyOnly?: boolean }) | GroupItem;

const NAV: NavEntry[] = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  {
    group: "Gestion", icon: FolderOpen, adminOnly: true,
    children: [
      { to: "/laboratoires", label: "Laboratoires", icon: FlaskConical },
      { to: "/produits", label: "Produits", icon: Boxes },
      { to: "/produits-objectifs", label: "Objectifs produits", icon: Target },
      { to: "/produits-tarifs", label: "Tarifs produits", icon: Tag },
      { to: "/pays", label: "Pays", icon: Globe2 },
      { to: "/agences", label: "Agences", icon: Building2 },
      { to: "/grossistes", label: "Grossistes", icon: Store },
    ],
  },
  {
    group: "Sorties Locales", icon: PackageOpen, adminOnly: true, to: "/sorties-locales",
    children: [
      { to: "/sorties-locales", label: "Stocks fournisseurs", icon: Boxes, exact: true },
      { to: "/sorties-locales/vue-panoramique", label: "Vue panoramique", icon: LayoutDashboard },
      { to: "/sorties-locales/objectifs-pays", label: "R1 · Objectifs / Pays", icon: Target },
      { to: "/sorties-locales/objectifs-anf", label: "R2 · Objectifs ANF", icon: Target },
      { to: "/sorties-locales/ventes-un", label: "R3 · Ventes (UN)", icon: BarChart3 },
      { to: "/sorties-locales/ventes-ca", label: "R4 · Ventes (CA)", icon: BarChart3 },
      { to: "/sorties-locales/evolution-un", label: "R5 · Évolution (UN)", icon: BarChart3 },
      { to: "/sorties-locales/evolution-ca", label: "R5bis · Évolution (CA)", icon: BarChart3 },
      { to: "/sorties-locales/stocks-pays", label: "R6 · Stocks / Pays", icon: Package },
      { to: "/sorties-locales/stocks-en-cours", label: "Stocks en cours", icon: Package },
    ],
  },
  { to: "/rapports", label: "Rapports", icon: FileBarChart2, adminOnly: true },
  { to: "/stats", label: "Statistiques", icon: BarChart3 },
  { to: "/stocks", label: "Stocks", icon: Package, agencyOnly: true },
  { to: "/import", label: "Import / Export", icon: Upload, agencyOnly: true },
  {
    group: "Paramètres", icon: Settings,
    children: [
      { to: "/parametres", label: "Général", icon: Settings },
      { to: "/parametres#utilisateurs", label: "Utilisateurs", icon: Users },
      { to: "/parametres#admin", label: "Admin", icon: ShieldCheck },
    ],
  },
];

function isGroup(n: NavEntry): n is GroupItem {
  return (n as GroupItem).group !== undefined;
}

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const user = useUser();
  const loc = useLocation();
  const navigate = useNavigate();

  const filtered = NAV.filter(n => {
    if (isGroup(n)) return !(n.adminOnly && user?.role !== "admin");
    if (n.adminOnly && user?.role !== "admin") return false;
    if (n.agencyOnly && user?.role !== "pharmacy") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Pill className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight tracking-tight">DATA<span className="text-primary">FUSE</span></div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">ANF Cloud</div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {filtered.map((n, idx) => {
            if (isGroup(n)) {
              return <NavGroup key={`g-${idx}-${n.group}`} entry={n} pathname={loc.pathname} />;
            }
            const active = n.exact ? loc.pathname === n.to : loc.pathname === n.to;
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

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Rechercher un produit, une agence, un pays…</span>
              <kbd className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </div>

            <div className="ml-auto flex items-center gap-3">
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

function NavGroup({ entry, pathname }: { entry: GroupItem; pathname: string }) {
  const isChildActive = entry.children.some(c => {
    const base = c.to.split("#")[0];
    return c.exact ? pathname === base : pathname === base || pathname.startsWith(base + "/");
  });
  const selfActive = entry.to ? pathname === entry.to : false;
  const [open, setOpen] = useState(isChildActive || selfActive);
  const Icon = entry.icon;

  const headerClass = `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
    isChildActive || selfActive
      ? "bg-card text-foreground shadow-sm font-medium"
      : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
  }`;

  return (
    <div>
      <div className={headerClass}>
        {entry.to ? (
          <Link to={entry.to as never} className="flex flex-1 items-center gap-3" onClick={() => setOpen(true)}>
            <Icon className="h-4 w-4" />
            <span>{entry.group}</span>
          </Link>
        ) : (
          <button type="button" onClick={() => setOpen(o => !o)} className="flex flex-1 items-center gap-3">
            <Icon className="h-4 w-4" />
            <span>{entry.group}</span>
          </button>
        )}
        <button
          type="button"
          aria-label={open ? "Réduire" : "Développer"}
          onClick={() => setOpen(o => !o)}
          className="ml-auto -mr-1 p-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="mt-0.5 ml-3 border-l border-border pl-2 space-y-0.5">
          {entry.children.map(c => {
            const [base, hash] = c.to.split("#");
            const active = pathname === base;
            const CIcon = c.icon;
            return (
              <Link
                key={c.to}
                to={base as never}
                hash={hash}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-card text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <CIcon className="h-3.5 w-3.5" />
                {c.label}
              </Link>
            );
          })}
        </div>
      )}
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
