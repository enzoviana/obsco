# 📊 Guide Complet - Connexion des Rapports aux Données Réelles

## Vue d'ensemble

Ce guide détaille comment connecter les 9 rapports de l'application aux données réelles importées dans la base de données `MonthlyData`.

---

## ✅ Ce qui a été fait

### 1. Backend (`backend/src/routes/reports.routes.ts`)

**4 endpoints API créés** :

#### A. `GET /api/reports/monthly-summary`
- Retourne les totaux par produit pour un mois donné
- Paramètres : `year`, `month`, `scope`, `countryCode?`, `agencyId?`
- Format : `{ "CIP": { sales: 150, stock: 800, orders: 200 } }`

#### B. `GET /api/reports/evolution`
- Retourne l'évolution sur 12 mois (année complète)
- Paramètres : `year`, `scope`, `countryCode?`, `agencyId?`
- Format : `{ "CIP": { 1: {sales, stock, orders}, 2: {...}, ..., 12: {...} } }`

#### C. `GET /api/reports/by-country`
- Retourne les données agrégées par pays
- Paramètres : `year`, `month`
- Format : `{ "CIP": { "CI": {sales, stock, orders}, "SN": {...} } }`

#### D. `GET /api/reports/panoramic`
- Vue panoramique pour un produit
- Paramètres : `year`, `productCip`
- Format : `{ "CI": { 1: {sales, stock, orders}, ..., 12: {...} } }`

### 2. Frontend (`src/components/reports/shared.tsx`)

#### A. Sélecteur de période ajouté
```tsx
const [selectedYear, setSelectedYear] = useState(currentYear);
const [selectedMonth, setSelectedMonth] = useState(currentMonth);
```

#### B. Interface UI mise à jour
- Sélecteurs Mois/Année en haut de chaque rapport
- Bordure séparatrice entre période et scope

#### C. Hook `useMonthlyData` créé
```tsx
const { data, loading } = useMonthlyData(year, month, scope, countryCode, agencyId);
```

---

## 🚧 Ce qui reste à faire

### Étape 1 : Modifier chaque fonction `buildR*` pour utiliser les données API

Actuellement, les fonctions utilisent `prodRand()` pour générer des données aléatoires. Il faut les remplacer par les vraies données.

#### Exemple pour `buildR1` (Rapport Objectifs Pays) :

**AVANT** (données factices) :
```typescript
function buildR1(d: Data) {
  const factor = d.agencyFactor * (d.codeFilter ? 1 / Math.max(COUNTRIES.length, 1) : 1);
  const rows = d.products.slice(0, 60).map(p => {
    const ventes = Math.round(p.ventes * factor);  // ❌ Données aléatoires
    // ...
  });
}
```

**APRÈS** (données réelles) :
```typescript
function buildR1(d: Data, apiData: Record<string, { sales: number; stock: number; orders: number }>) {
  const rows = d.products.slice(0, 60).map(p => {
    const productData = apiData[p.cip] || { sales: 0, stock: 0, orders: 0 };
    const ventes = productData.sales;  // ✅ Données réelles
    // ...
  });
}
```

### Étape 2 : Passer les données API aux composants de rapport

**Modifier chaque composant `Report*` pour :**

1. Utiliser le hook `useMonthlyData`
2. Passer les données à la fonction `build*`
3. Afficher un état de chargement

**Exemple pour `ReportObjectifsPays` :**

```typescript
export function ReportObjectifsPays({ data, suffix, year, month, scope, countryCode, agencyId }: {
  data: Data;
  suffix: string;
  year: number;
  month: number;
  scope: Scope;
  countryCode: string;
  agencyId: string;
}) {
  // Charger les données depuis l'API
  const { data: apiData, loading } = useMonthlyData(year, month, scope, countryCode, agencyId);

  // Construire les lignes du rapport avec les données API
  const rows = useMemo(() => buildR1(data, apiData), [data, apiData]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  // ... reste du composant
}
```

### Étape 3 : Mettre à jour chaque page de rapport

Chaque page doit passer les nouveaux paramètres au composant :

**Exemple pour `/sorties-locales/objectifs-pays` :**

```typescript
function Page() {
  const navigate = useNavigate();
  const state = useScopeState();  // Contient maintenant year/month
  const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);

  useEffect(() => {
    if (typeof window !== "undefined" && !getUser()) navigate({ to: "/login" });
  }, [navigate]);

  return (
    <AppShell title="Rapport 1 — Objectifs / Pays" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportObjectifsPays
        data={data}
        suffix={state.fileSuffix}
        year={state.selectedYear}
        month={state.selectedMonth}
        scope={state.scope}
        countryCode={state.countryCode}
        agencyId={state.agencyId}
      />
    </AppShell>
  );
}
```

---

## 📋 Plan d'action détaillé

### Rapport 1 : Objectifs ventes par produit

**Données nécessaires** : `monthly-summary`

**Modifications** :
1. Modifier `buildR1` pour accepter `apiData`
2. Remplacer `p.ventes * factor` par `apiData[p.cip]?.sales || 0`
3. Calculer les budgets (à partir des objectifs si disponibles)
4. Modifier `ReportObjectifsPays` pour utiliser `useMonthlyData`

### Rapport 2 : Objectifs ANF

**Données nécessaires** : `monthly-summary` (scope="all")

**Modifications** : Similaires à R1

### Rapport 3 : Ventes par unités (produit × pays)

**Données nécessaires** : `by-country`

**Modifications** :
1. Créer un hook `useCountryData(year, month)`
2. Modifier `buildR3` pour utiliser les données par pays
3. Remplacer les calculs aléatoires par les vraies données

### Rapport 3bis : Ventes par CA

**Données nécessaires** : `by-country` + prix produits

**Modifications** :
1. Utiliser `useCountryData`
2. Multiplier `sales` par le prix unitaire du produit
3. Afficher en euros

### Rapport 4 : Évolution unités (mois × produit)

**Données nécessaires** : `evolution`

**Modifications** :
1. Créer un hook `useEvolutionData(year, scope, countryCode, agencyId)`
2. Modifier `buildR4` pour lire `apiData[cip][month]`
3. Afficher 12 colonnes avec les vraies données

### Rapport 4bis : Évolution CA

**Données nécessaires** : `evolution` + prix

**Modifications** : Similaires à R4, avec calcul du CA

### Rapport 5 : Stocks locaux par pays

**Données nécessaires** : `by-country` (champ `stock`)

**Modifications** :
1. Créer `useStocksData(year, scope, countryCode, agencyId)`
2. Modifier `buildR5` pour afficher les stocks par mois
3. **Note** : Actuellement les données sont agrégées par mois, pas de vue "12 mois"
   - Solution : Appeler l'API 12 fois (une par mois) ou créer un endpoint dédié

### Rapport 5bis : Stocks en cours

**Données nécessaires** : `by-country` (champ `orders`)

**Modifications** : Similaires à R5

### Rapport 6 : Vue panoramique

**Données nécessaires** : `panoramic`

**Modifications** :
1. Créer `usePanoramicData(year, productCip)`
2. Modifier le composant pour charger les données quand un produit est sélectionné
3. Afficher pays × mois avec les vraies données

---

## 🛠️ Hooks supplémentaires à créer

Dans `src/components/reports/shared.tsx`, ajouter :

```typescript
// Hook pour données par pays
export function useCountryData(year: number, month: number) {
  const [data, setData] = useState<Record<string, Record<string, { sales: number; stock: number; orders: number }>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com"}/api/reports/by-country?year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("datafuse_token")}`,
            },
          }
        );

        if (response.ok) {
          setData(await response.json());
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Erreur chargement by-country:", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year, month]);

  return { data, loading };
}

// Hook pour évolution annuelle
export function useEvolutionData(year: number, scope: Scope, countryCode: string, agencyId: string) {
  const [data, setData] = useState<Record<string, Record<number, { sales: number; stock: number; orders: number }>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          year: year.toString(),
          scope,
        });

        if (scope === "country") params.append("countryCode", countryCode);
        if (scope === "agency") params.append("agencyId", agencyId);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com"}/api/reports/evolution?${params}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("datafuse_token")}`,
            },
          }
        );

        if (response.ok) {
          setData(await response.json());
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Erreur chargement evolution:", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    if (agencyId || scope !== "agency") {
      loadData();
    }
  }, [year, scope, countryCode, agencyId]);

  return { data, loading };
}

// Hook pour vue panoramique
export function usePanoramicData(year: number, productCip: string) {
  const [data, setData] = useState<Record<string, Record<number, { sales: number; stock: number; orders: number }>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productCip) {
      setData({});
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://evening-sierra-79086-961c10c199fc.herokuapp.com"}/api/reports/panoramic?year=${year}&productCip=${productCip}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("datafuse_token")}`,
            },
          }
        );

        if (response.ok) {
          setData(await response.json());
        } else {
          setData({});
        }
      } catch (error) {
        console.error("Erreur chargement panoramic:", error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [year, productCip]);

  return { data, loading };
}
```

---

## 🎯 Ordre d'implémentation recommandé

### Phase 1 : Rapports mensuels simples
1. ✅ Rapport 3 : Ventes UN (par pays) - `useCountryData`
2. ✅ Rapport 3bis : Ventes CA - Même hook + prix

### Phase 2 : Rapports avec objectifs
3. ✅ Rapport 1 : Objectifs pays - `useMonthlyData`
4. ✅ Rapport 2 : Objectifs ANF - Même hook

### Phase 3 : Rapports d'évolution
5. ✅ Rapport 4 : Évolution UN - `useEvolutionData`
6. ✅ Rapport 4bis : Évolution CA - Même hook + prix

### Phase 4 : Stocks
7. ✅ Rapport 5 : Stocks pays - Nécessite endpoint dédié ou 12 appels
8. ✅ Rapport 5bis : Stocks en cours - Même approche

### Phase 5 : Vue panoramique
9. ✅ Rapport 6 : Vue panoramique - `usePanoramicData`

---

## ⚠️ Points d'attention

### 1. Prix des produits

Les rapports CA nécessitent le prix unitaire des produits. Deux options :

**Option A** : Inclure les prix dans l'API
```typescript
// Dans backend/src/routes/reports.routes.ts
const products = await prisma.product.findMany({
  select: { cip: true, basePrice: true },
});
const priceMap = new Map(products.map(p => [p.cip, p.basePrice]));

// Ajouter au résultat
result[cip] = {
  ...data,
  unitPrice: priceMap.get(cip) || 0,
};
```

**Option B** : Charger les prix côté frontend
```typescript
const products = getPanoramicProducts(); // Contient déjà les prix
const unitPrice = products.find(p => p.cip === cip)?.pghtPays || 0;
const ca = sales * unitPrice;
```

### 2. Objectifs (Budget)

Les rapports R1 et R2 comparent ventes vs budgets. Solutions :

**Option A** : Utiliser la table `ProductObjective`
```typescript
const objectives = await prisma.productObjective.findMany({
  where: { year, month, countryCode },
});
```

**Option B** : Calculer depuis historique (ventes N-1 + croissance)
```typescript
const lastYear = await prisma.monthlyData.findMany({
  where: { year: year - 1, month },
});
const budget = lastYearSales * 1.1; // +10% croissance
```

### 3. Stocks multi-mois (R5/R5bis)

Actuellement, `MonthlyData` stocke une ligne par mois. Pour afficher 12 mois :

**Option A** : Appeler l'API 12 fois
```typescript
const promises = [];
for (let m = 1; m <= 12; m++) {
  promises.push(fetch(`/api/reports/by-country?year=${year}&month=${m}`));
}
const results = await Promise.all(promises);
```

**Option B** : Créer un endpoint dédié `/api/reports/stocks-year`
```typescript
reportsRouter.get("/stocks-year", async (req, res) => {
  // Récupérer les 12 mois d'un coup
  const monthlyData = await prisma.monthlyData.findMany({
    where: { year: parseInt(req.query.year) },
  });
  // Grouper par mois...
});
```

---

## 📊 Exemple complet : Rapport 3 (Ventes UN)

### Backend (déjà fait)
`GET /api/reports/by-country?year=2026&month=6`

Retourne :
```json
{
  "3400900000001": {
    "CI": { "sales": 150, "stock": 800, "orders": 200 },
    "SN": { "sales": 80, "stock": 300, "orders": 100 }
  }
}
```

### Frontend (à faire)

**1. Créer le hook `useCountryData` (dans shared.tsx)**

**2. Modifier `buildR3` :**
```typescript
function buildR3(d: Data, kind: "un" | "ca", apiData: Record<string, Record<string, { sales: number }>>) {
  return d.products.slice(0, 60).map(p => {
    const row: Record<string, string | number> = { produit: p.name };
    let total = 0;

    for (const c of d.visibleCountries) {
      // ✅ Utiliser les données API au lieu de prodRand()
      const countryData = apiData[p.cip]?.[c.code];
      const v = kind === "un"
        ? (countryData?.sales || 0)
        : (countryData?.sales || 0) * p.pghtPays;

      row[c.code] = v;
      total += v;
    }

    row.total = kind === "un" ? Math.round(total) : +total.toFixed(2);
    return row;
  });
}
```

**3. Modifier le composant `ReportVentesUnits` :**
```typescript
export function ReportVentesUnits({ data, suffix, year, month }: {
  data: Data;
  suffix: string;
  year: number;
  month: number;
}) {
  const { data: apiData, loading } = useCountryData(year, month);
  const rows = useMemo(() => buildR3(data, "un", apiData), [data, apiData]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  // ... reste du composant (inchangé)
}
```

**4. Mettre à jour la page `/sorties-locales/ventes-un.tsx` :**
```typescript
function Page() {
  const navigate = useNavigate();
  const state = useScopeState();
  const data = useScopedReportData(state.scope, state.countryCode, state.agencyId);

  return (
    <AppShell title="Rapport 3 · Ventes (UN)" subtitle={`Sorties Locales · ${state.scopeLabel}`}>
      <ScopeSelector {...state} />
      <ReportVentesUnits
        data={data}
        suffix={state.fileSuffix}
        year={state.selectedYear}
        month={state.selectedMonth}
      />
    </AppShell>
  );
}
```

---

## 🚀 Résumé

### Ce qui fonctionne déjà
✅ Backend API routes créées
✅ Sélecteur de période dans l'UI
✅ Hook `useMonthlyData` créé
✅ Exemple complet pour Rapport 3

### Ce qui reste à faire
❌ Créer les hooks `useCountryData`, `useEvolutionData`, `usePanoramicData`
❌ Modifier les 9 fonctions `buildR*` pour utiliser les données API
❌ Modifier les 9 composants `Report*` pour charger les données
❌ Mettre à jour les 9 pages de rapport
❌ Gérer les prix et objectifs
❌ Créer l'endpoint pour stocks multi-mois

### Estimation
- ⏱️ **4-6 heures** pour connecter tous les rapports
- 🔧 **~30 fichiers** à modifier
- 🧪 **Tests nécessaires** pour chaque rapport

---

**Statut : 🟡 En cours - Infrastructure prête, implémentation restante**

Date : 29 juin 2026

Le backend est opérationnel, le frontend a les hooks de base. Il reste à connecter chaque rapport individuellement en suivant l'exemple du Rapport 3.
