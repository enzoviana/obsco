import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportEvolutionCA } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/evolution-ca")({
  head: () => ({ meta: [{ title: "Rapport 6 — Évolution CA — OBCO" }] }),
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
    <AppShell title="Rapport 6 — Évolution CA" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportEvolutionCA
        data={data}
        suffix={state.fileSuffix}
        year={state.selectedYear}
        scope={state.scope}
        countryCode={state.countryCode}
        agencyId={state.agencyId}
      />
    </AppShell>
  );
}
