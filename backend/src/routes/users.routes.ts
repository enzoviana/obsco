import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";

const router = Router();
router.use(requireAuth, requireRole("super_admin"));

// GET /api/users - Récupérer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            city: true,
            countryCode: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ ${users.length} utilisateurs récupérés`);
    res.json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// GET /api/users/admins - Récupérer uniquement les admins
router.get("/admins", async (_req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "super_admin" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ ${admins.length} administrateurs récupérés`);
    res.json(admins);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des admins:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des admins" });
  }
});

// GET /api/users/agencies - Récupérer uniquement les utilisateurs agences
router.get("/agencies", async (_req, res) => {
  try {
    const agencies = await prisma.user.findMany({
      where: { role: "agence" },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            city: true,
            countryCode: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ ${agencies.length} utilisateurs agences récupérés`);
    res.json(agencies);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des agences:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des agences" });
  }
});

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["super_admin", "agence"]),
  agencyId: z.string().nullable().optional(),
});

// POST /api/users - Créer un nouvel utilisateur
router.post("/", async (req, res) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: parsed.error.flatten()
      });
    }

    const { email, password, name, role, agencyId } = parsed.data;

    // Vérifier que l'agence existe si un agencyId est fourni
    if (agencyId) {
      const agencyExists = await prisma.agency.findUnique({
        where: { id: agencyId },
      });
      if (!agencyExists) {
        return res.status(400).json({ error: "L'agence spécifiée n'existe pas" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role,
        agencyId: agencyId || null,
        mustChangePassword: true, // Forcer le changement de mot de passe
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        agencyId: true,
        createdAt: true,
      },
    });

    console.log(`✅ Utilisateur créé: ${user.email} (${user.role})`);
    res.status(201).json(user);
  } catch (e: any) {
    console.error("❌ Erreur lors de la création de l'utilisateur:", e);
    if (e?.code === "P2002") {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

// PATCH /api/users/:id - Modifier un utilisateur
router.patch("/:id", async (req, res) => {
  try {
    const { name, role, agencyId, password } = req.body as any;
    const data: any = {};

    if (name) data.name = name;
    if (role) data.role = role;
    if (agencyId !== undefined) data.agencyId = agencyId || null;
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
      data.mustChangePassword = true; // Forcer le changement de mot de passe
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, agencyId: true },
    });

    console.log(`✅ Utilisateur ${req.params.id} modifié`);
    res.json(user);
  } catch (error: any) {
    console.error(`❌ Erreur lors de la modification de l'utilisateur ${req.params.id}:`, error);
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    res.status(500).json({ error: "Erreur lors de la modification de l'utilisateur" });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Empêcher la suppression de son propre compte
    if (userId === req.user!.sub) {
      return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    await prisma.user.delete({ where: { id: userId } });

    console.log(`✅ Utilisateur ${userId} supprimé`);
    res.status(204).end();
  } catch (error: any) {
    console.error(`❌ Erreur lors de la suppression de l'utilisateur ${req.params.id}:`, error);
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
});

export default router;
