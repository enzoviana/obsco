import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { M as setLaboratoireStatus, b as getLaboratoires, l as addLaboratoire, p as deleteLaboratoire, z as updateLaboratoire } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Mail, F as Download, M as FlaskConical, T as MapPin, a as User, b as Phone, g as Search, l as Trash2, q as Ban, v as Plus, x as Pencil, y as Play } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BVQL-gDZ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-QwJoqlSq.mjs";
import { t as exportCSV } from "./export-B7MgEGmo.mjs";
import { t as WORLD_COUNTRIES } from "./countries-data-CMOImnSi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/laboratoires-Dook03wu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function LaboratoiresPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("all");
	const [list, setList] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		try {
			setList(getLaboratoires());
		} catch (err) {
			console.error("Erreur lors du chargement des laboratoires:", err);
			toast.error("Erreur lors du chargement des laboratoires");
			setList([]);
		}
		const sync = () => {
			try {
				setList(getLaboratoires());
			} catch (err) {
				console.error("Erreur lors de la synchronisation des laboratoires:", err);
			}
		};
		window.addEventListener("obco:labs", sync);
		return () => window.removeEventListener("obco:labs", sync);
	}, [navigate]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return list.filter((l) => (country === "all" || l.country === country) && (!ql || l.name.toLowerCase().includes(ql) || l.email.toLowerCase().includes(ql) || l.contact.toLowerCase().includes(ql)));
	}, [
		list,
		q,
		country
	]);
	const handleExport = () => {
		exportCSV("laboratoires", filtered.map((l) => {
			const c = WORLD_COUNTRIES.find((x) => x.code === l.country);
			return {
				ID: l.id,
				Laboratoire: l.name,
				Pays: c?.name ?? l.country,
				"Code Pays": l.country,
				"Région": c?.region ?? "",
				Contact: l.contact,
				Email: l.email,
				Téléphone: l.phone,
				Adresse: l.address,
				Statut: l.status,
				"Date création": l.createdAt
			};
		}));
		toast.success("Export CSV téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Laboratoires",
		subtitle: `${list.length} laboratoires · plusieurs labs autorisés par pays`,
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Créer un laboratoire"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabDialog, {
				onClose: () => setOpen(false),
				lab: null
			})]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[240px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher par nom, email, contact…",
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
					}), WORLD_COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.code,
						children: [
							c.flag,
							" ",
							c.name
						]
					}, c.code))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[960px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Laboratoire"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Pays"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Région"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Contact"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Email / Tél."
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((l) => {
							const c = WORLD_COUNTRIES.find((x) => x.code === l.country);
							const blocked = l.status === "blocked";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/60 hover:bg-surface/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: l.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-muted-foreground",
												children: l.id
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
												c?.name ?? l.country,
												" (",
												l.country,
												")"
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: c?.region ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3 text-muted-foreground" }), l.contact]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-0.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), l.email]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), l.phone]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: l.status })
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
													onClick: () => setEditing(l),
													title: "Éditer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8",
													title: blocked ? "Débloquer" : "Bloquer",
													onClick: () => {
														setLaboratoireStatus(l.id, blocked ? "active" : "blocked");
														toast.success(blocked ? "Laboratoire débloqué" : "Laboratoire bloqué");
													},
													children: blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5 text-warning" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-destructive",
													title: "Supprimer",
													onClick: () => {
														if (confirm(`Supprimer ${l.name} ?`)) {
															deleteLaboratoire(l.id);
															toast.success("Laboratoire supprimé");
														}
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, l.id);
						}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-4 py-12 text-center text-muted-foreground text-sm",
							children: "Aucun laboratoire trouvé."
						}) })] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabDialog, {
					onClose: () => setEditing(null),
					lab: editing
				})
			})
		]
	});
}
function LabDialog({ onClose, lab }) {
	const [f, setF] = (0, import_react.useState)({
		name: lab?.name ?? "",
		country: lab?.country ?? "",
		contact: lab?.contact ?? "",
		email: lab?.email ?? "",
		phone: lab?.phone ?? "",
		address: lab?.address ?? ""
	});
	const submit = () => {
		if (!f.name || !f.country || !f.email) {
			toast.error("Champs requis manquants");
			return;
		}
		if (lab) {
			updateLaboratoire(lab.id, f);
			toast.success(`Laboratoire ${f.name} mis à jour`);
		} else {
			addLaboratoire(f);
			toast.success(`Laboratoire ${f.name} créé`);
		}
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: lab ? "Modifier le laboratoire" : "Nouveau laboratoire" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Plusieurs laboratoires peuvent être créés dans le même pays." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nom du laboratoire *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.name,
						onChange: (e) => setF({
							...f,
							name: e.target.value
						}),
						placeholder: "ex. Sanofi Afrique"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pays *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.country,
						onValueChange: (v) => setF({
							...f,
							country: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sélectionner un pays" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: WORLD_COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.code,
							children: [
								c.flag,
								" ",
								c.name
							]
						}, c.code)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contact" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.contact,
							onChange: (e) => setF({
								...f,
								contact: e.target.value
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Téléphone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: f.phone,
							onChange: (e) => setF({
								...f,
								phone: e.target.value
							}),
							placeholder: "+225 …"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "E-mail *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: f.email,
						onChange: (e) => setF({
							...f,
							email: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Adresse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: f.address,
						onChange: (e) => setF({
							...f,
							address: e.target.value
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
				children: lab ? "Enregistrer" : "Créer le laboratoire"
			})] })
		]
	});
}
//#endregion
export { LaboratoiresPage as component };
