import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Download, Upload, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts, productStats } from "@/lib/products";
import { getUser } from "@/lib/auth";
import { ImportModal } from "@/components/dashboard/ImportModal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/stocks")({
  head: () => ({ meta: [{ title: "Stocks — DATAFUSE" }] }),
  component: StocksPage,
});

const PAGE_SIZE = 50;

function StocksPage() {
  const navigate = useNavigate();
  useEffect(() => { if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" }); }, [navigate]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const all = getAllProducts();
  const stats = productStats();

  const categories = useMemo(() => Array.from(new Set(all.map(p => p.category))).sort(), [all]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return all.filter(p => {
      if (cat !== "all" && p.category !== cat) return false;
      if (status !== "all" && p.status !== status) return false;
      if (ql && !p.name.toLowerCase().includes(ql) && !p.cip.includes(ql) && !p.id.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [all, q, cat, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetPage<T>(fn: (v: T) => void) {
    return (v: T) => { fn(v); setPage(1); };
  }

  return (
    <AppShell
      title="Gestion des stocks"
      subtitle={`${stats.total.toLocaleString("fr-FR")} références au catalogue`}
      actions={<>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Exporter CSV</Button>
        <Button size="sm" onClick={() => setOpen(true)}><Upload className="mr-2 h-4 w-4" />Importer</Button>
      </>}
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi label="Total références" value={stats.total.toLocaleString("fr-FR")} />
        <MiniKpi label="Valeur stock" value={`€${(stats.value / 1_000_000).toFixed(2)}M`} />
        <MiniKpi label="Sous seuil" value={stats.lowStock.toLocaleString("fr-FR")} tone="warning" />
        <MiniKpi label="Ruptures" value={stats.ruptures.toLocaleString("fr-FR")} tone="danger" />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, CIP ou référence…"
              value={q}
              onChange={(e) => resetPage(setQ)(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={cat} onValueChange={resetPage(setCat)}>
            <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={resetPage(setStatus)}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="rupture">Rupture</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" />Filtres avancés</Button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length.toLocaleString("fr-FR")} résultats</span>
          <span>Page {safePage} / {pageCount}</span>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-surface">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Référence</th>
                <th className="px-4 py-3 text-left font-medium">Produit</th>
                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium">Labo</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Seuil</th>
                <th className="px-4 py-3 text-right font-medium">Prix</th>
                <th className="px-4 py-3 text-left font-medium">Péremption</th>
                <th className="px-4 py-3 text-right font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {slice.map(p => (
                <tr key={p.id} className="border-t border-border/60 transition-colors hover:bg-surface/60">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">CIP {p.cip}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.laboratory}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{p.stock}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{p.threshold}</td>
                  <td className="px-4 py-3 text-right tabular-nums">€{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.expiry}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">Aucun produit ne correspond à votre recherche.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border bg-surface/60 px-4 py-3 text-sm">
          <span className="text-xs text-muted-foreground">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} sur {filtered.length.toLocaleString("fr-FR")}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(1)}>«</Button>
            <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs tabular-nums">{safePage} / {pageCount}</span>
            <Button variant="outline" size="sm" disabled={safePage === pageCount} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={safePage === pageCount} onClick={() => setPage(pageCount)}>»</Button>
          </div>
        </div>
      </div>

      <ImportModal open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}

function MiniKpi({ label, value, tone }: { label: string; value: string; tone?: "warning" | "danger" }) {
  const color = tone === "danger" ? "text-destructive" : tone === "warning" ? "text-warning-foreground" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl ${color}`}>{value}</div>
    </div>
  );
}
