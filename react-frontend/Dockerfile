# Build React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx will serve these static files
FROM nginx:alpine AS static
COPY --from=build /app/build /usr/share/nginx/html
