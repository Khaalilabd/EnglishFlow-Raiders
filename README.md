# 🎯 Microservices Demo - Architecture Complète

## 📋 Description
Projet de démonstration d'une architecture microservices complète avec Spring Boot, Eureka, API Gateway, OpenFeign et Keycloak.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Angular                         │
│                    http://localhost:4200                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (8080)                        │
│              Point d'entrée unique                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Eureka Server (8761)                        │
│              Service Discovery                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │Courses Service│ │Student Service│
│   (8081)     │ │    (8082)     │ │    (8083)     │
│              │ │               │ │               │
│  Keycloak    │ │  PostgreSQL   │ │  PostgreSQL   │
│   OAuth2     │ │  courses_db   │ │  students_db  │
└──────────────┘ └──────────────┘ └───────┬────────┘
                                           │
                                           │ OpenFeign
                                           ▼
                                   ┌──────────────┐
                                   │Courses Service│
                                   └──────────────┘
```

## 🚀 Technologies Utilisées

### Backend
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Eureka Server** - Service Discovery
- **Spring Cloud Gateway** - API Gateway
- **OpenFeign** - Communication inter-services
- **Keycloak** - Authentification OAuth2/JWT
- **PostgreSQL** - Base de données
- **Docker** - Conteneurisation

### Frontend
- **Angular 17** - Framework frontend
- **Standalone Components** - Architecture moderne
- **HttpClient** - Communication avec l'API
- **CSS3** - Styling moderne avec gradients et animations

## 📦 Prérequis

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose

## 🔧 Installation et Démarrage

### 1. Démarrer les services Docker (PostgreSQL + Keycloak)

```bash
cd docker
docker compose up -d
```

Cela démarre:
- PostgreSQL sur le port 5432
- Keycloak sur le port 9090

### 2. Configurer Keycloak

1. Accéder à http://localhost:9090
2. Se connecter avec admin/admin
3. Créer un realm: `microservices`
4. Créer un client: `microservices-client`
   - Client authentication: ON
   - Valid redirect URIs: `*`
5. Créer un utilisateur: `demo` / `demo123`

### 3. Créer les bases de données

```sql
CREATE DATABASE courses_db;
CREATE DATABASE students_db;
```

### 4. Démarrer les services backend (dans l'ordre)

```bash
# 1. Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. API Gateway
cd api-gateway
mvn spring-boot:run

# 3. Auth Service
cd auth-service
mvn spring-boot:run

# 4. Courses Service
cd courses-service
mvn spring-boot:run

# 5. Student Service
cd student-service
mvn spring-boot:run
```

### 5. Démarrer le frontend

```bash
cd frontend
npm install
ng serve
```

## 🌐 URLs d'accès

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Interface utilisateur |
| API Gateway | http://localhost:8080 | Point d'entrée API |
| Eureka Server | http://localhost:8761 | Dashboard Eureka |
| Keycloak | http://localhost:9090 | Console Keycloak |
| Auth Service | http://localhost:8081 | Service d'authentification |
| Courses Service | http://localhost:8082 | Service des cours |
| Student Service | http://localhost:8083 | Service des étudiants |

## 🔑 Identifiants de test

### Application
- **Username:** demo
- **Password:** demo123

### Keycloak Admin
- **Username:** admin
- **Password:** admin

### PostgreSQL
- **Username:** postgres
- **Password:** postgres

## 📚 Fonctionnalités Démontrées

### ✅ 1. Service Discovery avec Eureka
Tous les services s'enregistrent automatiquement sur Eureka Server. Vérifiable sur http://localhost:8761

### ✅ 2. API Gateway comme point d'entrée unique
Toutes les requêtes passent par le Gateway sur le port 8080:
- `/api/auth/**` → Auth Service
- `/api/courses/**` → Courses Service
- `/api/students/**` → Student Service

### ✅ 3. Communication OpenFeign
Le Student Service communique avec le Courses Service via OpenFeign pour récupérer les cours d'un étudiant.

**Endpoint de démonstration:**
```
GET http://localhost:8080/api/students/{id}/courses
```

Cette requête:
1. Arrive au Student Service via le Gateway
2. Le Student Service utilise OpenFeign pour appeler le Courses Service
3. Les données sont combinées et retournées

### ✅ 4. Authentification Keycloak
- Login avec OAuth2/JWT
- Tokens d'accès et de rafraîchissement
- Intégration complète avec le frontend

## 🎨 Interface Frontend

### Pages disponibles:
1. **Login** - Authentification avec Keycloak
2. **Dashboard** - Vue d'ensemble avec statistiques et architecture
3. **Courses** - CRUD complet des cours
4. **Students** - CRUD complet des étudiants + démonstration OpenFeign

### Design Features:
- ✨ Gradients modernes
- 🎭 Animations fluides
- 📱 Design responsive
- 🎨 Palette de couleurs cohérente
- 💫 Effets hover et transitions
- 📊 Cartes statistiques animées

## 🧪 Tests des Endpoints

### Authentification
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### Courses
```bash
# Liste des cours
curl http://localhost:8080/api/courses

# Créer un cours
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Spring Boot Advanced",
    "description":"Advanced Spring Boot concepts",
    "instructor":"John Doe",
    "durationHours":40,
    "level":"ADVANCED"
  }'
```

### Students avec OpenFeign
```bash
# Liste des étudiants
curl http://localhost:8080/api/students

# Cours d'un étudiant (OpenFeign)
curl http://localhost:8080/api/students/1/courses
```

## 📝 Structure du Projet

```
MicroservicesDemo/
├── eureka-server/          # Service Discovery
├── api-gateway/            # API Gateway
├── auth-service/           # Authentification Keycloak
├── courses-service/        # Gestion des cours
├── student-service/        # Gestion des étudiants
├── frontend/               # Application Angular
└── docker/                 # Docker Compose
    └── docker-compose.yml
```

## 🎯 Points Clés pour la Démonstration

1. **Eureka Dashboard** - Montrer tous les services enregistrés
2. **API Gateway** - Expliquer le routing centralisé
3. **OpenFeign** - Démontrer la communication inter-services
4. **Frontend** - Montrer l'interface moderne et les CRUD
5. **Keycloak** - Expliquer l'authentification OAuth2

## 🐛 Troubleshooting

### Les services ne démarrent pas
- Vérifier que PostgreSQL et Keycloak sont lancés
- Vérifier les ports disponibles
- Vérifier les logs des services

### Erreur de connexion à la base de données
- Vérifier que les bases `courses_db` et `students_db` existent
- Vérifier les credentials PostgreSQL

### Erreur d'authentification
- Vérifier que Keycloak est configuré correctement
- Vérifier que l'utilisateur `demo` existe
- Vérifier le client `microservices-client`

## 📄 License

Ce projet est à des fins éducatives et de démonstration.

## 👨‍💻 Auteur

Projet de démonstration pour le cours de Microservices - 4SAE
