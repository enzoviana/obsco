# DATAFUSE — Backend Node.js

API REST en **Node.js + Express + Prisma + PostgreSQL** avec authentification JWT
et rôles (`super_admin`, `agence`).

## 1. Installation locale

```bash
cd backend
cp .env.example .env
# édite .env : DATABASE_URL (Postgres), JWT_SECRET, CORS_ORIGIN
npm install
npx prisma migrate dev --name init   # crée les tables
npm run seed                         # crée le super_admin + données démo
npm run dev                          # API sur https://evening-sierra-79086-961c10c199fc.herokuapp.com
```

Identifiants démo (modifiables via `.env`) :
- Super admin : `admin@datafuse.app` / `ChangeMe123!`
- Agence : `abidjan@anf.app` / `Agence123!`

## 2. Endpoints

| Méthode | URL | Rôle | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | public | retourne `{ token, user }` |
| GET | `/api/auth/me` | auth | profil courant |
| GET/POST/PATCH/DELETE | `/api/users` | super_admin | gestion utilisateurs |
| GET/POST/PATCH/DELETE | `/api/countries` | auth / mutations super_admin | pays |
| GET/POST/PATCH/DELETE | `/api/agencies` | auth (agence ne voit que la sienne) | agences |
| GET/POST/PATCH/DELETE | `/api/products` | auth / mutations super_admin | produits |
| GET / PUT | `/api/prices` | auth / mutations super_admin | tarifs par pays |
| GET / PUT | `/api/objectives` | auth / mutations super_admin | objectifs |
| GET/POST/PATCH/DELETE | `/api/wholesalers` | auth / mutations super_admin | grossistes |
| GET/POST/PATCH/DELETE | `/api/laboratories` | auth / mutations super_admin | laboratoires |
| GET / PUT | `/api/stocks` | auth / mutations super_admin | stocks grossistes |
| GET / POST / DELETE | `/api/sales` | auth (agence scoped) | ventes / sorties locales |
| GET | `/health` | public | healthcheck |

Toutes les routes (sauf `/api/auth/login` et `/health`) exigent
`Authorization: Bearer <token>`.

## 3. Déploiement

### Render (le plus simple)
1. Push ce dossier dans un repo Git.
2. Sur Render → **New + → Blueprint** → sélectionne le repo.
   Le fichier `render.yaml` est détecté.
3. Crée une base **Render Postgres** (ou Neon / Supabase) et copie l'URL
   dans la variable `DATABASE_URL`.
4. Mets `CORS_ORIGIN` = URL de ton frontend (ex. `https://app.lovable.dev`).
5. Déploie. Lance ensuite `npm run seed` depuis le shell Render.

### Railway / Fly / VPS Docker
```bash
docker build -t datafuse-api ./backend
docker run -p 4000:4000 --env-file backend/.env datafuse-api
```

### Variables d'environnement requises
- `DATABASE_URL` — chaîne Postgres
- `JWT_SECRET` — chaîne aléatoire longue
- `CORS_ORIGIN` — origine du frontend (`https://mon-app.com`)
- `PORT` (optionnel, défaut 4000)

## 4. Connexion du frontend

Dans le projet front (Lovable), ajoute la variable :
```
VITE_API_URL=https://ton-api.onrender.com
```

Au démarrage, `src/lib/hydrate.ts` charge automatiquement **pays / agences /
grossistes / laboratoires / produits / tarifs / objectifs** depuis l'API et
remplit les stores locaux. Toutes les pages (Dashboard, Agences, Pays,
Produits, Grossistes, Laboratoires, Sorties Locales, Stats, Paramètres)
deviennent dynamiques sans rechargement.

Les boutons "Ajouter / Modifier / Supprimer" déclenchent en parallèle une
écriture API (`src/lib/sync.ts`) : la mise à jour est optimiste côté UI et
persistée côté backend.

Sans `VITE_API_URL`, l'app reste en mode démo (données mockées,
localStorage) — utile pour la preview Lovable.
