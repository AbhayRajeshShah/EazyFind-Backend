FROM node:22-alpine

WORKDIR /src

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3003

CMD ["node","src/server.js"]

