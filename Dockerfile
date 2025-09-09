# -----------------------
# Étape 1 : Build backend Symfony
# -----------------------
FROM php:8.2-fpm as php_builder

RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

# Installer Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && rm composer-setup.php

WORKDIR /var/www/html

# Installer dépendances Composer
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copier le code backend
COPY woofwalks_back/ .
RUN composer dump-autoload --optimize

# Préparer dossiers Symfony
RUN mkdir -p public/media var/cache var/log \
    && chown -R www-data:www-data public/media var \
    && chmod -R 775 public/media var

# -----------------------
# Étape 2 : Build frontend React
# -----------------------
FROM node:18 as frontend_builder

WORKDIR /app

COPY woofwalks_front/package*.json ./
RUN npm ci

COPY woofwalks_front/ .
RUN npm run build

# -----------------------
# Étape finale : Production
# -----------------------
FROM php:8.2-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Préparer dossiers Nginx
RUN mkdir -p /var/lib/nginx/body /var/cache/nginx /var/lib/nginx/proxy \
    /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi \
    && chown -R www-data:www-data /var/lib/nginx

# Copier backend Symfony
COPY --from=php_builder /var/www/html /var/www/html

# Copier frontend React
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Supprimer toutes les anciennes configs et copier la config propre
RUN rm -f /etc/nginx/conf.d/*
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copier entrypoint
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Définir le port exposé
ENV PORT 8080
EXPOSE 8080

# Lancer le conteneur
CMD ["/usr/local/bin/entrypoint.sh"]
