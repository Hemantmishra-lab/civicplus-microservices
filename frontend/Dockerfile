# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Optimize layer caching by copying package manifests first
COPY frontend/package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY frontend/ .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default nginx config to handle SPA routing and caching
RUN rm /etc/nginx/conf.d/default.conf && \
    echo 'server { \
      listen 80; \
      location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
      } \
      location ~ \.html$ { \
        root /usr/share/nginx/html; \
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"; \
      } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
