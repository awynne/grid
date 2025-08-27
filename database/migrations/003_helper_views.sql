-- GRID-012: TimescaleDB Schema Implementation
-- Migration: Helper views for common query patterns
-- Part 3: Create utility views for application queries

-- Latest Values View (for current status queries)
CREATE OR REPLACE VIEW latest_observations AS
SELECT DISTINCT ON (series_id)
    series_id,
    ts,
    value,
    quality_flag
FROM observations
ORDER BY series_id, ts DESC;

-- BA Summary View (for dashboard overview)
CREATE OR REPLACE VIEW ba_summary AS
SELECT 
    ba.code,
    ba.name,
    ba.timezone,
    ba.region,
    COUNT(s.id) AS series_count,
    MAX(lo.ts) AS latest_data_time,
    COUNT(CASE WHEN s.is_active = true THEN 1 END) AS active_series_count
FROM balancing_authorities ba
LEFT JOIN series s ON ba.id = s.ba_id
LEFT JOIN latest_observations lo ON s.id = lo.series_id
GROUP BY ba.id, ba.code, ba.name, ba.timezone, ba.region;

-- Series with Latest Data View (for data quality monitoring)
CREATE OR REPLACE VIEW series_status AS
SELECT 
    s.id,
    s.type,
    s.subtype,
    s.units,
    s.is_active,
    ba.code as ba_code,
    ba.name as ba_name,
    lo.ts as latest_timestamp,
    lo.value as latest_value,
    lo.quality_flag as latest_quality,
    EXTRACT(EPOCH FROM (NOW() - lo.ts))/3600 as hours_since_update
FROM series s
JOIN balancing_authorities ba ON s.ba_id = ba.id
LEFT JOIN latest_observations lo ON s.id = lo.series_id
WHERE s.is_active = true;

-- Data Quality Summary View
CREATE OR REPLACE VIEW data_quality_summary AS
SELECT 
    ba.code as ba_code,
    s.type,
    s.subtype,
    COUNT(*) as total_observations,
    COUNT(CASE WHEN o.quality_flag = 'good' THEN 1 END) as good_count,
    COUNT(CASE WHEN o.quality_flag = 'estimated' THEN 1 END) as estimated_count,
    COUNT(CASE WHEN o.quality_flag = 'missing' THEN 1 END) as missing_count,
    ROUND(
        COUNT(CASE WHEN o.quality_flag = 'good' THEN 1 END) * 100.0 / COUNT(*), 
        2
    ) as quality_percentage
FROM observations o
JOIN series s ON o.series_id = s.id
JOIN balancing_authorities ba ON s.ba_id = ba.id
WHERE o.ts >= NOW() - INTERVAL '7 days'
GROUP BY ba.code, s.type, s.subtype
ORDER BY ba.code, s.type, s.subtype;