import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as COUNTRIES, v as getAgencies, x as getPanoramicProducts, y as getGrossistes } from "./agencies-BIm1ZU-s.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, T as MapPin, W as Building2, g as Search, s as Truck, tt as Earth } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-ClS6A7yg.mjs";
import { n as exportXLSX } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sorties-locales.index-DLycWtfW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SortiesIndex() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [scope, setScope] = (0, import_react.useState)("all");
	const [countryCode, setCountryCode] = (0, import_react.useState)("CI");
	const [agencyId, setAgencyId] = (0, import_react.useState)("");
	const [supplierFilter, setSupplierFilter] = (0, import_react.useState)("all");
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [grossistes, setGrossistes] = (0, import_react.useState)([]);
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const [selectedYear, setSelectedYear] = (0, import_react.useState)(currentYear);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(currentMonth);
	const [monthlyDataByProduct, setMonthlyDataByProduct] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
	const monthOptions = [
		{
			value: 1,
			label: "Janvier"
		},
		{
			value: 2,
			label: "Février"
		},
		{
			value: 3,
			label: "Mars"
		},
		{
			value: 4,
			label: "Avril"
		},
		{
			value: 5,
			label: "Mai"
		},
		{
			value: 6,
			label: "Juin"
		},
		{
			value: 7,
			label: "Juillet"
		},
		{
			value: 8,
			label: "Août"
		},
		{
			value: 9,
			label: "Septembre"
		},
		{
			value: 10,
			label: "Octobre"
		},
		{
			value: 11,
			label: "Novembre"
		},
		{
			value: 12,
			label: "Décembre"
		}
	];
	const loadMonthlyData = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				year: selectedYear.toString(),
				month: selectedMonth.toString(),
				scope
			});
			if (scope === "country") params.append("countryCode", countryCode);
			else if (scope === "agency") params.append("agencyId", agencyId);
			const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/import/sorties-locales?${params}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } });
			if (response.ok) setMonthlyDataByProduct(await response.json());
			else {
				console.error("Erreur chargement données:", response.statusText);
				setMonthlyDataByProduct({});
			}
		} catch (error) {
			console.error("Erreur chargement données:", error);
			setMonthlyDataByProduct({});
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const ag = getAgencies();
		setAgencies(ag);
		setGrossistes(getGrossistes());
		if (!agencyId && ag[0]) setAgencyId(ag[0].id);
		const syncAgencies = () => setAgencies(getAgencies());
		const syncGrossistes = () => setGrossistes(getGrossistes());
		window.addEventListener("obco:agencies", syncAgencies);
		window.addEventListener("obco:gros", syncGrossistes);
		return () => {
			window.removeEventListener("obco:agencies", syncAgencies);
			window.removeEventListener("obco:gros", syncGrossistes);
		};
	}, [navigate, agencyId]);
	(0, import_react.useEffect)(() => {
		if (agencyId || scope !== "agency") loadMonthlyData();
	}, [
		selectedYear,
		selectedMonth,
		scope,
		countryCode,
		agencyId
	]);
	const products = getPanoramicProducts();
	const supplierView = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const g of grossistes) {
			if (g.status === "blocked" || g.status === "inactive") continue;
			if (supplierFilter !== "all" && g.partenaire !== supplierFilter) continue;
			let include = false;
			let factor = 1;
			if (scope === "all") include = true;
			else if (scope === "country") {
				if (g.country === countryCode) include = true;
			} else if (scope === "agency") {
				const ag = agencies.find((a) => a.id === agencyId);
				if (!ag) continue;
				if (g.scope === "agency" && g.agencyId === agencyId) {
					include = true;
					factor = 1;
				} else if (g.scope === "country" && g.country === ag.country) {
					const peers = agencies.filter((a) => a.country === ag.country).length || 1;
					include = true;
					factor = 1 / peers;
				}
			}
			if (!include) continue;
			const cur = map.get(g.partenaire);
			if (cur === void 0 || factor > cur) map.set(g.partenaire, factor);
		}
		return Array.from(map.entries()).map(([name, factor]) => ({
			name,
			factor
		}));
	}, [
		grossistes,
		agencies,
		scope,
		countryCode,
		agencyId,
		supplierFilter
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return products.filter((p) => !ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql));
	}, [products, q]);
	const scale = (n, f) => Math.round(n * f);
	const totals = (0, import_react.useMemo)(() => {
		const t = {};
		for (const sv of supplierView) t[sv.name] = {
			ventes: 0,
			stocks: 0,
			commandes: 0
		};
		for (const p of products) {
			const productData = monthlyDataByProduct[p.cip];
			if (!productData) continue;
			for (const sv of supplierView) {
				const f = productData[sv.name];
				if (!f) continue;
				t[sv.name].ventes += scale(f.ventes, sv.factor);
				t[sv.name].stocks += scale(f.stocks, sv.factor);
				t[sv.name].commandes += scale(f.commandes, sv.factor);
			}
		}
		return t;
	}, [
		products,
		supplierView,
		monthlyDataByProduct
	]);
	const scopeLabel = scope === "all" ? "Tous pays · toutes agences" : scope === "country" ? `Pays : ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode}` : `Agence : ${agencies.find((a) => a.id === agencyId)?.name ?? agencyId}`;
	const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;
	const handleExport = () => {
		const rows = [];
		for (const p of filtered) {
			const row = {
				CIP: p.cip,
				Produit: p.name,
				Laboratoire: p.laboratory
			};
			const productData = monthlyDataByProduct[p.cip];
			for (const sv of supplierView) {
				const f = productData?.[sv.name];
				if (!f) {
					row[`${sv.name} - Ventes`] = 0;
					row[`${sv.name} - Stocks`] = 0;
					row[`${sv.name} - Commandes`] = 0;
					continue;
				}
				row[`${sv.name} - Ventes`] = scale(f.ventes, sv.factor);
				row[`${sv.name} - Stocks`] = scale(f.stocks, sv.factor);
				row[`${sv.name} - Commandes`] = scale(f.commandes, sv.factor);
			}
			rows.push(row);
		}
		exportXLSX(`stocks-fournisseurs-${fileSuffix}`, {
			Fournisseurs: rows,
			_Filtre: [{
				scope,
				pays: countryCode,
				agence: agencyId,
				fournisseur: supplierFilter,
				libelle: scopeLabel,
				periode: `${monthOptions.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`
			}]
		});
		toast.success("Export XLSX téléchargé");
	};
	const supplierOptions = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const g of grossistes) {
			if (g.status === "blocked" || g.status === "inactive") continue;
			set.add(g.partenaire);
		}
		return Array.from(set).sort();
	}, [grossistes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Sorties Locales",
		subtitle: `Sorties Locales · ${scopeLabel}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: handleExport,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Exporter XLSX"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-6 rounded-2xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Période :"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedMonth,
							onChange: (e) => setSelectedMonth(Number(e.target.value)),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: monthOptions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.value,
								children: m.label
							}, m.value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedYear,
							onChange: (e) => setSelectedYear(Number(e.target.value)),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: yearOptions.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: y,
								children: y
							}, y))
						}),
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Chargement..."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-lg border border-border bg-surface p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "all",
									onClick: () => setScope("all"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5" }),
									label: "Tous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "country",
									onClick: () => setScope("country"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
									label: "Par pays"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "agency",
									onClick: () => setScope("agency"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }),
									label: "Par agence"
								})
							]
						}),
						scope === "country" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: countryCode,
							onChange: (e) => setCountryCode(e.target.value),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.code,
								children: [
									c.name,
									" (",
									c.code,
									")"
								]
							}, c.code))
						}),
						scope === "agency" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: agencyId,
							onChange: (e) => setAgencyId(e.target.value),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: agencies.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: a.id,
								children: [
									a.name,
									" — ",
									a.country
								]
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: supplierFilter,
								onChange: (e) => setSupplierFilter(e.target.value),
								className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "Tous fournisseurs"
								}), supplierOptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto text-xs text-muted-foreground",
							children: [supplierView.length, " fournisseur(s) visible(s)"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-3 mb-6",
				children: [supplierView.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-full rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground",
					children: "Aucun fournisseur ne correspond à ces filtres."
				}), supplierView.map((sv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium uppercase tracking-wider",
								children: sv.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 font-display text-2xl",
							children: totals[sv.name].stocks.toLocaleString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "unités en stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ventes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-foreground",
								children: totals[sv.name].ventes.toLocaleString("fr-FR")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Cmd ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-foreground",
								children: totals[sv.name].commandes.toLocaleString("fr-FR")
							})] })]
						})
					]
				}, sv.name))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-4 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher un produit…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				})
			}),
			supplierView.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[900px] text-[12px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-surface text-[10px] uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										rowSpan: 2,
										className: "px-3 py-2 text-left font-medium border-r border-border",
										children: "Produit"
									}),
									supplierView.map((sv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										colSpan: 3,
										className: "px-2 py-2 text-center font-semibold text-primary border-r border-border bg-primary/5",
										children: sv.name
									}, sv.name)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										colSpan: 3,
										className: "px-2 py-2 text-center font-semibold text-foreground bg-surface border-l-2 border-border",
										children: "Total"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-surface text-[10px] uppercase tracking-wider text-muted-foreground",
								children: [
									supplierView.map((sv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-1.5 py-1.5 text-right font-medium",
											children: "Ventes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-1.5 py-1.5 text-right font-medium",
											children: "Stocks"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-1.5 py-1.5 text-right font-medium border-r border-border",
											children: "Cmd"
										})
									] }, sv.name)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-1.5 py-1.5 text-right font-medium border-l-2 border-border",
										children: "Ventes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-1.5 py-1.5 text-right font-medium",
										children: "Stocks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-1.5 py-1.5 text-right font-medium",
										children: "Cmd"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.slice(0, 100).map((p) => {
								let rv = 0, rs = 0, rc = 0;
								const productData = monthlyDataByProduct[p.cip];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border/60 hover:bg-surface/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2.5 border-r border-border/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground font-mono",
												children: p.cip
											})]
										}),
										supplierView.map((sv) => {
											const f = productData?.[sv.name];
											if (!f) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-1.5 py-2.5 text-right text-muted-foreground",
													children: "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-1.5 py-2.5 text-right text-muted-foreground",
													children: "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-1.5 py-2.5 text-right text-muted-foreground border-r border-border/60",
													children: "—"
												})
											] }, sv.name);
											const ventes = scale(f.ventes, sv.factor);
											const stocks = scale(f.stocks, sv.factor);
											const commandes = scale(f.commandes, sv.factor);
											rv += ventes;
											rs += stocks;
											rc += commandes;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-1.5 py-2.5 text-right tabular-nums",
													children: ventes
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: `px-1.5 py-2.5 text-right tabular-nums ${stocks < 50 ? "text-warning font-medium" : ""}`,
													children: stocks
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-1.5 py-2.5 text-right tabular-nums text-muted-foreground border-r border-border/60",
													children: commandes
												})
											] }, sv.name);
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1.5 py-2.5 text-right tabular-nums font-semibold border-l-2 border-border bg-surface/40",
											children: rv.toLocaleString("fr-FR")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1.5 py-2.5 text-right tabular-nums font-semibold bg-surface/40",
											children: rs.toLocaleString("fr-FR")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-1.5 py-2.5 text-right tabular-nums font-semibold bg-surface/40",
											children: rc.toLocaleString("fr-FR")
										})
									]
								}, p.id);
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t-2 border-border bg-surface text-[11px] font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2.5 border-r border-border uppercase tracking-wider text-muted-foreground",
										children: "Total"
									}),
									supplierView.map((sv) => {
										const t = totals[sv.name];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums",
												children: t.ventes.toLocaleString("fr-FR")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums",
												children: t.stocks.toLocaleString("fr-FR")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums border-r border-border",
												children: t.commandes.toLocaleString("fr-FR")
											})
										] }, sv.name);
									}),
									(() => {
										const tv = supplierView.reduce((s, sv) => s + totals[sv.name].ventes, 0);
										const ts = supplierView.reduce((s, sv) => s + totals[sv.name].stocks, 0);
										const tc = supplierView.reduce((s, sv) => s + totals[sv.name].commandes, 0);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums border-l-2 border-border bg-primary/10",
												children: tv.toLocaleString("fr-FR")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums bg-primary/10",
												children: ts.toLocaleString("fr-FR")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-1.5 py-2.5 text-right tabular-nums bg-primary/10",
												children: tc.toLocaleString("fr-FR")
											})
										] });
									})()
								]
							}) })
						]
					})
				}), filtered.length > 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-3 text-xs text-muted-foreground",
					children: [
						"100 premiers / ",
						filtered.length,
						" résultats. Affinez la recherche pour voir plus."
					]
				})]
			})
		]
	});
}
function ScopeBtn({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
		children: [icon, label]
	});
}
//#endregion
export { SortiesIndex as component };
