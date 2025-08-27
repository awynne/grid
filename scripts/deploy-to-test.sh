#!/bin/bash
# Deploy GRID-012 TimescaleDB schema to test environment

set -e

echo "🧪 Deploying to TEST environment..."

# Ensure we're on main branch with latest changes
echo "📂 Checking git status..."
git status --porcelain | grep -q . && {
    echo "❌ Working directory not clean. Please commit or stash changes first."
    exit 1
}

git checkout main
git pull origin main

# Deploy database changes
echo "💾 Applying database schema to TEST..."
export RAILWAY_ENVIRONMENT=test
npx prisma migrate deploy

# Apply TimescaleDB features
echo "⚡ Setting up TimescaleDB in TEST..."
npm run db:timescale

# Seed test data
echo "🌱 Seeding TEST database..."
npm run db:seed

# Validate deployment
echo "✅ Validating TEST deployment..."
npm run test:remote:test

echo "🎉 TEST deployment completed successfully!"