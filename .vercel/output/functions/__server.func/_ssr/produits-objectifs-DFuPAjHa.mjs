import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as getProductObjectives, N as setProductObjectives, t as COUNTRIES, x as getPanoramicProducts } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, I as Copy, N as FileSpreadsheet, _ as Save, g as Search, n as X, u as Target } from "../_libs/lucide-react.mjs";
import { n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produits-objectifs-DFuPAjHa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ObjectifsPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [countryQ, setCountryQ] = (0, import_react.useState)("");
	const [products, setProducts] = (0, import_react.useState)([]);
	const [matrix, setMatrix] = (0, import_react.useState)({});
	const [dirty, setDirty] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selectedCountries, setSelectedCountries] = (0, import_react.useState)(new Set(COUNTRIES.map((c) => c.code)));
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const list = getPanoramicProducts();
		setProducts(list);
		const m = {};
		for (const p of list) m[p.id] = getProductObjectives(p.id, p.budgetMois);
		setMatrix(m);
	}, [navigate]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return products.filter((p) => !ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql) || p.laboratory.toLowerCase().includes(ql));
	}, [products, q]);
	const visibleCountries = (0, import_react.useMemo)(() => {
		const ql = countryQ.toLowerCase().trim();
		return COUNTRIES.filter((c) => selectedCountries.has(c.code) && (!ql || c.name.toLowerCase().includes(ql) || c.code.toLowerCase().includes(ql)));
	}, [selectedCountries, countryQ]);
	const updateCell = (pid, code, value) => {
		setMatrix((prev) => ({
			...prev,
			[pid]: {
				...prev[pid],
				[code]: value
			}
		}));
		setDirty((prev) => new Set(prev).add(pid));
	};
	const fillRow = (pid, value) => {
		setMatrix((prev) => {
			const row = { ...prev[pid] };
			for (const c of visibleCountries) row[c.code] = value;
			return {
				...prev,
				[pid]: row
			};
		});
		setDirty((prev) => new Set(prev).add(pid));
	};
	const toggleCountry = (code) => {
		setSelectedCountries((prev) => {
			const n = new Set(prev);
			if (n.has(code)) n.delete(code);
			else n.add(code);
			return n;
		});
	};
	const saveAll = () => {
		let count = 0;
		for (const pid of dirty) {
			setProductObjectives(pid, matrix[pid]);
			count++;
		}
		setDirty(/* @__PURE__ */ new Set());
		toast.success(`${count} produit(s) enregistré(s)`);
	};
	const exportRows = () => filtered.map((p) => {
		const row = {
			CIP: p.cip,
			Produit: p.name,
			Laboratoire: p.laboratory
		};
		let tot = 0;
		for (const c of visibleCountries) {
			const v = matrix[p.id]?.[c.code] ?? 0;
			row[c.name] = v;
			tot += v;
		}
		row["TOTAL"] = tot;
		return row;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Objectifs produits par pays (UN)",
		subtitle: "Quantités mensuelles cibles · éditable par cellule",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => {
					exportCSV("objectifs-produits", exportRows());
					toast.success("CSV téléchargé");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "CSV"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => {
					exportXLSX("objectifs-produits", { Objectifs: exportRows() });
					toast.success("XLSX téléchargé");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "XLSX"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				disabled: dirty.size === 0,
				onClick: saveAll,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }),
					"Enregistrer (",
					dirty.size,
					")"
				]
			})
		] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryToolbar, {
			q,
			onQ: setQ,
			countryQ,
			onCountryQ: setCountryQ,
			selected: selectedCountries,
			toggle: toggleCountry,
			selectAll: () => setSelectedCountries(new Set(COUNTRIES.map((c) => c.code))),
			clearAll: () => setSelectedCountries(/* @__PURE__ */ new Set()),
			countLabel: `${visibleCountries.length}/${COUNTRIES.length} pays`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-2xl border border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-[12px]",
					style: { minWidth: 360 + visibleCountries.length * 100 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface text-[10px] uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "sticky left-0 z-20 bg-surface px-3 py-2 text-left font-medium border-r border-border min-w-[280px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), "Produit"]
									})
								}),
								visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-semibold text-primary border-r border-border bg-primary/5",
									title: c.name,
									children: c.code
								}, c.code)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium bg-surface",
									children: "TOTAL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium bg-surface w-20",
									children: "Action"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: visibleCountries.length + 3,
							className: "p-8 text-center text-muted-foreground",
							children: "Aucun produit"
						}) }),
						visibleCountries.length === 0 && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 3,
							className: "p-8 text-center text-muted-foreground",
							children: "Sélectionnez au moins un pays"
						}) }),
						visibleCountries.length > 0 && filtered.slice(0, 100).map((p) => {
							const row = matrix[p.id] || {};
							const total = visibleCountries.reduce((s, c) => s + (row[c.code] || 0), 0);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/60 hover:bg-surface/40 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "sticky left-0 z-10 bg-card group-hover:bg-surface/40 px-3 py-2 border-r border-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-muted-foreground font-mono",
											children: [
												p.cip,
												" · ",
												p.laboratory
											]
										})]
									}),
									visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-1 py-1 border-r border-border/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											value: row[c.code] ?? 0,
											onChange: (e) => updateCell(p.id, c.code, Math.max(0, Number(e.target.value) || 0)),
											className: "w-full h-7 rounded border border-border bg-background px-1.5 text-right text-[11px] tabular-nums focus:border-primary focus:outline-none"
										})
									}, c.code)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-right tabular-nums font-medium",
										children: total.toLocaleString("fr-FR")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												const v = prompt(`Appliquer cette quantité à ${visibleCountries.length} pays visibles pour "${p.name}":`, String(row[visibleCountries[0]?.code] ?? 0));
												if (v === null) return;
												const n = Math.max(0, Number(v) || 0);
												fillRow(p.id, n);
											},
											title: "Appliquer la même valeur à tous les pays visibles",
											className: "inline-flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:bg-primary/10 hover:text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, p.id);
						})
					] })]
				})
			}), filtered.length > 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-4 py-3 text-xs text-muted-foreground",
				children: [
					"100 premiers / ",
					filtered.length,
					" produits. Affinez la recherche pour voir plus."
				]
			})]
		})]
	});
}
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
export { CountryToolbar, ObjectifsPage as component };
