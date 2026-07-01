// Mock dataset for agencies, countries, suppliers, products reports.
// When VITE_API_URL is set, hydrate.ts overwrites these stores with backend data
// and mutations are also forwarded to the API via src/lib/sync.ts.
import { syncCreate, syncUpdate, syncDelete, syncPut } from "./sync";
import { API_ENABLED } from "./api";

export type Country = { code: string; name: string; currency: string; region: string };
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

const COUNTRY_KEY = "obco_countries_v1";
let _countriesLoaded = false;
function persistCountries() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUNTRY_KEY, JSON.stringify(COUNTRIES));
  window.dispatchEvent(new Event("obco:countries"));
}
export function ensureCountriesLoaded() {
  if (_countriesLoaded || typeof window === "undefined") return;
  _countriesLoaded = true;
  try {
    const raw = localStorage.getItem(COUNTRY_KEY);
    if (raw) {
      const saved: Country[] = JSON.parse(raw);
      COUNTRIES.splice(0, COUNTRIES.length, ...saved);
    }
  } catch { /* ignore */ }
}
export function reloadCountries() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(COUNTRY_KEY);
    if (raw) {
      const saved: Country[] = JSON.parse(raw);
      COUNTRIES.splice(0, COUNTRIES.length, ...saved);
      console.log(`✅ ${saved.length} pays rechargés depuis localStorage`);
    } else {
      COUNTRIES.splice(0, COUNTRIES.length); // Vider si pas de données
      console.log("⚠️ Aucune donnée pays dans localStorage");
    }
  } catch (e) {
    console.error("❌ Erreur lors du rechargement des pays:", e);
  }
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
  "Médicament", "Parapharmacie", "Dispositif médical", "Complément alimentaire", "Hygiène", "Cosmétique",
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

const LAB_KEY = "obco_laboratoires_v2";
let _labs: Laboratoire[] | null = null;

function seedLabs(): Laboratoire[] {
  const seeds: Omit<Laboratoire, "id" | "createdAt" | "status">[] = [
    { name: "Sanofi Afrique", country: "CI", contact: "Marc Dupont", email: "m.dupont@sanofi.com", phone: "+225 27 22 44 00", address: "Plateau, Abidjan" },
    { name: "Pfizer West Africa", country: "SN", contact: "Aïssatou Diop", email: "a.diop@pfizer.com", phone: "+221 33 869 00 00", address: "Almadies, Dakar" },
    { name: "Novartis CEMAC", country: "CM", contact: "Jean Mbarga", email: "j.mbarga@novartis.com", phone: "+237 233 42 00 00", address: "Bonanjo, Douala" },
    { name: "Servier Mali", country: "ML", contact: "Mariam Touré", email: "m.toure@servier.com", phone: "+223 20 22 00 00", address: "Hamdallaye, Bamako" },
  ];
  return seeds.map((s, i) => ({
    ...s,
    id: `LAB-${String(i + 1).padStart(3, "0")}`,
    createdAt: `2025-${String(2 + i).padStart(2, "0")}-10`,
    status: "active",
  }));
}

function persistLabs() {
  if (typeof window !== "undefined") localStorage.setItem(LAB_KEY, JSON.stringify(_labs));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:labs"));
}

export function getLaboratoires(): Laboratoire[] {
  if (_labs) return _labs;
  if (typeof window !== "undefined") {
    try { const raw = localStorage.getItem(LAB_KEY); if (raw) { _labs = JSON.parse(raw); return _labs!; } } catch {}
  }
  // En mode Live, retourner un tableau vide si pas de données (ne pas créer de seed)
  if (API_ENABLED) {
    _labs = [];
    return _labs;
  }
  // Mode Demo : créer des données de seed
  _labs = seedLabs();
  if (typeof window !== "undefined") localStorage.setItem(LAB_KEY, JSON.stringify(_labs));
  return _labs;
}

export function addLaboratoire(l: Omit<Laboratoire, "id" | "createdAt" | "status">): Laboratoire {
  const list = getLaboratoires();
  const next: Laboratoire = { ...l, id: `LAB-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString().slice(0, 10), status: "active" };
  _labs = [next, ...list];
  persistLabs();
  syncCreate("/api/laboratories", { name: l.name, countryCode: l.country, contact: l.contact, email: l.email, phone: l.phone, address: l.address });
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
  scope: "country" | "agency";  // assigné à tout le pays ou à une agence précise
  agencyId?: string;
};

const GROS_KEY = "obco_grossistes_v2";
let _gros: Grossiste[] | null = null;

function seedGros(): Grossiste[] {
  const seeds: Omit<Grossiste, "id">[] = [
    { partenaire: "CAMED", type: "Grossiste", country: "CI", email: "contact@camed.ci", status: "active", scope: "country" },
    { partenaire: "LABOREX MALI", type: "Grossiste", country: "ML", email: "info@laborex.ml", status: "active", scope: "country" },
    { partenaire: "COPHARMED", type: "Grossiste", country: "SN", email: "contact@copharmed.sn", status: "active", scope: "country" },
    { partenaire: "UBIPHARM", type: "Grossiste", country: "BF", email: "ubipharm@ubipharm.bf", status: "warning", scope: "country" },
    { partenaire: "DPM", type: "Grossiste", country: "CM", email: "contact@dpm.cm", status: "active", scope: "country" },
  ];
  return seeds.map((s, i) => ({ ...s, id: `GR-${String(i + 1).padStart(3, "0")}` }));
}

function persistGros() {
  if (typeof window !== "undefined") localStorage.setItem(GROS_KEY, JSON.stringify(_gros));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:gros"));
}

export function getGrossistes(): Grossiste[] {
  if (_gros) return _gros;
  if (typeof window !== "undefined") {
    try { const raw = localStorage.getItem(GROS_KEY); if (raw) { _gros = JSON.parse(raw); return _gros!; } } catch {}
  }
  // En mode Live, retourner un tableau vide si pas de données (ne pas créer de seed)
  if (API_ENABLED) {
    _gros = [];
    return _gros;
  }
  // Mode Demo : créer des données de seed
  _gros = seedGros();
  if (typeof window !== "undefined") localStorage.setItem(GROS_KEY, JSON.stringify(_gros));
  return _gros;
}

export function addGrossiste(g: Omit<Grossiste, "id">): Grossiste {
  const next: Grossiste = { ...g, id: `GR-${Date.now().toString(36).toUpperCase()}` };
  _gros = [next, ...getGrossistes()];
  persistGros();
  syncCreate("/api/wholesalers", { name: g.partenaire, countryCode: g.country, email: g.email, scope: g.scope, agencyId: g.agencyId || null });
  return next;
}

export function updateGrossiste(id: string, patch: Partial<Grossiste>) {
  _gros = getGrossistes().map(g => g.id === id ? { ...g, ...patch } : g);
  persistGros();
  const apiPatch: Record<string, unknown> = { ...patch };
  if (patch.partenaire) { apiPatch.name = patch.partenaire; delete apiPatch.partenaire; }
  if (patch.country) { apiPatch.countryCode = patch.country; delete apiPatch.country; }
  syncUpdate(`/api/wholesalers/${id}`, apiPatch);
}

export function setGrossisteStatus(id: string, status: EntityStatus) { updateGrossiste(id, { status }); }
export function deleteGrossiste(id: string) {
  _gros = getGrossistes().filter(g => g.id !== id); persistGros();
  syncDelete(`/api/wholesalers/${id}`);
}

// ---------------- Pricing & objectives ----------------
type PriceMap = Record<string, Record<string, number>>;
type ObjMap = Record<string, Record<string, number>>;
const PRICE_KEY = "obco_prices";
const OBJ_KEY = "obco_objectives";

function loadMap(key: string): PriceMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
}
function saveMap(key: string, m: PriceMap) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(m));
}

export function getProductPricing(productId: string, basePrice: number) {
  const m = loadMap(PRICE_KEY);
  const existing = m[productId] || {};
  const out: Record<string, number> = {};
  for (const c of COUNTRIES) {
    out[c.code] = existing[c.code] ?? +(basePrice * (0.9 + (c.code.charCodeAt(0) % 5) * 0.05)).toFixed(2);
  }
  return out;
}
export function setProductPricing(productId: string, prices: Record<string, number>) {
  const m = loadMap(PRICE_KEY);
  m[productId] = prices;
  saveMap(PRICE_KEY, m);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:pricing"));
  for (const [countryCode, price] of Object.entries(prices)) {
    syncPut("/api/prices", { productId, countryCode, price });
  }
}

export function getProductObjectives(productId: string, baseQty: number) {
  const m = loadMap(OBJ_KEY) as ObjMap;
  const existing = m[productId] || {};
  const out: Record<string, number> = {};
  for (const c of COUNTRIES) {
    out[c.code] = existing[c.code] ?? Math.round(baseQty * (0.6 + (c.code.charCodeAt(1) % 7) * 0.1));
  }
  return out;
}
export function setProductObjectives(productId: string, qty: Record<string, number>) {
  const m = loadMap(OBJ_KEY) as ObjMap;
  m[productId] = qty;
  saveMap(OBJ_KEY, m);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:objectives"));
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  for (const [countryCode, targetUnits] of Object.entries(qty)) {
    syncPut("/api/objectives", { productId, countryCode, year, month, targetUnits, targetCA: 0 });
  }
}

// ---------------- Agencies ----------------
let _agencies: Agency[] | null = null;
const KEY = "obco_agencies_v2";

function seed(): Agency[] {
  const names = ["ANF Abidjan", "ANF Bamako", "ANF Dakar", "ANF Ouaga", "ANF Douala", "ANF Libreville", "ANF Lomé", "ANF Cotonou"];
  const mgr = ["A. Koné", "M. Traoré", "F. Diop", "P. Ouédraogo", "J. Mbarga", "S. Ndong", "K. Adjo", "C. Hounsou"];
  return COUNTRIES.map((c, i) => ({
    id: `AG-${String(i + 1).padStart(3, "0")}`,
    name: names[i],
    country: c.code,
    email: `${names[i].toLowerCase().replace(/\s/g, ".")}@obco.io`,
    manager: mgr[i],
    city: c.name.split(" ")[0],
    createdAt: `2025-${String(1 + (i % 12)).padStart(2, "0")}-${String(5 + i).padStart(2, "0")}`,
    status: i % 5 === 4 ? "warning" : "active",
  }));
}

function persistAgencies() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(_agencies));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:agencies"));
}

export function getAgencies(): Agency[] {
  if (_agencies) return _agencies;
  if (typeof window !== "undefined") {
    try { const raw = localStorage.getItem(KEY); if (raw) { _agencies = JSON.parse(raw); return _agencies!; } } catch {}
  }
  // En mode Live, retourner un tableau vide si pas de données (ne pas créer de seed)
  if (API_ENABLED) {
    _agencies = [];
    return _agencies;
  }
  // Mode Demo : créer des données de seed
  _agencies = seed();
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(_agencies));
  return _agencies;
}

export async function addAgency(a: Omit<Agency, "id" | "createdAt" | "status">): Promise<Agency & { temporaryPassword?: string }> {
  const optimisticNext: Agency = {
    ...a,
    id: `AG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "active",
  };
  _agencies = [optimisticNext, ...getAgencies()];
  persistAgencies();

  try {
    // Envoyer à l'API et attendre la réponse
    const response = await syncCreate("/api/agencies", {
      name: a.name,
      city: a.city,
      email: a.email,
      manager: a.manager,
      countryCode: a.country,
    }) as any;

    // Si l'API retourne un ID différent et un mot de passe temporaire, mettre à jour
    if (response?.id && response.id !== optimisticNext.id) {
      _agencies = _agencies.map(ag => ag.id === optimisticNext.id ? { ...ag, id: response.id } : ag);
      persistAgencies();
    }

    return {
      ...optimisticNext,
      id: response?.id || optimisticNext.id,
      temporaryPassword: response?.temporaryPassword,
    };
  } catch (error) {
    // En cas d'erreur, garder l'agence locale quand même
    console.error("Erreur lors de la création de l'agence:", error);
    return optimisticNext;
  }
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
  pghtPays: number;
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

const CUSTOM_KEY = "obco_custom_products";
const OVERRIDES_KEY = "obco_product_overrides";

let _products: ProductPanoramic[] | null = null;

function seedPanoramic(): ProductPanoramic[] {
  const r = rand(101);
  const roots = ["Paracétamol 500", "Amoxicilline 1g", "Doliprane 1000", "Spasfon", "Vitamine C 500", "Smecta", "Imodium", "Voltarène 50", "Augmentin 1g", "Ibuprofène 400",
                 "Lévothyrox 50", "Ventoline", "Daflon 500", "Maalox", "Bétadine", "Aspirine 500", "Tramadol 100", "Lidocaïne 5%", "Oméprazole 20", "Cétirizine 10"];
  const labs = ["Sanofi", "Pfizer", "Novartis", "Bayer", "Servier", "GSK", "Biogaran"];
  const list: ProductPanoramic[] = [];
  for (let i = 0; i < 80; i++) {
    const name = `${roots[i % roots.length]} ${["bte/20", "bte/30", "fl/200ml", "tube/50g"][i % 4]}`;
    const pght = +(2 + r() * 35).toFixed(2);
    const budgetMois = Math.round(800 + r() * 6000);
    const ventes = Math.round(budgetMois * (0.5 + r() * 0.9));
    const ventesAn1 = Math.round(ventes * (0.6 + r() * 0.6));
    const ca = +(ventes * pght).toFixed(2);
    const budgetMoisCa = +(budgetMois * pght).toFixed(2);
    const cumulBudget = budgetMois * (3 + Math.floor(r() * 8));
    const cumulRealise = Math.round(cumulBudget * (0.55 + r() * 0.55));
    const fournisseurs: ProductPanoramic["fournisseurs"] = {};
    for (const s of SUPPLIERS) {
      fournisseurs[s] = {
        prixUnitaire: +(pght * (0.9 + r() * 0.3)).toFixed(2),
        ventes: Math.round(r() * (ventes / 2)),
        stocks: Math.round(20 + r() * 400),
        commandes: Math.round(r() * 120),
      };
    }
    list.push({
      id: `PR-${String(i + 1).padStart(4, "0")}`,
      cip: String(3400900000000 + Math.floor(r() * 999_999_999)),
      name, laboratory: labs[i % labs.length],
      type: PRODUCT_TYPES[i % PRODUCT_TYPES.length],
      productStatus: "active",
      pghtPays: pght, ventes, budgetMois,
      tauxReal: +((ventes / budgetMois) * 100).toFixed(1),
      ventesAn1, tauxEvol: +(((ventes - ventesAn1) / (ventesAn1 || 1)) * 100).toFixed(1),
      ca, budgetMoisCa, txRealBudgetCa: +((ca / budgetMoisCa) * 100).toFixed(1),
      cumulBudget, cumulRealise, txRealPrev: +((cumulRealise / cumulBudget) * 100).toFixed(1),
      poids: 0, fournisseurs,
    });
  }
  const totCA = list.reduce((s, x) => s + x.ca, 0);
  for (const p of list) p.poids = +((p.ca / totCA) * 100).toFixed(2);
  return list;
}

type ProductOverride = { name?: string; laboratory?: string; type?: string; productStatus?: EntityStatus; pghtPays?: number; deleted?: boolean };

const DELETED_KEY = "obco_deleted_products";

function loadDeleted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const arr = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveDeleted(deletedIds: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds]));
}

function loadOverrides(): Record<string, ProductOverride> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); } catch { return {}; }
}
function saveOverrides(o: Record<string, ProductOverride>) {
  if (typeof window !== "undefined") localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
}
function loadCustom(): ProductPanoramic[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]"); } catch { return []; }
}
function saveCustom(list: ProductPanoramic[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
    console.log(`✅ ${list.length} produits sauvegardés, dispatch événement`);
    window.dispatchEvent(new Event("obco:products"));
  }
}

export function getPanoramicProducts(): ProductPanoramic[] {
  // En mode Live, ne pas créer de seed automatiquement
  if (!_products) {
    if (API_ENABLED) {
      _products = []; // Tableau vide en mode Live
    } else {
      _products = seedPanoramic(); // Mode Demo : créer des données de seed
    }
  }
  const overrides = loadOverrides();
  const deletedIds = loadDeleted();

  // Filtrer les produits supprimés et appliquer les overrides
  const merged = _products
    .filter(p => !deletedIds.has(p.id))
    .map(p => {
      const o = overrides[p.id];
      return o ? { ...p, ...o } : p;
    });

  // Filtrer aussi les produits custom (qui incluent les produits de l'API en mode Live)
  const allCustom = loadCustom();
  const customProducts = allCustom.filter(p => !deletedIds.has(p.id));

  const total = [...customProducts, ...merged];
  console.log(`📦 getPanoramicProducts: ${allCustom.length} custom, ${deletedIds.size} supprimés → ${total.length} total`);

  return total;
}

export function getProductLaboratories(): string[] {
  return Array.from(new Set([...getLaboratoires().map(l => l.name), ...getPanoramicProducts().map(p => p.laboratory)])).sort();
}

export function addCustomProduct(input: {
  name: string; laboratory: string; type: string; productStatus: EntityStatus;
  pghtPays: number; cip?: string; pricing?: Record<string, number>; objectives?: Record<string, number>;
}): ProductPanoramic {
  const id = `PRC-${Date.now().toString(36).toUpperCase()}`;
  const fournisseurs: ProductPanoramic["fournisseurs"] = {};
  for (const s of SUPPLIERS) {
    fournisseurs[s] = { prixUnitaire: input.pghtPays, ventes: 0, stocks: 0, commandes: 0 };
  }
  const obj = input.objectives ?? {};
  const budgetMois = Object.values(obj).reduce((a, b) => a + b, 0) || 1000;
  // Utiliser le CIP fourni ou générer un code NOCIP unique
  const cipValue = input.cip && input.cip.trim()
    ? input.cip.trim()
    : `NOCIP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const product: ProductPanoramic = {
    id, cip: cipValue,
    name: input.name, laboratory: input.laboratory, type: input.type, productStatus: input.productStatus,
    pghtPays: input.pghtPays, ventes: 0, budgetMois, tauxReal: 0,
    ventesAn1: 0, tauxEvol: 0, ca: 0,
    budgetMoisCa: budgetMois * input.pghtPays, txRealBudgetCa: 0,
    cumulBudget: budgetMois * 12, cumulRealise: 0, txRealPrev: 0, poids: 0, fournisseurs,
  };
  saveCustom([product, ...loadCustom()]);
  if (input.pricing) setProductPricing(id, input.pricing);
  if (input.objectives) setProductObjectives(id, input.objectives);
  syncCreate("/api/products", { cip: product.cip, name: input.name, category: input.type, laboratory: input.laboratory, basePrice: input.pghtPays });
  return product;
}

export function updateProduct(id: string, patch: ProductOverride) {
  if (id.startsWith("PRC-")) {
    const list = loadCustom().map(p => p.id === id ? { ...p, ...patch } : p);
    saveCustom(list);
  } else {
    const o = loadOverrides();
    o[id] = { ...(o[id] || {}), ...patch };
    saveOverrides(o);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:products"));
  }
  const apiPatch: Record<string, unknown> = {};
  if (patch.name) apiPatch.name = patch.name;
  if (patch.laboratory) apiPatch.laboratory = patch.laboratory;
  if (patch.type) apiPatch.category = patch.type;
  if (patch.pghtPays !== undefined) apiPatch.basePrice = patch.pghtPays;
  if (Object.keys(apiPatch).length) syncUpdate(`/api/products/${id}`, apiPatch);
}

export function deleteProduct(id: string) {
  console.log(`🗑️ Suppression produit ${id}`);

  // Marquer comme supprimé (fonctionne pour tous les types de produits)
  const deletedIds = loadDeleted();
  deletedIds.add(id);
  saveDeleted(deletedIds);
  console.log(`   - Ajouté à deletedIds (${deletedIds.size} supprimés au total)`);

  // Retirer aussi de la liste custom (en mode API, tous les produits y sont)
  const customBefore = loadCustom().length;
  const filtered = loadCustom().filter(p => p.id !== id);
  console.log(`   - Produits custom: ${customBefore} → ${filtered.length}`);
  saveCustom(filtered);

  // Nettoyer les overrides
  const o = loadOverrides();
  delete o[id];
  saveOverrides(o);

  // Appel API pour supprimer côté serveur
  syncDelete(`/api/products/${id}`);
}
