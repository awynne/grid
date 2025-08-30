# GridPulse CDKTF Infrastructure

**Declarative, idempotent infrastructure management for Railway deployments using CDK for Terraform (CDKTF) with TypeScript.**

## ✅ Solves Current Problems

- **❌ Non-idempotent bash scripts** → ✅ Declarative CDKTF with state management
- **❌ Manual Railway cleanup** → ✅ Programmatic environment lifecycle
- **❌ Generic Terraform** → ✅ React Router 7-aware infrastructure definitions
- **❌ No destroy/recreate workflow** → ✅ One-command environment recreation
- **❌ Inconsistent deployments** → ✅ Docker-based deployment with guaranteed consistency

## 🚀 Quick Start

### 1. Setup
```bash
# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Railway token and secrets

# Initialize project
./scripts/manage-environments.sh init
```

### 2. Docker Deployment (Recommended)
```bash
# Complete Docker workflow: build → push → deploy (prod)
./scripts/manage-environments.sh docker-build prod
```

### 3. Traditional Git Deployment (Alternative)
```bash
./scripts/manage-environments.sh deploy prod
```

### 4. Recreate Environment (Idempotent)
```bash
./scripts/manage-environments.sh recreate prod
```

## 🐳 Docker-First Architecture

GridPulse uses **Docker deployment as the primary method** for reliable, consistent infrastructure management.

### Deployment Methods

#### 1. Docker Deployment (Recommended)
- **Container Image**: Pre-built, tested, immutable application images
- **Registry**: GitHub Container Registry (`ghcr.io/awynne/grid`)
- **Benefits**: Instant deployments, guaranteed consistency, easy rollbacks
- **Use Cases**: Production, staging, consistent test environments

#### 2. Git Deployment (Fallback)
- **Source Build**: Railway builds directly from Git repository
- **Benefits**: No container setup required, good for development
- **Use Cases**: Development, experimentation, quick prototyping

### 📊 Why Docker-First? (Research & Analysis)

**Time Investment Analysis:**
- **Docker Now**: 4 hours implementation
- **Docker Later**: 6+ hours (includes migration complexity)
- **Net Savings**: 2+ hours + reduced risk

**Reliability Benefits:**
- ✅ **Consistent environments**: Same image across test/staging/production
- ✅ **Faster deployments**: No Railway build time (5+ minutes → 30 seconds)
- ✅ **Easy rollbacks**: Pin to specific image versions instantly
- ✅ **Better testing**: Test exact production artifacts locally
- ✅ **Reduced failures**: Eliminate "works on my machine" issues

**Migration Complexity Avoided:**
- ❌ **Production downtime risk** during Git → Docker migration
- ❌ **Configuration drift** between deployment methods
- ❌ **Team training** on two different workflows
- ❌ **State management** complications during transition

### Environment Stack
- **Production Environment** (`gridpulse-prod`): Live production deployment using single "prod" environment

### Services (Prod)
- **web**: React Router 7 application (Docker image from GHCR)
- **postgres**: TimescaleDB-enabled database  
- **redis**: Caching/session store
- **data** (future): Python data ingestion service (not yet deployed)

**Service Naming:** Clean names without environment suffixes. Internal networking uses `postgres.railway.internal` and `redis.railway.internal`.


## 📁 Project Structure

```
cdktf/
├── main.ts                          # Main application entry point
├── stacks/                          # Environment-specific stacks
│   └── ProductionEnvironmentStack.ts # Production environment definition (deployed)
├── constructs/                      # Reusable infrastructure components
│   └── GridPulseEnvironment.ts      # Environment construct with all services
├── scripts/                         # Management automation
│   └── manage-environments.sh       # Environment lifecycle commands
├── .gen/                           # Generated Railway provider bindings
├── cdktf.out/                      # Generated Terraform JSON
├── cdktf.json                      # CDKTF configuration
├── package.json                    # Node.js dependencies and scripts
└── terraform.tfvars               # Environment variables (git ignored)
```

## 🛠️ Management Commands

### Docker Deployment (Recommended)
```bash
# Complete Docker workflow: build → push → deploy (prod)
./scripts/manage-environments.sh docker-build prod

# Check Docker deployment status
./scripts/manage-environments.sh docker-status

# Advanced Docker workflows
./scripts/build-and-deploy.sh build-and-deploy prod
./scripts/build-and-deploy.sh build v1.2.3 --latest
./scripts/build-and-deploy.sh deploy prod v1.2.3
```

### Traditional Environment Lifecycle
```bash
# Plan changes before applying
./scripts/manage-environments.sh plan prod

# Deploy environment (Git deployment)
./scripts/manage-environments.sh deploy prod

# Destroy environment
./scripts/manage-environments.sh destroy prod

# Recreate environment from scratch (idempotent)
./scripts/manage-environments.sh recreate prod
```

### Project Management  
```bash
# Initialize project and install dependencies
./scripts/manage-environments.sh init

# Build TypeScript infrastructure code
./scripts/manage-environments.sh build

# Show environment status
./scripts/manage-environments.sh status prod

# Show infrastructure differences
./scripts/manage-environments.sh diff prod
```

## 🚀 CI/CD: Deploy to Prod on Push to main

This repository includes a GitHub Actions workflow that builds a Docker image, pushes to GHCR, and deploys to Railway via CDKTF when changes land on `main`.

- Workflow: `.github/workflows/deploy-prod.yml`
- Image: `ghcr.io/<owner>/grid:<tag>` (and `:latest`)
- Services: `web`, `postgres`, `redis` in a single Railway environment named `prod`

Set these repository secrets (Settings → Secrets and variables → Actions):
- `RAILWAY_TOKEN`: Railway Project Token (Project → Settings → Tokens). Prefer this over account API tokens in CI.
- `RAILWAY_PROJECT_ID`: Railway project UUID
- `POSTGRES_PASSWORD`: DB password
- `SESSION_SECRET`: 32+ char session secret
- `EIA_API_KEY`: Optional, if used
- `GHCR_USERNAME`: GitHub username (for Railway to pull private images)
- `GHCR_TOKEN`: GitHub Personal Access Token with `read:packages` (for Railway to pull the image)
```

## 🔐 Configuration

### Required Variables (terraform.tfvars)
```hcl
# Railway Configuration
railway_token     = "your-railway-api-token"
project_id        = "your-railway-project-id"  
postgres_password = "secure-database-password"
session_secret    = "32-character-session-secret"
eia_api_key      = "optional-eia-api-key"

# Docker Deployment (Recommended)
docker_image      = "ghcr.io/awynne/grid:v1.2.3"  # Specific version for production
docker_username   = "your-github-username"
docker_password   = "your-github-token"

# Git Deployment (Fallback)
source_repo       = "awynne/grid"
source_repo_branch = "main"
```

### Deployment Method Selection
- **If `docker_image` is provided**: Docker deployment (recommended)
- **If `docker_image` is empty**: Git deployment (fallback)
- **Production**: Always use Docker with specific version tags
- **Development**: Either method works, Git acceptable for iteration

### Railway Token Types
- Project Token (recommended for CI): Project → Settings → Tokens (scoped to a single project).
- Account API Token (fallback for local CLI): Account Settings → API Tokens.

In CI and CDKTF flows, prefer the Project Token. Set it as `RAILWAY_TOKEN`.

### GitHub Container Registry Setup
For Docker deployments, set up GitHub Container Registry:
1. **Personal Access Token**: Create token with `write:packages` scope
2. **Repository Settings**: Enable package visibility (public/private)
3. **Local Docker Login**: `echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin`
4. **Environment Variable**: Set `GITHUB_TOKEN` for automated builds

## 🎯 Key Features

### Idempotent Operations
- **Safe to run multiple times** - CDKTF tracks state and only applies changes
- **No manual cleanup** - Proper destroy/recreate workflows
- **Consistent environments** - Same infrastructure definition across test/prod

### React Router 7 Integration
- **SSR-optimized deployment** patterns
- **Proper build command** configuration
- **Environment-specific** variables and secrets
- **Health check** endpoints for React Router applications

### Future Python Data Service
- **Dagster pipeline** deployment ready
- **Cron scheduling** for data ingestion
- **Service dependencies** properly managed
- **Database connection** sharing with web service

### TypeScript Benefits
- **Type safety** for infrastructure definitions
- **IDE support** with autocomplete and error checking
- **Refactoring safety** with compile-time validation
- **Familiar syntax** for React Router 7 developers

## 🔄 Deployment Workflow

### Docker Development Workflow (Recommended)
1. **Edit application code** and infrastructure TypeScript files
2. **Build and deploy**: `./scripts/manage-environments.sh docker-build test`
3. **Test**: Verify application functionality with exact production artifacts
4. **Promote to prod**: `./scripts/build-and-deploy.sh deploy production [tag]`

### Traditional Development Workflow (Alternative)
1. **Edit infrastructure** in TypeScript files
2. **Plan changes**: `./scripts/manage-environments.sh plan test`
3. **Deploy**: `./scripts/manage-environments.sh deploy test`
4. **Test**: Verify application functionality
5. **Promote to prod**: `./scripts/manage-environments.sh deploy production`

### Emergency Recovery
```bash
# Complete environment recreation from scratch
./scripts/manage-environments.sh recreate production
```

### CI/CD Integration (Docker Deployment)
```yaml
# Example GitHub Actions workflow
- name: Build and Deploy Infrastructure
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    cd infrastructure/cdktf
    cp terraform.tfvars.example terraform.tfvars
    echo "railway_token = \"${{ secrets.RAILWAY_TOKEN }}\"" >> terraform.tfvars
    echo "docker_username = \"${{ github.actor }}\"" >> terraform.tfvars
    echo "docker_password = \"${{ secrets.GITHUB_TOKEN }}\"" >> terraform.tfvars
    ./scripts/manage-environments.sh docker-build production
```

### CI/CD Integration (Traditional)
```yaml
# Example GitHub Actions workflow  
- name: Deploy Infrastructure
  run: |
    cd infrastructure/cdktf
    cp terraform.tfvars.example terraform.tfvars
    echo "railway_token = \"${{ secrets.RAILWAY_TOKEN }}\"" >> terraform.tfvars
    echo "docker_image = \"\"" >> terraform.tfvars  # Force Git deployment
    ./scripts/manage-environments.sh deploy production
```

## 🚨 Migration from Old Infrastructure

The old `infrastructure/terraform/` and `scripts/` are **deprecated** in favor of this CDKTF approach.

### Benefits of Migration
- ✅ **True idempotency** - No more manual cleanup required
- ✅ **Type safety** - Catch infrastructure errors at compile time
- ✅ **React Router 7 awareness** - Proper deployment patterns
- ✅ **Programmatic control** - No more bash script maintenance
- ✅ **Environment isolation** - Safe test/production separation

### What's Preserved
- **Docker Compose** for local development (`../docker-compose.yml`)
- **Environment templates** concept (terraform.tfvars.example)
- **Service definitions** (web, postgres, redis)

## 🔮 Future Enhancements

### GRID-013 Integration
When implementing the Python data ingestion service:
```typescript
// In production stack
const prodEnvironment = new GridPulseEnvironment(this, "production", config);
prodEnvironment.addDataService({ 
  cronSchedule: "15 * * * *" // Hourly Dagster jobs
});
```

**✅ Note:** The `addDataService` method has been updated with:
- Correct connection URLs using `postgres.railway.internal` and `redis.railway.internal`
- Clean service naming without environment suffixes (`data`)

### Advanced Features
- **Multi-region deployments** with Railway regions
- **Blue-green deployments** with environment switching
- **Automated rollbacks** on deployment failures
- **Infrastructure testing** with Jest and CDKTF

## 📋 Current Implementation Status

### ✅ Deployed and Working
- **Production Environment**: Single `prod` environment deployed via `ProductionEnvironmentStack`
- **Services**: `web`, `postgres`, `redis` with correct internal networking
- **Docker Deployment**: CI/CD pipeline builds and deploys Docker images
- **Environment Variables**: Properly configured for production


### ✅ Ready for Future Implementation
- **Data Service**: Properly configured and ready for GRID-013 integration
- **Service Naming**: Consistent clean naming strategy implemented

This CDKTF implementation provides **true Infrastructure as Code** with declarative, type-safe, idempotent environment management for GridPulse. 🚀
## ☁️ Remote State (Terraform Cloud)

To keep CI and local runs in sync, configure a remote backend with Terraform Cloud (TFC):

1) Create TFC org and workspace
- Create an organization in https://app.terraform.io
- Create a workspace named `gridpulse-prod` (CLI-driven)
- Set Execution Mode to Local (so runs execute in CI/local; TFC stores state)

2) Create a TFC API token
- User → Tokens → New token (or Team token)
- In GitHub, add repository secret `TF_API_TOKEN` with the token value
- Optionally run `terraform login` locally or export `TF_TOKEN_app_terraform_io`

3) Wire env vars in CI
- Add repository secrets: `TF_CLOUD_ORG` (your TFC org), `TF_API_TOKEN`
- Workflows already set:
  - `TF_CLOUD_ORG`, `TF_CLOUD_WORKSPACE=gridpulse-prod`
  - `TF_TOKEN_app_terraform_io` from `TF_API_TOKEN`

4) CDKTF auto-detects backend
- The stack configures a CloudBackend only when both `TF_CLOUD_ORG` and
  `TF_CLOUD_WORKSPACE` are present. Otherwise it uses local state.

After this, CI and local share state, avoiding drift between environments.

## 🧭 Railway Project vs Environment

Railway models services at the project level, and environments primarily scope variables and deployments:

- Services (e.g., `web`, `postgres`, `redis`) are project-level and appear under every environment in that project.
- Environment variables are environment-scoped (we set `environmentId` on variables via IaC).
- It’s normal to see the same services under multiple environments in the same project.

Recommendations:
- Delete placeholder environments (e.g., `default`) once your target environment (e.g., `prod`) is created, to reduce confusion.
- For strict separation between environments, use separate Railway projects per env (e.g., one project for prod, another for dev/test).
- If Postgres starts before its password variable is present, restart the service once after variables are applied.
