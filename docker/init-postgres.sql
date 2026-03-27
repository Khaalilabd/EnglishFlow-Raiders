-- Création de la base de données principale
-- CREATE DATABASE microservices;  -- Déjà créée par POSTGRES_DB

-- Connexion à la base microservices et création du schéma keycloak
-- Les commandes suivantes seront exécutées dans la base microservices

-- Créer le schéma pour Keycloak
CREATE SCHEMA IF NOT EXISTS keycloak;

-- Les tables seront créées automatiquement par:
-- - Prisma pour auth-service-node (table users dans le schéma public)
-- - Keycloak pour ses propres tables (dans le schéma keycloak)
