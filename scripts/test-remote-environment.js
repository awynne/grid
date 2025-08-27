#!/usr/bin/env node
// Test remote environment deployment validation

import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';

const environment = process.argv[2] || 'test';
const prisma = new PrismaClient();

async function validateDeployment() {
  console.log(`🧪 Validating ${environment.toUpperCase()} environment deployment...`);

  try {
    // Test 1: Database connectivity
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected');

    // Test 2: Schema validation
    console.log('📋 Validating schema...');
    const [baCount, seriesCount, obsCount] = await Promise.all([
      prisma.balancingAuthority.count(),
      prisma.series.count(),
      prisma.observation.count()
    ]);

    console.log(`📊 Data counts: ${baCount} BAs, ${seriesCount} series, ${obsCount} observations`);

    // Validate expected data structure
    if (baCount < 1) {
      throw new Error('No balancing authorities found - deployment may have failed');
    }

    // Test 3: TimescaleDB features (if available)
    try {
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();

      const hypertables = await client.query(`
        SELECT hypertable_name, chunk_time_interval 
        FROM timescaledb_information.dimensions 
        WHERE hypertable_name = 'observations'
      `);

      if (hypertables.rows.length > 0) {
        console.log('✅ TimescaleDB hypertables configured');
        console.log(`   Chunk interval: ${hypertables.rows[0].chunk_time_interval}`);
      } else {
        console.log('⚠️  TimescaleDB features not detected');
      }

      // Check continuous aggregates
      const aggregates = await client.query(`
        SELECT view_name 
        FROM timescaledb_information.continuous_aggregates
      `);

      if (aggregates.rows.length > 0) {
        console.log(`✅ Found ${aggregates.rows.length} continuous aggregates`);
        aggregates.rows.forEach(row => {
          console.log(`   - ${row.view_name}`);
        });
      }

      await client.end();
    } catch (error) {
      console.log('⚠️  TimescaleDB validation skipped (extension may not be available)');
      console.log(`   Error: ${error.message}`);
    }

    // Test 4: Performance test
    console.log('⚡ Testing query performance...');
    const start = Date.now();
    const sample = await prisma.observation.findFirst({
      where: { series: { type: 'demand' } },
      include: { series: { include: { balancingAuthority: true } } },
      orderBy: { ts: 'desc' }
    });
    const queryTime = Date.now() - start;
    console.log(`⚡ Query performance: ${queryTime}ms`);

    if (queryTime > 5000) {
      console.log('⚠️  Query performance slower than expected (>5s)');
    } else if (queryTime > 1000) {
      console.log('⚠️  Query performance acceptable but slow (>1s)');
    }

    // Test 5: Data quality (if data exists)
    if (obsCount > 0) {
      if (sample) {
        console.log(`📈 Sample data: ${sample.series.balancingAuthority.code} ${sample.series.type} = ${sample.value} ${sample.series.units}`);
        console.log(`📅 Latest data timestamp: ${sample.ts.toISOString()}`);
      }

      // Check data diversity
      const uniqueBAs = await prisma.observation.findMany({
        select: {
          series: {
            select: {
              balancingAuthority: {
                select: { code: true }
              }
            }
          }
        },
        distinct: ['seriesId'],
        take: 10
      });

      const baCodes = [...new Set(uniqueBAs.map(obs => obs.series.balancingAuthority.code))];
      console.log(`📊 Data available for BAs: ${baCodes.join(', ')}`);
      
      if (environment !== 'prod' && baCodes.length < 3) {
        console.log('⚠️  Limited test data - may need re-seeding');
      }
    } else {
      if (environment !== 'prod') {
        console.log('⚠️  No observation data found - seeding may have failed');
      } else {
        console.log('📦 Production environment - no seed data expected');
      }
    }

    // Test 6: Health check simulation
    console.log('🏥 Testing application health patterns...');
    const healthData = {
      database: {
        connected: true,
        responseTime: queryTime,
        recordCount: { baCount, seriesCount, obsCount }
      },
      environment,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Health check data:', JSON.stringify(healthData, null, 2));

    console.log(`\n🎉 ${environment.toUpperCase()} environment validation PASSED!`);
    
    // Summary
    console.log('\n📋 Validation Summary:');
    console.log(`   • Database: ✅ Connected (${queryTime}ms)`);
    console.log(`   • Schema: ✅ ${baCount} BAs, ${seriesCount} series, ${obsCount} observations`);
    console.log(`   • Performance: ${queryTime < 1000 ? '✅' : '⚠️'} Query response time`);
    console.log(`   • Data Quality: ${obsCount > 0 || environment === 'prod' ? '✅' : '⚠️'} Expected data present`);

    process.exit(0);

  } catch (error) {
    console.error(`\n❌ ${environment.toUpperCase()} environment validation FAILED:`);
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'P1001') {
      console.error('   • Database connection failed - check DATABASE_URL');
    } else if (error.code === 'P2021') {
      console.error('   • Database schema issue - may need migration');
    } else {
      console.error('   • Unexpected error - check logs for details');
    }

    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Verify DATABASE_URL is correct for this environment');
    console.error('   2. Ensure database migrations have been applied');
    console.error('   3. Check TimescaleDB extension is installed');
    console.error('   4. Validate environment has proper access permissions');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateDeployment();