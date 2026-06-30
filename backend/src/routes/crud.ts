// Generic CRUD factory + per-entity routes. RLS-like scoping handled in handlers.
import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";
import { generateTemporaryPassword } from "../utils/password";
import { sendEmail, generateWelcomeEmail } from "../services/email.service";

export const countriesRouter = Router();
countriesRouter.use(requireAuth);
countriesRouter.get("/", async (_req, res) => res.json(await prisma.country.findMany({ orderBy: { name: "asc" } })));
countriesRouter.post("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({ code: z.string().min(2).max(3), name: z.string(), currency: z.string(), region: z.string() }).parse(req.body);
  res.status(201).json(await prisma.country.create({ data: s }));
});
countriesRouter.patch("/:code", requireRole("super_admin"), async (req, res) => {
  res.json(await prisma.country.update({ where: { code: req.params.code }, data: req.body }));
});
countriesRouter.delete("/:code", requireRole("super_admin"), async (req, res) => {
  await prisma.country.delete({ where: { code: req.params.code } }); res.status(204).end();
});

export const agenciesRouter = Router();
agenciesRouter.use(requireAuth);
agenciesRouter.get("/", async (req, res) => {
  const where = req.user!.role === "agence" ? { id: req.user!.agencyId || "" } : {};
  res.json(await prisma.agency.findMany({ where, include: { country: true }, orderBy: { name: "asc" } }));
});
agenciesRouter.post("/", requireRole("super_admin"), async (req, res) => {
  try {
    const s = z.object({
      name: z.string().min(1, "Le nom est requis"),
      city: z.string().default(""),
      email: z.string().email("Email invalide"),
      manager: z.string().default(""),
      countryCode: z.string().min(1, "Le pays est requis"),
      status: z.string().optional(),
    }).parse(req.body);

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email: s.email } });
    if (existingUser) {
      return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
    }

  // Créer l'agence
  const agency = await prisma.agency.create({ data: s });

  // Générer un mot de passe provisoire
  const temporaryPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  // Créer un utilisateur pour cette agence
  const user = await prisma.user.create({
    data: {
      email: s.email,
      passwordHash: hashedPassword,
      name: s.manager,
      role: "agence",
      agencyId: agency.id,
      mustChangePassword: true, // Flag pour forcer le changement de mot de passe
    },
  });

  // Envoyer l'email de bienvenue avec les identifiants
  try {
    const emailContent = generateWelcomeEmail(agency.name, s.email, temporaryPassword);
    await sendEmail({
      to: s.email,
      subject: `Bienvenue sur OBSCO - Compte créé pour ${agency.name}`,
      html: emailContent.html,
      text: emailContent.text,
    });
    console.log(`✅ Email de bienvenue envoyé à ${s.email}`);
  } catch (emailError) {
    console.error("⚠️ Erreur lors de l'envoi de l'email:", emailError);
    // On ne bloque pas la création même si l'email échoue
    // L'admin pourra toujours communiquer les identifiants manuellement
  }

  res.status(201).json({
    ...agency,
    user: { id: user.id, email: user.email, name: user.name },
    temporaryPassword: temporaryPassword, // Retourner aussi dans la réponse pour que l'admin puisse le communiquer manuellement si besoin
  });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message || "Données invalides" });
    }
    console.error("Erreur création agence:", error);
    return res.status(500).json({ error: "Erreur lors de la création de l'agence" });
  }
});
agenciesRouter.patch("/:id", requireRole("super_admin"), async (req, res) => {
  res.json(await prisma.agency.update({ where: { id: req.params.id }, data: req.body }));
});
agenciesRouter.delete("/:id", requireRole("super_admin"), async (req, res) => {
  try {
    const agencyId = req.params.id;

    // Suppression en cascade de toutes les données liées à cette agence
    // L'ordre est important pour respecter les contraintes de clés étrangères

    // 1. Supprimer les utilisateurs de cette agence
    await prisma.user.deleteMany({ where: { agencyId } });

    // 2. Supprimer les ventes de cette agence
    await prisma.sale.deleteMany({ where: { agencyId } });

    // 3. Supprimer les données mensuelles importées pour cette agence
    await prisma.monthlyData.deleteMany({ where: { agencyId } });

    // 4. Supprimer les stocks des grossistes spécifiques à cette agence
    const agencyWholesalers = await prisma.wholesaler.findMany({
      where: { agencyId },
      select: { id: true },
    });
    const wholesalerIds = agencyWholesalers.map(w => w.id);
    if (wholesalerIds.length > 0) {
      await prisma.supplierStock.deleteMany({
        where: { wholesalerId: { in: wholesalerIds } },
      });
    }

    // 5. Supprimer les grossistes spécifiques à cette agence
    await prisma.wholesaler.deleteMany({ where: { agencyId } });

    // 6. Enfin supprimer l'agence elle-même
    await prisma.agency.delete({ where: { id: agencyId } });

    console.log(`✅ Agence ${agencyId} et toutes ses données associées supprimées`);
    res.status(204).end();
  } catch (error) {
    console.error("Erreur suppression agence:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression de l'agence" });
  }
});

export const productsRouter = Router();
productsRouter.use(requireAuth);
productsRouter.get("/", async (_req, res) => {
  res.json(await prisma.product.findMany({ orderBy: { name: "asc" }, take: 5000 }));
});
productsRouter.post("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({
    cip: z.string(), name: z.string(), category: z.string(),
    laboratory: z.string(), basePrice: z.number().nonnegative().optional(),
  }).parse(req.body);
  res.status(201).json(await prisma.product.create({ data: s }));
});
productsRouter.patch("/:id", requireRole("super_admin"), async (req, res) => {
  res.json(await prisma.product.update({ where: { id: req.params.id }, data: req.body }));
});
productsRouter.delete("/:id", requireRole("super_admin"), async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } }); res.status(204).end();
});

export const pricesRouter = Router();
pricesRouter.use(requireAuth);
pricesRouter.get("/", async (req, res) => {
  const where: any = {};
  if (req.query.productId) where.productId = String(req.query.productId);
  if (req.query.countryCode) where.countryCode = String(req.query.countryCode);
  res.json(await prisma.productPrice.findMany({ where }));
});
pricesRouter.put("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({ productId: z.string(), countryCode: z.string(), price: z.number().nonnegative() }).parse(req.body);
  const row = await prisma.productPrice.upsert({
    where: { productId_countryCode: { productId: s.productId, countryCode: s.countryCode } },
    create: s, update: { price: s.price },
  });
  res.json(row);
});

export const objectivesRouter = Router();
objectivesRouter.use(requireAuth);
objectivesRouter.get("/", async (req, res) => {
  const where: any = {};
  for (const k of ["productId", "countryCode"]) if (req.query[k]) where[k] = String(req.query[k]);
  if (req.query.year) where.year = Number(req.query.year);
  if (req.query.month) where.month = Number(req.query.month);
  res.json(await prisma.productObjective.findMany({ where }));
});
objectivesRouter.put("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({
    productId: z.string(), countryCode: z.string(),
    year: z.number().int(), month: z.number().int().min(1).max(12),
    targetUnits: z.number().int().nonnegative(), targetCA: z.number().nonnegative(),
  }).parse(req.body);
  const row = await prisma.productObjective.upsert({
    where: { productId_countryCode_year_month: { productId: s.productId, countryCode: s.countryCode, year: s.year, month: s.month } },
    create: s, update: { targetUnits: s.targetUnits, targetCA: s.targetCA },
  });
  res.json(row);
});

export const wholesalersRouter = Router();
wholesalersRouter.use(requireAuth);
wholesalersRouter.get("/", async (req, res) => {
  const where: any = {};
  if (req.query.countryCode) where.countryCode = String(req.query.countryCode);
  res.json(await prisma.wholesaler.findMany({ where, orderBy: { name: "asc" } }));
});
wholesalersRouter.post("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({
    name: z.string(), countryCode: z.string(), city: z.string().optional(), email: z.string().email().optional(),
  }).parse(req.body);
  res.status(201).json(await prisma.wholesaler.create({ data: s }));
});
wholesalersRouter.patch("/:id", requireRole("super_admin"), async (req, res) => {
  res.json(await prisma.wholesaler.update({ where: { id: req.params.id }, data: req.body }));
});
wholesalersRouter.delete("/:id", requireRole("super_admin"), async (req, res) => {
  await prisma.wholesaler.delete({ where: { id: req.params.id } }); res.status(204).end();
});

export const stocksRouter = Router();
stocksRouter.use(requireAuth);
stocksRouter.get("/", async (req, res) => {
  const where: any = {};
  if (req.query.wholesalerId) where.wholesalerId = String(req.query.wholesalerId);
  if (req.query.productId) where.productId = String(req.query.productId);
  res.json(await prisma.supplierStock.findMany({ where, include: { product: true, wholesaler: true } }));
});
stocksRouter.put("/", requireRole("super_admin"), async (req, res) => {
  const s = z.object({
    wholesalerId: z.string(), productId: z.string(),
    quantity: z.number().int().nonnegative(), inTransit: z.number().int().nonnegative().default(0),
  }).parse(req.body);
  const row = await prisma.supplierStock.upsert({
    where: { wholesalerId_productId: { wholesalerId: s.wholesalerId, productId: s.productId } },
    create: s, update: { quantity: s.quantity, inTransit: s.inTransit },
  });
  res.json(row);
});

export const salesRouter = Router();
salesRouter.use(requireAuth);
salesRouter.get("/", async (req, res) => {
  const where: any = {};
  if (req.user!.role === "agence") where.agencyId = req.user!.agencyId || "";
  else if (req.query.agencyId) where.agencyId = String(req.query.agencyId);
  if (req.query.productId) where.productId = String(req.query.productId);
  if (req.query.from || req.query.to) {
    where.date = {};
    if (req.query.from) where.date.gte = new Date(String(req.query.from));
    if (req.query.to) where.date.lte = new Date(String(req.query.to));
  }
  res.json(await prisma.sale.findMany({
    where, take: 5000, orderBy: { date: "desc" },
    include: { product: true, wholesaler: true, agency: true },
  }));
});
salesRouter.post("/", async (req, res) => {
  const s = z.object({
    agencyId: z.string().optional(), productId: z.string(),
    wholesalerId: z.string().nullable().optional(),
    quantity: z.number().int().positive(), unitPrice: z.number().nonnegative(),
    date: z.string().datetime().optional(),
  }).parse(req.body);
  const agencyId = req.user!.role === "agence" ? (req.user!.agencyId || "") : (s.agencyId || "");
  if (!agencyId) return res.status(400).json({ error: "agencyId requis" });
  const totalCA = s.quantity * s.unitPrice;
  const row = await prisma.sale.create({
    data: {
      agencyId, productId: s.productId, wholesalerId: s.wholesalerId || null,
      quantity: s.quantity, unitPrice: s.unitPrice, totalCA,
      date: s.date ? new Date(s.date) : new Date(),
    },
  });
  res.status(201).json(row);
});
salesRouter.delete("/:id", requireRole("super_admin"), async (req, res) => {
  await prisma.sale.delete({ where: { id: req.params.id } }); res.status(204).end();
});
