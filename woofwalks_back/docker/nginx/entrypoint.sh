#!/bin/sh

# Lancer PHP-FPM en TCP sur 9000
php-fpm -R &

# Lancer Nginx en foreground
nginx -g 'daemon off;'
