# -----------------------
# Production
# -----------------------
FROM php:8.2-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

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