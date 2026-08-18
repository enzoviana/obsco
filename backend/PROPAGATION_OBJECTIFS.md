# 📅 Propagation Rétroactive des Objectifs Produits

## Logique Implémentée

Quand vous définissez un objectif pour un produit/pays/mois, le système propage **automatiquement** cet objectif aux **mois précédents** de la même année.

### Règles de Propagation

| Situation | Action |
|-----------|--------|
| Mois précédent **sans objectif** | ✅ Créer un objectif avec la valeur actuelle |
| Mois précédent avec objectif **= 0** | ✅ Mettre à jour avec la valeur actuelle |
| Mois précédent avec objectif **> 0** | ⛔ Ne rien toucher (garder la valeur existante) |
| Objectif actuel **= 0** | ⛔ Pas de propagation |

---

## 📊 Exemples

### Exemple 1 : Création d'un Nouvel Objectif

**Situation initiale (BDD) :**
```
Aucun objectif pour AMOXICILLINE au Sénégal (SN) en 2026
```

**Action :**
```http
PUT /api/objectives
{
  "productId": "cmrajpnet0003n9tdru8xon1t",
  "countryCode": "SN",
  "year": 2026,
  "month": 8,
  "targetUnits": 2000,
  "targetCA": 0
}
```

**Résultat en BDD :**
```json
[
  {"month": 1, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 2, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 3, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 4, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 5, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 6, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 7, "targetUnits": 2000, "targetCA": 0},  // ← Créé
  {"month": 8, "targetUnits": 2000, "targetCA": 0}   // ← Sauvegardé
]
```

**Log backend :**
```
📅 [Propagation rétroactive] Mois 8 (2000 unités) → 7 mois créés, 0 mois mis à jour
```

---

### Exemple 2 : Mise à Jour avec Objectifs à 0

**Situation initiale (BDD) :**
```json
[
  {"month": 1, "targetUnits": 0, "targetCA": 0},
  {"month": 2, "targetUnits": 0, "targetCA": 0},
  {"month": 3, "targetUnits": 0, "targetCA": 0},
  {"month": 4, "targetUnits": 0, "targetCA": 0},
  {"month": 5, "targetUnits": 0, "targetCA": 0},
  {"month": 6, "targetUnits": 0, "targetCA": 0},
  {"month": 7, "targetUnits": 0, "targetCA": 0}
]
```

**Action :**
```http
PUT /api/objectives
{
  "productId": "cmrajpnet0003n9tdru8xon1t",
  "countryCode": "SN",
  "year": 2026,
  "month": 8,
  "targetUnits": 2000,
  "targetCA": 0
}
```

**Résultat en BDD :**
```json
[
  {"month": 1, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 2, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 3, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 4, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 5, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 6, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 7, "targetUnits": 2000, "targetCA": 0},  // ← Mis à jour (était 0)
  {"month": 8, "targetUnits": 2000, "targetCA": 0}   // ← Sauvegardé
]
```

**Log backend :**
```
📅 [Propagation rétroactive] Mois 8 (2000 unités) → 0 mois créés, 7 mois mis à jour
```

---

### Exemple 3 : Objectifs Mixtes (Respect des Valeurs > 0)

**Situation initiale (BDD) :**
```json
[
  {"month": 1, "targetUnits": 0, "targetCA": 0},      // Objectif à 0
  {"month": 2, "targetUnits": 0, "targetCA": 0},      // Objectif à 0
  {"month": 3, "targetUnits": 1500, "targetCA": 0},   // Objectif défini !
  {"month": 4, "targetUnits": 0, "targetCA": 0},      // Objectif à 0
  {"month": 5, "targetUnits": 1800, "targetCA": 0},   // Objectif défini !
  {"month": 6, "targetUnits": 0, "targetCA": 0}       // Objectif à 0
]
```

**Action :**
```http
PUT /api/objectives
{
  "productId": "cmrajpnet0003n9tdru8xon1t",
  "countryCode": "SN",
  "year": 2026,
  "month": 8,
  "targetUnits": 2000,
  "targetCA": 0
}
```

**Résultat en BDD :**
```json
[
  {"month": 1, "targetUnits": 2000, "targetCA": 0},   // ← Mis à jour (était 0)
  {"month": 2, "targetUnits": 2000, "targetCA": 0},   // ← Mis à jour (était 0)
  {"month": 3, "targetUnits": 1500, "targetCA": 0},   // ← INCHANGÉ (> 0)
  {"month": 4, "targetUnits": 2000, "targetCA": 0},   // ← Mis à jour (était 0)
  {"month": 5, "targetUnits": 1800, "targetCA": 0},   // ← INCHANGÉ (> 0)
  {"month": 6, "targetUnits": 2000, "targetCA": 0},   // ← Mis à jour (était 0)
  {"month": 7, "targetUnits": 2000, "targetCA": 0},   // ← Créé
  {"month": 8, "targetUnits": 2000, "targetCA": 0}    // ← Sauvegardé
]
```

**Log backend :**
```
📅 [Propagation rétroactive] Mois 8 (2000 unités) → 1 mois créés, 4 mois mis à jour
```

**Note :** Les mois 3 et 5 gardent leurs valeurs (1500 et 1800) car elles sont > 0.

---

### Exemple 4 : Désactivation de la Propagation

Si vous voulez modifier **uniquement le mois actuel** sans propagation :

```http
PUT /api/objectives
{
  "productId": "cmrajpnet0003n9tdru8xon1t",
  "countryCode": "SN",
  "year": 2026,
  "month": 8,
  "targetUnits": 2000,
  "targetCA": 0,
  "propagate": false  // ← Désactive la propagation
}
```

**Résultat :** Seul le mois 8 est modifié, les mois précédents restent inchangés.

---

## 🔧 Utilisation dans l'Interface

Quand vous utilisez la page **Objectifs produits par pays** (`/produits-objectifs`) :

1. Modifiez les objectifs dans la grille matricielle
2. Cliquez sur "Enregistrer"
3. Le backend applique automatiquement la propagation rétroactive
4. Les rapports mensuels (Rapport 1) affichent maintenant les objectifs corrects

---

## 🧪 Test Manual

### Vérifier la Propagation

```sql
-- Vérifier les objectifs pour un produit/pays
SELECT
  "month",
  "targetUnits",
  "targetCA",
  "createdAt",
  "updatedAt"
FROM "ProductObjective"
WHERE
  "productId" = 'cmrajpnet0003n9tdru8xon1t'
  AND "countryCode" = 'SN'
  AND "year" = 2026
ORDER BY "month" ASC;
```

### Nettoyer les Objectifs à 0 (Avant Test)

```sql
-- Supprimer tous les objectifs à 0 pour permettre une propagation propre
DELETE FROM "ProductObjective"
WHERE "targetUnits" = 0 AND "targetCA" = 0;
```

---

## 📝 Notes Techniques

- **Performance** : La propagation utilise des requêtes individuelles pour respecter la logique conditionnelle
- **Transaction** : Pas de transaction explicite car Prisma gère l'atomicité par défaut
- **Logging** : Les logs backend indiquent le nombre de mois créés/mis à jour
- **Idempotence** : Appeler plusieurs fois la même requête ne crée pas de doublons

---

## 🚨 Cas Particuliers

### Objectif = 0
Si vous définissez `targetUnits = 0` pour le mois M, **aucune propagation** ne se produit.
Cela permet de "désactiver" un objectif sans affecter les mois précédents.

### Changement d'Année
La propagation fonctionne **uniquement dans la même année**.
Si vous définissez un objectif en Janvier 2027, il ne propage pas vers Décembre 2026.

### Objectifs Négatifs
Impossible : la validation Zod impose `targetUnits >= 0`.
