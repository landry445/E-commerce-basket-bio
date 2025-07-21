FROM node:20.12.2-alpine3.19

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
# Pour la prod : tu peux remplacer par npm run build && npm run start