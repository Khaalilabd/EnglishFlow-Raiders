# 📝 Complaints Service

## 📋 Description
Microservice de gestion des réclamations étudiantes.

## 🚀 Fonctionnalités
- ✅ CRUD complet des réclamations
- ✅ Statut des réclamations (PENDING, IN_PROGRESS, RESOLVED)
- ✅ Swagger/OpenAPI documentation
- ✅ Sécurité Spring Security
- ✅ Health checks
- ✅ Base H2 en mémoire

## 🔌 Port
- **8084** - Complaints Service

## 📦 Technologies
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Spring Cloud Eureka Client
- SpringDoc OpenAPI 2.3.0

## 🗄️ Base de Données
- **Type**: H2 (in-memory)
- **Console**: http://localhost:8084/h2-console

## 🌐 Endpoints

### Swagger UI
```
http://localhost:8084/swagger-ui.html
```

### Complaints API
```bash
# Liste des réclamations
GET http://localhost:8084/api/complaints

# Réclamation par ID
GET http://localhost:8084/api/complaints/{id}

# Créer une réclamation
POST http://localhost:8084/api/complaints
Content-Type: application/json
{
  "title": "Problème avec le cours",
  "description": "Description détaillée",
  "studentId": 1,
  "status": "PENDING"
}

# Mettre à jour
PUT http://localhost:8084/api/complaints/{id}

# Supprimer
DELETE http://localhost:8084/api/complaints/{id}
```

## 🐳 Docker
```bash
docker build -t complaints-service:latest .
docker run -p 8084:8084 complaints-service:latest
```

## 📊 Monitoring
- Health: http://localhost:8084/actuator/health
- Metrics: http://localhost:8084/actuator/metrics
