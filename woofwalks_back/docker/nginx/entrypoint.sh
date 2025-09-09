#!/bin/sh
echo "=== Nginx config ==="
cat /etc/nginx/conf.d/default.conf
php-fpm -R &
sleep 2
nginx -g 'daemon off;'
