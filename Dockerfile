# -----------------------
# Build backend Symfony
# -----------------------
FROM php:8.2-fpm as php_builder
RUN apt-get update && apt-get install -y libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

WORKDIR /var/www/html
COPY woofwalks_back/composer.json woofwalks_back/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist
COPY woofwalks_back/ .
RUN composer dump-autoload --optimize
RUN mkdir -p public/media var/cache var/log && chown -R www-data:www-data public/media var && chmod -R 775 public/media var

# -----------------------
# Build frontend React
# -----------------------
FROM node:18 as frontend_builder
WORKDIR /app
COPY woofwalks_front/package*.json ./
RUN npm ci
COPY woofwalks_front/ .
RUN npm run build

# -----------------------
# Production
# -----------------------
FROM php:8.2-fpm
RUN apt-get update && apt-get install -y nginx && apt-get clean && rm -rf /var/lib/apt/lists/*

# Préparer Nginx
RUN mkdir -p /var/lib/nginx/body /var/cache/nginx /var/lib/nginx/proxy /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi \
    && chown -R www-data:www-data /var/lib/nginx

# Copier backend et frontend
COPY --from=php_builder /var/www/html /var/www/html
COPY --from=frontend_builder /app/build /usr/share/nginx/html

# Copier config et entrypoint
COPY woofwalks_back/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY woofwalks_back/docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PORT 8080
EXPOSE 8080
CMD ["/usr/local/bin/entrypoint.sh"]
