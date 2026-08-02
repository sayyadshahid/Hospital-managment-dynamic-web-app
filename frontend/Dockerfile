FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_FILE_BASE_URL

ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
    REACT_APP_FILE_BASE_URL=$REACT_APP_FILE_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
