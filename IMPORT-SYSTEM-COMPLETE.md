# 🚀 Système d'Import Complet - DATAFUSE

## Vue d'ensemble

Le système d'import permet aux agences de téléverser leurs données mensuelles (Ventes, Stocks, Commandes) via un fichier CSV ou XLSX, avec prévisualisation et validation avant stockage en base de données.

---

## 📋 Workflow complet

```
1. Agence sélectionne la période (mois/année)
   ↓
2. Agence télécharge le modèle avec ses fournisseurs
   ↓
3. Agence remplit le fichier Excel/CSV
   ↓
4. Agence téléverse le fichier
   ↓
5. Système affiche une prévisualisation
   ↓
6. Agence valide l'import
   ↓
7. Données stockées en base de données
   ↓
8. Données disponibles dans Sorties Locales et Rapports
```

---

## 🎯 Structure de la base de données

### Nouveau modèle : `MonthlyData`

```prisma
model MonthlyData {
  id            String   @id @default(cuid())
  agencyId      String   // ID de l'agence
  productCip    String   // Code CIP du produit
  wholesalerId  String   // ID du grossiste/fournisseur
  year          Int      // Année (ex: 2026)
  month         Int      // Mois (1-12)
  sales         Int      // Ventes (unités vendues)
  stock         Int      // Stocks (unités en stock)
  orders        Int      // Commandes (unités commandées)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([agencyId, productCip, wholesalerId, year, month])
  @@index([agencyId, year, month])
  @@index([productCip])
}
```

**Contraintes :**
- Clé unique : Une seule entrée par combinaison (agence + produit + fournisseur + période)
- Si on réimporte pour la même période, les données sont mises à jour (upsert)

---

## 🔌 API Backend

### Fichier : `backend/src/routes/import.routes.ts`

#### 1. POST `/api/import/monthly` - Importer des données

**Authentification requise** : Oui (role: `agence`)

**Body :**
```json
{
  "year": 2026,
  "month": 6,
  "data": [
    {
      "productCip": "3400900000001",
      "productName": "Paracétamol 500mg",
      "suppliers": [
        {
          "wholesalerId": "WH-001",
          "wholesalerName": "CAMED",
          "sales": 150,
          "stock": 800,
          "orders": 200
        },
        {
          "wholesalerId": "WH-002",
          "wholesalerName": "COPHARMED",
          "sales": 80,
          "stock": 300,
          "orders": 100
        }
      ]
    }
  ]
}
```

**Réponse succès :**
```json
{
  "success": true,
  "message": "42 enregistrements importés avec succès",
  "count": 42
}
```

**Logique :**
- Vérifie que l'utilisateur est associé à une agence
- Valide les données avec Zod
- Pour chaque produit + fournisseur :
  - Utilise `upsert` : crée si n'existe pas, met à jour sinon
  - Ignore les fournisseurs inexistants
- Exécute toutes les opérations dans une transaction

#### 2. GET `/api/import/monthly/:year/:month` - Récupérer les données importées

**Authentification requise** : Oui (agence ou admin)

**Exemple :** `GET /api/import/monthly/2026/6`

**Réponse :**
```json
[
  {
    "id": "clxyz123",
    "agencyId": "AG-001",
    "productCip": "3400900000001",
    "wholesalerId": "WH-001",
    "year": 2026,
    "month": 6,
    "sales": 150,
    "stock": 800,
    "orders": 200,
    "createdAt": "2026-06-29T12:00:00Z",
    "updatedAt": "2026-06-29T12:00:00Z"
  }
]
```

#### 3. DELETE `/api/import/monthly/:year/:month` - Supprimer les données d'une période

**Authentification requise** : Oui (role: `agence`)

**Exemple :** `DELETE /api/import/monthly/2026/6`

**Réponse :**
```json
{
  "success": true,
  "message": "42 enregistrements supprimés",
  "count": 42
}
```

---

## 💻 Frontend

### Fichier : `src/routes/import.tsx`

#### Sélection de la période

```tsx
const [selectedYear, setSelectedYear] = useState(currentYear);
const [selectedMonth, setSelectedMonth] = useState(currentMonth);
```

- Permet de choisir le mois et l'année pour l'import
- Valeurs par défaut : mois et année actuels
- Options d'années : 5 ans en arrière + 1 an en avant

#### Téléchargement du modèle

Le modèle téléchargé contient :
- **Structure identique à Sorties Locales**
- **Fournisseurs filtrés par agence** (scope country + agency)
- **Colonnes nommées** : `{Fournisseur}_Ventes`, `{Fournisseur}_Stocks`, `{Fournisseur}_Cmd`
- **En-têtes sur 2 lignes** :
  - Ligne 1 : Noms des fournisseurs
  - Ligne 2 : Ventes | Stocks | Cmd
- **10 produits d'exemple**

#### Upload et parsing

```tsx
const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const rows = await parseUploadedFile(file);
  // Filtrer les en-têtes et lignes vides
  const dataRows = rows.slice(2).filter(row => {
    const produit = String(row.Produit || "").trim();
    return produit && produit !== "TOTAL" && produit !== "";
  });
  setParsed(dataRows);
}
```

**Parsing :**
1. Lire le fichier CSV/XLSX avec SheetJS
2. Ignorer les 2 premières lignes (en-têtes)
3. Filtrer les lignes vides et la ligne TOTAL
4. Afficher l'aperçu à l'utilisateur

#### Validation et import

```tsx
const validateAndImport = async () => {
  // 1. Transformer les données parsées
  const importData = {
    year: selectedYear,
    month: selectedMonth,
    data: []
  };

  // 2. Pour chaque ligne du fichier
  for (const row of parsed) {
    // Extraire le CIP depuis "Nom (CIP)"
    const cipMatch = produitStr.match(/\(([^)]+)\)$/);
    const cip = cipMatch[1];

    // Récupérer les données par fournisseur
    for (const supplierName of agencySuppliers) {
      const ventes = row[`${supplierName}_Ventes`];
      const stocks = row[`${supplierName}_Stocks`];
      const cmd = row[`${supplierName}_Cmd`];

      // Ajouter si au moins une valeur non nulle
      if (ventes > 0 || stocks > 0 || cmd > 0) {
        // ...
      }
    }
  }

  // 3. Envoyer à l'API
  const response = await fetch("/api/import/monthly", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(importData),
  });
}
```

---

## 🎨 Interface utilisateur

### 1. Sélection de la période

```
┌────────────────────────────────────────┐
│ 📅 Période d'import                    │
│                                        │
│ [Mois ▼]      [Année ▼]                │
│  Juin          2026                    │
│                                        │
│ Les données importées seront associées │
│ à la période sélectionnée              │
└────────────────────────────────────────┘
```

### 2. Fournisseurs attribués

```
┌────────────────────────────────────────┐
│ 📦 Fournisseurs attribués (3)          │
│                                        │
│ [CAMED] [COPHARMED] [LABOREX MALI]     │
│                                        │
│ Le fichier modèle contiendra          │
│ uniquement vos fournisseurs            │
└────────────────────────────────────────┘
```

### 3. Téléchargement du modèle

```
┌────────────────────────────────────────┐
│ 📥 1. Téléchargez le modèle            │
│                                        │
│ ✓ Structure identique à Sorties Locales│
│ ✓ En-têtes sur 2 lignes                │
│ ✓ Totaux automatiques                  │
│ ✓ Format accepté : CSV / XLSX          │
│                                        │
│ [CSV]  [XLSX]                          │
└────────────────────────────────────────┘
```

### 4. Upload du fichier

```
┌────────────────────────────────────────┐
│ 📤 2. Téléversez le fichier            │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │    📁                            │   │
│ │    Cliquez pour sélectionner     │   │
│ │    CSV · XLSX · max 10 Mo        │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### 5. Prévisualisation

```
┌────────────────────────────────────────┐
│ Aperçu de l'import · 47 produits      │
│ Période : Juin 2026                    │
│                                        │
│ [Annuler]  [Valider et importer]       │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │ Produit          │ CAMED_V │ ... │   │
│ │ Paracétamol...   │   150   │ ... │   │
│ │ Ibuprofène...    │    90   │ ... │   │
│ └──────────────────────────────────┘   │
│                                        │
│ ... 10 premières lignes affichées      │
└────────────────────────────────────────┘
```

---

## 🧪 Tests

### Test 1 : Import complet

1. Se connecter en tant qu'agence
2. Sélectionner **Juin 2026**
3. Télécharger le modèle XLSX
4. Remplir avec des données (ex: 150 ventes, 800 stocks)
5. Téléverser le fichier
6. ✅ Vérifier l'aperçu (47 produits)
7. Cliquer sur "Valider et importer"
8. ✅ Message de succès : "47 enregistrements importés"

### Test 2 : Réimport (mise à jour)

1. Réimporter le même fichier pour **Juin 2026**
2. Modifier quelques valeurs
3. ✅ Les anciennes données doivent être écrasées (upsert)

### Test 3 : Données visibles dans Sorties Locales

1. Aller sur `/sorties-locales`
2. Sélectionner l'agence importée
3. ✅ Les données importées doivent apparaître dans le tableau

### Test 4 : Filtrage des fournisseurs

1. Agence avec 2 fournisseurs (CAMED + COPHARMED)
2. Télécharger le modèle
3. ✅ Le fichier doit contenir exactement 2 groupes de colonnes (+ Total)

### Test 5 : Validation des erreurs

1. Téléverser un fichier avec un CIP invalide
2. ✅ L'import doit ignorer cette ligne et logger un warning

---

## ⚙️ Configuration

### Variables d'environnement

**Backend (.env) :**
```bash
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=...
```

**Frontend (.env) :**
```bash
VITE_API_URL=https://evening-sierra-79086-961c10c199fc.herokuapp.com
```

---

## 📊 Format du fichier d'import

### CSV (séparateur: `;`)

```csv
Produit;CAMED;;;COPHARMED;;;Total;;
;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd;Ventes;Stocks;Cmd
Paracétamol 500mg (3400900000001);150;800;200;80;300;100;230;1100;300
Ibuprofène 400mg (3400900000002);90;450;150;110;600;0;200;1050;150
TOTAL;240;1250;350;190;900;100;430;2150;450
```

### XLSX (Excel)

| Produit | CAMED | | | COPHARMED | | | Total | | |
|---------|-------|---|---|-----------|---|---|-------|---|---|
| | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd | Ventes | Stocks | Cmd |
| Paracétamol... | 150 | 800 | 200 | 80 | 300 | 100 | 230 | 1100 | 300 |

---

## 🔐 Sécurité

1. **Authentification** : Route protégée par JWT
2. **Autorisation** : Seules les agences peuvent importer
3. **Validation** : Schema Zod pour valider les données
4. **Isolation** : Chaque agence ne voit que ses données
5. **Transaction** : Rollback automatique en cas d'erreur

---

## 🚀 Déploiement

### Migration de la base de données

```bash
cd backend
npx prisma migrate deploy
```

### Redémarrer les services

```bash
# Backend
cd backend
npm run dev

# Frontend
npm run dev
```

---

## 📝 Notes importantes

1. **Upsert automatique** : Les données existantes pour la même période sont écrasées
2. **Filtrage intelligent** : Seuls les fournisseurs attribués à l'agence sont inclus
3. **Valeurs par défaut** : Les cellules vides sont traitées comme 0
4. **Ligne TOTAL** : Ignorée lors de l'import (recalculée dynamiquement)
5. **Performance** : Import en transaction pour garantir la cohérence

---

## 🎯 Prochaines améliorations possibles

1. **Historique des imports** : Voir tous les imports précédents
2. **Validation avancée** : Détecter les incohérences (stocks négatifs, etc.)
3. **Import incrémental** : Ajouter des données sans écraser
4. **Export depuis Sorties Locales** : Format identique au modèle d'import
5. **Notifications** : Email de confirmation après import réussi
6. **Graphiques** : Visualiser l'évolution des imports mois par mois

---

**Statut : ✅ Système complet et opérationnel**

Date : 29 juin 2026

Le système d'import est maintenant entièrement fonctionnel avec prévisualisation, validation et stockage en base de données PostgreSQL.
