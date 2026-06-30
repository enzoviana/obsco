import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle, ArrowUpRight, Boxes, Download, Package, TrendingUp, Upload,
  Building2, ShieldAlert, Wallet, Activity, Globe2, Eye, Pencil, MoreHorizontal,
} from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useUser, getUser } from "@/lib/auth";
import { ImportModal } from "@/components/dashboard/ImportModal";
import { getAllProducts, productStats } from "@/lib/products";
import { useDashboardData } from "@/lib/useDashboardData";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Tableau de bord — DATAFUSE" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUser = getUser();
      if (!currentUser) {
        navigate({ to: "/login" });
      } else if (currentUser.mustChangePassword) {
        navigate({ to: "/change-password" });
      }
    }
  }, [navigate, user]);

  if (!user) return null;
  return user.role === "admin" ? <AdminDash /> : <PharmacyDash />;
}

function PharmacyDash() {
  const [open, setOpen] = useState(false);
  const stats = productStats();
  const { stockTrend, recentImports } = useDashboardData();

  return (
    <AppShell
      title="ANF Abidjan"
      subtitle="Tableau opérationnel de votre agence"
      actions={<>
        <Button variant="outline" size="sm" asChild><a href="/import"><Download className="mr-2 h-4 w-4" />Modèle CSV</a></Button>
        <Button size="sm" onClick={() => setOpen(true)}><Upload className="mr-2 h-4 w-4" />Importer des données</Button>
      </>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Niveau de stock</span>
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">87%</span>
            <span className="text-sm text-primary font-medium">+3,2%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "87%" }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{stats.total.toLocaleString("fr-FR")} références au catalogue</p>
        </div>

        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Alertes stock</span>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">{stats.lowStock.toLocaleString("fr-FR")}</span>
            <span className="text-sm text-muted-foreground">produits</span>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm ${i < 4 ? "bg-destructive/70" : "bg-warning/60"}`} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{stats.ruptures} en rupture · {stats.lowStock - stats.ruptures} sous seuil</p>
        </div>

        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Imports récents</span>
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">4</span>
            <span className="text-sm text-muted-foreground">cette semaine</span>
          </div>
          <div className="mt-4 flex -space-x-1">
            {recentImports.slice(0, 4).map(imp => (
              <div key={imp.id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-accent text-[10px] font-semibold text-accent-foreground">
                {imp.items}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">513 articles traités au total</p>
        </div>

        <div className="bento-card md:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Évolution du stock</h3>
              <p className="text-xs text-muted-foreground">7 derniers jours · Inventaire vs Ventes</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              <TrendingUp className="h-3 w-3" /> +12,4%
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <AreaChart data={stockTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="stock" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="sales" stroke="var(--color-chart-3)" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-2 bg-primary text-primary-foreground border-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">Chiffre d'affaires</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div className="mt-4 font-display text-5xl">€48,2k</div>
          <p className="mt-2 text-xs opacity-80">+8,4% vs mois dernier</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Commandes</div>
              <div className="text-lg font-semibold">1 284</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Ticket moyen</div>
              <div className="text-lg font-semibold">€37,6</div>
            </div>
          </div>
        </div>

        <TopLowStock />
      </div>

      <ImportModal open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}

function TopLowStock() {
  const items = getAllProducts()
    .filter(p => p.status === "critical" || p.status === "rupture")
    .slice(0, 6);
  return (
    <div className="bento-card md:col-span-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Produits en alerte critique</h3>
        <Button variant="ghost" size="sm" className="text-xs" asChild>
          <a href="/stocks">Voir tous les stocks →</a>
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 text-left font-medium">Réf</th>
              <th className="py-2.5 text-left font-medium">Produit</th>
              <th className="py-2.5 text-left font-medium">Laboratoire</th>
              <th className="py-2.5 text-right font-medium">Stock</th>
              <th className="py-2.5 text-right font-medium">Seuil</th>
              <th className="py-2.5 text-right font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-surface/60">
                <td className="py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-muted-foreground">{p.laboratory}</td>
                <td className="py-3 text-right tabular-nums">{p.stock}</td>
                <td className="py-3 text-right tabular-nums text-muted-foreground">{p.threshold}</td>
                <td className="py-3 text-right"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDash() {
  const { allPharmacies, totals, globalTrend } = useDashboardData();

  return (
    <AppShell
      title="Centre de commandement"
      subtitle="Vision réseau ANF · temps réel"
      actions={<>
        <Button variant="outline" size="sm" asChild><a href="/rapports"><Activity className="mr-2 h-4 w-4" />Rapports</a></Button>
        <Button size="sm" asChild><a href="/agences"><Building2 className="mr-2 h-4 w-4" />Créer une agence</a></Button>
      </>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Kpi className="md:col-span-4 bg-primary text-primary-foreground border-primary" highlight label="Ventes Totales Mensuelles" value={`€${(totals.inventoryValue / 1_000_000).toFixed(2)}M`} sub="+8,4% vs mois précédent" icon={<Wallet className="h-4 w-4" />} />
        <Kpi className="md:col-span-4" label="Commandes Totales Mensuelles" value={(totals.pharmacies * 184).toLocaleString("fr-FR")} sub={`${totals.pharmacies} agences · réseau ANF`} icon={<Activity className="h-4 w-4" />} />
        <Kpi className="md:col-span-4" label="Stocks Totaux Mensuel" value={(totals.pharmacies * 12480).toLocaleString("fr-FR")} sub="unités disponibles réseau" icon={<Boxes className="h-4 w-4" />} />

        <div className="bento-card md:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Valeur d'inventaire réseau</h3>
              <p className="text-xs text-muted-foreground">6 mois glissants · Toutes agences (€M)</p>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <AreaChart data={globalTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="inventory" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#ga)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-4">
          <h3 className="text-base font-semibold">Alertes par mois</h3>
          <p className="text-xs text-muted-foreground">Volume réseau</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <BarChart data={globalTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="alerts" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-12">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Agences du réseau</h3>
            <Button variant="ghost" size="sm" asChild><a href="/agences">Voir tout →</a></Button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 text-left font-medium">Pharmacie</th>
                  <th className="py-3 text-left font-medium">Ville</th>
                  <th className="py-3 text-right font-medium">Inventaire €</th>
                  <th className="py-3 text-right font-medium">Alertes</th>
                  <th className="py-3 text-left font-medium pl-6">Sync</th>
                  <th className="py-3 text-left font-medium">Statut</th>
                  <th className="py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPharmacies.slice(0, 8).map(p => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-surface/60">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-[11px] font-semibold text-accent-foreground">
                          {p.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div><div className="font-medium">{p.name}</div><div className="text-[11px] text-muted-foreground">#{String(p.id).padStart(4, "0")}</div></div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground">{p.city}</td>
                    <td className="py-3.5 text-right tabular-nums font-medium">€{p.inventory.toLocaleString("fr-FR")}</td>
                    <td className="py-3.5 text-right tabular-nums">{p.alerts}</td>
                    <td className="py-3.5 pl-6 text-muted-foreground text-xs">il y a {p.sync.replace("min ago", "min")}</td>
                    <td className="py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ className = "", label, value, sub, icon, highlight }: {
  className?: string; label: string; value: string; sub: string; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`bento-card ${className}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium uppercase tracking-wider ${highlight ? "opacity-80" : "text-muted-foreground"}`}>{label}</span>
        <span className={highlight ? "opacity-90" : "text-primary"}>{icon}</span>
      </div>
      <div className="mt-4 font-display text-4xl">{value}</div>
      <p className={`mt-2 text-xs ${highlight ? "opacity-80" : "text-muted-foreground"}`}>{sub}</p>
    </div>
  );
}
