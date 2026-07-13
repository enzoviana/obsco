// Auth: utilise le backend Node.js si VITE_API_URL est défini, sinon mode démo (mock).
import { useEffect, useState } from "react";
import { authApi, API_ENABLED, setToken, getToken, type ApiUser } from "./api";

export type Role = "pharmacy" | "admin"; // mapping interne: pharmacy=agence, admin=super_admin

export type User = {
  email: string;
  name: string;
  role: Role;
  pharmacyName: string;
  country?: string;
  agencyId?: string | null;
  mustChangePassword?: boolean;
};

const KEY = "obco_user";

function fromApi(u: ApiUser): User {
  return {
    email: u.email,
    name: u.name,
    role: u.role === "super_admin" ? "admin" : "pharmacy",
    pharmacyName: u.role === "super_admin" ? "Réseau ANF" : (u.agency?.name || "Mon agence"),
    country: u.agency?.country?.code,
    agencyId: u.agencyId,
    mustChangePassword: u.mustChangePassword,
  };
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function persist(u: User) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("obco:user"));
}

// Connexion réelle (backend). Renvoie l'utilisateur ou jette une erreur.
export async function loginWithApi(email: string, password: string): Promise<User> {
  const { token, user } = await authApi.login(email, password);
  setToken(token);
  const u = fromApi(user);
  persist(u);
  return u;
}

// Connexion démo (sans backend) — gardée pour les previews Lovable.
export function loginDemo(email: string, role: Role): User {
  const user: User = {
    email,
    name: email.split("@")[0] || "Utilisateur",
    role,
    pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
    country: role === "admin" ? undefined : "CI",
  };
  persist(user);
  return user;
}

// Wrapper: route automatiquement vers l'API si activée.
export async function login(email: string, passwordOrRole: string | Role): Promise<User> {
  if (API_ENABLED && typeof passwordOrRole === "string" && passwordOrRole.length > 0 && passwordOrRole !== "pharmacy" && passwordOrRole !== "admin") {
    return loginWithApi(email, passwordOrRole);
  }
  // fallback démo
  const role: Role = (passwordOrRole === "admin" ? "admin" : "pharmacy");
  return loginDemo(email, role);
}

export function logout() {
  localStorage.removeItem(KEY);
  setToken(null);
  window.dispatchEvent(new Event("obco:user"));
}

export function setRole(role: Role) {
  const u = getUser();
  if (!u) return;
  const next = {
    ...u, role,
    pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
    country: role === "admin" ? undefined : "CI",
  };
  persist(next);
}

// Au montage, si on a un token mais pas d'user (ou pour rafraîchir), on tente /me.
export async function refreshFromApi(): Promise<User | null> {
  if (!API_ENABLED || !getToken()) return null;
  try {
    const me = await authApi.me();
    const u = fromApi(me);
    persist(u);
    return u;
  } catch {
    setToken(null);
    return null;
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("obco:user", sync);
    window.addEventListener("storage", sync);

    // Au premier montage, essayer de rafraîchir l'utilisateur depuis l'API si on a un token
    if (!refreshAttempted && API_ENABLED && getToken()) {
      setRefreshAttempted(true);
      refreshFromApi().then(u => {
        if (u) {
          setUser(u);
        } else {
          // Si le token n'est plus valide, vider l'utilisateur local
          const currentUser = getUser();
          if (currentUser) {
            logout();
          }
        }
      }).catch(() => {
        // En cas d'erreur (token invalide, etc.), déconnecter l'utilisateur
        const currentUser = getUser();
        if (currentUser) {
          logout();
        }
      });
    }

    return () => {
      window.removeEventListener("obco:user", sync);
      window.removeEventListener("storage", sync);
    };
  }, [refreshAttempted]);

  return user;
}

export { API_ENABLED };
