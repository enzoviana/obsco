-- Script pour supprimer les objectifs à 0
-- Cela permettra à la propagation de créer de nouveaux objectifs

DELETE FROM "ProductObjective"
WHERE "targetUnits" = 0 AND "targetCA" = 0;

-- Vérifier le nombre d'objectifs restants
SELECT COUNT(*) as "Objectifs valides restants"
FROM "ProductObjective"
WHERE "targetUnits" > 0 OR "targetCA" > 0;
