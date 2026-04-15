# Documentation - Guide d'Évaluation du Projet

## 📋 Vue d'ensemble
Ce document détaille les critères d'évaluation et les concepts clés du projet d'applications web distribuées.

---

## 1️⃣ Micro-service (1 pt)

**Définition :** Architecture où l'application est divisée en services indépendants et autonomes.

**Scénario :**
Un étudiant accède à la plateforme. Le service d'authentification vérifie ses identifiants, le service des cours récupère sa liste de cours, et le service des clubs affiche ses adhésions. Chaque service fonctionne indépendamment avec sa propre base de données.

---

## 2️⃣ Compréhension du code (3 pts)

**Définition :** Capacité à expliquer la logique, l'architecture et les choix techniques du code développé.

**Scénario :**
L'enseignant demande : "Pourquoi avez-vous utilisé Feign Client ici ?" L'étudiant explique : "Pour simplifier la communication synchrone entre le service d'authentification et le service étudiant, en évitant le code boilerplate de RestTemplate."

---

## 1️⃣ Micro-service avec technologie avancée (2 pts)

**Définition :** Utilisation de technologies modernes et performantes pour développer les micro-services.

**Critères :**
- **1 pt** pour le changement de technologie (ex: passer de Spring Boot à Node.js/Express)
- **1 pt** pour l'utilisation d'une BD avancée (MongoDB ou PostgreSQL au lieu de H2)

**Scénario :**
Le service d'authentification est développé en Node.js avec TypeScript et utilise PostgreSQL avec Prisma ORM, tandis que les autres services restent en Spring Boot. Cela démontre la polyglotte architecture des micro-services.

---

## 3️⃣ Serveur de découverte (Eureka) (1 pt)

**Définition :** Service registry permettant aux micro-services de s'enregistrer et de se découvrir dynamiquement.

**Scénario :**
Au démarrage, le service des quiz s'enregistre automatiquement sur Eureka Server à l'adresse `http://localhost:8761`. L'API Gateway consulte Eureka pour trouver l'adresse IP et le port du service des quiz sans configuration manuelle.

---

## 4️⃣ Config Server (1 pt)

**Définition :** Serveur centralisé pour gérer les configurations de tous les micro-services.

**Scénario :**
Toutes les configurations (ports, URLs de base de données, paramètres JWT) sont stockées dans un dépôt Git. Lorsqu'un service démarre, il récupère sa configuration depuis le Config Server au lieu d'utiliser des fichiers `application.yml` locaux.

---

## 5️⃣ Gateway (1 pt)

**Définition :** Point d'entrée unique qui route les requêtes vers les micro-services appropriés.

**Scénario :**
Un client envoie une requête à `http://localhost:8080/api/courses/list`. L'API Gateway intercepte la requête, vérifie le token JWT, puis route vers le service des cours à `http://localhost:8082/courses/list`.

---

## 2️⃣ Sécurité (2,5 pts)

**Définition :** Protection de l'application contre les accès non autorisés.

### Composantes :

#### a) Utilisation de Keycloak
**Scénario :**
Un utilisateur se connecte via Keycloak. Le système génère un token JWT contenant les rôles (STUDENT, TEACHER, ADMIN). Chaque requête inclut ce token pour vérifier les permissions.

#### b) Validation JWT selon l'effort fourni
**Scénario :**
L'API Gateway valide le token JWT avant de router les requêtes. Si le token est expiré ou invalide, la requête est rejetée avec un code 401 Unauthorized.

#### c) Sécurité Gateway avec Keycloak - Gestion des rôles
**Scénario :**
Un étudiant tente d'accéder à `/api/admin/users`. Le Gateway vérifie son rôle via Keycloak et refuse l'accès car seul le rôle ADMIN est autorisé pour cette route.

#### d) Template Keycloak personnalisé (front-end)
**Scénario :**
La page de connexion Keycloak affiche le logo de l'université, les couleurs de la charte graphique, et des messages en français au lieu de l'interface par défaut.

---

## 3️⃣ Git (1 pt)

**Définition :** Gestion de version avec commits réguliers et documentation claire.

**Scénario :**
Le dépôt Git contient :
- Des commits réguliers : "feat: add quiz service", "fix: resolve authentication bug"
- Un README.md détaillé expliquant l'architecture, les prérequis, et les commandes de démarrage
- Un fichier ARCHITECTURE.md décrivant les interactions entre services

---

## 6️⃣ Docker compose (2 pts)

**Définition :** Orchestration de tous les services via Docker pour un déploiement simplifié.

**Scénario :**
Un seul fichier `docker-compose.yml` définit tous les services (Eureka, Config Server, Gateway, bases de données, Keycloak). La commande `docker-compose up` démarre l'ensemble de l'infrastructure en quelques minutes.

---

## 7️⃣ Partie Front (1,5 pt)

**Définition :** Interface utilisateur permettant d'interagir avec les micro-services.

**Scénario :**
Une application React affiche :
- Page de connexion intégrée avec Keycloak
- Dashboard étudiant montrant les cours, quiz et clubs
- Interface responsive fonctionnant sur mobile et desktop
- Appels API vers le Gateway pour récupérer les données

---

## 4️⃣ Communication entre les MS (2 pts)

**Définition :** Échange de données entre micro-services de manière synchrone ou asynchrone.

### Technologies :

#### Feign Client (Communication synchrone)
**Scénario :**
Le service d'authentification utilise Feign Client pour appeler le service étudiant et récupérer les informations de profil lors de l'inscription :
```java
@FeignClient(name = "student-service")
public interface StudentClient {
    @GetMapping("/students/{id}")
    StudentDTO getStudent(@PathVariable Long id);
}
```

#### RabbitMQ (Communication asynchrone)
**Scénario :**
Lorsqu'un étudiant s'inscrit à un club, le service des clubs publie un message dans RabbitMQ. Le service de notification consomme ce message et envoie un email de confirmation sans bloquer la requête initiale.

**Exigence :** Montrer au moins 2 scénarios pour chaque type de communication.

---

## 5️⃣ Valeurs ajoutées (2 pts)

**Définition :** Fonctionnalités supplémentaires démontrant une maîtrise avancée.

### Exemples :

#### Déploiement Docker via le cloud
**Scénario :**
L'application est déployée sur AWS ECS ou Azure Container Instances. Les tests sont automatisés via KillerCoda pour valider le déploiement.

#### Monitoring : Prometheus + Grafana
**Scénario :**
Prometheus collecte les métriques (CPU, mémoire, temps de réponse) de chaque micro-service. Grafana affiche des dashboards en temps réel montrant la santé du système.

#### CI/CD : GitHub Actions / GitLab CI
**Scénario :**
À chaque push sur la branche `main`, GitHub Actions :
1. Exécute les tests unitaires
2. Build les images Docker
3. Déploie automatiquement sur l'environnement de staging

#### Orchestration, load balancing et tolérance aux pannes (Kubernetes)
**Scénario :**
Les services sont déployés sur Kubernetes avec :
- 3 réplicas du service des cours pour le load balancing
- Health checks automatiques redémarrant les pods défaillants
- Auto-scaling basé sur la charge CPU

#### Documentation Swagger centralisée (API Gateway)
**Scénario :**
L'API Gateway expose une interface Swagger à `http://localhost:8080/swagger-ui.html` regroupant la documentation de tous les micro-services. Les développeurs peuvent tester les endpoints directement depuis le navigateur.

---

## 📊 Barème Total : 20 points

| Critère | Points |
|---------|--------|
| Micro-service (spring boot) | 1 pt |
| Compréhension du code | 3 pts |
| Micro-service (technologie avancée + BD) | 2 pts |
| Serveur de découverte (Eureka) | 1 pt |
| Config Server | 1 pt |
| Gateway | 1 pt |
| Sécurité | 2,5 pts |
| Git et documentation | 1 pt |
| Docker compose | 2 pts |
| Partie Front | 1,5 pt |
| Communication entre MS | 2 pts |
| Valeurs ajoutées | 2 pts |
| **TOTAL** | **20 pts** |

---

## 🎯 Conseils pour maximiser les points

1. **Commits réguliers** : Commitez fréquemment avec des messages clairs
2. **Documentation complète** : README détaillé + diagrammes d'architecture
3. **Sécurité robuste** : Implémentez Keycloak avec gestion des rôles
4. **Communication mixte** : Utilisez Feign Client ET RabbitMQ
5. **Valeurs ajoutées** : Choisissez 2-3 fonctionnalités avancées réalisables
6. **Tests** : Démontrez que votre application fonctionne de bout en bout

---

**Date d'évaluation :** Semaine du 13-04-2026
