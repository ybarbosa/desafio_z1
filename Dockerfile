FROM node:22.11.0-alpine

WORKDIR /app

COPY ./prisma ./prisma
COPY . .

RUN yarn install
RUN npx prisma generate

RUN yarn build