import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { getAllProducts, productStats } from "@/lib/products";
import { useDashboardData } from "@/lib/useDashboardData";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Statistiques — OBCO" }] }),
  component: StatsPage,
});

const COLORS = ["var(--color-primary)", "oklch(0.72 0.1 158)", "oklch(0.5 0.12 200)", "var(--color-warning)", "var(--color-destructive)", "oklch(0.55 0.04 200)"];

function StatsPage() {
  const navigate = useNavigate();
  useEffect(() => { if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" }); }, [navigate]);

  const products = getAllProducts();
  const stats = productStats();
  const { globalTrend, stockTrend } = useDashboardData();

  const byCategory = useMemo(() => {
    const m = new Map<string, { count: number; value: number }>();
    for (const p of products) {
      const cur = m.get(p.category) ?? { count: 0, value: 0 };
      cur.count += 1; cur.value += p.stock * p.price;
      m.set(p.category, cur);
    }
    return Array.from(m, ([name, v]) => ({ name, count: v.count, value: +(v.value / 1000).toFixed(1) }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  const topLabs = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) m.set(p.laboratory, (m.get(p.laboratory) ?? 0) + p.stock);
    return Array.from(m, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [products]);

  const statusDist = [
    { name: "OK", value: products.filter(p => p.status === "ok").length, fill: "var(--color-primary)" },
    { name: "Faible", value: products.filter(p => p.status === "low").length, fill: "var(--color-warning)" },
    { name: "Critique", value: products.filter(p => p.status === "critical").length, fill: "var(--color-destructive)" },
    { name: "Rupture", value: products.filter(p => p.status === "rupture").length, fill: "oklch(0.45 0.18 25)" },
  ];

  return (
    <AppShell title="Statistiques & Analyses" subtitle="Vision analytique">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi label="Références" value={stats.total.toLocaleString("fr-FR")} />
        <MiniKpi label="Valeur totale" value={`€${(stats.value / 1_000_000).toFixed(2)}M`} highlight />
        <MiniKpi label="Catégories" value={String(byCategory.length)} />
        <MiniKpi label="Laboratoires" value={String(new Set(products.map(p => p.laboratory)).size)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="bento-card md:col-span-8">
          <h3 className="text-base font-semibold">Valeur d'inventaire — 6 mois</h3>
          <p className="text-xs text-muted-foreground">Tendance globale (€M)</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={globalTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="inventory" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#sg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-4">
          <h3 className="text-base font-semibold">Répartition par statut</h3>
          <p className="text-xs text-muted-foreground">État du catalogue</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {statusDist.map((s, i) => <Cell key={i} fill={s.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-7">
          <h3 className="text-base font-semibold">Top catégories par valeur</h3>
          <p className="text-xs text-muted-foreground">Valeur stock en k€</p>
          <div className="mt-6 h-80">
            <ResponsiveContainer>
              <BarChart data={byCategory.slice(0, 10)} layout="vertical" margin={{ left: 20, right: 16, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-5">
          <h3 className="text-base font-semibold">Top laboratoires</h3>
          <p className="text-xs text-muted-foreground">Volume de stock</p>
          <div className="mt-6 h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={topLabs} dataKey="value" nameKey="name" outerRadius={110}>
                  {topLabs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-12">
          <h3 className="text-base font-semibold">Évolution des ventes — 7 jours</h3>
          <p className="text-xs text-muted-foreground">Articles vendus quotidiennement</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <BarChart data={stockTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sales" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function MiniKpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"}`}>
      <div className={`text-[11px] uppercase tracking-wider ${highlight ? "opacity-80" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}
