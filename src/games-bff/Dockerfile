FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
COPY . .
RUN npm run build

FROM builder
CMD ["node", "build/index.js"]