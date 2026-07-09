import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser, o as useUser } from "./auth-09JE-lnI.mjs";
import { v as getAgencies } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Package, G as Boxes, P as Eye, W as Building2, X as Activity, Z as TriangleAlert, c as TrendingUp, o as Upload, r as Wallet, s as Truck, x as Pencil } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { a as CartesianGrid, b as YAxis, h as ResponsiveContainer, i as BarChart, n as AreaChart, r as Bar, t as Area, v as Tooltip, y as XAxis } from "./AreaChart-C6cfyCFc.mjs";
import { t as ImportModal } from "./ImportModal-BQnIC45g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BtpxxUQL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const navigate = useNavigate();
	const user = useUser();
	(0, import_react.useEffect)(() => {
		const currentUser = getUser();
		if (!currentUser) navigate({ to: "/login" });
		else if (currentUser.mustChangePassword) navigate({ to: "/change-password" });
	}, [navigate]);
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Tableau de bord",
		subtitle: "Chargement...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "Chargement..."
			})
		})
	});
	return user.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDash, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PharmacyDash, {});
}
function PharmacyDash() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dashStats, setDashStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		console.log("🔍 Dashboard Pharmacy: Chargement des stats...");
		const loadDashboardStats = async () => {
			try {
				const token = localStorage.getItem("obco_token");
				if (!token) {
					console.error("❌ Pas de token");
					setLoading(false);
					return;
				}
				const apiUrl = "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
				console.log(`📡 Appel API: ${apiUrl}/api/import/dashboard-stats`);
				const response = await fetch(`${apiUrl}/api/import/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } });
				console.log(`📡 Réponse API: ${response.status}`);
				if (response.ok) {
					const data = await response.json();
					console.log("📊 Stats dashboard reçues:", data);
					setDashStats(data);
				} else {
					const text = await response.text();
					console.error("❌ Erreur API dashboard-stats:", response.status, text);
				}
			} catch (error) {
				console.error("❌ Erreur chargement stats:", error);
			} finally {
				setLoading(false);
			}
		};
		loadDashboardStats();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Tableau de bord",
		subtitle: "Chargement...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "Chargement des statistiques..."
			})
		})
	});
	const totalStock = dashStats?.totals.stock || 0;
	const totalSales = dashStats?.totals.sales || 0;
	const totalValue = dashStats?.totals.inventoryValue || 0;
	const lowStockCount = dashStats?.lowStockProducts.length || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Tableau de bord",
		subtitle: "Vue d'ensemble de vos sorties locales",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/sorties-locales",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mr-2 h-4 w-4" }), "Sorties Locales"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), "Importer des données"]
		})] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Stock Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4 text-primary" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-5xl",
								children: totalStock.toLocaleString("fr-FR")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "unités"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-2 overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: "75%" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								dashStats?.totals.products.toLocaleString("fr-FR"),
								" produits · ",
								dashStats?.totals.wholesalers,
								" grossistes"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Ventes Mensuelles"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-5xl",
								children: totalSales.toLocaleString("fr-FR")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "unités"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-1",
							children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-8 flex-1 rounded-sm bg-primary/60`,
								style: { opacity: .4 + i / 12 * .6 }
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: ["Commandes: ", dashStats?.totals.orders.toLocaleString("fr-FR")]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Stock Bas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-5xl",
								children: lowStockCount
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "produits"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-1",
							children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-8 flex-1 rounded-sm ${i < 4 ? "bg-destructive/70" : "bg-warning/60"}` }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								"Produits avec stock ",
								"<",
								" 50 unités"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Évolution mensuelle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "6 derniers mois · Stocks vs Ventes"
						})] }), dashStats && dashStats.trends.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }),
								Math.round((dashStats.trends[dashStats.trends.length - 1].sales - dashStats.trends[0].sales) / dashStats.trends[0].sales * 100),
								"%"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: dashStats?.trends || [],
								margin: {
									left: -20,
									right: 8,
									top: 8
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "g1",
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
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "g2",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--color-chart-3)",
											stopOpacity: .25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--color-chart-3)",
											stopOpacity: 0
										})]
									})] }),
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
										fill: "url(#g1)",
										name: "Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "sales",
										stroke: "var(--color-chart-3)",
										strokeWidth: 2,
										fill: "url(#g2)",
										name: "Ventes"
									})
								]
							})
						}) })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-2 bg-primary text-primary-foreground border-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wider opacity-80",
								children: "Valeur Stock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 font-display text-5xl",
							children: [totalValue > 1e6 ? `${(totalValue / 1e6).toFixed(1)}M` : `${(totalValue / 1e3).toFixed(0)}k`, "€"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs opacity-80",
							children: "Valeur totale de l'inventaire"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-primary-foreground/10 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase opacity-70",
									children: "Commandes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-semibold",
									children: dashStats?.totals.orders.toLocaleString("fr-FR")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-primary-foreground/10 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase opacity-70",
									children: "Produits"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-semibold",
									children: dashStats?.totals.products
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopProducts, { products: dashStats?.topProducts || [] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopWholesalers, { wholesalers: dashStats?.topWholesalers || [] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopLowStock, { products: dashStats?.lowStockProducts || [] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
			open,
			onOpenChange: setOpen
		})]
	});
}
function TopProducts({ products }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card md:col-span-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold",
				children: "Top 5 Produits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Par volume de ventes"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-primary" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: products.slice(0, 5).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-sm truncate",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-mono",
							children: p.cip
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: p.sales.toLocaleString("fr-FR")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "ventes"
					})]
				})]
			}, p.cip))
		})]
	});
}
function TopWholesalers({ wholesalers }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card md:col-span-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold",
				children: "Top 5 Grossistes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Par volume de ventes"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: wholesalers.slice(0, 5).map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-sm truncate",
							children: w.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Stock: ", w.stock.toLocaleString("fr-FR")]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: w.sales.toLocaleString("fr-FR")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "ventes"
					})]
				})]
			}, w.id))
		})]
	});
}
function TopLowStock({ products }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card md:col-span-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold",
				children: "Produits avec stock bas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "text-xs",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/sorties-locales",
					children: "Voir tous →"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-xs uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-left font-medium",
							children: "Code CIP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-left font-medium",
							children: "Produit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-right font-medium",
							children: "Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-right font-medium",
							children: "Ventes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-right font-medium",
							children: "Commandes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2.5 text-right font-medium",
							children: "Statut"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60 last:border-0 hover:bg-surface/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 font-mono text-xs text-muted-foreground",
							children: p.cip
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: p.stock < 20 ? "text-destructive font-semibold" : p.stock < 50 ? "text-warning" : "",
								children: p.stock
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums text-muted-foreground",
							children: p.sales.toLocaleString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right tabular-nums text-muted-foreground",
							children: p.orders.toLocaleString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.stock === 0 ? "rupture" : p.stock < 20 ? "critical" : "low" })
						})
					]
				}, p.cip)) })]
			})
		})]
	});
}
function AdminDash() {
	const [dashStats, setDashStats] = (0, import_react.useState)(null);
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		console.log("🔍 Dashboard Admin: Chargement des stats...");
		const loadDashboardStats = async () => {
			try {
				const token = localStorage.getItem("obco_token");
				if (!token) {
					console.error("❌ Pas de token");
					setLoading(false);
					return;
				}
				const apiUrl = "https://evening-sierra-79086-961c10c199fc.herokuapp.com";
				console.log(`📡 Appel API Admin: ${apiUrl}/api/import/dashboard-stats`);
				const response = await fetch(`${apiUrl}/api/import/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } });
				console.log(`📡 Réponse API Admin: ${response.status}`);
				if (response.ok) {
					const data = await response.json();
					console.log("📊 Stats dashboard Admin reçues:", data);
					setDashStats(data);
				} else {
					const text = await response.text();
					console.error("❌ Erreur API dashboard-stats:", response.status, text);
				}
			} catch (error) {
				console.error("❌ Erreur chargement stats:", error);
			} finally {
				setLoading(false);
			}
		};
		setAgencies(getAgencies());
		loadDashboardStats();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Tableau de bord",
		subtitle: "Chargement...",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "Chargement des statistiques..."
			})
		})
	});
	const totalStock = dashStats?.totals.stock || 0;
	const totalSales = dashStats?.totals.sales || 0;
	const totalValue = dashStats?.totals.inventoryValue || 0;
	const agencyCount = dashStats?.totals.agencies || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Vue Générale",
		subtitle: "Tableau de bord réseau",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/rapports",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mr-2 h-4 w-4" }), "Rapports"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/agences",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mr-2 h-4 w-4" }), "Gérer les agences"]
			})
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					className: "md:col-span-4 bg-primary text-primary-foreground border-primary",
					highlight: true,
					label: "Valeur Totale Stocks",
					value: `${totalValue > 1e6 ? `${(totalValue / 1e6).toFixed(1)}M` : `${(totalValue / 1e3).toFixed(0)}k`}€`,
					sub: `${agencyCount} agence(s) · réseau ANF`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					className: "md:col-span-4",
					label: "Ventes Totales",
					value: totalSales.toLocaleString("fr-FR"),
					sub: `${dashStats?.totals.products} produits actifs`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					className: "md:col-span-4",
					label: "Stocks Totaux",
					value: totalStock.toLocaleString("fr-FR"),
					sub: "unités disponibles réseau",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Évolution des ventes réseau"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "6 derniers mois · Toutes agences"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: dashStats?.trends || [],
								margin: {
									left: -20,
									right: 8,
									top: 8
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ga",
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
										dataKey: "sales",
										stroke: "var(--color-primary)",
										strokeWidth: 2.5,
										fill: "url(#ga)",
										name: "Ventes"
									})
								]
							})
						}) })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Commandes par mois"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Volume réseau"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: dashStats?.trends || [],
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
											dataKey: "orders",
											fill: "var(--color-primary)",
											radius: [
												6,
												6,
												0,
												0
											]
										})
									]
								})
							}) })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopProducts, { products: dashStats?.topProducts || [] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopWholesalers, { wholesalers: dashStats?.topWholesalers || [] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopLowStock, { products: dashStats?.lowStockProducts || [] }),
				agencies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento-card md:col-span-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Agences du réseau"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/agences",
								children: "Voir tout →"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[760px] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 text-left font-medium",
										children: "Agence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 text-left font-medium",
										children: "Pays"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 text-left font-medium",
										children: "Ville"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 text-left font-medium",
										children: "Contact"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 text-right font-medium",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: agencies.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 last:border-0 hover:bg-surface/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-[11px] font-semibold text-accent-foreground",
												children: a.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: a.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 text-muted-foreground",
										children: a.country
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 text-muted-foreground",
										children: a.city || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 text-muted-foreground text-sm",
										children: "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
											})]
										})
									})
								]
							}, a.id)) })]
						})
					})]
				})
			]
		})
	});
}
function Kpi({ className = "", label, value, sub, icon, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bento-card ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-xs font-medium uppercase tracking-wider ${highlight ? "opacity-80" : "text-muted-foreground"}`,
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: highlight ? "opacity-90" : "text-primary",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 font-display text-4xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-2 text-xs ${highlight ? "opacity-80" : "text-muted-foreground"}`,
				children: sub
			})
		]
	});
}
function ClientOnly({ children }) {
	const [hasMounted, setHasMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 w-full bg-accent/20 animate-pulse rounded-lg" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { Dashboard as component };
