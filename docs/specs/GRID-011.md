# GRID-011: Railway Infrastructure Setup

**Status**: 🔄 In Progress  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-25  

**Issue Link**: https://github.com/awynne/grid/issues/22

## Overview

Set up the dual-service Railway infrastructure for GridPulse MVP, including web service, worker service, and required add-ons (TimescaleDB, Redis).

## Problem Statement

GridPulse requires a dual-service architecture on Railway with:
- Web service for React Router v7 SSR + API routes
- Worker service for Node.js data ingestion
- TimescaleDB for time-series data storage
- Redis for caching layer
- Cost optimization to stay under $25/month budget

## Scope

### In Scope
- Railway project setup and configuration
- Web service deployment configuration
- Worker service deployment configuration  
- TimescaleDB add-on setup
- Redis (Upstash) add-on setup
- Environment variable management
- Service networking and communication
- Cost monitoring and optimization

### Out of Scope
- Application code implementation (covered in other specs)
- Database schema creation (GRID-012)
- Data ingestion logic (GRID-013)
- Caching implementation (GRID-014)

## Technical Requirements

### Railway Services Architecture

```mermaid
graph TB
    subgraph "Railway Project: gridpulse-prod"
        WEB[Web Service<br/>React Router v7 App]
        WORKER[Worker Service<br/>Node.js Cron]
        
        subgraph "Add-ons"
            PG[(TimescaleDB<br/>PostgreSQL)]
            REDIS[(Redis<br/>Upstash)]
        end
    end
    
    WEB --> PG
    WEB --> REDIS
    WORKER --> PG
    WORKER --> REDIS
    
    EIA[EIA v2 API] --> WORKER
    USERS[Users] --> WEB
```

### Service Specifications

#### Web Service Configuration
```yaml
# railway.json for web service
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

**Resource Requirements:**
- **Memory**: 512MB (can scale to 1GB if needed)
- **CPU**: 0.5 vCPU shared
- **Expected cost**: ~$10-12/month

#### Worker Service Configuration
```yaml
# railway.json for worker service  
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/worker.js",
    "healthcheckPath": "/worker/health",
    "healthcheckTimeout": 30
  }
}
```

**Resource Requirements:**
- **Memory**: 256MB (lightweight for cron jobs)
- **CPU**: 0.25 vCPU shared
- **Expected cost**: ~$5-8/month

### Add-on Configuration

#### TimescaleDB Setup
- **Service**: Railway PostgreSQL with TimescaleDB extension
- **Plan**: Hobby plan (1GB RAM, 1GB storage initially)
- **Expected cost**: ~$5/month
- **Configuration**:
  ```sql
  -- Enable TimescaleDB extension
  CREATE EXTENSION IF NOT EXISTS timescaledb;
  ```

#### Redis Setup  
- **Service**: Upstash Redis add-on
- **Plan**: Free tier initially (10K requests/day)
- **Expected cost**: $0/month (free tier)
- **Upgrade trigger**: >8K requests/day sustained

### Environment Variables

#### Shared Variables
```bash
# Database
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...  # Railway format

# Redis
REDIS_URL=redis://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application
NODE_ENV=production
```

#### Web Service Specific
```bash
# React Router v7
SESSION_SECRET=...
PORT=3000

# API Keys (read-only for web service)
EIA_API_KEY=...  # For API route fallbacks only
```

#### Worker Service Specific  
```bash
# EIA API
EIA_API_KEY=...  # Primary API access
EIA_BASE_URL=https://api.eia.gov/v2

# Job Configuration
CRON_ENABLED=true
INGEST_SCHEDULE="15 * * * *"  # Every hour at 15 minutes past
```

## Implementation Tasks

### Phase 1: Railway Project Setup
- [ ] Create Railway project "gridpulse-prod"
- [ ] Configure project settings and team access
- [ ] Set up cost monitoring and alerts
- [ ] Configure deployment notifications

### Phase 2: Add-on Provisioning
- [ ] Add TimescaleDB (PostgreSQL) add-on
- [ ] Add Redis (Upstash) add-on  
- [ ] Verify add-on connectivity
- [ ] Configure connection pooling if needed

### Phase 3: Web Service Deployment
- [ ] Create web service from GitHub repo
- [ ] Configure build settings (React Router v7 app)
- [ ] Set environment variables
- [ ] Configure health check endpoint
- [ ] Test deployment and scaling

### Phase 4: Worker Service Deployment
- [ ] Create worker service from same GitHub repo
- [ ] Configure build settings (Node.js worker)
- [ ] Set environment variables
- [ ] Configure health check endpoint
- [ ] Test cron job execution

### Phase 5: Service Integration
- [ ] Verify inter-service communication
- [ ] Test database connectivity from both services
- [ ] Test Redis connectivity from both services
- [ ] Configure logging and monitoring
- [ ] Validate cost projections

## Success Criteria

### Functional Requirements
- [ ] Both services deploy successfully from GitHub
- [ ] Web service responds to HTTP requests
- [ ] Worker service executes scheduled jobs
- [ ] Database connections established from both services
- [ ] Redis connections established from both services
- [ ] Health checks pass for both services

### Performance Requirements
- [ ] Web service startup time <30 seconds
- [ ] Worker service startup time <15 seconds
- [ ] Database connection latency <50ms
- [ ] Redis connection latency <10ms

### Cost Requirements
- [ ] Total monthly cost <$25/month
- [ ] Cost monitoring alerts configured
- [ ] Resource usage tracking enabled

### Operational Requirements
- [ ] Automated deployments from main branch
- [ ] Environment variables securely managed
- [ ] Logging aggregation working
- [ ] Monitoring dashboards accessible

## Dependencies

- **GRID-008**: ✅ Architecture design complete
- GitHub repository with basic project structure
- Railway account with payment method configured
- EIA API key obtained

## Risks and Mitigations

### High Risk
- **Cost overrun**: Monitor usage closely, set up alerts
  - *Mitigation*: Start with minimal resources, scale as needed
- **Service startup failures**: Test configurations thoroughly
  - *Mitigation*: Implement comprehensive health checks

### Medium Risk  
- **Add-on connectivity issues**: Network configuration complexity
  - *Mitigation*: Use Railway's internal networking, test connections
- **Environment variable management**: Secrets exposure risk
  - *Mitigation*: Use Railway's secure environment variable system

## Future Considerations

### Scaling Triggers
- Web service: >80% CPU usage sustained for 5 minutes
- Worker service: Job execution time >5 minutes consistently
- Database: >80% storage or connection limit reached
- Redis: Approaching free tier limits

### Monitoring Setup
- Railway metrics dashboard
- Cost tracking and alerts
- Service health monitoring
- Database performance monitoring

## Service Naming Convention

**Railway Project:** `gridpulse`  
**Project URL:** https://railway.com/project/10593acb-4a7a-4331-a993-52d24860d1fa

### Test Environment Services
- `web-test` - React Router v7 web application service
- `worker-test` - Node.js cron worker service  
- `postgres-test` - PostgreSQL database with TimescaleDB extension
- `redis-test` - Redis cache database

### Production Environment Services  
- `web-prod` - React Router v7 web application service
- `worker-prod` - Node.js cron worker service
- `postgres-prod` - PostgreSQL database with TimescaleDB extension  
- `redis-prod` - Redis cache database

### Naming Rationale
- **Environment suffix required** - Railway requires unique service names across entire project
- **Consistent pattern** - All services follow `{service-name}-{environment}` format
- **Clear identification** - Easy to distinguish between test and production resources
- **Configuration alignment** - Environment variables and deployment configs can reference services clearly

## Notes

This spec focuses purely on infrastructure setup and service deployment. Application logic, database schema, and business functionality are covered in subsequent specs (GRID-012 through GRID-015).

The dual-service architecture provides clear separation of concerns while maintaining cost efficiency within the $25/month budget constraint.
