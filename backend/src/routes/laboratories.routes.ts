import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireRole } from "../auth";

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
  const data = labSchema.parse(req.body);
  res.status(201).json(await prisma.laboratory.create({ data }));
});

router.patch("/:id", requireRole("super_admin"), async (req, res) => {
  res.json(await prisma.laboratory.update({ where: { id: req.params.id }, data: req.body }));
});

router.delete("/:id", requireRole("super_admin"), async (req, res) => {
  await prisma.laboratory.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
