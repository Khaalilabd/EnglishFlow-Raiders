# 🎯 Microservices Demo - Architecture Complète

## 📋 Description
Architecture microservices complète avec Spring Boot, Eureka, API Gateway, Config Server, OpenFeign et Keycloak.

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
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼               ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Config Server │ │Eureka Server │ │  Keycloak    │ │  Databases   │
│   (8888)     │ │   (8761)     │ │   (9090)     │ │ PG + MySQL   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼               ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Service │ │Courses Service│ │Student Service│ │ Clubs Service│
│   (8081)     │ │    (8082)     │ │    (8083)     │ │    (8085)    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## 🚀 Technologies

### Backend
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Config Server** - Configuration centralisée
- **Eureka Server** - Service Discovery
- **API Gateway** - Point d'entrée unique
- **OpenFeign** - Communication inter-services
- **Keycloak** - OAuth2/JWT
- **Swagger/OpenAPI** - Documentation API
- **Spring Security** - Sécurité
- **PostgreSQL & MySQL** - Bases de données
- **Docker** - Conteneurisation

### Frontend
- **Angular 21** - Framework moderne
- **Nginx** - Serveur web
- **Chart.js** - Graphiques

## 📦 Prérequis

- Docker Desktop installé
- SSD externe configuré pour Docker (voir section Configuration)
- 8GB RAM minimum
- Ports disponibles: 3001, 4200, 5432, 3306, 8080-8086, 8761, 8888, 9090

## 🚀 Démarrage Rapide

### 1. Configurer Docker sur SSD Externe

**Via Docker Desktop** :
1. Ouvrir Docker Desktop
2. Settings → Resources → Advanced
3. Disk image location → `/Volumes/ADATA SC740/Docker`
4. Apply & Restart

### 2. Créer le fichier .env
```bash
cp .env.example .env
```

### 3. Démarrer tous les services
```bash
docker-compose up -d --build
```

### 4. Vérifier le statut
```bash
docker-compose ps
```

### 5. Voir les logs
```bash
docker-compose logs -f
```

## 🌐 URLs d'Accès

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | - |
| **API Gateway** | http://localhost:8080 | - |
| **Eureka Dashboard** | http://localhost:8761 | - |
| **Config Server** | http://localhost:8888 | configuser / configpass |
| **Keycloak Admin** | http://localhost:9090 | admin / admin |
| **Prometheus** | http://localhost:9091 | - |
| **Grafana** | http://localhost:3000 | admin / admin |
| **Zipkin** | http://localhost:9411 | - |
| **Courses Swagger** | http://localhost:8082/swagger-ui.html | - |
| **Students Swagger** | http://localhost:8083/swagger-ui.html | - |

## 📚 Services

### Infrastructure
- **Config Server (8888)** - Configuration centralisée
- **Eureka Server (8761)** - Service Discovery
- **API Gateway (8080)** - Routage et load balancing

### Business Services
- **Auth Service (8081)** - Authentification Java
- **Auth Service Node (3001)** - Authentification Node.js
- **Courses Service (8082)** - Gestion des cours
- **Student Service (8083)** - Gestion des étudiants
- **Complaints Service (8084)** - Gestion des réclamations
- **Clubs Service (8085)** - Gestion des clubs
- **Quiz Service (8086)** - Gestion des quiz

### Frontend
- **Angular App (4200)** - Interface utilisateur

## 🔐 Sécurité

### Keycloak Configuration
1. Accéder à http://localhost:9090
2. Login: admin / admin
3. Créer un realm: `microservices`
4. Créer un client: `microservices-client`
5. Créer un utilisateur: `demo` / `demo123`

### CORS
Configuré pour:
- http://localhost:4200 (Frontend)
- http://localhost:8080 (API Gateway)

### Spring Security
- Tous les services ont Spring Security activé
- Endpoints Swagger et Actuator publics
- Autres endpoints nécessitent authentification

## 📊 Monitoring & Health Checks

### Health Checks
Tous les services exposent `/actuator/health`:
```bash
curl http://localhost:8082/actuator/health
```

### Metrics
```bash
curl http://localhost:8082/actuator/metrics
```

### Eureka Dashboard
Voir tous les services enregistrés:
```
http://localhost:8761
```

## 📖 Documentation API (Swagger)

Chaque service expose sa documentation Swagger:
- Courses: http://localhost:8082/swagger-ui.html
- Students: http://localhost:8083/swagger-ui.html
- Complaints: http://localhost:8084/swagger-ui.html
- Clubs: http://localhost:8085/swagger-ui.html
- Quiz: http://localhost:8086/swagger-ui.html

## 🧪 Tests des Endpoints

### Via API Gateway
```bash
# Courses
curl http://localhost:8080/api/courses

# Students
curl http://localhost:8080/api/students

# Student courses (OpenFeign)
curl http://localhost:8080/api/students/1/courses
```

### Direct
```bash
# Courses Service
curl http://localhost:8082/api/courses

# Students Service
curl http://localhost:8083/api/students
```

## 🐳 Commandes Docker

### Démarrer
```bash
docker-compose up -d
```

### Rebuild
```bash
docker-compose up -d --build
```

### Arrêter
```bash
docker-compose down
```

### Arrêter et supprimer volumes
```bash
docker-compose down -v
```

### Logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f courses-service
```

### Statut
```bash
docker-compose ps
```

## 📝 Structure du Projet

```
microservices/
├── backend/
│   ├── config-server/       # Configuration centralisée
│   ├── eureka-server/        # Service Discovery
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/         # Auth Java
│   ├── auth-service-node/    # Auth Node.js
│   ├── courses-service/      # Gestion cours
│   ├── student-service/      # Gestion étudiants
│   ├── complaints-service/   # Gestion réclamations
│   ├── clubs-service/        # Gestion clubs
│   └── quiz-service/         # Gestion quiz
├── frontend/                 # Application Angular
├── docker/                   # Scripts SQL init
├── docker-compose.yml        # Orchestration
└── .env.example             # Variables d'environnement
```

## 🔧 Configuration

### Variables d'Environnement (.env)
```bash
# Databases
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
MYSQL_ROOT_PASSWORD=rootpassword

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Ports
EUREKA_PORT=8761
API_GATEWAY_PORT=8080
CONFIG_SERVER_PORT=8888
```

## 🐛 Troubleshooting

### Services ne démarrent pas
```bash
# Vérifier les logs
docker-compose logs -f

# Vérifier les ports
lsof -i :8080
```

### Erreur de connexion DB
```bash
# Vérifier que les DB sont healthy
docker-compose ps

# Restart les DB
docker-compose restart postgres mysql
```

### Keycloak ne démarre pas
```bash
# Attendre que postgres soit ready
docker-compose logs -f keycloak
```

### Espace disque insuffisant
```bash
# Nettoyer Docker
docker system prune -a --volumes

# Vérifier l'espace sur SSD
df -h /Volumes/ADATA\ SC740/
```

## 📄 License
Projet éducatif - 4SAE Microservices

## 👨‍💻 Auteur
Équipe Microservices 2024
