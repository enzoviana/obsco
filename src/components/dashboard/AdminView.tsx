import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Building2, Eye, MoreHorizontal, Pencil, ShieldAlert, Wallet, Activity, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allPharmacies, totals, globalTrend } from "@/lib/mock-data";
import { StatusBadge } from "./PharmacyView";

export function AdminView() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary animate-pulse" />
            Global Command Center
          </div>
          <h1 className="mt-1 font-display text-4xl text-foreground sm:text-5xl">Network Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Aggregated intelligence across {totals.pharmacies} pharmacies · Real-time</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm"><Activity className="mr-2 h-4 w-4" />Live feed</Button>
          <Button size="sm"><Building2 className="mr-2 h-4 w-4" />Add pharmacy</Button>
        </div>
      </div>

      {/* KPI bento */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
        <KpiCard
          className="md:col-span-3"
          label="Total Pharmacies"
          value={String(totals.pharmacies)}
          sub="3 onboarding this month"
          icon={<Globe2 className="h-4 w-4" />}
        />
        <KpiCard
          className="md:col-span-3 bg-primary text-primary-foreground border-primary"
          label="Global Inventory Value"
          value={`€${(totals.inventoryValue / 1_000_000).toFixed(2)}M`}
          sub="+4.8% vs last month"
          highlight
          icon={<Wallet className="h-4 w-4" />}
        />
        <KpiCard
          className="md:col-span-3"
          label="Total Alerts"
          value={String(totals.alerts)}
          sub="Across all locations"
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <KpiCard
          className="md:col-span-3"
          label="Imports (24h)"
          value={String(totals.imports)}
          sub="12,481 items processed"
          icon={<Activity className="h-4 w-4" />}
        />

        {/* Charts */}
        <div className="bento-card md:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Network Inventory Value</h3>
              <p className="text-xs text-muted-foreground">6-month rolling · Aggregated across all pharmacies (€M)</p>
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-0.5 text-[11px]">
              <button className="rounded-md bg-card px-2.5 py-1 font-medium shadow-sm">6M</button>
              <button className="px-2.5 py-1 text-muted-foreground">1Y</button>
              <button className="px-2.5 py-1 text-muted-foreground">All</button>
            </div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <LineChart data={globalTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="inventory" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card md:col-span-4">
          <h3 className="text-base font-semibold">Alerts by Month</h3>
          <p className="text-xs text-muted-foreground">Network-wide volume</p>
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

        {/* Master table */}
        <div className="bento-card md:col-span-12">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-semibold">All Pharmacies</h3>
              <p className="text-xs text-muted-foreground">Master registry · Click a row to inspect</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 text-left font-medium">Pharmacy</th>
                  <th className="py-3 text-left font-medium">Location</th>
                  <th className="py-3 text-right font-medium">Inventory €</th>
                  <th className="py-3 text-right font-medium">Alerts</th>
                  <th className="py-3 text-left font-medium pl-6">Last sync</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPharmacies.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 transition-colors hover:bg-surface/60">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-[11px] font-semibold text-accent-foreground">
                          {p.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">ID #{String(p.id).padStart(4, "0")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-muted-foreground">{p.city}</td>
                    <td className="py-3.5 text-right tabular-nums font-medium">€{p.inventory.toLocaleString("fr-FR")}</td>
                    <td className="py-3.5 text-right tabular-nums">
                      <span className={p.alerts > 12 ? "text-destructive font-semibold" : ""}>{p.alerts}</span>
                    </td>
                    <td className="py-3.5 pl-6 text-muted-foreground text-xs">{p.sync}</td>
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
    </div>
  );
}

function KpiCard({
  className = "",
  label,
  value,
  sub,
  icon,
  highlight,
}: {
  className?: string;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  highlight?: boolean;
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
