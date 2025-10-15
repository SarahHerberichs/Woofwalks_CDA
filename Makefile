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
	docker compose --env-file .env.docker restart front-end
reload-nginx:
	docker compose --env-file .env.docker exec nginx nginx -s reload

build-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker up -d --build frontend nginx

stop-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker stop frontend nginx

restart-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker restart frontend nginx

down-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker rm -f frontend nginx

up-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker up -d frontend nginx
