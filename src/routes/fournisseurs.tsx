import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Search, Download, Truck, Globe2, MapPin, Building2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser } from "@/lib/auth";
import {
  COUNTRIES, getAgencies, getGrossistes, getPanoramicProducts, SUPPLIERS,
  type Agency, type Grossiste,
} from "@/lib/agencies";
import { exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/fournisseurs")({
  head: () => ({ meta: [{ title: "Stocks fournisseurs — DATAFUSE" }] }),
  component: FournisseursPage,
});

type Scope = "all" | "country" | "agency";

function FournisseursPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [countryCode, setCountryCode] = useState<string>("CI");
  const [agencyId, setAgencyId] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<string>("all"); // partenaire name
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [grossistes, setGrossistes] = useState<Grossiste[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) { navigate({ to: "/login" }); return; }
    const ag = getAgencies();
    setAgencies(ag);
    setGrossistes(getGrossistes());
    if (!agencyId && ag[0]) setAgencyId(ag[0].id);
  }, [navigate, agencyId]);

  const products = getPanoramicProducts();

  /* ---- Compute visible suppliers + scaling factor per supplier ---- */
  const supplierView = useMemo(() => {
    const map = new Map<string, number>(); // supplier name -> max factor
    const knownSuppliers = new Set(SUPPLIERS);

    for (const g of grossistes) {
      if (g.status === "blocked" || g.status === "inactive") continue;
      if (!knownSuppliers.has(g.partenaire)) continue;
      if (supplierFilter !== "all" && g.partenaire !== supplierFilter) continue;

      let include = false;
      let factor = 1;

      if (scope === "all") {
        include = true;
      } else if (scope === "country") {
        if (g.country === countryCode) include = true;
      } else if (scope === "agency") {
        const ag = agencies.find(a => a.id === agencyId);
        if (!ag) continue;
        if (g.scope === "agency" && g.agencyId === agencyId) {
          include = true; factor = 1;
        } else if (g.scope === "country" && g.country === ag.country) {
          const peers = agencies.filter(a => a.country === ag.country).length || 1;
          include = true; factor = 1 / peers;
        }
      }

      if (!include) continue;
      const cur = map.get(g.partenaire);
      if (cur === undefined || factor > cur) map.set(g.partenaire, factor);
    }

    return Array.from(map.entries()).map(([name, factor]) => ({ name, factor }));
  }, [grossistes, agencies, scope, countryCode, agencyId, supplierFilter]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return products.filter(p => !ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql));
  }, [products, q]);

  const scale = (n: number, f: number) => Math.round(n * f);

  const totals = useMemo(() => {
    const t: Record<string, { ventes: number; stocks: number; commandes: number }> = {};
    for (const sv of supplierView) t[sv.name] = { ventes: 0, stocks: 0, commandes: 0 };
    for (const p of products) for (const sv of supplierView) {
      const f = p.fournisseurs[sv.name];
      if (!f) continue;
      t[sv.name].ventes += scale(f.ventes, sv.factor);
      t[sv.name].stocks += scale(f.stocks, sv.factor);
      t[sv.name].commandes += scale(f.commandes, sv.factor);
    }
    return t;
  }, [products, supplierView]);

  const scopeLabel =
    scope === "all" ? "Tous pays · toutes agences"
    : scope === "country" ? `Pays : ${COUNTRIES.find(c => c.code === countryCode)?.name ?? countryCode}`
    : `Agence : ${agencies.find(a => a.id === agencyId)?.name ?? agencyId}`;

  const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;

  const handleExport = () => {
    const rows: Record<string, unknown>[] = [];
    for (const p of filtered) {
      const row: Record<string, unknown> = { CIP: p.cip, Produit: p.name, Laboratoire: p.laboratory };
      for (const sv of supplierView) {
        const f = p.fournisseurs[sv.name];
        if (!f) continue;
        row[`${sv.name} - Prix Unit.`] = f.prixUnitaire;
        row[`${sv.name} - Ventes`] = scale(f.ventes, sv.factor);
        row[`${sv.name} - Stocks`] = scale(f.stocks, sv.factor);
        row[`${sv.name} - Commandes`] = scale(f.commandes, sv.factor);
      }
      rows.push(row);
    }
    exportXLSX(`stocks-fournisseurs-${fileSuffix}`, {
      Fournisseurs: rows,
      _Filtre: [{ scope, pays: countryCode, agence: agencyId, fournisseur: supplierFilter, libelle: scopeLabel }],
    });
    toast.success("Export XLSX téléchargé");
  };

  const supplierOptions = useMemo(() => {
    const set = new Set<string>();
    for (const g of grossistes) if (SUPPLIERS.includes(g.partenaire)) set.add(g.partenaire);
    return Array.from(set).sort();
  }, [grossistes]);

  return (
    <AppShell
      title="Stocks fournisseurs"
      subtitle={`Visibilité par grossiste · ${scopeLabel}`}
      actions={<Button size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporter XLSX</Button>}
    >
      {/* Filters */}
      <section className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            <ScopeBtn active={scope === "all"} onClick={() => setScope("all")} icon={<Globe2 className="h-3.5 w-3.5" />} label="Tous" />
            <ScopeBtn active={scope === "country"} onClick={() => setScope("country")} icon={<MapPin className="h-3.5 w-3.5" />} label="Par pays" />
            <ScopeBtn active={scope === "agency"} onClick={() => setScope("agency")} icon={<Building2 className="h-3.5 w-3.5" />} label="Par agence" />
          </div>

          {scope === "country" && (
            <select
              value={countryCode} onChange={e => setCountryCode(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
          )}

          {scope === "agency" && (
            <select
              value={agencyId} onChange={e => setAgencyId(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {agencies.map(a => <option key={a.id} value={a.id}>{a.name} — {a.country}</option>)}
            </select>
          )}

          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              <option value="all">Tous fournisseurs</option>
              {supplierOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <span className="ml-auto text-xs text-muted-foreground">
            {supplierView.length} fournisseur(s) visible(s)
          </span>
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {supplierView.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Aucun fournisseur ne correspond à ces filtres.
          </div>
        )}
        {supplierView.map(sv => (
          <div key={sv.name} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">{sv.name}</span>
            </div>
            <div className="mt-3 font-display text-2xl">{totals[sv.name].stocks.toLocaleString("fr-FR")}</div>
            <div className="text-[11px] text-muted-foreground">unités en stock</div>
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>Ventes <b className="text-foreground">{totals[sv.name].ventes.toLocaleString("fr-FR")}</b></span>
              <span>Cmd <b className="text-foreground">{totals[sv.name].commandes.toLocaleString("fr-FR")}</b></span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un produit…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>

      {supplierView.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-[12px]">
              <thead>
                <tr className="bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th rowSpan={2} className="px-3 py-2 text-left font-medium border-r border-border">Produit</th>
                  <th rowSpan={2} className="px-2 py-2 text-right font-medium border-r border-border">Prix u.</th>
                  {supplierView.map(sv => (
                    <th key={sv.name} colSpan={3} className="px-2 py-2 text-center font-semibold text-primary border-r border-border bg-primary/5">{sv.name}</th>
                  ))}
                </tr>
                <tr className="bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                  {supplierView.map(sv => (
                    <Fragment key={sv.name}>
                      <th className="px-1.5 py-1.5 text-right font-medium">Ventes</th>
                      <th className="px-1.5 py-1.5 text-right font-medium">Stocks</th>
                      <th className="px-1.5 py-1.5 text-right font-medium border-r border-border">Cmd</th>
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(p => (
                  <tr key={p.id} className="border-t border-border/60 hover:bg-surface/40">
                    <td className="px-3 py-2.5 border-r border-border/60">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.cip}</div>
                    </td>
                    <td className="px-2 py-2.5 text-right tabular-nums border-r border-border/60">€{p.pghtPays.toFixed(2)}</td>
                    {supplierView.map(sv => {
                      const f = p.fournisseurs[sv.name];
                      if (!f) return (
                        <Fragment key={sv.name}>
                          <td className="px-1.5 py-2.5 text-right text-muted-foreground">—</td>
                          <td className="px-1.5 py-2.5 text-right text-muted-foreground">—</td>
                          <td className="px-1.5 py-2.5 text-right text-muted-foreground border-r border-border/60">—</td>
                        </Fragment>
                      );
                      const ventes = scale(f.ventes, sv.factor);
                      const stocks = scale(f.stocks, sv.factor);
                      const commandes = scale(f.commandes, sv.factor);
                      return (
                        <Fragment key={sv.name}>
                          <td className="px-1.5 py-2.5 text-right tabular-nums">{ventes}</td>
                          <td className={`px-1.5 py-2.5 text-right tabular-nums ${stocks < 50 ? "text-warning font-medium" : ""}`}>{stocks}</td>
                          <td className="px-1.5 py-2.5 text-right tabular-nums text-muted-foreground border-r border-border/60">{commandes}</td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 100 && (
            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              100 premiers / {filtered.length} résultats. Affinez la recherche pour voir plus.
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

function ScopeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}{label}
    </button>
  );
}
