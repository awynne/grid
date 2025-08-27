# GridPulse Deployment Guide

## Core Principle: "Done Means Done"

> **"It's not done until it's running in prod"** - No feature, spec, or implementation is considered complete until it's successfully deployed and validated in the production environment.

## Environment Pipeline

GridPulse follows a strict 3-environment deployment pipeline ensuring quality and reliability:

```
Dev Environment → Test Environment → Production Environment
     ↓                   ↓                      ↓
   Validate           Acceptance              Live Users
  Development          Testing               Production
```

### Environment Purposes

| Environment | Purpose | Validation Level | Access |
|------------|---------|------------------|---------|
| **Dev** | Development and initial testing | Basic functionality | Development team |
| **Test** | Pre-production validation | Full acceptance testing | QA and stakeholders |
| **Prod** | Live user-facing system | Production monitoring | End users |

## Deployment Pipeline

### Overview

Each deployment includes:
1. **Application Build** - Compile and optimize code
2. **Database Migrations** - Apply schema changes and TimescaleDB features
3. **Data Seeding** - Initialize required data (dev/test only)
4. **Health Validation** - Verify deployment success
5. **Performance Testing** - Ensure acceptable performance

### Railway Configuration Enhancement

The current Railway configuration needs enhancement to include database migrations:

**Current (`railway.json`):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Enhanced Configuration Needed:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "./scripts/deploy.sh",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 60
  }
}
```

## Deployment Scripts

### Universal Deployment Script

**File: `scripts/deploy.sh`**
```bash
#!/bin/bash
# GridPulse Universal Deployment Script
# Handles application build, database migrations, and startup

set -e

echo "🚀 Starting GridPulse deployment..."

# Environment detection
ENVIRONMENT=${RAILWAY_ENVIRONMENT:-"unknown"}
echo "📍 Deploying to environment: $ENVIRONMENT"

# Build application
echo "🏗️  Building application..."
npm run build

# Database migrations
echo "💾 Applying database migrations..."
npx prisma migrate deploy

# TimescaleDB features (if not already applied)
echo "⚡ Setting up TimescaleDB features..."
node database/setup.js || echo "⚠️  TimescaleDB setup skipped (may already be configured)"

# Conditional seeding (dev/test only)
if [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "test" ]]; then
    echo "🌱 Seeding database with sample data..."
    npx prisma db seed
else
    echo "📦 Production environment - skipping data seeding"
fi

# Health check preparation
echo "🏥 Preparing health checks..."
npx prisma generate

# Start application
echo "✅ Starting GridPulse application..."
exec npm start
```

### Environment-Specific Deployment

**File: `scripts/deploy-to-test.sh`**
```bash
#!/bin/bash
# Deploy GRID-012 TimescaleDB schema to test environment

set -e

echo "🧪 Deploying to TEST environment..."

# Ensure we're on main branch with latest changes
git checkout main
git pull origin main

# Switch to test environment
echo "🔗 Linking to test environment..."
railway link 10593acb-4a7a-4331-a993-52d24860d1fa  # gridpulse project
railway environment test
railway service Postgres-test

# Deploy database changes
echo "💾 Applying database schema to TEST..."
npx prisma migrate deploy

# Apply TimescaleDB features
echo "⚡ Setting up TimescaleDB in TEST..."
npm run db:timescale

# Seed test data
echo "🌱 Seeding TEST database..."
npm run db:seed

# Validate deployment
echo "✅ Validating TEST deployment..."
npm run test:remote:test

echo "🎉 TEST deployment completed successfully!"
```

**File: `scripts/deploy-to-prod.sh`**
```bash
#!/bin/bash
# Deploy to production environment (only after test validation)

set -e

echo "🚨 Deploying to PRODUCTION environment..."

# Confirmation required for production
read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
if [[ $confirm != "yes" ]]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

# Ensure test environment passed
echo "🧪 Validating test environment first..."
npm run test:remote:test || {
    echo "❌ Test environment validation failed - cannot deploy to production"
    exit 1
}

# Switch to production environment
echo "🔗 Linking to production environment..."
railway environment prod
railway service Postgres-prod

# Deploy database changes (NO SEEDING in production)
echo "💾 Applying database schema to PRODUCTION..."
npx prisma migrate deploy

# Apply TimescaleDB features
echo "⚡ Setting up TimescaleDB in PRODUCTION..."
npm run db:timescale

# Validate production deployment
echo "✅ Validating PRODUCTION deployment..."
npm run test:remote:prod

echo "🎉 PRODUCTION deployment completed successfully!"
```

## Testing & Validation Scripts

### Remote Environment Testing

**File: `scripts/test-remote-environment.js`**
```javascript
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
      } else {
        console.log('⚠️  TimescaleDB features not detected');
      }

      await client.end();
    } catch (error) {
      console.log('⚠️  TimescaleDB validation skipped (extension may not be available)');
    }

    // Test 4: Performance test
    console.log('⚡ Testing query performance...');
    const start = Date.now();
    await prisma.observation.findFirst({
      where: { series: { type: 'demand' } },
      include: { series: { include: { balancingAuthority: true } } },
      orderBy: { ts: 'desc' }
    });
    const queryTime = Date.now() - start;
    console.log(`⚡ Query performance: ${queryTime}ms`);

    // Test 5: Data quality (if data exists)
    if (obsCount > 0) {
      const sampleData = await prisma.observation.findFirst({
        include: { series: { include: { balancingAuthority: true } } },
        orderBy: { ts: 'desc' }
      });
      
      if (sampleData) {
        console.log(`📈 Sample data: ${sampleData.series.balancingAuthority.code} ${sampleData.series.type} = ${sampleData.value} ${sampleData.series.units}`);
      }
    }

    console.log(`✅ ${environment.toUpperCase()} environment validation passed!`);
    process.exit(0);

  } catch (error) {
    console.error(`❌ ${environment.toUpperCase()} environment validation failed:`);
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateDeployment();
```

## Acceptance Criteria

### Definition of "Done"

A feature is only considered complete when it passes all stages:

#### 1. Development Complete ✅
- [ ] Code implemented and tested locally
- [ ] All spec requirements satisfied
- [ ] Local development environment validated

#### 2. Test Environment Deployed ✅
- [ ] Schema migrations applied successfully
- [ ] Database features configured (TimescaleDB, etc.)
- [ ] Sample data seeded and validated
- [ ] Performance tests pass
- [ ] Health checks respond correctly

#### 3. Production Environment Deployed ✅
- [ ] Production deployment successful
- [ ] Database migrations applied without errors
- [ ] No data seeding (production data preserved)
- [ ] Performance meets production SLAs
- [ ] Health monitoring active
- [ ] Rollback plan validated

### Deployment Checklist

**Before Deployment:**
- [ ] All tests pass in development
- [ ] Code reviewed and approved
- [ ] Database backup created (production)
- [ ] Rollback plan documented
- [ ] Stakeholders notified of deployment

**During Deployment:**
- [ ] Monitor deployment logs for errors
- [ ] Verify health checks pass
- [ ] Validate database schema changes
- [ ] Test critical functionality

**After Deployment:**
- [ ] Performance monitoring confirms acceptable metrics
- [ ] Error rates within normal parameters
- [ ] User-facing features working correctly
- [ ] Documentation updated with deployment notes

## Rollback Procedures

### Automatic Rollback Triggers
- Health check failures (3 consecutive failures)
- Database migration errors
- Critical application errors on startup
- Performance degradation beyond thresholds

### Manual Rollback Process
1. **Stop current deployment**
   ```bash
   railway service stop
   ```

2. **Revert database migrations (if necessary)**
   ```bash
   npx prisma migrate reset --skip-seed
   # Restore from backup if needed
   ```

3. **Deploy previous working version**
   ```bash
   git checkout <previous-working-commit>
   railway up
   ```

4. **Validate rollback success**
   ```bash
   npm run test:remote:<environment>
   ```

## Environment Variables by Environment

### Development
```bash
DATABASE_URL="<dev-database-url>"
NODE_ENV="development"
LOG_LEVEL="debug"
```

### Test  
```bash
DATABASE_URL="<test-database-url>"
NODE_ENV="test"
LOG_LEVEL="info"
SEED_DATA="true"
```

### Production
```bash
DATABASE_URL="<prod-database-url>"
NODE_ENV="production"
LOG_LEVEL="warn"
SEED_DATA="false"
ENABLE_MONITORING="true"
```

## Monitoring & Alerting

### Health Check Endpoints
- **`/health`** - Basic application health
- **`/health/database`** - Database connectivity
- **`/health/detailed`** - Comprehensive system status

### Key Metrics to Monitor
- **Response time** - API endpoint performance
- **Database performance** - Query execution times
- **Error rates** - Application and database errors
- **Resource usage** - CPU, memory, database connections

### Alert Thresholds
- Response time >500ms (warning), >1000ms (critical)
- Error rate >1% (warning), >5% (critical)  
- Database connections >80% (warning), >95% (critical)
- Health check failures (3 consecutive = critical)

## Integration with Development Workflow

### Updated Definition of Done

The spec completion process now includes deployment validation:

1. **Implementation Complete** - Code satisfies spec requirements
2. **Development Validated** - Local testing passes
3. **Test Environment Deployed** - Schema and features work in test
4. **Test Environment Validated** - Acceptance testing passes
5. **Production Environment Deployed** - Live deployment successful
6. **Production Environment Validated** - Monitoring confirms stability

### Spec Status Updates

Spec statuses now reflect deployment state:
- **🔄 In Progress** - Implementation underway
- **👀 Ready for Test** - Code complete, ready for test deployment
- **🧪 Testing** - Deployed to test, undergoing validation
- **🚀 Ready for Prod** - Test passed, ready for production
- **✅ Completed** - Successfully deployed and validated in production

Only when a spec reaches **✅ Completed** with production deployment is it truly "done."

## Team Responsibilities

### Developers
- Ensure local testing passes before deployment
- Create deployment-ready code with proper migrations
- Monitor deployments and respond to alerts

### DevOps/Infrastructure
- Maintain deployment pipeline and scripts
- Monitor environment health and performance
- Manage rollbacks and incident response

### QA/Testing
- Validate test environment deployments
- Approve production deployments after acceptance testing
- Report deployment issues and validation failures

---

**Remember: "Done means done" - it's not complete until it's running successfully in production!**