# Multi-stage Dockerfile optimized for Railway deployment
# React Router 7 + Node.js application with build optimization

# Build stage (Debian-based to avoid Prisma/openssl issues on Alpine)
FROM node:20-bookworm-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
# Hint Prisma to fetch engines compatible with Debian OpenSSL 3
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage (Debian-based for stable OpenSSL/glibc)
FROM node:20-bookworm-slim AS production

# Install production dependencies and security updates
RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends dumb-init bash openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user for security (Debian syntax)
RUN groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid 1001 --create-home --shell /bin/bash reactrouter

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Ensure Prisma downloads Debian OpenSSL 3 engines
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=reactrouter:nodejs /app/build ./build

# Copy necessary runtime files
COPY --chown=reactrouter:nodejs prisma ./prisma
COPY --chown=reactrouter:nodejs database ./database
COPY --chown=reactrouter:nodejs scripts/docker-entrypoint.sh ./scripts/docker-entrypoint.sh

# Set permissions
RUN chown -R reactrouter:nodejs /app
USER reactrouter

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Expose port (Railway will set PORT environment variable)
EXPOSE ${PORT:-3000}

# Use dumb-init for proper signal handling
RUN chmod +x ./scripts/docker-entrypoint.sh

ENTRYPOINT ["dumb-init", "--", "/app/scripts/docker-entrypoint.sh"]

# Metadata
LABEL org.opencontainers.image.title="GridPulse"
LABEL org.opencontainers.image.description="Electric grid data visualization platform"
LABEL org.opencontainers.image.source="https://github.com/awynne/grid"
LABEL org.opencontainers.image.vendor="GridPulse"
