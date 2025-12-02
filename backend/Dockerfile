# Utilise l'image officielle Node LTS
FROM node:20.12.2-alpine3.19

WORKDIR /app

# Installe les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# Copie tout le code
COPY . .

# Build le projet
RUN npm run build

EXPOSE 3001

# Par défaut, démarre en prod
CMD ["npm", "run", "start:prod"]
#Pour la prod : tu peux remplacer par npm run build && npm run start