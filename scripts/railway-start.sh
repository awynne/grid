#!/bin/bash
# Railway-optimized startup script
# Fast startup with minimal blocking operations

set -e

echo "🚀 Railway-optimized GridPulse startup..."

# Environment detection
ENVIRONMENT=${RAILWAY_ENVIRONMENT_NAME:-${RAILWAY_ENVIRONMENT:-"unknown"}}
echo "📍 Environment: $ENVIRONMENT"

# Quick environment validation
if [[ -z "$DATABASE_URL" ]]; then
    echo "❌ DATABASE_URL missing - check Railway service connections"
    echo "Available environment variables:"
    env | grep -E "(RAILWAY|DATABASE|POSTGRES)" | sort
    exit 1
fi

echo "🔍 Database URL configured"

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    echo "   Attempt $i/30: Database not ready, waiting 2 seconds..."
    sleep 2
done

# Essential operations only (fast)
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "💾 Applying database migrations..."
# Try migrations with timeout and fallback
if timeout 60 npx prisma migrate deploy; then
    echo "✅ Database migrations applied successfully"
else
    echo "⚠️ Database migrations failed or timed out - continuing startup"
    echo "   App will start but may have limited functionality until database is available"
fi

# Start application immediately
echo "✅ Starting GridPulse application..."

# Run optional setup in background after app starts
if [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "test" ]]; then
    echo "🔄 Background setup will run after app starts..."
    {
        sleep 10  # Let app start first
        echo "⚡ Running TimescaleDB setup..."
        timeout 30 node database/setup.js || echo "⚠️ TimescaleDB setup failed"
        echo "🌱 Running database seed..."
        timeout 60 npx prisma db seed || echo "⚠️ Database seeding failed"
        echo "✅ Background setup completed"
    } &
fi

# Start the application
exec npm start
