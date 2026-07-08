import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";

interface AdvancedStats {
  summary: {
    totalProducts: number;
    totalCategories: number;
    totalLaboratories: number;
    totalValue: number;
  };
  byCategory: Array<{ name: string; count: number; value: number; stock: number; sales: number }>;
  topLabs: Array<{ name: string; value: number; sales: number; valueEuro: number }>;
  statusDist: Array<{ name: string; value: number }>;
  trends: Array<{ month: string; inventory: number; sales: number; stock: number; orders: number }>;
}

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Statistiques — OBCO" }] }),
  component: StatsPage,
  loader: () => {
    console.log("📦 Stats loader appelé");
    return null;
  },
});

const COLORS = ["var(--color-primary)", "oklch(0.72 0.1 158)", "oklch(0.5 0.12 200)", "var(--color-warning)", "var(--color-destructive)", "oklch(0.55 0.04 200)"];

function StatsPage() {
  console.log("🎯 StatsPage component rendered");

  const navigate = useNavigate();
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("✅ Premier useEffect: setMounted(true)");
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("🔍 Deuxième useEffect: mounted =", mounted);

    if (!mounted) {
      console.log("⏸️ mounted = false, on attend...");
      return;
    }

    if (typeof window === "undefined") {
      console.log("⏸️ window undefined, on attend...");
      return;
    }

    console.log("🔍 Stats Page: Vérification utilisateur...");

    const user = getUser();
    console.log("👤 User:", user);

    if (!user) {
      console.log("❌ Stats Page: Pas d'utilisateur, redirection");
      navigate({ to: "/login" });
      return;
    }

    console.log("✅ Stats Page: Utilisateur connecté, chargement des stats...");

    const loadStats = async () => {
      try {
        const token = localStorage.getItem("obco_token");
        if (!token) {
          console.error("❌ Pas de token");
          setLoading(false);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
        console.log(`📡 Appel API: ${apiUrl}/api/import/advanced-stats`);

        const response = await fetch(`${apiUrl}/api/import/advanced-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`📡 Réponse API: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log("📊 Stats avancées reçues:", data);
          setStats(data);
        } else {
          const text = await response.text();
          console.error("❌ Erreur API advanced-stats:", response.status, text);
        }
      } catch (error) {
        console.error("❌ Erreur chargement stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [mounted, navigate]);

  if (!mounted) {
    return (
      <AppShell title="Statistiques & Analyses" subtitle="Initialisation...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Initialisation...</div>
        </div>
      </AppShell>
    );
  }

  if (loading || !stats) {
    return (
      <AppShell title="Statistiques & Analyses" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des statistiques...</div>
        </div>
      </AppShell>
    );
  }

  const statusDist = stats.statusDist.map(s => ({
    ...s,
    fill: s.name === "OK" ? "var(--color-primary)"
        : s.name === "Faible" ? "var(--color-warning)"
        : s.name === "Critique" ? "var(--color-destructive)"
        : "oklch(0.45 0.18 25)"
  }));

  return (
    <AppShell title="Statistiques & Analyses" subtitle="Vision analytique basée sur vos données réelles">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi label="Références" value={stats.summary.totalProducts.toLocaleString("fr-FR")} />
        <MiniKpi
          label="Valeur totale"
          value={stats.summary.totalValue > 1000000
            ? `€${(stats.summary.totalValue / 1_000_000).toFixed(2)}M`
            : `€${(stats.summary.totalValue / 1000).toFixed(0)}k`}
          highlight
        />
        <MiniKpi label="Catégories" value={String(stats.summary.totalCategories)} />
        <MiniKpi label="Laboratoires" value={String(stats.summary.totalLaboratories)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="bento-card md:col-span-8">
          <h3 className="text-base font-semibold">Évolution des stocks — 6 derniers mois</h3>
          <p className="text-xs text-muted-foreground">Tendance globale (unités)</p>
          <div className="mt-6 h-72">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends} margin={{ left: -20, right: 8, top: 8 }}>
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
                  <Area type="monotone" dataKey="stock" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#sg)" name="Stock" />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-4">
          <h3 className="text-base font-semibold">Répartition par statut</h3>
          <p className="text-xs text-muted-foreground">État des stocks</p>
          <div className="mt-6 h-72">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {statusDist.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-7">
          <h3 className="text-base font-semibold">Top catégories par valeur</h3>
          <p className="text-xs text-muted-foreground">Valeur stock en k€</p>
          <div className="mt-6 h-80">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory.slice(0, 10)} layout="vertical" margin={{ left: 20, right: 16, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} width={140} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-5">
          <h3 className="text-base font-semibold">Top laboratoires</h3>
          <p className="text-xs text-muted-foreground">Volume de stock</p>
          <div className="mt-6 h-80">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.topLabs} dataKey="value" nameKey="name" outerRadius={110}>
                    {stats.topLabs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="bento-card md:col-span-12">
          <h3 className="text-base font-semibold">Évolution des ventes — 6 derniers mois</h3>
          <p className="text-xs text-muted-foreground">Unités vendues mensuellement</p>
          <div className="mt-6 h-64">
            <ClientOnly>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trends} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="sales" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="Ventes" />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
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

// Composant Helper pour empêcher Recharts de crash au rendu serveur (SSR)
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="h-full w-full bg-accent/20 animate-pulse rounded-lg" />;
  }

  return <>{children}</>;
}
