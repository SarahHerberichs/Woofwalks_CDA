#!/bin/bash
set -e

echo "=== Contenu de /usr/share/nginx/html ==="
ls -l /usr/share/nginx/html

echo "=== Contenu de /etc/nginx/conf.d/default.conf ==="
cat /etc/nginx/conf.d/default.conf

# Remplacer le port Nginx par celui de Railway
sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/conf.d/default.conf

# Lancer PHP-FPM et Nginx
php-fpm -F &       # PHP-FPM en arrière-plan
nginx -g 'daemon off;'  # Nginx au premier plan
