#!/usr/bin/env sh
# POSIX shell; production entrypoint
set -eu

echo "🚀 BYPASS MODE: Skipping all database operations for debugging..."

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

# SKIP ALL DATABASE OPERATIONS FOR DEBUGGING
echo "⏭️  SKIPPING database connectivity check (bypass mode)..."
echo "⏭️  SKIPPING migration state check (bypass mode)..."
echo "⏭️  SKIPPING prisma migrate deploy (bypass mode)..."

export PRISMA_CLIENT_ENGINE_TYPE=library

echo "🚀 Starting application..."
if [ -n "${DEPLOYED_IMAGE:-}" ]; then
  echo "ℹ️  Deployed image: ${DEPLOYED_IMAGE}"
fi
if [ -n "${PRISMA_SCHEMA_ENGINE_BINARY:-}" ]; then
  echo "ℹ️  Prisma schema engine: ${PRISMA_SCHEMA_ENGINE_BINARY}"
fi
echo "🔄 About to execute npm start..."
echo "📍 Current directory: $(pwd)"
echo "📋 Node.js version: $(node --version)"
echo "📋 NPM version: $(npm --version)"
echo "🗂️  Files in /app:"
ls -la /app/
echo "🗂️  Files in /app/build:"
ls -la /app/build/ || echo "No build directory found"
echo "🗂️  server.js exists: $(test -f server.js && echo 'YES' || echo 'NO')"
echo "🔥 Executing npm start now..."
exec npm start