#!/bin/bash
# GridPulse Runtime Startup Script
# Handles database migrations and application startup

set -e

echo "🚀 Starting GridPulse runtime..."

# Environment detection
ENVIRONMENT=${RAILWAY_ENVIRONMENT:-"unknown"}
echo "📍 Starting in environment: $ENVIRONMENT"

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