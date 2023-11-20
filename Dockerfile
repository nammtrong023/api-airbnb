FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start:migrate:prod" ]
