#!/bin/bash

echo "=========================================="
echo "   MISE À JOUR AUTH-SERVICE-NODE"
echo "=========================================="
echo ""

echo "=== Arrêt du service ==="
docker-compose stop auth-service-node

echo ""
echo "=== Suppression du conteneur ==="
docker-compose rm -f auth-service-node

echo ""
echo "=== Reconstruction de l'image ==="
docker-compose build auth-service-node

echo ""
echo "=== Démarrage du service ==="
docker-compose up -d auth-service-node

echo ""
echo "=== Attente du démarrage (20 secondes) ==="
sleep 20

echo ""
echo "=== Application de la migration ==="
docker exec auth-service-node npx prisma migrate deploy

echo ""
echo "=== Vérification du statut ==="
docker ps | grep auth-service-node

echo ""
echo "=== Logs du service ==="
docker logs auth-service-node --tail 20

echo ""
echo "=========================================="
echo "   ✅ AUTH-SERVICE-NODE MIS À JOUR"
echo "=========================================="
echo ""
echo "Nouvelles fonctionnalités disponibles :"
echo "- GET /api/auth/users?search=john&role=STUDENT&isActive=true&page=1&limit=10"
echo "- GET /api/auth/users/stats"
echo "- GET /api/auth/users/:userId"
echo "- PUT /api/auth/users/:userId (body: {isActive: true, role: 'ADMIN'})"
echo ""
