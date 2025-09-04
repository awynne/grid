# GRID-012A: CDKTF Infrastructure as Code Implementation

**Status**: 🔄 In Progress  
**Priority**: High  
**Created**: 2025-08-28  
**Updated**: 2025-09-03  

**Parent**: [GRID-012](./GRID-012.md) - TimescaleDB Schema Implementation  
**GitHub Issue**: [#26](https://github.com/awynne/grid/issues/26)

## Overview

Replaced non-idempotent bash scripts with declarative, type-safe Infrastructure as Code using CDK for Terraform (CDKTF) with TypeScript, enabling idempotent environment lifecycle management for Railway deployments. Added a Docker-first CI workflow that publishes images to GHCR and triggers automated redeploys on Railway.

## Problem Statement

Current infrastructure management suffers from:
- **Non-idempotent scripts** requiring manual cleanup
- **Generic Terraform** without React Router 7-specific patterns
- **No programmatic destroy/recreate** workflows
- **Manual Railway service management** prone to human error
- **Inconsistent deployment artifacts** leading to "works on my machine" issues
- **Long deployment times** due to Railway build process on every deploy

## Scope

### In Scope
- CDKTF project setup with Railway provider integration
- TypeScript-based environment stack definitions
- Idempotent environment lifecycle management (create/destroy/recreate)
- React Router 7-aware service configurations
- **Docker-first deployment architecture** with container registry integration
- **Multi-stage Dockerfile** optimized for Railway deployment
- Automated environment variable and secrets management
- Complete replacement of bash scripts with declarative workflows
- **Docker and Git deployment method** support with automatic selection

### Out of Scope  
- Python data service implementation (GRID-013 dependency)
- Advanced Railway features (volumes, custom domains)
- Multi-region deployments
- CI/CD pipeline integration (future enhancement)

## Technical Architecture

### CDKTF Implementation Strategy

**Technology Stack:**
- **CDK for Terraform (CDKTF)** - HashiCorp official project
- **Railway Provider** - `terraform-community-providers/railway` (community-maintained, production-ready)
- **TypeScript** - Type-safe infrastructure definitions
- **Railway GraphQL API** - Underlying platform integration

**Key Benefits:**
- **Declarative** - Define desired state, CDKTF manages convergence
- **Idempotent** - Safe to run multiple times, only applies changes
- **Type-safe** - Compile-time validation of infrastructure configurations
- **React Router 7 native** - TypeScript aligns with frontend development
- **Docker-first** - Container deployment for consistency and speed

### Docker-First Decision Analysis

**Research Findings:**
- **Time Investment**: Docker implementation now (4 hours) vs. later migration (6+ hours)
- **Deployment Speed**: Docker deployment (30 seconds) vs. Git build (5+ minutes)
- **Consistency**: Same container image across test/staging/production environments
- **Rollback Speed**: Instant version pinning vs. Git commit reverting

**Implementation Rationale:**
1. **Easier Now**: No existing production deployment to migrate from
2. **Better Repeatability**: Immutable container images eliminate deployment variations
3. **Reliability**: Pre-tested container images reduce deployment failure risk
4. **Future-Proof**: Container-first approach scales better for multiple services

### Project Structure

```
infrastructure/cdktf/
├── main.ts                          # Application entry point
├── stacks/                          # Environment-specific stacks  
│   ├── TestEnvironmentStack.ts      # Test environment
│   └── ProductionEnvironmentStack.ts # Production environment
├── constructs/                      # Reusable components
│   └── GridPulseEnvironment.ts      # Environment construct
├── scripts/                         # Management automation
│   ├── manage-environments.sh       # Lifecycle commands
│   └── setup.sh                     # One-time setup
├── .gen/                           # Generated provider bindings
└── terraform.tfvars.example        # Configuration template
```

## Implementation Details

### Environment Stack Architecture

```typescript
interface GridPulseEnvironmentConfig {
  projectId: string;
  environmentName: string;
  railwayToken: string;
  postgresPassword: string;
  sessionSecret: string;
  eiaApiKey?: string;
}

class GridPulseEnvironment extends Construct {
  public readonly environment: Environment;
  public readonly webService: Service;
  public readonly postgresService: Service; 
  public readonly redisService: Service;
  public dataService?: Service; // Future: GRID-013
}
```

### React Router 7 Service Configuration

```typescript
// Web service configuration prefers Docker image if provided; otherwise Git build
this.webService = new Service(this, "web", config.dockerImage
  ? {
      name: "web",
      projectId: config.projectId,
      sourceImage: config.dockerImage,
      sourceImageRegistryUsername: config.dockerUsername,
      sourceImageRegistryPassword: config.dockerPassword,
    }
  : {
      name: "web",
      projectId: config.projectId,
    }
);

// Web environment variables (PORT, SESSION_SECRET, DATABASE_URL, REDIS_URL, etc.)
const webVariables = [
  { name: "NODE_ENV", value: "production" },
  { name: "PORT", value: "3000" },
  { name: "SESSION_SECRET", value: config.sessionSecret },
  // Database and Redis connections configured automatically
];
```

### Database Service (TimescaleDB)

```typescript
// PostgreSQL with TimescaleDB extension
this.postgresService = new Service(this, "postgres", {
  name: `postgres-${config.environmentName}`,
  projectId: config.projectId,
  sourceImage: "timescale/timescaledb:latest-pg15",
});

// Database configuration
new Variable(this, "postgres_db", {
  environmentId: this.environment.id,
  serviceId: this.postgresService.id,
  name: "POSTGRES_DB",
  value: "railway",
});
```

## Management Workflows

### Environment Lifecycle Commands

```bash
# Idempotent environment recreation
./scripts/manage-environments.sh recreate test

# Incremental deployments  
./scripts/manage-environments.sh deploy test

# Infrastructure planning
./scripts/manage-environments.sh plan test

# Status monitoring
./scripts/manage-environments.sh status test
```

### Setup Process

```bash
# One-time setup
./scripts/setup.sh

# Regular deployment workflow
./scripts/manage-environments.sh plan test
./scripts/manage-environments.sh deploy test
```

## CI/CD Outcome

- GitHub Actions workflow `.github/workflows/deploy-prod.yml` builds and pushes GHCR images on `main`.
- Railway redeploy is triggered automatically after image push:
- CLI-based via `RAILWAY_TOKEN` (Project Token recommended)
  - API-based via GraphQL when `RAILWAY_TOKEN`, `RAILWAY_ENVIRONMENT_ID`, and `RAILWAY_SERVICE_ID` are provided
- CDKTF infra updates are gated behind `DEPLOY_WITH_CDKTF` to avoid creating existing environments; image deployment is decoupled.

### Post-Deployment Database Migrations (Pending Implementation)

**Requirement**: Automatic database schema updates must execute after successful Railway deployment to ensure production database stays synchronized with application code.

**Integration Point**: Add migration trigger step in `.github/workflows/deploy-prod.yml` after Railway redeploy completion (line 95-104).

**Implementation Approach**:
- Execute `scripts/setup-database.sh` remotely on Railway service after successful deployment
- Use Railway CLI or API to run migration commands in production environment  
- Implement proper error handling - deployment should fail if migrations fail
- Add migration status verification to ensure schema changes applied correctly

**Error Handling Requirements**:
- Migration failures must cause CI pipeline to fail and notify developers
- Include migration logs in CI output for debugging
- Implement rollback strategy for failed schema changes
- Verify database connectivity before attempting migrations

**Dependencies**: Requires Railway service to be successfully deployed and responding to health checks before migration execution.

## Success Criteria

### Functional Requirements
- [ ] CDKTF successfully synthesizes valid Terraform JSON for Railway provider
- [ ] Environment stacks deploy and create Railway services correctly
- [ ] Environment variables and secrets are properly configured
- [ ] Destroy workflow cleanly removes all infrastructure
- [ ] Recreate workflow is truly idempotent (can run multiple times safely)

### Performance Requirements
- [ ] TypeScript compilation completes in <10 seconds
- [ ] Infrastructure planning completes in <30 seconds
- [ ] Environment deployment completes in <5 minutes
- [ ] Environment destruction completes in <2 minutes

### Developer Experience Requirements
- [ ] TypeScript provides autocomplete and type checking for infrastructure code
- [ ] Error messages clearly indicate configuration issues
- [ ] Management scripts provide clear feedback and progress indicators
- [ ] Setup process can be completed by new developers in <15 minutes

### Integration Requirements
- [ ] React Router 7 service deploys with correct build configuration
- [ ] PostgreSQL service enables TimescaleDB extension
- [ ] Redis service provides caching capabilities
- [ ] Service networking allows proper inter-service communication

## Dependencies

- **GRID-012**: ✅ TimescaleDB Schema Implementation (provides database requirements)
- Node.js 18+ environment with npm
- Railway account with API token access
- CDKTF CLI installation

## Migration Path

### Phase 1: CDKTF Implementation ✅
- [x] CDKTF project setup with Railway provider
- [x] Environment stack definitions
- [x] Management script automation
- [x] Configuration and documentation

### Phase 2: Validation and Testing
- [x] Deploy prod environment using CDKTF (single env for cost optimization)
- [x] Validate service connectivity and functionality
- [x] Test complete destroy/recreate workflow
- [x] Verify idempotency by running recreate multiple times

### Phase 3: Post-Deployment Migration Integration ✅
- [x] Add migration trigger step to CI workflow after Railway redeploy
- [x] Implement Railway CLI/API integration for remote migration execution
- [x] Add migration failure handling and CI pipeline integration  
- [x] Test migration workflow on prod environment (single env deployment)
- [x] Verify database schema synchronization across deployments

### Phase 4: Migration Completion ✅
- [x] Archive old infrastructure/terraform/ directory
- [x] Update project documentation to reference CDKTF approach
- [x] Train team on new management workflows
- [x] Remove deprecated bash scripts from scripts/ directory

### Phase 5: Supabase Database Migration 🔄
- [ ] **5A: CDKTF Supabase Integration** - Add Supabase Terraform provider and project resources
- [ ] **5B: Automated Provisioning** - Single command environment creation with managed database
- [ ] **5C: Migration Execution** - Parallel deployment, cutover, and Railway PostgreSQL cleanup
- [ ] **5D: Validation & Documentation** - Verify full IaC automation and update team processes

## Future Enhancements

### GRID-013 Integration
```typescript
// Ready for Python data service
prodEnvironment.addDataService({ 
  cronSchedule: "15 * * * *" // Dagster hourly jobs
});
```

### Advanced Features
- **Multi-environment promotion** workflows
- **Infrastructure testing** with Jest
- **CI/CD integration** with GitHub Actions
- **Advanced Railway features** (volumes, custom domains)

## Notes

This implementation provides **true Infrastructure as Code** for Railway deployments:

✅ **Declarative** - Define desired state, not imperative steps  
✅ **Idempotent** - Safe to run multiple times without side effects  
✅ **Type-safe** - Catch configuration errors at compile time  
✅ **Version controlled** - Infrastructure changes tracked in git  
✅ **React Router 7 native** - TypeScript development workflow alignment  

The CDKTF approach eliminates all manual cleanup requirements and provides a foundation for scaling infrastructure management as GridPulse grows from MVP to production scale.

**Key Innovation**: Using TypeScript for infrastructure matches the React Router 7 frontend development workflow, reducing context switching and leveraging existing team TypeScript expertise for infrastructure management.

---

## Phase 5: Database Architecture Migration (2025-09-03)

### Problem Statement: Railway PostgreSQL Limitations

**Technical Issues Encountered:**
- TimescaleDB Docker image not honoring `POSTGRES_DB=gridpulse` environment variable
- Database initialization requiring manual creation steps
- Railway PostgreSQL is containerized, not truly "managed" (manual backups, maintenance)
- Authentication errors due to database creation failures

**GRID-007 Revisit:**
- Analysis confirmed **PostgreSQL is optimal for MVP** (not TimescaleDB)
- Storage requirements: 13MB for MVP, 53MB for small scale
- Performance: PostgreSQL <5ms queries sufficient for MVP scale
- Recommendation: "PostgreSQL (optimal)" for MVP scenarios

### Research: Managed Database Solutions

#### Railway PostgreSQL Reality Check
- ❌ **Not managed**: Still Docker containers requiring manual maintenance
- ❌ **Limited backups**: Volume-based, not database-aware
- ❌ **Manual scaling**: No automated performance optimization
- ❌ **Container issues**: Database initialization problems with custom images
- 💰 **Cost**: ~$15-30/month for container + manual management overhead

#### Supabase Managed PostgreSQL Analysis
- ✅ **Truly managed**: Automated backups, high availability, monitoring
- ✅ **Official Terraform provider**: Full IaC support with `supabase_project` resource
- ✅ **Cost optimized**: Free tier (500MB DB, 50k MAUs) perfect for MVP
- ✅ **Bonus features**: Built-in Auth, Realtime, Storage, Edge Functions
- ✅ **Connection pooling**: pgBouncer included for optimal Railway pairing
- ✅ **Zero initialization issues**: Database creation fully automated

### Architecture Decision: Railway + Supabase IaC

**Selected Pattern**: Compute on Railway + Database on Supabase
- **Industry standard**: Common pairing for managed DB + container flexibility
- **Regional optimization**: Both services support same regions for low latency
- **Cost effective**: Railway compute (~$10-20) + Supabase free tier
- **Full IaC**: Both platforms support Terraform providers

**Key Benefits:**
1. **True Infrastructure as Code**: Both Railway and Supabase resources in single CDKTF stack
2. **Zero manual steps**: Database creation, schema migration, connection strings fully automated
3. **Fastest deployment**: No container build times for database, instant provisioning
4. **Future-proof**: Foundation for auth, realtime, storage features when needed
5. **Operational excellence**: Managed backups, monitoring, security patches included

## Phase 5 Implementation Plan

### Phase 5A: CDKTF Supabase Provider Integration

**Goal**: Add Supabase managed PostgreSQL to existing CDKTF infrastructure

```typescript
// New Supabase provider configuration
terraform {
  required_providers {
    railway = { source = "terraform-community-providers/railway", version = "~> 0.5" }
    supabase = { source = "supabase/supabase", version = "~> 1.0" }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}
```

**Infrastructure Updates:**
```typescript
interface GridPulseEnvironmentConfig {
  projectId: string;
  environmentName: string;
  railwayToken: string;
  
  // New Supabase configuration
  supabaseAccessToken: string;
  supabaseOrgId: string;
  supabaseRegion: string;
  
  sessionSecret: string;
  eiaApiKey?: string;
}

// Replace Railway PostgreSQL with Supabase project
this.supabaseProject = new SupabaseProject(this, "database", {
  organizationId: config.supabaseOrgId,
  name: `${config.environmentName}-database`,
  region: config.supabaseRegion,
  databasePassword: this.generateSecurePassword(),
});
```

**Connection String Automation:**
```typescript
// Auto-generate optimized connection strings for Railway
const databaseUrl = `postgresql://postgres.${this.supabaseProject.ref}:${databasePassword}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;

new Variable(this, "web_database_url", {
  environmentId: this.environment.id,
  serviceId: this.webService.id,
  name: "DATABASE_URL",
  value: databaseUrl, // Pooled connection for optimal performance
});
```

### Phase 5B: Automated Environment Provisioning

**Single Command Environment Creation:**
```bash
# Complete environment: Railway web service + Supabase database + networking
./scripts/manage-environments.sh recreate prod

# What happens automatically:
# 1. Supabase project created with generated secure password
# 2. Railway web service deployed with auto-configured connection strings  
# 3. Database schema migrated via post-deployment hooks
# 4. Health checks verify web+database connectivity
# 5. Environment ready for immediate use
```

**Zero Manual Configuration Requirements:**
- ✅ Database password generation and secure storage
- ✅ Connection string construction and injection
- ✅ Network configuration and security groups
- ✅ Schema migration execution post-deployment
- ✅ Health verification and rollback on failure

### Phase 5C: Migration Execution Strategy

**Backwards-Compatible Migration:**
1. **Parallel deployment**: Create Supabase alongside existing Railway PostgreSQL
2. **Data migration**: Export from Railway → Import to Supabase (if needed)
3. **Cutover**: Update connection strings to point to Supabase
4. **Cleanup**: Remove Railway PostgreSQL service from CDKTF stack
5. **Validation**: Verify all application functionality works with managed database

**Rollback Plan:**
- Keep Railway PostgreSQL in CDKTF until Supabase fully validated
- Connection string switching allows instant rollback if issues arise
- Database export/import scripts for data recovery if needed

## Updated Success Criteria

### Full IaC Automation Requirements
- ✅ **Single command environment creation**: `./scripts/manage-environments.sh recreate prod`
- ✅ **Zero manual configuration**: No database setup, passwords, or connection string management
- ✅ **Complete destroy/recreate**: Environment teardown and rebuild with no manual intervention
- ✅ **Schema migration automation**: Database structure applied automatically during deployment
- ✅ **Team onboarding**: New developers can create working environment with zero knowledge

### Performance & Reliability Requirements  
- ✅ **Sub-60 second provisioning**: Managed database creation faster than container builds
- ✅ **Immediate connectivity**: Web service connects to database on first boot
- ✅ **Automated monitoring**: Built-in database health checks and alerting
- ✅ **Backup automation**: Daily backups with point-in-time recovery (Pro tier)

### Cost Optimization Validation
- ✅ **MVP within free tier**: 500MB database sufficient for initial development
- ✅ **Predictable scaling**: Clear upgrade path when limits reached
- ✅ **Reduced operational overhead**: No manual database management tasks

## Dependencies & Prerequisites

### New Dependencies
- **Supabase Account**: Organization access for Terraform provider
- **Supabase Personal Access Token**: API authentication for resource management
- **Region Coordination**: Railway and Supabase deployed in same AWS region

### Integration Points
- **Existing GRID-012A infrastructure**: Builds on current CDKTF Railway setup
- **Docker deployment workflow**: Web application deployment remains unchanged  
- **CI/CD pipeline integration**: Database migrations triggered post-deployment
- **Environment variable management**: Automated through Terraform outputs

## Next Steps

### Immediate Implementation (Phase 5A)
1. Add Supabase Terraform provider to CDKTF configuration
2. Create `GridPulseDatabase` construct for Supabase project management
3. Update `GridPulseEnvironment` to use managed database instead of Railway PostgreSQL
4. Test infrastructure provisioning in development environment

### Validation & Migration (Phase 5B)
1. Deploy parallel Supabase database alongside existing Railway PostgreSQL
2. Validate connection strings and application connectivity
3. Perform schema migration and data consistency verification
4. Execute cutover with rollback plan ready

### Production Deployment (Phase 5C)
1. Update production environment to use Supabase managed database
2. Archive old Railway PostgreSQL configurations
3. Document new architecture patterns for team
4. Prepare for future Supabase feature integration (Auth, Realtime, Storage)

---

**Infrastructure Evolution**: From manual scripts → CDKTF Railway containers → **Full IaC with managed services**

This Phase 5 extension achieves the ultimate infrastructure goal: **complete environment lifecycle automation with zero manual configuration**, while providing a foundation for scaling from MVP to production with managed database excellence.
