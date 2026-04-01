# Auth Service Node

Service d'authentification avec intégration Keycloak pour l'architecture microservices.

## Installation

```bash
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
```

## Base de données

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Démarrage

```bash
npm run dev
```

## Endpoints

- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion
- POST /api/auth/refresh - Rafraîchir le token
- GET /api/auth/validate - Valider le token
