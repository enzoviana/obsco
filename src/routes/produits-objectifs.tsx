import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Search, Save, Target, Copy, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser } from "@/lib/auth";
import {
  COUNTRIES, getPanoramicProducts, getProductObjectives, setProductObjectives,
  type ProductPanoramic,
} from "@/lib/agencies";
import { exportCSV, exportXLSX } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/produits-objectifs")({
  head: () => ({ meta: [{ title: "Objectifs produits par pays — OBCO" }] }),
  component: ObjectifsPage,
});

function ObjectifsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [countryQ, setCountryQ] = useState("");
  const [products, setProducts] = useState<ProductPanoramic[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(COUNTRIES.map(c => c.code)));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) { navigate({ to: "/login" }); return; }
    const list = getPanoramicProducts();
    setProducts(list);
    const m: Record<string, Record<string, number>> = {};
    for (const p of list) m[p.id] = getProductObjectives(p.id, p.budgetMois);
    setMatrix(m);
  }, [navigate]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return products.filter(p => !ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql) || p.laboratory.toLowerCase().includes(ql));
  }, [products, q]);

  const visibleCountries = useMemo(() => {
    const ql = countryQ.toLowerCase().trim();
    return COUNTRIES.filter(c =>
      selectedCountries.has(c.code) && (!ql || c.name.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql))
    );
  }, [selectedCountries, countryQ]);

  const updateCell = (pid: string, code: string, value: number) => {
    setMatrix(prev => ({ ...prev, [pid]: { ...prev[pid], [code]: value } }));
    setDirty(prev => new Set(prev).add(pid));
  };

  const fillRow = (pid: string, value: number) => {
    setMatrix(prev => {
      const row = { ...prev[pid] };
      for (const c of visibleCountries) row[c.code] = value;
      return { ...prev, [pid]: row };
    });
    setDirty(prev => new Set(prev).add(pid));
  };

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev => {
      const n = new Set(prev);
      if (n.has(code)) n.delete(code); else n.add(code);
      return n;
    });
  };

  const saveAll = () => {
    let count = 0;
    for (const pid of dirty) { setProductObjectives(pid, matrix[pid]); count++; }
    setDirty(new Set());
    toast.success(`${count} produit(s) enregistré(s)`);
  };

  const exportRows = () => filtered.map(p => {
    const row: Record<string, unknown> = { CIP: p.cip, Produit: p.name, Laboratoire: p.laboratory };
    let tot = 0;
    for (const c of visibleCountries) { const v = matrix[p.id]?.[c.code] ?? 0; row[c.name] = v; tot += v; }
    row["TOTAL"] = tot;
    return row;
  });

  return (
    <AppShell
      title="Objectifs produits par pays"
      subtitle="Quantités mensuelles cibles · éditable par cellule"
      actions={<>
        <Button variant="outline" size="sm" onClick={() => { exportCSV("objectifs-produits", exportRows()); toast.success("CSV téléchargé"); }}>
          <Download className="mr-2 h-4 w-4" />CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => { exportXLSX("objectifs-produits", { Objectifs: exportRows() }); toast.success("XLSX téléchargé"); }}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />XLSX
        </Button>
        <Button size="sm" disabled={dirty.size === 0} onClick={saveAll}>
          <Save className="mr-2 h-4 w-4" />Enregistrer ({dirty.size})
        </Button>
      </>}
    >
      <CountryToolbar
        q={q} onQ={setQ}
        countryQ={countryQ} onCountryQ={setCountryQ}
        selected={selectedCountries} toggle={toggleCountry}
        selectAll={() => setSelectedCountries(new Set(COUNTRIES.map(c => c.code)))}
        clearAll={() => setSelectedCountries(new Set())}
        countLabel={`${visibleCountries.length}/${COUNTRIES.length} pays`}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" style={{ minWidth: 360 + visibleCountries.length * 100 }}>
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 z-20 bg-surface px-3 py-2 text-left font-medium border-r border-border min-w-[280px]">
                  <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5" />Produit</span>
                </th>
                {visibleCountries.map(c => (
                  <th key={c.code} className="px-2 py-2 text-right font-semibold text-primary border-r border-border bg-primary/5" title={c.name}>
                    {c.code}
                  </th>
                ))}
                <th className="px-2 py-2 text-right font-medium bg-surface">TOTAL</th>
                <th className="px-2 py-2 text-center font-medium bg-surface w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={visibleCountries.length + 3} className="p-8 text-center text-muted-foreground">Aucun produit</td></tr>
              )}
              {visibleCountries.length === 0 && filtered.length > 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Sélectionnez au moins un pays</td></tr>
              )}
              {visibleCountries.length > 0 && filtered.slice(0, 100).map(p => {
                const row = matrix[p.id] || {};
                const total = visibleCountries.reduce((s, c) => s + (row[c.code] || 0), 0);
                return (
                  <tr key={p.id} className="border-t border-border/60 hover:bg-surface/40 group">
                    <td className="sticky left-0 z-10 bg-card group-hover:bg-surface/40 px-3 py-2 border-r border-border/60">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.cip} · {p.laboratory}</div>
                    </td>
                    {visibleCountries.map(c => (
                      <td key={c.code} className="px-1 py-1 border-r border-border/60">
                        <input
                          type="number" min={0}
                          value={row[c.code] ?? 0}
                          onChange={e => updateCell(p.id, c.code, Math.max(0, Number(e.target.value) || 0))}
                          className="w-full h-7 rounded border border-border bg-background px-1.5 text-right text-[11px] tabular-nums focus:border-primary focus:outline-none"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2 text-right tabular-nums font-medium">{total.toLocaleString("fr-FR")}</td>
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={() => {
                          const v = prompt(`Appliquer cette quantité à ${visibleCountries.length} pays visibles pour "${p.name}":`, String(row[visibleCountries[0]?.code] ?? 0));
                          if (v === null) return;
                          const n = Math.max(0, Number(v) || 0);
                          fillRow(p.id, n);
                        }}
                        title="Appliquer la même valeur à tous les pays visibles"
                        className="inline-flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            100 premiers / {filtered.length} produits. Affinez la recherche pour voir plus.
          </div>
        )}
      </div>
    </AppShell>
  );
}

export function CountryToolbar({
  q, onQ, countryQ, onCountryQ, selected, toggle, selectAll, clearAll, countLabel,
}: {
  q: string; onQ: (v: string) => void;
  countryQ: string; onCountryQ: (v: string) => void;
  selected: Set<string>; toggle: (code: string) => void;
  selectAll: () => void; clearAll: () => void;
  countLabel: string;
}) {
  const filteredChips = COUNTRIES.filter(c => {
    const ql = countryQ.toLowerCase().trim();
    return !ql || c.name.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql);
  });
  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un produit…" value={q} onChange={e => onQ(e.target.value)} className="pl-9" />
        </div>
        <div className="relative min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filtrer les pays…" value={countryQ} onChange={e => onCountryQ(e.target.value)} className="pl-9" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{countLabel}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>Tout</Button>
          <Button variant="outline" size="sm" onClick={clearAll}><X className="h-3.5 w-3.5 mr-1" />Aucun</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filteredChips.map(c => {
          const on = selected.has(c.code);
          return (
            <button
              key={c.code}
              onClick={() => toggle(c.code)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                on ? "bg-primary text-primary-foreground border-primary" : "bg-surface text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c.code} <span className="opacity-70">· {c.name}</span>
            </button>
          );
        })}
        {filteredChips.length === 0 && <span className="text-xs text-muted-foreground">Aucun pays ne correspond</span>}
      </div>
    </div>
  );
}
