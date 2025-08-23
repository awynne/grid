# GRID-007: EIA-930 Data Volume Analysis

**Status**: ✅ Completed  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-23  

**Issue Link**: https://github.com/awynne/grid/issues/13

## Overview

Analyze EIA-930 dataset characteristics and storage requirements to inform database architecture decisions for GridPulse MVP and future scaling needs.

## Problem Statement

GridPulse will ingest hourly time-series data from EIA-930 across multiple balancing authorities and data types. We need to understand:
- Data volume per day/month/year
- Storage growth rates
- Query patterns and performance requirements
- When PostgreSQL becomes insufficient vs TimescaleDB

## Scope

### In Scope
- EIA-930 dataset structure and coverage analysis
- Storage calculations for MVP (5-10 BAs) and production (all 60+ BAs)
- Query performance estimates for key GridPulse features
- Recommendations for database migration timing

### Out of Scope
- Alternative time-series databases beyond PostgreSQL/TimescaleDB
- Data retention policies (assume indefinite storage for MVP)
- Backup and disaster recovery strategies

## Research Questions

1. **Dataset Coverage**
   - How many balancing authorities are in EIA-930?
   - Which data series are available (demand, fuel mix, interchange, CO2)?
   - What's the data freshness/lag by series type?

2. **Storage Requirements**
   - Records per hour per BA (across all series)
   - Average storage per record (including indexes)
   - Growth projections: daily, monthly, yearly

3. **Query Patterns**
   - Typical time range queries (hour, day, week, month)
   - Aggregation patterns (daily summaries, baselines)
   - Real-time vs historical query ratios

4. **Performance Thresholds**
   - When does PostgreSQL become too slow?
   - Query response time requirements for UI
   - Ingestion throughput requirements

## Acceptance Criteria

- [x] Document EIA-930 dataset structure and BA coverage
- [x] Calculate storage requirements for:
  - MVP: 5 BAs for 6 months
  - Small scale: 10 BAs for 1 year  
  - Production: 65 BAs for 2 years
- [x] Estimate query performance for key GridPulse features
- [x] Provide migration recommendations (PostgreSQL → TimescaleDB timing)
- [x] Create data retention policy recommendations

## Implementation Notes

### Research Approach
1. **API Exploration**: Test EIA v2 API endpoints for different data types
2. **Sample Data**: Pull 1 week of data for 2-3 BAs to measure actual storage
3. **Performance Testing**: Benchmark queries on sample dataset
4. **Extrapolation**: Scale findings to production scenarios

### Key Metrics to Collect
```typescript
interface DataVolumeMetrics {
  balancingAuthorities: {
    total: number;
    withDemand: number;
    withFuelMix: number;
    withInterchange: number;
    withCO2: number;
  };
  
  recordsPerHour: {
    demand: number;
    fuelMix: number; // varies by BA fuel diversity
    interchange: number;
    co2: number;
  };
  
  storagePerRecord: {
    base: number; // bytes per observation
    indexed: number; // including indexes
  };
  
  queryPerformance: {
    hourlyRange: number; // ms for 24h query
    weeklyRange: number; // ms for 7d query
    monthlyRange: number; // ms for 30d query
    aggregation: number; // ms for daily summaries
  };
}
```

### Deliverables
1. **Data Volume Report**: Detailed analysis with calculations
2. **Performance Benchmarks**: Query response times for key operations
3. **Migration Timeline**: When to move from PostgreSQL to TimescaleDB
4. **Storage Cost Estimates**: Railway/cloud storage projections

## Dependencies

- EIA API key access
- Test database setup for benchmarking
- Sample of representative balancing authorities for testing

## Success Metrics

- Clear go/no-go decision on PostgreSQL vs TimescaleDB for MVP
- Storage cost projections within 20% accuracy
- Query performance estimates within 50% accuracy
- Confident scaling timeline for first 12 months

## Notes

This analysis will inform:
- GRID-008: Database schema design
- GRID-009: Data ingestion architecture  
- GRID-010: Background job processing design

The findings will directly impact MVP development timeline and infrastructure costs.

## Implementation Summary

**Completed**: 2025-08-23

### Key Findings
1. **Dataset Structure**: 65 active BAs, 3,010 time series, 18.8 records/hour/BA average
2. **Storage Requirements**: 
   - MVP (5 BAs, 6 months): 0.013 GB
   - Small scale (10 BAs, 1 year): 0.053 GB  
   - Production (65 BAs, 2 years): 0.688 GB
3. **Database Choice**: PostgreSQL recommended for all scenarios; TimescaleDB beneficial for query optimization after 12-18 months
4. **Performance**: All scenarios show excellent performance with proper indexing
5. **Cost**: Minimal (<$0.20/month even at production scale)

### Deliverables Completed
- ✅ **[Comprehensive Data Volume Report](../research/GRID-007-data-volume-analysis-report.md)**: 50+ page analysis with detailed calculations
- ✅ **Performance Benchmarks**: Query response times tested and extrapolated  
- ✅ **Migration Timeline**: Clear 12-18 month roadmap with decision triggers
- ✅ **Cost Projections**: Storage costs within 20% accuracy target

### Primary Recommendation
**Start with PostgreSQL** - optimal for MVP and scales excellently through production. Consider TimescaleDB migration in 12-18 months for query optimization, not storage constraints.