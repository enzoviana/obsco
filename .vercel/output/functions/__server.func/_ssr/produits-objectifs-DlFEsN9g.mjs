import { t as COUNTRIES } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Search, n as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produits-objectifs-DlFEsN9g.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./produits-objectifs-DFuPAjHa.mjs");
var Route = createFileRoute("/produits-objectifs")({
	head: () => ({ meta: [{ title: "Objectifs produits par pays — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function CountryToolbar({ q, onQ, countryQ, onCountryQ, selected, toggle, selectAll, clearAll, countLabel }) {
	const filteredChips = COUNTRIES.filter((c) => {
		const ql = countryQ.toLowerCase().trim();
		return !ql || c.name.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 mb-4 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[200px] max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher un produit…",
						value: q,
						onChange: (e) => onQ(e.target.value),
						className: "pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-[180px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Filtrer les pays…",
						value: countryQ,
						onChange: (e) => onCountryQ(e.target.value),
						className: "pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground font-medium",
					children: countLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: selectAll,
						children: "Tout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: clearAll,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 mr-1" }), "Aucun"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-1.5",
			children: [filteredChips.map((c) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => toggle(c.code),
					className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border ${selected.has(c.code) ? "bg-primary text-primary-foreground border-primary" : "bg-surface text-muted-foreground border-border hover:text-foreground"}`,
					children: [
						c.code,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "opacity-70",
							children: ["· ", c.name]
						})
					]
				}, c.code);
			}), filteredChips.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground",
				children: "Aucun pays ne correspond"
			})]
		})]
	});
}
//#endregion
export { Route as n, CountryToolbar as t };
