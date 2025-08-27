# Development Environment Setup

> **📋 Purpose**: Complete guide for setting up the GridPulse development environment based on GRID-017 specification.

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repo-url>
   cd grid
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the template file
   cp .env.example .env
   
   # Get DATABASE_URL from Railway dev project dashboard
   # Contact team lead or check Railway dev project for actual DATABASE_URL
   
   # Update .env with the actual DATABASE_URL
   # SECURITY: Never commit .env file to git!
   ```

3. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables (.env.local)

### Template
```bash
# GridPulse Development Environment Variables
# Generated from GRID-017 specification - DO NOT COMMIT TO GIT

# Database Configuration
# Use DATABASE_PUBLIC_URL for local development (external access)
DATABASE_URL="postgresql://postgres:PASSWORD@maglev.proxy.rlwy.net:PORT/railway"

# Application Configuration
NODE_ENV="development"
PORT="3000"

# Session Security (32-character base64 key for development only)
SESSION_SECRET="YOUR_GENERATED_32_CHAR_SECRET"

# Optional - Not needed for GRID-017 minimal UI phase
# REDIS_URL=""  # Will be added in GRID-014 (Redis Caching Layer)
# EIA_API_KEY=""  # Will be added in GRID-013 (Data Ingestion Service)
```

### Variable Descriptions

| Variable | Purpose | Source | Required |
|----------|---------|--------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Railway `DATABASE_PUBLIC_URL` | ✅ Yes |
| `NODE_ENV` | Runtime environment | Set to "development" | ✅ Yes |
| `PORT` | Local server port | Default 3000 | ✅ Yes |
| `SESSION_SECRET` | React Router v7 session encryption | Generate with `openssl rand -base64 32` | ✅ Yes |
| `REDIS_URL` | Redis cache connection | Future (GRID-014) | ❌ Not yet |
| `EIA_API_KEY` | EIA data access | Future (GRID-013) | ❌ Not yet |

### Getting Railway Database URL

1. **Link to Database Service**
   ```bash
   railway service Postgres
   ```

2. **Get Variables**
   ```bash
   railway variables
   ```

3. **Use DATABASE_PUBLIC_URL**
   - For local development, use the public URL (external access)
   - Format: `postgresql://postgres:PASSWORD@maglev.proxy.rlwy.net:PORT/railway`

### Generating Session Secret

```bash
# Generate a secure 32-character base64 key
openssl rand -base64 32
```

**Important:** Use a different secret for each environment (dev/prod).

## Database Operations

### Initial Setup (GRID-012 Enhanced)
```bash
# Generate Prisma client
npx prisma generate

# Push schema to Railway database
npx prisma db push

# Apply TimescaleDB features (hypertables, aggregates)
npm run db:timescale

# Seed development data (5 BAs, 40 series, sample observations)
npx prisma db seed

# OR run complete setup in one command:
npm run db:setup
```

### Daily Development
```bash
# Visual database browser
npm run db:studio

# Push schema changes
npm run db:push

# Seed development data
npm run db:seed

# Reset and reseed database
npm run db:reset
```

### Database Studio
- **URL**: `http://localhost:5555`
- **Command**: `npm run db:studio`
- **Purpose**: Visual interface to browse and edit database data

## Development Workflow

### Starting Development
```bash
# Start the development server
npm run dev

# Access the application
open http://localhost:3000
```

### Expected URLs
- **Main App**: `http://localhost:3000`
- **Dashboard**: `/` (home page)
- **Feature Placeholders**: `/daily`, `/wpm`, `/ducks`, `/diff`
- **Database Studio**: `http://localhost:5555`

### Environment Verification
```bash
# Test database connection
npx prisma db push

# Verify app starts
npm run dev

# Check environment variables are loaded
railway run 'echo $DATABASE_URL'
```

## Current Architecture Status

### ✅ Completed (GRID-017 + GRID-012)
- React Router v7 application with TypeScript
- shadcn/ui component library
- **TimescaleDB schema** with BalancingAuthority, Series, and Observation models
- **Time-series optimization** with hypertables and continuous aggregates
- Railway production database connection configured
- **Local development environment** setup and tested with dev database
- Database seeded with 5 BAs, 40 series, 120 sample observations
- Development server running on http://localhost:5173

### 🔄 Next Steps
- **GRID-013**: EIA data ingestion service
- **GRID-014**: Redis caching layer
- **GRID-015**: REST API design
- **GRID-018**: F1 Daily Pulse feature implementation

## Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Verify Railway connection
railway status

# Re-link to database service
railway service Postgres

# Check environment variables
railway variables
```

**Missing Environment Variables:**
```bash
# Verify .env.local exists
ls -la .env.local

# Check file contents (without exposing secrets)
grep -E "^[A-Z_]+=" .env.local
```

**Prisma Client Issues:**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database schema
npx prisma db push --force-reset
npx prisma db seed
```

### Railway CLI Issues
```bash
# Login to Railway
railway login

# Check current project
railway status

# Link to correct project
railway link
```

## Security Notes

### .env.local Security
- **Never commit** `.env.local` to git (it's in `.gitignore`)
- **Use different secrets** for development and production
- **Rotate secrets** regularly in production
- **Share securely** if working with team members

### Database Access
- Development database is shared via Railway
- Use `DATABASE_PUBLIC_URL` for external access
- Production will use internal networking for better security

## Cost Management

### Development Environment
- **Railway Free Tier**: 1GB storage, shared compute
- **Cost**: $0/month (within free tier limits)
- **Monitoring**: Set up usage alerts at 80% of limits

### Upgrade Triggers
- Database storage >800MB
- Sustained high CPU usage
- Need for dedicated resources

## References

- [GRID-017 Specification](./specs/GRID-017.md) - Complete minimal UI setup spec
- [React Router Coding Standards](./coding-react-router.md) - Technical guidelines
- [Railway Documentation](https://docs.railway.app/) - Platform-specific help
- [Prisma Documentation](https://www.prisma.io/docs) - Database toolkit guide
