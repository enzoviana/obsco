import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as setAgencyStatus, I as updateAgency, a as addAgency, t as COUNTRIES, u as deleteAgency, v as getAgencies } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Mail, F as Download, T as MapPin, g as Search, i as Users, l as Trash2, q as Ban, v as Plus, x as Pencil, y as Play } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BVQL-gDZ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-QwJoqlSq.mjs";
import { t as exportCSV } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agences-pNOixuVt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgencesPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("all");
	const [list, setList] = (0, import_react.useState)(() => typeof window !== "undefined" ? getAgencies() : []);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) navigate({ to: "/login" });
		setList(getAgencies());
		const sync = () => setList(getAgencies());
		window.addEventListener("obco:agencies", sync);
		return () => window.removeEventListener("obco:agencies", sync);
	}, [navigate]);
	const filtered = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return list.filter((a) => (country === "all" || a.country === country) && (!ql || a.name.toLowerCase().includes(ql) || a.email.toLowerCase().includes(ql) || a.manager.toLowerCase().includes(ql)));
	}, [
		list,
		q,
		country
	]);
	const handleExport = () => {
		exportCSV("agences", filtered.map((a) => {
			const c = COUNTRIES.find((x) => x.code === a.country);
			return {
				ID: a.id,
				Nom: a.name,
				Pays: c?.name ?? a.country,
				"Code ISO": a.country,
				Région: c?.region ?? "",
				Ville: a.city,
				Email: a.email,
				Responsable: a.manager,
				"Date création": a.createdAt,
				Statut: a.status
			};
		}));
		toast.success("Export CSV téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Agences du réseau",
		subtitle: `${list.length} agences réparties sur ${new Set(list.map((a) => a.country)).size} pays`,
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Créer une agence"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgencyDialog, {
				onClose: () => setOpen(false),
				agency: null
			})]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[240px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher par nom, email, responsable…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: country,
					onValueChange: setCountry,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pays" })
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
						className: "w-full min-w-[860px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Agence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Pays"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Code"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Région"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Responsable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-left font-medium",
										children: "Email"
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((a) => {
							const c = COUNTRIES.find((x) => x.code === a.country);
							const blocked = a.status === "blocked";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/60 hover:bg-surface/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-semibold text-primary",
												children: a.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: a.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													a.id,
													" · ",
													a.city
												]
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), c?.name ?? a.country]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 font-mono text-xs",
										children: a.country
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground text-xs",
										children: c?.region ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3 text-muted-foreground" }), a.manager]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), a.email]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: a.status })
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
													onClick: () => setEditing(a),
													title: "Éditer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8",
													title: blocked ? "Débloquer" : "Bloquer",
													onClick: () => {
														setAgencyStatus(a.id, blocked ? "active" : "blocked");
														toast.success(blocked ? "Agence débloquée" : "Agence bloquée");
													},
													children: blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5 text-warning" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 text-destructive",
													title: "Supprimer",
													onClick: () => {
														if (confirm(`Supprimer ${a.name} ?`)) {
															deleteAgency(a.id);
															toast.success("Agence supprimée");
														}
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, a.id);
						}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "px-4 py-12 text-center text-muted-foreground text-sm",
							children: "Aucune agence trouvée."
						}) })] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgencyDialog, {
					onClose: () => setEditing(null),
					agency: editing
				})
			})
		]
	});
}
function AgencyDialog({ onClose, agency }) {
	const [name, setName] = (0, import_react.useState)(agency?.name ?? "");
	const [country, setCountry] = (0, import_react.useState)(agency?.country ?? COUNTRIES[0].code);
	const [manager, setManager] = (0, import_react.useState)(agency?.manager ?? "");
	const [email, setEmail] = (0, import_react.useState)(agency?.email ?? "");
	const [city, setCity] = (0, import_react.useState)(agency?.city ?? "");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!name || !country || !email) {
			toast.error("Champs requis manquants");
			return;
		}
		setLoading(true);
		try {
			if (agency) {
				updateAgency(agency.id, {
					name,
					country,
					manager,
					email,
					city
				});
				toast.success(`Agence ${name} mise à jour`);
			} else {
				const result = await addAgency({
					name,
					country,
					manager,
					email,
					city
				});
				if (result.temporaryPassword) toast.success(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold mb-1",
						children: [
							"✅ Agence ",
							name,
							" créée"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs opacity-90",
						children: ["📧 Email envoyé à ", email]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 p-2 bg-background/50 rounded border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: "Mot de passe provisoire :"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-sm mt-1 select-all",
							children: result.temporaryPassword
						})]
					})
				] }), { duration: 1e4 });
				else toast.success(`Agence ${name} créée`);
			}
			onClose();
		} catch (error) {
			console.error("Erreur création agence:", error);
			const errorMessage = error?.message || error?.error || "Erreur lors de la création de l'agence";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: agency ? "Modifier l'agence" : "Nouvelle agence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Plusieurs agences peuvent être créées dans un même pays." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nom de l'agence *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "ANF …"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pays *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: country,
						onValueChange: setCountry,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.code,
							children: [
								c.name,
								" (",
								c.code,
								")"
							]
						}, c.code)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ville" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: city,
							onChange: (e) => setCity(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: manager,
							onChange: (e) => setManager(e.target.value)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				disabled: loading,
				children: "Annuler"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: loading,
				children: loading ? "Création en cours..." : agency ? "Enregistrer" : "Créer l'agence"
			})] })
		]
	});
}
//#endregion
export { AgencesPage as component };
