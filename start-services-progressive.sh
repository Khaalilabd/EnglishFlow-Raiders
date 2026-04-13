#!/bin/bash

echo "=========================================="
echo "   DÉMARRAGE PROGRESSIF DES SERVICES"
echo "=========================================="
echo ""

echo "=== Étape 1: Bases de données ==="
docker-compose up -d postgres mysql
echo "Attente 15 secondes..."
sleep 15

echo ""
echo "=== Étape 2: Infrastructure ==="
docker-compose up -d config-server
sleep 20
docker-compose up -d eureka-server
sleep 20

echo ""
echo "=== Étape 3: Keycloak ==="
docker-compose up -d keycloak
sleep 30

echo ""
echo "=== Étape 4: Auth Service ==="
docker-compose up -d auth-service-node
sleep 20

echo ""
echo "=== Étape 5: API Gateway ==="
docker-compose up -d api-gateway
sleep 20

echo ""
echo "=== Étape 6: Services métier (un par un) ==="
docker-compose up -d student-service
sleep 30
docker-compose up -d courses-service
sleep 30
docker-compose up -d clubs-service
sleep 30
docker-compose up -d complaints-service
sleep 30
docker-compose up -d quiz-service
sleep 30

echo ""
echo "=== Étape 7: Monitoring ==="
docker-compose up -d prometheus grafana zipkin

echo ""
echo "=== Étape 8: Frontend ==="
docker-compose up -d frontend

echo ""
echo "=== Attente finale (30 secondes) ==="
sleep 30

echo ""
echo "=== Statut des services ==="
docker-compose ps

echo ""
echo "=========================================="
echo "   ✅ TOUS LES SERVICES DÉMARRÉS"
echo "=========================================="
