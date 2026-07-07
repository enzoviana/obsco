import { i as __toESM } from "../_runtime.mjs";
import { n as ApiError, r as api } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Check, O as Lock, n as X } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/change-password-CtuGPkw2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChangePasswordPage() {
	const navigate = useNavigate();
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const isFirstLogin = getUser()?.mustChangePassword === true;
	const passwordRequirements = {
		length: newPassword.length >= 8,
		uppercase: /[A-Z]/.test(newPassword),
		lowercase: /[a-z]/.test(newPassword),
		number: /[0-9]/.test(newPassword),
		match: newPassword === confirmPassword && newPassword.length > 0
	};
	const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		if (!isPasswordValid) {
			setError("Le mot de passe ne respecte pas les critères requis");
			setLoading(false);
			return;
		}
		try {
			await api("/api/password/change-password", {
				method: "POST",
				body: JSON.stringify({
					currentPassword: isFirstLogin ? void 0 : currentPassword,
					newPassword
				})
			});
			toast.success("Mot de passe modifié avec succès");
			if (isFirstLogin) {
				localStorage.removeItem("obco_token");
				localStorage.removeItem("obco_user");
				toast.info("Veuillez vous reconnecter avec votre nouveau mot de passe");
				navigate({ to: "/login" });
			} else await api("/api/auth/me").then(() => {
				navigate({ to: "/" });
			});
		} catch (err) {
			if (err instanceof ApiError) setError(err.message);
			else setError("Une erreur est survenue lors du changement de mot de passe");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-8 w-8 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: isFirstLogin ? "Définir votre mot de passe" : "Changer le mot de passe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-2",
						children: isFirstLogin ? "Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer." : "Choisissez un nouveau mot de passe sécurisé pour votre compte."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 bg-card border border-border rounded-2xl p-6",
				children: [
					!isFirstLogin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "current",
							children: "Mot de passe actuel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "current",
							type: "password",
							required: true,
							value: currentPassword,
							onChange: (e) => setCurrentPassword(e.target.value),
							autoComplete: "current-password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "new",
							children: "Nouveau mot de passe"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "new",
							type: "password",
							required: true,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							autoComplete: "new-password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "confirm",
							children: "Confirmer le mot de passe"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "confirm",
							type: "password",
							required: true,
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							autoComplete: "new-password"
						})]
					}),
					newPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 p-3 bg-surface rounded-lg text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-foreground mb-2",
								children: "Exigences du mot de passe :"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementItem, {
								met: passwordRequirements.length,
								text: "Au moins 8 caractères"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementItem, {
								met: passwordRequirements.uppercase,
								text: "Une lettre majuscule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementItem, {
								met: passwordRequirements.lowercase,
								text: "Une lettre minuscule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementItem, {
								met: passwordRequirements.number,
								text: "Un chiffre"
							}),
							confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequirementItem, {
								met: passwordRequirements.match,
								text: "Les mots de passe correspondent"
							})
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading || !isPasswordValid,
						children: loading ? "Changement en cours..." : "Changer le mot de passe"
					}),
					!isFirstLogin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						className: "w-full",
						onClick: () => navigate({ to: "/" }),
						children: "Annuler"
					})
				]
			})]
		})
	});
}
function RequirementItem({ met, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [met ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: met ? "text-primary" : "text-muted-foreground",
			children: text
		})]
	});
}
//#endregion
export { ChangePasswordPage as component };
