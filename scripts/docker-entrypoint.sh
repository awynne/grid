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
    
    // Handle error events IMMEDIATELY after client creation
    c.on("error", (err) => {
      try { c.end(); } catch (e) {}
      process.exit(1);
    });
    
    // Also handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      try { c.end(); } catch (e) {}
      process.exit(1);
    });
    
    c.connect()
      .then(() => {
        c.end();
        process.exit(0);
      })
      .catch((err) => {
        try { c.end(); } catch (e) {}
        process.exit(1);
      });
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

# Check if migration state is out of sync (migrations table exists but schema tables don't)
echo "🔍 Checking migration state vs actual schema..."
MIGRATION_CHECK=$(node -e '
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });

// Handle error events IMMEDIATELY after client creation
client.on("error", (err) => {
  try { client.end(); } catch (e) {}
  process.exit(1);
});

// Also handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  try { client.end(); } catch (e) {}
  process.exit(1);
});

async function checkMigrationState() {
  try {
    await client.connect();
    
    // Check if _prisma_migrations table exists
    const migrationTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '\''public'\'' 
        AND table_name = '\''_prisma_migrations'\''
      );
    `);
    
    // Check if main schema tables exist (balancing_authorities is the first table)
    const schemaTablesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '\''public'\'' 
        AND table_name = '\''balancing_authorities'\''
      );
    `);
    
    await client.end();
    
    const hasMigrationTable = migrationTableExists.rows[0].exists;
    const hasSchemaTable = schemaTablesExist.rows[0].exists;
    
    if (hasMigrationTable && !hasSchemaTable) {
      console.log("RESET_NEEDED");
    } else {
      console.log("OK");
    }
  } catch (error) {
    client.end().catch(() => {});
    console.log("OK"); // If we can'\''t check, proceed normally
  }
}

checkMigrationState();
' 2>/dev/null || echo "OK")

if [ "$MIGRATION_CHECK" = "RESET_NEEDED" ]; then
  echo "⚠️  Migration state mismatch detected: migration table exists but schema tables missing"
  echo "🔄 Resetting migration state to force re-run..."
  
  # Drop the _prisma_migrations table to reset Prisma state
  node -e '
    const { Client } = require("pg");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    // Handle error events to prevent unhandled error crashes
    client.on("error", (err) => {
      console.error("❌ Failed to reset migration state:", err.message);
      client.end().catch(() => {});
      process.exit(1);
    });
    
    client.connect()
      .then(() => client.query("DROP TABLE IF EXISTS _prisma_migrations CASCADE;"))
      .then(() => client.end())
      .then(() => console.log("✅ Migration state reset"))
      .catch(err => {
        console.error("❌ Failed to reset migration state:", err.message);
        client.end().catch(() => {});
        process.exit(1);
      });
  '
  
  echo "🔧 Running database migrations (prisma migrate deploy with reset state)..."
else
  echo "🔧 Running database migrations (prisma migrate deploy)..."
fi

echo "🔧 About to run prisma migrate deploy..."
if ./node_modules/.bin/prisma migrate deploy; then
  echo "✅ Database migrations completed successfully"
else
  echo "⚠️  Database migrations failed, but continuing with application startup"
  echo "❓ This might be due to database connectivity issues or schema conflicts"
fi

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
