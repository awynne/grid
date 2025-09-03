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

# Wait for Postgres to accept connections (up to 90s)
echo "⏳ Waiting for database to be reachable..."
ATTEMPTS=30
SLEEP=3
for i in $(seq 1 $ATTEMPTS); do
  if node -e '
    const { Client } = require("pg");
    const c = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 2000 });
    c.connect().then(()=>c.end()).then(()=>process.exit(0)).catch(()=>process.exit(1));
  '; then
    echo "✅ Database is reachable"
    break
  fi
  echo "   attempt $i/$ATTEMPTS: DB not ready yet, retrying in ${SLEEP}s..."
  sleep $SLEEP
  if [ "$i" = "$ATTEMPTS" ]; then
    echo "❌ Database is not reachable after $((ATTEMPTS*SLEEP))s; exiting"
    exit 1
  fi
done

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
