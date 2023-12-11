FROM node:lts AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian11
COPY --from=build /app /app
WORKDIR /app
CMD ["build/index.js"]
