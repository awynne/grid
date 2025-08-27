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

# Database migrations (critical - must succeed)
echo "💾 Applying database migrations..."
npx prisma migrate deploy

# TimescaleDB features (non-blocking - allow failures)
echo "⚡ Setting up TimescaleDB features..."
timeout 30 node database/setup.js || echo "⚠️  TimescaleDB setup skipped (may already be configured or failed)"

# Conditional seeding (non-blocking for faster startup)
if [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "test" ]]; then
    echo "🌱 Seeding database with sample data (background)..."
    # Run seeding in background to avoid blocking app startup
    (timeout 60 npx prisma db seed || echo "⚠️  Database seeding failed or timed out") &
else
    echo "📦 Production environment - skipping data seeding"
fi

# Start application immediately (don't wait for background processes)
echo "✅ Starting GridPulse application..."
exec npm start