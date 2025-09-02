#!/usr/bin/env sh
# POSIX shell; production entrypoint
set -eu

export PRISMA_CLIENT_ENGINE_TYPE=library
echo "🔧 Running database migrations (prisma migrate deploy)..."
./node_modules/.bin/prisma migrate deploy

echo "⚡ Applying TimescaleDB setup (idempotent)..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped or already applied"

echo "🚀 Starting application..."
if [ -n "${DEPLOYED_IMAGE:-}" ]; then
  echo "ℹ️  Deployed image: ${DEPLOYED_IMAGE}"
fi
exec npm start
