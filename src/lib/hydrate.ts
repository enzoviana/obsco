// Hydrate local in-memory stores from the backend API at app boot.
// IMPORTANT: Plus de localStorage - toutes les données sont uniquement en mémoire
import { API_ENABLED, api, getToken } from "./api";
import {
  COUNTRIES,
  type Country,
  setAgencies,
  setLaboratoires,
  setGrossistes,
  setProducts,
  setPricesMap,
  setObjectivesMap,
  type Agency,
  type Laboratoire,
  type Grossiste,
  type ProductPanoramic
} from "./agencies";

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
    console.log("🔄 Chargement des données depuis l'API...");
    const [countries, agencies, wholesalers, labs, products, prices, objectives] = await Promise.all([
      api<Country[]>("/api/countries").catch(() => []),
      api<ApiAgency[]>("/api/agencies").catch(() => []),
      api<ApiWholesaler[]>("/api/wholesalers").catch(() => []),
      api<ApiLab[]>("/api/laboratories").catch(() => []),
      api<ApiProduct[]>("/api/products").catch(() => []),
      api<ApiPrice[]>("/api/prices").catch(() => []),
      api<ApiObjective[]>("/api/objectives").catch(() => []),
    ]);

    // Countries - Charger en mémoire directement (pas de localStorage)
    if (countries.length) {
      COUNTRIES.splice(0, COUNTRIES.length, ...countries);
      dispatch("obco:countries");
      console.log(`✅ ${countries.length} pays chargés en mémoire`);
    }

    // Agencies - Charger en mémoire directement
    const mappedAgencies: Agency[] = agencies.map(a => ({
      id: a.id, name: a.name, country: a.countryCode, email: a.email,
      manager: a.manager, city: a.city, createdAt: a.createdAt.slice(0, 10),
      status: (a.status as "active" | "warning" | "inactive" | "blocked") || "active",
    }));
    setAgencies(mappedAgencies);
    console.log(`✅ ${mappedAgencies.length} agences chargées en mémoire`);

    // Wholesalers (grossistes) - Charger en mémoire directement
    const mappedWholesalers: Grossiste[] = wholesalers.map(w => ({
      id: w.id, partenaire: w.name, type: "Grossiste" as const,
      country: w.countryCode, email: w.email || "",
      status: (w.status as "active" | "warning" | "inactive" | "blocked") || "active",
    }));
    setGrossistes(mappedWholesalers);
    console.log(`✅ ${mappedWholesalers.length} grossistes chargés en mémoire`);

    // Laboratories - Charger en mémoire directement
    const mappedLabs: Laboratoire[] = labs.map(l => ({
      id: l.id, name: l.name, country: l.countryCode, contact: l.contact,
      email: l.email, phone: l.phone, address: l.address,
      createdAt: l.createdAt.slice(0, 10),
      status: (l.status as "active" | "warning" | "inactive" | "blocked") || "active",
    }));
    setLaboratoires(mappedLabs);
    console.log(`✅ ${mappedLabs.length} laboratoires chargés en mémoire`);

    // Prices - Charger en mémoire directement
    const pmap: Record<string, Record<string, number>> = {};
    for (const p of prices) {
      pmap[p.productId] = pmap[p.productId] || {};
      pmap[p.productId][p.countryCode] = p.price;
    }
    setPricesMap(pmap);
    console.log(`✅ ${prices.length} prix chargés en mémoire`);

    // Objectives - Charger en mémoire directement
    const omap: Record<string, Record<string, number>> = {};
    for (const o of objectives) {
      omap[o.productId] = omap[o.productId] || {};
      omap[o.productId][o.countryCode] = (omap[o.productId][o.countryCode] || 0) + o.targetUnits;
    }
    setObjectivesMap(omap);
    console.log(`✅ ${objectives.length} objectifs chargés en mémoire`);

    // Products - Charger en mémoire directement
    const SUPPLIERS = ["CAMED", "LABOREX MALI", "COPHARMED", "UBIPHARM", "DPM"];
    const mappedProducts: ProductPanoramic[] = products.map(p => {
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
    setProducts(mappedProducts);
    console.log(`✅ ${mappedProducts.length} produits chargés en mémoire`);

    console.log("✅ Toutes les données chargées en mémoire (pas de localStorage)");
    _done = true;
  } finally {
    _hydrating = false;
  }
}
