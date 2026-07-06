// Hydrate local in-memory stores from the backend API at app boot.
// All pages keep their sync API; once data arrives we mutate the same arrays
// and dispatch the existing 'obco:*' events so every component re-renders.
import { API_ENABLED, api, getToken } from "./api";
import { COUNTRIES, type Country } from "./agencies";

let _hydrating = false;
let _done = false;
export function isHydrated() { return _done; }

type ApiAgency = { id: string; name: string; city: string; email: string; manager: string; status: string; countryCode: string; createdAt: string };
type ApiWholesaler = { id: string; name: string; countryCode: string; email?: string | null; status: string };
type ApiLab = { id: string; name: string; countryCode: string; contact: string; email: string; phone: string; address: string; status: string; createdAt: string };
type ApiProduct = { id: string; cip: string; name: string; category: string; laboratory: string; basePrice: number };
type ApiPrice = { productId: string; countryCode: string; price: number };
type ApiObjective = { productId: string; countryCode: string; year: number; month: number; targetUnits: number; targetCA: number };

function dispatch(name: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(name));
}

export async function hydrateFromApi(): Promise<void> {
  if (!API_ENABLED || _hydrating || _done) return;
  if (typeof window === "undefined") return;
  if (!getToken()) return; // wait for login
  _hydrating = true;

  try {
    const [countries, agencies, wholesalers, labs, products, prices, objectives] = await Promise.all([
      api<Country[]>("/api/countries").catch(() => []),
      api<ApiAgency[]>("/api/agencies").catch(() => []),
      api<ApiWholesaler[]>("/api/wholesalers").catch(() => []),
      api<ApiLab[]>("/api/laboratories").catch(() => []),
      api<ApiProduct[]>("/api/products").catch(() => []),
      api<ApiPrice[]>("/api/prices").catch(() => []),
      api<ApiObjective[]>("/api/objectives").catch(() => []),
    ]);

    // Countries (mutate in place — module-level array imported elsewhere)
    if (countries.length) {
      COUNTRIES.splice(0, COUNTRIES.length, ...countries);
      localStorage.setItem("obco_countries_v1", JSON.stringify(countries));
      dispatch("obco:countries");
    }

    // Agencies → localStorage key used by getAgencies()
    if (agencies.length) {
      const mapped = agencies.map(a => ({
        id: a.id, name: a.name, country: a.countryCode, email: a.email,
        manager: a.manager, city: a.city, createdAt: a.createdAt.slice(0, 10),
        status: (a.status as "active" | "warning" | "inactive" | "blocked") || "active",
      }));
      localStorage.setItem("obco_agencies_v2", JSON.stringify(mapped));
      dispatch("obco:agencies");
    }

    // Wholesalers (grossistes)
    if (wholesalers.length) {
      const mapped = wholesalers.map(w => ({
        id: w.id, partenaire: w.name, type: "Grossiste" as const,
        country: w.countryCode, email: w.email || "",
        status: (w.status as "active" | "warning" | "inactive" | "blocked") || "active",
      }));
      localStorage.setItem("obco_grossistes_v2", JSON.stringify(mapped));
      dispatch("obco:gros");
    }

    // Laboratories
    if (labs.length) {
      const mapped = labs.map(l => ({
        id: l.id, name: l.name, country: l.countryCode, contact: l.contact,
        email: l.email, phone: l.phone, address: l.address,
        createdAt: l.createdAt.slice(0, 10),
        status: (l.status as "active" | "warning" | "inactive" | "blocked") || "active",
      }));
      localStorage.setItem("obco_laboratoires_v2", JSON.stringify(mapped));
      dispatch("obco:labs");
    }

    // Prices → { [productId]: { [country]: price } }
    if (prices.length) {
      const pmap: Record<string, Record<string, number>> = {};
      for (const p of prices) {
        pmap[p.productId] = pmap[p.productId] || {};
        pmap[p.productId][p.countryCode] = p.price;
      }
      localStorage.setItem("obco_prices", JSON.stringify(pmap));
      dispatch("obco:pricing");
    }

    // Objectives → { [productId]: { [country]: targetUnits } } (current year sum-by-country)
    if (objectives.length) {
      const omap: Record<string, Record<string, number>> = {};
      for (const o of objectives) {
        omap[o.productId] = omap[o.productId] || {};
        omap[o.productId][o.countryCode] = (omap[o.productId][o.countryCode] || 0) + o.targetUnits;
      }
      localStorage.setItem("obco_objectives", JSON.stringify(omap));
      dispatch("obco:objectives");
    }

    // Products: persisted as custom products so getPanoramicProducts picks them up.
    // We only override if backend returned data, otherwise keep the demo catalogue.
    if (products.length) {
      const SUPPLIERS = ["CAMED", "LABOREX MALI", "COPHARMED", "UBIPHARM", "DPM"];
      const mapped = products.map(p => {
        const fournisseurs: Record<string, { ventes: number; stocks: number; commandes: number; prixUnitaire: number }> = {};
        for (const s of SUPPLIERS) fournisseurs[s] = { ventes: 0, stocks: 0, commandes: 0, prixUnitaire: 0 };
        return {
          id: p.id, cip: p.cip, name: p.name, laboratory: p.laboratory, type: p.category,
          productStatus: "active" as const,
          ventes: 0, budgetMois: 0, tauxReal: 0,
          ventesAn1: 0, tauxEvol: 0, ca: 0, budgetMoisCa: 0, txRealBudgetCa: 0,
          cumulBudget: 0, cumulRealise: 0, txRealPrev: 0, poids: 0, fournisseurs,
        };
      });
      localStorage.setItem("obco_custom_products", JSON.stringify(mapped));
      dispatch("obco:products");
    }

    _done = true;
  } finally {
    _hydrating = false;
  }
}
