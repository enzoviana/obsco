# Import CSV des Produits

## Vue d'ensemble

La fonctionnalité d'import CSV permet d'importer en masse des produits dans le système via un fichier CSV.

## Format du fichier CSV

### Colonnes requises

- **nom** (ou `name`, `designation`) : Nom du produit (obligatoire)
- **laboratoire** (ou `laboratory`, `labo`) : Nom du laboratoire fabricant (obligatoire)

### Colonnes optionnelles

- **cip** (ou `code`) : Code CIP du produit. Si non fourni, un code sera généré automatiquement au format `NOCIP-{timestamp}-{random}`
- **type** (ou `category`, `categorie`) : Type de produit (Médicament, Parapharmacie, etc.). Par défaut : "Médicament"
- **prix** (ou `price`, `baseprice`) : Prix de base du produit en euros. Par défaut : 0

### Séparateurs acceptés

Le fichier CSV peut utiliser :
- Virgule (`,`)
- Point-virgule (`;`)

## Exemple de fichier CSV

```csv
nom,laboratoire,cip,type,prix
Paracétamol 500mg,LABORATOIRE X,3400936000001,Médicament,2.50
Ibuprofène 400mg,LABORATOIRE Y,3400938000002,Médicament,3.20
Vitamine C 1000mg,LABORATOIRE Z,,Complément alimentaire,5.00
Gel hydroalcoolique 500ml,LABORATOIRE A,,Hygiène,3.50
```

## Utilisation

1. **Préparer le fichier CSV** : Créez un fichier CSV avec les colonnes requises
2. **Accéder à la page Produits** : `/produits`
3. **Cliquer sur "Importer CSV"**
4. **Sélectionner le fichier** : Choisissez votre fichier CSV
5. **Vérifier l'aperçu** : Le système affiche un aperçu des produits qui seront importés
6. **Lancer l'import** : Cliquez sur "Importer X produit(s)"

## Comportement

- **Création** : Si un produit avec le même CIP n'existe pas, il est créé
- **Mise à jour** : Si un produit avec le même CIP existe déjà, il est mis à jour avec les nouvelles informations
- **Validation** : Les données sont validées avant import. Les erreurs sont signalées dans la console

## Modèle de fichier

Un modèle CSV peut être téléchargé directement depuis la fenêtre d'import en cliquant sur "Télécharger un modèle".

## Permissions

Seuls les utilisateurs avec le rôle `super_admin` peuvent importer des produits.

## API Endpoint

```
POST /api/import/products
```

**Body** (JSON) :
```json
[
  {
    "name": "Paracétamol 500mg",
    "laboratory": "LABORATOIRE X",
    "cip": "3400936000001",
    "category": "Médicament",
    "basePrice": 2.50
  }
]
```

**Réponse** :
```json
{
  "success": true,
  "message": "Import terminé: 2 créés, 1 mis à jour",
  "created": 2,
  "updated": 1,
  "errors": []
}
```
