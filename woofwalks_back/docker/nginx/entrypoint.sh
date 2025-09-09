#!/bin/bash
set -e

# Remplacer ${PORT} par la vraie variable d'environnement
PORT=${PORT:-8080}
# On utilise la substitution de variable pour que la configuration Nginx prenne en compte le port
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp && \
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Lancer PHP-FPM et Nginx en spécifiant le bon fichier de configuration
php-fpm -F &          # PHP-FPM en arrière-plan
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf # Nginx en avant-plan