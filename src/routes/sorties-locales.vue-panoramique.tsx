import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getUser } from "@/lib/auth";
import { ScopeSelector, useScopeState, useScopedReportData, ReportVuePanoramique } from "@/components/reports/shared";

export const Route = createFileRoute("/sorties-locales/vue-panoramique")({
  head: () => ({ meta: [{ title: "Rapport 6 — Vue panoramique produit — DATAFUSE" }] }),
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
    <AppShell title="Rapport 6 — Vue panoramique produit" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportVuePanoramique data={data} suffix={state.fileSuffix} />
    </AppShell>
  );
}
