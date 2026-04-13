# 🔐 Auth Service

## 📋 Description
Service d'authentification avec intégration Keycloak OAuth2/JWT.

## 🚀 Fonctionnalités
- ✅ Authentification OAuth2 avec Keycloak
- ✅ Gestion des tokens JWT
- ✅ Login/Register
- ✅ Refresh tokens
- ✅ Swagger/OpenAPI documentation
- ✅ Sécurité Spring Security
- ✅ Health checks

## 🔌 Port
- **8081** - Auth Service

## 📦 Technologies
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Keycloak 23.0
- Spring Cloud Eureka Client
- SpringDoc OpenAPI 2.3.0

## 🗄️ Base de Données
- **Type**: PostgreSQL
- **Database**: auth_db
- **Port**: 5432

## 🌐 Endpoints

### Swagger UI
```
http://localhost:8081/swagger-ui.html
```

### Auth API
```bash
# Login
POST http://localhost:8081/api/auth/login
Content-Type: application/json
{
  "username": "demo",
  "password": "demo123"
}

# Register
POST http://localhost:8081/api/auth/register
Content-Type: application/json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}

# Refresh Token
POST http://localhost:8081/api/auth/refresh
Content-Type: application/json
{
  "refreshToken": "your-refresh-token"
}
```

## 🔑 Keycloak Configuration
- **URL**: http://localhost:9090
- **Realm**: microservices
- **Client**: microservices-client
- **Admin**: admin / admin

## 🐳 Docker
```bash
docker build -t auth-service:latest .
docker run -p 8081:8081 auth-service:latest
```

## 📊 Monitoring
- Health: http://localhost:8081/actuator/health
- Metrics: http://localhost:8081/actuator/metrics
