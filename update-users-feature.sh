#!/bin/bash

echo "=========================================="
echo "   MISE À JOUR GESTION UTILISATEURS"
echo "=========================================="
echo ""

echo "=== 1. Mise à jour auth-service-node ==="
bash update-auth-service.sh

echo ""
echo "=== 2. Reconstruction du frontend ==="
docker-compose build frontend

echo ""
echo "=== 3. Redémarrage du frontend ==="
docker-compose up -d frontend

echo ""
echo "=== 4. Attente (10 secondes) ==="
sleep 10

echo ""
echo "=========================================="
echo "   ✅ MISE À JOUR TERMINÉE"
echo "=========================================="
echo ""
echo "Nouvelles fonctionnalités :"
echo "✅ Recherche en temps réel"
echo "✅ Filtres par rôle et statut"
echo "✅ Tri par différents champs"
echo "✅ Statistiques en temps réel"
echo "✅ Activation/désactivation rapide"
echo ""
echo "Accédez à http://localhost:4200"
echo ""
