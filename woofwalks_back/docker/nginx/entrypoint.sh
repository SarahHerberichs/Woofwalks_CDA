#!/bin/bash
set -e
php-fpm8.2 -F &   # -F = foreground, & pour laisser le script continuer
nginx -g 'daemon off;'
