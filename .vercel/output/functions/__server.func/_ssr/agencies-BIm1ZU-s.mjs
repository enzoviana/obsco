import { n as ApiError, r as api, t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agencies-BIm1ZU-s.js
function notify(err, op) {
	const msg = err instanceof Error ? err.message : String(err);
	if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) return;
	if (err instanceof ApiError && err.status === 401) {
		toast.error("Session expirée, veuillez vous reconnecter");
		return;
	}
	toast.error(`Erreur ${op}: ${msg}`);
}
function syncFire(promise, op) {
	promise.catch((err) => notify(err, op));
}
function syncCreate(path, body) {
	if (!API_ENABLED) return Promise.resolve();
	const promise = api(path, {
		method: "POST",
		body: JSON.stringify(body)
	});
	syncFire(promise, `création ${path}`);
	return promise;
}
function syncUpdate(path, body) {
	if (!API_ENABLED) return;
	syncFire(api(path, {
		method: "PATCH",
		body: JSON.stringify(body)
	}), `mise à jour ${path}`);
}
function syncPut(path, body) {
	if (!API_ENABLED) return;
	syncFire(api(path, {
		method: "PUT",
		body: JSON.stringify(body)
	}), `modification ${path}`);
}
function syncDelete(path) {
	if (!API_ENABLED) return;
	syncFire(api(path, { method: "DELETE" }), `suppression ${path}`);
}
var COUNTRIES = [];
var COUNTRY_KEY = "obco_countries_v1";
var _countriesLoaded = false;
function persistCountries() {
	if (typeof window === "undefined") return;
	localStorage.setItem(COUNTRY_KEY, JSON.stringify(COUNTRIES));
	window.dispatchEvent(new Event("obco:countries"));
}
function ensureCountriesLoaded() {
	if (_countriesLoaded || typeof window === "undefined") return;
	_countriesLoaded = true;
	try {
		const raw = localStorage.getItem(COUNTRY_KEY);
		if (raw) {
			const saved = JSON.parse(raw);
			COUNTRIES.splice(0, COUNTRIES.length, ...saved);
		}
	} catch {}
}
function reloadCountries() {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(COUNTRY_KEY);
		if (raw) {
			const saved = JSON.parse(raw);
			COUNTRIES.splice(0, COUNTRIES.length, ...saved);
			console.log(`✅ ${saved.length} pays rechargés depuis localStorage`);
		} else {
			COUNTRIES.splice(0, COUNTRIES.length);
			console.log("⚠️ Aucune donnée pays dans localStorage");
		}
	} catch (e) {
		console.error("❌ Erreur lors du rechargement des pays:", e);
	}
}
function addCountry(c) {
	ensureCountriesLoaded();
	if (COUNTRIES.some((x) => x.code === c.code)) throw new Error("Code ISO déjà utilisé");
	COUNTRIES.push(c);
	persistCountries();
	syncCreate("/api/countries", c);
}
function updateCountry(code, patch) {
	ensureCountriesLoaded();
	const i = COUNTRIES.findIndex((c) => c.code === code);
	if (i >= 0) {
		COUNTRIES[i] = {
			...COUNTRIES[i],
			...patch,
			code
		};
		persistCountries();
	}
	syncUpdate(`/api/countries/${code}`, patch);
}
function deleteCountry(code) {
	ensureCountriesLoaded();
	const i = COUNTRIES.findIndex((c) => c.code === code);
	if (i >= 0) {
		COUNTRIES.splice(i, 1);
		persistCountries();
	}
	syncDelete(`/api/countries/${code}`);
}
var SUPPLIERS = [
	"CAMED",
	"LABOREX MALI",
	"COPHARMED",
	"UBIPHARM",
	"DPM"
];
var PRODUCT_TYPES = [
	"Médicament",
	"Parapharmacie",
	"Dispositif médical",
	"Complément alimentaire",
	"Hygiène",
	"Cosmétique",
	"Consommable"
];
var LAB_KEY = "obco_laboratoires_v2";
var _labs = null;
function seedLabs() {
	return [
		{
			name: "Sanofi Afrique",
			country: "CI",
			contact: "Marc Dupont",
			email: "m.dupont@sanofi.com",
			phone: "+225 27 22 44 00",
			address: "Plateau, Abidjan"
		},
		{
			name: "Pfizer West Africa",
			country: "SN",
			contact: "Aïssatou Diop",
			email: "a.diop@pfizer.com",
			phone: "+221 33 869 00 00",
			address: "Almadies, Dakar"
		},
		{
			name: "Novartis CEMAC",
			country: "CM",
			contact: "Jean Mbarga",
			email: "j.mbarga@novartis.com",
			phone: "+237 233 42 00 00",
			address: "Bonanjo, Douala"
		},
		{
			name: "Servier Mali",
			country: "ML",
			contact: "Mariam Touré",
			email: "m.toure@servier.com",
			phone: "+223 20 22 00 00",
			address: "Hamdallaye, Bamako"
		}
	].map((s, i) => ({
		...s,
		id: `LAB-${String(i + 1).padStart(3, "0")}`,
		createdAt: `2025-${String(2 + i).padStart(2, "0")}-10`,
		status: "active"
	}));
}
function persistLabs() {
	if (typeof window !== "undefined") localStorage.setItem(LAB_KEY, JSON.stringify(_labs));
	if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:labs"));
}
function getLaboratoires() {
	if (_labs) return _labs;
	if (typeof window !== "undefined") try {
		const raw = localStorage.getItem(LAB_KEY);
		if (raw) {
			_labs = JSON.parse(raw);
			return _labs;
		}
	} catch {}
	if (API_ENABLED) {
		_labs = [];
		return _labs;
	}
	_labs = seedLabs();
	if (typeof window !== "undefined") localStorage.setItem(LAB_KEY, JSON.stringify(_labs));
	return _labs;
}
function addLaboratoire(l) {
	const list = getLaboratoires();
	const next = {
		...l,
		id: `LAB-${Date.now().toString(36).toUpperCase()}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		status: "active"
	};
	_labs = [next, ...list];
	persistLabs();
	syncCreate("/api/laboratories", {
		name: l.name,
		countryCode: l.country,
		contact: l.contact,
		email: l.email,
		phone: l.phone,
		address: l.address
	});
	return next;
}
function updateLaboratoire(id, patch) {
	_labs = getLaboratoires().map((l) => l.id === id ? {
		...l,
		...patch
	} : l);
	persistLabs();
	const apiPatch = { ...patch };
	if (patch.country) {
		apiPatch.countryCode = patch.country;
		delete apiPatch.country;
	}
	syncUpdate(`/api/laboratories/${id}`, apiPatch);
}
function setLaboratoireStatus(id, status) {
	updateLaboratoire(id, { status });
}
function deleteLaboratoire(id) {
	_labs = getLaboratoires().filter((l) => l.id !== id);
	persistLabs();
	syncDelete(`/api/laboratories/${id}`);
}
var GROS_KEY = "obco_grossistes_v2";
var _gros = null;
function seedGros() {
	return [
		{
			partenaire: "CAMED",
			type: "Grossiste",
			country: "CI",
			email: "contact@camed.ci",
			status: "active"
		},
		{
			partenaire: "LABOREX MALI",
			type: "Grossiste",
			country: "ML",
			email: "info@laborex.ml",
			status: "active"
		},
		{
			partenaire: "COPHARMED",
			type: "Grossiste",
			country: "SN",
			email: "contact@copharmed.sn",
			status: "active"
		},
		{
			partenaire: "UBIPHARM",
			type: "Grossiste",
			country: "BF",
			email: "ubipharm@ubipharm.bf",
			status: "warning"
		},
		{
			partenaire: "DPM",
			type: "Grossiste",
			country: "CM",
			email: "contact@dpm.cm",
			status: "active"
		}
	].map((s, i) => ({
		...s,
		id: `GR-${String(i + 1).padStart(3, "0")}`
	}));
}
function persistGros() {
	if (typeof window !== "undefined") localStorage.setItem(GROS_KEY, JSON.stringify(_gros));
	if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:gros"));
}
function getGrossistes() {
	if (_gros) return _gros;
	if (typeof window !== "undefined") try {
		const raw = localStorage.getItem(GROS_KEY);
		if (raw) {
			_gros = JSON.parse(raw);
			return _gros;
		}
	} catch {}
	if (API_ENABLED) {
		_gros = [];
		return _gros;
	}
	_gros = seedGros();
	if (typeof window !== "undefined") localStorage.setItem(GROS_KEY, JSON.stringify(_gros));
	return _gros;
}
function addGrossiste(g) {
	const next = {
		...g,
		id: `GR-${Date.now().toString(36).toUpperCase()}`
	};
	_gros = [next, ...getGrossistes()];
	persistGros();
	syncCreate("/api/wholesalers", {
		name: g.partenaire,
		countryCode: g.country,
		email: g.email
	});
	return next;
}
function updateGrossiste(id, patch) {
	_gros = getGrossistes().map((g) => g.id === id ? {
		...g,
		...patch
	} : g);
	persistGros();
	const apiPatch = { ...patch };
	if (patch.partenaire) {
		apiPatch.name = patch.partenaire;
		delete apiPatch.partenaire;
	}
	if (patch.country) {
		apiPatch.countryCode = patch.country;
		delete apiPatch.country;
	}
	syncUpdate(`/api/wholesalers/${id}`, apiPatch);
}
function setGrossisteStatus(id, status) {
	updateGrossiste(id, { status });
}
function deleteGrossiste(id) {
	_gros = getGrossistes().filter((g) => g.id !== id);
	persistGros();
	syncDelete(`/api/wholesalers/${id}`);
}
var PRICE_KEY = "obco_prices";
var OBJ_KEY = "obco_objectives";
function loadMap(key) {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(localStorage.getItem(key) || "{}");
	} catch {
		return {};
	}
}
function saveMap(key, m) {
	if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(m));
}
function getProductPricing(productId, basePrice) {
	const existing = loadMap(PRICE_KEY)[productId] || {};
	const out = {};
	for (const c of COUNTRIES) out[c.code] = existing[c.code] ?? +(basePrice * (.9 + c.code.charCodeAt(0) % 5 * .05)).toFixed(2);
	return out;
}
function setProductPricing(productId, prices) {
	const m = loadMap(PRICE_KEY);
	m[productId] = prices;
	saveMap(PRICE_KEY, m);
	if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:pricing"));
	for (const [countryCode, price] of Object.entries(prices)) syncPut("/api/prices", {
		productId,
		countryCode,
		price
	});
}
function getProductObjectives(productId, baseQty) {
	const existing = loadMap(OBJ_KEY)[productId] || {};
	const out = {};
	for (const c of COUNTRIES) out[c.code] = existing[c.code] ?? Math.round(baseQty * (.6 + c.code.charCodeAt(1) % 7 * .1));
	return out;
}
function setProductObjectives(productId, qty) {
	const m = loadMap(OBJ_KEY);
	m[productId] = qty;
	saveMap(OBJ_KEY, m);
	if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:objectives"));
	const now = /* @__PURE__ */ new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	for (const [countryCode, targetUnits] of Object.entries(qty)) syncPut("/api/objectives", {
		productId,
		countryCode,
		year,
		month,
		targetUnits,
		targetCA: 0
	});
}
var _agencies = null;
var KEY = "obco_agencies_v2";
function seed() {
	const names = [
		"ANF Abidjan",
		"ANF Bamako",
		"ANF Dakar",
		"ANF Ouaga",
		"ANF Douala",
		"ANF Libreville",
		"ANF Lomé",
		"ANF Cotonou"
	];
	const mgr = [
		"A. Koné",
		"M. Traoré",
		"F. Diop",
		"P. Ouédraogo",
		"J. Mbarga",
		"S. Ndong",
		"K. Adjo",
		"C. Hounsou"
	];
	return COUNTRIES.map((c, i) => ({
		id: `AG-${String(i + 1).padStart(3, "0")}`,
		name: names[i],
		country: c.code,
		email: `${names[i].toLowerCase().replace(/\s/g, ".")}@obco.io`,
		manager: mgr[i],
		city: c.name.split(" ")[0],
		createdAt: `2025-${String(1 + i % 12).padStart(2, "0")}-${String(5 + i).padStart(2, "0")}`,
		status: i % 5 === 4 ? "warning" : "active"
	}));
}
function persistAgencies() {
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(_agencies));
	if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:agencies"));
}
function getAgencies() {
	if (_agencies) return _agencies;
	if (typeof window !== "undefined") try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			_agencies = JSON.parse(raw);
			return _agencies;
		}
	} catch {}
	if (API_ENABLED) {
		_agencies = [];
		return _agencies;
	}
	_agencies = seed();
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(_agencies));
	return _agencies;
}
async function addAgency(a) {
	const optimisticNext = {
		...a,
		id: `AG-${Date.now().toString(36).toUpperCase()}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		status: "active"
	};
	_agencies = [optimisticNext, ...getAgencies()];
	persistAgencies();
	try {
		const response = await syncCreate("/api/agencies", {
			name: a.name,
			city: a.city,
			email: a.email,
			manager: a.manager,
			countryCode: a.country
		});
		if (response?.id && response.id !== optimisticNext.id) {
			_agencies = _agencies.map((ag) => ag.id === optimisticNext.id ? {
				...ag,
				id: response.id
			} : ag);
			persistAgencies();
		}
		return {
			...optimisticNext,
			id: response?.id || optimisticNext.id,
			temporaryPassword: response?.temporaryPassword
		};
	} catch (error) {
		console.error("Erreur lors de la création de l'agence:", error);
		return optimisticNext;
	}
}
function updateAgency(id, patch) {
	_agencies = getAgencies().map((a) => a.id === id ? {
		...a,
		...patch
	} : a);
	persistAgencies();
	const apiPatch = { ...patch };
	if (patch.country) {
		apiPatch.countryCode = patch.country;
		delete apiPatch.country;
	}
	syncUpdate(`/api/agencies/${id}`, apiPatch);
}
function setAgencyStatus(id, status) {
	updateAgency(id, { status });
}
function deleteAgency(id) {
	_agencies = getAgencies().filter((a) => a.id !== id);
	persistAgencies();
	syncDelete(`/api/agencies/${id}`);
}
function rand(seed) {
	let s = seed >>> 0;
	return () => {
		s = s * 1664525 + 1013904223 >>> 0;
		return s / 4294967295;
	};
}
var MONTHS = [
	"Jan",
	"Fév",
	"Mar",
	"Avr",
	"Mai",
	"Juin",
	"Juil",
	"Août",
	"Sep",
	"Oct",
	"Nov",
	"Déc"
];
function salesObjectivesByCountry() {
	if (API_ENABLED) return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		objectif: 0,
		realise: 0,
		taux: 0,
		ecart: 0
	}));
	const r = rand(11);
	return COUNTRIES.map((c) => {
		const objectif = Math.round((50 + r() * 150) * 1e3);
		const realise = Math.round(objectif * (.6 + r() * .5));
		return {
			pays: c.name,
			code: c.code,
			objectif,
			realise,
			taux: +(realise / objectif * 100).toFixed(1),
			ecart: realise - objectif
		};
	});
}
function salesObjectivesANF() {
	if (API_ENABLED) return MONTHS.map((m, i) => ({
		mois: m,
		monthIndex: i,
		objectif: 0,
		realise: 0,
		taux: 0
	}));
	const r = rand(22);
	return MONTHS.map((m, i) => {
		const objectif = 8e5 + Math.round(r() * 4e5);
		const realise = Math.round(objectif * (.55 + r() * .55));
		return {
			mois: m,
			monthIndex: i,
			objectif,
			realise,
			taux: +(realise / objectif * 100).toFixed(1)
		};
	});
}
function salesByUnit() {
	if (API_ENABLED) return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		unites: 0
	}));
	const r = rand(33);
	return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		unites: Math.round(2e3 + r() * 18e3)
	}));
}
function salesByRevenue() {
	if (API_ENABLED) return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		ca: 0
	}));
	const r = rand(44);
	return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		ca: Math.round((100 + r() * 500) * 1e3)
	}));
}
function evolutionByRevenue() {
	if (API_ENABLED) return MONTHS.map((m) => {
		const row = { mois: m };
		for (const c of COUNTRIES) row[c.code] = 0;
		row.total = 0;
		return row;
	});
	const r = rand(55);
	return MONTHS.map((m, i) => {
		const base = 7e5 + i * 25e3;
		const row = { mois: m };
		let total = 0;
		for (const c of COUNTRIES) {
			const v = Math.round(base * (.05 + r() * .18));
			row[c.code] = v;
			total += v;
		}
		row.total = total;
		return row;
	});
}
function evolutionByUnits() {
	if (API_ENABLED) return MONTHS.map((m) => {
		const row = { mois: m };
		for (const c of COUNTRIES) row[c.code] = 0;
		row.total = 0;
		return row;
	});
	const r = rand(66);
	return MONTHS.map((m, i) => {
		const row = { mois: m };
		let total = 0;
		for (const c of COUNTRIES) {
			const v = Math.round(1e3 + i * 80 + r() * 4e3);
			row[c.code] = v;
			total += v;
		}
		row.total = total;
		return row;
	});
}
function stockSituation() {
	if (API_ENABLED) return COUNTRIES.map((c) => ({
		pays: c.name,
		code: c.code,
		stock: 0,
		enCours: 0,
		total: 0,
		seuil: 0,
		couverture: 0,
		status: "ok"
	}));
	const r = rand(77);
	return COUNTRIES.map((c) => {
		const stock = Math.round(3e3 + r() * 14e3);
		const enCours = Math.round(stock * (.05 + r() * .4));
		const seuil = Math.round(stock * .3);
		return {
			pays: c.name,
			code: c.code,
			stock,
			enCours,
			total: stock + enCours,
			seuil,
			couverture: +(stock / (seuil || 1) * 30).toFixed(1),
			status: stock < seuil ? "critical" : stock < seuil * 1.5 ? "low" : "ok"
		};
	});
}
var CUSTOM_KEY = "obco_custom_products";
var OVERRIDES_KEY = "obco_product_overrides";
var _products = null;
function seedPanoramic() {
	const r = rand(101);
	const roots = [
		"Paracétamol 500",
		"Amoxicilline 1g",
		"Doliprane 1000",
		"Spasfon",
		"Vitamine C 500",
		"Smecta",
		"Imodium",
		"Voltarène 50",
		"Augmentin 1g",
		"Ibuprofène 400",
		"Lévothyrox 50",
		"Ventoline",
		"Daflon 500",
		"Maalox",
		"Bétadine",
		"Aspirine 500",
		"Tramadol 100",
		"Lidocaïne 5%",
		"Oméprazole 20",
		"Cétirizine 10"
	];
	const labs = [
		"Sanofi",
		"Pfizer",
		"Novartis",
		"Bayer",
		"Servier",
		"GSK",
		"Biogaran"
	];
	const list = [];
	for (let i = 0; i < 80; i++) {
		const name = `${roots[i % roots.length]} ${[
			"bte/20",
			"bte/30",
			"fl/200ml",
			"tube/50g"
		][i % 4]}`;
		const budgetMois = Math.round(800 + r() * 6e3);
		const ventes = Math.round(budgetMois * (.5 + r() * .9));
		const ventesAn1 = Math.round(ventes * (.6 + r() * .6));
		const ca = +(ventes * 10).toFixed(2);
		const budgetMoisCa = +(budgetMois * 10).toFixed(2);
		const cumulBudget = budgetMois * (3 + Math.floor(r() * 8));
		const cumulRealise = Math.round(cumulBudget * (.55 + r() * .55));
		const fournisseurs = {};
		for (const s of SUPPLIERS) fournisseurs[s] = {
			prixUnitaire: +(10 * (.9 + r() * .3)).toFixed(2),
			ventes: Math.round(r() * (ventes / 2)),
			stocks: Math.round(20 + r() * 400),
			commandes: Math.round(r() * 120)
		};
		list.push({
			id: `PR-${String(i + 1).padStart(4, "0")}`,
			cip: String(34009e8 + Math.floor(r() * 999999999)),
			name,
			laboratory: labs[i % labs.length],
			type: PRODUCT_TYPES[i % PRODUCT_TYPES.length],
			productStatus: "active",
			ventes,
			budgetMois,
			tauxReal: +(ventes / budgetMois * 100).toFixed(1),
			ventesAn1,
			tauxEvol: +((ventes - ventesAn1) / (ventesAn1 || 1) * 100).toFixed(1),
			ca,
			budgetMoisCa,
			txRealBudgetCa: +(ca / budgetMoisCa * 100).toFixed(1),
			cumulBudget,
			cumulRealise,
			txRealPrev: +(cumulRealise / cumulBudget * 100).toFixed(1),
			poids: 0,
			fournisseurs
		});
	}
	const totCA = list.reduce((s, x) => s + x.ca, 0);
	for (const p of list) p.poids = +(p.ca / totCA * 100).toFixed(2);
	return list;
}
var DELETED_KEY = "obco_deleted_products";
function loadDeleted() {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		const arr = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
		return new Set(arr);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveDeleted(deletedIds) {
	if (typeof window === "undefined") return;
	localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds]));
}
function loadOverrides() {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}");
	} catch {
		return {};
	}
}
function saveOverrides(o) {
	if (typeof window !== "undefined") localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
}
function loadCustom() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
	} catch {
		return [];
	}
}
function saveCustom(list) {
	if (typeof window !== "undefined") {
		localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
		console.log(`✅ ${list.length} produits sauvegardés, dispatch événement`);
		window.dispatchEvent(new Event("obco:products"));
	}
}
function getPanoramicProducts() {
	if (!_products) if (API_ENABLED) _products = [];
	else _products = seedPanoramic();
	const overrides = loadOverrides();
	const deletedIds = loadDeleted();
	const merged = _products.filter((p) => !deletedIds.has(p.id)).map((p) => {
		const o = overrides[p.id];
		return o ? {
			...p,
			...o
		} : p;
	});
	const allCustom = loadCustom();
	const total = [...allCustom.filter((p) => !deletedIds.has(p.id)), ...merged];
	console.log(`📦 getPanoramicProducts: ${allCustom.length} custom, ${deletedIds.size} supprimés → ${total.length} total`);
	return total;
}
function getProductLaboratories() {
	return Array.from(/* @__PURE__ */ new Set([...getLaboratoires().map((l) => l.name), ...getPanoramicProducts().map((p) => p.laboratory)])).sort();
}
function addCustomProduct(input) {
	const id = `PRC-${Date.now().toString(36).toUpperCase()}`;
	const fournisseurs = {};
	for (const s of SUPPLIERS) fournisseurs[s] = {
		prixUnitaire: 0,
		ventes: 0,
		stocks: 0,
		commandes: 0
	};
	const obj = input.objectives ?? {};
	const budgetMois = Object.values(obj).reduce((a, b) => a + b, 0) || 1e3;
	const product = {
		id,
		cip: input.cip && input.cip.trim() ? input.cip.trim() : `NOCIP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
		name: input.name,
		laboratory: input.laboratory,
		type: input.type,
		productStatus: input.productStatus,
		ventes: 0,
		budgetMois,
		tauxReal: 0,
		ventesAn1: 0,
		tauxEvol: 0,
		ca: 0,
		budgetMoisCa: budgetMois * 10,
		txRealBudgetCa: 0,
		cumulBudget: budgetMois * 12,
		cumulRealise: 0,
		txRealPrev: 0,
		poids: 0,
		fournisseurs
	};
	saveCustom([product, ...loadCustom()]);
	if (input.pricing) setProductPricing(id, input.pricing);
	if (input.objectives) setProductObjectives(id, input.objectives);
	syncCreate("/api/products", {
		cip: product.cip,
		name: input.name,
		category: input.type,
		laboratory: input.laboratory
	});
	return product;
}
function updateProduct(id, patch) {
	if (id.startsWith("PRC-")) saveCustom(loadCustom().map((p) => p.id === id ? {
		...p,
		...patch
	} : p));
	else {
		const o = loadOverrides();
		o[id] = {
			...o[id] || {},
			...patch
		};
		saveOverrides(o);
		if (typeof window !== "undefined") window.dispatchEvent(new Event("obco:products"));
	}
	const apiPatch = {};
	if (patch.name) apiPatch.name = patch.name;
	if (patch.laboratory) apiPatch.laboratory = patch.laboratory;
	if (patch.type) apiPatch.category = patch.type;
	if (Object.keys(apiPatch).length) syncUpdate(`/api/products/${id}`, apiPatch);
}
function deleteProduct(id) {
	console.log(`🗑️ Suppression produit ${id}`);
	const deletedIds = loadDeleted();
	deletedIds.add(id);
	saveDeleted(deletedIds);
	console.log(`   - Ajouté à deletedIds (${deletedIds.size} supprimés au total)`);
	const customBefore = loadCustom().length;
	const filtered = loadCustom().filter((p) => p.id !== id);
	console.log(`   - Produits custom: ${customBefore} → ${filtered.length}`);
	saveCustom(filtered);
	const o = loadOverrides();
	delete o[id];
	saveOverrides(o);
	syncDelete(`/api/products/${id}`);
}
//#endregion
export { setAgencyStatus as A, updateProduct as B, getProductObjectives as C, salesByUnit as D, salesByRevenue as E, stockSituation as F, updateAgency as I, updateCountry as L, setLaboratoireStatus as M, setProductObjectives as N, salesObjectivesANF as O, setProductPricing as P, updateGrossiste as R, getProductLaboratories as S, reloadCountries as T, evolutionByUnits as _, addAgency as a, getLaboratoires as b, addGrossiste as c, deleteCountry as d, deleteGrossiste as f, evolutionByRevenue as g, ensureCountriesLoaded as h, SUPPLIERS as i, setGrossisteStatus as j, salesObjectivesByCountry as k, addLaboratoire as l, deleteProduct as m, MONTHS as n, addCountry as o, deleteLaboratoire as p, PRODUCT_TYPES as r, addCustomProduct as s, COUNTRIES as t, deleteAgency as u, getAgencies as v, getProductPricing as w, getPanoramicProducts as x, getGrossistes as y, updateLaboratoire as z };
