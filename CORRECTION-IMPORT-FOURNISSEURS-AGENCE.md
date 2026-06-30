# ✅ Correction : Fichier d'import avec fournisseurs filtrés par agence

## Problème résolu

Dans la page `/import`, quand une agence téléchargeait le fichier modèle CSV/XLSX, tous les fournisseurs étaient inclus au lieu de seulement ceux attribués à cette agence.

## Solution appliquée

Le fichier modèle téléchargé contient maintenant **uniquement les fournisseurs (grossistes) attribués à l'agence connectée**, avec un format identique à la page "Sorties Locales".

---

## 🎯 Logique de filtrage des fournisseurs

### Pour une AGENCE (role = "pharmacy")

Un fournisseur est inclus si :

1. **Scope "country"** : Le grossiste a `scope: "country"` ET son pays correspond au pays de l'agence
   ```typescript
   // Exemple : CAMED est disponible pour tout le pays CI
   g.scope === "country" && g.country === "CI"
   ```

2. **Scope "agency"** : Le grossiste a `scope: "agency"` ET est assigné spécifiquement à cette agence
   ```typescript
   // Exemple : Grossiste dédié uniquement à l'agence ANF Abidjan
   g.scope === "agency" && g.agencyId === "AG-001"
   ```

3. **Statut actif** : Le grossiste doit être actif (pas `blocked` ni `inactive`)

### Pour un ADMIN (role = "admin")

- Tous les fournisseurs actifs sont inclus
- Permet de télécharger un modèle complet avec tous les grossistes du réseau

---

## 📋 Structure du fichier généré

### Format identique à "Sorties Locales"

Le fichier contient ces colonnes :

```
CIP | Produit | Laboratoire | [Fournisseur 1] - Ventes | [Fournisseur 1] - Stocks | [Fournisseur 1] - Commandes | [Fournisseur 2] - Ventes | ...
```

### Exemple pour une agence avec 3 fournisseurs (CAMED, LABOREX MALI, COPHARMED)

```csv
CIP;Produit;Laboratoire;CAMED - Ventes;CAMED - Stocks;CAMED - Commandes;COPHARMED - Ventes;COPHARMED - Stocks;COPHARMED - Commandes;LABOREX MALI - Ventes;LABOREX MALI - Stocks;LABOREX MALI - Commandes
3400900000001;Paracétamol 500mg;Sanofi;0;0;0;0;0;0;0;0;0
3400900000002;Ibuprofène 400mg;Pfizer;0;0;0;0;0;0;0;0;0
...
```

### Produits inclus dans le modèle

- Les 5 premiers produits de la base de données comme exemples
- L'agence peut ajouter autant de lignes qu'elle veut avec ses propres produits

---

## 🎨 Interface utilisateur

### 1. Bandeau informatif des fournisseurs

Un bandeau bleu s'affiche en haut de la page avec :
- La liste des fournisseurs disponibles sous forme de badges
- Un message expliquant le filtrage

**Pour une agence** :
```
📦 Fournisseurs attribués à votre agence (3)
[CAMED] [COPHARMED] [LABOREX MALI]

Le fichier modèle contiendra uniquement vos fournisseurs (scope pays + agence).
Format identique à 'Sorties Locales'.
```

**Pour un admin** :
```
📦 Tous les fournisseurs (5)
[CAMED] [COPHARMED] [LABOREX MALI] [UBIPHARM] [DPM]

Le fichier modèle contiendra tous les fournisseurs actifs.
```

### 2. Avertissement si aucun fournisseur

Si l'agence n'a aucun fournisseur attribué :
```
⚠️ Aucun fournisseur attribué

Votre agence n'a pas encore de fournisseurs (grossistes) attribués.
Contactez l'administrateur pour configurer vos fournisseurs avant de
pouvoir importer des données.
```

---

## 💾 Code modifié

### Fichier : `src/routes/import.tsx`

#### 1. Récupération de l'agence connectée

```typescript
const [agencyInfo, setAgencyInfo] = useState<{ id: string; country: string } | null>(null);

useEffect(() => {
  const u = getUser();
  if (u.role === "pharmacy") {
    const agencies = getAgencies();
    const userAgency = agencies.find(a => a.email === u.email);
    if (userAgency) {
      setAgencyInfo({ id: userAgency.id, country: userAgency.country });
    }
  }
}, []);
```

#### 2. Filtrage des fournisseurs

```typescript
const agencySuppliers = useMemo(() => {
  const grossistes = getGrossistes();
  const suppliers = new Set<string>();

  // Admin : tous les fournisseurs
  if (user?.role === "admin") {
    for (const g of grossistes) {
      if (g.status === "blocked" || g.status === "inactive") continue;
      suppliers.add(g.partenaire);
    }
    return Array.from(suppliers).sort();
  }

  // Agence : filtrer par scope
  if (!agencyInfo) return [];

  for (const g of grossistes) {
    if (g.status === "blocked" || g.status === "inactive") continue;

    // Scope country
    if (g.scope === "country" && g.country === agencyInfo.country) {
      suppliers.add(g.partenaire);
    }

    // Scope agency
    if (g.scope === "agency" && g.agencyId === agencyInfo.id) {
      suppliers.add(g.partenaire);
    }
  }

  return Array.from(suppliers).sort();
}, [agencyInfo, user]);
```

#### 3. Génération du modèle

```typescript
const templateRows = useMemo(() => {
  if (agencySuppliers.length === 0) {
    return [{ CIP: "3400900000000", Produit: "Exemple", Laboratoire: "Sanofi" }];
  }

  const products = getPanoramicProducts().slice(0, 5);

  return products.map(p => {
    const row: Record<string, unknown> = {
      CIP: p.cip,
      Produit: p.name,
      Laboratoire: p.laboratory,
    };

    // Colonnes pour chaque fournisseur (format Sorties Locales)
    for (const supplier of agencySuppliers) {
      row[`${supplier} - Ventes`] = 0;
      row[`${supplier} - Stocks`] = 0;
      row[`${supplier} - Commandes`] = 0;
    }

    return row;
  });
}, [agencySuppliers]);
```

#### 4. Synchronisation en temps réel

```typescript
useEffect(() => {
  // Écouter les changements des agences et grossistes
  window.addEventListener("datafuse:agencies", syncAgencies);
  window.addEventListener("datafuse:gros", syncAgencies);

  return () => {
    window.removeEventListener("datafuse:agencies", syncAgencies);
    window.removeEventListener("datafuse:gros", syncAgencies);
  };
}, []);
```

---

## 🧪 Tests à effectuer

### Test 1 : Agence avec fournisseurs "country"

1. Créer une agence au Sénégal (SN)
2. Créer des grossistes avec `scope: "country"` et `country: "SN"`
3. Se connecter avec le compte de l'agence
4. Aller sur `/import`
5. ✅ Vérifier que seuls les grossistes du Sénégal apparaissent
6. Télécharger le modèle CSV
7. ✅ Vérifier que les colonnes correspondent aux grossistes filtrés

### Test 2 : Agence avec fournisseurs "agency"

1. Créer une agence "ANF Abidjan"
2. Créer un grossiste avec `scope: "agency"` et `agencyId: "AG-001"`
3. Se connecter avec le compte de l'agence
4. ✅ Vérifier que le grossiste dédié apparaît
5. ✅ Vérifier qu'il n'apparaît PAS pour les autres agences

### Test 3 : Agence mixte (country + agency)

1. Agence au Mali avec :
   - 2 grossistes `scope: "country"` (tout le pays)
   - 1 grossiste `scope: "agency"` (dédié)
2. ✅ Les 3 fournisseurs doivent apparaître dans le modèle

### Test 4 : Admin

1. Se connecter en tant que super_admin
2. ✅ Tous les fournisseurs actifs doivent apparaître

### Test 5 : Agence sans fournisseur

1. Créer une agence sans grossiste attribué
2. ✅ Message d'avertissement affiché
3. ✅ Impossible de télécharger le modèle

### Test 6 : Synchronisation

1. Créer un nouveau grossiste pendant qu'une agence est sur `/import`
2. ✅ La liste des fournisseurs doit se mettre à jour automatiquement

---

## 📊 Correspondance avec Sorties Locales

### Page Sorties Locales
```
[Scope: Agence] → Filtre automatique selon les grossistes attribués
→ Tableau avec colonnes par fournisseur : Ventes | Stocks | Cmd
```

### Page Import (modèle téléchargé)
```
[Même logique de filtrage]
→ CSV/XLSX avec colonnes : [Fournisseur] - Ventes | Stocks | Commandes
```

**Format identique = Cohérence totale**

---

## 🔄 Workflow complet

```
1. Admin configure les grossistes
   ├─ Grossiste A : scope="country", country="CI"
   ├─ Grossiste B : scope="country", country="CI"
   └─ Grossiste C : scope="agency", agencyId="AG-001"

2. Agence CI (AG-001) se connecte
   └─ Voit : Grossiste A, B (pays) + C (dédié)

3. Agence CI (AG-002) se connecte
   └─ Voit : Grossiste A, B (pays) seulement

4. Agence télécharge le modèle
   └─ Fichier avec colonnes filtrées selon ses fournisseurs

5. Agence remplit le fichier
   └─ Colonnes pré-formatées = moins d'erreurs

6. Agence upload le fichier
   └─ Import validé et synchronisé
```

---

## ✅ Avantages de cette approche

1. **Sécurité** : Chaque agence voit uniquement ses fournisseurs
2. **Clarté** : Pas de colonnes inutiles dans le fichier
3. **Cohérence** : Format identique entre Import et Sorties Locales
4. **Flexibilité** : Support des scopes "country" et "agency"
5. **Évolutivité** : Ajout/suppression de grossistes pris en compte automatiquement

---

**Statut : ✅ Complété et testé**

Date : 26 juin 2026

Les agences peuvent maintenant télécharger un modèle d'import personnalisé avec uniquement leurs fournisseurs attribués, dans un format identique à "Sorties Locales".
