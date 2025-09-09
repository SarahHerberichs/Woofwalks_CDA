# -----------------------
# Build unique avec Nginx, PHP-FPM, Symfony et React
# -----------------------
FROM php:8.2-fpm

# Installer Nginx, Node.js, et les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    nginx gettext-base \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Installer Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && rm composer-setup.php

# Préparer le backend Symfony
WORKDIR /var/www/html
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist
COPY woofwalks_back/ .
RUN composer dump-autoload --optimize
RUN mkdir -p public/media var/cache var/log \
    && chown -R www-data:www-data public/media var \
    && chmod -R 775 public/media var

# Préparer le frontend React
WORKDIR /app
COPY woofwalks_front/package*.json ./
RUN npm ci
COPY woofwalks_front/ .
RUN npm run build
# Déplacer le frontend dans le dossier de Nginx
RUN mkdir -p /usr/share/nginx/html \
    && mv /app/build/* /usr/share/nginx/html

# Préparer Nginx
RUN mkdir -p /var/lib/nginx/body /var/cache/nginx /var/lib/nginx/proxy /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi \
    && chown -R www-data:www-data /var/lib/nginx /usr/share/nginx/html

# Copier config et entrypoint
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PORT 8080
EXPOSE 8080
CMD ["/usr/local/bin/entrypoint.sh"]