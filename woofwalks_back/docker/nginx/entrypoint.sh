#!/bin/bash
set -e

echo "=== Contenu de /usr/share/nginx/html ==="
ls -l /usr/share/nginx/html || true

echo "=== Config Nginx avant modification ==="
cat /etc/nginx/conf.d/default.conf

# Remplacer le port par la variable Railway
sed -i "s/listen .*/listen ${PORT};/" /etc/nginx/conf.d/default.conf

echo "=== Config Nginx après modification ==="
cat /etc/nginx/conf.d/default.conf

# Vérifier la config
nginx -t

# Lancer PHP-FPM (en arrière-plan) et Nginx (en avant-plan)
php-fpm -F &
nginx -g 'daemon off;'
