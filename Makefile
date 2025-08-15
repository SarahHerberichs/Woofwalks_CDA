up:
	docker compose --env-file .env.docker up -d

up-build:
	docker compose --env-file .env.docker up -d --build

down:
	docker compose --env-file .env.docker down

restart:
	docker compose --env-file .env.docker restart