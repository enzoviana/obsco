//#region node_modules/.nitro/vite/services/ssr/assets/api-DFrqE02A.js
var RAW_BASE = "https://evening-sierra-79086-961c10c199fc.herokuapp.com".replace(/\/+$/, "") || "";
var API_BASE = RAW_BASE;
var API_ENABLED = Boolean(RAW_BASE);
var TOKEN_KEY = "obco_token";
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}
function setToken(t) {
	if (typeof window === "undefined") return;
	if (t) localStorage.setItem(TOKEN_KEY, t);
	else localStorage.removeItem(TOKEN_KEY);
}
var ApiError = class extends Error {
	status;
	body;
	constructor(status, message, body) {
		super(message);
		this.status = status;
		this.body = body;
	}
};
async function api(path, init = {}) {
	if (!API_ENABLED) throw new ApiError(0, "VITE_API_URL non configuré");
	const headers = new Headers(init.headers);
	if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	const token = getToken();
	if (token && init.auth !== false) headers.set("Authorization", `Bearer ${token}`);
	const res = await fetch(`${API_BASE}${path}`, {
		...init,
		headers
	});
	const text = await res.text();
	const data = text ? (() => {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	})() : null;
	if (!res.ok) {
		const msg = data && typeof data === "object" && "error" in data ? String(data.error) : `HTTP ${res.status}`;
		if (res.status === 401 && typeof window !== "undefined") {
			setToken(null);
			localStorage.removeItem("obco_user");
			window.dispatchEvent(new Event("obco:user"));
			if (!window.location.pathname.includes("/login")) window.location.href = "/login";
		}
		throw new ApiError(res.status, msg, data);
	}
	return data;
}
async function apiPost(path, body) {
	return api(path, {
		method: "POST",
		body: JSON.stringify(body)
	});
}
var authApi = {
	login: (email, password) => api("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		}),
		auth: false
	}),
	me: () => api("/api/auth/me")
};
//#endregion
export { authApi as a, apiPost as i, ApiError as n, getToken as o, api as r, setToken as s, API_ENABLED as t };
