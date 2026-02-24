# Auth Service - Node.js

Service d'authentification migré de Java/Spring Boot vers Node.js/Express avec TypeScript.

## Technologies

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Eureka Client (Service Discovery)

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer le client Prisma
npm run prisma:generate

# Créer la base de données et appliquer les migrations
npm run prisma:migrate
```

## Configuration

Modifier le fichier `.env` avec vos paramètres:

```
PORT=8081
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
EUREKA_HOST=localhost
EUREKA_PORT=8761
STUDENTS_SERVICE_URL=http://localhost:8082
```

## Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Gestion des utilisateurs
- `GET /api/auth/users` - Liste tous les utilisateurs
- `GET /api/auth/users/:id` - Récupérer un utilisateur par ID
- `GET /api/auth/users/role/:role` - Récupérer les utilisateurs par rôle
- `PUT /api/auth/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/auth/users/:id` - Supprimer un utilisateur

### Health Check
- `GET /actuator/health` - Vérification de santé
- `GET /actuator/info` - Informations sur le service

## Fonctionnalités

- Authentification basique (username/password)
- Gestion des rôles (STUDENT, TUTOR, ADMIN)
- Enregistrement automatique dans le service étudiant pour les nouveaux étudiants
- Intégration avec Eureka pour la découverte de services
- Communication inter-services via Axios
