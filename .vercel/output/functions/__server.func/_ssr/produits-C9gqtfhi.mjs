import { i as __toESM } from "../_runtime.mjs";
import { i as apiPost } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as updateProduct, C as getProductObjectives, N as setProductObjectives, P as setProductPricing, S as getProductLaboratories, i as SUPPLIERS, m as deleteProduct, r as PRODUCT_TYPES, s as addCustomProduct, t as COUNTRIES, w as getProductPricing, x as getPanoramicProducts } from "./agencies-BIm1ZU-s.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, G as Boxes, N as FileSpreadsheet, _ as Save, d as Tag, g as Search, l as Trash2, o as Upload, u as Target, v as Plus, x as Pencil } from "../_libs/lucide-react.mjs";
import { n as StatusBadge, t as AppShell } from "./AppShell-ClS6A7yg.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produits-C9gqtfhi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function ProduitsPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [lab, setLab] = (0, import_react.useState)("all");
	const [type, setType] = (0, import_react.useState)("all");
	const [all, setAll] = (0, import_react.useState)([]);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const reload = () => {
			const products = getPanoramicProducts();
			console.log(`🔄 Rechargement produits : ${products.length} produits`);
			setAll(products);
		};
		reload();
		window.addEventListener("obco:products", reload);
		return () => window.removeEventListener("obco:products", reload);
	}, [navigate]);
	const labs = (0, import_react.useMemo)(() => Array.from(new Set(all.map((p) => p.laboratory))).sort(), [all]);
	const list = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return all.filter((p) => (lab === "all" || p.laboratory === lab) && (type === "all" || p.type === type) && (!ql || p.name.toLowerCase().includes(ql) || p.cip.includes(ql) || p.laboratory.toLowerCase().includes(ql)));
	}, [
		all,
		q,
		lab,
		type
	]);
	const exportFull = () => {
		const panoramique = list.map((p) => ({
			ID: p.id,
			CIP: p.cip,
			Produit: p.name,
			Laboratoire: p.laboratory,
			Type: p.type,
			Statut: p.productStatus,
			"Ventes": p.ventes,
			"Budget Mois": p.budgetMois,
			"Taux Réal (%)": p.tauxReal,
			"Ventes An-1": p.ventesAn1,
			"Taux Évol (%)": p.tauxEvol,
			"CA": p.ca,
			"Budget Mois CA": p.budgetMoisCa,
			"Tx Real Budget CA (%)": p.txRealBudgetCa,
			"Cumul Budget": p.cumulBudget,
			"Cumul Réalisé": p.cumulRealise,
			"Tx Réal prév (%)": p.txRealPrev,
			"Poids (%)": p.poids
		}));
		const fournisseurs = [];
		for (const p of list) {
			const row = {
				ID: p.id,
				Produit: p.name,
				Laboratoire: p.laboratory
			};
			for (const s of SUPPLIERS) {
				const f = p.fournisseurs[s];
				row[`${s} - Prix Unit.`] = f.prixUnitaire;
				row[`${s} - Ventes`] = f.ventes;
				row[`${s} - Stocks`] = f.stocks;
				row[`${s} - Commandes`] = f.commandes;
			}
			fournisseurs.push(row);
		}
		exportXLSX("produits-complet", {
			Panoramique: panoramique,
			"Sorties Locales": fournisseurs
		});
		toast.success("Export complet téléchargé (panoramique + Sorties Locales)");
	};
	const exportSimpleCSV = () => {
		exportCSV("produits", list.map((p) => ({
			ID: p.id,
			Désignation: p.name,
			Laboratoire: p.laboratory,
			Type: p.type,
			"Objectif mois": p.budgetMois,
			Statut: p.productStatus
		})));
		toast.success("CSV simple téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Produits",
		subtitle: `${list.length} références · vue simplifiée`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportSimpleCSV,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "CSV simple"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: exportFull,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "Export complet (XLSX)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: importOpen,
				onOpenChange: setImportOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), "Importer CSV"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, { onClose: () => setImportOpen(false) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Créer un produit"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
					onClose: () => setCreateOpen(false),
					product: null
				})]
			})
		] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[260px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Rechercher (désignation, CIP, laboratoire)…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: lab,
						onValueChange: setLab,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Laboratoire" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous laboratoires"
						}), labs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: l,
							children: l
						}, l))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: setType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Type" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Tous types"
						}), PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t,
							children: t
						}, t))] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[820px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Désignation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Laboratoire"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Statut"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [list.slice(0, 100).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/60 hover:bg-surface/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: p.cip && !p.cip.startsWith("NOCIP-") ? p.cip : "Sans code CIP"
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5 text-muted-foreground",
									children: p.laboratory
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex rounded-md bg-secondary px-2 py-1 text-xs",
										children: p.type
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.productStatus })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 px-2 text-xs",
											onClick: () => setEditing(p),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5 mr-1" }), "Éditer"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-destructive",
											onClick: () => {
												if (confirm(`Supprimer ${p.name} ?`)) {
													deleteProduct(p.id);
													toast.success("Produit supprimé");
												}
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})
								})
							]
						}, p.id)), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-12 text-center text-muted-foreground text-sm",
							children: "Aucun produit trouvé."
						}) })] })]
					})
				}), list.length > 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-3 text-xs text-muted-foreground",
					children: [
						"Affichage des 100 premiers résultats sur ",
						list.length,
						". Affinez la recherche pour cibler un produit."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
					onClose: () => setEditing(null),
					product: editing
				})
			})
		]
	});
}
function ProductDialog({ onClose, product }) {
	const labs = getProductLaboratories();
	const [name, setName] = (0, import_react.useState)(product?.name ?? "");
	const [cip, setCip] = (0, import_react.useState)(product?.cip ?? "");
	const [laboratory, setLab] = (0, import_react.useState)(product?.laboratory ?? labs[0] ?? "");
	const [type, setType] = (0, import_react.useState)(product?.type ?? PRODUCT_TYPES[0]);
	const [status, setStatus] = (0, import_react.useState)(product?.productStatus ?? "active");
	const [prices, setPrices] = (0, import_react.useState)({});
	const [objs, setObjs] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (product) {
			setPrices(getProductPricing(product.id, 0));
			setObjs(getProductObjectives(product.id, product.budgetMois));
		} else {
			const p = {};
			const o = {};
			for (const c of COUNTRIES) {
				p[c.code] = 0;
				o[c.code] = 0;
			}
			setPrices(p);
			setObjs(o);
		}
	}, [product]);
	const submit = () => {
		if (!name || !laboratory) {
			toast.error("Désignation et laboratoire requis");
			return;
		}
		if (product) {
			updateProduct(product.id, {
				name,
				laboratory,
				type,
				productStatus: status
			});
			setProductPricing(product.id, prices);
			setProductObjectives(product.id, objs);
			toast.success("Produit mis à jour");
		} else {
			addCustomProduct({
				name,
				cip,
				laboratory,
				type,
				productStatus: status,
				pricing: prices,
				objectives: objs
			});
			toast.success("Produit créé");
		}
		onClose();
	};
	const totalObj = Object.values(objs).reduce((a, b) => a + b, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: product ? "Modifier le produit" : "Nouveau produit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Désignation, laboratoire, type, statut, prix et objectifs par pays." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "info",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "info",
								className: "flex-1",
								children: "Informations"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "prix",
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3.5 w-3.5 mr-2" }), "Prix par pays"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "obj",
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 mr-2" }), "Objectifs (qté)"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "info",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Désignation *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "ex. Paracétamol 500 bte/20"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code produit (CIP / GTIN)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cip,
									onChange: (e) => setCip(e.target.value),
									placeholder: "ex. 3400936000001 (optionnel)",
									disabled: !!product
								}),
								!product && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Facultatif. Laisser vide si le produit n'a pas de code CIP."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Laboratoire *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: laboratory,
									onValueChange: setLab,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: labs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: l,
										children: l
									}, l)) })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: setType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Statut" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: status,
								onValueChange: (v) => setStatus(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Actif"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "warning",
										children: "Retirer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "inactive",
										children: "Inactif"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "blocked",
										children: "Bloqué"
									})
								] })]
							})] }),
							" "
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "prix",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[360px] overflow-y-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-surface sticky top-0 text-[10px] uppercase tracking-wider text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left font-medium",
											children: "Pays"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left font-medium",
											children: "Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-right font-medium",
											children: "Prix unitaire (€)"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-medium",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-mono text-xs",
											children: c.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.01",
												className: "w-28 text-right h-8 ml-auto block",
												value: prices[c.code] ?? 0,
												onChange: (e) => setPrices({
													...prices,
													[c.code]: parseFloat(e.target.value) || 0
												})
											})
										})
									]
								}, c.code)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "obj",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[360px] overflow-y-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-surface sticky top-0 text-[10px] uppercase tracking-wider text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left font-medium",
											children: "Pays"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left font-medium",
											children: "Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-right font-medium",
											children: "Objectif (unités)"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-medium",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 font-mono text-xs",
											children: c.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "1",
												className: "w-28 text-right h-8 ml-auto block",
												value: objs[c.code] ?? 0,
												onChange: (e) => setObjs({
													...objs,
													[c.code]: parseInt(e.target.value) || 0
												})
											})
										})
									]
								}, c.code)) })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-xs text-muted-foreground text-right",
							children: [
								"Total: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-foreground",
									children: totalObj.toLocaleString("fr-FR")
								}),
								" unités"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Annuler"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: submit,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5 mr-1.5" }), product ? "Enregistrer" : "Créer le produit"]
			})] })
		]
	});
}
function ImportDialog({ onClose }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)([]);
	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			parseCSV(selectedFile);
		}
	};
	const parseCSV = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const lines = (e.target?.result).split("\n").filter((line) => line.trim());
			if (lines.length < 2) {
				toast.error("Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données");
				return;
			}
			const headers = lines[0].split(/[,;]/).map((h) => h.trim().toLowerCase());
			const nameIdx = headers.findIndex((h) => h.includes("nom") || h === "name" || h.includes("designation"));
			const cipIdx = headers.findIndex((h) => h === "cip" || h === "code");
			const labIdx = headers.findIndex((h) => h.includes("labo") || h === "laboratory");
			const categoryIdx = headers.findIndex((h) => h.includes("type") || h === "category" || h.includes("categorie"));
			const priceIdx = headers.findIndex((h) => h.includes("prix") || h === "price" || h.includes("baseprice"));
			const countryIdx = headers.findIndex((h) => h.includes("country") || h === "pays" || h.includes("countrycode"));
			if (nameIdx === -1 || labIdx === -1) {
				toast.error("Le CSV doit contenir au minimum les colonnes 'nom' et 'laboratoire'");
				return;
			}
			const products = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(/[,;]/).map((v) => v.trim());
				if (values.length < 2) continue;
				const product = {
					name: values[nameIdx] || "",
					laboratory: values[labIdx] || ""
				};
				if (cipIdx !== -1 && values[cipIdx]) product.cip = values[cipIdx];
				if (categoryIdx !== -1 && values[categoryIdx]) product.category = values[categoryIdx];
				if (priceIdx !== -1 && values[priceIdx]) {
					const price = parseFloat(values[priceIdx].replace(/[^\d.]/g, ""));
					if (!isNaN(price)) product.basePrice = price;
				}
				if (countryIdx !== -1 && values[countryIdx]) product.countryCode = values[countryIdx].toUpperCase();
				if (product.name && product.laboratory) products.push(product);
			}
			setPreview(products);
			if (products.length === 0) toast.error("Aucun produit valide trouvé dans le fichier");
			else toast.success(`${products.length} produits prêts à être importés`);
		};
		reader.readAsText(file);
	};
	const handleImport = async () => {
		if (preview.length === 0) {
			toast.error("Aucun produit à importer");
			return;
		}
		setLoading(true);
		try {
			const result = await apiPost("/api/import/products", preview);
			if (result.success) {
				toast.success(result.message);
				window.dispatchEvent(new CustomEvent("obco:products"));
				onClose();
			} else toast.error(result.error || "Erreur lors de l'import");
			if (result.errors && result.errors.length > 0) {
				console.error("Erreurs d'import:", result.errors);
				toast.warning(`${result.errors.length} erreur(s) rencontrée(s). Voir la console.`);
			}
		} catch (error) {
			console.error("Erreur d'import:", error);
			toast.error(error.message || "Erreur lors de l'import");
		} finally {
			setLoading(false);
		}
	};
	const downloadTemplate = () => {
		const blob = new Blob(["nom,laboratoire,cip,type,prix,countryCode\nParacétamol 500mg,LABORATOIRE X,3400936000001,Médicament,2.50,FR\nIbuprofène 400mg,LABORATOIRE Y,3400938000002,Médicament,3.20,FR\nVitamine C 1000mg,LABORATOIRE Z,,Complément alimentaire,5.00,ML"], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "template_import_produits.csv";
		link.click();
		toast.success("Modèle téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Importer des produits via CSV" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Téléchargez un fichier CSV contenant vos produits. Les laboratoires inexistants seront créés automatiquement." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fichier CSV" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ".csv",
						onChange: handleFileChange,
						className: "mt-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Colonnes requises : ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "nom" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "laboratoire" }),
							". Colonnes optionnelles : cip, type, prix, countryCode (pays du labo, défaut: FR)"
						]
					})
				] }), file && preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-medium text-sm",
							children: [
								"Aperçu (",
								preview.length,
								" produits)"
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[300px] overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-card sticky top-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 text-left font-medium",
											children: "Nom"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 text-left font-medium",
											children: "Laboratoire"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 text-left font-medium",
											children: "CIP"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 text-left font-medium",
											children: "Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 text-right font-medium",
											children: "Prix"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.slice(0, 50).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: p.laboratory
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 font-mono",
										children: p.cip || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: p.category || "Médicament"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-right",
										children: p.basePrice ? `${p.basePrice}€` : "-"
									})
								]
							}, i)) })]
						}), preview.length > 50 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground text-center mt-2",
							children: [
								"... et ",
								preview.length - 50,
								" autres produits"
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: downloadTemplate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), "Télécharger un modèle"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Annuler"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleImport,
					disabled: loading || preview.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 mr-1.5" }), loading ? "Import en cours..." : `Importer ${preview.length} produit(s)`]
				})
			] })
		]
	});
}
//#endregion
export { ProduitsPage as component };
