# # Étape 1 : Utiliser une image de base Symfony avec PHP et Composer
# FROM php:8.1-fpm

# # Étape 2 : Installer les dépendances système nécessaires (comme les extensions PHP)
# RUN apt-get update && apt-get install -y \
#     libzip-dev \
#     unzip \
#     git \
#     && docker-php-ext-install zip pdo pdo_mysql
# # Installer Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# # # Étape 3 : Installer Composer globalement
# # RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Installer Symfony CLI
# RUN curl -sS https://get.symfony.com/cli/installer | bash
# RUN mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# # Étape 4 : Créer un utilisateur et un groupe non-root
# RUN groupadd -g 1000 symfony && \
#     useradd -m -u 1000 -g symfony symfony
# RUN apt update && apt install -y default-mysql-client

# # Étape 5 : Définir le répertoire de travail et copier les fichiers du projet
# WORKDIR /var/www/html
# COPY --chown=symfony:symfony . .

# # Étape 6 : Passer à l'utilisateur non-root
# USER symfony

# # Étape 7 : Exécuter Composer pour installer les dépendances PHP
# RUN composer install --no-dev --optimize-autoloader --no-scripts


# # Étape 8 : Exposer le port 8000 pour l'application Symfony
# EXPOSE 8000

# # Étape 9 : Définir la commande pour démarrer le serveur Symfony
# CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]

# Utiliser une image PHP avec les extensions nécessaires
FROM php:8.1-cli

# Installer les dépendances système et extensions PHP
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl default-mysql-client \
    && docker-php-ext-install zip pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers de dépendances Composer
COPY composer.json composer.lock ./

# Installer les dépendances Composer
RUN composer install --no-scripts --no-autoloader

# Copier le code source de l'application
COPY . .

# Générer l'autoloader Composer
RUN composer dump-autoload --optimize

# Exposer le port 8000
EXPOSE 8000

# Lancer le serveur Symfony
CMD ["symfony", "server:start", "--no-tls", "--allow-http", "--port=8000", "--allow-all-ip"]

