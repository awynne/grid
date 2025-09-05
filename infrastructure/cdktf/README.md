# GridPulse CDKTF Infrastructure

**Declarative, idempotent infrastructure management for Railway deployments using CDK for Terraform (CDKTF) with TypeScript.**

## ✅ Current Architecture

- ✅ **GitHub Actions workflows** for all infrastructure operations
- ✅ **Terraform Cloud remote state** for team collaboration
- ✅ **Docker-first deployment** with immutable container images
- ✅ **Declarative CDKTF** with TypeScript type safety
- ✅ **Idempotent operations** with proper state management
- ✅ **Custom domain support** via Railway and Cloudflare

## 🚀 Quick Start

### Primary Method: GitHub Actions

**Complete Release & Deploy Pipeline:**
```bash
gh workflow run "Release and Deploy (Full Pipeline)" --field confirm="RELEASE_DEPLOY"
```

This workflow:
1. Builds and pushes Docker image to GHCR
2. Updates infrastructure with new image tag
3. Deploys to Railway production environment
4. Validates deployment health

### Infrastructure-Only Operations

```bash
# Recreate environment (destroy + rebuild)
gh workflow run "Recreate Prod (CDKTF)" --field fresh_db="false" --field confirm="RECREATE_PROD"

# Emergency cleanup
gh workflow run "Destroy Prod (CDKTF)" --field confirm="DESTROY_PROD"

# Force destroy (when regular destroy fails)
gh workflow run "Force Destroy Prod (CDKTF)" --field confirm="FORCE_DESTROY_PROD"
```

### Local Development/Troubleshooting

For debugging infrastructure issues, you can run Terraform locally:

```bash
cd infrastructure/cdktf
source terraform-cloud-env.sh  # Configure Terraform Cloud access

npx cdktf synth                 # Generate Terraform config
sops -d ../../secrets/prod.enc.tfvars > terraform.tfvars
cp terraform.tfvars cdktf.out/stacks/gridpulse-prod/
cd cdktf.out/stacks/gridpulse-prod/

terraform state list            # View remote state
terraform plan                  # Plan changes (development only)
```

## 🏗️ Architecture

### Components

- **Railway Web Service**: React Router 7 application
- **Railway Redis**: Caching and session storage
- **Supabase PostgreSQL**: Primary database (managed)
- **Custom Domain**: Cloudflare DNS + Railway integration
- **Docker Registry**: GHCR for container images

### File Structure

```
infrastructure/cdktf/
├── main.ts                     # CDKTF app entry point
├── stacks/
│   └── ProductionEnvironmentStack.ts  # Production infrastructure
├── constructs/
│   └── GridPulseEnvironment.ts  # Reusable infrastructure construct
├── secrets/
│   └── prod.enc.tfvars         # SOPS-encrypted production variables
└── terraform-cloud-env.sh     # Local Terraform Cloud setup
```

## 🔐 Security & Secrets

- **SOPS Encryption**: All secrets encrypted with age keys
- **Terraform Cloud**: Remote state with team access controls  
- **Railway Tokens**: Scoped API access for infrastructure management
- **Environment Variables**: Securely injected into Railway services

## 🚢 Deployment Process

1. **Code Changes**: Developers push changes to main branch
2. **Trigger Workflow**: Run `Release and Deploy (Full Pipeline)`
3. **Build Image**: GitHub Actions builds Docker image
4. **Update Infrastructure**: CDKTF updates Railway with new image
5. **Deploy**: Railway deploys new container automatically
6. **Validate**: Health checks confirm successful deployment

## 📊 Custom Domain Setup

Current configuration:
- **Primary Domain**: `www.gridpulse.us` (Railway custom domain)
- **Root Redirect**: `gridpulse.us` → `www.gridpulse.us` (Cloudflare forwarding)
- **SSL**: Automatic via Railway/Cloudflare
- **DNS**: Managed through Cloudflare for better redirect support

## 🔧 Troubleshooting

### Common Issues

**Deployment Failures:**
```bash
# Check workflow logs
gh run list --workflow="Release and Deploy (Full Pipeline)"
gh run view [RUN_ID] --log-failed
```

**Infrastructure State Issues:**
```bash
# Use local Terraform to inspect state
source terraform-cloud-env.sh
terraform state list
terraform state show [RESOURCE_NAME]
```

**Domain/DNS Issues:**
- Check Cloudflare DNS settings
- Verify Railway custom domain configuration
- Test with `nslookup gridpulse.us` and `nslookup www.gridpulse.us`

### Emergency Recovery

If infrastructure gets into a broken state:

```bash
# Force destroy everything (nuclear option)
gh workflow run "Force Destroy Prod (CDKTF)" --field confirm="FORCE_DESTROY_PROD"

# Recreate from scratch
gh workflow run "Recreate Prod (CDKTF)" --field fresh_db="true" --field confirm="RECREATE_PROD"
```

## 📝 Development Workflow

1. **Make infrastructure changes** in TypeScript constructs
2. **Test locally** using `terraform plan` (optional)
3. **Commit changes** to main branch
4. **Deploy via workflow** - infrastructure updates automatically
5. **Monitor deployment** via GitHub Actions and Railway logs

---

**Note**: This infrastructure uses GitHub Actions + Terraform Cloud for all operations. Local script-based management has been deprecated in favor of the more reliable workflow-based approach.