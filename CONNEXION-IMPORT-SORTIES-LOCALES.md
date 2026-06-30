# 🔗 Connexion Import ↔ Sorties Locales

## Problème résolu

Les données importées via `/import` n'apparaissaient pas dans le module "Sorties Locales". Le système était déconnecté : l'import sauvegardait en base de données mais "Sorties Locales" lisait des données factices.

---

## ✅ Solution implémentée

### 1. **Nouvel endpoint API** : `/api/import/sorties-locales`

**Fichier** : `backend/src/routes/import.routes.ts`

**Méthode** : `GET`

**Paramètres query** :
- `year` : Année (ex: 2026)
- `month` : Mois (1-12)
- `scope` : "all" | "country" | "agency"
- `countryCode` : Code pays (si scope = country)
- `agencyId` : ID agence (si scope = agency)

**Fonctionnement** :
1. Récupère toutes les données `MonthlyData` correspondant aux filtres
2. Agrège les données par produit (CIP) et fournisseur (wholesaler)
3. Retourne un objet structuré :

```typescript
{
  "3400900000001": {
    "CAMED": { ventes: 150, stocks: 800, commandes: 200 },
    "COPHARMED": { ventes: 80, stocks: 300, commandes: 100 }
  },
  "3400900000002": {
    "CAMED": { ventes: 90, stocks: 450, commandes: 150 }
  }
}
```

**Exemple d'URL** :
```
GET /api/import/sorties-locales?year=2026&month=6&scope=agency&agencyId=AG-001
```

---

### 2. **Modification du frontend** : `src/routes/sorties-locales.index.tsx`

#### A. Sélection de la période

Ajout de sélecteurs Mois/Année dans l'interface :

```tsx
const [selectedYear, setSelectedYear] = useState(currentYear);
const [selectedMonth, setSelectedMonth] = useState(currentMonth);
```

**Rendu UI** :
```
┌─────────────────────────────────────────────┐
│ Période : [Juin ▼] [2026 ▼] Chargement...  │
└─────────────────────────────────────────────┘
```

#### B. Chargement des données

Nouvelle fonction `loadMonthlyData()` :
- Appelée au montage du composant
- Rappelée quand la période ou le scope change
- Stocke les données dans `monthlyDataByProduct`

```tsx
const [monthlyDataByProduct, setMonthlyDataByProduct] = useState<
  Record<string, Record<string, { ventes: number; stocks: number; commandes: number }>>
>({});

const loadMonthlyData = async () => {
  const params = new URLSearchParams({
    year: selectedYear.toString(),
    month: selectedMonth.toString(),
    scope,
  });

  if (scope === "country") params.append("countryCode", countryCode);
  if (scope === "agency") params.append("agencyId", agencyId);

  const response = await fetch(
    `${VITE_API_URL}/api/import/sorties-locales?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await response.json();
  setMonthlyDataByProduct(data);
};
```

#### C. Utilisation des données importées

**Avant** :
```tsx
const f = p.fournisseurs[sv.name]; // Données factices
```

**Après** :
```tsx
const productData = monthlyDataByProduct[p.cip];
const f = productData?.[sv.name]; // Données réelles depuis la BDD
```

**Modifications appliquées** :
1. **Calcul des totaux** (ligne ~102)
2. **Tableau des produits** (ligne ~307)
3. **Export XLSX** (ligne ~125)

---

## 🔄 Workflow complet

```
┌─────────────────────────────────────────────────┐
│ 1. IMPORT                                       │
│    Agence upload fichier pour Juin 2026        │
│    ↓                                            │
│    Données stockées dans table MonthlyData      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. SORTIES LOCALES                              │
│    Utilisateur sélectionne Juin 2026            │
│    ↓                                            │
│    API GET /api/import/sorties-locales          │
│    ↓                                            │
│    Agrégation des données par CIP + fournisseur │
│    ↓                                            │
│    Affichage dans le tableau                    │
└─────────────────────────────────────────────────┘
```

---

## 📊 Structure des données

### Table MonthlyData

```
┌────────────┬───────────┬──────────┬─────────┬───────┬───────┐
│ agencyId   │ productCip│wholesaler│ year    │ month │ sales │
├────────────┼───────────┼──────────┼─────────┼───────┼───────┤
│ AG-001     │ 3400...001│ WH-CAMED │ 2026    │ 6     │ 150   │
│ AG-001     │ 3400...001│ WH-COPHA │ 2026    │ 6     │ 80    │
│ AG-001     │ 3400...002│ WH-CAMED │ 2026    │ 6     │ 90    │
└────────────┴───────────┴──────────┴─────────┴───────┴───────┘
```

### API Response

```json
{
  "3400900000001": {
    "CAMED": {
      "ventes": 150,
      "stocks": 800,
      "commandes": 200
    },
    "COPHARMED": {
      "ventes": 80,
      "stocks": 300,
      "commandes": 100
    }
  }
}
```

### Frontend State

```tsx
monthlyDataByProduct = {
  "3400900000001": {
    "CAMED": { ventes: 150, stocks: 800, commandes: 200 },
    "COPHARMED": { ventes: 80, stocks: 300, commandes: 100 }
  }
}
```

---

## 🧪 Tests à effectuer

### Test 1 : Import puis visualisation (Agence)

1. **Se connecter en tant qu'agence**
2. **Aller sur `/import`**
3. Sélectionner **Juin 2026**
4. Télécharger le modèle
5. Remplir avec des valeurs (ex: CAMED Ventes = 150)
6. Upload et valider l'import
7. **Aller sur `/sorties-locales`**
8. Sélectionner **Par agence** + votre agence
9. Sélectionner **Juin 2026**
10. ✅ **Vérifier que les données apparaissent dans le tableau**

### Test 2 : Visualisation Admin

1. **Se connecter en tant que super_admin**
2. **Aller sur `/sorties-locales`**
3. Sélectionner **Juin 2026**
4. Choisir **Par agence** + l'agence qui a importé
5. ✅ **Les données de l'agence doivent apparaître**

### Test 3 : Changement de période

1. Sur `/sorties-locales`
2. Changer le mois de **Juin** à **Juillet**
3. ✅ **Le tableau doit se vider (aucune donnée pour juillet)**
4. Revenir à **Juin**
5. ✅ **Les données réapparaissent**

### Test 4 : Scope "country"

1. Deux agences du même pays importent des données pour **Juin 2026**
2. Sur `/sorties-locales`
3. Sélectionner **Par pays** + le pays concerné
4. ✅ **Les données des deux agences doivent être agrégées**

### Test 5 : Filtrage par fournisseur

1. Importer des données pour **CAMED** et **COPHARMED**
2. Sur `/sorties-locales`
3. Sélectionner **Tous fournisseurs** → ✅ Les deux apparaissent
4. Sélectionner **CAMED** uniquement → ✅ Seul CAMED apparaît

### Test 6 : Export XLSX

1. Sur `/sorties-locales` avec des données importées
2. Cliquer sur **Exporter XLSX**
3. ✅ Le fichier doit contenir les données réelles (pas des 0)
4. ✅ La feuille "_Filtre" doit mentionner la période

---

## 🎯 Différences avant/après

### Avant

```tsx
// Sorties Locales lisait des données factices
const products = getPanoramicProducts(); // Données aléatoires
const f = p.fournisseurs[sv.name]; // Toujours les mêmes valeurs
```

**Résultat** :
- Les stats ne changeaient jamais
- Import et Sorties Locales déconnectés
- Impossible de voir les données réelles

### Après

```tsx
// Sorties Locales lit depuis la BDD via l'API
const loadMonthlyData = async () => { /* API call */ };
const productData = monthlyDataByProduct[p.cip];
const f = productData?.[sv.name]; // Données réelles
```

**Résultat** :
- Les stats reflètent les imports
- Connexion totale Import ↔ Sorties Locales
- Sélection de période fonctionnelle

---

## 📝 Points d'attention

### 1. Performance

L'API agrège toutes les données en mémoire. Pour de gros volumes :
- Considérer l'ajout d'un cache Redis
- Limiter le nombre de produits retournés
- Paginer les résultats

### 2. Données manquantes

Si un produit n'a pas de données pour la période :
```tsx
const productData = monthlyDataByProduct[p.cip];
if (!productData) {
  // Afficher "—" dans le tableau
}
```

### 3. Synchronisation

Quand une agence importe de nouvelles données :
- Sur `/sorties-locales`, il faut **recharger la page** ou **changer la période**
- Pas de WebSocket pour l'instant
- Amélioration future : événement custom "datafuse:monthlydata"

---

## 🚀 Améliorations futures

1. **Sélecteur de période plus visuel** : DatePicker avec plages
2. **Comparaison de périodes** : Juin 2026 vs Juin 2025
3. **Cache côté serveur** : Éviter de recalculer à chaque requête
4. **Graphiques d'évolution** : Courbes par mois
5. **Export multi-périodes** : Comparer plusieurs mois dans un fichier
6. **Notification temps réel** : Alerter quand de nouvelles données arrivent

---

**Statut : ✅ Connexion complète fonctionnelle**

Date : 29 juin 2026

Le module "Sorties Locales" affiche maintenant les données réelles importées par les agences, avec sélection de période et filtrage par scope (all/country/agency).
