# ✅ Structure du fichier d'import - Tests et validation

## Changements appliqués

Le fichier d'import (CSV/XLSX) téléchargé depuis `/import` a maintenant **exactement** la même structure que "Sorties Locales".

---

## 📊 Structure finale

### En-têtes (2 lignes)

**Ligne 1 : Noms des fournisseurs**
```
Produit | CAMED |  |  | COPHARMED |  |  | LABOREX MALI |  |  | Total |  |  |
```

**Ligne 2 : Sous-colonnes**
```
 | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd |
```

### Corps du tableau

**Lignes de produits**
```
Paracétamol 500mg (3400900000001) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
Ibuprofène 400mg (3400900000002)  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
```

### Pied de tableau

**Ligne Total**
```
TOTAL | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
```

---

## 🎯 Correspondance avec Sorties Locales

| Élément | Sorties Locales | Fichier Import | Status |
|---------|----------------|----------------|--------|
| Colonne Produit | ✅ Nom + CIP | ✅ Nom + CIP | ✅ |
| En-têtes fournisseurs | ✅ 2 lignes | ✅ 2 lignes | ✅ |
| Colonnes par fournisseur | ✅ 3 (V/S/C) | ✅ 3 (V/S/C) | ✅ |
| Colonne Total | ✅ Oui | ✅ Oui | ✅ |
| Ligne Total | ✅ Oui | ✅ Oui | ✅ |
| Fournisseurs filtrés | ✅ Scope | ✅ Scope | ✅ |

---

## 🧪 Tests à effectuer

### Test 1 : Téléchargement CSV

1. Se connecter en tant qu'agence
2. Aller sur `/import`
3. Cliquer sur "CSV"
4. Ouvrir le fichier dans Excel/LibreOffice
5. Vérifier la structure :
   - ✅ 2 lignes d'en-têtes
   - ✅ Colonne Produit à gauche
   - ✅ 3 colonnes par fournisseur
   - ✅ Colonne Total à droite
   - ✅ Ligne TOTAL en bas

### Test 2 : Téléchargement XLSX

1. Cliquer sur "XLSX"
2. Ouvrir dans Excel
3. Vérifier :
   - ✅ Feuille "Import Données"
   - ✅ Cellules fusionnées pour les fournisseurs (ligne 1)
   - ✅ Format numérique pour les colonnes de données
   - ✅ 10 produits d'exemple + ligne TOTAL

### Test 3 : Filtrage des fournisseurs

**Agence avec 2 fournisseurs (scope country)**
- ✅ Fichier contient 2 groupes de 3 colonnes
- ✅ Total sur 1+2*3+3 = 10 colonnes

**Agence avec 1 fournisseur dédié (scope agency)**
- ✅ Fichier contient 1 groupe de 3 colonnes
- ✅ Total sur 1+1*3+3 = 7 colonnes

**Admin**
- ✅ Fichier contient tous les fournisseurs actifs
- ✅ Exemple : 5 fournisseurs = 1+5*3+3 = 19 colonnes

### Test 4 : Cohérence avec Sorties Locales

1. Aller sur `/sorties-locales`
2. Sélectionner "Par agence" + choisir une agence
3. Noter les fournisseurs affichés et l'ordre des colonnes
4. Aller sur `/import`
5. Télécharger le modèle
6. ✅ Vérifier que les fournisseurs et l'ordre sont identiques

---

## 📋 Format détaillé généré

### Exemple pour agence avec 3 fournisseurs

```typescript
// En-tête ligne 1
["Produit", "CAMED", "", "", "COPHARMED", "", "", "LABOREX MALI", "", "", "Total", "", ""]

// En-tête ligne 2
["", "Ventes", "Stocks", "Cmd", "Ventes", "Stocks", "Cmd", "Ventes", "Stocks", "Cmd", "Ventes", "Stocks", "Cmd"]

// Ligne produit 1
["Paracétamol 500mg (3400900000001)", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// Ligne produit 2
["Ibuprofène 400mg (3400900000002)", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// ...

// Ligne Total
["TOTAL", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

---

## 🔧 Code modifié

### Fichier : `src/routes/import.tsx`

#### Génération de la structure

```typescript
// En-têtes sur 2 lignes
const headerRow1 = ["Produit"];
for (const supplier of agencySuppliers) {
  headerRow1.push(supplier, "", "");  // Nom + 2 cellules vides
}
headerRow1.push("Total", "", "");

const headerRow2 = [""];
for (let i = 0; i < agencySuppliers.length; i++) {
  headerRow2.push("Ventes", "Stocks", "Cmd");
}
headerRow2.push("Ventes", "Stocks", "Cmd");

// Lignes de données
const dataRows = products.map(p => {
  const row = [`${p.name} (${p.cip})`];

  let totalV = 0, totalS = 0, totalC = 0;

  for (const supplier of agencySuppliers) {
    row.push(0, 0, 0);  // Ventes, Stocks, Cmd
  }

  row.push(totalV, totalS, totalC);  // Total ligne

  return row;
});

// Ligne Total
const totalRow = ["TOTAL"];
for (let i = 0; i < agencySuppliers.length; i++) {
  totalRow.push(0, 0, 0);
}
totalRow.push(0, 0, 0);
```

---

## ✅ Validation

### Checklist de validation

- [x] En-têtes sur 2 lignes
- [x] Colonne Produit inclut nom + CIP
- [x] 3 colonnes par fournisseur (Ventes, Stocks, Cmd)
- [x] Colonne Total à droite
- [x] Ligne TOTAL en bas
- [x] Fournisseurs filtrés par scope (country + agency)
- [x] Format identique à Sorties Locales
- [x] 10 produits d'exemple inclus
- [x] Valeurs initialisées à 0
- [x] Export CSV fonctionnel
- [x] Export XLSX fonctionnel
- [x] Message informatif pour l'utilisateur
- [x] Avertissement si aucun fournisseur

---

## 📊 Exemple visuel

### Dans Excel

```
┌──────────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ Produit                  │      CAMED         │     COPHARMED      │   LABOREX MALI     │      Total         │
├──────────────────────────┼──────┬──────┬──────┼──────┬──────┬──────┼──────┬──────┬──────┼──────┬──────┬──────┤
│                          │Ventes│Stocks│ Cmd  │Ventes│Stocks│ Cmd  │Ventes│Stocks│ Cmd  │Ventes│Stocks│ Cmd  │
├──────────────────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│Paracétamol 500mg (...001)│  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │
│Ibuprofène 400mg (...002) │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │
│Amoxicilline 1g (...003)  │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │
├──────────────────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│TOTAL                     │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │  0   │
└──────────────────────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

---

## 🎯 Résultat attendu

✅ **Les agences reçoivent un fichier prêt à remplir** avec :
- Leur liste personnalisée de fournisseurs
- La même structure que dans l'application
- Des exemples de produits
- Des totaux à recalculer après remplissage

✅ **Format cohérent** entre :
- Page "Sorties Locales" (visualisation)
- Fichier d'import (saisie)
- Export depuis "Sorties Locales" (archivage)

---

**Statut : ✅ Implémenté et prêt pour tests**

Date : 26 juin 2026
