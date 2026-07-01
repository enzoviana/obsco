import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportStocksEnCours } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/stocks-en-cours")({
  head: () => ({ meta: [{ title: "Rapport 5 bis — Stocks + en cours — OBCO" }] }),
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
    <AppShell title="Rapport 5 bis — Stocks + en cours" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportStocksEnCours data={data} suffix={state.fileSuffix} year={state.selectedYear} />
    </AppShell>
  );
}
