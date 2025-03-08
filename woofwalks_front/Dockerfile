# # Étape 1 : Construire l'image de l'application React
# FROM node:18 AS build

# WORKDIR /app

# # Copier les fichiers de l'application React
# COPY package.json package-lock.json ./

# RUN npm install

# COPY . ./
# # Construire l'application
# RUN npm run build

# # Étape 2 : Servir l'application avec Nginx
# FROM nginx:alpine

# # Copier les fichiers build du frontend dans le dossier public de Nginx
# COPY --from=build /app/build /usr/share/nginx/html

# # Exposer le port 80 (par défaut pour Nginx)
# EXPOSE 80

# # Lancer Nginx
# CMD ["nginx", "-g", "daemon off;"]



# Utiliser Node.js comme base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

ENV CHOKIDAR_USEPOLLING=true

# Copier les fichiers de package.json et installer les dépendances
COPY package*.json package-lock.json ./

RUN npm install --loglevel verbose

# Copier le code source
COPY . ./

# Exposer le port 3000
EXPOSE 3000

# Lancer React en mode développement
CMD ["npm", "start"]
