#!/bin/bash

echo "=========================================="
echo "   RECONSTRUCTION DES SERVICES"
echo "=========================================="
echo ""

SERVICES=("student-service" "courses-service" "complaints-service" "clubs-service" "quiz-service")

for SERVICE in "${SERVICES[@]}"; do
    echo "=== Reconstruction de $SERVICE ==="
    docker-compose build $SERVICE
    echo ""
done

echo "=== Redémarrage des services ==="
docker-compose up -d student-service courses-service complaints-service clubs-service quiz-service

echo ""
echo "Attente du démarrage des services (60 secondes)..."
sleep 60

echo ""
echo "=== Vérification du statut ==="
docker-compose ps | grep -E "student-service|courses-service|complaints-service|clubs-service|quiz-service"

echo ""
echo "=========================================="
echo "   ✅ SERVICES RECONSTRUITS"
echo "=========================================="
