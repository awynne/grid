# Multi-stage Dockerfile optimized for Railway deployment
# React Router 7 + Node.js application with build optimization

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install production dependencies and security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S reactrouter -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=reactrouter:nodejs /app/build ./build

# Copy necessary runtime files
COPY --chown=reactrouter:nodejs prisma ./prisma
COPY --chown=reactrouter:nodejs database ./database

# Set permissions
RUN chown -R reactrouter:nodejs /app
USER reactrouter

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Expose port (Railway will set PORT environment variable)
EXPOSE ${PORT:-3000}

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Default command - Railway can override this
CMD ["npm", "start"]

# Metadata
LABEL org.opencontainers.image.title="GridPulse"
LABEL org.opencontainers.image.description="Electric grid data visualization platform"
LABEL org.opencontainers.image.source="https://github.com/awynne/grid"
LABEL org.opencontainers.image.vendor="GridPulse"
