# Multi-stage build for Node.js backend

# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json ./
RUN npm install --production=false

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
