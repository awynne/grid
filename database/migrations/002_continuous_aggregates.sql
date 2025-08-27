-- GRID-012: TimescaleDB Schema Implementation
-- Migration: Continuous aggregates for dashboard performance
-- Part 2: Create materialized views and refresh policies

-- Hourly Aggregates (for dashboard queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_aggregates
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

-- Refresh policy for hourly aggregates (near real-time updates)
SELECT add_continuous_aggregate_policy(
    'hourly_aggregates',
    start_offset => INTERVAL '2 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour'
);

-- Daily Aggregates (for baseline calculations and analytics)
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_aggregates  
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

-- Refresh policy for daily aggregates
SELECT add_continuous_aggregate_policy(
    'daily_aggregates',
    start_offset => INTERVAL '1 week',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day'
);