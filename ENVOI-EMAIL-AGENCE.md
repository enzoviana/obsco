# 📧 Système d'envoi d'email automatique pour les agences

## Vue d'ensemble

Lorsqu'un super-admin crée une nouvelle agence, le système génère automatiquement :
1. Un compte utilisateur pour l'agence
2. Un mot de passe provisoire sécurisé
3. Un email de bienvenue avec les identifiants de connexion

L'agence devra **obligatoirement changer son mot de passe** lors de sa première connexion.

---

## 🚀 Fonctionnalités implémentées

### Backend (Node.js + Prisma)

#### 1. Service d'envoi d'email (`backend/src/services/email.service.ts`)
- Configuration SMTP pour production (Gmail, SendGrid, AWS SES, etc.)
- Mode développement : emails affichés dans la console au lieu d'être envoyés
- Templates HTML professionnels pour :
  - Email de bienvenue avec identifiants
  - Email de réinitialisation de mot de passe

#### 2. Utilitaires de mot de passe (`backend/src/utils/password.ts`)
- Génération de mots de passe provisoires sécurisés (format: `Secure-Pass-Word-42!`)
- Génération de tokens de réinitialisation
- Validation de la force des mots de passe

#### 3. Routes de gestion des mots de passe (`backend/src/routes/password.routes.ts`)
- `POST /api/password/change-password` : Changer son mot de passe (connecté)
- `POST /api/password/request-reset` : Demander une réinitialisation par email
- `POST /api/password/reset-password` : Réinitialiser avec un token

#### 4. Modification de la création d'agence (`backend/src/routes/crud.ts`)
Lors de la création d'une agence :
1. Vérification que l'email n'existe pas déjà
2. Création de l'agence dans la base de données
3. Génération d'un mot de passe provisoire aléatoire
4. Création automatique d'un compte utilisateur avec le rôle `agence`
5. Flag `mustChangePassword: true` activé
6. Envoi de l'email de bienvenue avec les identifiants
7. Retour du mot de passe dans la réponse (pour communication manuelle si l'email échoue)

#### 5. Schéma Prisma enrichi (`backend/prisma/schema.prisma`)
Nouveaux champs ajoutés au modèle `User` :
```prisma
mustChangePassword Boolean   @default(false)  // Force le changement de MDP
resetToken         String?                    // Token de réinitialisation
resetTokenExpiry   DateTime?                  // Expiration du token (24h)
```

#### 6. Routes d'authentification mises à jour
- `/api/auth/login` : Retourne le flag `mustChangePassword`
- `/api/auth/me` : Inclut le flag dans les informations utilisateur

### Frontend (React + TanStack Router)

#### 1. Page de changement de mot de passe (`src/routes/change-password.tsx`)
- Interface utilisateur intuitive pour changer le mot de passe
- Indicateurs visuels de force du mot de passe en temps réel :
  - ✅ Au moins 8 caractères
  - ✅ Une lettre majuscule
  - ✅ Une lettre minuscule
  - ✅ Un chiffre
  - ✅ Les mots de passe correspondent
- Deux modes :
  - **Premier login** : pas besoin du mot de passe actuel
  - **Changement normal** : nécessite le mot de passe actuel

#### 2. Flux de connexion modifié (`src/routes/login.tsx`)
Après une connexion réussie :
- Si `mustChangePassword === true` → Redirection vers `/change-password`
- Sinon → Redirection vers le tableau de bord

#### 3. Protection du dashboard (`src/routes/index.tsx`)
- Vérification automatique au chargement
- Redirection vers `/change-password` si nécessaire

#### 4. Types TypeScript mis à jour
- `User` et `ApiUser` incluent le champ `mustChangePassword`

---

## 📋 Configuration

### Variables d'environnement (Backend `.env`)

```bash
# Email / SMTP (optionnel en dev, requis en production)
SMTP_HOST=""                          # ex: smtp.gmail.com
SMTP_PORT="587"                       # 587 pour TLS, 465 pour SSL
SMTP_SECURE="false"                   # true si port 465
SMTP_USER=""                          # email@example.com
SMTP_PASS=""                          # Mot de passe / App Password
SMTP_FROM="noreply@datafuse.app"      # Email expéditeur
FRONTEND_URL="http://localhost:8080"   # URL du frontend pour les liens
```

### Configuration SMTP recommandée par service

#### Gmail (avec App Password)
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"  # App Password (pas votre vrai mot de passe)
```
👉 [Créer un App Password Gmail](https://myaccount.google.com/apppasswords)

#### SendGrid
```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxxxxxx"  # Votre clé API SendGrid
```

#### AWS SES
```bash
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="AKIAIOSFODNN7EXAMPLE"  # IAM credentials
SMTP_PASS="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

---

## 🧪 Test en développement

### Mode développement (sans SMTP configuré)
Les emails sont affichés dans la console du backend au lieu d'être envoyés :

```
📧 ===== EMAIL (DEV MODE) =====
De: noreply@datafuse.app
À: agence@example.com
Sujet: Bienvenue sur DATAFUSE - Compte créé pour Agence Abidjan

Votre mot de passe provisoire : Secure-Pass-Word-42!
================================
```

### Tester la création d'agence

1. Démarrer le backend :
```bash
cd backend
npm run dev
```

2. Se connecter en tant que super-admin

3. Créer une nouvelle agence depuis l'interface

4. Vérifier la console du backend pour voir l'email généré

5. Utiliser les identifiants affichés pour tester la première connexion

---

## 🔐 Workflow utilisateur complet

### 1. Création de l'agence par le super-admin
```
Super-admin → Crée une agence
         ↓
Backend crée un user avec mustChangePassword=true
         ↓
Email envoyé avec identifiants provisoires
         ↓
Super-admin reçoit aussi le mot de passe dans la réponse API
```

### 2. Première connexion de l'agence
```
Agence entre email + mot de passe provisoire
         ↓
Connexion réussie → mustChangePassword=true détecté
         ↓
Redirection automatique vers /change-password
         ↓
Agence définit son nouveau mot de passe
         ↓
Validation (8 chars, majuscule, minuscule, chiffre)
         ↓
Mot de passe changé, mustChangePassword=false
         ↓
Accès au tableau de bord autorisé
```

### 3. Connexions suivantes
```
Agence entre email + nouveau mot de passe
         ↓
mustChangePassword=false → Accès direct au dashboard
```

---

## 🔧 Migration de base de données

La migration a déjà été appliquée :
```bash
npx prisma migrate dev --name add_password_reset_fields
```

Champs ajoutés :
- `mustChangePassword` : Boolean par défaut false
- `resetToken` : String nullable (pour réinitialisation)
- `resetTokenExpiry` : DateTime nullable (expiration 24h)

---

## 📝 Endpoints API disponibles

### Authentification
- `POST /api/auth/login` - Connexion (retourne mustChangePassword)
- `GET /api/auth/me` - Informations utilisateur

### Gestion des mots de passe
- `POST /api/password/change-password` - Changer son mot de passe
  ```json
  {
    "currentPassword": "ancien-mdp",  // Optionnel si mustChangePassword=true
    "newPassword": "NouveauMotDePasse123!"
  }
  ```

- `POST /api/password/request-reset` - Demander une réinitialisation
  ```json
  {
    "email": "agence@example.com"
  }
  ```

- `POST /api/password/reset-password` - Réinitialiser avec token
  ```json
  {
    "token": "hex-token-from-email",
    "newPassword": "NouveauMotDePasse123!"
  }
  ```

### Agences
- `POST /api/agencies` - Créer une agence (super-admin uniquement)
  ```json
  {
    "name": "Agence Abidjan",
    "city": "Abidjan",
    "email": "agence@example.com",
    "manager": "Jean Dupont",
    "countryCode": "CI"
  }
  ```

  Réponse :
  ```json
  {
    "id": "clx...",
    "name": "Agence Abidjan",
    "email": "agence@example.com",
    "user": {
      "id": "clx...",
      "email": "agence@example.com",
      "name": "Jean Dupont"
    },
    "temporaryPassword": "Secure-Pass-Word-42!"
  }
  ```

---

## 🎨 Personnalisation des templates email

Les templates sont dans `backend/src/services/email.service.ts` :

### Email de bienvenue
- Design professionnel avec gradient
- Informations d'identification bien visibles
- Instructions claires pour la première connexion
- Lien direct vers la page de login

### Email de réinitialisation
- Lien sécurisé avec token unique
- Expiration après 24 heures
- Design cohérent avec la marque

Vous pouvez personnaliser :
- Les couleurs (gradient, primaire, etc.)
- Le logo (remplacer le texte par une image)
- Le contenu et le ton des messages
- Les informations de contact support

---

## ✅ Résumé des fichiers modifiés/créés

### Backend
- ✅ `backend/src/services/email.service.ts` (nouveau)
- ✅ `backend/src/utils/password.ts` (nouveau)
- ✅ `backend/src/routes/password.routes.ts` (nouveau)
- ✅ `backend/src/routes/crud.ts` (modifié)
- ✅ `backend/src/routes/auth.routes.ts` (modifié)
- ✅ `backend/src/index.ts` (modifié)
- ✅ `backend/prisma/schema.prisma` (modifié)
- ✅ `backend/.env` (modifié)
- ✅ `backend/package.json` (nodemailer ajouté)

### Frontend
- ✅ `src/routes/change-password.tsx` (nouveau)
- ✅ `src/routes/login.tsx` (modifié)
- ✅ `src/routes/index.tsx` (modifié)
- ✅ `src/lib/api.ts` (modifié)
- ✅ `src/lib/auth.ts` (modifié)

---

## 🚨 Sécurité

### Bonnes pratiques appliquées
✅ Mot de passe haché avec bcrypt (10 rounds)
✅ Token de réinitialisation unique et limité dans le temps (24h)
✅ Validation de la force du mot de passe (8 chars min + complexité)
✅ Rate limiting sur les endpoints sensibles (10 requêtes/minute)
✅ Pas d'information sensible dans les messages d'erreur
✅ Mode développement sécurisé (emails en console uniquement)

### Recommandations pour la production
1. Utiliser HTTPS uniquement
2. Configurer un service SMTP professionnel (SendGrid, AWS SES, etc.)
3. Activer l'authentification à deux facteurs (2FA) - à implémenter
4. Logger les tentatives de connexion échouées
5. Surveiller les emails non délivrés (bounces)
6. Mettre en place une politique de rotation des mots de passe

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs du backend (`npm run dev`)
2. Vérifier la configuration SMTP dans `.env`
3. Tester en mode développement d'abord
4. Consulter la documentation Prisma et Nodemailer

---

## 🎯 Prochaines améliorations possibles

- [ ] Authentification à deux facteurs (2FA)
- [ ] Historique des mots de passe (empêcher la réutilisation)
- [ ] Politique d'expiration des mots de passe (ex: tous les 90 jours)
- [ ] Notifications par email pour activités suspectes
- [ ] Support multilingue des emails (français/anglais)
- [ ] Dashboard admin pour visualiser les emails envoyés
- [ ] Queue d'emails avec retry automatique (Bull, BullMQ)
- [ ] Webhooks pour suivre les ouvertures et clics d'emails

---

**Statut : ✅ Fonctionnel et prêt pour les tests**

Dernière mise à jour : 26 juin 2026
