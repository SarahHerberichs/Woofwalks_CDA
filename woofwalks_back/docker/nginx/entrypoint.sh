#!/bin/bash
set -e

echo "=== Contenu de /usr/share/nginx/html ==="
ls -l /usr/share/nginx/html

echo "=== Contenu de /etc/nginx/conf.d/default.conf avant modification ==="
cat /etc/nginx/conf.d/default.conf

# Remplacer le port par la variable Railway
sed -i "s/listen .*/listen ${PORT};/" /etc/nginx/conf.d/default.conf

echo "=== Contenu de /etc/nginx/conf.d/default.conf après modification ==="
cat /etc/nginx/conf.d/default.conf

# Lancer PHP-FPM et Nginx
php-fpm -F &          # PHP-FPM en arrière-plan
nginx -g 'daemon off;' # Nginx en avant-plan
