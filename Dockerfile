# ---- Étape 1 : Build PHP (Symfony) ----
FROM php:8.2-fpm as php

RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

# Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php composer-setup.php \
 && mv composer.phar /usr/local/bin/composer \
 && rm composer-setup.php

WORKDIR /var/www/html

# Copier et installer les dépendances Symfony
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copier tout le backend
COPY woofwalks_back/ .

RUN composer dump-autoload --optimize

# Dossiers avec bons droits
RUN mkdir -p public/media var/cache var/log && \
    chown -R www-data:www-data public/media var && \
    chmod -R 775 public/media var

# ---- Étape 2 : Build du frontend React ----
FROM node:18 as frontend
WORKDIR /app
COPY woofwalks_front/package*.json ./
RUN npm ci
COPY woofwalks_front/ .
RUN npm run build

# ---- Étape finale : Nginx + PHP-FPM ----
FROM php:8.2-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copier Symfony depuis l'étape PHP
COPY --from=php /var/www/html /var/www/html

# Copier le build React
COPY --from=frontend /app/build /usr/share/nginx/html

# Copier config Nginx
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Lancer PHP-FPM + Nginx en premier plan
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
