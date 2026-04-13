#!/bin/bash

echo "=== Configuration des rôles dans Keycloak ==="

# Obtenir le token admin
TOKEN=$(curl -s "http://localhost:9090/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin&grant_type=password&client_id=admin-cli" | jq -r '.access_token')

echo "Token admin obtenu"

# Créer les rôles ADMIN, TUTOR, STUDENT
echo "Création du rôle ADMIN..."
curl -s -X POST "http://localhost:9090/admin/realms/microservices/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ADMIN",
    "description": "Administrator role"
  }'

echo "Création du rôle TUTOR..."
curl -s -X POST "http://localhost:9090/admin/realms/microservices/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TUTOR",
    "description": "Tutor role"
  }'

echo "Création du rôle STUDENT..."
curl -s -X POST "http://localhost:9090/admin/realms/microservices/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "STUDENT",
    "description": "Student role"
  }'

echo ""
echo "=== Rôles créés avec succès ==="
echo ""

# Lister tous les rôles
echo "Liste des rôles disponibles :"
curl -s "http://localhost:9090/admin/realms/microservices/roles" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name | test("ADMIN|TUTOR|STUDENT")) | "- \(.name): \(.description)"'

echo ""
echo "=== Configuration terminée ==="
