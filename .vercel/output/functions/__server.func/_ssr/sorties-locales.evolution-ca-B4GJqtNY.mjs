import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-ClS6A7yg.mjs";
import { d as useScopeState, f as useScopedReportData, t as ReportEvolutionCA, u as ScopeSelector } from "./shared-dH4w1AId.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sorties-locales.evolution-ca-B4GJqtNY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const navigate = useNavigate();
	const state = useScopeState();
	const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Rapport 6 — Évolution CA",
		subtitle: `Sorties Locales · ${state.scopeLabel}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeSelector, { ...state }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportEvolutionCA, {
			data,
			suffix: state.fileSuffix,
			year: state.selectedYear,
			scope: state.scope,
			countryCode: state.countryCode,
			agencyId: state.agencyId
		})]
	});
}
//#endregion
export { Page as component };
