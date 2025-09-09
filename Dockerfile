# --- Étape 1 : Build du backend Symfony ---
FROM php:8.2-fpm as php_builder

# ... (les étapes précédentes pour le build PHP restent inchangées) ...

# --- Étape 2 : Build du frontend React ---
FROM node:18 as frontend_builder

# ... (les étapes précédentes pour le build React restent inchangées) ...

# --- Étape finale : Création de l'image de production ---
FROM php:8.2-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copier les fichiers du backend
COPY --from=php_builder /var/www/html /var/www/html

# Copier les fichiers du frontend
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Copier la configuration Nginx
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copier et rendre exécutable le script d'entrée
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# # Créer le répertoire de socket pour PHP-FPM
# RUN mkdir -p /var/run/php

# Exposer le port Nginx
EXPOSE 80

# Utiliser le script d'entrée pour lancer les services
CMD ["entrypoint.sh"]