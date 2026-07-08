# Import CSV des Sorties Locales

## Vue d'ensemble

La fonctionnalité d'import CSV permet d'importer en masse les données de sorties locales (ventes, stocks, commandes) par produit et par grossiste pour une agence et une période données.

## Format du fichier CSV

### Colonnes requises

- **cip** (ou `code`) : Code CIP du produit (obligatoire)
- **grossiste** (ou `wholesaler`, `fournisseur`) : Nom du grossiste/fournisseur (obligatoire)

### Colonnes optionnelles

- **nom** (ou `name`, `produit`) : Nom du produit (pour référence)
- **ventes** (ou `sales`, `sortie`) : Nombre d'unités vendues. Par défaut : 0
- **stocks** (ou `stock`) : Stock disponible. Par défaut : 0
- **commandes** (ou `orders`) : Commandes en cours. Par défaut : 0
- **countryCode** (ou `pays`, `country`) : Code pays du grossiste (ex: FR, ML, CI). Par défaut : premier pays disponible
- **ville** (ou `city`) : Ville du grossiste

### Séparateurs acceptés

Le fichier CSV peut utiliser :
- Virgule (`,`)
- Point-virgule (`;`)

## Exemple de fichier CSV

```csv
cip,nom,grossiste,ventes,stocks,commandes,countryCode,ville
3400936000001,Paracétamol 500mg,CAMED,150,200,50,CI,Abidjan
3400938000002,Ibuprofène 400mg,LABOREX MALI,120,180,30,ML,Bamako
3400939000003,Amoxicilline 500mg,COPHARMED,200,300,100,SN,Dakar
```

## Création automatique des grossistes

Si un grossiste mentionné dans le CSV n'existe pas dans la base de données, il sera **automatiquement créé** avec :
- Le nom spécifié dans la colonne `grossiste`
- Le code pays spécifié dans `countryCode` (ou le premier pays disponible par défaut)
- La ville spécifiée dans `ville` (optionnel)
- Un statut "actif"
- Un scope "country" (visible au niveau pays)

**Note importante** : Si le code pays spécifié n'existe pas dans la base de données, le système utilisera automatiquement le premier pays disponible. Assurez-vous que les pays ont été créés au préalable dans la section "Pays".

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
- **Grossistes** : Les grossistes inexistants sont créés automatiquement
- **Validation** : Les données sont validées avant import. Les erreurs sont signalées dans la console

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

## Modèle CSV

Un modèle CSV peut être téléchargé directement depuis la fenêtre d'import en cliquant sur "Télécharger un modèle".

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
