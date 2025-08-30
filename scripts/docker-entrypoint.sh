#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Running database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "⚡ Applying TimescaleDB setup (idempotent)..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped or already applied"

echo "🚀 Starting application..."
exec npm start

