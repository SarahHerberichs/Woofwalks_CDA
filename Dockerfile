# --- Étape 1 : Build du backend Symfony ---
FROM php:8.2-fpm as php_builder
# ... (les étapes du build PHP sont inchangées) ...

# --- Étape 2 : Build du frontend React ---
FROM node:18 as frontend_builder
# ... (les étapes du build React sont inchangées) ...

# --- Étape finale : Création de l'image de production ---
FROM php:8.2-fpm

# Installer Nginx et supprimer le fichier de configuration par défaut
RUN apt-get update && apt-get install -y nginx \
    && rm -f /etc/nginx/conf.d/default.conf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copier les fichiers du backend
COPY --from=php_builder /var/www/html /var/www/html

# Copier les fichiers du frontend
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Copier la configuration Nginx
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Créer un répertoire de socket pour PHP-FPM
RUN mkdir -p /var/run/php

# Exposer le port Nginx
EXPOSE 80

# Démarrer Nginx et PHP-FPM
CMD ["sh", "-c", "php-fpm && nginx -g 'daemon off;'"]