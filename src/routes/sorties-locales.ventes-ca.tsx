import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportVentesCA } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/ventes-ca")({
  head: () => ({ meta: [{ title: "Rapport 3 bis — Ventes par CA — DATAFUSE" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const state = useScopeState();
  const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);
  useEffect(() => { if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" }); }, [navigate]);
  return (
    <AppShell title="Rapport 3 bis — Ventes par CA" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportVentesCA data={data.vCa} suffix={state.fileSuffix} />
    </AppShell>
  );
}
