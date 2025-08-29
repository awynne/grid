#!/bin/bash
# GRID-012A: Enhanced database migration script for CI/CD
# Complete database setup script with enhanced error handling

set -e

echo "🚀 Starting GridPulse database setup (GRID-012A)..."

# Function to check database connectivity
check_database_connection() {
    echo "🔍 Verifying database connectivity..."
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL environment variable is required"
        return 1
    fi
    
    # Simple connection test using node
    node -e "
        const { Client } = require('pg');
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        client.connect()
            .then(() => {
                console.log('✅ Database connection verified');
                return client.end();
            })
            .catch(err => {
                console.error('❌ Database connection failed:', err.message);
                process.exit(1);
            });
    "
}

# Function to verify migration success
verify_migration_success() {
    echo "🔍 Verifying migration success..."
    node -e "
        const { Client } = require('pg');
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        
        async function verify() {
            try {
                await client.connect();
                
                // Check if core tables exist
                const tables = await client.query(\`
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                \`);
                
                const tableNames = tables.rows.map(r => r.table_name);
                console.log('📋 Found tables:', tableNames.join(', '));
                
                // Check if observations table exists (core requirement)
                if (!tableNames.includes('observations')) {
                    throw new Error('Critical table \"observations\" not found');
                }
                
                console.log('✅ Core database schema verified');
            } catch (error) {
                console.error('❌ Migration verification failed:', error.message);
                process.exit(1);
            } finally {
                await client.end();
            }
        }
        
        verify();
    "
}

# Main migration process with error handling
main() {
    local step_count=0
    local total_steps=5
    
    # Step 1: Check connectivity
    step_count=$((step_count + 1))
    echo "📍 Step $step_count/$total_steps: Database connectivity check"
    if ! check_database_connection; then
        echo "❌ Migration failed at connectivity check"
        exit 1
    fi
    
    # Step 2: Generate Prisma client
    step_count=$((step_count + 1))
    echo "📍 Step $step_count/$total_steps: Generating Prisma client..."
    if ! npx prisma generate; then
        echo "❌ Migration failed during Prisma client generation"
        exit 1
    fi
    
    # Step 3: Run Prisma migrations
    step_count=$((step_count + 1))
    echo "📍 Step $step_count/$total_steps: Running Prisma migrations..."
    if ! npx prisma migrate deploy; then
        echo "❌ Migration failed during Prisma migrate deploy"
        echo "🔄 This may indicate a schema conflict or database lock"
        exit 1
    fi
    
    # Step 4: Setup TimescaleDB features
    step_count=$((step_count + 1))
    echo "📍 Step $step_count/$total_steps: Setting up TimescaleDB features..."
    if ! node database/setup.js; then
        echo "❌ Migration failed during TimescaleDB setup"
        echo "🔄 This may indicate missing TimescaleDB extension or permission issues"
        exit 1
    fi
    
    # Step 5: Verify migration success
    step_count=$((step_count + 1))
    echo "📍 Step $step_count/$total_steps: Verifying migration success..."
    if ! verify_migration_success; then
        echo "❌ Migration verification failed"
        exit 1
    fi
    
    echo "✅ Database migration completed successfully!"
    echo "📊 Migration summary:"
    echo "  - Prisma client: ✅ Generated"
    echo "  - Database schema: ✅ Updated" 
    echo "  - TimescaleDB features: ✅ Configured"
    echo "  - Schema verification: ✅ Passed"
    
    # Note: Skipping seeding in production CI environment
    # Seeding should be done separately for production data
}

# Handle script termination gracefully
trap 'echo "❌ Migration interrupted or failed"; exit 1' ERR

# Execute main function
main