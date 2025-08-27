#!/usr/bin/env node
// GRID-012: Local Development Environment Test
// Quick validation script for local development setup

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLocalSetup() {
  console.log('🧪 GridPulse Local Development Test\n');

  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check data
    const [baCount, seriesCount, obsCount] = await Promise.all([
      prisma.balancingAuthority.count(),
      prisma.series.count(),
      prisma.observation.count()
    ]);

    console.log(`📊 Data validation:`);
    console.log(`  • ${baCount} Balancing Authorities`);
    console.log(`  • ${seriesCount} Series definitions`);
    console.log(`  • ${obsCount} Sample observations`);

    if (baCount === 5 && seriesCount === 40 && obsCount === 120) {
      console.log('✅ Expected sample data found');
    } else {
      console.log('⚠️  Sample data differs from expected (5 BAs, 40 series, 120 obs)');
    }

    // Test query performance
    const start = Date.now();
    const latestDemand = await prisma.observation.findFirst({
      where: { series: { type: 'demand' } },
      include: {
        series: {
          include: { balancingAuthority: true }
        }
      },
      orderBy: { ts: 'desc' }
    });
    const queryTime = Date.now() - start;

    if (latestDemand) {
      console.log(`⚡ Query test: ${queryTime}ms`);
      console.log(`📈 Sample: ${latestDemand.series.balancingAuthority.code} demand = ${latestDemand.value} MW`);
    }

    console.log('\n🎉 Local development environment is ready!');
    console.log('\n📝 Next steps:');
    console.log('  • npm run dev (start development server)');
    console.log('  • npm run db:studio (open database browser)');

  } catch (error) {
    console.error('\n❌ Setup test failed:');
    console.error(error.message);
    
    console.log('\n💡 Common fixes:');
    console.log('  • Check .env file has correct DATABASE_URL');
    console.log('  • Run: npm run db:setup');
    console.log('  • Verify network access to Railway database');
  } finally {
    await prisma.$disconnect();
  }
}

testLocalSetup();