-- ==========================================
-- SCRIPT DE TEST : Propagation Rétroactive
-- ==========================================

-- 1. NETTOYAGE : Supprimer les objectifs à 0
-- (Permet de tester la création automatique)
DELETE FROM "ProductObjective"
WHERE "targetUnits" = 0 AND "targetCA" = 0;

-- Vérifier le nettoyage
SELECT
  COUNT(*) as "Objectifs restants (> 0)",
  COUNT(DISTINCT "productId") as "Produits avec objectifs",
  COUNT(DISTINCT "countryCode") as "Pays avec objectifs"
FROM "ProductObjective"
WHERE "targetUnits" > 0 OR "targetCA" > 0;

-- ==========================================
-- 2. VÉRIFICATION : État actuel des objectifs
-- ==========================================

-- Voir tous les objectifs pour AMOXICILLINE 250 MG au Sénégal (SN)
SELECT
  p."name" as "Produit",
  po."countryCode" as "Pays",
  po."year" as "Année",
  po."month" as "Mois",
  po."targetUnits" as "Objectif Unités",
  po."targetCA" as "Objectif CA",
  to_char(po."createdAt", 'YYYY-MM-DD HH24:MI') as "Créé le",
  to_char(po."updatedAt", 'YYYY-MM-DD HH24:MI') as "Mis à jour le"
FROM "ProductObjective" po
JOIN "Product" p ON p."id" = po."productId"
WHERE
  p."name" ILIKE '%AMOXICILLINE 250%'
  AND po."countryCode" = 'SN'
  AND po."year" = 2026
ORDER BY po."month" ASC;

-- ==========================================
-- 3. VUE GLOBALE : Objectifs par produit/pays
-- ==========================================

-- Nombre d'objectifs par produit et par pays
SELECT
  p."name" as "Produit",
  po."countryCode" as "Pays",
  COUNT(*) as "Nb Mois avec Objectifs",
  MIN(po."month") as "Premier Mois",
  MAX(po."month") as "Dernier Mois",
  AVG(po."targetUnits") as "Objectif Moyen (Unités)",
  SUM(po."targetUnits") as "Objectif Total Année"
FROM "ProductObjective" po
JOIN "Product" p ON p."id" = po."productId"
WHERE po."year" = 2026
GROUP BY p."name", po."countryCode"
ORDER BY "Objectif Total Année" DESC
LIMIT 20;

-- ==========================================
-- 4. DÉTECTION : Mois manquants
-- ==========================================

-- Produits qui ont des objectifs mais pas pour tous les mois
WITH product_months AS (
  SELECT
    po."productId",
    po."countryCode",
    array_agg(po."month" ORDER BY po."month") as "Mois avec objectifs"
  FROM "ProductObjective" po
  WHERE po."year" = 2026
  GROUP BY po."productId", po."countryCode"
)
SELECT
  p."name" as "Produit",
  pm."countryCode" as "Pays",
  pm."Mois avec objectifs",
  array_length(pm."Mois avec objectifs", 1) as "Nb Mois",
  CASE
    WHEN array_length(pm."Mois avec objectifs", 1) < 12 THEN 'INCOMPLET'
    ELSE 'COMPLET'
  END as "Statut"
FROM product_months pm
JOIN "Product" p ON p."id" = pm."productId"
WHERE array_length(pm."Mois avec objectifs", 1) < 12
ORDER BY array_length(pm."Mois avec objectifs", 1) ASC
LIMIT 10;

-- ==========================================
-- 5. STATISTIQUES : Vue d'ensemble
-- ==========================================

-- Statistiques globales
SELECT
  COUNT(DISTINCT "productId") as "Produits avec objectifs",
  COUNT(DISTINCT "countryCode") as "Pays avec objectifs",
  COUNT(DISTINCT concat("productId", '-', "countryCode")) as "Combinaisons Produit-Pays",
  COUNT(*) as "Total objectifs mensuels",
  AVG("targetUnits") as "Objectif moyen (unités)",
  SUM("targetUnits") as "Objectif total année (unités)"
FROM "ProductObjective"
WHERE "year" = 2026;

-- ==========================================
-- 6. EXEMPLE : Simulation de résultat après propagation
-- ==========================================

-- Si vous définissez un objectif de 2000 unités pour le mois 8,
-- voici à quoi devraient ressembler les données après propagation :
/*
EXEMPLE DE RÉSULTAT ATTENDU :

Produit                                    | Pays | Mois | Objectif | Statut
-------------------------------------------|------|------|----------|------------------
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 1    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 2    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 3    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 4    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 5    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 6    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 7    | 2000     | Créé/Mis à jour
AMOXICILLINE 250 MG/5ML OBCO              | SN   | 8    | 2000     | Sauvegardé (requis)
*/
