import { o as getToken, r as api, t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { t as COUNTRIES } from "./agencies-BIm1ZU-s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hydrate-B-qUdCQe.js
var _hydrating = false;
var _done = false;
function dispatch(name) {
	if (typeof window !== "undefined") window.dispatchEvent(new Event(name));
}
async function hydrateFromApi() {
	if (!API_ENABLED || _hydrating || _done) return;
	if (typeof window === "undefined") return;
	if (!getToken()) return;
	_hydrating = true;
	try {
		const [countries, agencies, wholesalers, labs, products, prices, objectives] = await Promise.all([
			api("/api/countries").catch(() => []),
			api("/api/agencies").catch(() => []),
			api("/api/wholesalers").catch(() => []),
			api("/api/laboratories").catch(() => []),
			api("/api/products").catch(() => []),
			api("/api/prices").catch(() => []),
			api("/api/objectives").catch(() => [])
		]);
		if (countries.length) {
			COUNTRIES.splice(0, COUNTRIES.length, ...countries);
			localStorage.setItem("obco_countries_v1", JSON.stringify(countries));
			dispatch("obco:countries");
		}
		if (agencies.length) {
			const mapped = agencies.map((a) => ({
				id: a.id,
				name: a.name,
				country: a.countryCode,
				email: a.email,
				manager: a.manager,
				city: a.city,
				createdAt: a.createdAt.slice(0, 10),
				status: a.status || "active"
			}));
			localStorage.setItem("obco_agencies_v2", JSON.stringify(mapped));
			dispatch("obco:agencies");
		}
		if (wholesalers.length) {
			const mapped = wholesalers.map((w) => ({
				id: w.id,
				partenaire: w.name,
				type: "Grossiste",
				country: w.countryCode,
				email: w.email || "",
				status: w.status || "active"
			}));
			localStorage.setItem("obco_grossistes_v2", JSON.stringify(mapped));
			dispatch("obco:gros");
		}
		if (labs.length) {
			const mapped = labs.map((l) => ({
				id: l.id,
				name: l.name,
				country: l.countryCode,
				contact: l.contact,
				email: l.email,
				phone: l.phone,
				address: l.address,
				createdAt: l.createdAt.slice(0, 10),
				status: l.status || "active"
			}));
			localStorage.setItem("obco_laboratoires_v2", JSON.stringify(mapped));
			dispatch("obco:labs");
		}
		if (prices.length) {
			const pmap = {};
			for (const p of prices) {
				pmap[p.productId] = pmap[p.productId] || {};
				pmap[p.productId][p.countryCode] = p.price;
			}
			localStorage.setItem("obco_prices", JSON.stringify(pmap));
			dispatch("obco:pricing");
		}
		if (objectives.length) {
			const omap = {};
			for (const o of objectives) {
				omap[o.productId] = omap[o.productId] || {};
				omap[o.productId][o.countryCode] = (omap[o.productId][o.countryCode] || 0) + o.targetUnits;
			}
			localStorage.setItem("obco_objectives", JSON.stringify(omap));
			dispatch("obco:objectives");
		}
		if (products.length) {
			const SUPPLIERS = [
				"CAMED",
				"LABOREX MALI",
				"COPHARMED",
				"UBIPHARM",
				"DPM"
			];
			const mapped = products.map((p) => {
				const fournisseurs = {};
				for (const s of SUPPLIERS) fournisseurs[s] = {
					ventes: 0,
					stocks: 0,
					commandes: 0,
					prixUnitaire: 0
				};
				return {
					id: p.id,
					cip: p.cip,
					name: p.name,
					laboratory: p.laboratory,
					type: p.category,
					productStatus: "active",
					ventes: 0,
					budgetMois: 0,
					tauxReal: 0,
					ventesAn1: 0,
					tauxEvol: 0,
					ca: 0,
					budgetMoisCa: 0,
					txRealBudgetCa: 0,
					cumulBudget: 0,
					cumulRealise: 0,
					txRealPrev: 0,
					poids: 0,
					fournisseurs
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
//#endregion
export { hydrateFromApi };
