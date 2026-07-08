import { Router } from "express";
import { requireAuth, requireRole } from "../auth.js";
import { prisma } from "../db.js";
import { z } from "zod";

export const importRouter = Router();

// Schema de validation pour les données d'import
const ImportDataSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
  data: z.array(
    z.object({
      productCip: z.string(),
      productName: z.string(),
      suppliers: z.array(
        z.object({
          wholesalerId: z.string(),
          wholesalerName: z.string(),
          sales: z.number().int().min(0),
          stock: z.number().int().min(0),
          orders: z.number().int().min(0),
        })
      ),
    })
  ),
});

/**
 * POST /api/import/monthly
 * Importer les données mensuelles d'une agence
 */
importRouter.post("/monthly", requireAuth, requireRole("agence"), async (req, res) => {
  try {
    const user = req.user!;

    // Vérifier que l'utilisateur est bien associé à une agence
    if (!user.agencyId) {
      return res.status(403).json({ error: "Vous devez être associé à une agence" });
    }

    // Valider les données
    const parsed = ImportDataSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.errors });
    }

    const { year, month, data } = parsed.data;

    // Créer ou mettre à jour les données dans la base de données
    const operations = [];

    for (const productData of data) {
      for (const supplier of productData.suppliers) {
        // Vérifier que le wholesaler existe
        const wholesaler = await prisma.wholesaler.findFirst({
          where: {
            id: supplier.wholesalerId,
          },
        });

        if (!wholesaler) {
          console.warn(`Wholesaler ${supplier.wholesalerId} non trouvé, ignoré`);
          continue;
        }

        // Upsert (créer ou mettre à jour) les données mensuelles
        operations.push(
          prisma.monthlyData.upsert({
            where: {
              agencyId_productCip_wholesalerId_year_month: {
                agencyId: user.agencyId,
                productCip: productData.productCip,
                wholesalerId: supplier.wholesalerId,
                year,
                month,
              },
            },
            create: {
              agencyId: user.agencyId,
              productCip: productData.productCip,
              wholesalerId: supplier.wholesalerId,
              year,
              month,
              sales: supplier.sales,
              stock: supplier.stock,
              orders: supplier.orders,
            },
            update: {
              sales: supplier.sales,
              stock: supplier.stock,
              orders: supplier.orders,
              updatedAt: new Date(),
            },
          })
        );
      }
    }

    // Exécuter toutes les opérations dans une transaction
    const results = await prisma.$transaction(operations);

    res.json({
      success: true,
      message: `${results.length} enregistrements importés avec succès`,
      count: results.length,
    });
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    res.status(500).json({ error: "Erreur lors de l'import des données" });
  }
});

/**
 * GET /api/import/monthly/:year/:month
 * Récupérer les données mensuelles importées par une agence
 */
importRouter.get("/monthly/:year/:month", requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    // Vérifier que l'utilisateur est bien associé à une agence
    if (!user.agencyId) {
      return res.status(403).json({ error: "Vous devez être associé à une agence" });
    }

    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Année ou mois invalide" });
    }

    const monthlyData = await prisma.monthlyData.findMany({
      where: {
        agencyId: user.agencyId,
        year,
        month,
      },
      orderBy: [{ productCip: "asc" }, { wholesalerId: "asc" }],
    });

    res.json(monthlyData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

/**
 * DELETE /api/import/monthly/:year/:month
 * Supprimer les données mensuelles d'une agence
 */
importRouter.delete("/monthly/:year/:month", requireAuth, requireRole("agence"), async (req, res) => {
  try {
    const user = req.user!;

    if (!user.agencyId) {
      return res.status(403).json({ error: "Vous devez être associé à une agence" });
    }

    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Année ou mois invalide" });
    }

    const result = await prisma.monthlyData.deleteMany({
      where: {
        agencyId: user.agencyId,
        year,
        month,
      },
    });

    res.json({
      success: true,
      message: `${result.count} enregistrements supprimés`,
      count: result.count,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({ error: "Erreur lors de la suppression des données" });
  }
});

/**
 * POST /api/import/products
 * Importer des produits en masse depuis un CSV
 */
importRouter.post("/products", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const ProductImportSchema = z.array(
      z.object({
        cip: z.string().optional(),
        name: z.string().min(1, "Le nom est requis"),
        laboratory: z.string().min(1, "Le laboratoire est requis"),
        category: z.string().default("Médicament"),
        basePrice: z.number().optional().default(0),
        countryCode: z.string().optional().default("FR"),
      })
    );

    // Valider les données
    const parsed = ProductImportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: parsed.error.errors
      });
    }

    const products = parsed.data;
    const results = {
      created: 0,
      updated: 0,
      laboratoriesCreated: 0,
      errors: [] as string[],
    };

    // Récupérer le premier pays disponible comme fallback
    const defaultCountry = await prisma.country.findFirst({
      orderBy: { code: "asc" },
    });

    if (!defaultCountry) {
      return res.status(500).json({
        error: "Aucun pays n'existe dans la base de données. Veuillez créer au moins un pays avant d'importer des produits.",
      });
    }

    // Créer un cache des laboratoires déjà vérifiés pour éviter les requêtes multiples
    const labCache = new Set<string>();

    // Traiter chaque produit
    for (const productData of products) {
      try {
        // Créer le laboratoire s'il n'existe pas
        if (!labCache.has(productData.laboratory)) {
          const existingLab = await prisma.laboratory.findFirst({
            where: { name: productData.laboratory },
          });

          if (!existingLab) {
            // Vérifier si le pays spécifié existe
            const countryExists = await prisma.country.findUnique({
              where: { code: productData.countryCode },
            });

            const finalCountryCode = countryExists
              ? productData.countryCode
              : defaultCountry.code;

            if (!countryExists) {
              console.log(`⚠️ Pays "${productData.countryCode}" introuvable, utilisation du pays par défaut "${defaultCountry.code}" pour le laboratoire "${productData.laboratory}"`);
            }

            // Créer le laboratoire
            await prisma.laboratory.create({
              data: {
                name: productData.laboratory,
                countryCode: finalCountryCode,
                contact: "",
                email: "",
                phone: "",
                address: "",
                status: "active",
              },
            });
            results.laboratoriesCreated++;
            console.log(`✅ Laboratoire créé: ${productData.laboratory} (pays: ${finalCountryCode})`);
          }
          labCache.add(productData.laboratory);
        }

        // Générer un CIP si non fourni
        const finalCip = productData.cip && productData.cip.trim()
          ? productData.cip.trim()
          : `NOCIP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Vérifier si un produit avec ce CIP existe déjà
        const existing = await prisma.product.findUnique({
          where: { cip: finalCip },
        });

        if (existing) {
          // Mettre à jour le produit existant
          await prisma.product.update({
            where: { cip: finalCip },
            data: {
              name: productData.name,
              laboratory: productData.laboratory,
              category: productData.category,
              basePrice: productData.basePrice,
            },
          });
          results.updated++;
        } else {
          // Créer un nouveau produit
          await prisma.product.create({
            data: {
              cip: finalCip,
              name: productData.name,
              laboratory: productData.laboratory,
              category: productData.category,
              basePrice: productData.basePrice,
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(
          `Erreur pour ${productData.name}: ${error.message || "Erreur inconnue"}`
        );
      }
    }

    res.json({
      success: true,
      message: `Import terminé: ${results.created} produits créés, ${results.updated} mis à jour, ${results.laboratoriesCreated} laboratoires créés`,
      ...results,
    });
  } catch (error) {
    console.error("Erreur lors de l'import des produits:", error);
    res.status(500).json({ error: "Erreur lors de l'import des produits" });
  }
});

/**
 * POST /api/import/sorties-locales-csv
 * Importer les sorties locales en masse depuis un CSV
 */
importRouter.post("/sorties-locales-csv", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const SortiesLocalesImportSchema = z.array(
      z.object({
        productCip: z.string().min(1, "Le code CIP est requis"),
        productName: z.string().optional(),
        wholesalerName: z.string().min(1, "Le nom du grossiste est requis"),
        sales: z.number().int().min(0).default(0),
        stock: z.number().int().min(0).default(0),
        orders: z.number().int().min(0).default(0),
        countryCode: z.string().optional().default("FR"),
        city: z.string().optional().default(""),
      })
    );

    const BodySchema = z.object({
      year: z.number().int().min(2020).max(2100),
      month: z.number().int().min(1).max(12),
      agencyId: z.string().min(1, "L'agence est requise"),
      data: SortiesLocalesImportSchema,
    });

    // Valider les données
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: parsed.error.errors
      });
    }

    const { year, month, agencyId, data } = parsed.data;

    console.log(`📥 Import CSV - ${data.length} lignes reçues pour ${year}/${month}, agence: ${agencyId}`);

    // Vérifier que l'agence existe
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) {
      return res.status(404).json({ error: "Agence introuvable" });
    }

    const results = {
      created: 0,
      updated: 0,
      wholesalersCreated: 0,
      productsCreated: 0,
      errors: [] as string[],
    };

    // Récupérer le premier pays disponible comme fallback
    const defaultCountry = await prisma.country.findFirst({
      orderBy: { code: "asc" },
    });

    if (!defaultCountry) {
      return res.status(500).json({
        error: "Aucun pays n'existe dans la base de données.",
      });
    }

    // Cache pour les grossistes
    const wholesalerCache = new Map<string, string>(); // name -> id

    // Traiter chaque ligne
    for (const row of data) {
      try {
        // Créer ou récupérer le grossiste
        let wholesalerId: string;

        if (wholesalerCache.has(row.wholesalerName)) {
          wholesalerId = wholesalerCache.get(row.wholesalerName)!;
        } else {
          let wholesaler = await prisma.wholesaler.findFirst({
            where: { name: row.wholesalerName },
          });

          if (!wholesaler) {
            // Vérifier si le pays existe
            const countryExists = await prisma.country.findUnique({
              where: { code: row.countryCode },
            });

            const finalCountryCode = countryExists
              ? row.countryCode
              : defaultCountry.code;

            // Créer le grossiste
            wholesaler = await prisma.wholesaler.create({
              data: {
                name: row.wholesalerName,
                countryCode: finalCountryCode,
                city: row.city || "",
                email: "",
                status: "active",
                scope: "country",
              },
            });
            results.wholesalersCreated++;
            console.log(`✅ Grossiste créé: ${row.wholesalerName} (pays: ${finalCountryCode})`);
          }

          wholesalerId = wholesaler.id;
          wholesalerCache.set(row.wholesalerName, wholesalerId);
        }

        // Vérifier si le produit existe par CIP ou par nom
        let product = await prisma.product.findUnique({
          where: { cip: row.productCip },
        });

        // Si pas trouvé par CIP, essayer par nom
        if (!product && row.productName) {
          product = await prisma.product.findFirst({
            where: {
              name: {
                contains: row.productName,
                mode: 'insensitive',
              },
            },
          });

          if (product) {
            console.log(`🔄 Produit trouvé par nom: "${row.productName}" -> CIP ${product.cip}`);
            // Utiliser le vrai CIP du produit
            row.productCip = product.cip;
          }
        }

        // Si toujours pas trouvé, créer le produit automatiquement
        if (!product) {
          console.log(`➕ Création automatique du produit: ${row.productCip} - ${row.productName || 'Sans nom'}`);

          try {
            product = await prisma.product.create({
              data: {
                cip: row.productCip,
                name: row.productName || row.productCip,
                laboratory: "Laboratoire inconnu",
                category: "Médicament",
                basePrice: 0,
              },
            });
            results.productsCreated++;
            console.log(`✅ Produit créé: ${product.cip} - ${product.name}`);
          } catch (createError: any) {
            console.error(`❌ Erreur création produit ${row.productCip}:`, createError.message);
            results.errors.push(`Impossible de créer le produit ${row.productCip}: ${createError.message}`);
            continue;
          }
        }

        // Upsert les données mensuelles
        const existingData = await prisma.monthlyData.findUnique({
          where: {
            agencyId_productCip_wholesalerId_year_month: {
              agencyId,
              productCip: row.productCip,
              wholesalerId,
              year,
              month,
            },
          },
        });

        await prisma.monthlyData.upsert({
          where: {
            agencyId_productCip_wholesalerId_year_month: {
              agencyId,
              productCip: row.productCip,
              wholesalerId,
              year,
              month,
            },
          },
          create: {
            agencyId,
            productCip: row.productCip,
            wholesalerId,
            year,
            month,
            sales: row.sales,
            stock: row.stock,
            orders: row.orders,
          },
          update: {
            sales: row.sales,
            stock: row.stock,
            orders: row.orders,
            updatedAt: new Date(),
          },
        });

        if (existingData) {
          results.updated++;
          console.log(`✏️ Mise à jour: ${row.productCip} / ${row.wholesalerName} - ventes:${row.sales}, stocks:${row.stock}, cmds:${row.orders}`);
        } else {
          results.created++;
          console.log(`✅ Création: ${row.productCip} / ${row.wholesalerName} - ventes:${row.sales}, stocks:${row.stock}, cmds:${row.orders}`);
        }
      } catch (error: any) {
        results.errors.push(
          `Erreur pour ${row.productCip} / ${row.wholesalerName}: ${error.message || "Erreur inconnue"}`
        );
      }
    }

    console.log(`✅ Import terminé: ${results.created} créées, ${results.updated} mises à jour, ${results.wholesalersCreated} grossistes créés, ${results.productsCreated} produits créés, ${results.errors.length} erreurs`);

    const messageParts = [];
    messageParts.push(`${results.created + results.updated} entrée(s)`);
    if (results.productsCreated > 0) messageParts.push(`${results.productsCreated} produit(s) créé(s)`);
    if (results.wholesalersCreated > 0) messageParts.push(`${results.wholesalersCreated} grossiste(s) créé(s)`);

    res.json({
      success: true,
      message: `Import terminé: ${messageParts.join(", ")}`,
      ...results,
    });
  } catch (error) {
    console.error("Erreur lors de l'import des sorties locales:", error);
    res.status(500).json({ error: "Erreur lors de l'import des sorties locales" });
  }
});

/**
 * GET /api/import/dashboard-stats
 * Récupérer les statistiques pour le tableau de bord
 */
importRouter.get("/dashboard-stats", requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    // Récupérer les données des 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let whereClause: any = {};

    // Filtrer par agence pour les utilisateurs non-admin
    if (user.role !== "super_admin" && user.agencyId) {
      whereClause.agencyId = user.agencyId;
    }

    // Données mensuelles
    const monthlyData = await prisma.monthlyData.findMany({
      where: whereClause,
    });

    // Récupérer les produits et grossistes séparément
    const productCips = Array.from(new Set(monthlyData.map(d => d.productCip)));
    const wholesalerIds = Array.from(new Set(monthlyData.map(d => d.wholesalerId)));

    const products = await prisma.product.findMany({
      where: { cip: { in: productCips } },
    });

    const wholesalers = await prisma.wholesaler.findMany({
      where: { id: { in: wholesalerIds } },
    });

    const productMap = new Map(products.map(p => [p.cip, p]));
    const wholesalerMap = new Map(wholesalers.map(w => [w.id, w]));

    // Calculer les statistiques
    let totalSales = 0;
    let totalStock = 0;
    let totalOrders = 0;
    let totalInventoryValue = 0;

    const productStats = new Map<string, { sales: number; stock: number; orders: number; name: string }>();
    const wholesalerStats = new Map<string, { sales: number; stock: number; name: string }>();
    const monthlyTrends: Record<string, { sales: number; stock: number; orders: number }> = {};

    for (const data of monthlyData) {
      totalSales += data.sales;
      totalStock += data.stock;
      totalOrders += data.orders;

      const product = productMap.get(data.productCip);
      const productPrice = product?.basePrice || 0;
      totalInventoryValue += data.stock * productPrice;

      // Stats par produit
      if (!productStats.has(data.productCip)) {
        productStats.set(data.productCip, {
          sales: 0,
          stock: 0,
          orders: 0,
          name: product?.name || data.productCip,
        });
      }
      const pStats = productStats.get(data.productCip)!;
      pStats.sales += data.sales;
      pStats.stock += data.stock;
      pStats.orders += data.orders;

      // Stats par grossiste
      if (!wholesalerStats.has(data.wholesalerId)) {
        const wholesaler = wholesalerMap.get(data.wholesalerId);
        wholesalerStats.set(data.wholesalerId, {
          sales: 0,
          stock: 0,
          name: wholesaler?.name || data.wholesalerId,
        });
      }
      const wStats = wholesalerStats.get(data.wholesalerId)!;
      wStats.sales += data.sales;
      wStats.stock += data.stock;

      // Tendances mensuelles
      const monthKey = `${data.year}-${String(data.month).padStart(2, "0")}`;
      if (!monthlyTrends[monthKey]) {
        monthlyTrends[monthKey] = { sales: 0, stock: 0, orders: 0 };
      }
      monthlyTrends[monthKey].sales += data.sales;
      monthlyTrends[monthKey].stock += data.stock;
      monthlyTrends[monthKey].orders += data.orders;
    }

    // Top 5 produits par ventes
    const topProducts = Array.from(productStats.entries())
      .sort((a, b) => b[1].sales - a[1].sales)
      .slice(0, 5)
      .map(([cip, stats]) => ({ cip, ...stats }));

    // Top 5 grossistes par ventes
    const topWholesalers = Array.from(wholesalerStats.entries())
      .sort((a, b) => b[1].sales - a[1].sales)
      .slice(0, 5)
      .map(([id, stats]) => ({ id, ...stats }));

    // Produits avec stock bas
    const lowStockProducts = Array.from(productStats.entries())
      .filter(([_, stats]) => stats.stock < 50)
      .sort((a, b) => a[1].stock - b[1].stock)
      .slice(0, 10)
      .map(([cip, stats]) => ({ cip, ...stats }));

    // Tendances formatées
    const trends = Object.entries(monthlyTrends)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, data]) => ({ month, ...data }));

    // Compter les agences
    const agencyCount = user.role === "super_admin"
      ? await prisma.agency.count()
      : 1;

    res.json({
      totals: {
        sales: totalSales,
        stock: totalStock,
        orders: totalOrders,
        inventoryValue: totalInventoryValue,
        agencies: agencyCount,
        products: productStats.size,
        wholesalers: wholesalerStats.size,
      },
      topProducts,
      topWholesalers,
      lowStockProducts,
      trends,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
});

/**
 * GET /api/import/sorties-locales
 * Récupérer les données pour le module Sorties Locales
 * Paramètres query:
 * - year: année
 * - month: mois
 * - scope: "all" | "country" | "agency"
 * - countryCode?: code pays (si scope=country)
 * - agencyId?: ID agence (si scope=agency)
 */
importRouter.get("/sorties-locales", requireAuth, async (req, res) => {
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

    let whereClause: any = { year: y, month: m };

    // Filtrer selon le scope
    if (scope === "agency" && agencyId) {
      whereClause.agencyId = agencyId as string;
    } else if (scope === "country" && countryCode) {
      // Récupérer toutes les agences du pays
      const agencies = await prisma.agency.findMany({
        where: { countryCode: countryCode as string },
        select: { id: true },
      });
      whereClause.agencyId = { in: agencies.map(a => a.id) };
    }
    // Si scope === "all", pas de filtre sur agencyId

    // Récupérer toutes les données mensuelles
    const monthlyData = await prisma.monthlyData.findMany({
      where: whereClause,
    });

    // Agréger les données par produit et fournisseur
    const aggregated = new Map<string, Map<string, { sales: number; stock: number; orders: number }>>();

    for (const data of monthlyData) {
      if (!aggregated.has(data.productCip)) {
        aggregated.set(data.productCip, new Map());
      }

      const productMap = aggregated.get(data.productCip)!;

      if (!productMap.has(data.wholesalerId)) {
        productMap.set(data.wholesalerId, { sales: 0, stock: 0, orders: 0 });
      }

      const supplierData = productMap.get(data.wholesalerId)!;
      supplierData.sales += data.sales;
      supplierData.stock += data.stock;
      supplierData.orders += data.orders;
    }

    // Convertir en format attendu par le frontend
    const result: Record<string, Record<string, { ventes: number; stocks: number; commandes: number }>> = {};

    for (const [productCip, suppliers] of aggregated.entries()) {
      result[productCip] = {};

      for (const [wholesalerId, data] of suppliers.entries()) {
        // Récupérer le nom du wholesaler
        const wholesaler = await prisma.wholesaler.findUnique({
          where: { id: wholesalerId },
          select: { name: true },
        });

        if (wholesaler) {
          result[productCip][wholesaler.name] = {
            ventes: data.sales,
            stocks: data.stock,
            commandes: data.orders,
          };
        }
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des données Sorties Locales:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});
