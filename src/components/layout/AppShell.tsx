import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Package, BarChart3, Building2, Settings, Bell, LogOut, ChevronRight,
  FlaskConical, Store, Globe2, Users, ShieldCheck, FolderOpen, PackageOpen, Target, Tag,
  Boxes, Upload, Search, User, Sparkles
} from "lucide-react";
import { logout, useUser } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SearchCommand } from "@/components/layout/SearchCommand";
import Logo from "@/assets/Logo.svg";

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
      { to: "/sorties-locales", label: "Sorties Locales", icon: Boxes, exact: true },
      { to: "/sorties-locales/objectifs-pays", label: "R1 · Objectifs / Pays", icon: Target },
      { to: "/sorties-locales/objectifs-anf", label: "R2 · Objectifs ANF", icon: Target },
      { to: "/sorties-locales/ventes-un", label: "R3 · Ventes (UN)", icon: BarChart3 },
      { to: "/sorties-locales/ventes-ca", label: "R4 · Ventes (CA)", icon: BarChart3 },
      { to: "/sorties-locales/evolution-un", label: "R5 · Évolution (UN)", icon: BarChart3 },
      { to: "/sorties-locales/evolution-ca", label: "R5bis · Évolution (CA)", icon: BarChart3 },
      { to: "/sorties-locales/stocks-pays", label: "R6 · Stocks / Pays", icon: Package },
      { to: "/sorties-locales/stocks-en-cours", label: "R7bis · Stocks en cours", icon: Package },
      { to: "/sorties-locales/vue-panoramique", label: "R8 · Vue panoramique", icon: LayoutDashboard },
    ],
  },
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

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950/40">
      {/* Sidebar de gauche */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200/60 bg-white/80 dark:border-zinc-800/60 dark:bg-zinc-900/80 backdrop-blur-md lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-zinc-200/40 dark:border-zinc-800/40">
          <img src={Logo} alt="OBCO" className="h-8 w-auto transition-transform hover:scale-105 duration-200" />
        </div>

        {/* Navigation principale */}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
          {filtered.map((n, idx) => {
            if (isGroup(n)) {
              return <NavGroup key={`g-${idx}-${n.group}`} entry={n} pathname={loc.pathname} />;
            }
            const active = loc.pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as never}
                className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${active ? "text-white" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Déconnexion) */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 p-4 bg-zinc-50/50 dark:bg-zinc-900/40">
          <button
            onClick={() => { logout(); navigate({ to: "/login" }); }}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 text-zinc-400 group-hover:text-red-500 transition-colors" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Zone droite */}
      <div className="lg:pl-64">
        {/* Header supérieur flottant */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-950/80 backdrop-blur-md px-8">
          <div className="flex flex-1 items-center gap-4">
            <SearchCommand />
          </div>

          <div className="flex items-center gap-4">
            {/* Clignotant avec ta couleur d'accentuation */}
            <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-full h-9 w-9">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[var(--accent)] ring-2 ring-white dark:ring-zinc-950" />
            </Button>

            <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

            {/* Menu Utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-full">
                  <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-700">
                    <AvatarFallback className="text-[11px] bg-[var(--primary)] text-white font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user?.name || "Invité"}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">{user?.role || "Membre"}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-zinc-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <User className="h-4 w-4" /> Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => navigate({ to: "/parametres" })}>
                  <Settings className="h-4 w-4" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer gap-2" onClick={() => { logout(); navigate({ to: "/login" }); }}>
                  <LogOut className="h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="px-8 py-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                {subtitle && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                    <Sparkles className="h-3 w-3" />
                    {subtitle}
                  </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  {title}
                </h1>
              </div>
              {actions && <div className="flex shrink-0 gap-2.5 self-start md:self-center">{actions}</div>}
            </div>

            <div className="mt-10">{children}</div>
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

  const headerClass = `group flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 ${
    isChildActive || selfActive
      ? "bg-zinc-100/80 text-zinc-900 dark:bg-zinc-850 dark:text-zinc-50 font-medium"
      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-50"
  }`;

  return (
    <div className="space-y-1">
      <div className={headerClass}>
        {entry.to ? (
          <Link to={entry.to as never} className="flex flex-1 items-center gap-3" onClick={() => setOpen(true)}>
            <Icon className={`h-[18px] w-[18px] ${isChildActive || selfActive ? "text-[var(--primary)]" : "text-zinc-400"}`} />
            <span>{entry.group}</span>
          </Link>
        ) : (
          <button type="button" onClick={() => setOpen(o => !o)} className="flex flex-1 items-center gap-3">
            <Icon className={`h-[18px] w-[18px] ${isChildActive || selfActive ? "text-[var(--primary)]" : "text-zinc-400"}`} />
            <span>{entry.group}</span>
          </button>
        )}
        <button
          type="button"
          aria-label={open ? "Réduire" : "Développer"}
          onClick={() => setOpen(o => !o)}
          className="ml-auto -mr-1 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
      
      {open && (
        <div className="mt-1 ml-4.5 border-l border-zinc-200 dark:border-zinc-800 pl-3 space-y-1">
          {entry.children.map(c => {
            const [base, hash] = c.to.split("#");
            const active = pathname === base;
            const CIcon = c.icon;
            return (
              <Link
                key={c.to}
                to={base as never}
                hash={hash}
                className={`group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-all duration-150 ${
                  active
                    ? "bg-[var(--primary)] text-white font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                <CIcon className={`h-4 w-4 transition-transform duration-150 group-hover:scale-105 ${active ? "text-white" : "text-zinc-400"}`} />
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
  const map: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    critical: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", dot: "bg-red-500", label: "Critique" },
    low: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500", label: "Faible" },
    ok: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500", label: "OK" },
    rupture: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500", label: "Rupture" },
    completed: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-500", label: "Terminé" },
    processing: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500", label: "En cours" },
    active: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500", label: "Actif" },
    warning: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500", label: "Attention" },
    inactive: { bg: "bg-zinc-100 dark:bg-zinc-800/60", text: "text-zinc-600 dark:text-zinc-400", dot: "bg-zinc-400", label: "Inactif" },
    blocked: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", dot: "bg-red-500", label: "Bloqué" },
  };
  
  const v = map[status] ?? map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-transparent transition-colors ${v.bg} ${v.text}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${v.dot}`}></span>
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${v.dot}`}></span>
      </span>
      {v.label}
    </span>
  );
}