-- ==========================================
-- PROPAGATION SIMPLE : Mois 8 → Mois 1-7
-- ==========================================
-- Ce script propage tous les objectifs du mois 8 vers les mois 1-7
-- pour l'année 2026, en respectant les objectifs > 0 existants

BEGIN;

-- Afficher l'état actuel
SELECT
  '=== ÉTAT AVANT PROPAGATION ===' as "Info",
  COUNT(DISTINCT CONCAT("productId", '-', "countryCode")) as "Combinaisons Produit-Pays avec Objectifs Mois 8",
  COUNT(*) as "Total Objectifs Mois 8"
FROM "ProductObjective"
WHERE "year" = 2026
  AND "month" = 8
  AND "targetUnits" > 0;

-- Propager les objectifs du mois 8 vers les mois 1-7
WITH objectives_month_8 AS (
  -- Récupérer tous les objectifs du mois 8 avec targetUnits > 0
  SELECT
    "productId",
    "countryCode",
    "year",
    "targetUnits",
    "targetCA"
  FROM "ProductObjective"
  WHERE "year" = 2026
    AND "month" = 8
    AND "targetUnits" > 0
)
INSERT INTO "ProductObjective" ("productId", "countryCode", "year", "month", "targetUnits", "targetCA")
SELECT
  o8."productId",
  o8."countryCode",
  o8."year",
  m.month_number,
  o8."targetUnits",
  o8."targetCA"
FROM objectives_month_8 o8
CROSS JOIN (
  SELECT 1 as month_number UNION ALL
  SELECT 2 UNION ALL
  SELECT 3 UNION ALL
  SELECT 4 UNION ALL
  SELECT 5 UNION ALL
  SELECT 6 UNION ALL
  SELECT 7
) m
ON CONFLICT ("productId", "countryCode", "year", "month")
DO UPDATE SET
  "targetUnits" = CASE
    -- Ne mettre à jour que si l'objectif existant est 0
    WHEN "ProductObjective"."targetUnits" = 0 THEN EXCLUDED."targetUnits"
    -- Sinon garder la valeur existante
    ELSE "ProductObjective"."targetUnits"
  END,
  "targetCA" = CASE
    WHEN "ProductObjective"."targetCA" = 0 THEN EXCLUDED."targetCA"
    ELSE "ProductObjective"."targetCA"
  END,
  "updatedAt" = CURRENT_TIMESTAMP;

-- Afficher le résultat
SELECT
  '=== ÉTAT APRÈS PROPAGATION ===' as "Info",
  "month" as "Mois",
  COUNT(*) as "Nb Objectifs (> 0)",
  SUM("targetUnits") as "Total Unités"
FROM "ProductObjective"
WHERE "year" = 2026
  AND "targetUnits" > 0
GROUP BY "month"
ORDER BY "month";

-- Afficher un exemple pour AMOXICILLINE
SELECT
  '=== EXEMPLE : AMOXICILLINE 250 MG au Sénégal (SN) ===' as "Info",
  po."month" as "Mois",
  po."targetUnits" as "Objectif Unités",
  to_char(po."updatedAt", 'YYYY-MM-DD HH24:MI') as "Modifié le"
FROM "ProductObjective" po
JOIN "Product" p ON p."id" = po."productId"
WHERE p."name" ILIKE '%AMOXICILLINE 250%'
  AND po."countryCode" = 'SN'
  AND po."year" = 2026
ORDER BY po."month";

COMMIT;

-- Message de confirmation
SELECT
  '✅ PROPAGATION TERMINÉE' as "Statut",
  'Les objectifs du mois 8 ont été propagés aux mois 1-7' as "Message",
  'Rechargez votre application pour voir les changements' as "Action";
