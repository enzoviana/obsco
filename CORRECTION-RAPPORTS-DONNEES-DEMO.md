# ✅ Correction : Données de démonstration dans les rapports

## Problème résolu

Les **Rapports 5 et 5bis** (ainsi que tous les autres rapports 1 à 8) affichaient des données aléatoires fictives même en mode Live, alors que les agences n'avaient encore importé aucune donnée Excel.

## Solutions appliquées

### 1. Modification des fonctions de génération de rapports (`src/lib/agencies.ts`)

Toutes les fonctions de rapport ont été modifiées pour retourner des données vides en mode Live :

#### ✅ Rapport 1 : `salesObjectivesByCountry()`
- **Avant** : Données aléatoires toujours affichées
- **Après** : Retourne des valeurs à 0 en mode Live

#### ✅ Rapport 2 : `salesObjectivesANF()`
- **Avant** : Données aléatoires toujours affichées
- **Après** : Retourne des valeurs à 0 en mode Live

#### ✅ Rapport 3 : `salesByUnit()`
- **Avant** : Données aléatoires toujours affichées
- **Après** : Retourne des valeurs à 0 en mode Live

#### ✅ Rapport 4 : `salesByRevenue()`
- **Avant** : Données aléatoires toujours affichées
- **Après** : Retourne des valeurs à 0 en mode Live

#### ✅ **Rapport 5 : `evolutionByRevenue()` (Évolution CA)**
- **Avant** : Données aléatoires sur 12 mois générées automatiquement
- **Après** : Retourne des valeurs à 0 pour tous les pays et tous les mois
- **Résultat** : Le graphique et le tableau sont vides jusqu'à ce que les agences importent des données

#### ✅ **Rapport 5bis/6 : `evolutionByUnits()` (Évolution Unités)**
- **Avant** : Données aléatoires sur 12 mois générées automatiquement
- **Après** : Retourne des valeurs à 0 pour tous les pays et tous les mois
- **Résultat** : Le graphique et le tableau sont vides jusqu'à ce que les agences importent des données

#### ✅ Rapports 7 et 8 : `stockSituation()`
- **Avant** : Données de stock fictives
- **Après** : Retourne des valeurs à 0 en mode Live

### 2. Message d'information ajouté (`src/routes/rapports.tsx`)

Un bandeau informatif bleu s'affiche en haut de la page Rapports en mode Live :

```
📊 Aucune donnée disponible

Les rapports affichent actuellement des données vides car les agences n'ont
pas encore importé leurs fichiers Excel.

Pour voir les données réelles : les agences doivent se connecter et utiliser
le module "Import données" pour uploader leurs fichiers Excel mensuels.
```

## Logique de fonctionnement

### Mode Démo (sans backend)
```typescript
// VITE_API_URL non configuré
API_ENABLED = false

→ Les fonctions génèrent des données aléatoires pour la démo
→ Permet de tester l'interface sans backend
```

### Mode Live (avec backend)
```typescript
// VITE_API_URL configuré
API_ENABLED = true

→ Les fonctions retournent des données vides (valeurs à 0)
→ Les agences doivent importer leurs fichiers Excel
→ Les données réelles remplaceront progressivement les valeurs vides
```

## Code exemple

Avant :
```typescript
export function evolutionByRevenue() {
  const r = rand(55);
  return MONTHS.map((m, i) => {
    const base = 700_000 + i * 25_000;
    // ... génération de données aléatoires
  });
}
```

Après :
```typescript
export function evolutionByRevenue() {
  // En mode Live, retourner des données vides (Rapport 5)
  if (API_ENABLED) {
    return MONTHS.map((m) => {
      const row: Record<string, number | string> = { mois: m };
      for (const c of COUNTRIES) {
        row[c.code] = 0;
      }
      row.total = 0;
      return row;
    });
  }

  // Mode Démo : générer des données aléatoires
  const r = rand(55);
  return MONTHS.map((m, i) => {
    const base = 700_000 + i * 25_000;
    // ... génération de données aléatoires
  });
}
```

## Workflow utilisateur

### 1. État initial (après installation)
```
Super-Admin → Page Rapports
          ↓
    Tous les rapports affichent 0
          ↓
    Message : "Aucune donnée disponible"
```

### 2. Import de données par les agences
```
Agence se connecte → Module "Import données"
          ↓
    Upload fichier Excel mensuel
          ↓
    Données enregistrées dans la base de données
```

### 3. Affichage des données réelles
```
Super-Admin → Page Rapports
          ↓
    Les graphiques et tableaux se remplissent progressivement
          ↓
    Données réelles des agences affichées
```

## Fichiers modifiés

### Backend
Aucune modification backend nécessaire (les endpoints existent déjà pour l'import de données)

### Frontend
✅ `src/lib/agencies.ts` - 7 fonctions modifiées :
- `salesObjectivesByCountry()`
- `salesObjectivesANF()`
- `salesByUnit()`
- `salesByRevenue()`
- `evolutionByRevenue()` ← **Rapport 5**
- `evolutionByUnits()` ← **Rapport 5bis/6**
- `stockSituation()`

✅ `src/routes/rapports.tsx` - Message informatif ajouté

## Tests à effectuer

### ✅ Mode Live (production)
1. Accéder à `/rapports`
2. Vérifier que le message informatif s'affiche
3. Vérifier que tous les graphiques affichent des valeurs à 0
4. Vérifier que les tableaux montrent "0" ou "0%" pour toutes les cellules

### ✅ Mode Démo (développement)
1. Désactiver `VITE_API_URL` dans `.env`
2. Accéder à `/rapports`
3. Vérifier que les données aléatoires s'affichent
4. Vérifier que le message informatif ne s'affiche PAS

## Prochaines étapes

Pour que les rapports affichent des données réelles, vous devez :

1. **Créer le module d'import Excel** (si pas encore fait)
   - Interface pour uploader les fichiers Excel
   - Parser les données Excel
   - Enregistrer dans les tables appropriées

2. **Mapper les données importées aux rapports**
   - Créer des endpoints API pour récupérer les données réelles
   - Modifier les fonctions de rapport pour utiliser les données de l'API

3. **Tables de base de données recommandées**
   ```sql
   -- Ventes mensuelles par pays
   CREATE TABLE monthly_sales (
     id UUID PRIMARY KEY,
     agency_id UUID REFERENCES agencies(id),
     country_code VARCHAR(3),
     month INTEGER,
     year INTEGER,
     revenue DECIMAL,
     units INTEGER,
     created_at TIMESTAMP
   );

   -- Objectifs par pays
   CREATE TABLE country_objectives (
     id UUID PRIMARY KEY,
     country_code VARCHAR(3),
     month INTEGER,
     year INTEGER,
     target_revenue DECIMAL,
     target_units INTEGER
   );

   -- Stocks par pays
   CREATE TABLE country_stocks (
     id UUID PRIMARY KEY,
     country_code VARCHAR(3),
     stock_quantity INTEGER,
     in_transit_quantity INTEGER,
     threshold INTEGER,
     updated_at TIMESTAMP
   );
   ```

---

**Statut : ✅ Complété**

Date : 26 juin 2026

Les rapports n'affichent plus de données fictives en mode Live. Les agences peuvent maintenant importer leurs fichiers Excel pour remplir progressivement les rapports avec des données réelles.
