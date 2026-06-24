import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, FileSpreadsheet, Globe2, MapPin, Building2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import {
  COUNTRIES, evolutionByRevenue, evolutionByUnits, getAgencies, salesByRevenue, salesByUnit,
  salesObjectivesANF, salesObjectivesByCountry, stockSituation, type Agency,
} from "@/lib/agencies";
import { exportCSV, exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/rapports")({
  head: () => ({ meta: [{ title: "Rapports — DATAFUSE" }] }),
  component: RapportsPage,
});

const PALETTE = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22d3ee", "#84cc16"];

type Scope = "all" | "country" | "agency";

/* ---------- Scope-aware data shaping ---------- */
function agencyShare(agency: Agency, agencies: Agency[]) {
  const peers = agencies.filter(a => a.country === agency.country).length || 1;
  return 1 / peers;
}

function scaleNum(n: number, f: number) { return Math.round(n * f); }

function useScopedData(scope: Scope, countryCode: string, agencyId: string) {
  return useMemo(() => {
    const agencies = getAgencies();
    const agency = agencies.find(a => a.id === agencyId);
    const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
    const factor = scope === "agency" && agency ? agencyShare(agency, agencies) : 1;
    const keepCountry = (code: string) => !codeFilter || code === codeFilter;

    const objPays = salesObjectivesByCountry()
      .filter(r => keepCountry(r.code))
      .map(r => ({ ...r, objectif: scaleNum(r.objectif, factor), realise: scaleNum(r.realise, factor) }));

    const objAnf = salesObjectivesANF().map(r => ({
      ...r,
      objectif: scaleNum(r.objectif, factor * (codeFilter ? 1 / COUNTRIES.length : 1)),
      realise: scaleNum(r.realise, factor * (codeFilter ? 1 / COUNTRIES.length : 1)),
    }));

    const vUn = salesByUnit().filter(r => keepCountry(r.code)).map(r => ({ ...r, unites: scaleNum(r.unites, factor) }));
    const vCa = salesByRevenue().filter(r => keepCountry(r.code)).map(r => ({ ...r, ca: scaleNum(r.ca, factor) }));

    const shapeMonth = (rows: ReturnType<typeof evolutionByRevenue>) => rows.map(row => {
      const out: Record<string, number | string> = { mois: row.mois };
      let total = 0;
      for (const c of COUNTRIES) {
        if (!keepCountry(c.code)) continue;
        const v = scaleNum(Number(row[c.code] ?? 0), factor);
        out[c.code] = v;
        total += v;
      }
      out.total = total;
      return out;
    });

    const evCa = shapeMonth(evolutionByRevenue());
    const evUn = shapeMonth(evolutionByUnits());

    const stocks = stockSituation().filter(r => keepCountry(r.code)).map(r => ({
      ...r,
      stock: scaleNum(r.stock, factor),
      enCours: scaleNum(r.enCours, factor),
      total: scaleNum(r.total, factor),
      seuil: scaleNum(r.seuil, factor),
    }));

    const visibleCountries = COUNTRIES.filter(c => keepCountry(c.code));

    return { objPays, objAnf, vUn, vCa, evCa, evUn, stocks, visibleCountries, agency };
  }, [scope, countryCode, agencyId]);
}

function RapportsPage() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [scope, setScope] = useState<Scope>("all");
  const [countryCode, setCountryCode] = useState<string>("");
  const [agencyId, setAgencyId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) { navigate({ to: "/login" }); return; }
    const list = getAgencies();
    setAgencies(list);
    if (!countryCode && list[0]) setCountryCode(list[0].country);
    if (!agencyId && list[0]) setAgencyId(list[0].id);
  }, [navigate, countryCode, agencyId]);

  const data = useScopedData(scope, countryCode, agencyId);

  const scopeLabel = scope === "all"
    ? "Tous pays · toutes agences"
    : scope === "country"
      ? `Pays : ${COUNTRIES.find(c => c.code === countryCode)?.name ?? countryCode}`
      : `Agence : ${data.agency?.name ?? agencyId}`;

  const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;

  const exportAll = () => {
    exportXLSX(`rapports-anf-${fileSuffix}`, {
      "Obj. Pays": data.objPays,
      "Obj. ANF": data.objAnf,
      "Ventes UN": data.vUn,
      "Ventes CA": data.vCa,
      "Evol. CA": data.evCa as Record<string, unknown>[],
      "Evol. UN": data.evUn as Record<string, unknown>[],
      "Stocks": data.stocks,
      "_Filtre": [{ scope, pays: countryCode, agence: agencyId, libelle: scopeLabel }],
    });
    toast.success("Rapport complet XLSX téléchargé");
  };

  return (
    <AppShell
      title="Rapports SuperAdmin"
      subtitle={`Vision globale · ${scopeLabel}`}
      actions={<Button size="sm" onClick={exportAll}><FileSpreadsheet className="mr-2 h-4 w-4" />Exporter tout (XLSX)</Button>}
    >
      {/* Scope selector */}
      <section className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            <ScopeBtn active={scope === "all"} onClick={() => setScope("all")} icon={<Globe2 className="h-3.5 w-3.5" />} label="Tous confondus" />
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
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name} — {a.country}</option>
              ))}
            </select>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            Filtre appliqué à tous les rapports & exports ci-dessous
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6">
        <ReportObjectifsPays data={data.objPays} suffix={fileSuffix} />
        <ReportObjectifsANF data={data.objAnf} suffix={fileSuffix} />
        <ReportVentesUnits data={data.vUn} suffix={fileSuffix} />
        <ReportVentesCA data={data.vCa} suffix={fileSuffix} />
        <ReportEvolutionCA data={data.evCa} countries={data.visibleCountries} suffix={fileSuffix} />
        <ReportEvolutionUN data={data.evUn} countries={data.visibleCountries} suffix={fileSuffix} />
        <ReportStocks data={data.stocks} suffix={fileSuffix} />
        <ReportStocksEnCours data={data.stocks} suffix={fileSuffix} />
      </div>
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

function ReportCard({ title, subtitle, rows, filename, children }: {
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

const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 };

type ObjPays = ReturnType<typeof salesObjectivesByCountry>[number];
type ObjAnf = ReturnType<typeof salesObjectivesANF>[number];
type VUn = ReturnType<typeof salesByUnit>[number];
type VCa = ReturnType<typeof salesByRevenue>[number];
type MonthRow = Record<string, number | string>;
type Stock = ReturnType<typeof stockSituation>[number];

function ReportObjectifsPays({ data, suffix }: { data: ObjPays[]; suffix: string }) {
  return (
    <ReportCard
      title="1 · Suivi objectifs ventes mensuelles par pays"
      subtitle="Objectif vs réalisé"
      rows={data} filename={`suivi-objectifs-mensuels-pays-${suffix}`}
    >
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
        <DataTable
          headers={["Pays", "Objectif", "Réalisé", "Taux %"]}
          rows={data.map(d => [d.pays, fmt(d.objectif), fmt(d.realise), `${d.taux}%`])}
        />
      </div>
    </ReportCard>
  );
}

function ReportObjectifsANF({ data, suffix }: { data: ObjAnf[]; suffix: string }) {
  return (
    <ReportCard
      title="2 · Suivi objectifs ventes mensuelles ANF"
      subtitle="Performance globale · 12 mois"
      rows={data} filename={`suivi-objectifs-mensuels-anf-${suffix}`}
    >
      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="anf-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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

function ReportVentesUnits({ data, suffix }: { data: VUn[]; suffix: string }) {
  return (
    <ReportCard
      title="3 · Suivi ventes par unité"
      subtitle="Volume d'unités vendues" rows={data} filename={`ventes-unites-${suffix}`}
    >
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

function ReportVentesCA({ data, suffix }: { data: VCa[]; suffix: string }) {
  return (
    <ReportCard
      title="4 · Suivi ventes par chiffre d'affaires"
      subtitle="CA généré" rows={data} filename={`ventes-ca-${suffix}`}
    >
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

function ReportEvolutionCA({ data, countries, suffix }: { data: MonthRow[]; countries: typeof COUNTRIES; suffix: string }) {
  return (
    <ReportCard
      title="5 · Évolution ventes mois par mois — CA"
      subtitle="CA cumulé sur 12 mois" rows={data as Record<string, unknown>[]} filename={`evolution-ca-${suffix}`}
    >
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

function ReportEvolutionUN({ data, countries, suffix }: { data: MonthRow[]; countries: typeof COUNTRIES; suffix: string }) {
  return (
    <ReportCard
      title="6 · Évolution ventes mois par mois — Unités"
      subtitle="Volumes sur 12 mois" rows={data as Record<string, unknown>[]} filename={`evolution-unites-${suffix}`}
    >
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

function ReportStocks({ data, suffix }: { data: Stock[]; suffix: string }) {
  return (
    <ReportCard
      title="7 · Situation stocks locaux"
      subtitle="Stocks disponibles vs seuil" rows={data} filename={`situation-stocks-${suffix}`}
    >
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
        <DataTable
          headers={["Pays", "Stock", "Seuil", "Couv."]}
          rows={data.map(d => [d.pays, fmt(d.stock), fmt(d.seuil), `${d.couverture}j`])}
        />
      </div>
    </ReportCard>
  );
}

function ReportStocksEnCours({ data, suffix }: { data: Stock[]; suffix: string }) {
  return (
    <ReportCard
      title="8 · Situation stocks + commandes en cours"
      subtitle="Stocks disponibles + produits en commande"
      rows={data} filename={`stocks-avec-en-cours-${suffix}`}
    >
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
        <DataTable
          headers={["Pays", "Stock", "En cours", "Total"]}
          rows={data.map(d => [d.pays, fmt(d.stock), fmt(d.enCours), fmt(d.total)])}
        />
      </div>
    </ReportCard>
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

function fmt(n: number) { return n.toLocaleString("fr-FR"); }
