

FROM php:8.1-fpm AS php-fpm

EXPOSE 9000

FROM nginx:stable-alpine

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=php-fpm /var/www/html /var/www/html

COPY start.sh /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

ENTRYPOINT ["/usr/local/bin/start.sh"]

EXPOSE 80
