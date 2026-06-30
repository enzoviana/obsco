import { Router } from "express";
import { requireAuth } from "../auth.js";
import { prisma } from "../db.js";

export const reportsRouter = Router();

/**
 * Helper: Récupérer les IDs d'agences selon le scope
 */
async function getAgencyIds(scope: string, countryCode?: string, agencyId?: string): Promise<string[]> {
  if (scope === "agency" && agencyId) {
    return [agencyId];
  }

  if (scope === "country" && countryCode) {
    const agencies = await prisma.agency.findMany({
      where: { countryCode },
      select: { id: true },
    });
    return agencies.map(a => a.id);
  }

  // scope === "all"
  const agencies = await prisma.agency.findMany({
    select: { id: true },
  });
  return agencies.map(a => a.id);
}

/**
 * GET /api/reports/monthly-summary
 * Résumé mensuel pour un mois donné
 * Retourne les totaux par produit (ventes, stocks, commandes) agrégés
 */
reportsRouter.get("/monthly-summary", requireAuth, async (req, res) => {
  try {
    const { year, month, scope, countryCode, agencyId } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Année et mois requis" });
    }

    const y = parseInt(year as string);
    const m = parseInt(month as string);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({ error: "Année ou mois invalide" });
    }

    // Récupérer les IDs d'agences selon le scope
    const agencyIds = await getAgencyIds(
      scope as string || "all",
      countryCode as string,
      agencyId as string
    );

    // Récupérer toutes les données mensuelles
    const monthlyData = await prisma.monthlyData.findMany({
      where: {
        agencyId: { in: agencyIds },
        year: y,
        month: m,
      },
    });

    // Agréger par produit
    const byProduct = new Map<string, { sales: number; stock: number; orders: number }>();

    for (const data of monthlyData) {
      if (!byProduct.has(data.productCip)) {
        byProduct.set(data.productCip, { sales: 0, stock: 0, orders: 0 });
      }

      const agg = byProduct.get(data.productCip)!;
      agg.sales += data.sales;
      agg.stock += data.stock;
      agg.orders += data.orders;
    }

    // Convertir en objet
    const result: Record<string, { sales: number; stock: number; orders: number }> = {};
    for (const [cip, data] of byProduct.entries()) {
      result[cip] = data;
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération monthly-summary:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * GET /api/reports/evolution
 * Évolution sur 12 mois (année complète)
 * Retourne les ventes par mois pour chaque produit
 */
reportsRouter.get("/evolution", requireAuth, async (req, res) => {
  try {
    const { year, scope, countryCode, agencyId } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Année requise" });
    }

    const y = parseInt(year as string);
    if (isNaN(y)) {
      return res.status(400).json({ error: "Année invalide" });
    }

    const agencyIds = await getAgencyIds(
      scope as string || "all",
      countryCode as string,
      agencyId as string
    );

    // Récupérer toutes les données pour l'année
    const monthlyData = await prisma.monthlyData.findMany({
      where: {
        agencyId: { in: agencyIds },
        year: y,
      },
      orderBy: [{ month: "asc" }],
    });

    // Structure: { productCip: { month: { sales, stock, orders } } }
    const byProduct = new Map<string, Map<number, { sales: number; stock: number; orders: number }>>();

    for (const data of monthlyData) {
      if (!byProduct.has(data.productCip)) {
        byProduct.set(data.productCip, new Map());
      }

      const productMap = byProduct.get(data.productCip)!;

      if (!productMap.has(data.month)) {
        productMap.set(data.month, { sales: 0, stock: 0, orders: 0 });
      }

      const monthData = productMap.get(data.month)!;
      monthData.sales += data.sales;
      monthData.stock += data.stock;
      monthData.orders += data.orders;
    }

    // Convertir en format JSON
    const result: Record<string, Record<number, { sales: number; stock: number; orders: number }>> = {};

    for (const [cip, monthMap] of byProduct.entries()) {
      result[cip] = {};
      for (const [month, data] of monthMap.entries()) {
        result[cip][month] = data;
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération evolution:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * GET /api/reports/by-country
 * Données agrégées par pays pour un mois donné
 * Retourne les totaux par produit et par pays
 */
reportsRouter.get("/by-country", requireAuth, async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Année et mois requis" });
    }

    const y = parseInt(year as string);
    const m = parseInt(month as string);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({ error: "Année ou mois invalide" });
    }

    // Récupérer toutes les données mensuelles avec les agences
    const monthlyData = await prisma.monthlyData.findMany({
      where: {
        year: y,
        month: m,
      },
    });

    // Récupérer les agences pour avoir le pays
    const agencyIds = [...new Set(monthlyData.map(d => d.agencyId))];
    const agencies = await prisma.agency.findMany({
      where: { id: { in: agencyIds } },
      select: { id: true, countryCode: true },
    });

    const agencyCountryMap = new Map<string, string>();
    for (const agency of agencies) {
      agencyCountryMap.set(agency.id, agency.countryCode);
    }

    // Structure: { productCip: { countryCode: { sales, stock, orders } } }
    const byProductAndCountry = new Map<string, Map<string, { sales: number; stock: number; orders: number }>>();

    for (const data of monthlyData) {
      const countryCode = agencyCountryMap.get(data.agencyId);
      if (!countryCode) continue;

      if (!byProductAndCountry.has(data.productCip)) {
        byProductAndCountry.set(data.productCip, new Map());
      }

      const productMap = byProductAndCountry.get(data.productCip)!;

      if (!productMap.has(countryCode)) {
        productMap.set(countryCode, { sales: 0, stock: 0, orders: 0 });
      }

      const countryData = productMap.get(countryCode)!;
      countryData.sales += data.sales;
      countryData.stock += data.stock;
      countryData.orders += data.orders;
    }

    // Convertir en JSON
    const result: Record<string, Record<string, { sales: number; stock: number; orders: number }>> = {};

    for (const [cip, countryMap] of byProductAndCountry.entries()) {
      result[cip] = {};
      for (const [countryCode, data] of countryMap.entries()) {
        result[cip][countryCode] = data;
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération by-country:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * GET /api/reports/panoramic
 * Vue panoramique pour un produit : évolution par mois et par pays
 */
reportsRouter.get("/panoramic", requireAuth, async (req, res) => {
  try {
    const { year, productCip } = req.query;

    if (!year || !productCip) {
      return res.status(400).json({ error: "Année et CIP produit requis" });
    }

    const y = parseInt(year as string);
    if (isNaN(y)) {
      return res.status(400).json({ error: "Année invalide" });
    }

    // Récupérer toutes les données pour ce produit sur l'année
    const monthlyData = await prisma.monthlyData.findMany({
      where: {
        productCip: productCip as string,
        year: y,
      },
      orderBy: [{ month: "asc" }],
    });

    // Récupérer les agences pour avoir les pays
    const agencyIds = [...new Set(monthlyData.map(d => d.agencyId))];
    const agencies = await prisma.agency.findMany({
      where: { id: { in: agencyIds } },
      select: { id: true, countryCode: true },
    });

    const agencyCountryMap = new Map<string, string>();
    for (const agency of agencies) {
      agencyCountryMap.set(agency.id, agency.countryCode);
    }

    // Structure: { countryCode: { month: { sales, stock, orders } } }
    const byCountryAndMonth = new Map<string, Map<number, { sales: number; stock: number; orders: number }>>();

    for (const data of monthlyData) {
      const countryCode = agencyCountryMap.get(data.agencyId);
      if (!countryCode) continue;

      if (!byCountryAndMonth.has(countryCode)) {
        byCountryAndMonth.set(countryCode, new Map());
      }

      const countryMap = byCountryAndMonth.get(countryCode)!;

      if (!countryMap.has(data.month)) {
        countryMap.set(data.month, { sales: 0, stock: 0, orders: 0 });
      }

      const monthData = countryMap.get(data.month)!;
      monthData.sales += data.sales;
      monthData.stock += data.stock;
      monthData.orders += data.orders;
    }

    // Convertir en JSON
    const result: Record<string, Record<number, { sales: number; stock: number; orders: number }>> = {};

    for (const [countryCode, monthMap] of byCountryAndMonth.entries()) {
      result[countryCode] = {};
      for (const [month, data] of monthMap.entries()) {
        result[countryCode][month] = data;
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération panoramic:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
