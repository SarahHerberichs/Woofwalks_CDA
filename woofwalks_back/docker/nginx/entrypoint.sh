#!/bin/sh
php-fpm -F -R &  # -F = foreground, -R = listen as TCP
nginx -g 'daemon off;'
