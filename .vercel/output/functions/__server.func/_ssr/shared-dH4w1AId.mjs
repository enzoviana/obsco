import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as MONTHS, t as COUNTRIES, v as getAgencies, x as getPanoramicProducts } from "./agencies-BIm1ZU-s.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { F as Download, N as FileSpreadsheet, T as MapPin, W as Building2, tt as Earth } from "../_libs/lucide-react.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-dH4w1AId.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(n) {
	return Number.isFinite(n) ? Math.round(n).toLocaleString("fr-FR") : "-";
}
function pct(n) {
	return Number.isFinite(n) ? `${n.toFixed(1)}%` : "-";
}
function eur(n) {
	return `€${fmt(n)}`;
}
function agencyShare(agency, agencies) {
	return 1 / (agencies.filter((a) => a.country === agency.country).length || 1);
}
function useScopeState() {
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [scope, setScope] = (0, import_react.useState)("all");
	const [countryCode, setCountryCode] = (0, import_react.useState)("");
	const [agencyId, setAgencyId] = (0, import_react.useState)("");
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const [selectedYear, setSelectedYear] = (0, import_react.useState)(currentYear);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(currentMonth);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const list = getAgencies();
		setAgencies(list);
		if (list[0]) {
			setCountryCode((c) => c || list[0].country);
			setAgencyId((a) => a || list[0].id);
		}
		const sync = () => setAgencies(getAgencies());
		window.addEventListener("obco:agencies", sync);
		return () => window.removeEventListener("obco:agencies", sync);
	}, []);
	const agency = agencies.find((a) => a.id === agencyId);
	return {
		scope,
		setScope,
		countryCode,
		setCountryCode,
		agencyId,
		setAgencyId,
		agencies,
		agency,
		scopeLabel: scope === "all" ? "Tous pays · toutes agences" : scope === "country" ? `Pays : ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode}` : `Agence : ${agency?.name ?? agencyId}`,
		fileSuffix: scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`,
		selectedYear,
		setSelectedYear,
		selectedMonth,
		setSelectedMonth
	};
}
function ScopeSelector(props) {
	const { scope, setScope, countryCode, setCountryCode, agencyId, setAgencyId, agencies, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = props;
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3 mb-3 pb-3 border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Période :"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: selectedMonth,
					onChange: (e) => setSelectedMonth(Number(e.target.value)),
					className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
					children: [
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
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
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
							label: "Tous confondus"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto text-xs text-muted-foreground",
					children: "Filtre appliqué au rapport ci-dessous"
				})
			]
		})]
	});
}
function ScopeBtn({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
		children: [icon, label]
	});
}
function useScopedReportData(scope, countryCode, agencyId) {
	return (0, import_react.useMemo)(() => {
		const agencies = typeof window !== "undefined" ? getAgencies() : [];
		const agency = agencies.find((a) => a.id === agencyId);
		const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
		return {
			agencies,
			agency,
			agencyFactor: scope === "agency" && agency ? agencyShare(agency, agencies) : 1,
			codeFilter,
			visibleCountries: COUNTRIES.filter((c) => !codeFilter || c.code === codeFilter),
			products: getPanoramicProducts(),
			selectedCountry: codeFilter || null
		};
	}, [
		scope,
		countryCode,
		agencyId
	]);
}
function useScopedReportDataANF(scope, countryCode, agencyId) {
	return (0, import_react.useMemo)(() => {
		const agencies = typeof window !== "undefined" ? getAgencies() : [];
		const agency = agencies.find((a) => a.id === agencyId);
		const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
		return {
			agencies,
			agency,
			agencyFactor: scope === "agency" && agency ? agencyShare(agency, agencies) : 1,
			codeFilter,
			visibleCountries: COUNTRIES.filter((c) => c.isANF && (!codeFilter || c.code === codeFilter)),
			products: getPanoramicProducts(),
			selectedCountry: codeFilter || null
		};
	}, [
		scope,
		countryCode,
		agencyId
	]);
}
function useMonthlyData(year, month, scope, countryCode, agencyId) {
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const params = new URLSearchParams({
					year: year.toString(),
					month: month.toString(),
					scope
				});
				if (scope === "country") params.append("countryCode", countryCode);
				if (scope === "agency") params.append("agencyId", agencyId);
				const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/reports/monthly-summary?${params}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } });
				if (response.ok) setData(await response.json());
				else {
					console.error("Erreur chargement monthly-summary");
					setData({});
				}
			} catch (error) {
				console.error("Erreur chargement monthly-summary:", error);
				setData({});
			} finally {
				setLoading(false);
			}
		};
		if (agencyId || scope !== "agency") loadData();
	}, [
		year,
		month,
		scope,
		countryCode,
		agencyId
	]);
	return {
		data,
		loading
	};
}
function useCountryData(year, month) {
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/reports/by-country?year=${year}&month=${month}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } });
				if (response.ok) setData(await response.json());
				else setData({});
			} catch (error) {
				console.error("Erreur chargement by-country:", error);
				setData({});
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [year, month]);
	return {
		data,
		loading
	};
}
function useEvolutionData(year, scope, countryCode, agencyId) {
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const params = new URLSearchParams({
					year: year.toString(),
					scope
				});
				if (scope === "country") params.append("countryCode", countryCode);
				if (scope === "agency") params.append("agencyId", agencyId);
				const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/reports/evolution?${params}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } });
				if (response.ok) setData(await response.json());
				else setData({});
			} catch (error) {
				console.error("Erreur chargement evolution:", error);
				setData({});
			} finally {
				setLoading(false);
			}
		};
		if (agencyId || scope !== "agency") loadData();
	}, [
		year,
		scope,
		countryCode,
		agencyId
	]);
	return {
		data,
		loading
	};
}
function usePanoramicData(year, productCip) {
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!productCip) {
			setData({});
			return;
		}
		const loadData = async () => {
			setLoading(true);
			try {
				const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/reports/panoramic?year=${year}&productCip=${productCip}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } });
				if (response.ok) setData(await response.json());
				else setData({});
			} catch (error) {
				console.error("Erreur chargement panoramic:", error);
				setData({});
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [year, productCip]);
	return {
		data,
		loading
	};
}
function useYearStocksData(year) {
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const promises = [];
				for (let month = 1; month <= 12; month++) promises.push(fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/reports/by-country?year=${year}&month=${month}`, { headers: { Authorization: `Bearer ${localStorage.getItem("obco_token")}` } }).then((res) => res.ok ? res.json() : {}));
				const results = await Promise.all(promises);
				const yearData = {};
				results.forEach((monthResult, idx) => {
					yearData[idx + 1] = monthResult;
				});
				setData(yearData);
			} catch (error) {
				console.error("Erreur chargement year-stocks:", error);
				setData({});
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [year]);
	return {
		data,
		loading
	};
}
function ReportCard({ title, subtitle, rows, filename, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-2xl border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg leading-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: subtitle
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => {
						exportCSV(filename, rows);
						toast.success("CSV téléchargé");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-3.5 w-3.5" }), "CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => {
						exportXLSX(filename, { Rapport: rows });
						toast.success("XLSX téléchargé");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-3.5 w-3.5" }), "XLSX"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children
		})]
	});
}
function Table({ children, minWidth = 900 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		className: "w-full text-[12px]",
		style: { minWidth },
		children
	});
}
var TH = ({ children, right }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	className: `px-3 py-2 font-medium text-[10px] uppercase tracking-wider text-muted-foreground ${right ? "text-right" : "text-left"}`,
	children
});
var TD = ({ children, right, mute }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	className: `px-3 py-2.5 tabular-nums ${right ? "text-right" : ""} ${mute ? "text-muted-foreground" : ""}`,
	children
});
function buildR1(d, apiData) {
	const rows = d.products.slice(0, 60).map((p) => {
		const ventes = (apiData[p.cip] || {
			sales: 0,
			stock: 0,
			orders: 0
		}).sales;
		const budgetMois = Math.round(p.budgetMois * d.agencyFactor);
		const ventesAn1 = Math.round(p.ventesAn1 * d.agencyFactor);
		const ca = +(ventes * 10).toFixed(2);
		const budgetMoisCa = +(budgetMois * 10).toFixed(2);
		const cumulBudget = Math.round(p.cumulBudget * d.agencyFactor);
		const cumulRealise = Math.round(p.cumulRealise * d.agencyFactor);
		return {
			id: p.id,
			produit: p.name,
			ventes,
			budgetMois,
			tauxReal: +(ventes / Math.max(budgetMois, 1) * 100).toFixed(1),
			ventesAn1,
			tauxEvol: +((ventes - ventesAn1) / Math.max(ventesAn1, 1) * 100).toFixed(1),
			ca,
			budgetMoisCa,
			txRealBudgetCa: +(ca / Math.max(budgetMoisCa, 1) * 100).toFixed(1),
			cumulBudget,
			cumulRealise,
			txRealDate: +(cumulRealise / Math.max(cumulBudget, 1) * 100).toFixed(1),
			poids: 0
		};
	});
	const totalCa = rows.reduce((s, r) => s + r.ca, 0) || 1;
	rows.forEach((r) => {
		r.poids = +(r.ca / totalCa * 100).toFixed(2);
	});
	return rows;
}
function ReportObjectifsPays({ data, suffix, year, month, scope, countryCode, agencyId }) {
	const { data: apiData, loading } = useMonthlyData(year, month, scope, countryCode, agencyId);
	const rows = (0, import_react.useMemo)(() => buildR1(data, apiData), [data, apiData]);
	const tot = (0, import_react.useMemo)(() => ({
		ventes: rows.reduce((s, r) => s + r.ventes, 0),
		budgetMois: rows.reduce((s, r) => s + r.budgetMois, 0),
		ventesAn1: rows.reduce((s, r) => s + r.ventesAn1, 0),
		ca: rows.reduce((s, r) => s + r.ca, 0),
		budgetMoisCa: rows.reduce((s, r) => s + r.budgetMoisCa, 0),
		cumulBudget: rows.reduce((s, r) => s + r.cumulBudget, 0),
		cumulRealise: rows.reduce((s, r) => s + r.cumulRealise, 0)
	}), [rows]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "Rapport 1 · Objectifs ventes par produit",
		subtitle: "Suivi mensuel par produit — performance, CA, cumul, poids",
		rows: rows.map((r) => ({
			Produit: r.produit,
			Ventes: r.ventes,
			"Budget Mois": r.budgetMois,
			"Taux de réalisation (%)": r.tauxReal,
			"Ventes An-1": r.ventesAn1,
			"Taux d'évolution (%)": r.tauxEvol,
			"Chiffres d'affaire (CA)": r.ca,
			"Budget Mois CA": r.budgetMoisCa,
			"Tx Real Budget CA (%)": r.txRealBudgetCa,
			"Cumul Budget": r.cumulBudget,
			"Cumul Réalisé": r.cumulRealise,
			"Tx de réalisation à date (%)": r.txRealDate,
			"Poids (%)": r.poids
		})),
		filename: `r1-objectifs-pays-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 1400,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, { children: "Produit" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Ventes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Budget Mois"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Tx réal. %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Ventes An-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Tx évol. %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "CA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Budget CA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Tx Real CA %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Cumul Budget"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Cumul Réalisé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Tx réal. à date %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
							right: true,
							children: "Poids %"
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.produit }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(r.ventes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							mute: true,
							children: fmt(r.budgetMois)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: r.tauxReal >= 100 ? "text-primary" : "text-amber-500",
								children: pct(r.tauxReal)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							mute: true,
							children: fmt(r.ventesAn1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: r.tauxEvol >= 0 ? "text-primary" : "text-destructive",
								children: pct(r.tauxEvol)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: eur(r.ca)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							mute: true,
							children: eur(r.budgetMoisCa)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct(r.txRealBudgetCa)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							mute: true,
							children: fmt(r.cumulBudget)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(r.cumulRealise)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct(r.txRealDate)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TD, {
							right: true,
							children: [r.poids, "%"]
						})
					]
				}, r.id)) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t-2 border-border bg-surface text-[11px] font-semibold uppercase tracking-wider",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: "Total" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(tot.ventes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(tot.budgetMois)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct(tot.ventes / Math.max(tot.budgetMois, 1) * 100)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(tot.ventesAn1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct((tot.ventes - tot.ventesAn1) / Math.max(tot.ventesAn1, 1) * 100)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: eur(tot.ca)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: eur(tot.budgetMoisCa)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct(tot.ca / Math.max(tot.budgetMoisCa, 1) * 100)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(tot.cumulBudget)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: fmt(tot.cumulRealise)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: pct(tot.cumulRealise / Math.max(tot.cumulBudget, 1) * 100)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
							right: true,
							children: "100%"
						})
					]
				}) })
			]
		})
	});
}
function buildR2(d, apiData) {
	return d.products.slice(0, 60).map((p) => {
		const ventes = (apiData[p.cip] || {
			sales: 0,
			stock: 0,
			orders: 0
		}).sales;
		const budgetMois = Math.round(p.budgetMois * d.agencyFactor);
		const ventesAn1 = Math.round(p.ventesAn1 * d.agencyFactor);
		const ca = +(ventes * 10).toFixed(2);
		const budgetMoisCa = +(budgetMois * 10).toFixed(2);
		const cumulBudget = Math.round(p.cumulBudget * d.agencyFactor);
		const cumulRealise = Math.round(p.cumulRealise * d.agencyFactor);
		return {
			id: p.id,
			produit: p.name,
			ventes,
			budgetMois,
			tauxReal: +(ventes / Math.max(budgetMois, 1) * 100).toFixed(1),
			ventesAn1,
			tauxEvol: +((ventes - ventesAn1) / Math.max(ventesAn1, 1) * 100).toFixed(1),
			ca,
			budgetMoisCa,
			txRealBudgetCa: +(ca / Math.max(budgetMoisCa, 1) * 100).toFixed(1),
			cumulBudget,
			cumulRealise,
			txRealPrev: +(cumulRealise / Math.max(cumulBudget, 1) * 100).toFixed(1),
			poids: p.poids
		};
	});
}
function ReportObjectifsANF({ data, suffix, year, month, scope, countryCode, agencyId }) {
	const { data: apiData, loading } = useMonthlyData(year, month, scope, countryCode, agencyId);
	const rows = (0, import_react.useMemo)(() => buildR2(data, apiData), [data, apiData]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "Rapport 2 · Objectifs ventes ANF (tous pays)",
		subtitle: "Suivi par produit — tous pays confondus",
		rows: rows.map((r) => ({
			Produit: r.produit,
			Ventes: r.ventes,
			"Budget Mois": r.budgetMois,
			"Taux de réalisation (%)": r.tauxReal,
			"Ventes An-1": r.ventesAn1,
			"Taux d'évolution (%)": r.tauxEvol,
			"Chiffres d'affaire (CA)": r.ca,
			"Budget Mois CA": r.budgetMoisCa,
			"Tx Real Budget CA (%)": r.txRealBudgetCa,
			"Cumul Budget": r.cumulBudget,
			"Cumul Réalisé": r.cumulRealise,
			"Tx de réalisation prév. (%)": r.txRealPrev,
			"Poids (%)": r.poids
		})),
		filename: `r2-objectifs-anf-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 1500,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, { children: "Produit" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Ventes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Budget Mois"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Tx réal. %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Ventes An-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Tx évol. %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "CA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Budget CA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Tx Real CA %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Cumul Budget"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Cumul Réalisé"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Tx réal. prév. %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Poids %"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.produit }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: fmt(r.ventes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(r.budgetMois)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: r.tauxReal >= 100 ? "text-primary" : "text-amber-500",
							children: pct(r.tauxReal)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(r.ventesAn1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: r.tauxEvol >= 0 ? "text-primary" : "text-destructive",
							children: pct(r.tauxEvol)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: eur(r.ca)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: eur(r.budgetMoisCa)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: pct(r.txRealBudgetCa)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(r.cumulBudget)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: fmt(r.cumulRealise)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: pct(r.txRealPrev)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TD, {
						right: true,
						children: [r.poids, "%"]
					})
				]
			}, r.id)) })]
		})
	});
}
function buildR3(d, kind, apiData) {
	return d.products.slice(0, 60).map((p) => {
		const row = { produit: p.name };
		let total = 0;
		for (const c of d.visibleCountries) {
			const salesValue = (apiData[p.cip]?.[c.code])?.sales || 0;
			const v = kind === "un" ? salesValue : +(salesValue * 10).toFixed(2);
			row[c.code] = v;
			total += v;
		}
		row.total = kind === "un" ? Math.round(total) : +total.toFixed(2);
		return row;
	});
}
function ReportPaysGrid({ data, suffix, kind, title, subtitle, file, year, month }) {
	const { data: apiData, loading } = useCountryData(year, month);
	const rows = (0, import_react.useMemo)(() => buildR3(data, kind, apiData), [
		data,
		kind,
		apiData
	]);
	const exportRows = rows.map((r) => {
		const o = { Produit: r.produit };
		for (const c of data.visibleCountries) o[`${c.name.toUpperCase()} (${kind === "un" ? "UN" : "CA euro"})`] = r[c.code];
		o["TOTAL ANF"] = r.total;
		return o;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title,
		subtitle,
		rows: exportRows,
		filename: `${file}-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 200 + data.visibleCountries.length * 110,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, { children: "Produit" }),
					data.visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TH, {
						right: true,
						children: [
							c.name,
							" ",
							kind === "un" ? "(UN)" : "(CA €)"
						]
					}, c.code)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "TOTAL ANF"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.produit }),
					data.visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: kind === "un" ? fmt(Number(r[c.code])) : eur(Number(r[c.code]))
					}, c.code)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: kind === "un" ? fmt(Number(r.total)) : eur(Number(r.total))
					})
				]
			}, i)) })]
		})
	});
}
function ReportVentesUnits({ data, suffix, year, month }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPaysGrid, {
		data,
		suffix,
		kind: "un",
		year,
		month,
		title: "Rapport 3 · Ventes par unités (produit × pays)",
		subtitle: "Nombre d'unités vendues par pays sur le mois",
		file: "r3-ventes-un"
	});
}
function ReportVentesCA({ data, suffix, year, month }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPaysGrid, {
		data,
		suffix,
		kind: "ca",
		year,
		month,
		title: "Rapport 3 bis · Ventes par CA (produit × pays)",
		subtitle: "CA en euros par pays sur le mois",
		file: "r3bis-ventes-ca"
	});
}
function buildR4(d, kind, apiData) {
	return d.products.slice(0, 60).map((p) => {
		const row = { produit: p.name };
		let total = 0;
		const productMonthlyData = apiData[p.cip] || {};
		for (let m = 1; m <= 12; m++) {
			const monthData = productMonthlyData[m] || {
				sales: 0,
				stock: 0,
				orders: 0
			};
			const v = kind === "un" ? monthData.sales : +(monthData.sales * 10).toFixed(2);
			row[MONTHS[m - 1]] = v;
			total += v;
		}
		row.total = kind === "un" ? Math.round(total) : +total.toFixed(2);
		if (kind === "un") {
			const lastMonthData = productMonthlyData[12] || productMonthlyData[11] || productMonthlyData[10] || {
				sales: 0,
				stock: 0,
				orders: 0
			};
			row.stockFrance = lastMonthData.stock;
			row.resteFrance = lastMonthData.orders;
		}
		return row;
	});
}
function ReportEvolutionUN({ data, suffix, year, scope, countryCode, agencyId }) {
	const { data: apiData, loading } = useEvolutionData(year, scope, countryCode, agencyId);
	const rows = (0, import_react.useMemo)(() => buildR4(data, "un", apiData), [data, apiData]);
	const paysLabel = data.selectedCountry || "TOTAL ANF";
	const exportRows = rows.map((r) => {
		const o = { [`Produit (${paysLabel})`]: r.produit };
		for (const m of MONTHS) o[`${m.toLowerCase()} (UN)`] = r[m];
		o.Total = r.total;
		o["STOCK France"] = r.stockFrance;
		o["RESTE À RECEVOIR France"] = r.resteFrance;
		return o;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "Rapport 4 · Évolution ventes mois par mois — Unités",
		subtitle: `Produit × mois — ${paysLabel} · inclut stock France & reste à recevoir`,
		rows: exportRows,
		filename: `r4-evolution-un-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 1600,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TH, { children: [
						"Produit (",
						paysLabel,
						")"
					] }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: m
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Stock FR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Reste FR"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.produit }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(Number(r[m]))
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: fmt(Number(r.total))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(Number(r.stockFrance))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(Number(r.resteFrance))
					})
				]
			}, i)) })]
		})
	});
}
function ReportEvolutionCA({ data, suffix, year, scope, countryCode, agencyId }) {
	const { data: apiData, loading } = useEvolutionData(year, scope, countryCode, agencyId);
	const rows = (0, import_react.useMemo)(() => buildR4(data, "ca", apiData), [data, apiData]);
	const paysLabel = data.selectedCountry || "TOTAL ANF";
	const exportRows = rows.map((r) => {
		const o = { [`Produit (${paysLabel})`]: r.produit };
		for (const m of MONTHS) o[`${m.toLowerCase()} (CA euro)`] = r[m];
		o.Total = r.total;
		return o;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "Rapport 4 bis · Évolution ventes mois par mois — CA",
		subtitle: `Produit × mois — CA en euros`,
		rows: exportRows,
		filename: `r4bis-evolution-ca-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 1500,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TH, { children: [
						"Produit (",
						paysLabel,
						")"
					] }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: m
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Total"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.produit }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: eur(Number(r[m]))
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: eur(Number(r.total))
					})
				]
			}, i)) })]
		})
	});
}
function buildR5(d, kind, apiDataByMonth) {
	return MONTHS.map((m, idx) => {
		const month = idx + 1;
		const row = { mois: m };
		const monthData = apiDataByMonth[month] || {};
		for (const c of d.visibleCountries) {
			let total = 0;
			for (const cip in monthData) {
				const countryData = monthData[cip]?.[c.code];
				if (countryData) total += kind === "stock" ? countryData.stock : countryData.orders;
			}
			row[c.code] = Math.round(total);
		}
		return row;
	});
}
function StocksGrid({ data, suffix, kind, title, subtitle, file, year }) {
	const { data: apiData, loading } = useYearStocksData(year);
	const rows = (0, import_react.useMemo)(() => buildR5(data, kind, apiData), [
		data,
		kind,
		apiData
	]);
	const exportRows = rows.map((r) => {
		const o = { Mois: r.mois };
		for (const c of data.visibleCountries) o[c.name.toUpperCase()] = r[c.code];
		return o;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title,
		subtitle,
		rows: exportRows,
		filename: `${file}-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 200 + data.visibleCountries.length * 110,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, { children: "Mois" }), data.visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
					right: true,
					children: c.name
				}, c.code))] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.mois }), data.visibleCountries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
					right: true,
					mute: true,
					children: fmt(Number(r[c.code]))
				}, c.code))]
			}, i)) })]
		})
	});
}
function ReportStocks({ data, suffix, year }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StocksGrid, {
		data,
		suffix,
		kind: "stock",
		year,
		title: "Rapport 7 · Situation stocks locaux par pays",
		subtitle: "Stocks disponibles par mois et par pays",
		file: "r5-stocks"
	});
}
function ReportStocksEnCours({ data, suffix, year }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StocksGrid, {
		data,
		suffix,
		kind: "encours",
		year,
		title: "Rapport 7 bis · Stocks en cours de livraison",
		subtitle: "Quantités en cours par mois et par pays",
		file: "r5bis-stocks-encours"
	});
}
function ReportVuePanoramique({ data, suffix, year }) {
	const [productId, setProductId] = (0, import_react.useState)("");
	const products = data.products;
	const selected = products.find((p) => p.id === productId) || products[0];
	const { data: apiData, loading } = usePanoramicData(year, selected?.cip || "");
	const rows = (0, import_react.useMemo)(() => {
		if (!selected) return [];
		return data.visibleCountries.map((c) => {
			const row = {
				pays: c.name,
				code: c.code
			};
			let total = 0;
			const countryData = apiData[c.code] || {};
			for (let m = 1; m <= 12; m++) {
				const v = (countryData[m] || {
					sales: 0,
					stock: 0,
					orders: 0
				}).sales;
				row[MONTHS[m - 1]] = v;
				total += v;
			}
			row.total = Math.round(total);
			return row;
		});
	}, [
		selected,
		data,
		apiData
	]);
	const exportRows = rows.map((r) => {
		const o = { Pays: r.pays };
		for (const m of MONTHS) o[`${m.toLowerCase()} (UN)`] = r[m];
		o.Total = r.total;
		return o;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement des données..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReportCard, {
		title: "Rapport 8 · Vue panoramique produit",
		subtitle: selected ? `Nombre d'unités vendues par mois et par pays — ${selected.name}` : "Aucun produit",
		rows: exportRows,
		filename: `r6-vue-panoramique-${selected?.id ?? "none"}-${suffix}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-medium text-muted-foreground",
				children: "Produit :"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: selected?.id ?? "",
				onChange: (e) => setProductId(e.target.value),
				className: "h-9 min-w-[280px] rounded-lg border border-border bg-surface px-3 text-sm",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: p.id,
					children: [
						p.name,
						" — ",
						p.laboratory
					]
				}, p.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
			minWidth: 1300,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, { children: "Pays" }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TH, {
						right: true,
						children: [m, " (UN)"]
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TH, {
						right: true,
						children: "Total"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, { children: r.pays }),
					MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						mute: true,
						children: fmt(Number(r[m]))
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TD, {
						right: true,
						children: fmt(Number(r.total))
					})
				]
			}, String(r.code))) })]
		})]
	});
}
//#endregion
export { ReportStocks as a, ReportVentesUnits as c, useScopeState as d, useScopedReportData as f, ReportObjectifsPays as i, ReportVuePanoramique as l, ReportEvolutionUN as n, ReportStocksEnCours as o, useScopedReportDataANF as p, ReportObjectifsANF as r, ReportVentesCA as s, ReportEvolutionCA as t, ScopeSelector as u };
