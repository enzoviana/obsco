import { i as __toESM } from "../_runtime.mjs";
import { a as authApi, o as getToken, s as setToken, t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-09JE-lnI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var auth_exports = /* @__PURE__ */ __exportAll({
	API_ENABLED: () => API_ENABLED,
	getUser: () => getUser,
	login: () => login,
	loginDemo: () => loginDemo,
	loginWithApi: () => loginWithApi,
	logout: () => logout,
	refreshFromApi: () => refreshFromApi,
	setRole: () => setRole,
	useUser: () => useUser
});
var KEY = "obco_user";
function fromApi(u) {
	return {
		email: u.email,
		name: u.name,
		role: u.role === "super_admin" ? "admin" : "pharmacy",
		pharmacyName: u.role === "super_admin" ? "Réseau ANF" : u.agency?.name || "Mon agence",
		country: u.agency?.country?.code,
		mustChangePassword: u.mustChangePassword
	};
}
function getUser() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function persist(u) {
	localStorage.setItem(KEY, JSON.stringify(u));
	window.dispatchEvent(new Event("obco:user"));
}
async function loginWithApi(email, password) {
	const { token, user } = await authApi.login(email, password);
	setToken(token);
	const u = fromApi(user);
	persist(u);
	return u;
}
function loginDemo(email, role) {
	const user = {
		email,
		name: email.split("@")[0] || "Utilisateur",
		role,
		pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
		country: role === "admin" ? void 0 : "CI"
	};
	persist(user);
	return user;
}
async function login(email, passwordOrRole) {
	if (API_ENABLED && typeof passwordOrRole === "string" && passwordOrRole.length > 0 && passwordOrRole !== "pharmacy" && passwordOrRole !== "admin") return loginWithApi(email, passwordOrRole);
	return loginDemo(email, passwordOrRole === "admin" ? "admin" : "pharmacy");
}
function logout() {
	localStorage.removeItem(KEY);
	setToken(null);
	window.dispatchEvent(new Event("obco:user"));
}
function setRole(role) {
	const u = getUser();
	if (!u) return;
	persist({
		...u,
		role,
		pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
		country: role === "admin" ? void 0 : "CI"
	});
}
async function refreshFromApi() {
	if (!API_ENABLED || !getToken()) return null;
	try {
		const u = fromApi(await authApi.me());
		persist(u);
		return u;
	} catch {
		setToken(null);
		return null;
	}
}
function useUser() {
	const [user, setUser] = (0, import_react.useState)(() => getUser());
	const [refreshAttempted, setRefreshAttempted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const sync = () => setUser(getUser());
		window.addEventListener("obco:user", sync);
		window.addEventListener("storage", sync);
		if (!refreshAttempted && API_ENABLED && getToken()) {
			setRefreshAttempted(true);
			refreshFromApi().then((u) => {
				if (u) setUser(u);
				else if (getUser()) logout();
			}).catch(() => {
				if (getUser()) logout();
			});
		}
		return () => {
			window.removeEventListener("obco:user", sync);
			window.removeEventListener("storage", sync);
		};
	}, [refreshAttempted]);
	return user;
}
//#endregion
export { setRole as a, logout as i, getUser as n, useUser as o, login as r, auth_exports as t };
