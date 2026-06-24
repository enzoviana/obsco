import { useEffect, useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, FileSpreadsheet, Globe2, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COUNTRIES, evolutionByRevenue, evolutionByUnits, getAgencies, salesByRevenue, salesByUnit,
  salesObjectivesANF, salesObjectivesByCountry, stockSituation, getPanoramicProducts, type Agency,
} from "@/lib/agencies";
import { exportCSV, exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export type Scope = "all" | "country" | "agency";
const PALETTE = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22d3ee", "#84cc16"];
const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 };

function agencyShare(agency: Agency, agencies: Agency[]) {
  const peers = agencies.filter(a => a.country === agency.country).length || 1;
  return 1 / peers;
}
function scaleNum(n: number, f: number) { return Math.round(n * f); }
function fmt(n: number) { return n.toLocaleString("fr-FR"); }

export function useScopeState() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [scope, setScope] = useState<Scope>("all");
  const [countryCode, setCountryCode] = useState<string>("");
  const [agencyId, setAgencyId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const list = getAgencies();
    setAgencies(list);
    if (list[0]) { setCountryCode(c => c || list[0].country); setAgencyId(a => a || list[0].id); }
    const sync = () => setAgencies(getAgencies());
    window.addEventListener("datafuse:agencies", sync);
    return () => window.removeEventListener("datafuse:agencies", sync);
  }, []);

  const agency = agencies.find(a => a.id === agencyId);
  const scopeLabel = scope === "all"
    ? "Tous pays · toutes agences"
    : scope === "country"
      ? `Pays : ${COUNTRIES.find(c => c.code === countryCode)?.name ?? countryCode}`
      : `Agence : ${agency?.name ?? agencyId}`;
  const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;

  return { scope, setScope, countryCode, setCountryCode, agencyId, setAgencyId, agencies, agency, scopeLabel, fileSuffix };
}

export function ScopeSelector(props: ReturnType<typeof useScopeState>) {
  const { scope, setScope, countryCode, setCountryCode, agencyId, setAgencyId, agencies } = props;
  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <ScopeBtn active={scope === "all"} onClick={() => setScope("all")} icon={<Globe2 className="h-3.5 w-3.5" />} label="Tous confondus" />
          <ScopeBtn active={scope === "country"} onClick={() => setScope("country")} icon={<MapPin className="h-3.5 w-3.5" />} label="Par pays" />
          <ScopeBtn active={scope === "agency"} onClick={() => setScope("agency")} icon={<Building2 className="h-3.5 w-3.5" />} label="Par agence" />
        </div>
        {scope === "country" && (
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="h-9 rounded-lg border border-border bg-surface px-3 text-sm">
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
          </select>
        )}
        {scope === "agency" && (
          <select value={agencyId} onChange={e => setAgencyId(e.target.value)} className="h-9 rounded-lg border border-border bg-surface px-3 text-sm">
            {agencies.map(a => <option key={a.id} value={a.id}>{a.name} — {a.country}</option>)}
          </select>
        )}
        <span className="ml-auto text-xs text-muted-foreground">Filtre appliqué au rapport ci-dessous</span>
      </div>
    </section>
  );
}

function ScopeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
      {icon}{label}
    </button>
  );
}

/* ---------- Shaped data hook ---------- */
export function useScopedReportData(scope: Scope, countryCode: string, agencyId: string) {
  return useMemo(() => {
    const agencies = typeof window !== "undefined" ? getAgencies() : [];
    const agency = agencies.find(a => a.id === agencyId);
    const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
    const factor = scope === "agency" && agency ? agencyShare(agency, agencies) : 1;
    const keep = (code: string) => !codeFilter || code === codeFilter;

    const objPays = salesObjectivesByCountry().filter(r => keep(r.code))
      .map(r => ({ ...r, objectif: scaleNum(r.objectif, factor), realise: scaleNum(r.realise, factor) }));

    const denomMonths = codeFilter ? COUNTRIES.length || 1 : 1;
    const objAnf = salesObjectivesANF().map(r => ({
      ...r,
      objectif: scaleNum(r.objectif, factor / denomMonths),
      realise: scaleNum(r.realise, factor / denomMonths),
    }));

    const vUn = salesByUnit().filter(r => keep(r.code)).map(r => ({ ...r, unites: scaleNum(r.unites, factor) }));
    const vCa = salesByRevenue().filter(r => keep(r.code)).map(r => ({ ...r, ca: scaleNum(r.ca, factor) }));

    const shape = (rows: ReturnType<typeof evolutionByRevenue>) => rows.map(row => {
      const out: Record<string, number | string> = { mois: row.mois };
      let total = 0;
      for (const c of COUNTRIES) {
        if (!keep(c.code)) continue;
        const v = scaleNum(Number(row[c.code] ?? 0), factor);
        out[c.code] = v; total += v;
      }
      out.total = total;
      return out;
    });

    const evCa = shape(evolutionByRevenue());
    const evUn = shape(evolutionByUnits());

    const stocks = stockSituation().filter(r => keep(r.code)).map(r => ({
      ...r,
      stock: scaleNum(r.stock, factor), enCours: scaleNum(r.enCours, factor),
      total: scaleNum(r.total, factor), seuil: scaleNum(r.seuil, factor),
    }));

    const products = getPanoramicProducts().map(p => ({
      ...p,
      ventes: scaleNum(p.ventes, factor), budgetMois: scaleNum(p.budgetMois, factor),
      ventesAn1: scaleNum(p.ventesAn1, factor), ca: scaleNum(p.ca, factor),
      budgetMoisCa: scaleNum(p.budgetMoisCa, factor),
      cumulBudget: scaleNum(p.cumulBudget, factor), cumulRealise: scaleNum(p.cumulRealise, factor),
    }));

    const visibleCountries = COUNTRIES.filter(c => keep(c.code));
    return { objPays, objAnf, vUn, vCa, evCa, evUn, stocks, products, visibleCountries, agency };
  }, [scope, countryCode, agencyId]);
}

/* ---------- Report card wrapper ---------- */
export function ReportCard({ title, subtitle, rows, filename, children }: {
  title: string; subtitle: string; rows: Record<string, unknown>[]; filename: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { exportCSV(filename, rows); toast.success("CSV téléchargé"); }}>
            <Download className="mr-2 h-3.5 w-3.5" />CSV
          </Button>
          <Button size="sm" onClick={() => { exportXLSX(filename, { Rapport: rows }); toast.success("XLSX téléchargé"); }}>
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />XLSX
          </Button>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/40">
      <table className="w-full text-xs">
        <thead className="bg-surface">
          <tr>{headers.map(h => <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="px-3 py-4 text-center text-muted-foreground" colSpan={headers.length}>Aucune donnée</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              {r.map((c, j) => <td key={j} className={`px-3 py-2 tabular-nums ${j === 0 ? "font-medium" : "text-muted-foreground"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Data = ReturnType<typeof useScopedReportData>;

export function ReportObjectifsPays({ data, suffix }: { data: Data["objPays"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 1 · Suivi objectifs ventes mensuelles par pays" subtitle="Objectif vs réalisé"
      rows={data} filename={`r1-objectifs-pays-${suffix}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="code" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="objectif" name="Objectif" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realise" name="Réalisé" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable headers={["Pays", "Objectif", "Réalisé", "Taux %"]} rows={data.map(d => [d.pays, fmt(d.objectif), fmt(d.realise), `${d.taux}%`])} />
      </div>
    </ReportCard>
  );
}

export function ReportObjectifsANF({ data, suffix }: { data: Data["objAnf"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 2 · Suivi objectifs ventes mensuelles ANF" subtitle="Performance globale · 12 mois"
      rows={data} filename={`r2-objectifs-anf-${suffix}`}>
      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
            <defs><linearGradient id="anf-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="mois" fontSize={11} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="objectif" name="Objectif" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" />
            <Area type="monotone" dataKey="realise" name="Réalisé" stroke="#10b981" fill="url(#anf-g)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReportCard>
  );
}

export function ReportVentesUnits({ data, suffix }: { data: Data["vUn"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 3 · Suivi ventes tous pays par unités" subtitle="Volume d'unités vendues"
      rows={data} filename={`r3-ventes-unites-${suffix}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 60, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis dataKey="pays" type="category" fontSize={11} stroke="var(--color-muted-foreground)" width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="unites" name="Unités" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable headers={["Pays", "Unités"]} rows={data.map(d => [d.pays, fmt(d.unites)])} />
      </div>
    </ReportCard>
  );
}

export function ReportVentesCA({ data, suffix }: { data: Data["vCa"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 3 bis · Suivi ventes tous pays par CA" subtitle="CA généré"
      rows={data} filename={`r3bis-ventes-ca-${suffix}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="ca" nameKey="pays" outerRadius={100} label={(e: { code: string }) => e.code}>
                {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <DataTable headers={["Pays", "CA"]} rows={data.map(d => [d.pays, `€${fmt(d.ca)}`])} />
      </div>
    </ReportCard>
  );
}

export function ReportEvolutionCA({ data, countries, suffix }: { data: Data["evCa"]; countries: typeof COUNTRIES; suffix: string }) {
  return (
    <ReportCard title="Rapport 4 · Évolution ventes mois par mois — CA" subtitle="CA cumulé sur 12 mois"
      rows={data as Record<string, unknown>[]} filename={`r4-evolution-ca-${suffix}`}>
      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="mois" fontSize={11} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {countries.map((c, i) => (
              <Line key={c.code} type="monotone" dataKey={c.code} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ReportCard>
  );
}

export function ReportEvolutionUN({ data, countries, suffix }: { data: Data["evUn"]; countries: typeof COUNTRIES; suffix: string }) {
  return (
    <ReportCard title="Rapport 4 bis · Évolution ventes mois par mois — Unités" subtitle="Volumes sur 12 mois"
      rows={data as Record<string, unknown>[]} filename={`r4bis-evolution-unites-${suffix}`}>
      <div className="h-80">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="mois" fontSize={11} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickFormatter={v => `${Math.round(v * 100)}%`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {countries.map((c, i) => (
              <Area key={c.code} type="monotone" dataKey={c.code} stackId="1" stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReportCard>
  );
}

export function ReportStocks({ data, suffix }: { data: Data["stocks"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 5 · Situation stocks locaux pays" subtitle="Stocks disponibles vs seuil"
      rows={data} filename={`r5-stocks-${suffix}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="code" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stock" name="Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="seuil" name="Seuil" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable headers={["Pays", "Stock", "Seuil", "Couv."]} rows={data.map(d => [d.pays, fmt(d.stock), fmt(d.seuil), `${d.couverture}j`])} />
      </div>
    </ReportCard>
  );
}

export function ReportStocksEnCours({ data, suffix }: { data: Data["stocks"]; suffix: string }) {
  return (
    <ReportCard title="Rapport 5 bis · Stocks locaux pays + commandes en cours" subtitle="Stocks disponibles + produits en commande"
      rows={data} filename={`r5bis-stocks-en-cours-${suffix}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="code" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stock" stackId="a" name="Stock disponible" fill="#10b981" />
              <Bar dataKey="enCours" stackId="a" name="En cours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DataTable headers={["Pays", "Stock", "En cours", "Total"]} rows={data.map(d => [d.pays, fmt(d.stock), fmt(d.enCours), fmt(d.total)])} />
      </div>
    </ReportCard>
  );
}

export function ReportVuePanoramique({ data, suffix }: { data: Data["products"]; suffix: string }) {
  const rows = data.slice(0, 50).map(p => ({
    Produit: p.name, Laboratoire: p.laboratory, Type: p.type,
    "PGHT Pays": p.pghtPays, Ventes: p.ventes, "Budget mois (UN)": p.budgetMois, "Taux réal. %": p.tauxReal,
    "Ventes N-1": p.ventesAn1, "Évol. %": p.tauxEvol, "CA": p.ca, "Budget CA": p.budgetMoisCa,
    "Tx réal. budget CA": p.txRealBudgetCa, "Cumul budget": p.cumulBudget, "Cumul réalisé": p.cumulRealise,
    "Tx réal. prév.": p.txRealPrev, "Poids %": p.poids,
  }));
  return (
    <ReportCard title="Rapport 6 · Vue panoramique produit" subtitle="Indicateurs complets par produit (top 50)"
      rows={rows} filename={`r6-vue-panoramique-${suffix}`}>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface/40">
        <table className="w-full min-w-[1200px] text-xs">
          <thead className="bg-surface">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {["Produit", "Labo", "Type", "PGHT", "Ventes", "Budget UN", "Tx réal.", "Ventes N-1", "Évol.", "CA", "Budget CA", "Cumul bud.", "Cumul réal.", "Poids"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map(p => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{p.laboratory}</td>
                <td className="px-3 py-2 text-muted-foreground">{p.type}</td>
                <td className="px-3 py-2 tabular-nums">{p.pghtPays}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(p.ventes)}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(p.budgetMois)}</td>
                <td className="px-3 py-2 tabular-nums">{p.tauxReal}%</td>
                <td className="px-3 py-2 tabular-nums">{fmt(p.ventesAn1)}</td>
                <td className={`px-3 py-2 tabular-nums ${p.tauxEvol >= 0 ? "text-primary" : "text-destructive"}`}>{p.tauxEvol}%</td>
                <td className="px-3 py-2 tabular-nums">€{fmt(Math.round(p.ca))}</td>
                <td className="px-3 py-2 tabular-nums">€{fmt(Math.round(p.budgetMoisCa))}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(p.cumulBudget)}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(p.cumulRealise)}</td>
                <td className="px-3 py-2 tabular-nums">{p.poids}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportCard>
  );
}
