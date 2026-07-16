// Routes d'administration pour maintenance de la base de données
import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("super_admin"));

// Analyse des doublons et incohérences dans les produits
adminRouter.get("/products/analyze", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    // 1. Détecter les doublons potentiels (noms très similaires)
    const duplicates: any[] = [];
    const seen = new Map<string, any[]>();

    for (const product of products) {
      const normalized = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Enlever ponctuation et espaces
        .trim();

      if (!seen.has(normalized)) {
        seen.set(normalized, []);
      }
      seen.get(normalized)!.push(product);
    }

    // Grouper les doublons
    for (const [key, group] of seen.entries()) {
      if (group.length > 1) {
        duplicates.push({
          normalizedName: key,
          count: group.length,
          products: group.map(p => ({
            id: p.id,
            cip: p.cip,
            name: p.name,
            category: p.category,
            laboratory: p.laboratory,
          })),
        });
      }
    }

    // 2. Analyser les catégories et détecter singulier/pluriel
    const categories = new Map<string, number>();
    for (const product of products) {
      const cat = product.category;
      categories.set(cat, (categories.get(cat) || 0) + 1);
    }

    const categoryList = Array.from(categories.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Détecter les variations singulier/pluriel
    const categoryIssues: any[] = [];
    const processedCategories = new Set<string>();

    for (const cat1 of categoryList) {
      if (processedCategories.has(cat1.name)) continue;

      // Vérifier si une version singulier/pluriel existe
      const singular = cat1.name.endsWith("s") ? cat1.name.slice(0, -1) : cat1.name;
      const plural = cat1.name.endsWith("s") ? cat1.name : cat1.name + "s";

      const singularMatch = categoryList.find(c => c.name === singular);
      const pluralMatch = categoryList.find(c => c.name === plural);

      if (singularMatch && pluralMatch && singular !== plural) {
        categoryIssues.push({
          singular: singularMatch.name,
          singularCount: singularMatch.count,
          plural: pluralMatch.name,
          pluralCount: pluralMatch.count,
          suggestion: pluralMatch.count >= singularMatch.count ? pluralMatch.name : singularMatch.name,
        });
        processedCategories.add(singular);
        processedCategories.add(plural);
      }
    }

    res.json({
      summary: {
        totalProducts: products.length,
        duplicateGroups: duplicates.length,
        totalCategories: categoryList.length,
        categoryIssues: categoryIssues.length,
      },
      duplicates,
      categories: categoryList,
      categoryIssues,
    });
  } catch (error) {
    console.error("Erreur analyse produits:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
});

// Normaliser les catégories (remplacer ancienne par nouvelle)
adminRouter.post("/products/normalize-categories", async (req, res) => {
  try {
    const { mapping } = req.body; // { "ancienne": "nouvelle", ... }

    if (!mapping || typeof mapping !== "object") {
      return res.status(400).json({ error: "mapping requis" });
    }

    const updates: any[] = [];

    for (const [oldCategory, newCategory] of Object.entries(mapping)) {
      if (typeof newCategory !== "string") continue;

      const result = await prisma.product.updateMany({
        where: { category: oldCategory },
        data: { category: newCategory },
      });

      updates.push({
        from: oldCategory,
        to: newCategory,
        updated: result.count,
      });

      console.log(`✅ Normalisé: ${oldCategory} → ${newCategory} (${result.count} produits)`);
    }

    res.json({
      success: true,
      updates,
      message: `${updates.reduce((sum, u) => sum + u.updated, 0)} produits mis à jour`,
    });
  } catch (error) {
    console.error("Erreur normalisation catégories:", error);
    res.status(500).json({ error: "Erreur lors de la normalisation" });
  }
});

// Fusionner des doublons (garder un produit, supprimer les autres)
adminRouter.post("/products/merge-duplicates", async (req, res) => {
  try {
    const { keepId, deleteIds } = req.body;

    if (!keepId || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res.status(400).json({ error: "keepId et deleteIds requis" });
    }

    // Vérifier que le produit à garder existe
    const keepProduct = await prisma.product.findUnique({ where: { id: keepId } });
    if (!keepProduct) {
      return res.status(404).json({ error: "Produit à garder introuvable" });
    }

    // Vérifier que les produits à supprimer existent
    const deleteProducts = await prisma.product.findMany({
      where: { id: { in: deleteIds } },
    });

    if (deleteProducts.length !== deleteIds.length) {
      return res.status(404).json({ error: "Certains produits à supprimer sont introuvables" });
    }

    // Utiliser une transaction pour la fusion
    const result = await prisma.$transaction(async (tx) => {
      const merged: any[] = [];

      for (const deleteId of deleteIds) {
        // 1. Transférer les prix
        await tx.productPrice.updateMany({
          where: { productId: deleteId },
          data: { productId: keepId },
        });

        // 2. Transférer les objectifs
        await tx.productObjective.updateMany({
          where: { productId: deleteId },
          data: { productId: keepId },
        });

        // 3. Transférer les stocks fournisseurs (attention aux conflits)
        const stocks = await tx.supplierStock.findMany({
          where: { productId: deleteId },
        });

        for (const stock of stocks) {
          // Vérifier si un stock existe déjà pour ce fournisseur et le produit cible
          const existing = await tx.supplierStock.findUnique({
            where: {
              wholesalerId_productId: {
                wholesalerId: stock.wholesalerId,
                productId: keepId,
              },
            },
          });

          if (existing) {
            // Fusionner les quantités
            await tx.supplierStock.update({
              where: { id: existing.id },
              data: {
                quantity: existing.quantity + stock.quantity,
                inTransit: existing.inTransit + stock.inTransit,
              },
            });
            // Supprimer l'ancien stock
            await tx.supplierStock.delete({ where: { id: stock.id } });
          } else {
            // Transférer directement
            await tx.supplierStock.update({
              where: { id: stock.id },
              data: { productId: keepId },
            });
          }
        }

        // 4. Transférer les ventes
        await tx.sale.updateMany({
          where: { productId: deleteId },
          data: { productId: keepId },
        });

        // 5. Supprimer le produit dupliqué
        const deleted = await tx.product.delete({ where: { id: deleteId } });
        merged.push(deleted);
      }

      return merged;
    });

    console.log(`✅ Fusionné ${deleteIds.length} produits dans ${keepProduct.name}`);

    res.json({
      success: true,
      kept: keepProduct,
      merged: result,
      message: `${deleteIds.length} produit(s) fusionné(s) avec succès`,
    });
  } catch (error) {
    console.error("Erreur fusion produits:", error);
    res.status(500).json({ error: "Erreur lors de la fusion" });
  }
});

// Supprimer définitivement des produits (sans fusion)
adminRouter.post("/products/delete-batch", async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "productIds requis" });
    }

    // Vérifier si les produits ont des ventes
    const salesCount = await prisma.sale.count({
      where: { productId: { in: productIds } },
    });

    if (salesCount > 0) {
      return res.status(400).json({
        error: `Impossible de supprimer : ${salesCount} vente(s) référencent ces produits. Utilisez la fusion à la place.`,
      });
    }

    // Supprimer les produits (les relations seront supprimées en cascade)
    const result = await prisma.product.deleteMany({
      where: { id: { in: productIds } },
    });

    console.log(`✅ Supprimé ${result.count} produits`);

    res.json({
      success: true,
      deleted: result.count,
      message: `${result.count} produit(s) supprimé(s) avec succès`,
    });
  } catch (error) {
    console.error("Erreur suppression produits:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});
