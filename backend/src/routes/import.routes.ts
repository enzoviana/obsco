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
