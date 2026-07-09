import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { R as updateGrossiste, c as addGrossiste, f as deleteGrossiste, j as setGrossisteStatus, t as COUNTRIES, v as getAgencies, y as getGrossistes } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Mail, F as Download, T as MapPin, g as Search, l as Trash2, q as Ban, s as Truck, v as Plus, x as Pencil, y as Play } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BVQL-gDZ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-QwJoqlSq.mjs";
import { t as exportCSV } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grossistes-BhEJ89im.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GrossistesPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("all");
	const [list, setList] = (0, import_react.useState)(() => typeof window !== "undefined" ? getGrossistes() : []);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	typeof window !== "undefined" && getAgencies();
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) navigate({ to: "/login" });
		setList(getGrossistes());
		const sync = () => setList(getGrossistes());
		window.addEventListener("obco:gros", sync);
		return () => window.removeEventListener("obco:gros", sync);
	}, [navigate]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return list.filter((g) => (country === "all" || g.country === country) && (!ql || g.partenaire.toLowerCase().includes(ql) || g.email.toLowerCase().includes(ql)));
	}, [
		list,
		q,
		country
	]);
	const handleExport = () => {
		exportCSV("grossistes", filtered.map((g) => {
			return {
				ID: g.id,
				Partenaire: g.partenaire,
				Type: g.type,
				"Code Pays": g.country,
				Pays: COUNTRIES.find((c) => c.code === g.country)?.name ?? g.country,
				Statut: g.status,
				Email: g.email
			};
		}));
		toast.success("Export CSV téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Fournisseurs",
		subtitle: `${list.length} partenaires`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleExport,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Exporter"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Ajouter un fournisseur"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrossisteDialog, {
				onClose: () => setOpen(false),
				g: null
			})]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[240px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher un partenaire…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: country,
					onValueChange: setCountry,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[220px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "Tous les pays"
					}), COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.code,
						children: c.name
					}, c.code))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Partenaire"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Pays"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Statut"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right font-medium",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((g) => {
							const c = COUNTRIES.find((x) => x.code === g.country);
							const blocked = g.status === "blocked";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/60 hover:bg-surface/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: g.partenaire
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													g.id,
													" · ",
													g.type
												]
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
												c?.name ?? g.country,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-[10px]",
													children: [
														"(",
														g.country,
														")"
													]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: g.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), g.email]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8",
													onClick: () => setEditing(g),
													title: "Éditer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8",
													title: blocked ? "Débloquer" : "Bloquer",
													onClick: () => {
														setGrossisteStatus(g.id, blocked ? "active" : "blocked");
														toast.success(blocked ? "Fournisseur débloqué" : "Fournisseur bloqué");
													},
													children: blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5 text-warning" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-destructive",
													title: "Supprimer",
													onClick: () => {
														if (confirm(`Supprimer ${g.partenaire} ?`)) {
															deleteGrossiste(g.id);
															toast.success("Fournisseur supprimé");
														}
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, g.id);
						}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "px-4 py-12 text-center text-muted-foreground text-sm",
							children: "Aucun fournisseur trouvé."
						}) })] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrossisteDialog, {
					onClose: () => setEditing(null),
					g: editing
				})
			})
		]
	});
}
function GrossisteDialog({ onClose, g }) {
	const [f, setF] = (0, import_react.useState)({
		partenaire: g?.partenaire ?? "",
		type: "Grossiste",
		country: g?.country ?? COUNTRIES[0].code,
		email: g?.email ?? "",
		status: g?.status ?? "active"
	});
	const submit = () => {
		if (!f.partenaire || !f.email) {
			toast.error("Champs requis manquants");
			return;
		}
		if (g) {
			updateGrossiste(g.id, f);
			toast.success("Fournisseur mis à jour");
		} else {
			addGrossiste(f);
			toast.success(`${f.partenaire} ajouté`);
		}
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: g ? "Modifier le fournisseur" : "Nouveau fournisseur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Informations du fournisseur grossiste." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Partenaire *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.partenaire,
						onChange: (e) => setF({
							...f,
							partenaire: e.target.value
						}),
						placeholder: "ex. CAMED"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pays *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: f.country,
							onValueChange: (v) => setF({
								...f,
								country: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: c.code,
								children: [
									c.name,
									" (",
									c.code,
									")"
								]
							}, c.code)) })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Statut" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: f.status,
							onValueChange: (v) => setF({
								...f,
								status: v
							}),
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
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: f.email,
						onChange: (e) => setF({
							...f,
							email: e.target.value
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Annuler"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				children: g ? "Enregistrer" : "Ajouter"
			})] })
		]
	});
}
//#endregion
export { GrossistesPage as component };
