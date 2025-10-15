🐾 Woofwalks : Communauté et Organisation de Balades Canines

Description du Projet

Woofwalks est une application web conteneurisée (Docker) qui permet aux propriétaires de chiens d'organiser et de participer à des balades collectives. Le back-end est propulsé par Symfony/API Platform et le front-end par React.

J'ai réalisé ma soutenance sur ce projet, par conséquent toute la conception est accessible dans docsCDA. Le dossier professionnel qui synthétise l'ensemble de la démarche est dans Sarah-DossierProjet_CDA_29092025 en PDF ou doc.

🛑 Étape 0 : Configuration de Sécurité et Fichiers Ignorés (Obligatoire)

Pour des raisons de sécurité, les secrets (mots de passe DB, clés JWT, certificats SSL) et les configurations locales ne sont pas inclus dans Git. L'application ne démarrera pas sans que vous ayez créé et rempli ces fichiers avec VOS PROPRES VALEURS SECRÈTES.

1. Création et Contenu des Fichiers d'Environnement

Vous devez créer tous les fichiers .env* listés ci-dessous et remplacer toutes les valeurs entre crochets [...] par vos propres secrets.

Fichier .env.docker (Racine)

Ce fichier est lu par docker-compose pour configurer les conteneurs db et phpmyadmin.

    Variables à définir :

        DB_ROOT_PASSWORD

        DB_NAME

        DB_USER

        DB_PASSWORD

        DB_NAME_TEST

        CORS_ALLOW_ORIGIN=^https://localhost:3000

        LOCK_DSN="flock://%kernel.cache_dir%/lock"

Fichier woofwalks_back/.env (Configuration de Développement Symfony)

Ce fichier est lu par le conteneur php-fpm.

    Variables à définir :

        DATABASE_URL

        FRONTEND_URL

        JWT_PASSPHRASE=[VOTRE_PHRASE_SECRETE_JWT] (Utilisée pour chiffrer les clés JWT)

        MAILER_DSN

        APP_SECRET=[VOTRE_SECRET_HEXADECIMAL_ALEATOIRE]

        CORS_ALLOW_ORIGIN=https://localhost:3000

        LOCK_DSN=flock://%kernel.cache_dir%/lock

        Les autres variables (JWT_SECRET_KEY, APP_ENV=dev, etc.) sont généralement laissées telles quelles.

Fichier woofwalks_back/.env.local

Ce fichier surcharge les valeurs de .env pour le développement local.

Fichier woofwalks_back/.env.test (Configuration pour les Tests)

    Variables à définir :

        DATABASE_URL="mysql://root:[VOTRE_MOT_DE_PASSE_ROOT_DB]@db:3306/woofwalks" 

        APP_SECRET=[VOTRE_SECRET_HEXADECIMAL_ALEATOIRE]

Fichier woofwalks_front/.env

    Variable à définir :

        REACT_APP_API_URL=https://localhost:8443

2. Clés d'Authentification et Certificats SSL

Vous devez générer vos propres clés de sécurité pour l'API et les certificats SSL pour l'environnement HTTPS.

    Clés JWT (Back-end) :

        Créer le dossier : mkdir -p woofwalks_back/config/jwt

        private.pem et public.pem : Doivent être générées (Clé privée, et Clé publique dérivée).

    Certificats SSL :

        Créer les dossiers : mkdir certs et mkdir woofwalks_front/certs

        certs/nginx.crt et certs/nginx.key : Certificats utilisés par Nginx.

        woofwalks_front/certs/frontend_cert et woofwalks_front/certs/frontend_key : Certificats utilisés par le serveur de développement React.

🚀 Démarrage Rapide (avec Docker Compose)

Prérequis

    Docker et Docker Compose
    
      **Make** (pour utiliser les commandes simplifiées) :
      
    - **WSL/Linux** : Généralement déjà installé (`make --version` pour vérifier)
    - **Windows PowerShell** : `choco install make`
    - **macOS** : `xcode-select --install`

    Utiliser les commandes "Make.." définies dans le Makefile à la racine (make start , make up-build ...)
    
1. Cloner et Lancer les Services


git clone https://github.com/SarahHerberichs/Woofwalks_CDA.git
placez-vous dans le dossier Woofwalks_CDA
make up-build

# EXÉCUTER TOUTES LES ÉTAPES DE CONFIGURATION CI-DESSUS !

2. Accès

    Front-end (React) : https://localhost:3000
    Back-end (API Platform) : https://localhost:8443
    PhpMyAdmin : http://localhost:8081

BDD : 

Aller dans le conteneur php (docker exec -it woofwalks_php-fpm bash) et exécuter les commandes de migrations pour initialiser votre BDD
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction
php bin/console cache:clear

Architecture Technique

    Back-end  : Symfony 6 & API Platform
    
    Base de données : MySQL
    
    Serveur web : Nginx

    Front-end : React 18.3.1
  
    Conteneurisation : Docker

Commandes Utiles (via Make)

    make up : Démarre les conteneurs.

    make down : Arrête et supprime les conteneurs.

    make install : Initialisation complète (dépendances, migrations, fixtures).

    make php : Accède au shell du conteneur PHP-FPM.

    make logs : Affiche les logs de tous les services.

📄 Note Légale

Ce projet a été développé dans le cadre d'une formation CDA.
