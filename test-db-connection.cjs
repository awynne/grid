#!/usr/bin/env node
// Quick database connection test
const { Client } = require("pg");

async function testConnection() {
  console.log("🔍 Testing database connection...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");
  
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log("✅ Database connection successful");
    
    const result = await client.query("SELECT version();");
    console.log("📊 Database version:", result.rows[0].version);
    
    // Test TimescaleDB extension
    try {
      const tsResult = await client.query("SELECT extname FROM pg_extension WHERE extname = 'timescaledb';");
      if (tsResult.rows.length > 0) {
        console.log("✅ TimescaleDB extension is available");
      } else {
        console.log("⚠️ TimescaleDB extension not found");
      }
    } catch (err) {
      console.log("⚠️ Could not check TimescaleDB extension:", err.message);
    }
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();