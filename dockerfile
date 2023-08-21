FROM node:18-bookworm AS build

RUN apt update -y
RUN apt install glibc-source -y

RUN wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.19_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2.19_amd64.deb

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run test
RUN npm run test:e2e
RUN npm run build

FROM node:18-bookworm AS production
WORKDIR /app
COPY package.json package-lock.json .env ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
CMD ["npm", "run", "start:prod"]
