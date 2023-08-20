FROM node:18-bullseye AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-bullseye AS production
WORKDIR /app
COPY package.json package-lock.json .env ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
CMD ["npm", "run", "start:prod"]
