// API client for the OBCO Node.js backend.
// Set VITE_API_URL in your .env to point at your deployed backend
// (e.g. https://obco-api.onrender.com).

const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "";
export const API_BASE = RAW_BASE;
export const API_ENABLED = Boolean(RAW_BASE);

const TOKEN_KEY = "obco_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  if (!API_ENABLED) throw new ApiError(0, "VITE_API_URL non configuré");
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token && init.auth !== false) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data)
      ? String((data as any).error) : `HTTP ${res.status}`;

    // Si on reçoit une erreur 401, le token n'est plus valide
    // On déconnecte l'utilisateur pour éviter les erreurs répétées
    if (res.status === 401 && typeof window !== "undefined") {
      // Supprimer le token et l'utilisateur
      setToken(null);
      localStorage.removeItem("obco_user");
      // Déclencher l'événement pour que les composants se mettent à jour
      window.dispatchEvent(new Event("obco:user"));
      // Si on n'est pas déjà sur la page de login, rediriger
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}

// ----- HTTP method helpers -----
export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  return api<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut<T = unknown>(path: string, body: unknown): Promise<T> {
  return api<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiPatch<T = unknown>(path: string, body: unknown): Promise<T> {
  return api<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete<T = unknown>(path: string): Promise<T> {
  return api<T>(path, { method: "DELETE" });
}

// ----- Typed helpers -----
export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "agence";
  agencyId: string | null;
  agency?: { id: string; name: string; city: string; country: { code: string; name: string } } | null;
  mustChangePassword?: boolean;
};

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: ApiUser }>("/api/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }), auth: false,
    }),
  me: () => api<ApiUser>("/api/auth/me"),
};

export const dataApi = {
  countries: () => api<Array<{ code: string; name: string; currency: string; region: string }>>("/api/countries"),
  agencies: () => api<Array<any>>("/api/agencies"),
  products: () => api<Array<any>>("/api/products"),
  prices: (params: { productId?: string; countryCode?: string } = {}) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Array<any>>(`/api/prices${q ? `?${q}` : ""}`);
  },
  setPrice: (productId: string, countryCode: string, price: number) =>
    api(`/api/prices`, { method: "PUT", body: JSON.stringify({ productId, countryCode, price }) }),
  objectives: (params: Record<string, string | number> = {}) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Array<any>>(`/api/objectives${q ? `?${q}` : ""}`);
  },
  wholesalers: () => api<Array<any>>("/api/wholesalers"),
  stocks: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return api<Array<any>>(`/api/stocks${q ? `?${q}` : ""}`);
  },
  sales: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return api<Array<any>>(`/api/sales${q ? `?${q}` : ""}`);
  },
  createSale: (body: { productId: string; quantity: number; unitPrice: number; agencyId?: string; wholesalerId?: string | null }) =>
    api(`/api/sales`, { method: "POST", body: JSON.stringify(body) }),
};
