import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle, Boxes, Package, TrendingUp, Upload,
  Building2, Wallet, Activity, Eye, Pencil, Truck,
} from "lucide-react";
import { AppShell, StatusBadge } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useUser, getUser } from "@/lib/auth";
import { ImportModal } from "@/components/dashboard/ImportModal";
import { getAgencies, type Agency } from "@/lib/agencies";

interface DashboardStats {
  totals: {
    sales: number;
    stock: number;
    orders: number;
    inventoryValue: number;
    agencies: number;
    products: number;
    wholesalers: number;
  };
  topProducts: Array<{ cip: string; name: string; sales: number; stock: number; orders: number }>;
  topWholesalers: Array<{ id: string; name: string; sales: number; stock: number }>;
  lowStockProducts: Array<{ cip: string; name: string; sales: number; stock: number; orders: number }>;
  trends: Array<{ month: string; sales: number; stock: number; orders: number }>;
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Tableau de bord — OBCO" }] }),
  component: Dashboard,
  ssr: false, // Désactiver SSR pour éviter les problèmes avec les graphiques
});

function Dashboard() {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate({ to: "/login" });
    } else if (currentUser.mustChangePassword) {
      navigate({ to: "/change-password" });
    }
  }, [navigate]);

  if (!user) {
    return (
      <AppShell title="Tableau de bord" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </AppShell>
    );
  }

  return user.role === "admin" ? <AdminDash /> : <PharmacyDash />;
}

function PharmacyDash() {
  const [open, setOpen] = useState(false);
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Dashboard Pharmacy: Chargement des stats...");

    const loadDashboardStats = async () => {
      try {
        const token = localStorage.getItem("obco_token");
        if (!token) {
          console.error("❌ Pas de token");
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
        console.log(`📡 Appel API: ${apiUrl}/api/import/dashboard-stats`);

        const response = await fetch(`${apiUrl}/api/import/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`📡 Réponse API: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log("📊 Stats dashboard reçues:", data);
          setDashStats(data);
        } else {
          const text = await response.text();
          console.error("❌ Erreur API dashboard-stats:", response.status, text);
        }
      } catch (error) {
        console.error("❌ Erreur chargement stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <AppShell title="Tableau de bord" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des statistiques...</div>
        </div>
      </AppShell>
    );
  }

  const totalStock = dashStats?.totals.stock || 0;
  const totalSales = dashStats?.totals.sales || 0;
  const totalValue = dashStats?.totals.inventoryValue || 0;
  const lowStockCount = dashStats?.lowStockProducts.length || 0;

  return (
    <AppShell
      title="Tableau de bord"
      subtitle="Vue d'ensemble de vos sorties locales"
      actions={<>
        <Button variant="outline" size="sm" asChild><a href="/sorties-locales"><Activity className="mr-2 h-4 w-4" />Sorties Locales</a></Button>
        <Button size="sm" onClick={() => setOpen(true)}><Upload className="mr-2 h-4 w-4" />Importer des données</Button>
      </>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock Total</span>
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">{totalStock.toLocaleString("fr-FR")}</span>
            <span className="text-sm text-muted-foreground">unités</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "75%" }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{dashStats?.totals.products.toLocaleString("fr-FR")} produits · {dashStats?.totals.wholesalers} grossistes</p>
        </div>

        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ventes Mensuelles</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">{totalSales.toLocaleString("fr-FR")}</span>
            <span className="text-sm text-muted-foreground">unités</span>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm bg-primary/60`} style={{ opacity: 0.4 + (i / 12) * 0.6 }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Commandes: {dashStats?.totals.orders.toLocaleString("fr-FR")}</p>
        </div>

        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock Bas</span>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl">{lowStockCount}</span>
            <span className="text-sm text-muted-foreground">produits</span>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm ${i < 4 ? "bg-destructive/70" : "bg-warning/60"}`} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Produits avec stock {'<'} 50 unités</p>
        </div>

        <div className="bento-card md:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Évolution mensuelle</h3>
              <p className="text-xs text-muted-foreground">6 derniers mois · Stocks vs Ventes</p>
            </div>
            {dashStats && dashStats.trends.length > 1 && (
              <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                <TrendingUp className="h-3 w-3" />
                {Math.round(((dashStats.trends[dashStats.trends.length - 1].sales - dashStats.trends[0].sales) / dashStats.trends[0].sales) * 100)}%
              </div>
            )}
          </div>
          <div className="mt-6 h-64">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashStats?.trends || []} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="stock" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g1)" name="Stock" />
                  <Area type="monotone" dataKey="sales" stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#g2)" name="Ventes" />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-2 bg-primary text-primary-foreground border-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">Valeur Stock</span>
            <Wallet className="h-4 w-4" />
          </div>
          <div className="mt-4 font-display text-5xl">
            {totalValue > 1000000 ? `${(totalValue / 1000000).toFixed(1)}M` : `${(totalValue / 1000).toFixed(0)}k`}€
          </div>
          <p className="mt-2 text-xs opacity-80">Valeur totale de l'inventaire</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Commandes</div>
              <div className="text-lg font-semibold">{dashStats?.totals.orders.toLocaleString("fr-FR")}</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Produits</div>
              <div className="text-lg font-semibold">{dashStats?.totals.products}</div>
            </div>
          </div>
        </div>

        <TopProducts products={dashStats?.topProducts || []} />
        <TopWholesalers wholesalers={dashStats?.topWholesalers || []} />
        
      </div>

      <ImportModal open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}

function TopProducts({ products }: { products: Array<{ cip: string; name: string; sales: number; stock: number }> }) {
  return (
    <div className="bento-card md:col-span-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Top 5 Produits</h3>
          <p className="text-xs text-muted-foreground">Par volume de ventes</p>
        </div>
        <Package className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-4 space-y-3">
        {products.slice(0, 5).map((p, i) => (
          <div key={p.cip} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{p.cip}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{p.sales.toLocaleString("fr-FR")}</div>
              <div className="text-xs text-muted-foreground">ventes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopWholesalers({ wholesalers }: { wholesalers: Array<{ id: string; name: string; sales: number; stock: number }> }) {
  return (
    <div className="bento-card md:col-span-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Top 5 Grossistes</h3>
          <p className="text-xs text-muted-foreground">Par volume de ventes</p>
        </div>
        <Truck className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-4 space-y-3">
        {wholesalers.slice(0, 5).map((w, i) => (
          <div key={w.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{w.name}</div>
                <div className="text-xs text-muted-foreground">Stock: {w.stock.toLocaleString("fr-FR")}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{w.sales.toLocaleString("fr-FR")}</div>
              <div className="text-xs text-muted-foreground">ventes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



function AdminDash() {
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Dashboard Admin: Chargement des stats...");

    const loadDashboardStats = async () => {
      try {
        const token = localStorage.getItem("obco_token");
        if (!token) {
          console.error("❌ Pas de token");
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
        console.log(`📡 Appel API Admin: ${apiUrl}/api/import/dashboard-stats`);

        const response = await fetch(`${apiUrl}/api/import/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`📡 Réponse API Admin: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log("📊 Stats dashboard Admin reçues:", data);
          setDashStats(data);
        } else {
          const text = await response.text();
          console.error("❌ Erreur API dashboard-stats:", response.status, text);
        }
      } catch (error) {
        console.error("❌ Erreur chargement stats:", error);
      } finally {
        setLoading(false);
      }
    };

    // Charger les agences
    setAgencies(getAgencies());

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <AppShell title="Tableau de bord" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des statistiques...</div>
        </div>
      </AppShell>
    );
  }

  const totalStock = dashStats?.totals.stock || 0;
  const totalSales = dashStats?.totals.sales || 0;
  const totalValue = dashStats?.totals.inventoryValue || 0;
  const agencyCount = dashStats?.totals.agencies || 0;

  return (
    <AppShell
      title="Vue Générale"
      subtitle="Tableau de bord réseau"
      actions={<>
        <Button variant="outline" size="sm" asChild><a href="/rapports"><Activity className="mr-2 h-4 w-4" />Rapports</a></Button>
        <Button size="sm" asChild><a href="/agences"><Building2 className="mr-2 h-4 w-4" />Gérer les agences</a></Button>
      </>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Kpi className="md:col-span-4 bg-primary text-primary-foreground border-primary" highlight label="Valeur Totale Stocks" value={`${totalValue > 1000000 ? `${(totalValue / 1_000_000).toFixed(1)}M` : `${(totalValue / 1000).toFixed(0)}k`}€`} sub={`${agencyCount} agence(s) · réseau ANF`} icon={<Wallet className="h-4 w-4" />} />
        <Kpi className="md:col-span-4" label="Ventes Totales" value={totalSales.toLocaleString("fr-FR")} sub={`${dashStats?.totals.products} produits actifs`} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi className="md:col-span-4" label="Stocks Totaux" value={totalStock.toLocaleString("fr-FR")} sub="unités disponibles réseau" icon={<Boxes className="h-4 w-4" />} />

        <div className="bento-card md:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Évolution des ventes réseau</h3>
              <p className="text-xs text-muted-foreground">6 derniers mois · Toutes agences</p>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashStats?.trends || []} margin={{ left: -20, right: 8, top: 8 }}>
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
                  <Area type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#ga)" name="Ventes" />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-4">
          <h3 className="text-base font-semibold">Commandes par mois</h3>
          <p className="text-xs text-muted-foreground">Volume réseau</p>
          <div className="mt-6 h-64">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashStats?.trends || []} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="orders" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <TopProducts products={dashStats?.topProducts || []} />
        <TopWholesalers wholesalers={dashStats?.topWholesalers || []} />
       

        {agencies.length > 0 && (
          <div className="bento-card md:col-span-12">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Agences du réseau</h3>
              <Button variant="ghost" size="sm" asChild><a href="/agences">Voir tout →</a></Button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 text-left font-medium">Agence</th>
                    <th className="py-3 text-left font-medium">Pays</th>
                    <th className="py-3 text-left font-medium">Ville</th>
                    <th className="py-3 text-left font-medium">Contact</th>
                    <th className="py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.slice(0, 8).map(a => (
                    <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-surface/60">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-[11px] font-semibold text-accent-foreground">
                            {a.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <div className="font-medium">{a.name}</div>
                        </div>
                      </td>
                      <td className="py-3.5 text-muted-foreground">{a.country}</td>
                      <td className="py-3.5 text-muted-foreground">{a.city || "-"}</td>
                      <td className="py-3.5 text-muted-foreground text-sm">-</td>
                      <td className="py-3.5">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

// Composant Helper pour empêcher Recharts de crash au rendu serveur (SSR)
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Squelette de chargement temporaire pour éviter les sauts de mise en page (Layout Shifts)
    return <div className="h-64 w-full bg-accent/20 animate-pulse rounded-lg" />;
  }

  return <>{children}</>;
}