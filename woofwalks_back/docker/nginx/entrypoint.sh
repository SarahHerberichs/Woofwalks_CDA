
set -e

echo "=== Contenu de /usr/share/nginx/html au démarrage ==="
ls -l /usr/share/nginx/html
echo "=== Début index.html ==="
head -n 10 /usr/share/nginx/html/index.html

# Lancer PHP-FPM et Nginx
php-fpm -F &    # foreground
nginx -g 'daemon off;'
