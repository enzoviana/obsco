import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser, o as useUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useComposedRefs, n as cn, t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { t as Primitive } from "./dist-pWhnPymf.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Globe, K as Bell, O as Lock, S as Palette, U as Building, a as User, i as Users, l as Trash2, m as ShieldCheck, v as Plus } from "../_libs/lucide-react.mjs";
import { T as useSize, h as createContextScope, n as AppShell, p as composeEventHandlers, y as useControllableState } from "./AppShell-vbo9zXyM.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
import { t as usePrevious } from "./dist-Dkb4XsSo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parametres-CKFqTA28.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SWITCH_NAME = "Switch";
var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
var [SwitchProviderImpl, useSwitchContext] = createSwitchContext(SWITCH_NAME);
function SwitchProvider(props) {
	const { __scopeSwitch, checked: checkedProp, children, defaultChecked, disabled, form, name, onCheckedChange, required, value = "on", internal_do_not_use_render } = props;
	const [checked, setChecked] = useControllableState({
		prop: checkedProp,
		defaultProp: defaultChecked ?? false,
		onChange: onCheckedChange,
		caller: SWITCH_NAME
	});
	const [control, setControl] = import_react.useState(null);
	const [bubbleInput, setBubbleInput] = import_react.useState(null);
	const context = {
		checked,
		setChecked,
		disabled,
		control,
		setControl,
		name,
		form,
		value,
		hasConsumerStoppedPropagationRef: import_react.useRef(false),
		required,
		defaultChecked,
		isFormControl: control ? !!form || !!control.closest("form") : true,
		bubbleInput,
		setBubbleInput
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchProviderImpl, {
		scope: __scopeSwitch,
		...context,
		children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
	});
}
var TRIGGER_NAME = "SwitchTrigger";
var SwitchTrigger = import_react.forwardRef(({ __scopeSwitch, onClick, ...switchProps }, forwardedRef) => {
	const { value, disabled, checked, required, setControl, setChecked, hasConsumerStoppedPropagationRef, isFormControl, bubbleInput } = useSwitchContext(TRIGGER_NAME, __scopeSwitch);
	const composedRefs = useComposedRefs(forwardedRef, setControl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"aria-required": required,
		"data-state": getState(checked),
		"data-disabled": disabled ? "" : void 0,
		disabled,
		value,
		...switchProps,
		ref: composedRefs,
		onClick: composeEventHandlers(onClick, (event) => {
			setChecked((prevChecked) => !prevChecked);
			if (bubbleInput && isFormControl) {
				hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
				if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
			}
		})
	});
});
SwitchTrigger.displayName = TRIGGER_NAME;
var Switch$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, name, checked, defaultChecked, required, disabled, value, onCheckedChange, form, ...switchProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchProvider, {
		__scopeSwitch,
		checked,
		defaultChecked,
		disabled,
		required,
		onCheckedChange,
		name,
		form,
		value,
		internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchTrigger, {
			...switchProps,
			ref: forwardedRef,
			__scopeSwitch
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchBubbleInput, { __scopeSwitch })] })
	});
});
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSwitch, ...thumbProps } = props;
	const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"data-state": getState(context.checked),
		"data-disabled": context.disabled ? "" : void 0,
		...thumbProps,
		ref: forwardedRef
	});
});
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = import_react.forwardRef(({ __scopeSwitch, ...props }, forwardedRef) => {
	const { control, hasConsumerStoppedPropagationRef, checked, defaultChecked, required, disabled, name, value, form, bubbleInput, setBubbleInput } = useSwitchContext(BUBBLE_INPUT_NAME, __scopeSwitch);
	const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
	const prevChecked = usePrevious(checked);
	const controlSize = useSize(control);
	import_react.useEffect(() => {
		const input = bubbleInput;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		const bubbles = !hasConsumerStoppedPropagationRef.current;
		if (prevChecked !== checked && setChecked) {
			const event = new Event("click", { bubbles });
			setChecked.call(input, checked);
			input.dispatchEvent(event);
		}
	}, [
		bubbleInput,
		prevChecked,
		checked,
		hasConsumerStoppedPropagationRef
	]);
	const defaultCheckedRef = import_react.useRef(checked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.input, {
		type: "checkbox",
		"aria-hidden": true,
		defaultChecked: defaultChecked ?? defaultCheckedRef.current,
		required,
		disabled,
		name,
		value,
		form,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0,
			transform: "translateX(-100%)"
		}
	});
});
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
	return typeof value === "function";
}
function getState(checked) {
	return checked ? "checked" : "unchecked";
}
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = import_react.forwardRef((props, forwardedRef) => {
	const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
	const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
	const semanticProps = decorative ? { role: "none" } : {
		"aria-orientation": orientation === "vertical" ? orientation : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-orientation": orientation,
		...semanticProps,
		...domProps,
		ref: forwardedRef
	});
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
	return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var TABS = [
	{
		id: "profile",
		label: "Profil",
		icon: User
	},
	{
		id: "utilisateurs",
		label: "Utilisateurs (Agences)",
		icon: Users
	},
	{
		id: "admin",
		label: "Comptes Admin",
		icon: ShieldCheck
	},
	{
		id: "pharmacy",
		label: "Officine",
		icon: Building
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		id: "security",
		label: "Sécurité",
		icon: Lock
	},
	{
		id: "appearance",
		label: "Apparence",
		icon: Palette
	},
	{
		id: "locale",
		label: "Langue & Région",
		icon: Globe
	}
];
function SettingsPage() {
	const navigate = useNavigate();
	const user = useUser();
	const [tab, setTab] = (0, import_react.useState)("profile");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const sync = () => {
			const h = window.location.hash.replace("#", "");
			if (h && TABS.some((t) => t.id === h)) setTab(h);
		};
		sync();
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Paramètres",
		subtitle: "Préférences du compte",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[240px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "space-y-1",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setTab(t.id);
						if (typeof window !== "undefined") history.replaceState(null, "", `#${t.id}`);
					},
					className: `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${tab === t.id ? "bg-card border border-border shadow-sm font-medium" : "text-muted-foreground hover:text-foreground hover:bg-card/60"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-4 w-4" }),
						" ",
						t.label
					]
				}, t.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [
					tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSection, {
						email: user?.email ?? "",
						name: user?.name ?? ""
					}),
					tab === "utilisateurs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersSection, {}),
					tab === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAccountsSection, {}),
					tab === "pharmacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PharmacySection, {}),
					tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSection, {}),
					tab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecuritySection, {}),
					tab === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppearanceSection, {}),
					tab === "locale" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSection, {})
				]
			})]
		})
	});
}
function Section({ title, desc, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: desc
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-6" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-5",
			children
		})
	] });
}
function Field({ label, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [children, hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: hint
		})] })]
	});
}
function SaveBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-end gap-2 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			children: "Annuler"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => toast.success("Modifications enregistrées"),
			children: "Enregistrer"
		})]
	});
}
function ProfileSection({ email, name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Profil",
		desc: "Vos informations personnelles affichées sur OBCO.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nom complet",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: name })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Email",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					defaultValue: email
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Téléphone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "tel",
					placeholder: "06 12 34 56 78"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Fonction",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Responsable agence" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {})
		]
	});
}
function PharmacySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Agence",
		desc: "Informations légales et de contact de votre agence.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Raison sociale",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "ANF Abidjan SARL" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "N° FINESS",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "750012345" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Adresse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "14 rue de la République, 75011 Paris" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "N° de TVA",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "FR12345678901" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {})
		]
	});
}
function NotificationsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Notifications",
		desc: "Choisissez ce que vous souhaitez recevoir.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Alertes de stock faible",
				desc: "Recevoir un email lorsqu'un produit passe sous son seuil.",
				defaultChecked: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Ruptures de stock",
				desc: "Notification immédiate en cas de rupture.",
				defaultChecked: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Imports terminés",
				desc: "Confirmation à la fin de chaque import."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Rapport hebdomadaire",
				desc: "Résumé chaque lundi matin.",
				defaultChecked: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Nouveautés OBCO",
				desc: "Annonces produit et conseils."
			})
		]
	});
}
function ToggleRow({ title, desc, defaultChecked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: desc
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { defaultChecked })]
	});
}
function SecuritySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Sécurité",
		desc: "Mot de passe et authentification.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Mot de passe actuel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { type: "password" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nouveau mot de passe",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { type: "password" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Confirmer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { type: "password" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Authentification à deux facteurs",
				desc: "Sécurisez votre compte avec un code à usage unique.",
				defaultChecked: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {})
		]
	});
}
function AppearanceSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Apparence",
		desc: "Personnalisez l'interface.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Thème",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"Clair",
						"Sombre",
						"Système"
					].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `rounded-xl border px-4 py-2 text-sm ${i === 0 ? "border-primary bg-accent" : "border-border bg-surface text-muted-foreground"}`,
						children: t
					}, t))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Densité compacte",
				desc: "Affichez plus d'informations à l'écran."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "Animations réduites",
				desc: "Limite les transitions et animations."
			})
		]
	});
}
function LocaleSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Langue & Région",
		desc: "Format des dates, devises et langue de l'interface.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Langue",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Français (France)" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Devise",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "EUR (€)" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Fuseau horaire",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Europe/Paris (UTC+1)" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Format de date",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "JJ/MM/AAAA" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBar, {})
		]
	});
}
function UsersSection() {
	const [accounts, setAccounts] = (0, import_react.useState)([
		{
			id: "U-001",
			agence: "ANF Abidjan",
			email: "abidjan@anf.com",
			login: "anf.abidjan",
			role: "Agence",
			status: "active"
		},
		{
			id: "U-002",
			agence: "ANF Dakar",
			email: "dakar@anf.com",
			login: "anf.dakar",
			role: "Agence",
			status: "active"
		},
		{
			id: "U-003",
			agence: "ANF Bamako",
			email: "bamako@anf.com",
			login: "anf.bamako",
			role: "Agence",
			status: "active"
		},
		{
			id: "U-004",
			agence: "ANF Douala",
			email: "douala@anf.com",
			login: "anf.douala",
			role: "Agence",
			status: "inactive"
		}
	]);
	const [form, setForm] = (0, import_react.useState)({
		agence: "",
		email: "",
		login: "",
		password: ""
	});
	const create = () => {
		if (!form.agence || !form.email || !form.login) return toast.error("Champs requis manquants");
		setAccounts((a) => [...a, {
			id: `U-${String(a.length + 1).padStart(3, "0")}`,
			agence: form.agence,
			email: form.email,
			login: form.login,
			role: "Agence",
			status: "active"
		}]);
		setForm({
			agence: "",
			email: "",
			login: "",
			password: ""
		});
		toast.success("Compte agence créé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Utilisateurs (Agences)",
		desc: "Gérez les identifiants et créez de nouveaux comptes agences.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Agence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.agence,
					onChange: (e) => setForm({
						...form,
						agence: e.target.value
					}),
					placeholder: "ANF Lomé"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: form.email,
					onChange: (e) => setForm({
						...form,
						email: e.target.value
					}),
					placeholder: "lome@anf.com"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Identifiant"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.login,
					onChange: (e) => setForm({
						...form,
						login: e.target.value
					}),
					placeholder: "anf.lome"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Mot de passe initial"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: form.password,
					onChange: (e) => setForm({
						...form,
						password: e.target.value
					}),
					placeholder: "••••••••"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: create,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Créer un compte agence"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-[11px] uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Agence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Identifiant"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Statut"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-medium",
							children: a.agence
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-mono text-xs",
							children: a.login
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-muted-foreground",
							children: a.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-medium ${a.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
								children: a.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-7 w-7",
								onClick: () => {
									setAccounts((list) => list.filter((x) => x.id !== a.id));
									toast.success("Compte supprimé");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						})
					]
				}, a.id)) })]
			})
		})]
	});
}
function AdminAccountsSection() {
	const [admins, setAdmins] = (0, import_react.useState)([{
		id: "A-001",
		name: "Admin Principal",
		email: "admin@anf.com",
		role: "Super-Admin"
	}, {
		id: "A-002",
		name: "Pierre Lemoine",
		email: "p.lemoine@anf.com",
		role: "Admin"
	}]);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		password: ""
	});
	const create = () => {
		if (!form.name || !form.email) return toast.error("Champs requis manquants");
		setAdmins((a) => [...a, {
			id: `A-${String(a.length + 1).padStart(3, "0")}`,
			name: form.name,
			email: form.email,
			role: "Admin"
		}]);
		setForm({
			name: "",
			email: "",
			password: ""
		});
		toast.success("Compte admin créé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Comptes Admin",
		desc: "Gérez les administrateurs existants ou créez-en de nouveaux.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Nom complet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.name,
					onChange: (e) => setForm({
						...form,
						name: e.target.value
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: form.email,
					onChange: (e) => setForm({
						...form,
						email: e.target.value
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Mot de passe initial"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: form.password,
						onChange: (e) => setForm({
							...form,
							password: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: create,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Créer un compte admin"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-[11px] uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Nom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-left",
							children: "Rôle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: admins.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-medium",
							children: a.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-muted-foreground",
							children: a.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary",
								children: a.role
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-7 w-7",
								disabled: a.role === "Super-Admin",
								onClick: () => {
									setAdmins((list) => list.filter((x) => x.id !== a.id));
									toast.success("Admin supprimé");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						})
					]
				}, a.id)) })]
			})
		})]
	});
}
//#endregion
export { SettingsPage as component };
