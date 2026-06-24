export const pharmacy = {
  name: "Pharmacie Centrale",
  city: "Paris 11e",
  stockLevel: 87,
  totalSkus: 1248,
  lowStockAlerts: 12,
  recentImports: 4,
  monthlyRevenue: 48230,
};

export const stockTrend = [
  { day: "Mon", stock: 82, sales: 42 },
  { day: "Tue", stock: 85, sales: 38 },
  { day: "Wed", stock: 79, sales: 51 },
  { day: "Thu", stock: 88, sales: 47 },
  { day: "Fri", stock: 84, sales: 62 },
  { day: "Sat", stock: 91, sales: 55 },
  { day: "Sun", stock: 87, sales: 33 },
];

export const lowStockItems = [
  { sku: "MED-0421", name: "Paracétamol 1000mg", stock: 8, threshold: 50, status: "critical" as const },
  { sku: "MED-0883", name: "Amoxicilline 500mg", stock: 14, threshold: 40, status: "low" as const },
  { sku: "MED-1204", name: "Ibuprofène 400mg", stock: 22, threshold: 60, status: "low" as const },
  { sku: "MED-0712", name: "Doliprane Sirop", stock: 5, threshold: 30, status: "critical" as const },
  { sku: "MED-1991", name: "Spasfon 80mg", stock: 18, threshold: 45, status: "low" as const },
];

export const recentImports = [
  { id: "IMP-2041", date: "2026-06-18", items: 142, status: "completed" as const },
  { id: "IMP-2040", date: "2026-06-15", items: 89, status: "completed" as const },
  { id: "IMP-2039", date: "2026-06-12", items: 67, status: "processing" as const },
  { id: "IMP-2038", date: "2026-06-09", items: 215, status: "completed" as const },
];

export const allPharmacies = [
  { id: 1, name: "Pharmacie Centrale", city: "Paris 11e", inventory: 312400, alerts: 12, status: "active" as const, sync: "2 min ago" },
  { id: 2, name: "Pharmacie du Marché", city: "Lyon", inventory: 198200, alerts: 4, status: "active" as const, sync: "5 min ago" },
  { id: 3, name: "Pharmacie Saint-Michel", city: "Bordeaux", inventory: 421800, alerts: 23, status: "warning" as const, sync: "1 min ago" },
  { id: 4, name: "Pharmacie de la Gare", city: "Marseille", inventory: 156700, alerts: 7, status: "active" as const, sync: "8 min ago" },
  { id: 5, name: "Pharmacie Lafayette", city: "Toulouse", inventory: 289300, alerts: 9, status: "active" as const, sync: "3 min ago" },
  { id: 6, name: "Pharmacie du Port", city: "Nice", inventory: 178900, alerts: 15, status: "warning" as const, sync: "12 min ago" },
  { id: 7, name: "Pharmacie Moderne", city: "Nantes", inventory: 245600, alerts: 6, status: "active" as const, sync: "4 min ago" },
  { id: 8, name: "Pharmacie Centrale Sud", city: "Montpellier", inventory: 167400, alerts: 3, status: "active" as const, sync: "6 min ago" },
  { id: 9, name: "Pharmacie de l'Étoile", city: "Strasbourg", inventory: 203100, alerts: 11, status: "active" as const, sync: "9 min ago" },
  { id: 10, name: "Pharmacie Notre-Dame", city: "Lille", inventory: 187200, alerts: 18, status: "warning" as const, sync: "15 min ago" },
  { id: 11, name: "Pharmacie Beauséjour", city: "Rennes", inventory: 142800, alerts: 5, status: "active" as const, sync: "7 min ago" },
  { id: 12, name: "Pharmacie Royale", city: "Reims", inventory: 219400, alerts: 8, status: "active" as const, sync: "11 min ago" },
  { id: 13, name: "Pharmacie de la Place", city: "Le Havre", inventory: 134500, alerts: 2, status: "active" as const, sync: "14 min ago" },
  { id: 14, name: "Pharmacie Victor Hugo", city: "Dijon", inventory: 198700, alerts: 14, status: "warning" as const, sync: "18 min ago" },
  { id: 15, name: "Pharmacie des Halles", city: "Angers", inventory: 176300, alerts: 10, status: "active" as const, sync: "22 min ago" },
];

export const globalTrend = [
  { month: "Jan", inventory: 2.8, alerts: 142 },
  { month: "Feb", inventory: 2.9, alerts: 128 },
  { month: "Mar", inventory: 3.1, alerts: 156 },
  { month: "Apr", inventory: 3.0, alerts: 134 },
  { month: "May", inventory: 3.2, alerts: 119 },
  { month: "Jun", inventory: 3.3, alerts: 147 },
];

export const totals = {
  pharmacies: allPharmacies.length,
  inventoryValue: allPharmacies.reduce((s, p) => s + p.inventory, 0),
  alerts: allPharmacies.reduce((s, p) => s + p.alerts, 0),
  imports: 87,
};
