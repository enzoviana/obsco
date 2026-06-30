import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";

const router = Router();
router.use(requireAuth, requireRole("super_admin"));

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, agencyId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["super_admin", "agence"]),
  agencyId: z.string().nullable().optional(),
});

router.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name, role, agencyId } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name, role, agencyId: agencyId || null },
      select: { id: true, email: true, name: true, role: true, agencyId: true },
    });
    res.status(201).json(user);
  } catch (e: any) {
    if (e?.code === "P2002") return res.status(409).json({ error: "Email déjà utilisé" });
    throw e;
  }
});

router.patch("/:id", async (req, res) => {
  const { name, role, agencyId, password } = req.body as any;
  const data: any = {};
  if (name) data.name = name;
  if (role) data.role = role;
  if (agencyId !== undefined) data.agencyId = agencyId || null;
  if (password) data.passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: { id: req.params.id }, data,
    select: { id: true, email: true, name: true, role: true, agencyId: true },
  });
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
