# -------- Build Stage --------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -------- Production Stage --------
FROM node:18-alpine

WORKDIR /app

# Install static server
RUN npm install -g serve

# Copy build output
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Run app
CMD ["serve", "-s", "dist", "-l", "3000"]
