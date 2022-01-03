FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs:16
COPY --from=build /app /app
WORKDIR /app
CMD ["build/index.js"]