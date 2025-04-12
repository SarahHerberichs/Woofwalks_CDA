FROM node:18

WORKDIR /app

ENV CHOKIDAR_USEPOLLING=true

COPY package*.json ./

RUN rm -rf node_modules package-lock.json && npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]