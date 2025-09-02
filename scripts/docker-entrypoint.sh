#!/usr/bin/env sh
# POSIX shell; keep compatible across distros
set -eu

if [ "${DEBUG_STARTUP:-}" = "1" ]; then
  echo "🔎 Debug: OpenSSL version:" && (openssl version -v || true)
  echo "🔎 Debug: Node versions:" && node -e 'console.log(process.versions)'
  echo "🔎 Debug: Prisma engines present:" && ls -la node_modules/.prisma/client || true
fi

export PRISMA_CLIENT_ENGINE_TYPE=library
echo "🔧 Running database migrations (prisma migrate deploy)..."
./node_modules/.bin/prisma migrate deploy || true

echo "⚡ Applying TimescaleDB setup (idempotent)..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped or already applied"

echo "🚀 Starting application..."
exec npm start
