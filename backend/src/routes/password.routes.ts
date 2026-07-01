import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { requireAuth } from "../auth";
import { isPasswordStrong, generateResetToken } from "../utils/password";
import { sendEmail, generatePasswordResetEmail } from "../services/email.service";

const router = Router();

// Changer son mot de passe (utilisateur connecté)
router.post("/change-password", requireAuth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().optional(), // Optionnel si mustChangePassword est true
    newPassword: z.string().min(8),
  });

  try {
    const { currentPassword, newPassword } = schema.parse(req.body);

    // Vérifier la force du nouveau mot de passe
    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
      });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Si ce n'est pas un changement forcé, vérifier le mot de passe actuel
    if (!user.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Le mot de passe actuel est requis" });
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Mot de passe actuel incorrect" });
      }
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et réinitialiser le flag
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
      },
    });

    res.json({ success: true, message: "Mot de passe modifié avec succès" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Données invalides", details: error.errors });
    }
    throw error;
  }
});

// Demander une réinitialisation de mot de passe (email)
router.post("/request-reset", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
  });

  try {
    const { email } = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Par sécurité, on retourne toujours un succès même si l'email n'existe pas
    if (!user) {
      return res.json({ success: true, message: "Si l'email existe, un lien de réinitialisation a été envoyé" });
    }

    // Générer un token de réinitialisation
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // Sauvegarder le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email
    try {
      const emailContent = generatePasswordResetEmail(email, resetToken);
      await sendEmail({
        to: email,
        subject: "Réinitialisation de votre mot de passe OBCO",
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", emailError);
      return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
    }

    res.json({ success: true, message: "Un email de réinitialisation a été envoyé" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Email invalide" });
    }
    throw error;
  }
});

// Réinitialiser le mot de passe avec un token
router.post("/reset-password", async (req, res) => {
  const schema = z.object({
    token: z.string(),
    newPassword: z.string().min(8),
  });

  try {
    const { token, newPassword } = schema.parse(req.body);

    // Vérifier la force du nouveau mot de passe
    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
      });
    }

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Token non expiré
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        mustChangePassword: false,
      },
    });

    res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Données invalides", details: error.errors });
    }
    throw error;
  }
});

export default router;
