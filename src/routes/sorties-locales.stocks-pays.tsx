import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportStocks } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/stocks-pays")({
  head: () => ({ meta: [{ title: "Rapport 7 — Stocks locaux pays — OBCO" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const state = useScopeState();
  const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);
  useEffect(() => {
    if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
  }, [navigate]);
  return (
    <AppShell title="Rapport 7 — Stocks locaux pays" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportStocks data={data} suffix={state.fileSuffix} year={state.selectedYear} />
    </AppShell>
  );
}
