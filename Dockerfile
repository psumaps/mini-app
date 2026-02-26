FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY web/package*.json ./web/

# Install dependencies
RUN npm ci && \
    npm ci --prefix shared && \
    npm ci --prefix web

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_URL_IJO42_TILES
ARG VITE_URL_MAP_ASSETS
ARG VITE_URL_IJO42_MAPI
ARG VITE_URL_PSU_TOOLS_API
ARG VITE_URL_ICAL_ENDPOINT
ARG VITE_URL_BIND_ETIS
ARG VITE_URL_TG_GROUP
ARG VITE_URL_SUPPORT
ARG VITE_URL_VK_APP

# Set environment variables for build
ENV VITE_URL_IJO42_TILES=${VITE_URL_IJO42_TILES}
ENV VITE_URL_MAP_ASSETS=${VITE_URL_MAP_ASSETS}
ENV VITE_URL_IJO42_MAPI=${VITE_URL_IJO42_MAPI}
ENV VITE_URL_PSU_TOOLS_API=${VITE_URL_PSU_TOOLS_API}
ENV VITE_URL_ICAL_ENDPOINT=${VITE_URL_ICAL_ENDPOINT}
ENV VITE_URL_BIND_ETIS=${VITE_URL_BIND_ETIS}
ENV VITE_URL_TG_GROUP=${VITE_URL_TG_GROUP}
ENV VITE_URL_SUPPORT=${VITE_URL_SUPPORT}
ENV VITE_URL_VK_APP=${VITE_URL_VK_APP}

# Build the web application
RUN npm run build --prefix web

FROM nginxinc/nginx-unprivileged:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/web/dist /usr/share/nginx/html

# nginx-unprivileged runs on port 8080 by default
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
