FROM php:8.2-fpm as php

RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client nginx \
    && docker-php-ext-install zip pdo pdo_mysql

# Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
 && php composer-setup.php \
 && mv composer.phar /usr/local/bin/composer \
 && rm composer-setup.php

WORKDIR /var/www/html

# Installer les dépendances Symfony
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

# Dossier media avec bons droits
RUN mkdir -p public/media && \
    chown -R www-data:www-data public/media && \
    chmod -R 775 public/media

# Dossier var/ Symfony (cache + logs)
RUN mkdir -p var/cache var/log && \
    chown -R www-data:www-data var && \
    chmod -R 775 var

# ---- Étape 2 : Build du frontend ----
FROM node:18 as frontend
WORKDIR /app
COPY ./../woofwalks_front/package*.json ./
RUN npm ci
COPY ./../woofwalks_front .
RUN npm run build

# ---- Étape finale : Nginx + PHP ----
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copier Symfony
COPY --from=php /var/www/html /var/www/html

# Copier le build du frontend
COPY --from=frontend /app/build /usr/share/nginx/html

# Copier config Nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
