up:
	docker compose --env-file .env.docker up -d

up-build:
	docker compose --env-file .env.docker up -d --build

down:
	docker compose --env-file .env.docker down

restart:
	docker compose --env-file .env.docker restart

restart-php:
	docker compose --env-file .env.docker restart php-fpm

restart-front:
	docker compose --env-file .env.docker restart front-end
restart-nginx:
	docker compose --env-file .env.docker restart nginx
reload-nginx:
	docker compose --env-file .env.docker exec nginx nginx -s reload