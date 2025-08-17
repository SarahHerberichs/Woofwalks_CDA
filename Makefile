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
	docker compose --env-file .env.docker restart front
restart-nginx:
	docker compose --env-file .env.docker restart nginx
