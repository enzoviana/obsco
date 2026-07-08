# Import CSV des Sorties Locales

## Vue d'ensemble

La fonctionnalité d'import CSV permet d'importer en masse les données de sorties locales (ventes, stocks, commandes) par produit et par grossiste pour une agence et une période données.

**Le système supporte 2 formats de fichier CSV** pour s'adapter aux fichiers existants.

## Formats de fichier CSV supportés

### Format 1 : WIDE (format Excel classique)

Ce format correspond aux anciens fichiers Excel avec une ligne par produit et des colonnes pour chaque grossiste.

**Structure** :
```csv
Produit;GROSSISTE1 - Ventes;GROSSISTE1 - Stocks;GROSSISTE1 - Cmds;GROSSISTE2 - Ventes;GROSSISTE2 - Stocks;GROSSISTE2 - Cmds
Paracétamol 500mg;150;200;50;120;180;30
Ibuprofène 400mg;200;250;60;150;200;40
```

**Avantages** :
- Compatible avec vos fichiers Excel existants
- Vue d'ensemble sur une seule ligne par produit
- Facile à lire

**Colonnes** :
- **Produit** (ou `Nom`) : Nom du produit (obligatoire)
- **GROSSISTE - Ventes** : Nombre d'unités vendues pour ce grossiste
- **GROSSISTE - Stocks** : Stock disponible pour ce grossiste
- **GROSSISTE - Cmds** (ou `Commandes`) : Commandes en cours pour ce grossiste

Le système détecte automatiquement tous les grossistes présents dans l'en-tête.

### Format 2 : SIMPLE (format base de données)

Ce format a une ligne par combinaison produit/grossiste.

**Structure** :
```csv
cip,nom,grossiste,ventes,stocks,commandes,countryCode,ville
3400936000001,Paracétamol 500mg,CAMED,150,200,50,CI,Abidjan
3400938000002,Ibuprofène 400mg,LABOREX MALI,120,180,30,ML,Bamako
```

**Avantages** :
- Format normalisé base de données
- Facile à générer depuis des exports SQL
- Flexible pour ajouter des colonnes

**Colonnes requises** :
- **cip** (ou `code`) : Code CIP du produit (obligatoire)
- **grossiste** (ou `wholesaler`, `fournisseur`) : Nom du grossiste/fournisseur (obligatoire)

**Colonnes optionnelles** :
- **nom** (ou `name`, `produit`) : Nom du produit (pour référence)
- **ventes** (ou `sales`, `sortie`) : Nombre d'unités vendues. Par défaut : 0
- **stocks** (ou `stock`) : Stock disponible. Par défaut : 0
- **commandes** (ou `orders`) : Commandes en cours. Par défaut : 0
- **countryCode** (ou `pays`, `country`) : Code pays du grossiste (ex: FR, ML, CI). Par défaut : premier pays disponible
- **ville** (ou `city`) : Ville du grossiste

## Séparateurs acceptés

Les deux formats acceptent :
- **Virgule** (`,`)
- **Point-virgule** (`;`)

Le système détecte automatiquement le séparateur utilisé.

## Détection automatique du format

Le système détecte automatiquement le format utilisé :
- **Format WIDE** : Détecté si l'en-tête contient des colonnes du type "GROSSISTE - Ventes"
- **Format SIMPLE** : Détecté si l'en-tête contient les colonnes "cip" et "grossiste"

Vous n'avez rien à faire, le système s'adapte automatiquement !

## Création automatique des entités

### Grossistes

Si un grossiste mentionné dans le CSV n'existe pas dans la base de données, il sera **automatiquement créé** avec :
- Le nom spécifié dans la colonne `grossiste`
- Le code pays spécifié dans `countryCode` (ou le premier pays disponible par défaut)
- La ville spécifiée dans `ville` (optionnel)
- Un statut "actif"
- Un scope "country" (visible au niveau pays)

**Note importante** : Si le code pays spécifié n'existe pas dans la base de données, le système utilisera automatiquement le premier pays disponible.

### Produits

Si un produit mentionné dans le CSV n'existe pas dans la base de données, le système :
1. **Cherche d'abord par code CIP** : Si le CIP existe, le produit est associé automatiquement
2. **Cherche ensuite par nom** : Si le CIP n'existe pas mais qu'un produit avec un nom similaire existe, il sera automatiquement associé
3. **Crée le produit** : Si aucune correspondance n'est trouvée, un nouveau produit sera créé avec :
   - Le code CIP spécifié
   - Le nom du produit
   - Laboratoire par défaut : "Laboratoire inconnu"
   - Catégorie : "Médicament"
   - Prix de base : 0

Cette logique permet d'importer des données même si les produits n'existent pas encore dans la base.

## Utilisation

1. **Accéder à la page Sorties Locales** : `/sorties-locales`
2. **Cliquer sur "Importer CSV"** (bouton visible uniquement pour les Super Admin)
3. **Sélectionner les paramètres** :
   - Agence concernée
   - Année
   - Mois
4. **Sélectionner le fichier CSV** : Choisissez votre fichier ou téléchargez le modèle
5. **Vérifier l'aperçu** : Le système affiche un aperçu des données qui seront importées
6. **Lancer l'import** : Cliquez sur "Importer X ligne(s)"

## Comportement

- **Création/Mise à jour** : Si des données existent déjà pour le même produit, grossiste, agence et période, elles sont **mises à jour**. Sinon, elles sont **créées**.
- **Produits** : Les produits inexistants sont recherchés par CIP puis par nom, et créés automatiquement si aucune correspondance n'est trouvée
- **Grossistes** : Les grossistes inexistants sont créés automatiquement
- **Validation** : Les données sont validées avant import. Les erreurs sont signalées dans la console
- **Rechargement automatique** : Les données du tableau sont rechargées automatiquement après l'import

## Permissions

Seuls les utilisateurs avec le rôle `super_admin` peuvent importer des sorties locales.

## API Endpoint

```
POST /api/import/sorties-locales-csv
```

**Body** (JSON) :
```json
{
  "year": 2026,
  "month": 7,
  "agencyId": "cuid_agence",
  "data": [
    {
      "productCip": "3400936000001",
      "productName": "Paracétamol 500mg",
      "wholesalerName": "CAMED",
      "sales": 150,
      "stock": 200,
      "orders": 50,
      "countryCode": "CI",
      "city": "Abidjan"
    }
  ]
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Import terminé: 3 entrées créées/mises à jour, 1 grossistes créés",
  "created": 0,
  "updated": 3,
  "wholesalersCreated": 1,
  "errors": []
}
```

## Modèles CSV

Deux modèles CSV sont disponibles :

1. **Téléchargement depuis l'interface** : Cliquez sur "Télécharger un modèle" dans la fenêtre d'import
   - Le système vous proposera de choisir entre le format WIDE ou SIMPLE

2. **Fichiers de template** :
   - Format WIDE : `docs/template_import_sorties_locales_wide.csv`
   - Format SIMPLE : `docs/template_import_sorties_locales.csv`

Choisissez le format qui correspond le mieux à vos fichiers existants !

## Bonnes pratiques

1. **Vérifier les pays** : Assurez-vous que les pays existent dans la section "Pays" avant l'import
2. **Codes CIP corrects** : Utilisez les codes CIP exacts des produits
3. **Noms de grossistes cohérents** : Utilisez toujours le même nom pour un même grossiste (attention à la casse et aux espaces)
4. **Tester avec peu de lignes** : Pour un premier import, commencez avec quelques lignes pour valider le format
5. **Vérifier l'aperçu** : Avant de confirmer, vérifiez attentivement l'aperçu des données

## Résolution des problèmes

### "Aucune donnée valide trouvée"
- Vérifiez que le fichier contient au moins les colonnes `cip` et `grossiste`
- Vérifiez que les lignes ne sont pas vides

### "Agence introuvable"
- Assurez-vous de sélectionner une agence existante

### Erreurs de création de grossiste
- Si un pays n'existe pas, le système utilise le premier pays disponible
- Vérifiez les logs de la console pour plus de détails
