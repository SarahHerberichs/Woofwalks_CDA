#!/bin/bash
set -e

# Vérifier la variable PORT
if [ -z "$PORT" ]; then
  echo "PORT non défini, utilisation 8080 par défaut"
  PORT=8080
fi

# Remplacer la variable dans default.conf
sed -i "s/\${PORT}/$PORT/" /etc/nginx/conf.d/default.conf

# Afficher les logs pour debug
echo "=== Contenu de /etc/nginx/conf.d/default.conf ==="
cat /etc/nginx/conf.d/default.conf

echo "=== Contenu de /usr/share/nginx/html ==="
ls -l /usr/share/nginx/html

# Lancer PHP-FPM et Nginx
php-fpm -F &
nginx -g 'daemon off;'
