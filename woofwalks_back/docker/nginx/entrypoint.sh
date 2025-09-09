#!/bin/sh

# Démarrer PHP-FPM en arrière-plan
php-fpm -D

# Démarrer Nginx en premier plan
nginx -g 'daemon off;'