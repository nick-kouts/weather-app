# Stage 1: Build the Angular app
FROM node:18 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/term-project-koutsoulidakis/browser /usr/share/nginx/html

# Optional: Add healthcheck for production
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
