# GridPulse Database Setup (GRID-012)

This directory contains TimescaleDB-specific database setup and migration files for the GridPulse MVP.

## Overview

The GridPulse database uses PostgreSQL with the TimescaleDB extension for time-series optimization. The schema is defined in Prisma for development convenience, but TimescaleDB-specific features are applied through SQL migrations.

## Architecture

- **Prisma Schema**: Core table definitions and relationships (`prisma/schema.prisma`)
- **TimescaleDB Migrations**: Time-series optimizations and hypertables (`database/migrations/`)
- **Setup Script**: Automated deployment of TimescaleDB features (`database/setup.js`)

## Database Structure

### Core Tables

1. **balancing_authorities**: Grid operators (PJM, CAISO, MISO, ERCOT, SPP)
2. **series**: Data series definitions (demand, generation types, interchange, CO2)
3. **observations**: Time-series data points (converted to TimescaleDB hypertable)

### TimescaleDB Features

- **Hypertable**: `observations` table with 1-day chunk partitioning
- **Continuous Aggregates**: `hourly_aggregates`, `daily_aggregates` for dashboard performance
- **Helper Views**: `latest_observations`, `ba_summary`, `series_status`, `data_quality_summary`

## Setup Instructions

### Development Setup

```bash
# Full database setup (recommended)
npm run db:setup

# Or step by step:
npm run db:push          # Apply Prisma schema
npm run db:timescale     # Apply TimescaleDB features
npm run db:seed          # Add sample data
```

### Production Setup

```bash
# Ensure TimescaleDB extension is enabled first
# (requires superuser privileges)
# CREATE EXTENSION IF NOT EXISTS timescaledb;

# Then run setup
npm run db:setup
```

## Migration Files

### 001_timescaledb_setup.sql
- Converts `observations` table to hypertable
- Creates optimized indexes
- Sets up 1-day chunk partitioning

### 002_continuous_aggregates.sql
- Creates `hourly_aggregates` materialized view
- Creates `daily_aggregates` materialized view
- Sets up refresh policies for near real-time updates

### 003_helper_views.sql
- `latest_observations`: Current values for each series
- `ba_summary`: Overview of data availability by BA
- `series_status`: Data quality monitoring
- `data_quality_summary`: Quality metrics by BA and series type

## Performance Characteristics

Based on GRID-007 analysis for MVP scale (5 BAs):
- **Query performance**: <5ms for single BA, single day queries
- **Storage efficiency**: ~35 bytes per record
- **Data volume**: ~2,256 records/day, 13 MB for 6 months
- **Partitioning**: 1-day chunks for optimal query performance

## Sample Queries

### Get latest demand for all BAs
```sql
SELECT ba.code, lo.ts, lo.value, s.units
FROM latest_observations lo
JOIN series s ON lo.series_id = s.id
JOIN balancing_authorities ba ON s.ba_id = ba.id
WHERE s.type = 'demand'
ORDER BY ba.code;
```

### Daily peak demand (last 30 days)
```sql
SELECT 
    ba.code,
    day,
    max_value as peak_demand
FROM daily_aggregates da
JOIN series s ON da.series_id = s.id
JOIN balancing_authorities ba ON s.ba_id = ba.id
WHERE s.type = 'demand' 
    AND day >= NOW() - INTERVAL '30 days'
ORDER BY ba.code, day;
```

### Data quality summary
```sql
SELECT * FROM data_quality_summary
WHERE ba_code = 'PJM' AND type = 'demand';
```

## Monitoring

Check hypertable health:
```sql
SELECT * FROM timescaledb_information.chunks 
WHERE hypertable_name = 'observations';
```

Check continuous aggregate status:
```sql
SELECT * FROM timescaledb_information.continuous_aggregates;
```

## Next Steps

After database setup:
1. **GRID-013**: Implement EIA data ingestion service
2. **GRID-014**: Add Redis caching layer
3. **GRID-015**: Create REST API endpoints
4. **GRID-018**: Build F1 Daily Pulse feature

## Troubleshooting

### TimescaleDB extension not found
Ensure TimescaleDB is installed and enabled:
```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

### Permission denied on hypertable creation
The database user needs sufficient permissions. On Railway/managed services, this is typically handled automatically.

### Continuous aggregates not refreshing
Check refresh policies:
```sql
SELECT * FROM timescaledb_information.jobs
WHERE application_name LIKE '%continuous_aggregate%';
```