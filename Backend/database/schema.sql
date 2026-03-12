-- Créer les types ENUM
CREATE TYPE role_utilisateur_enum AS ENUM ('admin', 'employe');
CREATE TYPE statut_demande_enum AS ENUM ('en_attente', 'approuvee', 'refusee', 'annulee');

-- Table Role
CREATE TABLE "Role" (
    id INTEGER PRIMARY KEY,
    nom VARCHAR(50)
);

-- Table Utilisateur
CREATE TABLE "Utilisateur" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role role_utilisateur_enum NOT NULL DEFAULT 'employe',
    date_embauche DATE NOT NULL,
    solde_conges INTEGER NOT NULL DEFAULT 0,
    jours_alloues_annuellement INTEGER NOT NULL DEFAULT 25,
    role_id INTEGER REFERENCES "Role"(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Table TypeConge
CREATE TABLE "TypeConge" (
    id INTEGER PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    jours_par_defaut INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP
);

-- Table Conge
CREATE TABLE "Conge" (
    id INTEGER PRIMARY KEY,
    id_demandeur INTEGER NOT NULL REFERENCES "Utilisateur"(id) ON DELETE CASCADE,
    type_conge_id INTEGER REFERENCES "TypeConge"(id),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut statut_demande_enum NOT NULL DEFAULT 'en_attente',
    date_demande TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT check_dates CHECK (date_fin >= date_debut)
);