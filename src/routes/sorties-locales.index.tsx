import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Search, Download, Truck, Globe2, MapPin, Building2, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUser } from "@/lib/auth";
import {
  COUNTRIES,
  getAgencies,
  getGrossistes,
  getPanoramicProducts,
  type Agency,
  type Grossiste,
} from "@/lib/agencies";
import { exportXLSX } from "@/lib/export";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

export const Route = createFileRoute("/sorties-locales/")({
  head: () => ({ meta: [{ title: "Sorties Locales — Sorties Locales — OBCO" }] }),
  component: SortiesIndex,
});

type Scope = "all" | "country" | "agency";

function SortiesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [countryCode, setCountryCode] = useState<string>("CI");
  const [agencyId, setAgencyId] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [grossistes, setGrossistes] = useState<Grossiste[]>([]);
  const [importOpen, setImportOpen] = useState(false);

  // Sélection de la période
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Données importées depuis la BDD
  const [monthlyDataByProduct, setMonthlyDataByProduct] = useState<Record<string, Record<string, { ventes: number; stocks: number; commandes: number }>>>({});
  const [loading, setLoading] = useState(false);

  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
  const monthOptions = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  // Charger les données depuis l'API
  const loadMonthlyData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        year: selectedYear.toString(),
        month: selectedMonth.toString(),
        scope,
      });

      if (scope === "country") {
        params.append("countryCode", countryCode);
      } else if (scope === "agency") {
        params.append("agencyId", agencyId);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com"}/api/import/sorties-locales?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("obco_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMonthlyDataByProduct(data);
      } else {
        console.error("Erreur chargement données:", response.statusText);
        setMonthlyDataByProduct({});
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
      setMonthlyDataByProduct({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getUser()) {
      navigate({ to: "/login" });
      return;
    }

    // Charger les données initiales
    const ag = getAgencies();
    setAgencies(ag);
    setGrossistes(getGrossistes());
    if (!agencyId && ag[0]) setAgencyId(ag[0].id);

    // Écouter les changements des agences et grossistes
    const syncAgencies = () => setAgencies(getAgencies());
    const syncGrossistes = () => setGrossistes(getGrossistes());

    window.addEventListener("obco:agencies", syncAgencies);
    window.addEventListener("obco:gros", syncGrossistes);

    return () => {
      window.removeEventListener("obco:agencies", syncAgencies);
      window.removeEventListener("obco:gros", syncGrossistes);
    };
  }, [navigate, agencyId]);

  // Charger les données quand la période ou le scope change
  useEffect(() => {
    if (agencyId || scope !== "agency") {
      loadMonthlyData();
    }
  }, [selectedYear, selectedMonth, scope, countryCode, agencyId]);

  const products = getPanoramicProducts();

  const supplierView = useMemo(() => {
    const map = new Map<string, number>();
    // Accepter tous les grossistes, pas seulement ceux dans SUPPLIERS
    for (const g of grossistes) {
      if (g.status === "blocked" || g.status === "inactive") continue;
      if (supplierFilter !== "all" && g.partenaire !== supplierFilter) continue;
      let include = false;
      let factor = 1;
      if (scope === "all") include = true;
      else if (scope === "country") {
        if (g.country === countryCode) include = true;
      } else if (scope === "agency") {
        const ag = agencies.find((a) => a.id === agencyId);
        if (!ag) continue;
        // Tous les grossistes du pays de l'agence sont inclus
        if (g.country === ag.country) {
          const peers = agencies.filter((a) => a.country === ag.country).length || 1;
          include = true;
          factor = 1 / peers;
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
    return products.filter((p) => !ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql));
  }, [products, q]);

  const scale = (n: number, f: number) => Math.round(n * f);

  const totals = useMemo(() => {
    const t: Record<string, { ventes: number; stocks: number; commandes: number }> = {};
    for (const sv of supplierView) t[sv.name] = { ventes: 0, stocks: 0, commandes: 0 };

    // Utiliser les données importées au lieu des données factices
    for (const p of products) {
      const productData = monthlyDataByProduct[p.cip];
      if (!productData) continue;

      for (const sv of supplierView) {
        const f = productData[sv.name];
        if (!f) continue;
        t[sv.name].ventes += scale(f.ventes, sv.factor);
        t[sv.name].stocks += scale(f.stocks, sv.factor);
        t[sv.name].commandes += scale(f.commandes, sv.factor);
      }
    }
    return t;
  }, [products, supplierView, monthlyDataByProduct]);

  const scopeLabel =
    scope === "all"
      ? "Tous pays · toutes agences"
      : scope === "country"
        ? `Pays : ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode}`
        : `Agence : ${agencies.find((a) => a.id === agencyId)?.name ?? agencyId}`;

  const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;

  const handleExport = () => {
    const rows: Record<string, unknown>[] = [];
    for (const p of filtered) {
      const row: Record<string, unknown> = { CIP: p.cip, Produit: p.name, Laboratoire: p.laboratory };
      const productData = monthlyDataByProduct[p.cip];

      for (const sv of supplierView) {
        const f = productData?.[sv.name];
        if (!f) {
          row[`${sv.name} - Ventes`] = 0;
          row[`${sv.name} - Stocks`] = 0;
          row[`${sv.name} - Commandes`] = 0;
          continue;
        }
        row[`${sv.name} - Ventes`] = scale(f.ventes, sv.factor);
        row[`${sv.name} - Stocks`] = scale(f.stocks, sv.factor);
        row[`${sv.name} - Commandes`] = scale(f.commandes, sv.factor);
      }
      rows.push(row);
    }
    exportXLSX(`stocks-fournisseurs-${fileSuffix}`, {
      Fournisseurs: rows,
      _Filtre: [{
        scope,
        pays: countryCode,
        agence: agencyId,
        fournisseur: supplierFilter,
        libelle: scopeLabel,
        periode: `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
      }],
    });
    toast.success("Export XLSX téléchargé");
  };

  const supplierOptions = useMemo(() => {
    const set = new Set<string>();
    // Récupérer TOUS les grossistes actifs, pas seulement ceux dans SUPPLIERS
    for (const g of grossistes) {
      if (g.status === "blocked" || g.status === "inactive") continue;
      set.add(g.partenaire);
    }
    return Array.from(set).sort();
  }, [grossistes]);

  const user = getUser();
  const isSuperAdmin = user?.role === "admin";

  return (
    <AppShell
      title="Sorties Locales"
      subtitle={`Sorties Locales · ${scopeLabel}`}
      actions={<>
        {isSuperAdmin && (
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" />Importer CSV</Button>
            </DialogTrigger>
            <ImportSortiesDialog
              onClose={() => setImportOpen(false)}
              agencies={agencies}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onSuccess={() => loadMonthlyData()}
            />
          </Dialog>
        )}
        <Button size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter XLSX
        </Button>
      </>}
    >
      <section className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-xs font-medium text-muted-foreground">Période :</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {loading && <span className="text-xs text-muted-foreground">Chargement...</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            <ScopeBtn
              active={scope === "all"}
              onClick={() => setScope("all")}
              icon={<Globe2 className="h-3.5 w-3.5" />}
              label="Tous"
            />
            <ScopeBtn
              active={scope === "country"}
              onClick={() => setScope("country")}
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Par pays"
            />
            <ScopeBtn
              active={scope === "agency"}
              onClick={() => setScope("agency")}
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Par agence"
            />
          </div>
          {scope === "country" && (
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}
          {scope === "agency" && (
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.country}
                </option>
              ))}
            </select>
          )}
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              <option value="all">Tous fournisseurs</option>
              {supplierOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{supplierView.length} fournisseur(s) visible(s)</span>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {supplierView.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Aucun fournisseur ne correspond à ces filtres.
          </div>
        )}
        {supplierView.map((sv) => (
          <div key={sv.name} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">{sv.name}</span>
            </div>
            <div className="mt-3 font-display text-2xl">{totals[sv.name].stocks.toLocaleString("fr-FR")}</div>
            <div className="text-[11px] text-muted-foreground">unités en stock</div>
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>
                Ventes <b className="text-foreground">{totals[sv.name].ventes.toLocaleString("fr-FR")}</b>
              </span>
              <span>
                Cmd <b className="text-foreground">{totals[sv.name].commandes.toLocaleString("fr-FR")}</b>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {supplierView.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-[12px]">
              <thead>
                <tr className="bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th rowSpan={2} className="px-3 py-2 text-left font-medium border-r border-border">
                    Produit
                  </th>
                  {supplierView.map((sv) => (
                    <th
                      key={sv.name}
                      colSpan={3}
                      className="px-2 py-2 text-center font-semibold text-primary border-r border-border bg-primary/5"
                    >
                      {sv.name}
                    </th>
                  ))}
                  <th colSpan={3} className="px-2 py-2 text-center font-semibold text-foreground bg-surface border-l-2 border-border">
                    Total
                  </th>
                </tr>
                <tr className="bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
                  {supplierView.map((sv) => (
                    <Fragment key={sv.name}>
                      <th className="px-1.5 py-1.5 text-right font-medium">Ventes</th>
                      <th className="px-1.5 py-1.5 text-right font-medium">Stocks</th>
                      <th className="px-1.5 py-1.5 text-right font-medium border-r border-border">Cmd</th>
                    </Fragment>
                  ))}
                  <th className="px-1.5 py-1.5 text-right font-medium border-l-2 border-border">Ventes</th>
                  <th className="px-1.5 py-1.5 text-right font-medium">Stocks</th>
                  <th className="px-1.5 py-1.5 text-right font-medium">Cmd</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map((p) => {
                  let rv = 0, rs = 0, rc = 0;
                  const productData = monthlyDataByProduct[p.cip];

                  return (
                    <tr key={p.id} className="border-t border-border/60 hover:bg-surface/40">
                      <td className="px-3 py-2.5 border-r border-border/60">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{p.cip}</div>
                      </td>
                      {supplierView.map((sv) => {
                        const f = productData?.[sv.name];
                        if (!f)
                          return (
                            <Fragment key={sv.name}>
                              <td className="px-1.5 py-2.5 text-right text-muted-foreground">—</td>
                              <td className="px-1.5 py-2.5 text-right text-muted-foreground">—</td>
                              <td className="px-1.5 py-2.5 text-right text-muted-foreground border-r border-border/60">
                                —
                              </td>
                            </Fragment>
                          );
                        const ventes = scale(f.ventes, sv.factor);
                        const stocks = scale(f.stocks, sv.factor);
                        const commandes = scale(f.commandes, sv.factor);
                        rv += ventes; rs += stocks; rc += commandes;
                        return (
                          <Fragment key={sv.name}>
                            <td className="px-1.5 py-2.5 text-right tabular-nums">{ventes}</td>
                            <td
                              className={`px-1.5 py-2.5 text-right tabular-nums ${stocks < 50 ? "text-warning font-medium" : ""}`}
                            >
                              {stocks}
                            </td>
                            <td className="px-1.5 py-2.5 text-right tabular-nums text-muted-foreground border-r border-border/60">
                              {commandes}
                            </td>
                          </Fragment>
                        );
                      })}
                      <td className="px-1.5 py-2.5 text-right tabular-nums font-semibold border-l-2 border-border bg-surface/40">{rv.toLocaleString("fr-FR")}</td>
                      <td className="px-1.5 py-2.5 text-right tabular-nums font-semibold bg-surface/40">{rs.toLocaleString("fr-FR")}</td>
                      <td className="px-1.5 py-2.5 text-right tabular-nums font-semibold bg-surface/40">{rc.toLocaleString("fr-FR")}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-surface text-[11px] font-semibold">
                  <td className="px-3 py-2.5 border-r border-border uppercase tracking-wider text-muted-foreground">Total</td>
                  {supplierView.map((sv) => {
                    const t = totals[sv.name];
                    return (
                      <Fragment key={sv.name}>
                        <td className="px-1.5 py-2.5 text-right tabular-nums">{t.ventes.toLocaleString("fr-FR")}</td>
                        <td className="px-1.5 py-2.5 text-right tabular-nums">{t.stocks.toLocaleString("fr-FR")}</td>
                        <td className="px-1.5 py-2.5 text-right tabular-nums border-r border-border">{t.commandes.toLocaleString("fr-FR")}</td>
                      </Fragment>
                    );
                  })}
                  {(() => {
                    const tv = supplierView.reduce((s, sv) => s + totals[sv.name].ventes, 0);
                    const ts = supplierView.reduce((s, sv) => s + totals[sv.name].stocks, 0);
                    const tc = supplierView.reduce((s, sv) => s + totals[sv.name].commandes, 0);
                    return (
                      <>
                        <td className="px-1.5 py-2.5 text-right tabular-nums border-l-2 border-border bg-primary/10">{tv.toLocaleString("fr-FR")}</td>
                        <td className="px-1.5 py-2.5 text-right tabular-nums bg-primary/10">{ts.toLocaleString("fr-FR")}</td>
                        <td className="px-1.5 py-2.5 text-right tabular-nums bg-primary/10">{tc.toLocaleString("fr-FR")}</td>
                      </>
                    );
                  })()}
                </tr>
              </tfoot>
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

function ScopeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ImportSortiesDialog({
  onClose,
  agencies,
  selectedYear,
  selectedMonth,
  onSuccess,
}: {
  onClose: () => void;
  agencies: Agency[];
  selectedYear: number;
  selectedMonth: number;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [agencyId, setAgencyId] = useState<string>(agencies[0]?.id || "");
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState(selectedMonth);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
  const monthOptions = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());

      if (lines.length < 2) {
        toast.error("Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données");
        return;
      }

      // Parser l'en-tête en utilisant un séparateur intelligent
      const separator = text.includes(";") ? ";" : ",";
      const rawHeaders = lines[0].split(separator).map(h => h.trim());
      const headers = rawHeaders.map(h => h.toLowerCase());

      // Détecter le format : simple (cip, grossiste, ventes...) ou wide (produit, GROSSISTE1 - Ventes, GROSSISTE1 - Stocks...)
      const cipIdx = headers.findIndex(h => h.includes("cip") || h.includes("code"));
      const nameIdx = headers.findIndex(h => h.includes("nom") || h === "name" || h.includes("produit") || h === "produit");
      const wholesalerIdx = headers.findIndex(h => h.includes("grossiste") && !h.includes("-"));

      // Détecter les colonnes de grossistes (format: "GROSSISTE - Ventes/Stocks/Cmds")
      const wholesalerColumns: { name: string; salesIdx: number; stockIdx: number; ordersIdx: number }[] = [];
      const processedWholesalers = new Set<string>();

      for (let i = 0; i < rawHeaders.length; i++) {
        const header = rawHeaders[i];
        const lowerHeader = headers[i];

        // Détecter les patterns: "GROSSISTE - Ventes", "GROSSISTE - Stocks", "GROSSISTE - Cmds"
        const match = header.match(/^(.+?)\s*-\s*(ventes?|sales?|sortie|stocks?|commandes?|cmds?|orders?)$/i);
        if (match) {
          const wholesalerName = match[1].trim();
          const type = match[2].toLowerCase();

          if (!processedWholesalers.has(wholesalerName)) {
            processedWholesalers.add(wholesalerName);

            // Trouver les 3 colonnes pour ce grossiste
            let salesIdx = -1, stockIdx = -1, ordersIdx = -1;

            for (let j = 0; j < rawHeaders.length; j++) {
              const h = rawHeaders[j];
              if (h.startsWith(wholesalerName + " -") || h.startsWith(wholesalerName + "-")) {
                const lower = h.toLowerCase();
                if (lower.includes("vente") || lower.includes("sales") || lower.includes("sortie")) {
                  salesIdx = j;
                } else if (lower.includes("stock")) {
                  stockIdx = j;
                } else if (lower.includes("cmd") || lower.includes("commande") || lower.includes("order")) {
                  ordersIdx = j;
                }
              }
            }

            wholesalerColumns.push({
              name: wholesalerName,
              salesIdx,
              stockIdx,
              ordersIdx,
            });
          }
        }
      }

      // Déterminer le format
      const isWideFormat = wholesalerColumns.length > 0;
      let rows: any[] = [];

      if (isWideFormat) {
        // Format WIDE : une ligne = un produit avec plusieurs grossistes en colonnes
        console.log(`📊 Format détecté: WIDE avec ${wholesalerColumns.length} grossiste(s)`);

        if (nameIdx === -1) {
          toast.error("Le CSV doit contenir une colonne 'Produit' ou 'Nom'");
          return;
        }

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(separator).map(v => v.trim());
          if (values.length < 2) continue;

          const productName = values[nameIdx] || "";
          if (!productName) continue;

          // Extraire le CIP du nom du produit (souvent au début)
          let productCip = "";
          if (cipIdx !== -1 && values[cipIdx]) {
            productCip = values[cipIdx];
          } else {
            // Essayer d'extraire un code numérique du nom
            const cipMatch = productName.match(/^(\d+)/);
            if (cipMatch) {
              productCip = cipMatch[1];
            } else {
              productCip = productName.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "");
            }
          }

          // Créer une ligne pour chaque grossiste
          for (const wc of wholesalerColumns) {
            const sales = wc.salesIdx !== -1 && values[wc.salesIdx]
              ? parseInt(values[wc.salesIdx].replace(/[^\d]/g, "")) || 0
              : 0;
            const stock = wc.stockIdx !== -1 && values[wc.stockIdx]
              ? parseInt(values[wc.stockIdx].replace(/[^\d]/g, "")) || 0
              : 0;
            const orders = wc.ordersIdx !== -1 && values[wc.ordersIdx]
              ? parseInt(values[wc.ordersIdx].replace(/[^\d]/g, "")) || 0
              : 0;

            // Ne créer une ligne que si au moins une valeur est non nulle
            if (sales > 0 || stock > 0 || orders > 0) {
              rows.push({
                productCip,
                productName,
                wholesalerName: wc.name,
                sales,
                stock,
                orders,
              });
            }
          }
        }
      } else {
        // Format SIMPLE : une ligne = un produit + un grossiste
        console.log("📊 Format détecté: SIMPLE (une ligne par produit/grossiste)");

        if (cipIdx === -1 || wholesalerIdx === -1) {
          toast.error("Le CSV doit contenir au minimum les colonnes 'cip' et 'grossiste'");
          return;
        }

        const salesIdx = headers.findIndex(h => h.includes("vente") || h === "sales" || h.includes("sortie"));
        const stockIdx = headers.findIndex(h => h.includes("stock"));
        const ordersIdx = headers.findIndex(h => h.includes("commande") || h === "orders" || h.includes("cmd"));
        const countryIdx = headers.findIndex(h => h.includes("country") || h === "pays" || h.includes("countrycode"));
        const cityIdx = headers.findIndex(h => h.includes("ville") || h === "city");

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(separator).map(v => v.trim());
          if (values.length < 2) continue;

          const row: any = {
            productCip: values[cipIdx] || "",
            wholesalerName: values[wholesalerIdx] || "",
          };

          if (nameIdx !== -1 && values[nameIdx]) row.productName = values[nameIdx];
          if (salesIdx !== -1 && values[salesIdx]) {
            const sales = parseInt(values[salesIdx].replace(/[^\d]/g, ""));
            if (!isNaN(sales)) row.sales = sales;
          }
          if (stockIdx !== -1 && values[stockIdx]) {
            const stock = parseInt(values[stockIdx].replace(/[^\d]/g, ""));
            if (!isNaN(stock)) row.stock = stock;
          }
          if (ordersIdx !== -1 && values[ordersIdx]) {
            const orders = parseInt(values[ordersIdx].replace(/[^\d]/g, ""));
            if (!isNaN(orders)) row.orders = orders;
          }
          if (countryIdx !== -1 && values[countryIdx]) row.countryCode = values[countryIdx].toUpperCase();
          if (cityIdx !== -1 && values[cityIdx]) row.city = values[cityIdx];

          if (row.productCip && row.wholesalerName) {
            rows.push(row);
          }
        }
      }

      setPreview(rows);
      if (rows.length === 0) {
        toast.error("Aucune donnée valide trouvée dans le fichier");
      } else {
        toast.success(`${rows.length} ligne(s) prête(s) à être importées`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast.error("Aucune donnée à importer");
      return;
    }

    if (!agencyId) {
      toast.error("Veuillez sélectionner une agence");
      return;
    }

    setLoading(true);
    try {
      const result = await apiPost<{
        success: boolean;
        message: string;
        created: number;
        updated: number;
        wholesalersCreated: number;
        errors: string[];
        error?: string;
      }>("/api/import/sorties-locales-csv", {
        year,
        month,
        agencyId,
        data: preview,
      });

      if (result.success) {
        toast.success(result.message);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Erreur lors de l'import");
      }

      if (result.errors && result.errors.length > 0) {
        console.error("Erreurs d'import:", result.errors);
        toast.warning(`${result.errors.length} erreur(s) rencontrée(s). Voir la console.`);
      }
    } catch (error: any) {
      console.error("Erreur d'import:", error);
      toast.error(error.message || "Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Offrir deux formats de template
    const choice = confirm("Quel format de CSV souhaitez-vous télécharger ?\n\nOK = Format WIDE (colonnes par grossiste)\nAnnuler = Format SIMPLE (une ligne par grossiste)");

    let csvContent: string;
    let filename: string;

    if (choice) {
      // Format WIDE (ancien format Excel)
      csvContent = "Produit;DUOPHARM - Ventes;DUOPHARM - Stocks;DUOPHARM - Cmds;LABOREX SENEGAL - Ventes;LABOREX SENEGAL - Stocks;LABOREX SENEGAL - Cmds;SODIPHARM - Ventes;SODIPHARM - Stocks;SODIPHARM - Cmds\n";
      csvContent += "Paracétamol 500mg;150;200;50;120;180;30;80;100;20\n";
      csvContent += "Ibuprofène 400mg;200;250;60;150;200;40;90;120;25";
      filename = "template_sorties_locales_wide.csv";
    } else {
      // Format SIMPLE
      csvContent = "cip,nom,grossiste,ventes,stocks,commandes,countryCode,ville\n";
      csvContent += "3400936000001,Paracétamol 500mg,CAMED,150,200,50,CI,Abidjan\n";
      csvContent += "3400938000002,Ibuprofène 400mg,LABOREX MALI,120,180,30,ML,Bamako";
      filename = "template_sorties_locales_simple.csv";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    toast.success("Modèle téléchargé");
  };

  return (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Importer les sorties locales via CSV</DialogTitle>
        <DialogDescription>
          Importez les données de sorties locales. Les grossistes inexistants seront créés automatiquement.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Agence *</Label>
            <Select value={agencyId} onValueChange={setAgencyId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {agencies.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Année *</Label>
            <Select value={year.toString()} onValueChange={v => setYear(parseInt(v))}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mois *</Label>
            <Select value={month.toString()} onValueChange={v => setMonth(parseInt(v))}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(m => (
                  <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Fichier CSV</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Colonnes requises : <b>cip</b>, <b>grossiste</b>. Colonnes optionnelles : nom, ventes, stocks, commandes, countryCode, ville
          </p>
        </div>

        {file && preview.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Aperçu ({preview.length} lignes)</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-card sticky top-0">
                  <tr className="border-b border-border">
                    <th className="px-2 py-2 text-left font-medium">Code CIP</th>
                    <th className="px-2 py-2 text-left font-medium">Produit</th>
                    <th className="px-2 py-2 text-left font-medium">Grossiste</th>
                    <th className="px-2 py-2 text-right font-medium">Ventes</th>
                    <th className="px-2 py-2 text-right font-medium">Stocks</th>
                    <th className="px-2 py-2 text-right font-medium">Commandes</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 50).map((p, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-2 py-2 font-mono text-xs">{p.productCip}</td>
                      <td className="px-2 py-2">{p.productName || "-"}</td>
                      <td className="px-2 py-2">{p.wholesalerName}</td>
                      <td className="px-2 py-2 text-right">{p.sales || 0}</td>
                      <td className="px-2 py-2 text-right">{p.stock || 0}</td>
                      <td className="px-2 py-2 text-right">{p.orders || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 50 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  ... et {preview.length - 50} autres lignes
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="ghost" size="sm" onClick={downloadTemplate}>
          <Download className="h-3.5 w-3.5 mr-1.5" />Télécharger un modèle
        </Button>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={handleImport} disabled={loading || preview.length === 0 || !agencyId}>
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          {loading ? "Import en cours..." : `Importer ${preview.length} ligne(s)`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
