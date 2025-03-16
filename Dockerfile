# Etapa 1: Construir la aplicación Angular
FROM node:20 as build
WORKDIR /app

COPY package*.json /app/
RUN npm ci
COPY . /app
RUN npm run build -- --configuration=production

# Etapa 2: Servir la aplicación construida con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/todo-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
