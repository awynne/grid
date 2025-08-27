-- GRID-012: TimescaleDB Schema Implementation
-- Migration: Enable TimescaleDB extension and create hypertables
-- Part 1: Extension setup and hypertable conversion

-- Enable TimescaleDB extension (requires superuser privileges)
-- NOTE: This should be done by Railway/database admin, included for completeness
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert observations table to hypertable after Prisma migration
-- This will be run after `prisma migrate deploy`
SELECT create_hypertable(
    'observations', 
    'ts', 
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Add additional indexes for TimescaleDB optimization
-- (Prisma will create basic indexes)
CREATE INDEX IF NOT EXISTS idx_observations_ts_series 
ON observations(ts, series_id);

CREATE INDEX IF NOT EXISTS idx_observations_quality_value 
ON observations(value) WHERE quality_flag = 'good';

-- Create space-partitioning index for better performance with large datasets
-- CREATE INDEX IF NOT EXISTS idx_observations_series_ts 
-- ON observations(series_id, ts DESC) INCLUDE (value, quality_flag);