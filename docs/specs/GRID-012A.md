# GRID-012A: CDKTF Infrastructure as Code Implementation

**Status**: 🔄 In Progress  
**Priority**: High  
**Created**: 2025-08-28  
**Updated**: 2025-08-29  

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
  - CLI-based via `RAILWAY_TOKEN` (default/fallback)
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

### Phase 3: Post-Deployment Migration Integration
- [ ] Add migration trigger step to CI workflow after Railway redeploy
- [ ] Implement Railway CLI/API integration for remote migration execution
- [ ] Add migration failure handling and CI pipeline integration  
- [ ] Test migration workflow on prod environment (single env deployment)
- [ ] Verify database schema synchronization across deployments

### Phase 4: Migration Completion
- [ ] Archive old infrastructure/terraform/ directory
- [ ] Update project documentation to reference CDKTF approach
- [ ] Train team on new management workflows
- [ ] Remove deprecated bash scripts from scripts/ directory

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
