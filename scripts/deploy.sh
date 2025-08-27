#!/bin/bash
# GridPulse Universal Deployment Script
# Handles application build, database migrations, and startup

set -e

echo "🚀 Starting GridPulse deployment..."

# Environment detection
ENVIRONMENT=${RAILWAY_ENVIRONMENT:-"unknown"}
echo "📍 Deploying to environment: $ENVIRONMENT"

# Build application
echo "🏗️  Building application..."
npm run build

# Database migrations
echo "💾 Applying database migrations..."
npx prisma migrate deploy

# TimescaleDB features (if not already applied)
echo "⚡ Setting up TimescaleDB features..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped (may already be configured)"

# Conditional seeding (dev/test only)
if [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "test" ]]; then
    echo "🌱 Seeding database with sample data..."
    npx prisma db seed
else
    echo "📦 Production environment - skipping data seeding"
fi

# Health check preparation
echo "🏥 Preparing health checks..."
npx prisma generate

# Start application
echo "✅ Starting GridPulse application..."
exec npm start