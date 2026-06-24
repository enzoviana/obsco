// Mock auth — localStorage based
export type Role = "pharmacy" | "admin"; // "pharmacy" = agence

export type User = {
  email: string;
  name: string;
  role: Role;
  pharmacyName: string; // displayed as agence
  country?: string;     // ISO code for agence
};

const KEY = "datafuse_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function login(email: string, role: Role): User {
  const user: User = {
    email,
    name: email.split("@")[0] || "Utilisateur",
    role,
    pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
    country: role === "admin" ? undefined : "CI",
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function setRole(role: Role) {
  const u = getUser();
  if (!u) return;
  const next = {
    ...u, role,
    pharmacyName: role === "admin" ? "Réseau ANF" : "ANF Abidjan",
    country: role === "admin" ? undefined : "CI",
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("datafuse:user"));
}

import { useEffect, useState } from "react";
export function useUser() {
  const [user, setUser] = useState<User | null>(() => getUser());
  useEffect(() => {
    const sync = () => setUser(getUser());
    window.addEventListener("datafuse:user", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("datafuse:user", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}
