FROM node:20-alpine

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++
RUN ln -sf python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD npm run dev