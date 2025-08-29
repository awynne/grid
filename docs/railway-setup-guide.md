# Railway Infrastructure Setup Guide

This guide walks through setting up the GridPulse Railway infrastructure on Railway as specified in GRID-011.

## Prerequisites

- Railway account with payment method configured
- EIA API key (https://api.eia.gov/signup/)
- This GitHub repository connected to Railway

## Railway Project Structure

**Project Name:** `gridpulse`
**Environments:** `test` and `prod`

### Services per Environment

Each environment needs these services:
- `web-{env}` - React Router v7 web application
- `postgres-{env}` - PostgreSQL with TimescaleDB extension
- `redis-{env}` - Redis cache (Upstash add-on)

**Note:** Worker service will be implemented as a separate Python service in GRID-013.

## Manual Setup Steps

### 1. Create Railway Project

1. Go to https://railway.com/new
2. Create new project named `gridpulse`
3. Connect your GitHub repository: `awynne/grid`

### 2. Create Test Environment Services

#### A. Web Service (web-test)

1. **Add Service** → **GitHub Repo** → Select `awynne/grid`
2. **Service name:** `web-test`
3. **Builder:** Use repository Dockerfile (no build/start commands needed)
4. **Health checks:** Dockerfile defines `HEALTHCHECK`

#### B. PostgreSQL Database (postgres-test)

1. **Add Service** → **Database** → **PostgreSQL**
2. **Service name:** `postgres-test`
3. **Plan:** Hobby ($5/month)
4. **After creation:**
   - Go to **Settings** → **Data** → **Query**
   - Run: `CREATE EXTENSION IF NOT EXISTS timescaledb;`

#### C. Redis Cache (redis-test)

1. **Add Service** → **Database** → **Redis**
2. **Service name:** `redis-test`  
3. **Provider:** Upstash
4. **Plan:** Free tier initially

### 3. Configure Test Environment Variables

#### Web Service Variables:

```bash
# Database (automatically provided by Railway)
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...

# Redis (automatically provided by Railway)
REDIS_URL=redis://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application
NODE_ENV=production
```

#### Web Service (web-test) Specific:

```bash
# React Router v7
SESSION_SECRET=your-32-char-secret-key-for-test
PORT=3000

# Optional API fallback
EIA_API_KEY=your-eia-api-key
```

### 4. Create Production Environment Services

Repeat steps 2-3 but:
- Use `prod` instead of `test` in service names
- Use different SESSION_SECRET for production
- Consider higher resource limits for production services

### 5. Service Configuration Files

The repository contains the necessary configuration files:

- `railway.json` - Web service configuration

### 6. Deployment Strategy

**Test Environment (Auto-Deploy):**
- Connect GitHub repository to web-test service
- Branch: `main`
- Auto-deploy on git push enabled
- Wait for CI enabled

**Production Environment (Manual Deploy):**
- Keep web-prod service repository disconnected
- Manual deployments only via Railway CLI

### 7. Deploy and Test

**Test Environment:**
1. Push code to main branch → Automatic deployment to test
2. Test health: service should pass Docker `HEALTHCHECK` (app `/health` endpoint)
3. Verify database connections in health endpoint response

**Production Environment:**
1. Manual deployment: `railway deploy --environment prod`
2. Test health: service should pass Docker `HEALTHCHECK` (app `/health` endpoint)
3. Verify database connections in health endpoint response

### 8. Deployment Workflow

```bash
# Development workflow
git push main                        # Auto-deploys to test environment
# Test and verify on test environment
railway deploy --environment prod    # Manual deploy to production when ready
```

## Cost Monitoring

Expected monthly costs:
- **Web services:** ~$10-12/month each
- **PostgreSQL:** ~$5/month each
- **Redis:** Free tier initially

**Total estimated:** ~$15-17/month for both environments

## Resource Limits

### Web Services
- **Memory:** 512MB (scalable to 1GB)
- **CPU:** 0.5 vCPU shared

## Next Steps

After Railway infrastructure is set up:
1. GRID-012: Implement TimescaleDB schema
2. GRID-013: Implement Python-based EIA data ingestion service
3. GRID-014: Implement Redis caching layer
4. GRID-015: Complete REST API implementation

## Troubleshooting

### Common Issues

1. **Health check failing:** Ensure health endpoints return HTTP 200
2. **Build failures:** Check logs for dependency or TypeScript errors
3. **Database connection issues:** Verify DATABASE_URL is set correctly

### Support

- Railway docs: https://docs.railway.com
- GridPulse issues: https://github.com/awynne/grid/issues
