import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { a as CartesianGrid, b as YAxis, h as ResponsiveContainer, i as BarChart, m as Legend, n as AreaChart, o as Cell, r as Bar, t as Area, v as Tooltip, y as XAxis } from "./AreaChart-C6cfyCFc.mjs";
import { n as PieChart, t as Pie } from "./PieChart-BPOdMDxm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-DRoHMwED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"var(--color-primary)",
	"oklch(0.72 0.1 158)",
	"oklch(0.5 0.12 200)",
	"var(--color-warning)",
	"var(--color-destructive)",
	"oklch(0.55 0.04 200)"
];
function StatsPage() {
	console.log("🎯 StatsPage component rendered");
	const navigate = useNavigate();
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		console.log("🔍 Stats Page: Vérification utilisateur...");
		const user = getUser();
		console.log("👤 User:", user);
		if (!user) {
			console.log("❌ Stats Page: Pas d'utilisateur, redirection");
			navigate({ to: "/login" });
			return;
		}
		console.log("✅ Stats Page: Utilisateur connecté, chargement des stats...");
		const loadStats = async () => {
			try {
				const token = localStorage.getItem("obco_token");
				if (!token) {
					console.error("❌ Pas de token disponible dans le localStorage");
					setLoading(false);
					return;
				}
				const apiUrl = "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
				console.log(`📡 Appel API: ${apiUrl}/api/import/advanced-stats`);
				const response = await fetch(`${apiUrl}/api/import/advanced-stats`, { headers: { Authorization: `Bearer ${token}` } });
				console.log(`📡 Réponse API: ${response.status}`);
				if (response.ok) {
					const data = await response.json();
					console.log("📊 Stats avancées reçues:", data);
					setStats(data);
				} else {
					const text = await response.text();
					console.error("❌ Erreur API advanced-stats:", response.status, text);
				}
			} catch (error) {
				console.error("❌ Erreur lors du chargement des statistiques:", error);
			} finally {
				setLoading(false);
			}
		};
		loadStats();
	}, [navigate]);
	const statusDist = (0, import_react.useMemo)(() => {
		if (!stats || !stats.statusDist) return [];
		return stats.statusDist.map((s) => ({
			...s,
			fill: s.name === "OK" ? "var(--color-primary)" : s.name === "Faible" ? "var(--color-warning)" : s.name === "Critique" ? "var(--color-destructive)" : "oklch(0.45 0.18 25)"
		}));
	}, [stats]);
	if (loading || !stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Statistiques & Analyses",
		subtitle: "Chargement...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "Chargement des statistiques..."
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Statistiques & Analyses",
		subtitle: "Vision analytique basée sur vos données réelles",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
					label: "Références",
					value: stats.summary.totalProducts.toLocaleString("fr-FR")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
					label: "Valeur totale",
					value: stats.summary.totalValue > 1e6 ? `€${(stats.summary.totalValue / 1e6).toFixed(2)}M` : `€${(stats.summary.totalValue / 1e3).toFixed(0)}k`,
					highlight: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
					label: "Catégories",
					value: String(stats.summary.totalCategories)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
					label: "Laboratoires",
					value: String(stats.summary.totalLaboratories)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Évolution des stocks — 6 derniers mois"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Tendance globale (unités)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: stats.trends,
									margin: {
										left: -20,
										right: 8,
										top: 8
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "sg",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-primary)",
												stopOpacity: .35
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-primary)",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 12,
											fontSize: 12
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "stock",
											stroke: "var(--color-primary)",
											strokeWidth: 2.5,
											fill: "url(#sg)",
											name: "Stock"
										})
									]
								})
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Répartition par statut"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "État des stocks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: statusDist,
										dataKey: "value",
										nameKey: "name",
										innerRadius: 50,
										outerRadius: 90,
										paddingAngle: 2,
										children: statusDist.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.fill }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 12,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
								] })
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Top catégories par valeur"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Valeur stock en k€"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: stats.byCategory.slice(0, 10),
									layout: "vertical",
									margin: {
										left: 20,
										right: 16,
										top: 8
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											horizontal: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false,
											width: 140
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 12,
											fontSize: 12
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											fill: "var(--color-primary)",
											radius: [
												0,
												6,
												6,
												0
											]
										})
									]
								})
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Top laboratoires"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Volume de stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: stats.topLabs,
										dataKey: "value",
										nameKey: "name",
										outerRadius: 110,
										children: stats.topLabs.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 12,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
								] })
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Évolution des ventes — 6 derniers mois"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Unités vendues mensuellement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: stats.trends,
									margin: {
										left: -20,
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
											dataKey: "month",
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 11,
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 12,
											fontSize: 12
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "sales",
											fill: "var(--color-primary)",
											radius: [
												6,
												6,
												0,
												0
											],
											name: "Ventes"
										})
									]
								})
							}) })
						})
					]
				})
			]
		})]
	});
}
function MiniKpi({ label, value, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border p-4 ${highlight ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-[11px] uppercase tracking-wider ${highlight ? "opacity-80" : "text-muted-foreground"}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl",
			children: value
		})]
	});
}
function ClientOnly({ children }) {
	const [hasMounted, setHasMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-accent/20 animate-pulse rounded-lg" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { StatsPage as component };
