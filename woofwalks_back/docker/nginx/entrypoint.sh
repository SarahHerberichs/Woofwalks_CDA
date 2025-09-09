#!/bin/bash
set -e

# Remplacer ${PORT} par la vraie variable d'environnement
PORT=${PORT:-8080}
# Utiliser envsubst pour substituer les variables d'environnement dans le fichier de configuration de Nginx
# Cette commande est plus robuste que sed pour ce genre de tâche
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp && \
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Lancer PHP-FPM et Nginx
php-fpm -F &          # PHP-FPM en arrière-plan
nginx -g 'daemon off;' # Nginx en avant-plan