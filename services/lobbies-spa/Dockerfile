FROM node:lts-alpine AS install
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM install as builder
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
