import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as updateCountry, T as reloadCountries, d as deleteCountry, h as ensureCountriesLoaded, o as addCountry, t as COUNTRIES, v as getAgencies } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, g as Search, l as Trash2, n as X, v as Plus, x as Pencil } from "../_libs/lucide-react.mjs";
import { f as StatusBadge, n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BVQL-gDZ.mjs";
import { t as exportCSV } from "./export-B7MgEGmo.mjs";
import { n as getCountryByCode, t as WORLD_COUNTRIES } from "./countries-data-CMOImnSi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pays-JtlJ47ko.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}
function CountrySelect({ value, onSelect, disabled, placeholder = "Sélectionner un pays..." }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const wrapperRef = (0, import_react.useRef)(null);
	const selectedCountry = (0, import_react.useMemo)(() => WORLD_COUNTRIES.find((c) => c.code === value), [value]);
	const filteredCountries = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase().trim();
		if (!q) return WORLD_COUNTRIES;
		return WORLD_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.region.toLowerCase().includes(q));
	}, [search]);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
		}
		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapperRef,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled,
			onClick: () => setOpen(!open),
			className: cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background", "hover:bg-accent hover:text-accent-foreground", "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", "disabled:cursor-not-allowed disabled:opacity-50", !selectedCountry && "text-muted-foreground"),
			children: [selectedCountry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl leading-none",
						children: selectedCountry.flag
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: selectedCountry.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"(",
							selectedCountry.code,
							")"
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: placeholder }), selectedCountry && !disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "h-4 w-4 shrink-0 opacity-50 hover:opacity-100",
				onClick: (e) => {
					e.stopPropagation();
					onSelect({
						name: "",
						code: "",
						code3: "",
						flag: "",
						region: ""
					});
				}
			})]
		}), open && !disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Rechercher un pays...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
					autoFocus: true
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[300px] overflow-y-auto p-1",
				children: filteredCountries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "Aucun pays trouvé."
				}) : filteredCountries.map((country) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onSelect(country);
						setOpen(false);
						setSearch("");
					},
					className: cn("relative flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors", "hover:bg-accent hover:text-accent-foreground", value === country.code && "bg-accent"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl leading-none",
						children: country.flag
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: country.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								country.code,
								" · ",
								country.region
							]
						})]
					})]
				}, country.code))
			})]
		})]
	});
}
function PaysPage() {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [refresh, setRefresh] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) navigate({ to: "/login" });
		ensureCountriesLoaded();
		setRefresh((x) => x + 1);
		const sync = () => {
			reloadCountries();
			setRefresh((x) => x + 1);
		};
		window.addEventListener("obco:countries", sync);
		return () => window.removeEventListener("obco:countries", sync);
	}, [navigate]);
	const rows = (0, import_react.useMemo)(() => {
		const agencies = typeof window !== "undefined" ? getAgencies() : [];
		const ql = q.toLowerCase().trim();
		return COUNTRIES.map((c) => ({
			...c,
			agences: agencies.filter((a) => a.country === c.code).length
		})).filter((r) => !ql || r.name.toLowerCase().includes(ql) || r.code.toLowerCase().includes(ql) || r.region.toLowerCase().includes(ql));
	}, [q, refresh]);
	const handleExport = () => {
		exportCSV("pays", rows.map((r) => ({
			Pays: r.name,
			"Code ISO": r.code,
			Région: r.region,
			Devise: r.currency,
			Agences: r.agences
		})));
		toast.success("CSV téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Pays",
		subtitle: `${COUNTRIES.length} pays · Région et code ISO modifiables`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleExport,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Exporter CSV"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Ajouter un pays"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaysDialog, {
				onClose: () => setOpen(false),
				pays: null
			})]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 rounded-2xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rechercher un pays, code ISO, région…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-surface text-[11px] uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Pays"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Code ISO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Région"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Devise"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Agences"
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
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border/60 hover:bg-surface/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-9 w-9 place-items-center rounded-lg bg-surface",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl leading-none",
											children: getCountryByCode(r.code)?.flag || "🌍"
										})
									}), r.name]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs",
								children: r.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: r.region
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: r.currency
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right tabular-nums",
								children: r.agences
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.agences > 0 ? "active" : "inactive" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8",
										title: "Éditer",
										onClick: () => setEditing(r),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8 text-destructive",
										title: "Supprimer",
										onClick: () => {
											if (r.agences > 0) {
												toast.error("Supprimez d'abord les agences de ce pays");
												return;
											}
											if (confirm(`Supprimer ${r.name} ?`)) {
												deleteCountry(r.code);
												toast.success("Pays supprimé");
											}
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								})
							})
						]
					}, r.code)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaysDialog, {
					onClose: () => setEditing(null),
					pays: editing
				})
			})
		]
	});
}
function PaysDialog({ onClose, pays }) {
	const [selectedCountryCode, setSelectedCountryCode] = (0, import_react.useState)(pays?.code ?? "");
	const [f, setF] = (0, import_react.useState)({
		code: pays?.code ?? "",
		name: pays?.name ?? "",
		region: pays?.region ?? "Afrique",
		currency: pays?.currency ?? "EUR",
		isANF: pays?.isANF ?? false
	});
	const handleCountrySelect = (country) => {
		if (country.code) {
			setSelectedCountryCode(country.code);
			setF({
				code: country.code,
				name: country.name,
				region: country.region,
				currency: "EUR",
				isANF: false
			});
		}
	};
	const submit = () => {
		if (!f.code || !f.name || !f.region) {
			toast.error("Veuillez sélectionner un pays");
			return;
		}
		try {
			if (pays) {
				updateCountry(pays.code, f);
				toast.success(`Pays ${f.name} mis à jour`);
			} else {
				addCountry({
					...f,
					code: f.code.toUpperCase()
				});
				toast.success(`Pays ${f.name} ajouté`);
			}
			onClose();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: pays ? "Modifier le pays" : "Nouveau pays" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: pays ? "Modifiez les informations du pays." : "Sélectionnez un pays dans la liste. Les informations seront pré-remplies automatiquement." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					!pays && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sélectionner un pays *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountrySelect, {
							value: selectedCountryCode,
							onSelect: handleCountrySelect,
							placeholder: "Rechercher un pays..."
						})
					})] }),
					pays && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pays" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl leading-none",
							children: getCountryByCode(pays.code)?.flag || "🌍"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: f.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Code ISO: ", f.code]
						})] })]
					})] }),
					(selectedCountryCode || pays) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code ISO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: f.code,
								disabled: true,
								className: "bg-surface"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Région" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: f.region,
								onChange: (e) => setF({
									...f,
									region: e.target.value
								}),
								placeholder: "Afrique"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Devise" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: f.currency,
								onChange: (e) => setF({
									...f,
									currency: e.target.value.toUpperCase()
								}),
								placeholder: "EUR",
								maxLength: 3
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "EUR par défaut. Modifiable si nécessaire."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center space-x-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: "isANF",
								checked: f.isANF || false,
								onChange: (e) => setF({
									...f,
									isANF: e.target.checked
								}),
								className: "h-4 w-4 rounded border-gray-300"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "isANF",
								className: "cursor-pointer",
								children: "Pays ANF"
							})]
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onClose,
				children: "Annuler"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: !f.code || !f.name,
				children: pays ? "Enregistrer" : "Ajouter le pays"
			})] })
		]
	});
}
//#endregion
export { PaysPage as component };
