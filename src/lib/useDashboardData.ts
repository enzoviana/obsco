// Hook pour récupérer les données du dashboard en fonction du mode (Live vs Demo)
import { useEffect, useState } from "react";
import { API_ENABLED } from "./api";
import { getAgencies } from "./agencies";
import { getAllProducts } from "./products";
// Import des données mockées uniquement pour le mode démo
import * as mockData from "./mock-data";

export type DashboardData = {
  // Pour PharmacyView
  pharmacy: typeof mockData.pharmacy;
  stockTrend: typeof mockData.stockTrend;
  lowStockItems: typeof mockData.lowStockItems;
  recentImports: typeof mockData.recentImports;

  // Pour AdminView
  allPharmacies: typeof mockData.allPharmacies;
  totals: typeof mockData.totals;
  globalTrend: typeof mockData.globalTrend;
};

function getEmptyDashboardData(): DashboardData {
  return {
    pharmacy: {
      id: 0,
      name: "Aucune agence",
      city: "",
      stockLevel: 0,
      totalSkus: 0,
      lowStockAlerts: 0,
      recentImports: 0,
      monthlyRevenue: 0,
    },
    stockTrend: [],
    lowStockItems: [],
    recentImports: [],
    allPharmacies: [],
    totals: {
      pharmacies: 0,
      inventoryValue: 0,
      alerts: 0,
      imports: 0,
    },
    globalTrend: [],
  };
}

function getLiveDataFromLocalStorage(): DashboardData {
  // Récupérer les agences depuis localStorage
  const agencies = getAgencies();
  const products = getAllProducts();

  // Statistiques des produits
  const lowStock = products.filter(p => p.status === "critical" || p.status === "low" || p.status === "rupture");
  const critical = products.filter(p => p.status === "critical" || p.status === "rupture");

  // Pour PharmacyView - première agence de l'utilisateur
  const firstAgency = agencies[0];

  return {
    pharmacy: firstAgency ? {
      id: parseInt(firstAgency.id) || 0,
      name: firstAgency.name,
      city: firstAgency.city,
      stockLevel: products.length > 0 ? Math.round(((products.length - critical.length) / products.length) * 100) : 0,
      totalSkus: products.length,
      lowStockAlerts: lowStock.length,
      recentImports: 0,
      monthlyRevenue: 0,
    } : getEmptyDashboardData().pharmacy,

    stockTrend: [], // Pas de données de tendance en Live mode (nécessite historique)
    lowStockItems: lowStock.slice(0, 6).map(p => ({
      sku: p.id,
      name: p.name,
      stock: p.stock,
      threshold: p.threshold,
      status: p.status,
    })),
    recentImports: [], // Pas d'imports en Live mode par défaut

    // Pour AdminView
    allPharmacies: agencies.map((a, idx) => ({
      id: idx + 1,
      name: a.name,
      city: a.city,
      inventory: 0, // Nécessite calcul depuis les stocks
      alerts: 0,
      sync: "jamais",
      status: a.status,
    })),
    totals: {
      pharmacies: agencies.length,
      inventoryValue: 0,
      alerts: critical.length,
      imports: 0,
    },
    globalTrend: [],
  };
}

/**
 * Hook pour récupérer les données du dashboard.
 * - En mode Demo (API_ENABLED = false) : retourne les données mockées
 * - En mode Live (API_ENABLED = true) : retourne les données du localStorage
 */
export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>(() => {
    if (!API_ENABLED) {
      // Mode Demo : utiliser les mocks
      return {
        pharmacy: mockData.pharmacy,
        stockTrend: mockData.stockTrend,
        lowStockItems: mockData.lowStockItems,
        recentImports: mockData.recentImports,
        allPharmacies: mockData.allPharmacies,
        totals: mockData.totals,
        globalTrend: mockData.globalTrend,
      };
    } else {
      // Mode Live : utiliser localStorage (vide en première utilisation)
      return getLiveDataFromLocalStorage();
    }
  });

  useEffect(() => {
    if (!API_ENABLED) return; // Pas besoin d'écouter en mode Demo

    // Fonction pour recharger les données depuis localStorage
    const reloadData = () => {
      setData(getLiveDataFromLocalStorage());
    };

    // Écouter les événements de mise à jour des données
    window.addEventListener("obco:agencies", reloadData);
    window.addEventListener("obco:products", reloadData);
    window.addEventListener("obco:labs", reloadData);
    window.addEventListener("obco:gros", reloadData);
    window.addEventListener("obco:countries", reloadData);
    window.addEventListener("obco:pricing", reloadData);
    window.addEventListener("obco:objectives", reloadData);

    return () => {
      window.removeEventListener("obco:agencies", reloadData);
      window.removeEventListener("obco:products", reloadData);
      window.removeEventListener("obco:labs", reloadData);
      window.removeEventListener("obco:gros", reloadData);
      window.removeEventListener("obco:countries", reloadData);
      window.removeEventListener("obco:pricing", reloadData);
      window.removeEventListener("obco:objectives", reloadData);
    };
  }, []);

  return data;
}
