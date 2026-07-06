import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportDataANF, ReportObjectifsANF } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/objectifs-anf")({
  head: () => ({ meta: [{ title: "Rapport 2 — Objectifs ventes ANF — OBCO" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const state = useScopeState();
  const data = useScopedReportDataANF(state.scope, state.countryCode, state.agencyId);
  useEffect(() => {
    if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
  }, [navigate]);
  return (
    <AppShell title="Rapport 2 — Objectifs ventes ANF" subtitle={`Sorties Locales · ${state.scopeLabel} · Pays ANF uniquement`}>
      <ScopeSelector {...state} />
      <ReportObjectifsANF
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
