FROM node:14-alpine AS production-stage

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

