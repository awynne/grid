#!/bin/bash
# GRID-012: TimescaleDB Schema Implementation
# Complete database setup script

set -e

echo "🚀 Starting GridPulse database setup (GRID-012)..."

# Ensure we have a DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "⚙️  Setting up TimescaleDB features..."
node database/setup.js

echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo "✅ Database setup completed successfully!"
echo ""
echo "Next steps:"
echo "  - Test queries with: npx prisma studio"
echo "  - View TimescaleDB info in database console"
echo "  - Continue with GRID-013 for data ingestion"