# 🚀 Guide Rapide : Correction des Objectifs

## Problème
Vous avez des objectifs pour Août 2026, mais les rapports de Janvier à Juillet affichent "Objectif non défini".

## Solution en 2 Minutes

### Option 1 : Fallback Automatique (Recommandé - Immédiat)

Le fallback est **déjà actif** dans le code. Il suffit de redémarrer le backend :

```bash
cd backend
npm run dev
```

**C'est tout !** Les rapports affichent maintenant les objectifs d'Août pour les mois précédents.

**Test :**
1. Ouvrez `/sorties-locales/objectifs-pays`
2. Sélectionnez "Juillet 2026"
3. Vérifiez que les objectifs s'affichent ✅

---

### Option 2 : Créer Physiquement les Objectifs (Recommandé - Permanent)

Connectez-vous à Neon DB et exécutez le script :

**Via l'interface Neon :**
1. Allez sur https://console.neon.tech
2. Ouvrez votre projet
3. Cliquez sur "SQL Editor"
4. Copiez le contenu de `propagate-month-8-to-1-7.sql`
5. Collez et exécutez

**Via psql (ligne de commande) :**
```bash
# Remplacez par votre connection string
export DATABASE_URL="postgresql://neondb_owner:..."

# Exécutez le script
psql $DATABASE_URL -f backend/propagate-month-8-to-1-7.sql
```

**Résultat :**
- ✅ Les objectifs du mois 8 sont copiés vers les mois 1-7
- ✅ Les rapports affichent les bonnes valeurs
- ✅ Vous pouvez modifier chaque mois indépendamment

---

## Vérification

### Dans la BDD
```sql
-- Voir les objectifs pour AMOXICILLINE au Sénégal
SELECT
  "month" as "Mois",
  "targetUnits" as "Objectif"
FROM "ProductObjective"
WHERE "productId" = (
  SELECT "id" FROM "Product"
  WHERE "name" ILIKE '%AMOXICILLINE 250%'
  LIMIT 1
)
AND "countryCode" = 'SN'
AND "year" = 2026
ORDER BY "month";
```

**Résultat attendu :**
```
Mois | Objectif
-----|----------
1    | 2000
2    | 2000
3    | 2000
4    | 2000
5    | 2000
6    | 2000
7    | 2000
8    | 2000
```

### Dans l'Application

1. Allez sur `/sorties-locales/objectifs-pays`
2. Sélectionnez "Juillet 2026"
3. Cherchez "AMOXICILLINE"
4. Vérifiez que **Budget Mois = 2000** ✅

---

## Comportement pour le Futur

Quand vous créez un nouvel objectif (par exemple en Septembre) :

**Avant :**
```
Mois 1-8 : 2000 unités (créés par le script)
Mois 9 : pas d'objectif
```

**Action :** Définir 3000 unités pour Septembre dans `/produits-objectifs`

**Après (automatique) :**
```
Mois 1-8 : 2000 unités (INCHANGÉ car > 0)
Mois 9 : 3000 unités (CRÉÉ)
```

**Si vous modifiez un mois à 0, puis définissez un objectif futur :**
```
Mois 1 : 2000 → vous modifiez à 0
Mois 2-8 : 2000 unités
Mois 9 : vous définissez 3000

Résultat :
Mois 1 : 3000 (mis à jour car était 0)
Mois 2-8 : 2000 (INCHANGÉ car > 0)
Mois 9 : 3000 (CRÉÉ)
```

---

## Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `SOLUTION_OBJECTIFS_RETROACTIFS.md` | Documentation complète |
| `propagate-month-8-to-1-7.sql` | Script de propagation simple |
| `fix-existing-objectives.sql` | Script complet avec diagnostics |
| `test-propagation.sql` | Tests et vérifications |

---

## Aide

**Logs Backend**

Quand vous consultez un rapport, vous verrez :
```
🔄 [Fallback] Aucun objectif pour mois 7 → Mois 8 pour CIP NOCIP-xxx pays SN (2000 unités)
```

**Logs Propagation**

Quand vous créez un objectif :
```
📅 [Propagation rétroactive] Mois 9 (3000 unités) → 1 mois créés, 1 mois mis à jour
```

---

## En Cas de Problème

1. **Les objectifs ne s'affichent toujours pas**
   - Vérifiez que le backend est redémarré
   - Vérifiez que les objectifs existent dans la BDD (requête SQL ci-dessus)
   - Vérifiez les logs du backend

2. **Le script SQL échoue**
   - Vérifiez que vous êtes connecté à la bonne base
   - Vérifiez que la table `ProductObjective` existe
   - Envoyez-moi l'erreur complète

3. **Je veux tout recommencer**
   ```sql
   -- Supprimer tous les objectifs à 0
   DELETE FROM "ProductObjective" WHERE "targetUnits" = 0;

   -- Re-exécuter le script de propagation
   psql $DATABASE_URL -f backend/propagate-month-8-to-1-7.sql
   ```
