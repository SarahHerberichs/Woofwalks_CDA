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

# Lancer en prod avec rebuild complet frontend + nginx
build-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker up -d --build frontend nginx

# Stopper seulement frontend et nginx
stop-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker stop frontend nginx

# Redémarrer frontend et nginx
restart-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker restart frontend nginx

# Supprimer les conteneurs frontend et nginx (clean)
down-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker rm -f frontend nginx

# Up frontend et nginx sans rebuild (déjà buildés)
up-prod-env:
	docker compose -f docker-compose.prod.yml --env-file .env.docker up -d frontend nginx
