# --- Étape 1 : Build du backend Symfony ---
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
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist
COPY woofwalks_back/ .
RUN composer dump-autoload --optimize

RUN mkdir -p public/media var/cache var/log \
    && chown -R www-data:www-data public/media var \
    && chmod -R 775 public/media var

# --- Étape 2 : Build du frontend React ---
FROM node:18 as frontend_builder

# Définir le répertoire de travail et copier le code
WORKDIR /app
COPY woofwalks_front/package*.json ./
RUN npm ci
COPY woofwalks_front/ .
RUN npm run build

# ✅ Vérification du build React
RUN ls -l /app/build
RUN cat /app/build/index.html | head -n 10

# --- Étape finale : Production ---
FROM php:8.2-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx \
    && rm -f /etc/nginx/conf.d/default.conf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Répertoires Nginx
RUN mkdir -p /var/lib/nginx/body /var/cache/nginx /var/lib/nginx/proxy \
    /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi \
    && chown -R www-data:www-data /var/lib/nginx

# Copier backend
COPY --from=php_builder /var/www/html /var/www/html

# Copier frontend
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Config Nginx + Entrypoint
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exposer le port
EXPOSE 80

# Lancer entrypoint
CMD ["/usr/local/bin/entrypoint.sh"]
