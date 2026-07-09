import { i as __toESM } from "../_runtime.mjs";
import { t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as ChevronLeft, F as Download, g as Search, o as Upload, p as SlidersHorizontal, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-QwJoqlSq.mjs";
import { t as ImportModal } from "./ImportModal-BQnIC45g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stocks-BjC_fCov.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Antalgiques",
	"Antibiotiques",
	"Anti-inflammatoires",
	"Dermatologie",
	"Cardio-vasculaire",
	"Gastro-entérologie",
	"Ophtalmologie",
	"Pédiatrie",
	"Vitamines & Minéraux",
	"Hygiène",
	"Phytothérapie",
	"Homéopathie",
	"Dispositifs médicaux",
	"Cosmétique"
];
var LABS = [
	"Sanofi",
	"Pfizer",
	"Novartis",
	"Roche",
	"Bayer",
	"Servier",
	"Pierre Fabre",
	"Boiron",
	"Biogaran",
	"Mylan",
	"Teva",
	"Arrow",
	"EG Labo",
	"GSK"
];
var ROOTS = [
	"Paracétamol",
	"Ibuprofène",
	"Amoxicilline",
	"Doliprane",
	"Spasfon",
	"Smecta",
	"Aspirine",
	"Efferalgan",
	"Voltarène",
	"Ventoline",
	"Levothyrox",
	"Daflon",
	"Imodium",
	"Gaviscon",
	"Maalox",
	"Cétirizine",
	"Lorazépam",
	"Oméprazole",
	"Tramadol",
	"Codéine",
	"Lidocaïne",
	"Bétadine",
	"Biafine",
	"Mercurochrome",
	"Vitamine C",
	"Vitamine D",
	"Magnésium",
	"Fer",
	"Zinc",
	"Oméga 3"
];
var DOSAGES = [
	"100mg",
	"250mg",
	"500mg",
	"1000mg",
	"5mg",
	"10mg",
	"20mg",
	"50mg",
	"200UI",
	"5%",
	"Sirop",
	"Gélule",
	"Comprimé",
	"Sachet"
];
var FORMS = [
	"bte/20",
	"bte/30",
	"bte/16",
	"fl/200ml",
	"tube/50g",
	"bte/12",
	"bte/8"
];
function rand(seed) {
	let s = seed >>> 0;
	return () => {
		s = s * 1664525 + 1013904223 >>> 0;
		return s / 4294967295;
	};
}
var cache = null;
function getAllProducts() {
	if (cache) return cache;
	if (API_ENABLED) {
		cache = [];
		return cache;
	}
	const r = rand(42);
	const list = [];
	for (let i = 0; i < 5240; i++) {
		const root = ROOTS[Math.floor(r() * ROOTS.length)];
		const dose = DOSAGES[Math.floor(r() * DOSAGES.length)];
		const form = FORMS[Math.floor(r() * FORMS.length)];
		const cat = CATEGORIES[Math.floor(r() * CATEGORIES.length)];
		const lab = LABS[Math.floor(r() * LABS.length)];
		const threshold = 20 + Math.floor(r() * 80);
		const stock = Math.floor(r() * 320);
		const price = +(2 + r() * 78).toFixed(2);
		const year = 2026 + Math.floor(r() * 3);
		const month = String(1 + Math.floor(r() * 12)).padStart(2, "0");
		let status = "ok";
		if (stock === 0) status = "rupture";
		else if (stock < threshold * .4) status = "critical";
		else if (stock < threshold) status = "low";
		list.push({
			id: `P${String(i + 1).padStart(5, "0")}`,
			cip: String(34009e8 + Math.floor(r() * 999999999)),
			name: `${root} ${dose} ${form}`,
			category: cat,
			laboratory: lab,
			stock,
			threshold,
			price,
			expiry: `${year}-${month}`,
			status
		});
	}
	cache = list;
	return list;
}
function productStats() {
	const p = getAllProducts();
	return {
		total: p.length,
		value: p.reduce((s, x) => s + x.stock * x.price, 0),
		lowStock: p.filter((x) => x.status === "low" || x.status === "critical").length,
		ruptures: p.filter((x) => x.status === "rupture").length
	};
}
var PAGE_SIZE = 50;
function StocksPage() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
	}, [navigate]);
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const [open, setOpen] = (0, import_react.useState)(false);
	const all = getAllProducts();
	const stats = productStats();
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(all.map((p) => p.category))).sort(), [all]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return all.filter((p) => {
			if (cat !== "all" && p.category !== cat) return false;
			if (status !== "all" && p.status !== status) return false;
			if (ql && !p.name.toLowerCase().includes(ql) && !p.cip.includes(ql) && !p.id.toLowerCase().includes(ql)) return false;
			return true;
		});
	}, [
		all,
		q,
		cat,
		status
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);
	const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	function resetPage(fn) {
		return (v) => {
			fn(v);
			setPage(1);
		};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Gestion des stocks",
		subtitle: `${stats.total.toLocaleString("fr-FR")} références au catalogue`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Exporter CSV"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), "Importer"]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
						label: "Total références",
						value: stats.total.toLocaleString("fr-FR")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
						label: "Valeur stock",
						value: `€${(stats.value / 1e6).toFixed(2)}M`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
						label: "Sous seuil",
						value: stats.lowStock.toLocaleString("fr-FR"),
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniKpi, {
						label: "Ruptures",
						value: stats.ruptures.toLocaleString("fr-FR"),
						tone: "danger"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-2xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-[1fr_200px_200px_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Rechercher par nom, CIP ou référence…",
								value: q,
								onChange: (e) => resetPage(setQ)(e.target.value),
								className: "pl-9"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: cat,
							onValueChange: resetPage(setCat),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Catégorie" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Toutes catégories"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: c
							}, c))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: status,
							onValueChange: resetPage(setStatus),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Statut" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Tous statuts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ok",
									children: "OK"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "low",
									children: "Faible"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "critical",
									children: "Critique"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "rupture",
									children: "Rupture"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "mr-2 h-4 w-4" }), "Filtres avancés"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [filtered.length.toLocaleString("fr-FR"), " résultats"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Page ",
						safePage,
						" / ",
						pageCount
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[900px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Référence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Produit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Catégorie"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Labo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Seuil"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Prix"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Péremption"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Statut"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [slice.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/60 transition-colors hover:bg-surface/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs text-muted-foreground",
									children: p.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: ["CIP ", p.cip]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.laboratory
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right tabular-nums font-medium",
									children: p.stock
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right tabular-nums text-muted-foreground",
									children: p.threshold
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right tabular-nums",
									children: ["€", p.price.toFixed(2)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground text-xs",
									children: p.expiry
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
								})
							]
						}, p.id)), slice.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 9,
							className: "px-4 py-12 text-center text-sm text-muted-foreground",
							children: "Aucun produit ne correspond à votre recherche."
						}) })] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border bg-surface/60 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							(safePage - 1) * PAGE_SIZE + 1,
							"–",
							Math.min(safePage * PAGE_SIZE, filtered.length),
							" sur ",
							filtered.length.toLocaleString("fr-FR")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: safePage === 1,
								onClick: () => setPage(1),
								children: "«"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: safePage === 1,
								onClick: () => setPage((p) => p - 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-3 text-xs tabular-nums",
								children: [
									safePage,
									" / ",
									pageCount
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: safePage === pageCount,
								onClick: () => setPage((p) => p + 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								disabled: safePage === pageCount,
								onClick: () => setPage(pageCount),
								children: "»"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
function MiniKpi({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-1 font-display text-2xl ${tone === "danger" ? "text-destructive" : tone === "warning" ? "text-warning-foreground" : "text-foreground"}`,
			children: value
		})]
	});
}
//#endregion
export { StocksPage as component };
