FROM node:12-alpine3.12

WORKDIR /app

COPY package*.json ./
RUN npm install

CMD npm run dev
