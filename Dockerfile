# -----------------------
# Étape 1 : Build backend Symfony
# -----------------------
FROM php:8.2-fpm as php_builder

RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && rm composer-setup.php

WORKDIR /var/www/html

COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY woofwalks_back/ .
RUN composer dump-autoload --optimize

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
RUN mkdir -p /var/lib/ngi
