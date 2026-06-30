
## Contexte

L'app utilise actuellement des **stores synchrones en mémoire + localStorage** (`src/lib/agencies.ts`, `src/lib/products.ts`, `src/lib/mock-data.ts`). Toutes les pages (agences, pays, produits, grossistes, laboratoires, sorties locales, stats, parametres, dashboard, etc.) consomment ces fonctions de façon **synchrone** (`getAgencies()`, `getPanoramicProducts()`, `salesObjectivesByCountry()`, etc.).

Réécrire chaque page en async (Suspense + useQuery + loader) = **15+ routes × 2–4 composants chacune** = travail énorme, risque élevé de régression UI, et peu de valeur ajoutée tant que le backend n'est pas branché.

## Stratégie recommandée : hydratation au boot + write-through

Au lieu de refactorer chaque page, je transforme les **stores locaux en cache hydraté depuis l'API** :

1. Au démarrage de l'app (root route), si `VITE_API_URL` est défini → on appelle `/api/countries`, `/api/agencies`, `/api/products`, `/api/wholesalers`, `/api/prices`, `/api/objectives`, `/api/stocks`, `/api/sales` **en parallèle**, on remplit les arrays internes (`COUNTRIES`, `_agencies`, `_products`, `_gros`, `_labs`, maps `PRICE_KEY`/`OBJ_KEY`), puis on émet les events existants (`datafuse:agencies`, `datafuse:products`, …) → toutes les pages se re-rendent automatiquement avec les vraies données.
2. Les fonctions de mutation (`addAgency`, `updateProduct`, `setProductPricing`, …) gardent leur signature sync (mise à jour optimiste locale + event) **et** envoient en parallèle un `fetch` API (`POST/PATCH/PUT/DELETE`) en arrière-plan. En cas d'erreur, rollback + toast.
3. Sans `VITE_API_URL` → comportement actuel inchangé (mode démo / preview Lovable).

## Avantages

- **0 réécriture** des pages, graphiques, tableaux, modales.
- Toutes les pages deviennent dynamiques **simultanément** dès que `VITE_API_URL` est posée.
- Les boutons CRUD existants fonctionnent réellement contre le backend.
- Compat preview Lovable préservée (fallback démo).

## Limites assumées

- Les **rapports calculés** (`salesObjectivesByCountry`, `evolutionByRevenue`, `stockSituation`, etc.) restent **dérivés des ventes/stocks chargés**. Tant que le backend a peu de données, les graphiques peuvent être quasi vides — c'est le comportement attendu d'une app vraiment connectée. On garde un fallback "données générées" si l'API renvoie un tableau vide, désactivable via `VITE_API_STRICT=1`.
- Les sections purement décoratives du dashboard (`mock-data.ts` : `stockTrend`, `lowStockItems`, `globalTrend`) seront recalculées depuis les ventes/stocks API. Si vides, on garde le rendu mock par défaut (toujours désactivable).
- Le RBAC est déjà géré côté backend (filtre `agencyId` pour role `agence`) — l'UI reflètera automatiquement le scope du user connecté.

## Implémentation (un seul commit)

### Fichiers à créer

- `src/lib/hydrate.ts` — fonction `hydrateFromApi()` qui appelle tous les endpoints en parallèle et remplit les stores existants. Exporte aussi `isHydrated()`.
- `src/lib/sync.ts` — helpers `syncCreate/syncUpdate/syncDelete<T>(endpoint, body)` avec gestion d'erreur + toast.

### Fichiers à modifier

- `src/routes/__root.tsx` → appel `hydrateFromApi()` une fois au montage (après `refreshFromApi()` auth).
- `src/lib/agencies.ts` → chaque mutation (`addCountry`, `addAgency`, `addLaboratoire`, `addGrossiste`, `update*`, `delete*`, `setProductPricing`, `setProductObjectives`, `addCustomProduct`, `updateProduct`, `deleteProduct`) gagne un appel `sync*` en fire-and-forget quand `API_ENABLED`.
- `src/lib/products.ts` → idem pour le catalogue produits si on l'utilise (sinon laissé en mock pour le sélecteur).
- `src/lib/mock-data.ts` → expose un setter `setDashboardData(...)` que la hydratation appelle après agrégation des ventes/stocks API.
- `backend/src/routes/crud.ts` → ajouter routes manquantes : `laboratories` (CRUD complet, à ajouter au schéma Prisma).
- `backend/prisma/schema.prisma` → ajouter `Laboratory` (id, name, country, contact, email, phone, address, status), et champs supplémentaires si nécessaire (`scope`, `agencyId` sur `Wholesaler`).
- `backend/prisma/seed.ts` → seed des 8 pays + 5 grossistes + 4 labos + 80 produits panoramiques pour démarrer avec des données identiques à la démo.

### Détail du flux d'hydratation

```text
RootMount → if (API_ENABLED && getToken())
              → hydrateFromApi()
                 ├─ GET /api/countries     → COUNTRIES.splice(...)
                 ├─ GET /api/agencies      → _agencies = ...
                 ├─ GET /api/wholesalers   → _gros = ...
                 ├─ GET /api/laboratories  → _labs = ...
                 ├─ GET /api/products      → _products = ... (mappé vers ProductPanoramic)
                 ├─ GET /api/prices        → remplit localStorage PRICE_KEY
                 ├─ GET /api/objectives    → remplit localStorage OBJ_KEY
                 ├─ GET /api/sales?limit=… → agrège pour dashboard + reports
                 └─ GET /api/stocks        → agrège pour stockSituation
              → dispatch all 'datafuse:*' events
              → toutes les pages re-render avec data API
```

### Mutations write-through

```ts
// Avant
export function addAgency(a) {
  _agencies = [next, ...getAgencies()];
  persistAgencies();
  return next;
}

// Après
export function addAgency(a) {
  _agencies = [next, ...getAgencies()];
  persistAgencies();
  if (API_ENABLED) syncCreate("/api/agencies", { ... }).catch(showError);
  return next;
}
```

## Critères de succès

- `bun run build` passe.
- Sans `VITE_API_URL` → app identique à aujourd'hui.
- Avec `VITE_API_URL` pointant vers un backend seedé : home, agences, pays, produits, grossistes, laboratoires, sorties-locales/* affichent les données du backend ; créer/éditer/supprimer dans l'UI met à jour la base.

## Ce que je NE fais pas (et qui peut venir ensuite)

- Pas de Suspense/loaders TanStack Query par page (changement architectural trop large pour ce tour).
- Pas de realtime/WebSocket — un refresh page suffit pour voir les changements d'un autre utilisateur.
- Pas de migration des composants `dashboard/AdminView.tsx` et `PharmacyView.tsx` vers du fetching dédié — ils consomment les stores hydratés.

Confirme et je lance l'implémentation complète en un commit.
