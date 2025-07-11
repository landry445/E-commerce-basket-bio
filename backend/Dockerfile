# Utilise Node.js 20 comme base
FROM node:20

# Définit le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code du backend
COPY . .

# Expose le port 3000 (par défaut pour NestJS, adapte si besoin)
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start:dev"]
