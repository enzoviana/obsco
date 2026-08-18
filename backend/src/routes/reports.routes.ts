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
 * GET /api/reports/objectives-summary
 * Résumé complet pour le rapport objectifs : ventes + prix + objectifs
 */
reportsRouter.get("/objectives-summary", requireAuth, async (req, res) => {
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
    const salesByProduct = new Map<string, { sales: number; stock: number; orders: number }>();

    for (const data of monthlyData) {
      if (!salesByProduct.has(data.productCip)) {
        salesByProduct.set(data.productCip, { sales: 0, stock: 0, orders: 0 });
      }

      const agg = salesByProduct.get(data.productCip)!;
      agg.sales += data.sales;
      agg.stock += data.stock;
      agg.orders += data.orders;
    }

    // Déterminer le(s) code(s) pays à utiliser pour les prix et objectifs
    let targetCountryCodes: string[] = [];
    if (scope === "country" && countryCode) {
      targetCountryCodes = [countryCode as string];
    } else if (scope === "agency" && agencyId) {
      const agency = await prisma.agency.findUnique({
        where: { id: agencyId as string },
        select: { countryCode: true },
      });
      if (agency) {
        targetCountryCodes = [agency.countryCode];
      }
    } else {
      // scope === "all" : récupérer tous les pays
      const countries = await prisma.country.findMany({
        select: { code: true },
      });
      targetCountryCodes = countries.map(c => c.code);
    }

    // Récupérer les prix des produits
    const prices = await prisma.productPrice.findMany({
      where: {
        countryCode: { in: targetCountryCodes },
      },
      include: {
        product: {
          select: { cip: true },
        },
      },
    });

    // Organiser les prix par CIP et pays
    const pricesByCipAndCountry = new Map<string, Map<string, number>>();
    for (const price of prices) {
      const cip = price.product.cip;
      if (!pricesByCipAndCountry.has(cip)) {
        pricesByCipAndCountry.set(cip, new Map());
      }
      pricesByCipAndCountry.get(cip)!.set(price.countryCode, price.price);
    }

    // Récupérer les objectifs des produits pour le mois demandé
    const objectives = await prisma.productObjective.findMany({
      where: {
        countryCode: { in: targetCountryCodes },
        year: y,
        month: m,
      },
      include: {
        product: {
          select: { cip: true },
        },
      },
    });

    // Récupérer aussi les objectifs des mois suivants (fallback si mois actuel = 0)
    const futureObjectives = await prisma.productObjective.findMany({
      where: {
        countryCode: { in: targetCountryCodes },
        year: y,
        month: { gt: m }, // Mois > mois actuel
      },
      include: {
        product: {
          select: { cip: true },
        },
      },
    });

    // Organiser les objectifs par CIP et pays
    const objectivesByCipAndCountry = new Map<string, Map<string, { targetUnits: number; targetCA: number }>>();
    for (const objective of objectives) {
      const cip = objective.product.cip;
      if (!objectivesByCipAndCountry.has(cip)) {
        objectivesByCipAndCountry.set(cip, new Map());
      }
      objectivesByCipAndCountry.get(cip)!.set(objective.countryCode, {
        targetUnits: objective.targetUnits,
        targetCA: objective.targetCA,
      });
    }

    // Organiser les objectifs futurs par CIP, pays et mois
    const futureObjectivesByCipCountryMonth = new Map<string, Map<string, Map<number, { targetUnits: number; targetCA: number }>>>();
    for (const objective of futureObjectives) {
      const cip = objective.product.cip;
      if (!futureObjectivesByCipCountryMonth.has(cip)) {
        futureObjectivesByCipCountryMonth.set(cip, new Map());
      }
      if (!futureObjectivesByCipCountryMonth.get(cip)!.has(objective.countryCode)) {
        futureObjectivesByCipCountryMonth.get(cip)!.set(objective.countryCode, new Map());
      }
      futureObjectivesByCipCountryMonth.get(cip)!.get(objective.countryCode)!.set(objective.month, {
        targetUnits: objective.targetUnits,
        targetCA: objective.targetCA,
      });
    }

    console.log("📊 [objectives-summary] Objectifs récupérés:", {
      year: y,
      month: m,
      scope,
      targetCountryCodes,
      totalObjectives: objectives.length,
      totalFutureObjectives: futureObjectives.length,
      uniqueCips: objectivesByCipAndCountry.size,
      sampleObjectives: Array.from(objectivesByCipAndCountry.entries()).slice(0, 3).map(([cip, countries]) => ({
        cip,
        countries: Array.from(countries.entries()).map(([code, obj]) => ({ code, ...obj })),
      })),
    });

    // Construire la réponse finale
    const result: Record<string, any> = {};

    // Récupérer tous les CIPs (union des ventes + objectifs + prix + objectifs futurs)
    const allCips = new Set<string>();
    for (const cip of salesByProduct.keys()) allCips.add(cip);
    for (const cip of objectivesByCipAndCountry.keys()) allCips.add(cip);
    for (const cip of pricesByCipAndCountry.keys()) allCips.add(cip);
    for (const cip of futureObjectivesByCipCountryMonth.keys()) allCips.add(cip);

    // Boucler sur tous les CIPs, pas seulement ceux avec ventes
    for (const cip of allCips) {
      const salesData = salesByProduct.get(cip) || { sales: 0, stock: 0, orders: 0 };

      // Récupérer le prix (moyenne si plusieurs pays)
      let price = 0;
      const cipPrices = pricesByCipAndCountry.get(cip);
      if (cipPrices && cipPrices.size > 0) {
        const pricesArray = Array.from(cipPrices.values());
        price = pricesArray.reduce((sum, p) => sum + p, 0) / pricesArray.length;
      }

      // Récupérer les objectifs (somme si plusieurs pays)
      let targetUnits = 0;
      let targetCA = 0;
      const cipObjectives = objectivesByCipAndCountry.get(cip);
      if (cipObjectives && cipObjectives.size > 0) {
        for (const [countryCode, obj] of cipObjectives.entries()) {
          // Si objectif actuel = 0, chercher dans les mois futurs
          if (obj.targetUnits === 0) {
            const futureObjsForCountry = futureObjectivesByCipCountryMonth.get(cip)?.get(countryCode);
            if (futureObjsForCountry) {
              // Chercher le premier mois futur avec un objectif > 0
              for (let futureMonth = m + 1; futureMonth <= 12; futureMonth++) {
                const futureObj = futureObjsForCountry.get(futureMonth);
                if (futureObj && futureObj.targetUnits > 0) {
                  targetUnits += futureObj.targetUnits;
                  targetCA += futureObj.targetCA;
                  console.log(`🔄 [Fallback] Mois ${m} → Mois ${futureMonth} pour CIP ${cip} pays ${countryCode} (${futureObj.targetUnits} unités)`);
                  break; // Utiliser le premier mois futur trouvé
                }
              }
            }
          } else {
            // Objectif actuel > 0, l'utiliser
            targetUnits += obj.targetUnits;
            targetCA += obj.targetCA;
          }
        }
      } else {
        // Pas d'objectif pour le mois actuel, chercher dans les mois futurs
        const futureObjs = futureObjectivesByCipCountryMonth.get(cip);
        if (futureObjs) {
          for (const [countryCode, monthsMap] of futureObjs.entries()) {
            // Chercher le premier mois futur avec un objectif > 0
            for (let futureMonth = m + 1; futureMonth <= 12; futureMonth++) {
              const futureObj = monthsMap.get(futureMonth);
              if (futureObj && futureObj.targetUnits > 0) {
                targetUnits += futureObj.targetUnits;
                targetCA += futureObj.targetCA;
                console.log(`🔄 [Fallback] Aucun objectif pour mois ${m} → Mois ${futureMonth} pour CIP ${cip} pays ${countryCode} (${futureObj.targetUnits} unités)`);
                break; // Utiliser le premier mois futur trouvé
              }
            }
          }
        }
      }

      result[cip] = {
        sales: salesData.sales,
        stock: salesData.stock,
        orders: salesData.orders,
        price,
        targetUnits,
        targetCA,
      };
    }

    console.log("✅ [objectives-summary] Résultat final:", {
      totalCips: Object.keys(result).length,
      cipsWithObjectives: Object.values(result).filter((r: any) => r.targetUnits > 0).length,
      cipsWithSales: Object.values(result).filter((r: any) => r.sales > 0).length,
      sampleResult: Object.entries(result).slice(0, 3).map(([cip, data]) => ({ cip, ...data })),
    });

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération objectives-summary:", error);
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
