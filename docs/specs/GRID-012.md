# GRID-012: TimescaleDB Schema Implementation

**Status**: 🔄 In Progress  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-27  

**GitHub Issue**: [#24](https://github.com/awynne/grid/issues/24)

## Overview

Implement the TimescaleDB database schema for GridPulse MVP, including core tables, hypertables, continuous aggregates, and indexing strategy based on GRID-007 data volume analysis.

## Problem Statement

GridPulse requires a time-series optimized database schema that can:
- Handle 18.8 records/hour/BA (2,256 records/day for 5 BAs)
- Support <5ms query performance for MVP scale
- Enable efficient time-based partitioning
- Provide foundation for complex analytics queries
- Scale from MVP (5 BAs) to production (65 BAs)

## Scope

### In Scope
- Core database schema design and implementation
- TimescaleDB hypertable configuration
- Continuous aggregates for dashboard performance
- Index strategy for optimal query performance
- Data migration and seeding scripts
- Performance benchmarking and validation

### Out of Scope
- Data ingestion logic (GRID-013)
- API layer implementation (GRID-015)
- Caching layer (GRID-014)
- UI integration (future specs)

## Technical Requirements

### Database Architecture

Based on GRID-007 analysis:
- **Storage per record**: 35 bytes (including indexes)
- **MVP data volume**: 13 MB for 6 months
- **Query performance target**: <5ms for typical queries
- **Partitioning strategy**: Time-based automatic partitioning

### Core Schema Design

#### 1. Balancing Authorities Table
```sql
CREATE TABLE balancing_authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL, -- "PJM", "CAISO", "MISO"
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL, -- "America/New_York"
    region VARCHAR(50), -- "Eastern", "Western", "Texas"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data for MVP
INSERT INTO balancing_authorities (code, name, timezone, region) VALUES
('PJM', 'PJM Interconnection', 'America/New_York', 'Eastern'),
('CAISO', 'California ISO', 'America/Los_Angeles', 'Western'),
('MISO', 'Midcontinent ISO', 'America/Chicago', 'Central'),
('ERCOT', 'Electric Reliability Council of Texas', 'America/Chicago', 'Texas'),
('SPP', 'Southwest Power Pool', 'America/Chicago', 'Central');
```

#### 2. Series Definition Table
```sql
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ba_id UUID REFERENCES balancing_authorities(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- "demand", "generation", "interchange", "co2"
    subtype VARCHAR(50), -- "coal", "gas", "solar", "wind", "nuclear", etc.
    units VARCHAR(20) NOT NULL, -- "MW", "MWh", "g/kWh"
    description TEXT,
    eia_series_id VARCHAR(100), -- Original EIA series identifier
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(ba_id, type, subtype)
);

-- Index for efficient lookups
CREATE INDEX idx_series_ba_type ON series(ba_id, type);
CREATE INDEX idx_series_active ON series(is_active) WHERE is_active = true;
```

#### 3. Time-Series Observations (Hypertable)
```sql
-- Main time-series data table
CREATE TABLE observations (
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    ts TIMESTAMPTZ NOT NULL,
    value NUMERIC(12,3) NOT NULL, -- Supports MW precision
    quality_flag VARCHAR(10) DEFAULT 'good', -- "good", "estimated", "missing"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (series_id, ts)
);

-- Convert to TimescaleDB hypertable
SELECT create_hypertable('observations', 'ts', chunk_time_interval => INTERVAL '1 day');

-- Optimize for common query patterns
CREATE INDEX idx_observations_ts_series ON observations(ts, series_id);
CREATE INDEX idx_observations_value ON observations(value) WHERE quality_flag = 'good';
```

### Continuous Aggregates for Performance

#### Hourly Aggregates (for dashboard queries)
```sql
CREATE MATERIALIZED VIEW hourly_aggregates
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', ts) AS hour,
    series_id,
    avg(value) AS avg_value,
    min(value) AS min_value,
    max(value) AS max_value,
    count(*) AS data_points,
    stddev(value) AS std_dev
FROM observations
WHERE quality_flag = 'good'
GROUP BY hour, series_id
WITH NO DATA;

-- Refresh policy for near real-time updates
SELECT add_continuous_aggregate_policy('hourly_aggregates',
    start_offset => INTERVAL '2 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');
```

#### Daily Aggregates (for baseline calculations)
```sql
CREATE MATERIALIZED VIEW daily_aggregates  
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 day', ts) AS day,
    series_id,
    avg(value) AS avg_value,
    min(value) AS min_value,
    max(value) AS max_value,
    sum(value) AS total_value,
    count(*) AS data_points
FROM observations
WHERE quality_flag = 'good'
GROUP BY day, series_id
WITH NO DATA;

-- Refresh policy for daily updates
SELECT add_continuous_aggregate_policy('daily_aggregates',
    start_offset => INTERVAL '1 week',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');
```

### Helper Views for Common Queries

#### Latest Values View
```sql
CREATE VIEW latest_observations AS
SELECT DISTINCT ON (series_id)
    series_id,
    ts,
    value,
    quality_flag
FROM observations
ORDER BY series_id, ts DESC;
```

#### BA Summary View
```sql
CREATE VIEW ba_summary AS
SELECT 
    ba.code,
    ba.name,
    ba.timezone,
    COUNT(s.id) AS series_count,
    MAX(lo.ts) AS latest_data_time
FROM balancing_authorities ba
LEFT JOIN series s ON ba.id = s.ba_id AND s.is_active = true
LEFT JOIN latest_observations lo ON s.id = lo.series_id
GROUP BY ba.id, ba.code, ba.name, ba.timezone;
```

## Implementation Tasks

### Phase 1: Core Schema Setup
- [ ] Create balancing_authorities table with MVP data
- [ ] Create series table with proper constraints
- [ ] Create observations table
- [ ] Convert observations to TimescaleDB hypertable
- [ ] Create necessary indexes

### Phase 2: Optimization Features
- [ ] Implement continuous aggregates (hourly, daily)
- [ ] Set up refresh policies
- [ ] Create helper views for common queries
- [ ] Configure compression policies (future optimization)

### Phase 3: Data Validation & Testing
- [ ] Insert test data for all 5 MVP BAs
- [ ] Validate hypertable partitioning working correctly
- [ ] Benchmark query performance against targets
- [ ] Test continuous aggregate refresh
- [ ] Validate data integrity constraints

### Phase 4: Migration & Deployment Scripts
- [ ] Create database migration scripts
- [ ] Create data seeding scripts
- [ ] Create rollback procedures
- [ ] Document schema and query patterns

## Success Criteria

### Functional Requirements
- [ ] All tables created with proper constraints
- [ ] Hypertable configured with 1-day chunks
- [ ] Continuous aggregates refreshing automatically
- [ ] Sample data inserted for all 5 MVP BAs
- [ ] All indexes created and optimized

### Performance Requirements
- [ ] Query performance <5ms for single BA, single day
- [ ] Query performance <50ms for single BA, 30 days
- [ ] Insert performance >1000 records/second
- [ ] Continuous aggregate refresh <30 seconds
- [ ] Storage efficiency: ~35 bytes per record

### Data Quality Requirements
- [ ] All foreign key constraints enforced
- [ ] Duplicate prevention working (series_id, ts unique)
- [ ] Data type validation working (numeric precision)
- [ ] Quality flags properly implemented

## Sample Queries for Testing

### Basic Data Retrieval
```sql
-- Get latest demand for PJM
SELECT ts, value 
FROM observations o
JOIN series s ON o.series_id = s.id
JOIN balancing_authorities ba ON s.ba_id = ba.id
WHERE ba.code = 'PJM' AND s.type = 'demand'
ORDER BY ts DESC 
LIMIT 24;
```

### Aggregated Analytics
```sql
-- Daily peak demand by BA (last 30 days)
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

### Performance Benchmark Queries
```sql
-- Complex multi-BA comparison (performance test)
SELECT 
    ba.code,
    DATE_TRUNC('hour', ts) as hour,
    AVG(value) as avg_demand
FROM observations o
JOIN series s ON o.series_id = s.id
JOIN balancing_authorities ba ON s.ba_id = ba.id
WHERE s.type = 'demand'
    AND ts >= NOW() - INTERVAL '7 days'
GROUP BY ba.code, hour
ORDER BY ba.code, hour;
```

## Dependencies

- **GRID-011**: ✅ Railway infrastructure with TimescaleDB
- **GRID-007**: ✅ Data volume analysis informing design decisions
- TimescaleDB extension enabled on PostgreSQL instance

## Performance Monitoring

### Key Metrics to Track
- **Query performance**: Average response times by query type
- **Storage growth**: Daily storage increase (target: 0.08 MB/day for 5 BAs)
- **Chunk health**: Hypertable chunk sizes and count
- **Continuous aggregate lag**: Refresh timing and delays

### Monitoring Queries
```sql
-- Check hypertable chunk information
SELECT * FROM timescaledb_information.chunks 
WHERE hypertable_name = 'observations';

-- Check continuous aggregate status
SELECT * FROM timescaledb_information.continuous_aggregates;

-- Storage usage by table
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';
```

## Future Optimizations

### Compression (when data volume increases)
```sql
-- Add compression policy for data older than 7 days
SELECT add_compression_policy('observations', INTERVAL '7 days');
```

### Data Retention (for cost management)
```sql
-- Add retention policy for data older than 5 years
SELECT add_retention_policy('observations', INTERVAL '5 years');
```

## Notes

This schema design is optimized for the MVP scale (5 BAs) but architected to scale efficiently to production (65 BAs). The continuous aggregates provide the foundation for fast dashboard queries, while the hypertable ensures efficient time-series operations.

Based on GRID-007 analysis, this schema will easily handle MVP requirements with room for 10x growth before requiring optimization.
