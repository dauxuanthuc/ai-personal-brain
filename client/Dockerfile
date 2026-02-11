# Multi-stage build for optimized production image
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build args for Vite env vars
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build for production with env vars
RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID} npm run build

# ================================
# Production stage with Nginx
# ================================
FROM nginx:alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
