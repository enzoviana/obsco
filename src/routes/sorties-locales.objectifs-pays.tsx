import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportObjectifsPays } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/objectifs-pays")({
  head: () => ({ meta: [{ title: "Rapport 1 — Objectifs ventes par pays — OBCO" }] }),
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
    <AppShell title="Rapport 1 — Objectifs ventes par pays" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportObjectifsPays
        data={data}
        suffix={state.fileSuffix}
        year={state.selectedYear}
        month={state.selectedMonth}
        scope={state.scope}
        countryCode={state.countryCode}
        agencyId={state.agencyId}
      />
    </AppShell>
  );
}
