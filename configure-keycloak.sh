#!/bin/bash

# Obtenir le token admin
TOKEN=$(curl -s http://localhost:9090/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

echo "Token obtenu"

# Récupérer l'ID du client microservices-client
CLIENT_ID=$(curl -s http://localhost:9090/admin/realms/microservices/clients \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.clientId=="microservices-client") | .id')

echo "Client ID: $CLIENT_ID"

# Récupérer l'ID du client realm-management
REALM_MGMT_ID=$(curl -s http://localhost:9090/admin/realms/microservices/clients \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.clientId=="realm-management") | .id')

echo "Realm Management Client ID: $REALM_MGMT_ID"

# Récupérer l'ID du service account user
SERVICE_ACCOUNT_ID=$(curl -s http://localhost:9090/admin/realms/microservices/clients/$CLIENT_ID/service-account-user \
  -H "Authorization: Bearer $TOKEN" | jq -r '.id')

echo "Service Account User ID: $SERVICE_ACCOUNT_ID"

# Récupérer les rôles manage-users, view-users, create-client
MANAGE_USERS_ROLE=$(curl -s http://localhost:9090/admin/realms/microservices/clients/$REALM_MGMT_ID/roles/manage-users \
  -H "Authorization: Bearer $TOKEN")

VIEW_USERS_ROLE=$(curl -s http://localhost:9090/admin/realms/microservices/clients/$REALM_MGMT_ID/roles/view-users \
  -H "Authorization: Bearer $TOKEN")

CREATE_CLIENT_ROLE=$(curl -s http://localhost:9090/admin/realms/microservices/clients/$REALM_MGMT_ID/roles/create-client \
  -H "Authorization: Bearer $TOKEN")

echo "Rôles récupérés"

# Assigner les rôles au service account
curl -s -X POST http://localhost:9090/admin/realms/microservices/users/$SERVICE_ACCOUNT_ID/role-mappings/clients/$REALM_MGMT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "[$MANAGE_USERS_ROLE, $VIEW_USERS_ROLE, $CREATE_CLIENT_ROLE]"

echo "Rôles assignés au service account"
echo "Configuration Keycloak terminée !"
