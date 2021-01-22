FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]