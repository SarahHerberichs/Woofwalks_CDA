#!/bin/bash
set -e

# Définir les variables d'environnement si non définies
export APP_ENV=${APP_ENV:-prod}
export APP_DEBUG=${APP_DEBUG:-0}

# Se déplacer dans le répertoire Symfony
cd /var/www/html

# Remplacer ${PORT} dans la config Nginx
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Créer la base de données si elle n'existe pas
php bin/console doctrine:database:create --if-not-exists --no-interaction

# Appliquer les migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Lancer PHP-FPM et Nginx
php-fpm -F &
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
