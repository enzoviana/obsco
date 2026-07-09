import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { d as useScopeState, p as useScopedReportDataANF, r as ReportObjectifsANF, u as ScopeSelector } from "./shared-CJ4FFbG6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sorties-locales.objectifs-anf-CLEA8TB-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const navigate = useNavigate();
	const state = useScopeState();
	const data = useScopedReportDataANF(state.scope, state.countryCode, state.agencyId);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Rapport 2 — Objectifs ventes ANF",
		subtitle: `Sorties Locales · ${state.scopeLabel} · Pays ANF uniquement`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeSelector, { ...state }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportObjectifsANF, {
			data,
			suffix: state.fileSuffix,
			year: state.selectedYear,
			month: state.selectedMonth,
			scope: state.scope,
			countryCode: state.countryCode,
			agencyId: state.agencyId
		})]
	});
}
//#endregion
export { Page as component };
