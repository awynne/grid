#!/usr/bin/env sh
# POSIX shell; production entrypoint
set -eu

# Decide Prisma engine variants based on available OpenSSL
if [ -z "${PRISMA_SCHEMA_ENGINE_BINARY:-}" ]; then
  if [ -e /usr/lib/x86_64-linux-gnu/libssl.so.1.1 ]; then
    export PRISMA_SCHEMA_ENGINE_BINARY="/app/node_modules/@prisma/engines/schema-engine-debian-openssl-1.1.x"
    export PRISMA_QUERY_ENGINE_LIBRARY="/app/node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node"
  else
    export PRISMA_SCHEMA_ENGINE_BINARY="/app/node_modules/@prisma/engines/schema-engine-debian-openssl-3.0.x"
    export PRISMA_QUERY_ENGINE_LIBRARY="/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node"
  fi
fi

echo "ℹ️  Prisma schema engine: ${PRISMA_SCHEMA_ENGINE_BINARY}"

export PRISMA_CLIENT_ENGINE_TYPE=library
echo "🔧 Running database migrations (prisma migrate deploy)..."
./node_modules/.bin/prisma migrate deploy

echo "⚡ Applying TimescaleDB setup (idempotent)..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped or already applied"

echo "🚀 Starting application..."
if [ -n "${DEPLOYED_IMAGE:-}" ]; then
  echo "ℹ️  Deployed image: ${DEPLOYED_IMAGE}"
fi
if [ -n "${PRISMA_SCHEMA_ENGINE_BINARY:-}" ]; then
  echo "ℹ️  Prisma schema engine: ${PRISMA_SCHEMA_ENGINE_BINARY}"
fi
exec npm start
