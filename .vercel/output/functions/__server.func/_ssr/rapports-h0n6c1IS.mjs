import { i as __toESM } from "../_runtime.mjs";
import { t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as salesByUnit, E as salesByRevenue, F as stockSituation, O as salesObjectivesANF, _ as evolutionByUnits, g as evolutionByRevenue, k as salesObjectivesByCountry, t as COUNTRIES, v as getAgencies } from "./agencies-BIm1ZU-s.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, N as FileSpreadsheet, T as MapPin, W as Building2, tt as Earth } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-ClS6A7yg.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, h as Legend, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rapports-h0n6c1IS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTE = [
	"#10b981",
	"#0ea5e9",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#22d3ee",
	"#84cc16"
];
function agencyShare(agency, agencies) {
	return 1 / (agencies.filter((a) => a.country === agency.country).length || 1);
}
function scaleNum(n, f) {
	return Math.round(n * f);
}
function useScopedData(scope, countryCode, agencyId) {
	return (0, import_react.useMemo)(() => {
		const agencies = getAgencies();
		const agency = agencies.find((a) => a.id === agencyId);
		const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
		const factor = scope === "agency" && agency ? agencyShare(agency, agencies) : 1;
		const keepCountry = (code) => !codeFilter || code === codeFilter;
		const objPays = salesObjectivesByCountry().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			objectif: scaleNum(r.objectif, factor),
			realise: scaleNum(r.realise, factor)
		}));
		const objAnf = salesObjectivesANF().map((r) => ({
			...r,
			objectif: scaleNum(r.objectif, factor * (codeFilter ? 1 / COUNTRIES.length : 1)),
			realise: scaleNum(r.realise, factor * (codeFilter ? 1 / COUNTRIES.length : 1))
		}));
		const vUn = salesByUnit().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			unites: scaleNum(r.unites, factor)
		}));
		const vCa = salesByRevenue().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			ca: scaleNum(r.ca, factor)
		}));
		const shapeMonth = (rows) => rows.map((row) => {
			const out = { mois: row.mois };
			let total = 0;
			for (const c of COUNTRIES) {
				if (!keepCountry(c.code)) continue;
				const v = scaleNum(Number(row[c.code] ?? 0), factor);
				out[c.code] = v;
				total += v;
			}
			out.total = total;
			return out;
		});
		return {
			objPays,
			objAnf,
			vUn,
			vCa,
			evCa: shapeMonth(evolutionByRevenue()),
			evUn: shapeMonth(evolutionByUnits()),
			stocks: stockSituation().filter((r) => keepCountry(r.code)).map((r) => ({
				...r,
				stock: scaleNum(r.stock, factor),
				enCours: scaleNum(r.enCours, factor),
				total: scaleNum(r.total, factor),
				seuil: scaleNum(r.seuil, factor)
			})),
			visibleCountries: COUNTRIES.filter((c) => keepCountry(c.code)),
			agency
		};
	}, [
		scope,
		countryCode,
		agencyId
	]);
}
function RapportsPage() {
	const navigate = useNavigate();
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [scope, setScope] = (0, import_react.useState)("all");
	const [countryCode, setCountryCode] = (0, import_react.useState)("");
	const [agencyId, setAgencyId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const list = getAgencies();
		setAgencies(list);
		if (!countryCode && list[0]) setCountryCode(list[0].country);
		if (!agencyId && list[0]) setAgencyId(list[0].id);
	}, [
		navigate,
		countryCode,
		agencyId
	]);
	const data = useScopedData(scope, countryCode, agencyId);
	const scopeLabel = scope === "all" ? "Tous pays · toutes agences" : scope === "country" ? `Pays : ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode}` : `Agence : ${data.agency?.name ?? agencyId}`;
	const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;
	const exportAll = () => {
		exportXLSX(`rapports-anf-${fileSuffix}`, {
			"Obj. Pays": data.objPays,
			"Obj. ANF": data.objAnf,
			"Ventes UN": data.vUn,
			"Ventes CA": data.vCa,
			"Evol. CA": data.evCa,
			"Evol. UN": data.evUn,
			"Stocks": data.stocks,
			"_Filtre": [{
				scope,
				pays: countryCode,
				agence: agencyId,
				libelle: scopeLabel
			}]
		});
		toast.success("Rapport complet XLSX téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Rapports SuperAdmin",
		subtitle: `Vision globale · ${scopeLabel}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: exportAll,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "Exporter tout (XLSX)"]
		}),
		children: [
			API_ENABLED && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-primary/10 p-2 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-primary mb-1",
							children: "📊 Aucune donnée disponible"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-3",
							children: "Les rapports affichent actuellement des données vides car les agences n'ont pas encore importé leurs fichiers Excel."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Pour voir les données réelles : les agences doivent se connecter et utiliser le module",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Import données"
								}),
								" pour uploader leurs fichiers Excel mensuels."
							]
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mb-6 rounded-2xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							children: "Filtre appliqué à tous les rapports & exports ci-dessous"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r1",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportObjectifsPays, {
							data: data.objPays,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r2",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportObjectifsANF, {
							data: data.objAnf,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r3",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportVentesUnits, {
							data: data.vUn,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r4",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportVentesCA, {
							data: data.vCa,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r5",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportEvolutionCA, {
							data: data.evCa,
							countries: data.visibleCountries,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r6",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportEvolutionUN, {
							data: data.evUn,
							countries: data.visibleCountries,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r7",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportStocks, {
							data: data.stocks,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r8",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportStocksEnCours, {
							data: data.stocks,
							suffix: fileSuffix
						})
					})
				]
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
function ReportCard({ title, subtitle, rows, filename, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
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
			className: "mt-5",
			children
		})]
	});
}
var tooltipStyle = {
	background: "var(--color-card)",
	border: "1px solid var(--color-border)",
	borderRadius: 12,
	fontSize: 12
};
function ReportObjectifsPays({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "1 · Suivi objectifs ventes mensuelles par pays",
		subtitle: "Objectif vs réalisé",
		rows: data,
		filename: `suivi-objectifs-mensuels-pays-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "objectif",
							name: "Objectif",
							fill: "#94a3b8",
							radius: [
								4,
								4,
								0,
								0
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "realise",
							name: "Réalisé",
							fill: "#10b981",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Objectif",
					"Réalisé",
					"Taux %"
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.objectif),
					fmt(d.realise),
					`${d.taux}%`
				])
			})]
		})
	});
}
function ReportObjectifsANF({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "2 · Suivi objectifs ventes mensuelles ANF",
		subtitle: "Performance globale · 12 mois",
		rows: data,
		filename: `suivi-objectifs-mensuels-anf-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-72",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "anf-g",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#10b981",
							stopOpacity: .4
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#10b981",
							stopOpacity: 0
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "objectif",
						name: "Objectif",
						stroke: "#94a3b8",
						strokeDasharray: "4 4",
						fill: "transparent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "realise",
						name: "Réalisé",
						stroke: "#10b981",
						fill: "url(#anf-g)",
						strokeWidth: 2.5
					})
				]
			}) })
		})
	});
}
function ReportVentesUnits({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "3 · Suivi ventes par unité",
		subtitle: "Volume d'unités vendues",
		rows: data,
		filename: `ventes-unites-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					layout: "vertical",
					margin: {
						left: 60,
						right: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							horizontal: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							type: "number",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							dataKey: "pays",
							type: "category",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)",
							width: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "unites",
							name: "Unités",
							fill: "#0ea5e9",
							radius: [
								0,
								6,
								6,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: ["Pays", "Unités"],
				rows: data.map((d) => [d.pays, fmt(d.unites)])
			})]
		})
	});
}
function ReportVentesCA({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "4 · Suivi ventes par chiffre d'affaires",
		subtitle: "CA généré",
		rows: data,
		filename: `ventes-ca-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data,
						dataKey: "ca",
						nameKey: "pays",
						outerRadius: 100,
						label: (e) => e.code,
						children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PALETTE[i % PALETTE.length] }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
				] }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: ["Pays", "CA"],
				rows: data.map((d) => [d.pays, `€${fmt(d.ca)}`])
			})]
		})
	});
}
function ReportEvolutionCA({ data, countries, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "5 · Évolution ventes mois par mois — CA",
		subtitle: "CA cumulé sur 12 mois",
		rows: data,
		filename: `evolution-ca-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					countries.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: c.code,
						stroke: PALETTE[i % PALETTE.length],
						strokeWidth: 2,
						dot: false
					}, c.code))
				]
			}) })
		})
	});
}
function ReportEvolutionUN({ data, countries, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "6 · Évolution ventes mois par mois — Unités",
		subtitle: "Volumes sur 12 mois",
		rows: data,
		filename: `evolution-unites-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				stackOffset: "expand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)",
						tickFormatter: (v) => `${Math.round(v * 100)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					countries.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: c.code,
						stackId: "1",
						stroke: PALETTE[i % PALETTE.length],
						fill: PALETTE[i % PALETTE.length]
					}, c.code))
				]
			}) })
		})
	});
}
function ReportStocks({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "7 · Situation stocks locaux",
		subtitle: "Stocks disponibles vs seuil",
		rows: data,
		filename: `situation-stocks-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "stock",
							name: "Stock",
							fill: "#10b981",
							radius: [
								4,
								4,
								0,
								0
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "seuil",
							name: "Seuil",
							fill: "#94a3b8",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Stock",
					"Seuil",
					"Couv."
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.stock),
					fmt(d.seuil),
					`${d.couverture}j`
				])
			})]
		})
	});
}
function ReportStocksEnCours({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "8 · Situation stocks + commandes en cours",
		subtitle: "Stocks disponibles + produits en commande",
		rows: data,
		filename: `stocks-avec-en-cours-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "stock",
							stackId: "a",
							name: "Stock disponible",
							fill: "#10b981"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "enCours",
							stackId: "a",
							name: "En cours",
							fill: "#f59e0b",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Stock",
					"En cours",
					"Total"
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.stock),
					fmt(d.enCours),
					fmt(d.total)
				])
			})]
		})
	});
}
function DataTable({ headers, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-surface/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-4 text-center text-muted-foreground",
				colSpan: headers.length,
				children: "Aucune donnée"
			}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t border-border/60",
				children: r.map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `px-3 py-2 tabular-nums ${j === 0 ? "font-medium" : "text-muted-foreground"}`,
					children: c
				}, j))
			}, i)) })]
		})
	});
}
function fmt(n) {
	return n.toLocaleString("fr-FR");
}
//#endregion
export { RapportsPage as component };
