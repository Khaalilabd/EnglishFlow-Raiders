#!/bin/bash

echo "=========================================="
echo "   CRÉATION DES UTILISATEURS DE TEST"
echo "=========================================="
echo ""

# 1. Créer les rôles d'abord
echo "=== Étape 1: Création des rôles ==="
bash setup-roles.sh
echo ""

sleep 2

# 2. Créer les utilisateurs via l'API
echo "=== Étape 2: Création des utilisateurs ==="
echo ""

# ADMIN
echo "Création de l'utilisateur ADMIN..."
curl -s -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@englishflow.com",
    "password": "test123",
    "firstName": "Admin",
    "lastName": "System"
  }' | jq

sleep 1

# TUTOR
echo ""
echo "Création de l'utilisateur TUTOR..."
curl -s -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tutor",
    "email": "tutor@englishflow.com",
    "password": "test123",
    "firstName": "Sarah",
    "lastName": "Johnson"
  }' | jq

sleep 1

# STUDENT
echo ""
echo "Création de l'utilisateur STUDENT..."
curl -s -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student",
    "email": "student@englishflow.com",
    "password": "test123",
    "firstName": "Michael",
    "lastName": "Smith"
  }' | jq

sleep 2

# 3. Assigner les rôles
echo ""
echo "=== Étape 3: Assignation des rôles ==="
echo ""

echo "Assignation du rôle ADMIN..."
bash assign-role.sh admin ADMIN

echo ""
echo "Assignation du rôle TUTOR..."
bash assign-role.sh tutor TUTOR

echo ""
echo "Assignation du rôle STUDENT..."
bash assign-role.sh student STUDENT

# 4. Vérification
echo ""
echo "=== Étape 4: Vérification ==="
echo ""
bash check-users.sh

echo ""
echo "=========================================="
echo "   ✅ UTILISATEURS CRÉÉS AVEC SUCCÈS"
echo "=========================================="
echo ""
echo "Vous pouvez maintenant vous connecter avec:"
echo ""
echo "👤 ADMIN:"
echo "   Username: admin"
echo "   Password: test123"
echo "   Email: admin@englishflow.com"
echo ""
echo "👤 TUTOR:"
echo "   Username: tutor"
echo "   Password: test123"
echo "   Email: tutor@englishflow.com"
echo ""
echo "👤 STUDENT:"
echo "   Username: student"
echo "   Password: test123"
echo "   Email: student@englishflow.com"
echo ""
echo "=========================================="
