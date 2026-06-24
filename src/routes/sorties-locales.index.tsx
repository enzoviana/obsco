import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FileBarChart2, PackageOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sorties-locales/")({
  head: () => ({ meta: [{ title: "Sorties Locales — DATAFUSE" }] }),
  component: SortiesIndex,
});

const REPORTS = [
  { to: "/sorties-locales/objectifs-pays", num: "1", title: "Suivi objectifs ventes mensuelles par pays" },
  { to: "/sorties-locales/objectifs-anf", num: "2", title: "Suivi objectifs ventes mensuelles ANF" },
  { to: "/sorties-locales/ventes-un", num: "3", title: "Suivi ventes tous pays par UN" },
  { to: "/sorties-locales/ventes-ca", num: "3 bis", title: "Suivi ventes tous pays par CA" },
  { to: "/sorties-locales/evolution-ca", num: "4", title: "Évolution ventes mois par mois — CA" },
  { to: "/sorties-locales/evolution-un", num: "4 bis", title: "Évolution ventes mois par mois — UN" },
  { to: "/sorties-locales/stocks-pays", num: "5", title: "Situation stocks locaux pays" },
  { to: "/sorties-locales/stocks-en-cours", num: "5 bis", title: "Situation stocks locaux + en cours" },
  { to: "/sorties-locales/vue-panoramique", num: "6", title: "Vue panoramique produit" },
  { to: "/fournisseurs", num: "★", title: "Stocks fournisseurs — vue d'ensemble" },
];

function SortiesIndex() {
  return (
    <AppShell title="Sorties Locales" subtitle="9 rapports prêts à filtrer & exporter">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(r => (
          <Link key={r.to} to={r.to as never}
            className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                {r.num === "★" ? <PackageOpen className="h-5 w-5" /> : <FileBarChart2 className="h-5 w-5" />}
              </div>
              <div className="text-xs text-muted-foreground">Rapport {r.num}</div>
            </div>
            <div className="mt-3 font-medium text-sm leading-snug">{r.title}</div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-primary group-hover:gap-2 transition-all">
              Ouvrir <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
