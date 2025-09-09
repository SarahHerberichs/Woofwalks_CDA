# --- Étape 1 : Build du backend Symfony ---
FROM php:8.2-fpm as php_builder

# Installer les dépendances système et PHP
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

# Installer Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && rm composer-setup.php

# Définir le répertoire de travail et copier le code
WORKDIR /var/www/html
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist
COPY woofwalks_back/ .
RUN composer dump-autoload --optimize

# Définir les permissions
RUN mkdir -p public/media var/cache var/log && \
    chown -R www-data:www-data public/media var && \
    chmod -R 775 public/media var

# --- Étape 2 : Build du frontend React ---
FROM node:18 as frontend_builder

# Définir le répertoire de travail et copier le code
WORKDIR /app
COPY woofwalks_front/package*.json ./
RUN npm ci
COPY woofwalks_front/ .
RUN npm run build
RUN ls -la /app

# --- Étape finale : Création de l'image de production ---
# Utiliser une image qui contient déjà PHP-FPM
FROM php:8.2-fpm

# Installer Nginx et supprimer le fichier de configuration par défaut
RUN apt-get update && apt-get install -y nginx \
    && rm -f /etc/nginx/conf.d/default.conf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copier les fichiers du backend
COPY --from=php_builder /var/www/html /var/www/html

# Copier les fichiers du frontend
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Copier et rendre exécutable le script d'entrée
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copier la configuration Nginx
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Créer un répertoire de socket pour PHP-FPM
RUN mkdir -p /var/run/php

# Exposer le port Nginx
EXPOSE 80

# Démarrer Nginx et PHP-FPM
# Utilise un script shell pour lancer les deux en même temps
CMD ["/usr/local/bin/entrypoint.sh"]