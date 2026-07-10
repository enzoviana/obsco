import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db";
import { signToken, requireAuth } from "../auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides" });
  const token = signToken({ sub: user.id, email: user.email, role: user.role, agencyId: user.agencyId });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agencyId: user.agencyId,
      mustChangePassword: user.mustChangePassword, // Inclure le flag
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    include: { agency: { include: { country: true } } },
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    agency: user.agency,
    agencyId: user.agencyId,
    mustChangePassword: user.mustChangePassword, // Inclure le flag
  });
});

// PATCH /auth/me/profile - Modifier son propre profil
router.patch("/me/profile", requireAuth, async (req, res) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    });

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
    }

    const data: any = {};
    if (parsed.data.name) data.name = parsed.data.name;
    if (parsed.data.email) data.email = parsed.data.email.toLowerCase();

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data,
      select: { id: true, email: true, name: true, role: true, agencyId: true },
    });

    console.log(`✅ Profil mis à jour pour l'utilisateur ${user.id}`);
    res.json(user);
  } catch (error: any) {
    console.error("❌ Erreur lors de la mise à jour du profil:", error);
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
});

// PATCH /auth/me/password - Changer son mot de passe
router.patch("/me/password", requireAuth, async (req, res) => {
  try {
    const passwordSchema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    });

    const parsed = passwordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: parsed.error.flatten()
      });
    }

    const { currentPassword, newPassword } = parsed.data;

    // Récupérer l'utilisateur avec son mot de passe
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Vérifier le mot de passe actuel
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et réinitialiser le flag mustChangePassword
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    console.log(`✅ Mot de passe changé pour l'utilisateur ${user.id}`);
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors du changement de mot de passe:", error);
    res.status(500).json({ error: "Erreur lors du changement de mot de passe" });
  }
});

export default router;
