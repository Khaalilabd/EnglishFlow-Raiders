# 🎭 Clubs Service

## 📋 Description
Microservice de gestion des clubs étudiants et adhésions.

## 🚀 Fonctionnalités
- ✅ CRUD complet des clubs
- ✅ Gestion des adhésions
- ✅ Liste des membres par club
- ✅ Swagger/OpenAPI documentation
- ✅ Sécurité Spring Security
- ✅ Health checks
- ✅ Base H2 en mémoire

## 🔌 Port
- **8085** - Clubs Service

## 📦 Technologies
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Spring Cloud Eureka Client
- SpringDoc OpenAPI 2.3.0

## 🗄️ Base de Données
- **Type**: H2 (in-memory)
- **Console**: http://localhost:8085/h2-console

## 🌐 Endpoints

### Swagger UI
```
http://localhost:8085/swagger-ui.html
```

### Clubs API
```bash
# Liste des clubs
GET http://localhost:8085/api/clubs

# Club par ID
GET http://localhost:8085/api/clubs/{id}

# Créer un club
POST http://localhost:8085/api/clubs
Content-Type: application/json
{
  "name": "Club Informatique",
  "description": "Club pour les passionnés d'informatique",
  "category": "TECHNOLOGY"
}

# Rejoindre un club
POST http://localhost:8085/api/clubs/{id}/join
Content-Type: application/json
{
  "studentId": 1
}

# Mettre à jour
PUT http://localhost:8085/api/clubs/{id}

# Supprimer
DELETE http://localhost:8085/api/clubs/{id}
```

## 🐳 Docker
```bash
docker build -t clubs-service:latest .
docker run -p 8085:8085 clubs-service:latest
```

## 📊 Monitoring
- Health: http://localhost:8085/actuator/health
- Metrics: http://localhost:8085/actuator/metrics
