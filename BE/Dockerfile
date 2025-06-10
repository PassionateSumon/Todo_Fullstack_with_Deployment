# stage 1
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# Verify dist directory
RUN ls -l /app/dist || { echo "Error: /app/dist not found"; exit 1; }

# stage 2
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.sequelizerc ./
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/src/models ./src/models
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "./docker-entrypoint.sh"]