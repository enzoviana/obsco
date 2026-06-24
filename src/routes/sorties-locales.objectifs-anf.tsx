import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportObjectifsANF } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/objectifs-anf")({
  head: () => ({ meta: [{ title: "Rapport 2 — Objectifs ventes ANF — DATAFUSE" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const state = useScopeState();
  const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);
  useEffect(() => { if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" }); }, [navigate]);
  return (
    <AppShell title="Rapport 2 — Objectifs ventes ANF" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportObjectifsANF data={data.objAnf} suffix={state.fileSuffix} />
    </AppShell>
  );
}
