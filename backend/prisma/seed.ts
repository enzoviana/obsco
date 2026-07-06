import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COUNTRIES = [
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", region: "Afrique" },
  { code: "ML", name: "Mali", currency: "XOF", region: "Afrique" },
  { code: "SN", name: "Sénégal", currency: "XOF", region: "Afrique" },
  { code: "BF", name: "Burkina Faso", currency: "XOF", region: "Afrique" },
  { code: "CM", name: "Cameroun", currency: "XAF", region: "Afrique" },
  { code: "GA", name: "Gabon", currency: "XAF", region: "Afrique" },
  { code: "TG", name: "Togo", currency: "XOF", region: "Afrique" },
  { code: "BJ", name: "Bénin", currency: "XOF", region: "Afrique" },
];

const AGENCIES = [
  { name: "ANF Abidjan", city: "Abidjan", countryCode: "CI", manager: "A. Koné", email: "abidjan@anf.app" },
  { name: "ANF Bamako", city: "Bamako", countryCode: "ML", manager: "M. Traoré", email: "bamako@anf.app" },
  { name: "ANF Dakar", city: "Dakar", countryCode: "SN", manager: "F. Diop", email: "dakar@anf.app" },
  { name: "ANF Ouaga", city: "Ouagadougou", countryCode: "BF", manager: "P. Ouédraogo", email: "ouaga@anf.app" },
  { name: "ANF Douala", city: "Douala", countryCode: "CM", manager: "J. Mbarga", email: "douala@anf.app" },
  { name: "ANF Libreville", city: "Libreville", countryCode: "GA", manager: "S. Ndong", email: "libreville@anf.app" },
  { name: "ANF Lomé", city: "Lomé", countryCode: "TG", manager: "K. Adjo", email: "lome@anf.app" },
  { name: "ANF Cotonou", city: "Cotonou", countryCode: "BJ", manager: "C. Hounsou", email: "cotonou@anf.app" },
];

const WHOLESALERS = [
  { name: "CAMED", countryCode: "CI", email: "contact@camed.ci" },
  { name: "LABOREX MALI", countryCode: "ML", email: "info@laborex.ml" },
  { name: "COPHARMED", countryCode: "SN", email: "contact@copharmed.sn" },
  { name: "UBIPHARM", countryCode: "BF", email: "ubipharm@ubipharm.bf" },
  { name: "DPM", countryCode: "CM", email: "contact@dpm.cm" },
];

const LABS = [
  { name: "Sanofi Afrique", countryCode: "CI", contact: "Marc Dupont", email: "m.dupont@sanofi.com", phone: "+225 27 22 44 00", address: "Plateau, Abidjan" },
  { name: "Pfizer West Africa", countryCode: "SN", contact: "Aïssatou Diop", email: "a.diop@pfizer.com", phone: "+221 33 869 00 00", address: "Almadies, Dakar" },
  { name: "Novartis CEMAC", countryCode: "CM", contact: "Jean Mbarga", email: "j.mbarga@novartis.com", phone: "+237 233 42 00 00", address: "Bonanjo, Douala" },
  { name: "Servier Mali", countryCode: "ML", contact: "Mariam Touré", email: "m.toure@servier.com", phone: "+223 20 22 00 00", address: "Hamdallaye, Bamako" },
];

const PRODUCTS = [
  { cip: "3400900000001", name: "Paracétamol 500mg bte/20", category: "Antalgiques", laboratory: "Sanofi" },
  { cip: "3400900000002", name: "Amoxicilline 1000mg bte/12", category: "Antibiotiques", laboratory: "Biogaran" },
  { cip: "3400900000003", name: "Ibuprofène 200mg bte/30", category: "Anti-inflammatoires", laboratory: "Pfizer" },
  { cip: "3400900000004", name: "Vitamine C 500mg bte/30", category: "Vitamines & Minéraux", laboratory: "Bayer" },
  { cip: "3400900000005", name: "Doliprane 1000mg bte/8", category: "Antalgiques", laboratory: "Sanofi" },
  { cip: "3400900000006", name: "Spasfon 80mg bte/30", category: "Gastro-entérologie", laboratory: "Teva" },
  { cip: "3400900000007", name: "Smecta sachets bte/30", category: "Gastro-entérologie", laboratory: "Ipsen" },
  { cip: "3400900000008", name: "Voltarène 50mg bte/30", category: "Anti-inflammatoires", laboratory: "Novartis" },
  { cip: "3400900000009", name: "Ventoline 100µg flacon", category: "Pneumologie", laboratory: "GSK" },
  { cip: "3400900000010", name: "Lévothyrox 50µg bte/30", category: "Endocrinologie", laboratory: "Merck" },
];

async function main() {
  console.log("→ Seeding countries");
  for (const c of COUNTRIES) await prisma.country.upsert({ where: { code: c.code }, create: c, update: c });

  console.log("→ Seeding agencies");
  const agencies: Record<string, string> = {};
  for (const a of AGENCIES) {
    const ex = await prisma.agency.findFirst({ where: { name: a.name } });
    const row = ex ?? await prisma.agency.create({ data: a });
    agencies[a.name] = row.id;
  }

  console.log("→ Seeding wholesalers");
  for (const w of WHOLESALERS) {
    const ex = await prisma.wholesaler.findFirst({ where: { name: w.name } });
    if (!ex) await prisma.wholesaler.create({ data: w });
  }

  console.log("→ Seeding laboratories");
  for (const l of LABS) {
    const ex = await prisma.laboratory.findFirst({ where: { name: l.name } });
    if (!ex) await prisma.laboratory.create({ data: l });
  }

  console.log("→ Seeding products");
  for (const p of PRODUCTS) await prisma.product.upsert({ where: { cip: p.cip }, create: p, update: p });

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@datafuse.app").toLowerCase();
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPass, 10);
  console.log(`→ Admin user: ${adminEmail}`);
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash, name: "Super Admin", role: "super_admin" },
    update: {},
  });

  const agencePass = await bcrypt.hash("Agence123!", 10);
  await prisma.user.upsert({
    where: { email: "abidjan@anf.app" },
    create: { email: "abidjan@anf.app", passwordHash: agencePass, name: "Agence Abidjan", role: "agence", agencyId: agencies["ANF Abidjan"] },
    update: {},
  });

  console.log("✅ Seed terminé.");
  console.log(`   Super admin : ${adminEmail} / ${adminPass}`);
  console.log(`   Agence test : abidjan@anf.app / Agence123!`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
