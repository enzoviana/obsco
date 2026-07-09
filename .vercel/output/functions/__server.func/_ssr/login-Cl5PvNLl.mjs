import { i as __toESM } from "../_runtime.mjs";
import { t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as login } from "./auth-09JE-lnI.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { t as Input } from "./input-BhC_o9_3.mjs";
import { t as Logo_default } from "./Logo-BoQk6txv.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as ArrowRight, W as Building2, m as ShieldCheck, t as Zap } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-CwFAtJff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Cl5PvNLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)(API_ENABLED ? "admin@datafuse.app" : "agence@obco.io");
	const [password, setPassword] = (0, import_react.useState)(API_ENABLED ? "ChangeMe123!" : "demo");
	const [role, setRoleState] = (0, import_react.useState)("pharmacy");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			let user;
			if (API_ENABLED) user = await login(email, password);
			else user = await login(email, role);
			if (user.mustChangePassword) navigate({ to: "/change-password" });
			else navigate({ to: "/" });
		} catch (err) {
			setError(err?.message || "Échec de connexion");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-20",
					style: {
						backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
						backgroundSize: "48px 48px, 64px 64px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex items-center gap-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: Logo_default,
						alt: "OBCO",
						className: "h-12 w-auto brightness-0 invert"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-5xl leading-[1.05]",
							children: [
								"Le centre de Pilotage",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"de votre Activité."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-md text-sm opacity-85",
							children: "La technologie au service de votre distribution pharmaceutique, pour centraliser vos données et améliorer votre visibilité sur le terrain."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 max-w-md",
							children: [
								{
									icon: Zap,
									t: "Synchronisation temps réel",
									d: "Importez, vendez, ajustez instantanément."
								},
								{
									icon: ShieldCheck,
									t: "Données centralisées",
									d: "Importez et consultez vos données en quelques clics."
								},
								{
									icon: Building2,
									t: "Suivi en temps réel",
									d: "Pilotez vos ventes, commandes et stocks en toute simplicité."
								},
								{
									icon: Building2,
									t: "Vision réseau",
									d: "Analysez l'activité par grossiste, secteur ou produit."
								}
							].map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-2xl bg-primary-foreground/10 p-3 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-foreground/15",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: f.t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs opacity-80",
									children: f.d
								})] })]
							}, i))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative text-xs opacity-70",
					children: "© 2026 OBCO PHARMA · Tous droits réservés"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-6 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden flex items-center gap-2 mb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: Logo_default,
							alt: "OBCO",
							className: "h-10 w-auto"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wider text-primary",
						children: "Bienvenue Sur Obco Performances"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-4xl",
						children: "Connectez-vous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Accédez à votre tableau de bord."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pw",
										children: "Mot de passe"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs text-primary hover:underline",
										onClick: () => navigate({ to: "/forgot-password" }),
										children: "Oublié ?"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pw",
									type: "password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							!API_ENABLED && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type de compte (démo)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [{
											v: "pharmacy",
											l: "Agence"
										}, {
											v: "admin",
											l: "Super-Admin"
										}].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRoleState(o.v),
											className: `rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${role === o.v ? "border-primary bg-accent text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`,
											children: o.l
										}, o.v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											"Mode démo. Pour activer le backend Node.js, définissez ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_API_URL" }),
											"."
										]
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: loading ? "Connexion…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Se connecter ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-center text-xs text-muted-foreground",
						children: ["Pas encore de compte ? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "text-primary hover:underline",
							children: "Demander une démo"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
