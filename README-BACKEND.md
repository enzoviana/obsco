# Emerald Pharmacy Hub - Backend Dynamique

Le système est maintenant complètement dynamique avec un backend Node.js/Express et une base de données SQLite.

## Architecture

```
Frontend (React/TanStack Router) ←→ Backend (Node.js/Express) ←→ SQLite Database
Port 8081                            Port 5001
```

## Démarrage rapide

### Option 1: Tout démarrer en même temps
```bash
./start-all.sh
```

### Option 2: Démarrage séparé

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
npm run dev
```

## URLs

- Frontend: http://localhost:8081
- Backend API: http://localhost:5001/api
- Health check: http://localhost:5001/api/health

## Comptes de test

- **Admin**: `admin@datafuse.io` / `admin123`
- **Pharmacy**: `agence@datafuse.io` / `pharmacy123`

## Données créées automatiquement

Au démarrage, le backend crée automatiquement:
- ✅ 8 pays (CI, BF, ML, SN, TG, BJ, NE, GN)
- ✅ 10 laboratoires (Pfizer, Sanofi, Novartis, GSK, etc.)
- ✅ 6 agences (Abidjan, Bouaké, Ouagadougou, Bamako, Dakar, Lomé)
- ✅ 3 grossistes
- ✅ 30 produits pharmaceutiques
- ✅ Stocks pour toutes les agences (180+ entrées)

## Fonctionnalités dynamiques

### Dashboard Pharmacy
- ✅ Chargement des données depuis l'API
- ✅ Statistiques en temps réel
- ✅ Alertes de stock
- ✅ Historique des imports

### Dashboard Admin
- ✅ Vue d'ensemble de toutes les agences
- ✅ Totaux agrégés
- ✅ Liste des agences avec détails

### Page Stocks
- ✅ Liste complète des stocks de l'agence
- ✅ Filtres par catégorie et statut
- ✅ Recherche
- ✅ Calcul automatique des statuts (ok/low/critical/rupture)

### Nouvelles pages dynamiques
- `/produits-simple` - Catalogue produits
- `/agences-dynamic` - Réseau d'agences
- `/laboratoires-dynamic` - Laboratoires partenaires

## API disponibles

Voir `Backend/API.md` pour la documentation complète des endpoints.

### Principales routes:
- `POST /api/auth/login` - Connexion
- `GET /api/products` - Liste des produits
- `GET /api/stocks` - Stocks de l'agence
- `GET /api/agencies` - Liste des agences
- `GET /api/dashboard/pharmacy` - Dashboard pharmacy
- `GET /api/dashboard/admin` - Dashboard admin

## Gestion des utilisateurs

Utilisez le CLI pour gérer les utilisateurs:
```bash
cd Backend
npm run cli
```

Options disponibles:
1. Créer un utilisateur
2. Lister les utilisateurs
3. Supprimer un utilisateur

## Base de données

- Fichier: `Backend/data/pharmacy.db`
- Type: SQLite avec WAL mode
- Tables: users, products, stocks, agencies, laboratories, countries, wholesalers, imports, stock_movements

Pour explorer la base:
```bash
sqlite3 Backend/data/pharmacy.db
.tables
.schema products
SELECT * FROM products LIMIT 5;
```

## Structure Backend

```
Backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Connexion SQLite
│   │   ├── schema.js        # Création des tables
│   │   └── seed.js          # Données de test
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Stock.js
│   │   ├── Agency.js
│   │   ├── Laboratory.js
│   │   ├── Country.js
│   │   └── Wholesaler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── stockController.js
│   │   ├── agencyController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── stocks.js
│   │   ├── agencies.js
│   │   ├── laboratories.js
│   │   ├── countries.js
│   │   ├── wholesalers.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── server.js
│   └── cli.js
├── data/
│   └── pharmacy.db          # Base SQLite
├── package.json
└── .env
```

## Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés avec bcrypt
- ✅ Middleware d'authentification sur toutes les routes protégées
- ✅ Vérification des rôles (admin/pharmacy)
- ✅ CORS configuré

## Prochaines étapes

Pour étendre le système:

1. **Imports de données** - Implémenter l'upload CSV/Excel
2. **Mouvements de stock** - Tracker les entrées/sorties
3. **Rapports** - Générer des rapports PDF
4. **Notifications** - Alertes email/SMS pour les stocks faibles
5. **API externe** - Intégration avec systèmes ERP

## Dépannage

**Port déjà utilisé:**
```bash
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:8081 | xargs kill -9  # Frontend
```

**Réinitialiser la base:**
```bash
rm Backend/data/pharmacy.db*
cd Backend && npm start  # Recrée automatiquement
```

**Logs:**
Les erreurs s'affichent dans la console du backend.
