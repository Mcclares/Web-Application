FROM node:21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
RUN mkdir -p /etc/letsencrypt/live/obd2.ee

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"] 
