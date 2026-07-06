import { Link, useRouterState } from "@tanstack/react-router";
import { Truck, FileBarChart2 } from "lucide-react";

type Tab = { to: string; label: string; icon?: typeof Truck; exact?: boolean };
const TABS: Tab[] = [
  { to: "/sorties-locales", label: "Sorties Locales", icon: Truck, exact: true },
  { to: "/sorties-locales/objectifs-pays", label: "R1 · Obj. pays" },
  { to: "/sorties-locales/objectifs-anf", label: "R2 · Obj. ANF" },
  { to: "/sorties-locales/ventes-un", label: "R3 · Ventes UN" },
  { to: "/sorties-locales/ventes-ca", label: "R3 bis · Ventes CA" },
  { to: "/sorties-locales/evolution-ca", label: "R4 · Évol. CA" },
  { to: "/sorties-locales/evolution-un", label: "R4 bis · Évol. UN" },
  { to: "/sorties-locales/stocks-pays", label: "R5 · Stocks pays" },
  { to: "/sorties-locales/stocks-en-cours", label: "R5 bis · Stocks + en cours" },
  { to: "/sorties-locales/vue-panoramique", label: "R6 · Vue panoramique" },
];

export function SortiesTabs() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return (
    <div className="mb-6 -mt-2 rounded-2xl border border-border bg-card p-1.5 overflow-x-auto">
      <nav className="flex items-center gap-1 min-w-max">
        {TABS.map(t => {
          const active = t.exact ? pathname === t.to || pathname === t.to + "/" : pathname === t.to;
          const Icon = t.icon ?? FileBarChart2;
          return (
            <Link
              key={t.to}
              to={t.to as never}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
