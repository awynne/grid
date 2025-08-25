import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding development database...');

  // Seed balancing authorities for development
  const balancingAuthorities = [
    { 
      code: 'PJM', 
      name: 'PJM Interconnection', 
      timezone: 'America/New_York', 
      region: 'Eastern' 
    },
    { 
      code: 'CAISO', 
      name: 'California ISO', 
      timezone: 'America/Los_Angeles', 
      region: 'Western' 
    },
    { 
      code: 'MISO', 
      name: 'Midcontinent ISO', 
      timezone: 'America/Chicago', 
      region: 'Central' 
    },
    { 
      code: 'ERCOT', 
      name: 'Electric Reliability Council of Texas', 
      timezone: 'America/Chicago', 
      region: 'Texas' 
    },
    { 
      code: 'SPP', 
      name: 'Southwest Power Pool', 
      timezone: 'America/Chicago', 
      region: 'Central' 
    },
  ];

  for (const ba of balancingAuthorities) {
    await prisma.balancingAuthority.upsert({
      where: { code: ba.code },
      update: {},
      create: ba,
    });
    console.log(`✅ Created/updated ${ba.code} - ${ba.name}`);
  }

  console.log('✅ Development database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });