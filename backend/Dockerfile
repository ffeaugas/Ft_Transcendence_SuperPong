FROM node:20.4-buster

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm i prisma && npm install

COPY . .

RUN npm ci
