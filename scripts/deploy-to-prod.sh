#!/bin/bash
# Deploy to production environment (only after test validation)

set -e

echo "🚨 Deploying to PRODUCTION environment..."

# Confirmation required for production
read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
if [[ $confirm != "yes" ]]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

# Ensure we're on main branch with latest changes
echo "📂 Checking git status..."
git status --porcelain | grep -q . && {
    echo "❌ Working directory not clean. Please commit or stash changes first."
    exit 1
}

git checkout main
git pull origin main

# Ensure test environment passed
echo "🧪 Validating test environment first..."
npm run test:remote:test || {
    echo "❌ Test environment validation failed - cannot deploy to production"
    exit 1
}

# Deploy database changes (NO SEEDING in production)
echo "💾 Applying database schema to PRODUCTION..."
export RAILWAY_ENVIRONMENT=prod
npx prisma migrate deploy

# Apply TimescaleDB features
echo "⚡ Setting up TimescaleDB in PRODUCTION..."
npm run db:timescale

# Validate production deployment
echo "✅ Validating PRODUCTION deployment..."
npm run test:remote:prod

echo "🎉 PRODUCTION deployment completed successfully!"
echo ""
echo "🔍 Next steps:"
echo "  • Monitor application logs and metrics"
echo "  • Verify user-facing functionality"
echo "  • Update team on deployment completion"