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

**Note**: For cost optimization, the current deployment uses a single "prod" environment instead of the full 3-environment pipeline.

| Environment | Purpose | Validation Level | Access |
|------------|---------|------------------|---------|
| **Dev** | Development and initial testing | Basic functionality | Development team |
| **Prod** | Production deployment | Full validation and monitoring | End users |

## Deployment Pipeline

### Overview

Each deployment includes:
1. **Application Build** - Compile and optimize code
2. **Database Migrations** - Apply schema changes and TimescaleDB features
3. **Data Seeding** - Initialize required data (dev/test only)
4. **Health Validation** - Verify deployment success
5. **Performance Testing** - Ensure acceptable performance

### Railway (Docker) Configuration

Deployments use the repository `Dockerfile`. Railway builds the image using the Dockerfile and runs it directly. Health checks are defined via Dockerfile `HEALTHCHECK`.

Base image and engines (locked):
- Base: `node:20-bullseye-slim` (Debian). Packages installed via `apt`: `dumb-init`, `bash`, `openssl`, `libssl1.1`, `ca-certificates`.
- Prisma: `prisma` and `@prisma/client` 5.19.x. Client is generated at build time.
- Prisma generator `binaryTargets`: `debian-openssl-1.1.x`, `debian-openssl-3.0.x`, `linux-musl-openssl-3.0.x`.
- Do not change base image or Prisma minor without testing via the Debug workflow.

Tagging and GitOps:
- Avoid `:latest` in production. Use immutable tags from the Release Build workflow.
- The “Plan + Apply Prod (CDKTF)” workflow blocks `docker_image` values ending with `:latest`.

Typical local flow:
```bash
docker build -t gridpulse:local .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e SESSION_SECRET="$(openssl rand -base64 32)" \
  gridpulse:local
```

On Railway, configure the project to use the Dockerfile builder. Set environment variables in the dashboard. No separate start command is required.

## Deployment Infrastructure

### GitHub Actions Workflows

GridPulse uses GitHub Actions for all deployment operations with CDKTF (CDK for Terraform) for Infrastructure as Code:

#### Available Workflows

1. **"Plan + Apply Prod (CDKTF)"** - Plan and apply infrastructure changes
2. **"Recreate Prod (CDKTF)"** - Destroy and recreate environment with optional database reset
3. **"Publish Image (GHCR)"** - Build and publish Docker images to GitHub Container Registry
4. **"Release Build"** - Create release builds with pinned image tags
5. **"Terraform Cloud Force Unlock"** - Unlock locked Terraform Cloud workspaces
6. **"Terraform Cloud Diagnostics & Unlock"** - Comprehensive workspace diagnostics and management

#### Deployment Process

1. **Build Docker Image**:
   - Run "Publish Image (GHCR)" workflow
   - Creates immutable image with tag like `ghcr.io/owner/grid:v123-abcdef`

2. **Update Infrastructure**:
   - Update `secrets/prod.enc.tfvars` with new image tag
   - Run "Plan + Apply Prod (CDKTF)" workflow
   - CDKTF updates Railway services with new image

3. **Validate Deployment**:
   - GitHub Actions automatically runs health checks
   - Database migrations applied post-deployment
   - Environment validation confirms success

### Docker-First Deployment Architecture

- **Build**: Multi-stage Dockerfile optimized for Railway
- **Registry**: GitHub Container Registry (GHCR) for image storage  
- **Deployment**: Railway pulls images from GHCR
- **Configuration**: SOPS-encrypted `secrets/prod.enc.tfvars`
- **State**: Terraform Cloud remote backend

### Database Reset Capability

The "Recreate Prod (CDKTF)" workflow includes a `fresh_db` option that automatically resets the database:

### Automated Database Reset Process (when `fresh_db: "true"`):

The workflow automatically:

1. **Connects to Railway GraphQL API** using `RAILWAY_API_TOKEN`
2. **Discovers services** - Finds prod environment and postgres service IDs  
3. **Gets active deployment** - Identifies the running postgres deployment
4. **Drops database** - Executes `DROP DATABASE IF EXISTS railway;` via API
5. **Creates fresh database** - Executes `CREATE DATABASE railway;` via API  
6. **Validates results** - Checks command exit codes for success
7. **Proceeds with infrastructure** - CDKTF recreates services with new password

**⚠️ WARNING: `fresh_db: "true"` DESTROYS ALL DATA** - Use only for troubleshooting authentication issues.

This automated approach uses Railway's GraphQL API for `serviceInstanceExec` mutations, eliminating the need for manual CLI steps.

### Terraform Cloud Lock Management

When Terraform Cloud workspaces become locked (usually from interrupted operations), use these workflows:

#### "Terraform Cloud Force Unlock" - Simple Unlock
- **Purpose**: Quick unlock of a specific workspace
- **Usage**: Run workflow → Type "UNLOCK" → Workspace unlocked
- **Best for**: Simple lock resolution

#### "Terraform Cloud Diagnostics & Unlock" - Comprehensive Management  
- **Purpose**: Diagnose workspace issues and perform various actions
- **Actions Available**:
  - `status` - Check workspace status, recent runs, lock state
  - `unlock` - Force unlock workspace
  - `cancel-runs` - Cancel active/pending Terraform runs
- **Usage**: Run workflow → Select action → Type "CONFIRM" for destructive actions
- **Best for**: Troubleshooting complex workspace issues


## Testing & Validation Scripts

### Remote Environment Testing

**File: `scripts/test-remote-environment.js`**
```javascript
#!/usr/bin/env node
// Test remote environment deployment validation

import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';

const environment = process.argv[2] || 'prod';
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

#### 2. Production Environment Deployed ✅
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

1. **Identify previous working image**:
   - Check GHCR for previous image tag: `ghcr.io/owner/grid:v122-xyz`

2. **Update infrastructure with previous image**:
   - Update `docker_image` in `secrets/prod.enc.tfvars` to previous tag
   - Run "Plan + Apply Prod (CDKTF)" workflow to rollback
   
3. **Revert database migrations (if necessary)**:
   - Use Railway CLI: `railway connect postgres`
   - Or use "Recreate Prod (CDKTF)" with `fresh_db: true` for full reset

4. **Validate rollback success**:
   - GitHub Actions validates deployment automatically
   - Manual validation: `npm run test:remote:prod`

## Environment Variables

These are the primary variables used by the app and scripts:
```bash
DATABASE_URL="postgresql://..."   # Required
NODE_ENV="development|test|production"
SESSION_SECRET="<32+ char secret>" # Required for session cookies
PORT=3000                          # Optional; defaults vary by host
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
3. **Production Environment Deployed** - Live deployment successful
4. **Production Environment Validated** - Monitoring confirms stability

### Spec Status Updates

Spec statuses now reflect deployment state:
- **🔄 In Progress** - Implementation underway
- **🚀 Ready for Prod** - Code complete, ready for production deployment
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
- Validate production deployments after local testing
- Report deployment issues and validation failures

---

**Remember: "Done means done" - it's not complete until it's running successfully in production!**
