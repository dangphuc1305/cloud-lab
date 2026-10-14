FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY mern-demo/server/ ./

EXPOSE 5000

CMD ["node", "server.js"]