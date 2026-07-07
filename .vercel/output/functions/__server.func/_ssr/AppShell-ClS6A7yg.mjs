import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as setRole, i as logout, o as useUser } from "./auth-09JE-lnI.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Logo_default } from "./Logo-BoQk6txv.mjs";
import { _ as useNavigate, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as FileChartColumn, C as Package, D as LogOut, G as Boxes, H as Check, K as Bell, L as Circle, M as FlaskConical, V as ChevronDown, W as Building2, at as ChartColumn, d as Tag, f as Store, g as Search, h as Settings, i as Users, j as FolderOpen, k as LayoutDashboard, m as ShieldCheck, o as Upload, tt as Earth, u as Target, w as PackageOpen, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-ClS6A7yg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var NAV = [
	{
		to: "/",
		label: "Tableau de bord",
		icon: LayoutDashboard,
		exact: true
	},
	{
		group: "Gestion",
		icon: FolderOpen,
		adminOnly: true,
		children: [
			{
				to: "/laboratoires",
				label: "Laboratoires",
				icon: FlaskConical
			},
			{
				to: "/produits",
				label: "Produits",
				icon: Boxes
			},
			{
				to: "/produits-objectifs",
				label: "Objectifs produits",
				icon: Target
			},
			{
				to: "/produits-tarifs",
				label: "Tarifs produits",
				icon: Tag
			},
			{
				to: "/pays",
				label: "Pays",
				icon: Earth
			},
			{
				to: "/agences",
				label: "Agences",
				icon: Building2
			},
			{
				to: "/grossistes",
				label: "Grossistes",
				icon: Store
			}
		]
	},
	{
		group: "Sorties Locales",
		icon: PackageOpen,
		adminOnly: true,
		to: "/sorties-locales",
		children: [
			{
				to: "/sorties-locales",
				label: "Sorties Locales",
				icon: Boxes,
				exact: true
			},
			{
				to: "/sorties-locales/objectifs-pays",
				label: "R1 · Objectifs / Pays",
				icon: Target
			},
			{
				to: "/sorties-locales/objectifs-anf",
				label: "R2 · Objectifs ANF",
				icon: Target
			},
			{
				to: "/sorties-locales/ventes-un",
				label: "R3 · Ventes (UN)",
				icon: ChartColumn
			},
			{
				to: "/sorties-locales/ventes-ca",
				label: "R4 · Ventes (CA)",
				icon: ChartColumn
			},
			{
				to: "/sorties-locales/evolution-un",
				label: "R5 · Évolution (UN)",
				icon: ChartColumn
			},
			{
				to: "/sorties-locales/evolution-ca",
				label: "R5bis · Évolution (CA)",
				icon: ChartColumn
			},
			{
				to: "/sorties-locales/stocks-pays",
				label: "R6 · Stocks / Pays",
				icon: Package
			},
			{
				to: "/sorties-locales/stocks-en-cours",
				label: "R7bis · Stocks en cours",
				icon: Package
			},
			{
				to: "/sorties-locales/vue-panoramique",
				label: "R8 · Vue panoramique",
				icon: LayoutDashboard
			}
		]
	},
	{
		to: "/rapports",
		label: "Rapports",
		icon: FileChartColumn,
		adminOnly: true
	},
	{
		to: "/stats",
		label: "Statistiques",
		icon: ChartColumn
	},
	{
		to: "/stocks",
		label: "Stocks",
		icon: Package,
		agencyOnly: true
	},
	{
		to: "/import",
		label: "Import / Export",
		icon: Upload,
		agencyOnly: true
	},
	{
		group: "Paramètres",
		icon: Settings,
		children: [
			{
				to: "/parametres",
				label: "Général",
				icon: Settings
			},
			{
				to: "/parametres#utilisateurs",
				label: "Utilisateurs",
				icon: Users
			},
			{
				to: "/parametres#admin",
				label: "Admin",
				icon: ShieldCheck
			}
		]
	}
];
function isGroup(n) {
	return n.group !== void 0;
}
function AppShell({ children, title, subtitle, actions }) {
	const user = useUser();
	const loc = useLocation();
	const navigate = useNavigate();
	const filtered = NAV.filter((n) => {
		if (isGroup(n)) return !(n.adminOnly && user?.role !== "admin");
		if (n.adminOnly && user?.role !== "admin") return false;
		if (n.agencyOnly && user?.role !== "pharmacy") return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2.5 px-5 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: Logo_default,
						alt: "OBCO",
						className: "h-10 w-auto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-2 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4",
					children: filtered.map((n, idx) => {
						if (isGroup(n)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
							entry: n,
							pathname: loc.pathname
						}, `g-${idx}-${n.group}`);
						const active = n.exact ? loc.pathname === n.to : loc.pathname === n.to;
						const Icon = n.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), n.label]
						}, n.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							logout();
							navigate({ to: "/login" });
						},
						className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Déconnexion"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rechercher un produit, une agence, un pays…" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "ml-auto rounded border border-border bg-card px-1.5 py-0.5 text-[10px]",
								children: "⌘K"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex items-center rounded-xl border border-border bg-surface p-1 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setRole("pharmacy"),
									className: `rounded-lg px-3 py-1.5 transition-colors ${user?.role === "pharmacy" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: "Agence"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setRole("admin"),
									className: `rounded-lg px-3 py-1.5 transition-colors ${user?.role === "admin" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: "Super-Admin"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "icon",
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
								className: "flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5 hover:bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground",
										children: user?.name?.[0]?.toUpperCase() ?? "U"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden sm:block text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-medium leading-tight",
											children: user?.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground leading-tight",
											children: user?.pharmacyName
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 text-muted-foreground" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: user?.email }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => navigate({ to: "/parametres" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), " Paramètres"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => {
											logout();
											navigate({ to: "/login" });
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Déconnexion"]
									})
								]
							})] })
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-6 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-[1400px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium uppercase tracking-wider text-primary",
								children: subtitle
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 truncate font-display text-4xl text-foreground sm:text-5xl",
								children: title
							})]
						}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex shrink-0 gap-2",
							children: actions
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children
					})]
				})
			})]
		})]
	});
}
function NavGroup({ entry, pathname }) {
	const isChildActive = entry.children.some((c) => {
		const base = c.to.split("#")[0];
		return c.exact ? pathname === base : pathname === base || pathname.startsWith(base + "/");
	});
	const selfActive = entry.to ? pathname === entry.to : false;
	const [open, setOpen] = (0, import_react.useState)(isChildActive || selfActive);
	const Icon = entry.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isChildActive || selfActive ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"}`,
		children: [entry.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: entry.to,
			className: "flex flex-1 items-center gap-3",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.group })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			className: "flex flex-1 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.group })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": open ? "Réduire" : "Développer",
			onClick: () => setOpen((o) => !o),
			className: "ml-auto -mr-1 p-1 text-muted-foreground hover:text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}` })
		})]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 ml-3 border-l border-border pl-2 space-y-0.5",
		children: entry.children.map((c) => {
			const [base, hash] = c.to.split("#");
			const active = pathname === base;
			const CIcon = c.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: base,
				hash,
				className: `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${active ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CIcon, { className: "h-3.5 w-3.5" }), c.label]
			}, c.to);
		})
	})] });
}
function StatusBadge({ status }) {
	const map = {
		critical: {
			bg: "bg-destructive/10",
			text: "text-destructive",
			label: "Critique"
		},
		low: {
			bg: "bg-warning/15",
			text: "text-warning-foreground",
			label: "Faible"
		},
		ok: {
			bg: "bg-primary/12",
			text: "text-primary",
			label: "OK"
		},
		rupture: {
			bg: "bg-destructive/15",
			text: "text-destructive",
			label: "Rupture"
		},
		completed: {
			bg: "bg-primary/12",
			text: "text-primary",
			label: "Terminé"
		},
		processing: {
			bg: "bg-accent",
			text: "text-accent-foreground",
			label: "En cours"
		},
		active: {
			bg: "bg-primary/12",
			text: "text-primary",
			label: "Actif"
		},
		warning: {
			bg: "bg-warning/15",
			text: "text-warning-foreground",
			label: "Attention"
		},
		inactive: {
			bg: "bg-muted",
			text: "text-muted-foreground",
			label: "Inactif"
		},
		blocked: {
			bg: "bg-destructive/15",
			text: "text-destructive",
			label: "Bloqué"
		}
	};
	const v = map[status] ?? map.active;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${v.bg} ${v.text}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), v.label]
	});
}
//#endregion
export { StatusBadge as n, AppShell as t };
