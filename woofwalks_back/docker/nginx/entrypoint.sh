#!/bin/bash
set -e

export APP_ENV=${APP_ENV:-prod}
export APP_DEBUG=${APP_DEBUG:-0}

cd /var/www/html

# Remplacer ${PORT} dans Nginx
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# 0️⃣ Vider le cache pour éviter les problèmes de configuration ou de routes
php bin/console cache:clear --no-warmup

# 1️⃣ Créer la base si elle n'existe pas
php bin/console doctrine:database:create --if-not-exists --no-interaction

# 2️⃣ Appliquer les migrations pour créer les tables
php bin/console doctrine:migrations:migrate --no-interaction


# 3️⃣ Lancer PHP-FPM et Nginx
php-fpm -F &
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
