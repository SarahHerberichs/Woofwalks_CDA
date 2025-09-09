#!/bin/bash
set -e

# Remplacer ${PORT} par la vraie variable d'environnement
PORT=${PORT:-8080}
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp && \
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Attendre que la base de données soit disponible
# Ceci est crucial pour éviter les erreurs de connexion au démarrage

# Créer la base de données si elle n'existe pas
php bin/console doctrine:database:create --if-not-exists --no-interaction

# Appliquer les migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Lancer PHP-FPM et Nginx
php-fpm -F &
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf