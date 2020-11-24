FROM node
WORKDIR /cache
COPY .npmrc .
COPY package.json .
RUN npm install

FROM node
WORKDIR /build
COPY . .
RUN true
COPY --from=0 /cache/node_modules ./node_modules
RUN npm run reply:build

FROM nginx
WORKDIR /app
COPY --from=1 /build/dist /var/www/html

# Fix get query parameters on VueJs
COPY --from=1 /build/dist/socialreply/index.html /var/www/html
