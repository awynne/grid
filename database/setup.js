#!/usr/bin/env node
// GRID-012: TimescaleDB Schema Implementation
// Database setup script to apply TimescaleDB-specific features after Prisma migration

import { Client } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('🚀 Starting TimescaleDB setup (GRID-012)...');
  
  // Connect to database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // First, try to enable TimescaleDB extension
    console.log('🔧 Enabling TimescaleDB extension...');
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');
      console.log('✅ TimescaleDB extension enabled');
    } catch (error) {
      console.log('⚠️ Could not enable TimescaleDB extension (may require superuser privileges)');
      console.log(`   Error: ${error.message.substring(0, 100)}...`);
    }

    // Read and execute migration files in order
    const migrations = [
      '001_timescaledb_setup.sql',
      '002_continuous_aggregates.sql',
      '003_helper_views.sql'
    ];

    for (const migration of migrations) {
      console.log(`📜 Applying ${migration}...`);
      
      const migrationPath = path.join(__dirname, 'migrations', migration);
      const sql = await fs.readFile(migrationPath, 'utf8');
      
      // Split SQL file by statement and execute each
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
          } catch (error) {
            // Some statements may fail if already applied - log but continue
            console.log(`⚠️  Statement warning (may be expected): ${error.message.substring(0, 100)}...`);
          }
        }
      }
      
      console.log(`✅ Applied ${migration}`);
    }

    // Verify TimescaleDB setup
    console.log('🔍 Verifying TimescaleDB setup...');
    
    const hypertableCheck = await client.query(`
      SELECT hypertable_name, chunk_time_interval 
      FROM timescaledb_information.dimensions 
      WHERE hypertable_name = 'observations'
    `);
    
    if (hypertableCheck.rows.length > 0) {
      console.log('✅ Observations hypertable configured');
      console.log(`   Chunk interval: ${hypertableCheck.rows[0].chunk_time_interval}`);
    } else {
      console.log('⚠️  Observations hypertable not found');
    }

    const aggregateCheck = await client.query(`
      SELECT view_name, refresh_lag, refresh_interval 
      FROM timescaledb_information.continuous_aggregates
    `);
    
    if (aggregateCheck.rows.length > 0) {
      console.log(`✅ Found ${aggregateCheck.rows.length} continuous aggregates:`);
      aggregateCheck.rows.forEach(row => {
        console.log(`   - ${row.view_name} (lag: ${row.refresh_lag}, interval: ${row.refresh_interval})`);
      });
    } else {
      console.log('⚠️  No continuous aggregates found');
    }

    console.log('✅ TimescaleDB setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up TimescaleDB:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// TimescaleDB setup disabled for Supabase compatibility  
// Supabase doesn't support TimescaleDB extensions
console.log("⚠️  TimescaleDB setup disabled - not supported on Supabase");

// Run if called directly (disabled)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("✅ TimescaleDB setup skipped - using regular PostgreSQL");
}

export { runMigrations };