#!/bin/bash
# GridPulse Runtime Startup Script
# Handles database migrations and application startup

set -e

echo "🚀 Starting GridPulse runtime..."

# Environment detection
ENVIRONMENT=${RAILWAY_ENVIRONMENT:-"unknown"}
echo "📍 Starting in environment: $ENVIRONMENT"

# Environment validation
if [[ -z "$DATABASE_URL" ]]; then
    echo "❌ DATABASE_URL environment variable not found"
    echo "Available environment variables:"
    env | grep -E "(RAILWAY|DATABASE|NODE)" | sort
    exit 1
fi

echo "🔍 Database URL found: ${DATABASE_URL:0:20}... (truncated for security)"

# Generate Prisma client first
echo "🔧 Generating Prisma client..."
npx prisma generate

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

# Start application
echo "✅ Starting GridPulse application..."
exec npm start