FROM node:latest AS builder
WORKDIR /app
RUN npm cache clean --force
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

FROM node:latest AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]