FROM node:lts-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM builder
ENV NODE_ENV=production
CMD ["node", "build/index.js"]