import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowUpRight, Boxes, Download, Package, TrendingUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/lib/useDashboardData";
import { ImportModal } from "./ImportModal";

export function PharmacyView() {
  const [importOpen, setImportOpen] = useState(false);
  const { pharmacy, stockTrend, lowStockItems, recentImports } = useDashboardData();

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      {/* Page header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-primary">Operational dashboard</div>
          <h1 className="mt-1 truncate font-display text-4xl text-foreground sm:text-5xl">{pharmacy.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pharmacy.city} · Live inventory sync · Updated 2 min ago</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" onClick={() => setImportOpen(true)}><Upload className="mr-2 h-4 w-4" />Import Data</Button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Stock level - big */}
        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">My Stock Level</span>
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl text-foreground">{pharmacy.stockLevel}%</span>
            <span className="text-sm text-primary font-medium">+3.2%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pharmacy.stockLevel}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{pharmacy.totalSkus} active SKUs in catalog</p>
        </div>

        {/* Alerts */}
        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Low Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl text-foreground">{pharmacy.lowStockAlerts}</span>
            <span className="text-sm text-muted-foreground">items</span>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-8 flex-1 rounded-sm ${i < 4 ? "bg-destructive/70" : "bg-warning/60"}`} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">4 critical · 8 below threshold</p>
        </div>

        {/* Imports */}
        <div className="bento-card md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent Imports</span>
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-5xl text-foreground">{pharmacy.recentImports}</span>
            <span className="text-sm text-muted-foreground">this week</span>
          </div>
          <div className="mt-4 flex -space-x-1">
            {recentImports.slice(0, 4).map((imp) => (
              <div key={imp.id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-accent text-[10px] font-semibold text-accent-foreground">
                {imp.items}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">513 items processed total</p>
        </div>

        {/* Chart - wide */}
        <div className="bento-card md:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Stock Trends</h3>
              <p className="text-xs text-muted-foreground">Last 7 days · Inventory vs Sales velocity</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>+12.4%</span>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
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

        {/* Revenue card */}
        <div className="bento-card md:col-span-2 bg-primary text-primary-foreground border-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">Monthly Revenue</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <span className="font-display text-5xl">€{(pharmacy.monthlyRevenue / 1000).toFixed(1)}k</span>
          </div>
          <p className="mt-2 text-xs opacity-80">+8.4% vs last month</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Orders</div>
              <div className="text-lg font-semibold">1,284</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-3">
              <div className="text-[10px] uppercase opacity-70">Avg ticket</div>
              <div className="text-lg font-semibold">€37.6</div>
            </div>
          </div>
        </div>

        {/* Low stock table */}
        <div className="bento-card md:col-span-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Low Stock Items</h3>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </div>
          <div className="mt-4 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 text-left font-medium">SKU</th>
                  <th className="py-2.5 text-left font-medium">Product</th>
                  <th className="py-2.5 text-right font-medium">Stock</th>
                  <th className="py-2.5 text-right font-medium">Threshold</th>
                  <th className="py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.sku} className="border-b border-border/60 last:border-0 hover:bg-surface/60">
                    <td className="py-3 font-mono text-xs text-muted-foreground">{item.sku}</td>
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-right tabular-nums">{item.stock}</td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">{item.threshold}</td>
                    <td className="py-3 text-right">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent imports list */}
        <div className="bento-card md:col-span-2">
          <h3 className="text-base font-semibold">Recent Imports</h3>
          <div className="mt-4 space-y-3">
            {recentImports.map((imp) => (
              <div key={imp.id} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{imp.id}</div>
                  <div className="text-[11px] text-muted-foreground">{imp.date} · {imp.items} items</div>
                </div>
                <StatusBadge status={imp.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImportModal open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "bg-destructive/10", text: "text-destructive", label: "Critical" },
    low: { bg: "bg-warning/15", text: "text-warning-foreground", label: "Low" },
    completed: { bg: "bg-primary/12", text: "text-primary", label: "Completed" },
    processing: { bg: "bg-accent", text: "text-accent-foreground", label: "Processing" },
    active: { bg: "bg-primary/12", text: "text-primary", label: "Active" },
    warning: { bg: "bg-warning/15", text: "text-warning-foreground", label: "Attention" },
  };
  const v = map[status] ?? map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${v.bg} ${v.text}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {v.label}
    </span>
  );
}

export { StatusBadge };
