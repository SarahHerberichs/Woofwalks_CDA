#!/bin/bash
# entrypoint.sh

# Démarre PHP-FPM en arrière-plan
php-fpm -D

# Démarre Nginx au premier plan
nginx -g 'daemon off;'
