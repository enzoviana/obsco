# 🎯 Solution Complète : Objectifs Rétroactifs

## Problème Identifié

Vous avez des objectifs définis pour **Août 2026** (mois 8), mais quand vous consultez les rapports pour les mois précédents (Janvier à Juillet), les objectifs affichent **0**.

**Exemple :**
```json
// Base de données actuelle
{"productId": "cmrajpnet0003n9tdru8xon1t", "countryCode": "SN", "year": 2026, "month": 8, "targetUnits": 2000}

// Mais pour les mois 1-7 : pas d'objectifs ou targetUnits = 0
```

**Résultat :** Les rapports mensuels (Rapport 1) pour Janvier à Juillet affichent "Objectif mensuel non défini".

---

## ✅ Double Solution Implémentée

### Solution 1️⃣ : Fallback Automatique (API)

**Fichier modifié :** `/backend/src/routes/reports.routes.ts`

**Logique :**
- Quand l'API récupère les objectifs pour le mois M
- Si objectif du mois M = 0 ou n'existe pas
- Elle cherche automatiquement dans les mois M+1 à 12
- Utilise le premier objectif > 0 trouvé

**Avantage :** Fonctionne immédiatement sans modifier la BDD

**Exemple :**
```
Requête : GET /api/reports/objectives-summary?year=2026&month=7
BDD : Pas d'objectif pour Juillet, mais objectif de 2000 pour Août
Résultat : L'API retourne targetUnits = 2000 pour Juillet (fallback vers Août)
```

**Log backend :**
```
🔄 [Fallback] Aucun objectif pour mois 7 → Mois 8 pour CIP NOCIP-xxx pays SN (2000 unités)
```

---

### Solution 2️⃣ : Propagation Physique (Script SQL)

**Fichier :** `/backend/fix-existing-objectives.sql`

**Logique :**
- Trouve tous les objectifs du mois 8 avec targetUnits > 0
- Crée/met à jour les objectifs des mois 1-7 avec la même valeur
- Respecte les objectifs > 0 déjà définis (ne les écrase pas)

**Avantage :** Crée physiquement les objectifs dans la BDD

**Commande :**
```bash
psql $DATABASE_URL -f backend/fix-existing-objectives.sql
```

**Ou via l'interface Neon DB :**
1. Connectez-vous à https://console.neon.tech
2. Ouvrez votre base de données
3. Allez dans "SQL Editor"
4. Copiez/collez le contenu du fichier `fix-existing-objectives.sql`
5. Exécutez

**Résultat :**
```
Avant : 1 objectif (mois 8)
Après : 8 objectifs (mois 1-8) avec la même valeur
```

---

## 🚀 Recommandation : Utiliser les Deux

### Étape 1 : Activer le Fallback (Déjà Fait)

Le fallback automatique est déjà actif dans le code. Il suffit de redémarrer le backend :

```bash
cd backend
npm run dev
```

**Test immédiat :**
1. Allez sur `/sorties-locales/objectifs-pays`
2. Sélectionnez **Juillet 2026**
3. Vérifiez que les objectifs s'affichent (grâce au fallback vers Août)

---

### Étape 2 : Propager Physiquement (Optionnel)

Exécutez le script SQL pour créer physiquement les objectifs dans la BDD :

```bash
# Méthode 1 : Via psql
export DATABASE_URL="postgresql://neondb_owner:..."
psql $DATABASE_URL -f backend/fix-existing-objectives.sql

# Méthode 2 : Via Neon Console
# Copiez le contenu de fix-existing-objectives.sql
# Collez dans l'éditeur SQL de Neon
# Exécutez
```

**Avantage de la propagation physique :**
- Meilleure performance (pas de fallback à chaque requête)
- Objectifs visibles dans les requêtes SQL directes
- Permet de modifier individuellement chaque mois si nécessaire

---

## 📊 Comparaison des Deux Approches

| Critère | Fallback Automatique | Propagation Physique |
|---------|---------------------|---------------------|
| **Installation** | ✅ Déjà actif | Nécessite SQL |
| **Performance** | 🟡 Légèrement plus lent | ✅ Rapide |
| **Flexibilité** | ✅ Dynamique | 🟡 Statique |
| **Visibilité BDD** | ❌ Objectifs virtuels | ✅ Objectifs réels |
| **Modification** | ⚠️ Change le mois futur | ✅ Change chaque mois |

---

## 🧪 Tests Recommandés

### Test 1 : Fallback Automatique

```bash
# Démarrer le backend
cd backend
npm run dev

# Ouvrir le frontend
cd ../
npm run dev

# Naviguer vers
http://localhost:5173/sorties-locales/objectifs-pays

# Sélectionner Juillet 2026
# Vérifier que les objectifs s'affichent
```

**Log backend attendu :**
```
🔄 [Fallback] Aucun objectif pour mois 7 → Mois 8 pour CIP NOCIP-1783422504318-meihstp pays SN (2000 unités)
```

---

### Test 2 : Propagation Physique

**Avant exécution du script :**
```sql
SELECT COUNT(*) FROM "ProductObjective" WHERE "year" = 2026;
-- Résultat : ~23 objectifs (seulement mois 7 et 8)
```

**Exécuter le script :**
```bash
psql $DATABASE_URL -f backend/fix-existing-objectives.sql
```

**Après exécution :**
```sql
SELECT COUNT(*) FROM "ProductObjective" WHERE "year" = 2026;
-- Résultat : ~184 objectifs (8 mois × 23 combinaisons)
```

**Vérifier pour un produit spécifique :**
```sql
SELECT
  "month",
  "targetUnits",
  "countryCode"
FROM "ProductObjective"
WHERE "productId" = 'cmrajpnet0003n9tdru8xon1t'
  AND "year" = 2026
ORDER BY "countryCode", "month";
```

**Résultat attendu :**
```
month | targetUnits | countryCode
------|-------------|------------
1     | 2000        | SN
2     | 2000        | SN
3     | 2000        | SN
4     | 2000        | SN
5     | 2000        | SN
6     | 2000        | SN
7     | 2000        | SN
8     | 2000        | SN
```

---

## 🔧 Comportement pour les Nouvelles Saisies

### Quand vous créez un objectif maintenant

**Page :** `/produits-objectifs`

**Action :** Définir un objectif de 3000 unités pour Septembre 2026

**Résultat automatique :**
1. L'objectif est sauvegardé pour Septembre (mois 9)
2. Le backend propage rétroactivement vers les mois 1-8 :
   - Si objectif existe et > 0 → **ne touche pas**
   - Si objectif = 0 → **met à jour à 3000**
   - Si objectif n'existe pas → **crée à 3000**

**Exemple avec données mixtes :**
```
État avant :
- Mois 1-7 : 2000 unités (créés par le script)
- Mois 8 : 2000 unités (existant)
- Mois 9 : pas d'objectif

Action : Définir 3000 pour mois 9

Résultat après :
- Mois 1-7 : 2000 unités (INCHANGÉ car > 0)
- Mois 8 : 2000 unités (INCHANGÉ car > 0)
- Mois 9 : 3000 unités (CRÉÉ)
```

---

## 📝 Résumé Technique

### Modifications Backend

**Fichier 1 :** `/backend/src/routes/crud.ts` (lignes 328-390)
- Propagation rétroactive lors de la création/modification d'objectifs
- Respecte les objectifs > 0 existants

**Fichier 2 :** `/backend/src/routes/reports.routes.ts` (lignes 334-470)
- Fallback automatique vers les mois futurs
- Logs détaillés des fallbacks

### Scripts SQL Créés

1. **`fix-existing-objectives.sql`** - Propage les objectifs du mois 8 vers les mois 1-7
2. **`test-propagation.sql`** - Tests et diagnostics
3. **`cleanup-zero-objectives.sql`** - Supprime les objectifs à 0

---

## ⚡ Action Immédiate

Pour activer immédiatement la solution sans modifier la BDD :

```bash
# 1. Redémarrer le backend
cd backend
npm run dev

# 2. Tester le Rapport 1
# Aller sur /sorties-locales/objectifs-pays
# Sélectionner n'importe quel mois de Janvier à Juillet
# Les objectifs d'Août s'affichent automatiquement
```

Pour une solution permanente avec objectifs physiques :

```bash
# Exécuter le script SQL
psql $DATABASE_URL -f backend/fix-existing-objectives.sql
```

---

## 🎉 Résultat Final

**Avant :**
- Objectifs visibles seulement pour Août
- Rapports Janvier-Juillet affichent "Objectif non défini"

**Après :**
- Objectifs visibles pour tous les mois (fallback ou physique)
- Rapports affichent les valeurs correctes
- Nouvelle saisie propage automatiquement aux mois précédents
