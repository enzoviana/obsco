import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Globe2, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COUNTRIES, getAgencies, getPanoramicProducts, MONTHS, type Agency, type ProductPanoramic,
} from "@/lib/agencies";
import { exportCSV, exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export type Scope = "all" | "country" | "agency";

function fmt(n: number) { return Number.isFinite(n) ? Math.round(n).toLocaleString("fr-FR") : "-"; }
function pct(n: number) { return Number.isFinite(n) ? `${n.toFixed(1)}%` : "-"; }
function eur(n: number) { return `€${fmt(n)}`; }
function prodRand(seedStr: string) {
  let s = 2166136261 >>> 0;
  for (const ch of seedStr) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}
function agencyShare(agency: Agency, agencies: Agency[]) {
  const peers = agencies.filter(a => a.country === agency.country).length || 1;
  return 1 / peers;
}

/* ---------- Scope state ---------- */
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

/* ---------- Data hook ---------- */
export function useScopedReportData(scope: Scope, countryCode: string, agencyId: string) {
  return useMemo(() => {
    const agencies = typeof window !== "undefined" ? getAgencies() : [];
    const agency = agencies.find(a => a.id === agencyId);
    const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
    const agencyFactor = scope === "agency" && agency ? agencyShare(agency, agencies) : 1;
    const visibleCountries = COUNTRIES.filter(c => !codeFilter || c.code === codeFilter);
    const products = getPanoramicProducts();
    const selectedCountry = codeFilter || null;
    return { agencies, agency, agencyFactor, codeFilter, visibleCountries, products, selectedCountry };
  }, [scope, countryCode, agencyId]);
}

type Data = ReturnType<typeof useScopedReportData>;

/* ---------- Card wrapper (Stock fournisseur design) ---------- */
export function ReportCard({ title, subtitle, rows, filename, children }: {
  title: string; subtitle: string; rows: Record<string, unknown>[]; filename: string; children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="font-display text-lg leading-tight">{title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
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
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Table({ children, minWidth = 900 }: { children: React.ReactNode; minWidth?: number }) {
  return <table className="w-full text-[12px]" style={{ minWidth }}>{children}</table>;
}
const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`px-3 py-2 font-medium text-[10px] uppercase tracking-wider text-muted-foreground ${right ? "text-right" : "text-left"}`}>{children}</th>
);
const TD = ({ children, right, mute }: { children: React.ReactNode; right?: boolean; mute?: boolean }) => (
  <td className={`px-3 py-2.5 tabular-nums ${right ? "text-right" : ""} ${mute ? "text-muted-foreground" : ""}`}>{children}</td>
);

/* ===================================================================== */
/* RAPPORT 1 — Suivi objectifs ventes mensuelles par produit             */
/* ===================================================================== */
function buildR1(d: Data) {
  const factor = d.agencyFactor * (d.codeFilter ? 1 / Math.max(COUNTRIES.length, 1) : 1);
  const rows = d.products.slice(0, 60).map(p => {
    const ventes = Math.round(p.ventes * factor);
    const budgetMois = Math.round(p.budgetMois * factor);
    const ventesAn1 = Math.round(p.ventesAn1 * factor);
    const ca = +(p.ca * factor).toFixed(2);
    const budgetMoisCa = +(p.budgetMoisCa * factor).toFixed(2);
    const cumulBudget = Math.round(p.cumulBudget * factor);
    const cumulRealise = Math.round(p.cumulRealise * factor);
    return {
      id: p.id, produit: p.name, pght: p.pghtPays, ventes, budgetMois,
      tauxReal: +((ventes / Math.max(budgetMois, 1)) * 100).toFixed(1),
      ventesAn1, tauxEvol: +(((ventes - ventesAn1) / Math.max(ventesAn1, 1)) * 100).toFixed(1),
      ca, budgetMoisCa, txRealBudgetCa: +((ca / Math.max(budgetMoisCa, 1)) * 100).toFixed(1),
      cumulBudget, cumulRealise, txRealDate: +((cumulRealise / Math.max(cumulBudget, 1)) * 100).toFixed(1),
      poids: 0,
    };
  });
  const totalCa = rows.reduce((s, r) => s + r.ca, 0) || 1;
  rows.forEach(r => { r.poids = +((r.ca / totalCa) * 100).toFixed(2); });
  return rows;
}

export function ReportObjectifsPays({ data, suffix }: { data: Data; suffix: string }) {
  const rows = useMemo(() => buildR1(data), [data]);
  const tot = useMemo(() => ({
    ventes: rows.reduce((s, r) => s + r.ventes, 0),
    budgetMois: rows.reduce((s, r) => s + r.budgetMois, 0),
    ventesAn1: rows.reduce((s, r) => s + r.ventesAn1, 0),
    ca: rows.reduce((s, r) => s + r.ca, 0),
    budgetMoisCa: rows.reduce((s, r) => s + r.budgetMoisCa, 0),
    cumulBudget: rows.reduce((s, r) => s + r.cumulBudget, 0),
    cumulRealise: rows.reduce((s, r) => s + r.cumulRealise, 0),
  }), [rows]);
  const exportRows = rows.map(r => ({
    Produit: r.produit, "PGHT pays": r.pght, Ventes: r.ventes, "Budget Mois": r.budgetMois,
    "Taux de réalisation (%)": r.tauxReal, "Ventes An-1": r.ventesAn1, "Taux d'évolution (%)": r.tauxEvol,
    "Chiffres d'affaire (CA)": r.ca, "Budget Mois CA": r.budgetMoisCa, "Tx Real Budget CA (%)": r.txRealBudgetCa,
    "Cumul Budget": r.cumulBudget, "Cumul Réalisé": r.cumulRealise,
    "Tx de réalisation à date (%)": r.txRealDate, "Poids (%)": r.poids,
  }));
  return (
    <ReportCard title="Rapport 1 · Objectifs ventes par produit" subtitle="Suivi mensuel par produit — performance, CA, cumul, poids"
      rows={exportRows} filename={`r1-objectifs-pays-${suffix}`}>
      <Table minWidth={1400}>
        <thead className="bg-surface"><tr>
          <TH>Produit</TH><TH right>PGHT pays</TH><TH right>Ventes</TH><TH right>Budget Mois</TH>
          <TH right>Tx réal. %</TH><TH right>Ventes An-1</TH><TH right>Tx évol. %</TH>
          <TH right>CA</TH><TH right>Budget CA</TH><TH right>Tx Real CA %</TH>
          <TH right>Cumul Budget</TH><TH right>Cumul Réalisé</TH><TH right>Tx réal. à date %</TH><TH right>Poids %</TH>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-border/60">
              <TD>{r.produit}</TD>
              <TD right mute>{r.pght}</TD><TD right>{fmt(r.ventes)}</TD><TD right mute>{fmt(r.budgetMois)}</TD>
              <TD right><span className={r.tauxReal >= 100 ? "text-primary" : "text-amber-500"}>{pct(r.tauxReal)}</span></TD>
              <TD right mute>{fmt(r.ventesAn1)}</TD>
              <TD right><span className={r.tauxEvol >= 0 ? "text-primary" : "text-destructive"}>{pct(r.tauxEvol)}</span></TD>
              <TD right>{eur(r.ca)}</TD><TD right mute>{eur(r.budgetMoisCa)}</TD>
              <TD right>{pct(r.txRealBudgetCa)}</TD>
              <TD right mute>{fmt(r.cumulBudget)}</TD><TD right>{fmt(r.cumulRealise)}</TD>
              <TD right>{pct(r.txRealDate)}</TD><TD right>{r.poids}%</TD>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-surface text-[11px] font-semibold uppercase tracking-wider">
            <TD>Total</TD>
            <TD right mute>—</TD><TD right>{fmt(tot.ventes)}</TD><TD right>{fmt(tot.budgetMois)}</TD>
            <TD right>{pct((tot.ventes / Math.max(tot.budgetMois, 1)) * 100)}</TD>
            <TD right>{fmt(tot.ventesAn1)}</TD>
            <TD right>{pct(((tot.ventes - tot.ventesAn1) / Math.max(tot.ventesAn1, 1)) * 100)}</TD>
            <TD right>{eur(tot.ca)}</TD><TD right>{eur(tot.budgetMoisCa)}</TD>
            <TD right>{pct((tot.ca / Math.max(tot.budgetMoisCa, 1)) * 100)}</TD>
            <TD right>{fmt(tot.cumulBudget)}</TD><TD right>{fmt(tot.cumulRealise)}</TD>
            <TD right>{pct((tot.cumulRealise / Math.max(tot.cumulBudget, 1)) * 100)}</TD>
            <TD right>100%</TD>
          </tr>
        </tfoot>
      </Table>
    </ReportCard>
  );
}

/* ===================================================================== */
/* RAPPORT 2 — Objectifs ventes mensuelles ANF (par produit)             */
/* ===================================================================== */
function buildR2(d: Data) {
  const factor = d.agencyFactor * (d.codeFilter ? 1 / Math.max(COUNTRIES.length, 1) : 1);
  return d.products.slice(0, 60).map(p => {
    const ventes = Math.round(p.ventes * factor);
    const budgetMois = Math.round(p.budgetMois * factor);
    const ventesAn1 = Math.round(p.ventesAn1 * factor);
    const ca = +(p.ca * factor).toFixed(2);
    const budgetMoisCa = +(p.budgetMoisCa * factor).toFixed(2);
    const cumulBudget = Math.round(p.cumulBudget * factor);
    const cumulRealise = Math.round(p.cumulRealise * factor);
    return {
      id: p.id, produit: p.name, pght: p.pghtPays, ventes, budgetMois,
      tauxReal: +((ventes / Math.max(budgetMois, 1)) * 100).toFixed(1),
      ventesAn1, tauxEvol: +(((ventes - ventesAn1) / Math.max(ventesAn1, 1)) * 100).toFixed(1),
      ca, budgetMoisCa, txRealBudgetCa: +((ca / Math.max(budgetMoisCa, 1)) * 100).toFixed(1),
      cumulBudget, cumulRealise, txRealPrev: +((cumulRealise / Math.max(cumulBudget, 1)) * 100).toFixed(1),
      poids: p.poids,
    };
  });
}

export function ReportObjectifsANF({ data, suffix }: { data: Data; suffix: string }) {
  const rows = useMemo(() => buildR2(data), [data]);
  const exportRows = rows.map(r => ({
    Produit: r.produit, "PGHT pays": r.pght, Ventes: r.ventes, "Budget Mois": r.budgetMois,
    "Taux de réalisation (%)": r.tauxReal, "Ventes An-1": r.ventesAn1, "Taux d'évolution (%)": r.tauxEvol,
    "Chiffres d'affaire (CA)": r.ca, "Budget Mois CA": r.budgetMoisCa, "Tx Real Budget CA (%)": r.txRealBudgetCa,
    "Cumul Budget": r.cumulBudget, "Cumul Réalisé": r.cumulRealise,
    "Tx de réalisation prév. (%)": r.txRealPrev, "Poids (%)": r.poids,
  }));
  return (
    <ReportCard title="Rapport 2 · Objectifs ventes ANF (tous pays)" subtitle="Suivi par produit — tous pays confondus"
      rows={exportRows} filename={`r2-objectifs-anf-${suffix}`}>
      <Table minWidth={1500}>
        <thead className="bg-surface"><tr>
          <TH>Produit</TH><TH right>PGHT pays</TH><TH right>Ventes</TH><TH right>Budget Mois</TH>
          <TH right>Tx réal. %</TH><TH right>Ventes An-1</TH><TH right>Tx évol. %</TH>
          <TH right>CA</TH><TH right>Budget CA</TH><TH right>Tx Real CA %</TH>
          <TH right>Cumul Budget</TH><TH right>Cumul Réalisé</TH><TH right>Tx réal. prév. %</TH><TH right>Poids %</TH>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-border/60">
              <TD>{r.produit}</TD>
              <TD right mute>{r.pght}</TD><TD right>{fmt(r.ventes)}</TD><TD right mute>{fmt(r.budgetMois)}</TD>
              <TD right><span className={r.tauxReal >= 100 ? "text-primary" : "text-amber-500"}>{pct(r.tauxReal)}</span></TD>
              <TD right mute>{fmt(r.ventesAn1)}</TD>
              <TD right><span className={r.tauxEvol >= 0 ? "text-primary" : "text-destructive"}>{pct(r.tauxEvol)}</span></TD>
              <TD right>{eur(r.ca)}</TD><TD right mute>{eur(r.budgetMoisCa)}</TD>
              <TD right>{pct(r.txRealBudgetCa)}</TD>
              <TD right mute>{fmt(r.cumulBudget)}</TD><TD right>{fmt(r.cumulRealise)}</TD>
              <TD right>{pct(r.txRealPrev)}</TD><TD right>{r.poids}%</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

/* ===================================================================== */
/* RAPPORT 3 / 3bis — Ventes par produit × pays                          */
/* ===================================================================== */
function buildR3(d: Data, kind: "un" | "ca") {
  return d.products.slice(0, 60).map(p => {
    const row: Record<string, string | number> = { produit: p.name };
    let total = 0;
    for (const c of d.visibleCountries) {
      const r = prodRand(p.id + c.code + kind);
      const baseUn = (p.ventes / Math.max(COUNTRIES.length, 1)) * d.agencyFactor * (0.6 + r() * 0.9);
      const v = kind === "un" ? Math.round(baseUn) : +(baseUn * p.pghtPays).toFixed(2);
      row[c.code] = v;
      total += v;
    }
    row.total = kind === "un" ? Math.round(total) : +total.toFixed(2);
    return row;
  });
}

function ReportPaysGrid({ data, suffix, kind, title, subtitle, file }: {
  data: Data; suffix: string; kind: "un" | "ca"; title: string; subtitle: string; file: string;
}) {
  const rows = useMemo(() => buildR3(data, kind), [data, kind]);
  const exportRows = rows.map(r => {
    const o: Record<string, unknown> = { Produit: r.produit };
    for (const c of data.visibleCountries) o[`${c.name.toUpperCase()} (${kind === "un" ? "UN" : "CA euro"})`] = r[c.code];
    o["TOTAL ANF"] = r.total;
    return o;
  });
  return (
    <ReportCard title={title} subtitle={subtitle} rows={exportRows} filename={`${file}-${suffix}`}>
      <Table minWidth={200 + data.visibleCountries.length * 110}>
        <thead className="bg-surface"><tr>
          <TH>Produit</TH>
          {data.visibleCountries.map(c => <TH key={c.code} right>{c.name} {kind === "un" ? "(UN)" : "(CA €)"}</TH>)}
          <TH right>TOTAL ANF</TH>
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              <TD>{r.produit}</TD>
              {data.visibleCountries.map(c => <TD key={c.code} right mute>{kind === "un" ? fmt(Number(r[c.code])) : eur(Number(r[c.code]))}</TD>)}
              <TD right>{kind === "un" ? fmt(Number(r.total)) : eur(Number(r.total))}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

export function ReportVentesUnits({ data, suffix }: { data: Data; suffix: string }) {
  return <ReportPaysGrid data={data} suffix={suffix} kind="un"
    title="Rapport 3 · Ventes par unités (produit × pays)" subtitle="Nombre d'unités vendues par pays sur le mois"
    file="r3-ventes-un" />;
}
export function ReportVentesCA({ data, suffix }: { data: Data; suffix: string }) {
  return <ReportPaysGrid data={data} suffix={suffix} kind="ca"
    title="Rapport 3 bis · Ventes par CA (produit × pays)" subtitle="CA en euros par pays sur le mois"
    file="r3bis-ventes-ca" />;
}

/* ===================================================================== */
/* RAPPORT 4 / 4bis — Évolution produit × mois (pour un pays / TOTAL)    */
/* ===================================================================== */
function buildR4(d: Data, kind: "un" | "ca") {
  const targets = d.selectedCountry ? [d.selectedCountry] : COUNTRIES.map(c => c.code);
  return d.products.slice(0, 60).map(p => {
    const row: Record<string, string | number> = { produit: p.name };
    let total = 0;
    for (let m = 0; m < 12; m++) {
      let v = 0;
      for (const cc of targets) {
        const r = prodRand(p.id + cc + MONTHS[m] + kind);
        const baseUn = (p.ventes / 12 / Math.max(COUNTRIES.length, 1)) * d.agencyFactor * (0.6 + r() * 0.9);
        v += kind === "un" ? Math.round(baseUn) : baseUn * p.pghtPays;
      }
      row[MONTHS[m]] = kind === "un" ? Math.round(v) : +v.toFixed(2);
      total += kind === "un" ? Math.round(v) : v;
    }
    row.total = kind === "un" ? Math.round(total) : +total.toFixed(2);
    if (kind === "un") {
      const rs = prodRand(p.id + "fr");
      row.stockFrance = Math.round(p.ventes * 0.25 * (0.7 + rs() * 0.6));
      row.resteFrance = Math.round(p.ventes * 0.12 * (0.7 + rs() * 0.6));
    }
    return row;
  });
}

export function ReportEvolutionUN({ data, suffix }: { data: Data; suffix: string; countries?: unknown }) {
  const rows = useMemo(() => buildR4(data, "un"), [data]);
  const paysLabel = data.selectedCountry || "TOTAL ANF";
  const exportRows = rows.map(r => {
    const o: Record<string, unknown> = { [`Produit (${paysLabel})`]: r.produit };
    for (const m of MONTHS) o[`${m.toLowerCase()} (UN)`] = r[m];
    o.Total = r.total; o["STOCK France"] = r.stockFrance; o["RESTE À RECEVOIR France"] = r.resteFrance;
    return o;
  });
  return (
    <ReportCard title="Rapport 4 · Évolution ventes mois par mois — Unités"
      subtitle={`Produit × mois — ${paysLabel} · inclut stock France & reste à recevoir`}
      rows={exportRows} filename={`r4-evolution-un-${suffix}`}>
      <Table minWidth={1600}>
        <thead className="bg-surface"><tr>
          <TH>Produit ({paysLabel})</TH>
          {MONTHS.map(m => <TH key={m} right>{m}</TH>)}
          <TH right>Total</TH><TH right>Stock FR</TH><TH right>Reste FR</TH>
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              <TD>{r.produit}</TD>
              {MONTHS.map(m => <TD key={m} right mute>{fmt(Number(r[m]))}</TD>)}
              <TD right>{fmt(Number(r.total))}</TD>
              <TD right mute>{fmt(Number(r.stockFrance))}</TD>
              <TD right mute>{fmt(Number(r.resteFrance))}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

export function ReportEvolutionCA({ data, suffix }: { data: Data; suffix: string; countries?: unknown }) {
  const rows = useMemo(() => buildR4(data, "ca"), [data]);
  const paysLabel = data.selectedCountry || "TOTAL ANF";
  const exportRows = rows.map(r => {
    const o: Record<string, unknown> = { [`Produit (${paysLabel})`]: r.produit };
    for (const m of MONTHS) o[`${m.toLowerCase()} (CA euro)`] = r[m];
    o.Total = r.total;
    return o;
  });
  return (
    <ReportCard title="Rapport 4 bis · Évolution ventes mois par mois — CA"
      subtitle={`Produit × mois — ${paysLabel} · CA en euros`}
      rows={exportRows} filename={`r4bis-evolution-ca-${suffix}`}>
      <Table minWidth={1500}>
        <thead className="bg-surface"><tr>
          <TH>Produit ({paysLabel})</TH>
          {MONTHS.map(m => <TH key={m} right>{m}</TH>)}
          <TH right>Total</TH>
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              <TD>{r.produit}</TD>
              {MONTHS.map(m => <TD key={m} right mute>{eur(Number(r[m]))}</TD>)}
              <TD right>{eur(Number(r.total))}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

/* ===================================================================== */
/* RAPPORT 5 / 5bis — Stocks (mois × pays)                                */
/* ===================================================================== */
function buildR5(d: Data, kind: "stock" | "encours") {
  return MONTHS.map(m => {
    const row: Record<string, string | number> = { mois: m };
    for (const c of d.visibleCountries) {
      const r = prodRand(m + c.code + kind);
      const base = kind === "stock" ? 3000 + r() * 14000 : 200 + r() * 2200;
      row[c.code] = Math.round(base * d.agencyFactor);
    }
    return row;
  });
}

function StocksGrid({ data, suffix, kind, title, subtitle, file }: {
  data: Data; suffix: string; kind: "stock" | "encours"; title: string; subtitle: string; file: string;
}) {
  const rows = useMemo(() => buildR5(data, kind), [data, kind]);
  const exportRows = rows.map(r => {
    const o: Record<string, unknown> = { Mois: r.mois };
    for (const c of data.visibleCountries) o[c.name.toUpperCase()] = r[c.code];
    return o;
  });
  return (
    <ReportCard title={title} subtitle={subtitle} rows={exportRows} filename={`${file}-${suffix}`}>
      <Table minWidth={200 + data.visibleCountries.length * 110}>
        <thead className="bg-surface"><tr>
          <TH>Mois</TH>
          {data.visibleCountries.map(c => <TH key={c.code} right>{c.name}</TH>)}
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60">
              <TD>{r.mois}</TD>
              {data.visibleCountries.map(c => <TD key={c.code} right mute>{fmt(Number(r[c.code]))}</TD>)}
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

export function ReportStocks({ data, suffix }: { data: Data; suffix: string }) {
  return <StocksGrid data={data} suffix={suffix} kind="stock"
    title="Rapport 5 · Situation stocks locaux par pays"
    subtitle="Stocks disponibles par mois et par pays" file="r5-stocks" />;
}
export function ReportStocksEnCours({ data, suffix }: { data: Data; suffix: string }) {
  return <StocksGrid data={data} suffix={suffix} kind="encours"
    title="Rapport 5 bis · Stocks en cours de livraison"
    subtitle="Quantités en cours par mois et par pays" file="r5bis-stocks-encours" />;
}

/* ===================================================================== */
/* RAPPORT 6 — Vue panoramique : produit sélectionnable × pays × mois     */
/* ===================================================================== */
export function ReportVuePanoramique({ data, suffix }: { data: Data; suffix: string }) {
  const [productId, setProductId] = useState<string>("");
  const products = data.products;
  const selected = products.find(p => p.id === productId) || products[0];

  const rows = useMemo(() => {
    if (!selected) return [] as Array<Record<string, string | number>>;
    return data.visibleCountries.map(c => {
      const row: Record<string, string | number> = { pays: c.name, code: c.code };
      let total = 0;
      for (const m of MONTHS) {
        const r = prodRand(selected.id + c.code + m + "r6");
        const v = Math.round((selected.ventes / 12 / Math.max(COUNTRIES.length, 1)) * data.agencyFactor * (0.5 + r() * 1.1));
        row[m] = v; total += v;
      }
      row.total = total;
      return row;
    });
  }, [selected, data]);

  const exportRows = rows.map(r => {
    const o: Record<string, unknown> = { Pays: r.pays };
    for (const m of MONTHS) o[`${m.toLowerCase()} (UN)`] = r[m];
    o.Total = r.total;
    return o;
  });

  return (
    <ReportCard
      title="Rapport 6 · Vue panoramique produit"
      subtitle={selected ? `Nombre d'unités vendues par mois et par pays — ${selected.name}` : "Aucun produit"}
      rows={exportRows} filename={`r6-vue-panoramique-${selected?.id ?? "none"}-${suffix}`}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium text-muted-foreground">Produit :</label>
        <select value={selected?.id ?? ""} onChange={e => setProductId(e.target.value)}
          className="h-9 min-w-[280px] rounded-lg border border-border bg-surface px-3 text-sm">
          {products.map((p: ProductPanoramic) => <option key={p.id} value={p.id}>{p.name} — {p.laboratory}</option>)}
        </select>
      </div>
      <Table minWidth={1300}>
        <thead className="bg-surface"><tr>
          <TH>Pays</TH>
          {MONTHS.map(m => <TH key={m} right>{m} (UN)</TH>)}
          <TH right>Total</TH>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={String(r.code)} className="border-t border-border/60">
              <TD>{r.pays}</TD>
              {MONTHS.map(m => <TD key={m} right mute>{fmt(Number(r[m]))}</TD>)}
              <TD right>{fmt(Number(r.total))}</TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}
