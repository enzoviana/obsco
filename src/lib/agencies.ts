// Mock dataset for agencies, countries, suppliers, products reports.
// When VITE_API_URL is set, hydrate.ts overwrites these stores with backend data
// and mutations are also forwarded to the API via src/lib/sync.ts.
import { syncCreate, syncUpdate, syncDelete, syncPut } from "./sync";
import { API_ENABLED } from "./api";

export type Country = { code: string; name: string; currency: string; region: string; isANF?: boolean };
export type EntityStatus = "active" | "warning" | "inactive" | "blocked";

export type Agency = {
  id: string;
  name: string;
  country: string;
  email: string;
  manager: string;
  city: string;
  createdAt: string;
  status: EntityStatus;
};

export const COUNTRIES: Country[] = [

];

// Plus de cache localStorage - uniquement données en mémoire depuis l'API
function persistCountries() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("obco:countries"));
}
export function ensureCountriesLoaded() {
  // Les pays sont chargés uniquement via hydrateFromApi()
}
export function reloadCountries() {
  // Les pays sont rechargés uniquement via hydrateFromApi()
}
export function addCountry(c: Country) {
  ensureCountriesLoaded();
  if (COUNTRIES.some(x => x.code === c.code)) throw new Error("Code ISO déjà utilisé");
  COUNTRIES.push(c); persistCountries();
  syncCreate("/api/countries", c);
}
export function updateCountry(code: string, patch: Partial<Country>) {
  ensureCountriesLoaded();
  const i = COUNTRIES.findIndex(c => c.code === code);
  if (i >= 0) { COUNTRIES[i] = { ...COUNTRIES[i], ...patch, code }; persistCountries(); }
  syncUpdate(`/api/countries/${code}`, patch);
}
export function deleteCountry(code: string) {
  ensureCountriesLoaded();
  const i = COUNTRIES.findIndex(c => c.code === code);
  if (i >= 0) { COUNTRIES.splice(i, 1); persistCountries(); }
  syncDelete(`/api/countries/${code}`);
}

export const SUPPLIERS = ["CAMED", "LABOREX MALI", "COPHARMED", "UBIPHARM", "DPM"];

export const PRODUCT_TYPES = [
  "Médicament", "Parapharmacie", "Dispositif médical", "Complément alimentaire", "Hygiène", "Cosmétique", "Consommable"
];

// ---------------- Laboratoires ----------------
export type Laboratoire = {
  id: string;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  status: EntityStatus;
};

// Données en mémoire uniquement - pas de cache localStorage
let _labs: Laboratoire[] = [];

function persistLabs() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:labs"));
}

export function setLaboratoires(labs: Laboratoire[]) {
  _labs = labs;
  persistLabs();
}

export function getLaboratoires(): Laboratoire[] {
  return _labs;
}

export async function addLaboratoire(l: Omit<Laboratoire, "id" | "createdAt" | "status">): Promise<Laboratoire> {
  // Attendre la réponse de l'API avant de mettre à jour le cache
  const response = await syncCreate("/api/laboratories", {
    name: l.name,
    countryCode: l.country,
    contact: l.contact,
    email: l.email,
    phone: l.phone,
    address: l.address
  }) as any;

  const next: Laboratoire = {
    ...l,
    id: response?.id || `LAB-${Date.now().toString(36).toUpperCase()}`,
    createdAt: response?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    status: (response?.status as EntityStatus) || "active"
  };

  // Mettre à jour le cache uniquement après succès
  _labs = [next, ...getLaboratoires()];
  persistLabs();

  return next;
}

export function updateLaboratoire(id: string, patch: Partial<Laboratoire>) {
  _labs = getLaboratoires().map(l => l.id === id ? { ...l, ...patch } : l);
  persistLabs();
  const apiPatch: Record<string, unknown> = { ...patch };
  if (patch.country) { apiPatch.countryCode = patch.country; delete apiPatch.country; }
  syncUpdate(`/api/laboratories/${id}`, apiPatch);
}

export function setLaboratoireStatus(id: string, status: EntityStatus) { updateLaboratoire(id, { status }); }
export function deleteLaboratoire(id: string) {
  _labs = getLaboratoires().filter(l => l.id !== id); persistLabs();
  syncDelete(`/api/laboratories/${id}`);
}

// ---------------- Grossistes / Fournisseurs ----------------
export type Grossiste = {
  id: string;
  partenaire: string;
  type: "Grossiste";
  country: string;
  email: string;
  status: EntityStatus;
};

// Données en mémoire uniquement - pas de cache localStorage
let _gros: Grossiste[] = [];

function persistGros() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:gros"));
}

export function setGrossistes(gros: Grossiste[]) {
  _gros = gros;
  persistGros();
}

export function getGrossistes(): Grossiste[] {
  return _gros;
}

export async function addGrossiste(g: Omit<Grossiste, "id">): Promise<Grossiste> {
  // Attendre la réponse de l'API avant de mettre à jour le cache
  const response = await syncCreate("/api/wholesalers", {
    name: g.partenaire,
    countryCode: g.country,
    email: g.email
  }) as any;

  const next: Grossiste = {
    ...g,
    id: response?.id || `GR-${Date.now().toString(36).toUpperCase()}`
  };

  // Mettre à jour le cache uniquement après succès
  _gros = [next, ...getGrossistes()];
  persistGros();

  return next;
}

export function updateGrossiste(id: string, patch: Partial<Grossiste>) {
  _gros = getGrossistes().map(g => g.id === id ? { ...g, ...patch } : g);
  persistGros();
  const apiPatch: Record<string, unknown> = { ...patch };
  if (patch.partenaire) { apiPatch.name = patch.partenaire; delete apiPatch.partenaire; }
  if (patch.country) { apiPatch.countryCode = patch.country; delete apiPatch.country; }
  delete apiPatch.type; // Le champ type n'existe pas dans le schéma backend
  syncUpdate(`/api/wholesalers/${id}`, apiPatch);
}

export function setGrossisteStatus(id: string, status: EntityStatus) { updateGrossiste(id, { status }); }
export function deleteGrossiste(id: string) {
  _gros = getGrossistes().filter(g => g.id !== id); persistGros();
  syncDelete(`/api/wholesalers/${id}`);
}

// ---------------- Pricing & objectives ----------------
// Prix et objectifs en mémoire uniquement - pas de localStorage
let _pricesMap: Record<string, Record<string, number>> = {};
let _objectivesMap: Record<string, Record<string, number>> = {};

export function setPricesMap(prices: Record<string, Record<string, number>>) {
  _pricesMap = prices;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:pricing"));
}

export function setObjectivesMap(objectives: Record<string, Record<string, number>>) {
  _objectivesMap = objectives;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:objectives"));
}

export function getProductPricing(productId: string, basePrice: number) {
  const m = _pricesMap;
  const existing = m[productId] || {};
  const out: Record<string, number> = {};
  for (const c of COUNTRIES) {
    out[c.code] = existing[c.code] ?? +(basePrice * (0.9 + (c.code.charCodeAt(0) % 5) * 0.05)).toFixed(2);
  }
  return out;
}
export function setProductPricing(productId: string, prices: Record<string, number>) {
  _pricesMap[productId] = prices;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:pricing"));
  for (const [countryCode, price] of Object.entries(prices)) {
    syncPut("/api/prices", { productId, countryCode, price });
  }
}

export function getProductObjectives(productId: string, baseQty: number) {
  const m = _objectivesMap;
  const existing = m[productId] || {};
  const out: Record<string, number> = {};
  for (const c of COUNTRIES) {
    out[c.code] = existing[c.code] ?? Math.round(baseQty * (0.6 + (c.code.charCodeAt(1) % 7) * 0.1));
  }
  return out;
}
export function setProductObjectives(productId: string, qty: Record<string, number>) {
  _objectivesMap[productId] = qty;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:objectives"));
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  for (const [countryCode, targetUnits] of Object.entries(qty)) {
    syncPut("/api/objectives", { productId, countryCode, year, month, targetUnits, targetCA: 0 });
  }
}

// ---------------- Agencies ----------------
// Données en mémoire uniquement - pas de cache localStorage
let _agencies: Agency[] = [];

function persistAgencies() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:agencies"));
}

export function setAgencies(agencies: Agency[]) {
  _agencies = agencies;
  persistAgencies();
}

export function getAgencies(): Agency[] {
  return _agencies;
}

export async function addAgency(a: Omit<Agency, "id" | "createdAt" | "status">): Promise<Agency & { temporaryPassword?: string }> {
  // Ne plus faire de mise à jour optimiste - attendre la réponse de l'API
  const response = await syncCreate("/api/agencies", {
    name: a.name,
    city: a.city,
    email: a.email,
    manager: a.manager,
    countryCode: a.country,
  }) as any;

  // Créer l'agence avec les données retournées par l'API
  const newAgency: Agency = {
    ...a,
    id: response?.id || `AG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: response?.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    status: (response?.status as EntityStatus) || "active",
  };

  // Mettre à jour le cache uniquement après succès
  _agencies = [newAgency, ...getAgencies()];
  persistAgencies();

  return {
    ...newAgency,
    temporaryPassword: response?.temporaryPassword,
  };
}

export function updateAgency(id: string, patch: Partial<Agency>) {
  _agencies = getAgencies().map(a => a.id === id ? { ...a, ...patch } : a);
  persistAgencies();
  const apiPatch: Record<string, unknown> = { ...patch };
  if (patch.country) { apiPatch.countryCode = patch.country; delete apiPatch.country; }
  syncUpdate(`/api/agencies/${id}`, apiPatch);
}

export function setAgencyStatus(id: string, status: EntityStatus) { updateAgency(id, { status }); }
export function deleteAgency(id: string) {
  _agencies = getAgencies().filter(a => a.id !== id); persistAgencies();
  syncDelete(`/api/agencies/${id}`);
}

// ---------- Reports data ----------
function rand(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

export const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

export function salesObjectivesByCountry() {
  // En mode Live, retourner des données vides (les agences n'ont pas encore importé de données)
  if (API_ENABLED) {
    return COUNTRIES.map(c => ({
      pays: c.name,
      code: c.code,
      objectif: 0,
      realise: 0,
      taux: 0,
      ecart: 0,
    }));
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(11);
  return COUNTRIES.map(c => {
    const objectif = Math.round((50 + r() * 150) * 1000);
    const realise = Math.round(objectif * (0.6 + r() * 0.5));
    return { pays: c.name, code: c.code, objectif, realise, taux: +((realise / objectif) * 100).toFixed(1), ecart: realise - objectif };
  });
}

export function salesObjectivesANF() {
  // En mode Live, retourner des données vides
  if (API_ENABLED) {
    return MONTHS.map((m, i) => ({
      mois: m,
      monthIndex: i,
      objectif: 0,
      realise: 0,
      taux: 0,
    }));
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(22);
  return MONTHS.map((m, i) => {
    const objectif = 800_000 + Math.round(r() * 400_000);
    const realise = Math.round(objectif * (0.55 + r() * 0.55));
    return { mois: m, monthIndex: i, objectif, realise, taux: +((realise / objectif) * 100).toFixed(1) };
  });
}

export function salesByUnit() {
  // En mode Live, retourner des données vides
  if (API_ENABLED) {
    return COUNTRIES.map(c => ({ pays: c.name, code: c.code, unites: 0 }));
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(33);
  return COUNTRIES.map(c => ({ pays: c.name, code: c.code, unites: Math.round(2000 + r() * 18000) }));
}

export function salesByRevenue() {
  // En mode Live, retourner des données vides
  if (API_ENABLED) {
    return COUNTRIES.map(c => ({ pays: c.name, code: c.code, ca: 0 }));
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(44);
  return COUNTRIES.map(c => ({ pays: c.name, code: c.code, ca: Math.round((100 + r() * 500) * 1000) }));
}

export function evolutionByRevenue() {
  // En mode Live, retourner des données vides (Rapport 5)
  if (API_ENABLED) {
    return MONTHS.map((m) => {
      const row: Record<string, number | string> = { mois: m };
      for (const c of COUNTRIES) {
        row[c.code] = 0;
      }
      row.total = 0;
      return row;
    });
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(55);
  return MONTHS.map((m, i) => {
    const base = 700_000 + i * 25_000;
    const row: Record<string, number | string> = { mois: m };
    let total = 0;
    for (const c of COUNTRIES) {
      const v = Math.round(base * (0.05 + r() * 0.18));
      row[c.code] = v;
      total += v;
    }
    row.total = total;
    return row;
  });
}

export function evolutionByUnits() {
  // En mode Live, retourner des données vides (Rapport 5bis/6)
  if (API_ENABLED) {
    return MONTHS.map((m) => {
      const row: Record<string, number | string> = { mois: m };
      for (const c of COUNTRIES) {
        row[c.code] = 0;
      }
      row.total = 0;
      return row;
    });
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(66);
  return MONTHS.map((m, i) => {
    const row: Record<string, number | string> = { mois: m };
    let total = 0;
    for (const c of COUNTRIES) {
      const v = Math.round(1000 + i * 80 + r() * 4000);
      row[c.code] = v;
      total += v;
    }
    row.total = total;
    return row;
  });
}

export function stockSituation() {
  // En mode Live, retourner des données vides (Rapports 7 et 8)
  if (API_ENABLED) {
    return COUNTRIES.map(c => ({
      pays: c.name,
      code: c.code,
      stock: 0,
      enCours: 0,
      total: 0,
      seuil: 0,
      couverture: 0,
      status: "ok" as const,
    }));
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(77);
  return COUNTRIES.map(c => {
    const stock = Math.round(3000 + r() * 14000);
    const enCours = Math.round(stock * (0.05 + r() * 0.4));
    const seuil = Math.round(stock * 0.3);
    return {
      pays: c.name, code: c.code, stock, enCours, total: stock + enCours, seuil,
      couverture: +(stock / (seuil || 1) * 30).toFixed(1),
      status: stock < seuil ? "critical" as const : stock < seuil * 1.5 ? "low" as const : "ok" as const,
    };
  });
}

// ---------------- Products ----------------
export type ProductPanoramic = {
  id: string;
  cip: string;
  name: string;
  laboratory: string;
  type: string;
  productStatus: EntityStatus;
  ventes: number;
  budgetMois: number;
  tauxReal: number;
  ventesAn1: number;
  tauxEvol: number;
  ca: number;
  budgetMoisCa: number;
  txRealBudgetCa: number;
  cumulBudget: number;
  cumulRealise: number;
  txRealPrev: number;
  poids: number;
  fournisseurs: Record<string, { ventes: number; stocks: number; commandes: number; prixUnitaire: number }>;
};

// Produits en mémoire uniquement - pas de cache localStorage
let _products: ProductPanoramic[] = [];
let _deletedIds: Set<string> = new Set();
let _overrides: Record<string, { name?: string; laboratory?: string; type?: string; productStatus?: EntityStatus }> = {};

// Fonction pour charger les produits depuis l'API (appelée par hydrate.ts)
export function setProducts(products: ProductPanoramic[]) {
  _products = products;
  if (typeof window !== "undefined") {
    console.log(`✅ ${products.length} produits chargés en mémoire`);
    window.dispatchEvent(new Event("obco:products"));
  }
}

export function getPanoramicProducts(): ProductPanoramic[] {
  // Filtrer les produits supprimés et appliquer les overrides
  return _products
    .filter(p => !_deletedIds.has(p.id))
    .map(p => {
      const o = _overrides[p.id];
      return o ? { ...p, ...o } : p;
    });
}

export function getProductLaboratories(): string[] {
  return Array.from(new Set([...getLaboratoires().map(l => l.name), ...getPanoramicProducts().map(p => p.laboratory)])).sort();
}

export function addCustomProduct(input: {
  name: string; laboratory: string; type: string; productStatus: EntityStatus;
  cip?: string; pricing?: Record<string, number>; objectives?: Record<string, number>;
}): ProductPanoramic {
  const id = `PRC-${Date.now().toString(36).toUpperCase()}`;
  const fournisseurs: ProductPanoramic["fournisseurs"] = {};
  for (const s of SUPPLIERS) {
    fournisseurs[s] = { prixUnitaire: 0, ventes: 0, stocks: 0, commandes: 0 };
  }
  const obj = input.objectives ?? {};
  const budgetMois = Object.values(obj).reduce((a, b) => a + b, 0) || 1000;
  const cipValue = input.cip && input.cip.trim()
    ? input.cip.trim()
    : `NOCIP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const product: ProductPanoramic = {
    id, cip: cipValue,
    name: input.name, laboratory: input.laboratory, type: input.type, productStatus: input.productStatus,
    ventes: 0, budgetMois, tauxReal: 0,
    ventesAn1: 0, tauxEvol: 0, ca: 0,
    budgetMoisCa: budgetMois * 10, txRealBudgetCa: 0,
    cumulBudget: budgetMois * 12, cumulRealise: 0, txRealPrev: 0, poids: 0, fournisseurs,
  };
  _products = [product, ..._products];
  if (input.pricing) setProductPricing(id, input.pricing);
  if (input.objectives) setProductObjectives(id, input.objectives);
  syncCreate("/api/products", { cip: product.cip, name: input.name, category: input.type, laboratory: input.laboratory });
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:products"));
  return product;
}

export function updateProduct(id: string, patch: { name?: string; laboratory?: string; type?: string; productStatus?: EntityStatus }) {
  _products = _products.map(p => p.id === id ? { ...p, ...patch } : p);
  _overrides[id] = { ...(_overrides[id] || {}), ...patch };

  const apiPatch: Record<string, unknown> = {};
  if (patch.name) apiPatch.name = patch.name;
  if (patch.laboratory) apiPatch.laboratory = patch.laboratory;
  if (patch.type) apiPatch.category = patch.type;
  if (Object.keys(apiPatch).length) syncUpdate(`/api/products/${id}`, apiPatch);

  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:products"));
}

export function deleteProduct(id: string) {
  console.log(`🗑️ Suppression produit ${id}`);

  // Marquer comme supprimé
  _deletedIds.add(id);
  console.log(`   - Ajouté à deletedIds (${_deletedIds.size} supprimés au total)`);

  // Retirer de la liste
  _products = _products.filter(p => p.id !== id);
  console.log(`   - Produits restants: ${_products.length}`);

  // Nettoyer les overrides
  delete _overrides[id];

  // Appel API pour supprimer côté serveur
  syncDelete(`/api/products/${id}`);

  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:products"));
}
