import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import laboratoriesRoutes from "./routes/laboratories.routes";
import passwordRoutes from "./routes/password.routes";
import { importRouter } from "./routes/import.routes";
import { reportsRouter } from "./routes/reports.routes";
import { adminRouter } from "./routes/admin.routes";
import {
  countriesRouter, agenciesRouter, productsRouter, pricesRouter,
  objectivesRouter, wholesalersRouter, stocksRouter, salesRouter,
} from "./routes/crud";

const app = express();

const origins = (process.env.CORS_ORIGIN || "*").split(",").map(s => s.trim());
app.use(cors({
  origin: origins.includes("*") ? true : origins,
  credentials: true,
}));
app.use(helmet());
app.use(express.json({ limit: "50mb" })); // Augmenté pour les gros imports CSV
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

app.use("/api/auth", rateLimit({ windowMs: 60_000, max: 60 }), authRoutes);
app.use("/api/password", rateLimit({ windowMs: 60_000, max: 10 }), passwordRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/countries", countriesRouter);
app.use("/api/agencies", agenciesRouter);
app.use("/api/laboratories", laboratoriesRoutes);
app.use("/api/products", productsRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/objectives", objectivesRouter);
app.use("/api/wholesalers", wholesalersRouter);
app.use("/api/stocks", stocksRouter);
app.use("/api/sales", salesRouter);
app.use("/api/import", importRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get("/", (_req, res) => res.json({ name: "OBCO API", version: "1.0.0" }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Gestionnaire d'erreur global amélioré
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ Erreur non gérée:", err);

  // Empêcher les crashs en gérant toutes les erreurs
  try {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Données invalides", details: err.flatten() });
    }

    const status = err?.status || 500;
    const message = err?.message || "Erreur serveur";

    return res.status(status).json({ error: message });
  } catch (responseError) {
    // Si même l'envoi de la réponse échoue, logger et continuer
    console.error("❌ Erreur lors de l'envoi de la réponse d'erreur:", responseError);
    try {
      return res.status(500).json({ error: "Erreur serveur" });
    } catch {
      // Dernier recours : ne rien faire pour éviter un crash
    }
  }
});

// Gestionnaires d'erreurs globaux pour éviter les crashes
process.on('uncaughtException', (error) => {
  console.error('❌ CRITICAL: Exception non gérée:', error);
  console.error('Stack:', error.stack);
  // Ne PAS crasher le serveur - continuer à fonctionner
});

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('❌ CRITICAL: Promesse rejetée non gérée:', reason);
  if (reason?.stack) {
    console.error('Stack:', reason.stack);
  }
  // Ne PAS crasher le serveur - continuer à fonctionner
});

// Intercepter les erreurs qui quittent le process
process.on('exit', (code) => {
  if (code !== 0) {
    console.error(`⚠️ Process exiting with code ${code}`);
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`🚀 OBCO API on :${port}`));
