#!/bin/bash
set -e

# Replace ${PORT} with the actual environment variable
PORT=${PORT:-8080}
envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.temp && \
mv /etc/nginx/conf.d/default.conf.temp /etc/nginx/conf.d/default.conf

# Start PHP-FPM and Nginx, explicitly telling Nginx to use the correct config
php-fpm -F &          # PHP-FPM in the background
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf # Nginx in the foreground