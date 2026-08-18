-- ==========================================
-- PROPAGATION RÉTROACTIVE DES OBJECTIFS EXISTANTS
-- ==========================================
-- Ce script propage les objectifs du mois 8 (Août) vers les mois 1-7
-- pour tous les produits/pays qui ont un objectif en Août mais pas avant

-- 1. ÉTAPE 1 : Voir l'état actuel
-- ==========================================

SELECT
  p."name" as "Produit",
  po."countryCode" as "Pays",
  po."month" as "Mois",
  po."targetUnits" as "Objectif Unités",
  po."targetCA" as "Objectif CA"
FROM "ProductObjective" po
JOIN "Product" p ON p."id" = po."productId"
WHERE po."year" = 2026
  AND po."targetUnits" > 0
ORDER BY p."name", po."countryCode", po."month";

-- ==========================================
-- 2. ÉTAPE 2 : Propager les objectifs du mois 8 vers les mois 1-7
-- ==========================================

-- Pour chaque combinaison produit/pays qui a un objectif au mois 8,
-- créer/mettre à jour les objectifs des mois 1-7

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
),
months_to_create AS (
  -- Générer les mois 1 à 7 pour chaque objectif du mois 8
  SELECT
    o8."productId",
    o8."countryCode",
    o8."year",
    m.month_number as "month",
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
)
-- Insérer ou mettre à jour les objectifs
INSERT INTO "ProductObjective" ("productId", "countryCode", "year", "month", "targetUnits", "targetCA")
SELECT
  mtc."productId",
  mtc."countryCode",
  mtc."year",
  mtc."month",
  mtc."targetUnits",
  mtc."targetCA"
FROM months_to_create mtc
ON CONFLICT ("productId", "countryCode", "year", "month")
DO UPDATE SET
  "targetUnits" = CASE
    -- Mettre à jour seulement si l'objectif existant est 0
    WHEN EXCLUDED."targetUnits" = 0 THEN EXCLUDED."targetUnits"
    -- Sinon garder la valeur existante si elle est > 0
    WHEN "ProductObjective"."targetUnits" > 0 THEN "ProductObjective"."targetUnits"
    -- Sinon utiliser la nouvelle valeur
    ELSE EXCLUDED."targetUnits"
  END,
  "targetCA" = CASE
    WHEN EXCLUDED."targetCA" = 0 THEN EXCLUDED."targetCA"
    WHEN "ProductObjective"."targetCA" > 0 THEN "ProductObjective"."targetCA"
    ELSE EXCLUDED."targetCA"
  END,
  "updatedAt" = CURRENT_TIMESTAMP;

-- ==========================================
-- 3. VÉRIFICATION : Résultat après propagation
-- ==========================================

SELECT
  p."name" as "Produit",
  po."countryCode" as "Pays",
  COUNT(*) as "Nb Mois avec Objectifs",
  string_agg(po."month"::text, ', ' ORDER BY po."month") as "Mois",
  AVG(po."targetUnits")::int as "Objectif Moyen",
  CASE
    WHEN COUNT(*) >= 8 THEN '✅ COMPLET'
    ELSE '⚠️ INCOMPLET'
  END as "Statut"
FROM "ProductObjective" po
JOIN "Product" p ON p."id" = po."productId"
WHERE po."year" = 2026
  AND po."targetUnits" > 0
GROUP BY p."name", po."countryCode"
ORDER BY "Statut" DESC, p."name", po."countryCode"
LIMIT 50;

-- ==========================================
-- 4. STATISTIQUES : Avant/Après
-- ==========================================

-- Nombre total d'objectifs par mois
SELECT
  "month" as "Mois",
  COUNT(*) as "Nb Objectifs (> 0)",
  COUNT(DISTINCT "productId") as "Nb Produits",
  COUNT(DISTINCT "countryCode") as "Nb Pays",
  SUM("targetUnits") as "Total Unités"
FROM "ProductObjective"
WHERE "year" = 2026
  AND "targetUnits" > 0
GROUP BY "month"
ORDER BY "month";
