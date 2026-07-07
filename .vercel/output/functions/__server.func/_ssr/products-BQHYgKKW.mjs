import { t as API_ENABLED } from "./api-DFrqE02A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BQHYgKKW.js
var CATEGORIES = [
	"Antalgiques",
	"Antibiotiques",
	"Anti-inflammatoires",
	"Dermatologie",
	"Cardio-vasculaire",
	"Gastro-entérologie",
	"Ophtalmologie",
	"Pédiatrie",
	"Vitamines & Minéraux",
	"Hygiène",
	"Phytothérapie",
	"Homéopathie",
	"Dispositifs médicaux",
	"Cosmétique"
];
var LABS = [
	"Sanofi",
	"Pfizer",
	"Novartis",
	"Roche",
	"Bayer",
	"Servier",
	"Pierre Fabre",
	"Boiron",
	"Biogaran",
	"Mylan",
	"Teva",
	"Arrow",
	"EG Labo",
	"GSK"
];
var ROOTS = [
	"Paracétamol",
	"Ibuprofène",
	"Amoxicilline",
	"Doliprane",
	"Spasfon",
	"Smecta",
	"Aspirine",
	"Efferalgan",
	"Voltarène",
	"Ventoline",
	"Levothyrox",
	"Daflon",
	"Imodium",
	"Gaviscon",
	"Maalox",
	"Cétirizine",
	"Lorazépam",
	"Oméprazole",
	"Tramadol",
	"Codéine",
	"Lidocaïne",
	"Bétadine",
	"Biafine",
	"Mercurochrome",
	"Vitamine C",
	"Vitamine D",
	"Magnésium",
	"Fer",
	"Zinc",
	"Oméga 3"
];
var DOSAGES = [
	"100mg",
	"250mg",
	"500mg",
	"1000mg",
	"5mg",
	"10mg",
	"20mg",
	"50mg",
	"200UI",
	"5%",
	"Sirop",
	"Gélule",
	"Comprimé",
	"Sachet"
];
var FORMS = [
	"bte/20",
	"bte/30",
	"bte/16",
	"fl/200ml",
	"tube/50g",
	"bte/12",
	"bte/8"
];
function rand(seed) {
	let s = seed >>> 0;
	return () => {
		s = s * 1664525 + 1013904223 >>> 0;
		return s / 4294967295;
	};
}
var cache = null;
function getAllProducts() {
	if (cache) return cache;
	if (API_ENABLED) {
		cache = [];
		return cache;
	}
	const r = rand(42);
	const list = [];
	for (let i = 0; i < 5240; i++) {
		const root = ROOTS[Math.floor(r() * ROOTS.length)];
		const dose = DOSAGES[Math.floor(r() * DOSAGES.length)];
		const form = FORMS[Math.floor(r() * FORMS.length)];
		const cat = CATEGORIES[Math.floor(r() * CATEGORIES.length)];
		const lab = LABS[Math.floor(r() * LABS.length)];
		const threshold = 20 + Math.floor(r() * 80);
		const stock = Math.floor(r() * 320);
		const price = +(2 + r() * 78).toFixed(2);
		const year = 2026 + Math.floor(r() * 3);
		const month = String(1 + Math.floor(r() * 12)).padStart(2, "0");
		let status = "ok";
		if (stock === 0) status = "rupture";
		else if (stock < threshold * .4) status = "critical";
		else if (stock < threshold) status = "low";
		list.push({
			id: `P${String(i + 1).padStart(5, "0")}`,
			cip: String(34009e8 + Math.floor(r() * 999999999)),
			name: `${root} ${dose} ${form}`,
			category: cat,
			laboratory: lab,
			stock,
			threshold,
			price,
			expiry: `${year}-${month}`,
			status
		});
	}
	cache = list;
	return list;
}
function productStats() {
	const p = getAllProducts();
	return {
		total: p.length,
		value: p.reduce((s, x) => s + x.stock * x.price, 0),
		lowStock: p.filter((x) => x.status === "low" || x.status === "critical").length,
		ruptures: p.filter((x) => x.status === "rupture").length
	};
}
//#endregion
export { productStats as n, getAllProducts as t };
