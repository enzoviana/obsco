# 📊 Structure du fichier d'import - Identique à Sorties Locales

## Vue d'ensemble

Le fichier CSV/XLSX téléchargé depuis `/import` a **exactement la même structure** que le tableau "Sorties Locales" :
- En-têtes sur **2 lignes**
- Une colonne **Produit** à gauche
- **3 colonnes par fournisseur** : Ventes | Stocks | Cmd
- Une colonne **Total** à droite (somme de ligne)
- Une ligne **TOTAL** en bas (somme de colonne)

---

## 📋 Structure détaillée

### Exemple pour une agence avec 3 fournisseurs (CAMED, COPHARMED, LABOREX MALI)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  Produit          │      CAMED        │     COPHARMED     │   LABOREX MALI    │     Total     │
│                   ├───────┬───────┬───┼───────┬───────┬───┼───────┬───────┬───┼───────┬───────┤
│                   │Ventes │Stocks │Cmd│Ventes │Stocks │Cmd│Ventes │Stocks │Cmd│Ventes │Stocks │Cmd│
├───────────────────┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┤
│Paracétamol 500mg  │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │
│(3400900000001)    │       │       │   │       │       │   │       │       │   │       │       │   │
├───────────────────┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┤
│Ibuprofène 400mg   │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │
│(3400900000002)    │       │       │   │       │       │   │       │       │   │       │       │   │
├───────────────────┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┼───────┼───────┼───┤
│TOTAL              │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │   0   │   0   │ 0 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔢 Structure CSV

### En-têtes (2 lignes)

**Ligne 1 - Noms des fournisseurs**
```csv
Produit;CAMED;;;COPHARMED;;;LABOREX MALI;;;Total;;
```

**Ligne 2 - Sous-colonnes**
```csv
Produit;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd
```

### Données (lignes de produits)

```csv
Paracétamol 500mg (3400900000001);0;0;0;0;0;0;0;0;0;0;0;0
Ibuprofène 400mg (3400900000002);0;0;0;0;0;0;0;0;0;0;0;0
Amoxicilline 1g (3400900000003);0;0;0;0;0;0;0;0;0;0;0;0
```

### Total (dernière ligne)

```csv
TOTAL;0;0;0;0;0;0;0;0;0;0;0;0
```

---

## 📊 Structure XLSX (Excel)

### Feuille : "Import Données"

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Produit** | **CAMED** | | | **COPHARMED** | | | **LABOREX MALI** | | | **Total** | | |
| | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd |
| Paracétamol... | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Ibuprofène... | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **TOTAL** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** |

### Formatage Excel recommandé

- **Ligne 1** : En-têtes fournisseurs - Cellules fusionnées (3 colonnes par fournisseur)
- **Ligne 2** : Sous-en-têtes - Ventes | Stocks | Cmd
- **Colonne A** : Produits - Largeur automatique
- **Colonnes B-M** : Données numériques - Format nombre
- **Dernière ligne** : Total - Mise en forme gras
- **Dernières colonnes** : Total - Fond coloré

---

## 🎯 Logique des totaux

### Total de ligne (colonne Total)

Pour chaque produit :
```
Total Ventes = CAMED Ventes + COPHARMED Ventes + LABOREX MALI Ventes
Total Stocks = CAMED Stocks + COPHARMED Stocks + LABOREX MALI Stocks
Total Cmd    = CAMED Cmd    + COPHARMED Cmd    + LABOREX MALI Cmd
```

### Total de colonne (ligne TOTAL)

Pour chaque fournisseur :
```
CAMED Total Ventes = Somme de toutes les ventes CAMED
CAMED Total Stocks = Somme de tous les stocks CAMED
CAMED Total Cmd    = Somme de toutes les commandes CAMED
```

### Total global

Dernière cellule en bas à droite :
```
Total Global = Somme de tous les totaux de ligne
             = Somme de tous les totaux de colonne
```

---

## 📝 Instructions de remplissage

### 1. Télécharger le modèle

Depuis `/import`, cliquer sur "CSV" ou "XLSX" pour télécharger le fichier.

### 2. Remplir les données

- **NE PAS modifier** la structure (colonnes, en-têtes)
- **Remplir uniquement** les cellules de données (lignes 3+)
- **Ajouter des lignes** si besoin (nouveaux produits)
- Les totaux peuvent être **recalculés automatiquement** ou laissés à 0 (recalculés à l'import)

### 3. Valeurs acceptées

- **Ventes** : Nombre d'unités vendues (entier ≥ 0)
- **Stocks** : Nombre d'unités en stock (entier ≥ 0)
- **Cmd** : Nombre d'unités en commande (entier ≥ 0)

### 4. Format des produits

- **Colonne Produit** : Nom complet + CIP entre parenthèses
  ```
  Exemple : Paracétamol 500mg bte/20 (3400900000001)
  ```

---

## ⚠️ Règles importantes

### ✅ Autorisé

- Ajouter des lignes de produits
- Modifier les valeurs numériques
- Laisser des cellules vides (= 0)
- Supprimer des lignes de produits non utilisées

### ❌ Interdit

- Modifier les en-têtes (noms des fournisseurs)
- Supprimer des colonnes
- Ajouter des colonnes
- Modifier l'ordre des colonnes
- Fusionner des cellules (sauf en-têtes déjà fusionnés)

---

## 🔄 Workflow complet

```
1. Agence télécharge le modèle
   ├─ Fichier pré-rempli avec ses fournisseurs
   └─ Structure identique à Sorties Locales

2. Agence remplit le fichier
   ├─ Saisie des ventes, stocks, commandes
   └─ Optionnel : ajout de nouvelles lignes produits

3. Agence upload le fichier
   ├─ Validation automatique de la structure
   └─ Import des données dans la base

4. Données visibles
   ├─ Sorties Locales : tableau mis à jour
   ├─ Rapports : graphiques et statistiques
   └─ Dashboard : indicateurs actualisés
```

---

## 💡 Exemples de données réelles

### Exemple 1 : Données d'une agence normale

```csv
Produit;CAMED;Ventes;Stocks;Cmd;COPHARMED;Ventes;Stocks;Cmd;Total;Ventes;Stocks;Cmd
;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd
Paracétamol 500mg (3400900000001);150;800;200;80;300;100;230;1100;300
Ibuprofène 400mg (3400900000002);90;450;150;110;600;0;200;1050;150
Amoxicilline 1g (3400900000003);200;1200;300;0;0;0;200;1200;300
TOTAL;440;2450;650;190;900;100;630;3350;750
```

### Exemple 2 : Produit disponible chez un seul fournisseur

```csv
Produit;CAMED;Ventes;Stocks;Cmd;LABOREX MALI;Ventes;Stocks;Cmd;Total;Ventes;Stocks;Cmd
;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd
Médicament exclusif (3400900000099);0;0;0;500;2000;1000;500;2000;1000
```

---

## 📞 Support

En cas de problème avec la structure du fichier :

1. Re-télécharger le modèle (version à jour)
2. Vérifier que les fournisseurs sont bien attribués à l'agence
3. Contacter l'administrateur si des fournisseurs sont manquants

---

**Structure validée et testée** ✅

Date : 26 juin 2026
