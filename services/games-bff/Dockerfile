FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
COPY . .
RUN npm run build

FROM builder
ENV NODE_ENV=production
CMD ["node", "build/index.js"]