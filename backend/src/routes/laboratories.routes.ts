import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";
import { getCountryInfo } from "../utils/countries-data";

const router = Router();
router.use(requireAuth);

router.get("/", async (_req, res) => {
  res.json(await prisma.laboratory.findMany({ orderBy: { name: "asc" } }));
});

const labSchema = z.object({
  name: z.string().min(1),
  countryCode: z.string().min(2),
  contact: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  status: z.string().optional(),
});

router.post("/", requireRole("super_admin"), async (req, res) => {
  try {
    const data = labSchema.parse(req.body);

    // Vérifier si le pays existe
    const country = await prisma.country.findUnique({
      where: { code: data.countryCode }
    });

    if (!country) {
      return res.status(400).json({
        error: `Le pays avec le code "${data.countryCode}" n'existe pas. Veuillez d'abord créer le pays avant d'ajouter un laboratoire.`
      });
    }

    const laboratory = await prisma.laboratory.create({ data });
    console.log(`✅ Laboratory created successfully:`, laboratory);
    res.status(201).json(laboratory);
  } catch (error) {
    console.error(`❌ Error creating laboratory:`, error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.errors
      });
    }

    return res.status(500).json({
      error: "Erreur lors de la création du laboratoire"
    });
  }
});

router.patch("/:id", requireRole("super_admin"), async (req, res) => {
  try {
    console.log(`📝 Updating laboratory ${req.params.id} with data:`, req.body);

    // Validate with partial schema (allow partial updates)
    const data = labSchema.partial().parse(req.body);

    // If countryCode is being updated, verify it exists
    if (data.countryCode) {
      const country = await prisma.country.findUnique({
        where: { code: data.countryCode }
      });

      if (!country) {
        return res.status(400).json({
          error: `Le pays avec le code "${data.countryCode}" n'existe pas. Veuillez d'abord créer le pays avant de modifier le laboratoire.`
        });
      }
    }

    const updated = await prisma.laboratory.update({
      where: { id: req.params.id },
      data
    });

    console.log(`✅ Laboratory ${req.params.id} updated successfully:`, updated);
    res.json(updated);
  } catch (error) {
    console.error(`❌ Error updating laboratory ${req.params.id}:`, error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.errors
      });
    }

    return res.status(500).json({
      error: "Erreur lors de la mise à jour du laboratoire"
    });
  }
});

router.delete("/:id", requireRole("super_admin"), async (req, res) => {
  try {
    await prisma.laboratory.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error("Erreur suppression laboratoire:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression du laboratoire" });
  }
});

export default router;
