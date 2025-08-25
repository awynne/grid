# Railway Infrastructure Setup Guide

This guide walks through setting up the GridPulse dual-service architecture on Railway as specified in GRID-011.

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
- `worker-{env}` - Node.js data ingestion worker
- `postgres-{env}` - PostgreSQL with TimescaleDB extension
- `redis-{env}` - Redis cache (Upstash add-on)

## Manual Setup Steps

### 1. Create Railway Project

1. Go to https://railway.com/new
2. Create new project named `gridpulse`
3. Connect your GitHub repository: `awynne/grid`

### 2. Create Test Environment Services

#### A. Web Service (web-test)

1. **Add Service** → **GitHub Repo** → Select `awynne/grid`
2. **Service name:** `web-test`
3. **Settings:**
   - **Branch:** `main`
   - **Root Directory:** `.` (default)
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Healthcheck Path:** `/health`
   - **Port:** `3000`

#### B. Worker Service (worker-test)

1. **Add Service** → **GitHub Repo** → Select `awynne/grid`  
2. **Service name:** `worker-test`
3. **Settings:**
   - **Branch:** `main`
   - **Root Directory:** `worker`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Healthcheck Path:** `/worker/health`
   - **Port:** `3001`

#### C. PostgreSQL Database (postgres-test)

1. **Add Service** → **Database** → **PostgreSQL**
2. **Service name:** `postgres-test`
3. **Plan:** Hobby ($5/month)
4. **After creation:**
   - Go to **Settings** → **Data** → **Query**
   - Run: `CREATE EXTENSION IF NOT EXISTS timescaledb;`

#### D. Redis Cache (redis-test)

1. **Add Service** → **Database** → **Redis**
2. **Service name:** `redis-test`  
3. **Provider:** Upstash
4. **Plan:** Free tier initially

### 3. Configure Test Environment Variables

#### Shared Variables (both web-test and worker-test):

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

#### Worker Service (worker-test) Specific:

```bash
# EIA API  
EIA_API_KEY=your-eia-api-key
EIA_BASE_URL=https://api.eia.gov/v2

# Job Configuration
CRON_ENABLED=true
INGEST_SCHEDULE="15 * * * *"
PORT=3001
```

### 4. Create Production Environment Services

Repeat steps 2-3 but:
- Use `prod` instead of `test` in service names
- Use different SESSION_SECRET for production
- Consider higher resource limits for production services

### 5. Service Configuration Files

The repository already contains the necessary configuration files:

- `railway.json` - Web service configuration
- `railway.worker.json` - Worker service configuration
- `worker/package.json` - Worker dependencies and scripts

### 6. Deploy and Test

1. **Deploy all services** - Railway will automatically deploy on git push
2. **Test health endpoints:**
   - Web: `https://web-test-xxx.up.railway.app/health`
   - Worker: `https://worker-test-xxx.up.railway.app/worker/health`
3. **Verify database connections** in health endpoint responses

## Cost Monitoring

Expected monthly costs:
- **Web services:** ~$10-12/month each
- **Worker services:** ~$5-8/month each  
- **PostgreSQL:** ~$5/month each
- **Redis:** Free tier initially

**Total estimated:** ~$20-25/month for both environments

## Resource Limits

### Web Services
- **Memory:** 512MB (scalable to 1GB)
- **CPU:** 0.5 vCPU shared

### Worker Services  
- **Memory:** 256MB
- **CPU:** 0.25 vCPU shared

## Next Steps

After Railway infrastructure is set up:
1. GRID-012: Implement TimescaleDB schema
2. GRID-013: Implement EIA data ingestion in worker
3. GRID-014: Implement Redis caching layer
4. GRID-015: Complete REST API implementation

## Troubleshooting

### Common Issues

1. **Health check failing:** Ensure health endpoints return HTTP 200
2. **Build failures:** Check logs for dependency or TypeScript errors
3. **Database connection issues:** Verify DATABASE_URL is set correctly
4. **Worker not responding:** Check PORT environment variable is set

### Support

- Railway docs: https://docs.railway.com
- GridPulse issues: https://github.com/awynne/grid/issues