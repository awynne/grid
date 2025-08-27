// GRID-012: Enhanced seed with series and sample observations
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GridPulse database (GRID-012)...');

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

  const createdBAs = [];
  for (const ba of balancingAuthorities) {
    const created = await prisma.balancingAuthority.upsert({
      where: { code: ba.code },
      update: {},
      create: ba,
    });
    createdBAs.push(created);
    console.log(`✅ Created/updated ${ba.code} - ${ba.name}`);
  }

  // Create series definitions for each BA
  console.log('🔧 Creating series definitions...');
  
  const seriesTypes = [
    { type: 'demand', subtype: null, units: 'MW', description: 'Total electricity demand' },
    { type: 'generation', subtype: 'coal', units: 'MW', description: 'Coal-fired generation' },
    { type: 'generation', subtype: 'gas', units: 'MW', description: 'Natural gas generation' },
    { type: 'generation', subtype: 'nuclear', units: 'MW', description: 'Nuclear generation' },
    { type: 'generation', subtype: 'solar', units: 'MW', description: 'Solar generation' },
    { type: 'generation', subtype: 'wind', units: 'MW', description: 'Wind generation' },
    { type: 'generation', subtype: 'hydro', units: 'MW', description: 'Hydroelectric generation' },
    { type: 'interchange', subtype: null, units: 'MW', description: 'Net interchange' }
  ];

  let seriesCount = 0;
  const createdSeries = [];
  
  for (const ba of createdBAs) {
    for (const seriesType of seriesTypes) {
      const series = await prisma.series.upsert({
        where: {
          baId_type_subtype: {
            baId: ba.id,
            type: seriesType.type,
            subtype: seriesType.subtype || ''
          }
        },
        update: {},
        create: {
          baId: ba.id,
          type: seriesType.type,
          subtype: seriesType.subtype,
          units: seriesType.units,
          description: seriesType.description,
          eiaSeriesId: `EIA.${ba.code}.${seriesType.type}${seriesType.subtype ? '.' + seriesType.subtype : ''}`,
          isActive: true
        }
      });
      createdSeries.push({ series, ba });
      seriesCount++;
    }
  }
  
  console.log(`✅ Created ${seriesCount} series definitions`);

  // Create sample observations for demand series (last 24 hours)
  console.log('📊 Creating sample observations...');
  
  const demandSeries = createdSeries.filter(s => s.series.type === 'demand');
  const now = new Date();
  let observationCount = 0;

  for (const { series, ba } of demandSeries) {
    // Create hourly data for last 24 hours
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      
      // Generate realistic demand values based on BA size
      let baseLoad = 50000; // Default MW
      switch (ba.code) {
        case 'PJM': baseLoad = 120000; break;
        case 'CAISO': baseLoad = 40000; break;
        case 'MISO': baseLoad = 90000; break;
        case 'ERCOT': baseLoad = 70000; break;
        case 'SPP': baseLoad = 30000; break;
      }
      
      // Add daily variation (peak around 2-6 PM)
      const hour = timestamp.getHours();
      const peakFactor = hour >= 14 && hour <= 18 ? 1.2 : 
                        hour >= 10 && hour <= 20 ? 1.1 : 0.9;
      
      // Add some random variation (±5%)
      const randomFactor = 0.95 + Math.random() * 0.1;
      
      const value = Math.round(baseLoad * peakFactor * randomFactor);

      await prisma.observation.upsert({
        where: {
          seriesId_ts: {
            seriesId: series.id,
            ts: timestamp
          }
        },
        update: {},
        create: {
          seriesId: series.id,
          ts: timestamp,
          value: value,
          qualityFlag: 'good'
        }
      });
      observationCount++;
    }
  }

  console.log(`✅ Created ${observationCount} sample observations`);
  console.log('✅ GridPulse database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });